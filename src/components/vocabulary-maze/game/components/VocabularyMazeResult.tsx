import { useMemo } from 'react';

import type { DailyPuzzle, FinishedAttempt } from '../../domain/types';
import { useDictionaryMeanings } from '../../hooks/useDictionaryMeanings';
import { useReminder } from '../../hooks/useReminder';
import { useSpeech } from '../../hooks/useSpeech';
import { ResultPanel } from '../../ui/ResultPanel';

type VocabularyMazeResultProps = {
  attempt: FinishedAttempt;
  puzzle: DailyPuzzle;
};

export const VocabularyMazeResult = ({
  attempt,
  puzzle,
}: VocabularyMazeResultProps) => {
  const { speak } = useSpeech(puzzle.word);
  const { enableReminder, state: reminderState } = useReminder();
  const exitWords = useMemo(
    () => puzzle.exits.map((exit) => exit.word),
    [puzzle.exits],
  );
  const dictionary = useDictionaryMeanings(exitWords);
  const correctExit =
    puzzle.exits.find((exit) => exit.isCorrect) ?? puzzle.exits[0];
  const meanings =
    dictionary.status === 'ready' || dictionary.status === 'error'
      ? dictionary.meanings
      : {};

  if (!correctExit) {
    return null;
  }

  return (
    <section className="mx-auto grid w-full max-w-120 gap-7 py-8">
      <header className="grid gap-4">
        <div>
          <p className="text-3xs font-semibold uppercase tracking-label text-muted dark:text-muted-dark">
            Daily maze · UTC {puzzle.date}
          </p>
          <h1 className="mt-2 text-prose-h3-mobile font-medium tracking-title">
            Vocabulary Maze
          </h1>
        </div>
      </header>

      <ResultPanel
        attempt={attempt}
        correctExit={correctExit}
        meaning={meanings[correctExit.word]}
        path={[puzzle.word, ...puzzle.correctPath, correctExit.word]}
        reminderState={reminderState}
        word={puzzle.word}
        onEnableReminder={enableReminder}
        onSpeak={speak}
      />

      {dictionary.status === 'error' && (
        <p className="text-xs text-muted dark:text-muted-dark">
          The extended definition is not available right now; the result is
          using local catalog data.
        </p>
      )}
    </section>
  );
};
