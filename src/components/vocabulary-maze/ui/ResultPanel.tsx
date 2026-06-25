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
}: ResultPanelProps) => {
  const resultIcon = attempt.isCorrect ? '✓' : '×';

  return (
    <section className="grid gap-6 border-y border-line py-6 dark:border-line-dark">
      <div>
        <p className="text-3xs font-semibold uppercase tracking-label text-muted dark:text-muted-dark">
          Result
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span
            className={
              attempt.isCorrect
                ? 'grid size-8 place-items-center rounded-full border border-emerald-400 bg-emerald-400/15 text-sm font-bold text-emerald-400'
                : 'grid size-8 place-items-center rounded-full border border-red-400 bg-red-400/10 text-sm font-bold text-red-400'
            }
            aria-hidden="true"
          >
            {resultIcon}
          </span>
          <h2 className="text-prose-h3-mobile font-medium tracking-title">
            {attempt.isCorrect ? 'Correct exit' : 'Wrong exit'}
          </h2>
        </div>
        <p className="mt-2 text-xs text-muted dark:text-muted-dark">
          Time: <Timer seconds={attempt.elapsedSeconds} />
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
          Correct path
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
          ? 'Reminder enabled'
          : 'Remind me tomorrow'}
      </button>
    </section>
  );
};
