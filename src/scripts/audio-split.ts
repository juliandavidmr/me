/* eslint-disable no-await-in-loop, no-bitwise, no-console, no-restricted-syntax */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

type AudioSegmentItem = {
  blob: Blob;
  end: number;
  name: string;
  start: number;
  url: string;
};

type DecodedAudio = {
  buffer: AudioBuffer;
  context: AudioContext;
};

type SilenceRange = {
  end: number;
  start: number;
};

type SegmentRange = {
  end: number;
  start: number;
};

type ZipChunk = ArrayBuffer;

const MAX_DURATION_SECONDS = 40 * 60;
const DEFAULT_SILENCE_MS = 450;
const SEEK_STEP_MS = 10;
const FFMPEG_CORE_CDN_BASE = 'https://unpkg.com/@ffmpeg/core@0.12.9/dist/esm';
const MIN_CUT_OFFSET_MS = 60_000;
const WAV_FADE_SECONDS = 0.02;
const WAV_SAMPLE_RATE = '44100';
const WAV_CHANNELS = '2';

const requiredElement = <TElement extends Element>(
  selector: string,
): TElement => {
  const element = document.querySelector<TElement>(selector);
  if (!element) {
    throw new Error(`Missing audio split element: ${selector}`);
  }
  return element;
};

const form = requiredElement<HTMLFormElement>('#split-form');
const fileInput = requiredElement<HTMLInputElement>('#audio-file');
const fileLabel = requiredElement<HTMLElement>('#file-label');
const segmentMinutesInput =
  requiredElement<HTMLInputElement>('#segment-minutes');
const silenceInput = requiredElement<HTMLInputElement>('#silence-enabled');
const splitButton = requiredElement<HTMLButtonElement>('#split-button');
const splitHint = requiredElement<HTMLElement>('#split-hint');
const statusLabel = requiredElement<HTMLElement>('#status-label');
const progressValue = requiredElement<HTMLElement>('#progress-value');
const progressBar = requiredElement<HTMLElement>('#progress-bar');
const durationStat = requiredElement<HTMLElement>('#duration-stat');
const segmentsStat = requiredElement<HTMLElement>('#segments-stat');
const sizeStat = requiredElement<HTMLElement>('#size-stat');
const segmentsList = requiredElement<HTMLOListElement>('#segments-list');
const downloadAllButton = requiredElement<HTMLButtonElement>('#download-all');

let selectedFile: File | undefined;
let generatedSegments: AudioSegmentItem[] = [];
let ffmpeg: FFmpeg | undefined;
let ffmpegLoadPromise: Promise<FFmpeg> | undefined;
let lastFfmpegLog = '';

const formatDuration = (seconds: number): string => {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
};

