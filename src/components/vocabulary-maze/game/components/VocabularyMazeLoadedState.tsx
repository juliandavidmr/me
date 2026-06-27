import type { ComponentType } from 'react';

import type { DailyPuzzle } from '../../domain/types';
import { useStoredAttempt } from '../../hooks/useStoredAttempt';
import type { PuzzleComponentProps } from '../types/PuzzleComponentProps';
import { VocabularyMazeResult } from './VocabularyMazeResult';

type VocabularyMazeLoadedStateProps = {
  PuzzleComponent: ComponentType<PuzzleComponentProps>;
  puzzle: DailyPuzzle;
};

export const VocabularyMazeLoadedState = ({
  PuzzleComponent,
  puzzle,
}: VocabularyMazeLoadedStateProps) => {
  const { attempt, saveAttempt } = useStoredAttempt(puzzle.date);

  if (attempt) {
    return <VocabularyMazeResult attempt={attempt} puzzle={puzzle} />;
  }

  return <PuzzleComponent onFinishAttempt={saveAttempt} puzzle={puzzle} />;
};
