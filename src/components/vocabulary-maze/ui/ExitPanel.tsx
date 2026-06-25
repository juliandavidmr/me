import type { DictionaryMeaning, PuzzleExit } from '../domain/types';

type ExitPanelProps = {
  exit: PuzzleExit;
  meaning?: DictionaryMeaning;
  onBack: () => void;
  onConfirm: () => void;
};

export const ExitPanel = ({
  exit,
  meaning,
  onBack,
  onConfirm,
}: ExitPanelProps) => {
  const synonyms = meaning?.synonyms.length
    ? meaning.synonyms
    : exit.synonyms.slice(0, 4);

  return (
    <aside className="border border-line bg-canvas p-5 dark:border-line-dark dark:bg-canvas-dark">
      <p className="text-3xs font-semibold uppercase tracking-label text-muted dark:text-muted-dark">
        {exit.word}
      </p>
      <p className="mt-3 text-base leading-copy">
        {meaning?.definition ?? exit.fallbackMeaning}
      </p>
      {synonyms.length > 0 && (
        <p className="mt-4 text-xs text-muted dark:text-muted-dark">
          Synonyms: {synonyms.join(', ')}
        </p>
      )}
      {meaning?.example && (
        <p className="mt-3 border-l border-accent pl-3 text-xs text-muted dark:text-muted-dark">
          {meaning.example}
        </p>
      )}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          className="border border-line px-3 py-2 text-3xs font-semibold uppercase tracking-nav transition-colors hover:border-accent dark:border-line-dark"
          type="button"
          onClick={onBack}
        >
          Volver
        </button>
        <button
          className="border border-ink bg-ink px-3 py-2 text-3xs font-semibold uppercase tracking-nav text-canvas transition-colors hover:bg-accent hover:text-ink dark:border-ink-dark dark:bg-ink-dark dark:text-canvas-dark"
          type="button"
          onClick={onConfirm}
        >
          Elegir salida
        </button>
      </div>
    </aside>
  );
};