const formatSize = (bytes: number): string => {
  if (!bytes) return '--';
  const units = ['B', 'KB', 'MB', 'GB'] as const;
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const unit = units[index] ?? 'B';
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${unit}`;
};

const getSegmentMinutes = (): number =>
  Math.max(1, Math.min(40, Number(segmentMinutesInput.value) || 5));

const updateSplitHint = (): void => {
  const minutes = getSegmentMinutes();
  const unit = minutes === 1 ? 'minuto' : 'minutos';
  const part = minutes === 1 ? 'parte' : 'partes';
  splitHint.textContent = `Se dividira el audio en ${part} de ${minutes} ${unit}.`;
};

const setProgress = (value: number, label?: string): void => {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  progressBar.style.width = `${safeValue}%`;
  progressValue.textContent = `${safeValue}%`;
  if (label) statusLabel.textContent = label;
};

const normalizeError = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

const buildErrorMessage = (fallback: string, error: unknown): string => {
  const detail = normalizeError(error);
  const ffmpegDetail = lastFfmpegLog
    ? ` Ultimo log de FFmpeg: ${lastFfmpegLog}`
    : '';
  return detail && detail !== 'undefined'
    ? `${fallback}: ${detail}.${ffmpegDetail}`
    : `${fallback}.${ffmpegDetail}`;
};

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });

const clearSegments = (): void => {
  generatedSegments.forEach((segment: AudioSegmentItem) => {
    URL.revokeObjectURL(segment.url);
  });
  generatedSegments = [];
  segmentsList.replaceChildren();
  segmentsStat.textContent = '0';
  downloadAllButton.disabled = true;
};

const toExactArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
  const exact = new Uint8Array(bytes.byteLength);
  exact.set(bytes);
  return exact.buffer;
};

const getFileExtension = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : 'audio';
};

const getAudioMetadataDuration = (file: File): Promise<number> =>
  new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    const url = URL.createObjectURL(file);
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Metadata no disponible.'));
    };
    audio.src = url;
  });

const loadFfmpeg = async (): Promise<FFmpeg> => {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
    ffmpeg.on('log', ({ message }: { message: string }) => {
      if (message) {
        lastFfmpegLog = message;
        console.debug('[audio-split ffmpeg]', message);
      }
    });
    ffmpeg.on('progress', ({ progress }: { progress: number }) => {
      if (progress > 0) {
        setProgress(20 + progress * 26, 'Convirtiendo con FFmpeg');
      }
    });
  }

  if (ffmpeg.loaded) {
    return ffmpeg;
  }

  if (!ffmpegLoadPromise) {
    setProgress(18, 'Cargando FFmpeg');
    const runner = ffmpeg;
    ffmpegLoadPromise = (async (): Promise<FFmpeg> => {
      try {
        const coreURL = await toBlobURL(
          `${FFMPEG_CORE_CDN_BASE}/ffmpeg-core.js`,
          'text/javascript',
        );
        const wasmURL = await toBlobURL(
          `${FFMPEG_CORE_CDN_BASE}/ffmpeg-core.wasm`,
          'application/wasm',
        );

        setProgress(22, 'Inicializando FFmpeg');
        await runner.load({ coreURL, wasmURL });
        return runner;
      } catch (error) {
        runner.terminate();
        if (ffmpeg === runner) ffmpeg = undefined;
        throw new Error(
          buildErrorMessage('FFmpeg no pudo inicializarse', error),
        );
      } finally {
        ffmpegLoadPromise = undefined;
      }
    })();
  }

  return ffmpegLoadPromise;
};

const transcodeToWav = async (file: File): Promise<ArrayBuffer> => {
  const runner = await loadFfmpeg();
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const inputName = `input-${runId}.${getFileExtension(file)}`;
  const outputName = `decoded-${runId}.wav`;

  try {
    setProgress(46, 'Preparando FFmpeg');
    await runner.writeFile(inputName, await fetchFile(file));
  } catch (error) {
    throw new Error(buildErrorMessage('FFmpeg no pudo leer el archivo', error));
  }

  let exitCode: number;
  try {
    exitCode = await runner.exec([
      '-i',
      inputName,
      '-vn',
      '-map',
      '0:a:0',
      '-acodec',
      'pcm_s16le',
      '-ar',
      WAV_SAMPLE_RATE,
      '-ac',
      WAV_CHANNELS,
      '-f',
      'wav',
      outputName,
    ]);
  } catch (error) {
    throw new Error(
      buildErrorMessage('FFmpeg fallo convirtiendo el audio', error),
    );
  }

  if (exitCode !== 0) {
    throw new Error(
      buildErrorMessage(`FFmpeg termino con codigo ${exitCode}`, lastFfmpegLog),
    );
  }

  let data: Awaited<ReturnType<FFmpeg['readFile']>>;
  try {
    data = await runner.readFile(outputName);
  } catch (error) {
    throw new Error(buildErrorMessage('FFmpeg no genero el WAV', error));
  } finally {
    await runner.deleteFile(inputName).catch(() => undefined);
    await runner.deleteFile(outputName).catch(() => undefined);
  }

  if (!(data instanceof Uint8Array)) {
    throw new Error('FFmpeg devolvio una salida WAV no binaria.');
  }

  return toExactArrayBuffer(data);
};

const decodeAudioFile = async (file: File): Promise<DecodedAudio> => {
  setProgress(8, 'Cargando archivo');
  await nextFrame();
  const arrayBuffer = await file.arrayBuffer();
  let context = new AudioContext();

  try {
    setProgress(18, 'Decodificando audio');
    await nextFrame();
    const buffer = await context.decodeAudioData(arrayBuffer);
    return { buffer, context };
  } catch {
    await context.close();
    lastFfmpegLog = '';
    setProgress(18, 'Reintentando con FFmpeg');
    await nextFrame();
    const wavBuffer = await transcodeToWav(file);
    context = new AudioContext();
    setProgress(48, 'Decodificando WAV');
    await nextFrame();
    try {
      const buffer = await context.decodeAudioData(wavBuffer);
      return { buffer, context };
    } catch (error) {
      await context.close();
      throw new Error(
        buildErrorMessage('El WAV convertido no pudo decodificarse', error),
      );
    }
  }
};

const getMonoSample = (buffer: AudioBuffer, index: number): number => {
  let sum = 0;
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    sum += buffer.getChannelData(channel)[index] ?? 0;
  }
  return sum / buffer.numberOfChannels;
};

const getDbfs = (buffer: AudioBuffer): number => {
  let sum = 0;
  let count = 0;
  const step = Math.max(1, Math.floor(buffer.sampleRate / 1000));
  for (let index = 0; index < buffer.length; index += step) {
    const sample = getMonoSample(buffer, index);
    sum += sample * sample;
    count += 1;
  }
  return 20 * Math.log10(Math.sqrt(sum / Math.max(1, count)) || 0.000001);
};

const detectSilences = async (buffer: AudioBuffer): Promise<SilenceRange[]> => {
  const threshold = getDbfs(buffer) - 16;
  const windowSamples = Math.max(
    1,
    Math.floor((buffer.sampleRate * SEEK_STEP_MS) / 1000),
  );
  const minSilentWindows = Math.ceil(DEFAULT_SILENCE_MS / SEEK_STEP_MS);
  const silences: SilenceRange[] = [];
  let silentStart: number | null = null;
  let silentCount = 0;

  for (let start = 0; start < buffer.length; start += windowSamples) {
    let sum = 0;
    const end = Math.min(buffer.length, start + windowSamples);
    for (let index = start; index < end; index += 1) {
      const sample = getMonoSample(buffer, index);
      sum += sample * sample;
    }
    const rms = Math.sqrt(sum / Math.max(1, end - start));
    const db = 20 * Math.log10(rms || 0.000001);

    if (db <= threshold) {
      if (silentStart === null) silentStart = start;
      silentCount += 1;
    } else {
      if (silentStart !== null && silentCount >= minSilentWindows) {
        silences.push({
          start: (silentStart / buffer.sampleRate) * 1000,
          end: (start / buffer.sampleRate) * 1000,
        });
      }
      silentStart = null;
      silentCount = 0;
    }

    if (start % (windowSamples * 250) === 0) {
      setProgress(28 + (start / buffer.length) * 34, 'Analizando silencios');
      await nextFrame();
    }
  }

  if (silentStart !== null && silentCount >= minSilentWindows) {
    silences.push({
      start: (silentStart / buffer.sampleRate) * 1000,
      end: (buffer.length / buffer.sampleRate) * 1000,
    });
  }

  return silences;
};

const bestCut = (
  silences: SilenceRange[],
  start: number,
  target: number,
  maxMs: number,
): number => {
  const candidates = silences.filter((silence: SilenceRange) => {
    const midpoint = (silence.start + silence.end) / 2;
    return start + MIN_CUT_OFFSET_MS < midpoint && midpoint <= start + maxMs;
  });
  if (!candidates.length) return Math.min(start + maxMs, target);

  const ideal = Math.min(start + maxMs, target);
  const firstCandidate = candidates[0];
  if (!firstCandidate) return Math.min(start + maxMs, target);

  const best = candidates.reduce(
    (winner: SilenceRange, silence: SilenceRange) => {
      const midpoint = (silence.start + silence.end) / 2;
      const winnerMidpoint = (winner.start + winner.end) / 2;
      return Math.abs(midpoint - ideal) < Math.abs(winnerMidpoint - ideal)
        ? silence
        : winner;
    },
    firstCandidate,
  );
  return Math.round((best.start + best.end) / 2);
};

const buildRanges = (
  durationMs: number,
  segmentMs: number,
  silences: SilenceRange[],
): SegmentRange[] => {
  const ranges: SegmentRange[] = [];
  let start = 0;
  while (start < durationMs - 1) {
    const remaining = durationMs - start;
    let end: number;
    if (remaining <= segmentMs) {
      end = durationMs;
    } else if (silences.length) {
      end = bestCut(silences, start, durationMs, segmentMs);
    } else {
      end = Math.min(start + segmentMs, durationMs);
    }
    if (end <= start) break;
    ranges.push({ start, end });
    start = end;
  }
  return ranges;
};

const writeString = (view: DataView, offset: number, text: string): void => {
  for (let index = 0; index < text.length; index += 1) {
    view.setUint8(offset + index, text.charCodeAt(index));
  }
};

const audioBufferToWav = (
  buffer: AudioBuffer,
  startMs: number,
  endMs: number,
): Blob => {
  const startSample = Math.floor((startMs / 1000) * buffer.sampleRate);
  const endSample = Math.min(
    buffer.length,
    Math.floor((endMs / 1000) * buffer.sampleRate),
  );
  const channels = buffer.numberOfChannels;
  const samples = Math.max(0, endSample - startSample);
  const bytesPerSample = 2;
  const blockAlign = channels * bytesPerSample;
  const dataSize = samples * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);
  let offset = 0;

  writeString(view, offset, 'RIFF');
  offset += 4;
  view.setUint32(offset, 36 + dataSize, true);
  offset += 4;
  writeString(view, offset, 'WAVE');
  offset += 4;
  writeString(view, offset, 'fmt ');
  offset += 4;
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, channels, true);
  offset += 2;
  view.setUint32(offset, buffer.sampleRate, true);
  offset += 4;
  view.setUint32(offset, buffer.sampleRate * blockAlign, true);
  offset += 4;
  view.setUint16(offset, blockAlign, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  writeString(view, offset, 'data');
  offset += 4;
  view.setUint32(offset, dataSize, true);
  offset += 4;

  for (
    let sampleIndex = startSample;
    sampleIndex < endSample;
    sampleIndex += 1
  ) {
    const fadeIn = Math.min(
      1,
      (sampleIndex - startSample) /
        Math.max(1, buffer.sampleRate * WAV_FADE_SECONDS),
    );
    const fadeOut = Math.min(
      1,
      (endSample - sampleIndex) /
        Math.max(1, buffer.sampleRate * WAV_FADE_SECONDS),
    );
    const fade = Math.min(fadeIn, fadeOut);
    for (let channel = 0; channel < channels; channel += 1) {
      const data = buffer.getChannelData(channel);
      const sample = Math.max(-1, Math.min(1, (data[sampleIndex] ?? 0) * fade));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true,
      );
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
};

const crcTable: number[] = Array.from({ length: 256 }, (_, index: number) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

const crc32 = (bytes: Uint8Array): number => {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) {
    crc = (crcTable[(crc ^ bytes[index]!) & 0xff] ?? 0) ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const createZip = async (segments: AudioSegmentItem[]): Promise<Blob> => {
  const encoder = new TextEncoder();
  const chunks: ZipChunk[] = [];
  const central: ZipChunk[] = [];
  let offset = 0;

  const push = (part: ZipChunk): void => {
    chunks.push(part);
    offset += part.byteLength;
  };

  const writeHeader = (size: number): DataView =>
    new DataView(new ArrayBuffer(size));

  for (const segment of segments) {
    const bytes = new Uint8Array(await segment.blob.arrayBuffer());
    const nameBytes = encoder.encode(segment.name);
    const crc = crc32(bytes);
    const localOffset = offset;
    const local = writeHeader(30);
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(8, 0, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, bytes.length, true);
    local.setUint32(22, bytes.length, true);
    local.setUint16(26, nameBytes.length, true);
    push(local.buffer as ArrayBuffer);
    push(toExactArrayBuffer(nameBytes));
    push(toExactArrayBuffer(bytes));

    const centralHeader = writeHeader(46);
    centralHeader.setUint32(0, 0x02014b50, true);
    centralHeader.setUint16(4, 20, true);
    centralHeader.setUint16(6, 20, true);
    centralHeader.setUint16(10, 0, true);
    centralHeader.setUint32(16, crc, true);
    centralHeader.setUint32(20, bytes.length, true);
    centralHeader.setUint32(24, bytes.length, true);
    centralHeader.setUint16(28, nameBytes.length, true);
    centralHeader.setUint32(42, localOffset, true);
    central.push(
      centralHeader.buffer as ArrayBuffer,
      toExactArrayBuffer(nameBytes),
    );
  }

  const centralOffset = offset;
  central.forEach(push);
  const centralSize = offset - centralOffset;
  const end = writeHeader(22);
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, segments.length, true);
  end.setUint16(10, segments.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, centralOffset, true);
  push(end.buffer as ArrayBuffer);

  return new Blob(chunks, { type: 'application/zip' });
};

const renderSegments = (segments: AudioSegmentItem[]): void => {
  segmentsList.replaceChildren();
  const fragment = document.createDocumentFragment();

  segments.forEach((segment: AudioSegmentItem, index: number) => {
    const item = document.createElement('li');
    item.className =
      'grid grid-cols-[1fr_auto] items-center gap-5 border-b border-line py-4 dark:border-line-dark max-sm:grid-cols-1';

    const copy = document.createElement('div');
    const name = document.createElement('strong');
    name.className = 'block text-base font-medium';
    name.textContent = `Parte ${String(index + 1).padStart(3, '0')}`;
    const meta = document.createElement('span');
    meta.className =
      'mt-1 block text-3xs uppercase tracking-label text-muted dark:text-muted-dark';
    meta.textContent = `${formatDuration(segment.start / 1000)} - ${formatDuration(
      segment.end / 1000,
    )} · ${formatSize(segment.blob.size)}`;
    copy.append(name, meta);

    const player = document.createElement('audio');
    player.className = 'col-span-2 mt-1 w-full max-sm:col-span-1';
    player.controls = true;
    player.preload = 'metadata';
    player.src = segment.url;

    const link = document.createElement('a');
    link.className =
      'justify-self-end border border-line px-4 py-2 text-3xs font-semibold uppercase tracking-nav no-underline transition-colors hover:border-accent hover:text-accent dark:border-line-dark max-sm:justify-self-start';
    link.href = segment.url;
    link.download = segment.name;
    link.textContent = 'Descargar';

    item.append(copy, link, player);
    fragment.append(item);
  });

  segmentsList.append(fragment);
  segmentsStat.textContent = String(segments.length);
  downloadAllButton.disabled = segments.length === 0;
};

fileInput.addEventListener('change', async (): Promise<void> => {
  clearSegments();
  selectedFile = fileInput.files?.[0];
  if (!selectedFile) {
    splitButton.disabled = true;
    fileLabel.textContent = 'MP3, M4A, WAV, AAC u OGG';
    return;
  }

  fileLabel.textContent = selectedFile.name;
  sizeStat.textContent = formatSize(selectedFile.size);
  setProgress(0, 'Leyendo metadata');

  try {
    const duration = await getAudioMetadataDuration(selectedFile);
    durationStat.textContent = formatDuration(duration);
    if (duration > MAX_DURATION_SECONDS) {
      splitButton.disabled = true;
      setProgress(0, 'El audio supera 40 minutos');
      return;
    }
    setProgress(0, 'Listo para procesar');
  } catch {
    durationStat.textContent = '--';
    setProgress(0, 'Listo para decodificar');
  }

  splitButton.disabled = false;
});

segmentMinutesInput.addEventListener('input', updateSplitHint);
updateSplitHint();

form.addEventListener('submit', async (event: SubmitEvent): Promise<void> => {
  event.preventDefault();
  if (!selectedFile) return;

  clearSegments();
  splitButton.disabled = true;
  downloadAllButton.disabled = true;
  let context: AudioContext | undefined;

  try {
    const segmentMinutes = getSegmentMinutes();
    segmentMinutesInput.value = String(segmentMinutes);
    updateSplitHint();

    const decoded = await decodeAudioFile(selectedFile);
    context = decoded.context;
    const audioBuffer = decoded.buffer;
    durationStat.textContent = formatDuration(audioBuffer.duration);

    if (audioBuffer.duration > MAX_DURATION_SECONDS) {
      throw new Error('El audio supera 40 minutos');
    }

    const silences = silenceInput.checked
      ? await detectSilences(audioBuffer)
      : [];
    if (!silenceInput.checked) setProgress(58, 'Preparando cortes');

    const ranges = buildRanges(
      audioBuffer.duration * 1000,
      segmentMinutes * 60 * 1000,
      silences,
    );
    const baseName =
      selectedFile.name.replace(/\.[^.]+$/, '').replace(/[^\w.-]+/g, '_') ||
      'audio';
    const nextSegments: AudioSegmentItem[] = [];

    for (let index = 0; index < ranges.length; index += 1) {
      const range = ranges[index];
      if (!range) break;
      setProgress(
        62 + ((index + 1) / ranges.length) * 30,
        `Generando parte ${index + 1}`,
      );
      await nextFrame();
      const blob = audioBufferToWav(audioBuffer, range.start, range.end);
      const name = `${baseName}_part_${String(index + 1).padStart(3, '0')}.wav`;
      nextSegments.push({
        ...range,
        blob,
        name,
        url: URL.createObjectURL(blob),
      });
    }

    generatedSegments = nextSegments;
    renderSegments(generatedSegments);
    setProgress(100, 'Segmentos listos');
  } catch (error) {
    console.error('[audio-split]', error);
    const message = buildErrorMessage(
      'No pude decodificar este audio. Prueba con M4A/AAC, MP3, WAV u OGG',
      error,
    );
    setProgress(0, message);
  } finally {
    if (context) await context.close();
    splitButton.disabled = !selectedFile;
  }
});

downloadAllButton.addEventListener('click', async (): Promise<void> => {
  if (!generatedSegments.length || !selectedFile) return;
  downloadAllButton.disabled = true;
  setProgress(96, 'Comprimiendo ZIP');
  await nextFrame();
  const zip = await createZip(generatedSegments);
  const url = URL.createObjectURL(zip);
  const anchor = document.createElement('a');
  const baseName =
    selectedFile.name.replace(/\.[^.]+$/, '').replace(/[^\w.-]+/g, '_') ||
    'audio';
  anchor.href = url;
  anchor.download = `${baseName}_split.zip`;
  anchor.click();
  URL.revokeObjectURL(url);
  setProgress(100, 'ZIP descargado');
  downloadAllButton.disabled = false;
});
