export type PartOfSpeech = 'adjective' | 'noun' | 'verb';

export type CatalogRelation = 'close' | 'contrast';

export type CatalogPair = {
  source: string;
  target: string;
  partOfSpeech: PartOfSpeech;
  relation: CatalogRelation;
};

export type CatalogEntry = {
  word: string;
  partOfSpeech: PartOfSpeech;
  close: string[];
  contrast: string[];
  neighbors: string[];
  index: number;
};

export type MazeNodeType = 'entry' | 'path' | 'deadEnd' | 'exit';

export type MazeNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  type: MazeNodeType;
  exitId?: string;
};

export type MazeEdge = {
  from: string;
  to: string;
};

export type PuzzleExit = {
  id: string;
  word: string;
  isCorrect: boolean;
  fallbackMeaning: string;
  synonyms: string[];
};

export type DailyPuzzle = {
  date: string;
  word: string;
  partOfSpeech: PartOfSpeech;
  correctPath: string[];
  exits: PuzzleExit[];
  maze: {
    nodes: MazeNode[];
    edges: MazeEdge[];
  };
};

export type DictionaryMeaning = {
  definition: string;
  example?: string;
  synonyms: string[];
};

export type DictionaryState =
  | { status: 'idle' | 'loading' }
  | { status: 'ready'; meanings: Record<string, DictionaryMeaning> }
  | { status: 'error'; meanings: Record<string, DictionaryMeaning> };

export type FinishedAttempt = {
  date: string;
  selectedExitId: string;
  selectedExitWord: string;
  isCorrect: boolean;
  elapsedSeconds: number;
  finishedAt: string;
};
