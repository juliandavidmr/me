import type { DailyPuzzle, FinishedAttempt } from '../../domain/types';

export type PuzzleComponentProps = {
  puzzle: DailyPuzzle;
  onFinishAttempt: (attempt: FinishedAttempt) => void;
};
