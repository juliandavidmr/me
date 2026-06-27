import { VocabularyMazePuzzle } from './game/components/VocabularyMazePuzzle';
import { withServerPuzzle } from './game/hoc/withServerPuzzle';

export const VocabularyMazeGame = withServerPuzzle(VocabularyMazePuzzle);
