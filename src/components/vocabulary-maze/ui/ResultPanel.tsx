import { FALLBACK_DEFINITION_INTRO } from '../domain/constants';
import type {
  DictionaryMeaning,
  FinishedAttempt,
  PuzzleExit,
} from '../domain/types';
import { Timer } from './Timer';

type ResultPanelProps = {
  attempt: FinishedAttempt;
  correctExit: PuzzleExit;
  meaning?: DictionaryMeaning;
  path: string[];
  reminderState: string;
  word: string;
  onEnableReminder: () => void;
  onSpeak: () => void;
};

export const ResultPanel = ({
  attempt,
  correctExit,
  meaning,
  onEnableReminder,
  onSpeak,
  path,
  reminderState,
  word,
}: ResultPanelProps) => (
  <section className="grid gap-6 border-y border-line py-6 dark:border-line-dark">
    <div>
      <p className="text-3xs font-semibold uppercase tracking-label text-muted dark:text-muted-dark">
        Resultado
      </p>
      <h2 className="mt-2 text-prose-h3-mobile font-medium tracking-title">
        {attempt.isCorrect ? 'Salida correcta' : 'Salida incorrecta'}
      </h2>
      <p className="mt-2 text-xs text-muted dark:text-muted-dark">
        Tiempo: <Timer seconds={attempt.elapsedSeconds} />
      </p>
    </div>

    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-4">
        <strong className="text-card-title font-medium tracking-card-title">
          {word}
        </strong>
        <button
          className="size-11 border border-line text-sm transition-colors hover:border-accent dark:border-line-dark"
          type="button"
          onClick={onSpeak}
          aria-label={`Listen to ${word}`}
          title={`Listen to ${word}`}
        >
          ▶
        </button>
      </div>
      <p className="text-base leading-copy">
        {meaning?.definition ?? correctExit.fallbackMeaning}
      </p>
      {!meaning && (
        <p className="text-xs text-muted dark:text-muted-dark">
          {FALLBACK_DEFINITION_INTRO}
        </p>
      )}
      <p className="text-xs text-muted dark:text-muted-dark">
        Synonyms:{' '}
        {(meaning?.synonyms.length
          ? meaning.synonyms
          : correctExit.synonyms
        ).join(', ') || 'catalog neighbors'}
      </p>
    </div>

    <div>
      <p className="text-3xs font-semibold uppercase tracking-label text-muted dark:text-muted-dark">
        Ruta correcta
      </p>
      <p className="mt-2 text-xs leading-copy text-muted dark:text-muted-dark">
        {path.join(' -> ')}
      </p>
    </div>

    <button
      className="min-h-12 border border-ink bg-ink px-5 text-3xs font-semibold uppercase tracking-nav text-canvas transition-colors hover:bg-accent hover:text-ink dark:border-ink-dark dark:bg-ink-dark dark:text-canvas-dark"
      type="button"
      onClick={onEnableReminder}
    >
      {reminderState === 'enabled'
        ? 'Recordatorio activo'
        : 'Recordarme mañana'}
    </button>
  </section>
);
