import { catalog, getEntry } from './catalog';
import { CORRECT_PATH_LENGTH, MAX_EXITS, MIN_EXITS } from './constants';
import { createSeededRandom, pickOne, shuffle } from './random';
import type { CatalogEntry, DailyPuzzle, MazeNode } from './types';

const uniqueWords = (words: string[]) =>
  words.filter((word, index, all) => word && all.indexOf(word) === index);

const getWeightedNeighbors = (entry: CatalogEntry) =>
  uniqueWords([...entry.close, ...entry.contrast, ...entry.neighbors]);

const walkPath = (entry: CatalogEntry, random: () => number) => {
  const path: string[] = [];
  let cursor = entry;

  while (path.length < CORRECT_PATH_LENGTH) {
    const candidates = getWeightedNeighbors(cursor).filter(
      (word) => word !== entry.word && !path.includes(word),
    );
    const nextWord = pickOne(shuffle(candidates, random), random);

    if (!nextWord) {
      break;
    }

    path.push(nextWord);
    cursor = getEntry(nextWord) ?? cursor;
  }

  if (path.length < CORRECT_PATH_LENGTH) {
    const fallback = shuffle(
      catalog
        .filter((candidate) => candidate.word !== entry.word)
        .map((candidate) => candidate.word),
      random,
    );

    fallback.forEach((word) => {
      if (path.length < CORRECT_PATH_LENGTH && !path.includes(word)) {
        path.push(word);
      }
    });
  }

  return path.slice(0, CORRECT_PATH_LENGTH);
};

const getNearbyExitWords = (entry: CatalogEntry, random: () => number) => {
  const directNeighbors = getWeightedNeighbors(entry);
  const byPosition = catalog
    .slice(
      Math.max(0, entry.index - 16),
      Math.min(catalog.length, entry.index + 17),
    )
    .map((candidate) => candidate.word);
  const candidates = uniqueWords([...directNeighbors, ...byPosition]).filter(
    (word) => word !== entry.word,
  );
  const exitCount = Math.max(
    MIN_EXITS,
    Math.min(MAX_EXITS, candidates.length + 1),
  );
  const distractors = shuffle(candidates, random).slice(0, exitCount - 1);

  return shuffle([entry.word, ...distractors], random);
};

const buildFallbackMeaning = (word: string) => {
  const entry = getEntry(word);

  if (!entry) {
    return `A vocabulary item related to ${word}.`;
  }

  const close = entry.close.slice(0, 3);
  const contrast = entry.contrast.slice(0, 2);
  const parts = [
    close.length > 0 ? `near ${close.join(', ')}` : undefined,
    contrast.length > 0 ? `contrasts with ${contrast.join(', ')}` : undefined,
  ].filter(Boolean);

  return parts.length > 0
    ? `A ${entry.partOfSpeech} ${parts.join('; ')}.`
    : `A ${entry.partOfSpeech} connected to nearby vocabulary.`;
};

const createNode = (
  id: string,
  x: number,
  y: number,
  label: string,
  type: MazeNode['type'],
  exitId?: string,
): MazeNode => ({ id, x, y, label, type, exitId });

type MazeCell = {
  x: number;
  y: number;
};

type MazeCellEdge = {
  from: MazeCell;
  to: MazeCell;
};

const MAZE_WIDTH = 11;
const MAZE_HEIGHT = 9;
const ENTRY_CELL: MazeCell = { x: 0, y: 4 };
const EXIT_CELLS: MazeCell[] = [
  { x: 10, y: 4 },
  { x: 10, y: 1 },
  { x: 10, y: 7 },
];

const getCellId = ({ x, y }: MazeCell) => `${x}:${y}`;

const getNodeIdForCell = (
  cell: MazeCell,
  exitCellsByKey: Map<string, number>,
) => {
  if (cell.x === ENTRY_CELL.x && cell.y === ENTRY_CELL.y) {
    return 'entry';
  }

  const exitIndex = exitCellsByKey.get(getCellId(cell));

  if (exitIndex !== undefined) {
    return `exit-node-${exitIndex}`;
  }

  return `cell-${cell.x}-${cell.y}`;
};

const getNeighborCells = (cell: MazeCell) =>
  [
    { x: cell.x + 1, y: cell.y },
    { x: cell.x - 1, y: cell.y },
    { x: cell.x, y: cell.y + 1 },
    { x: cell.x, y: cell.y - 1 },
  ].filter(
    (neighbor) =>
      neighbor.x >= 0 &&
      neighbor.x < MAZE_WIDTH &&
      neighbor.y >= 0 &&
      neighbor.y < MAZE_HEIGHT,
  );

const addFrontierEdges = (
  cell: MazeCell,
  visitedCells: Set<string>,
  frontierEdges: MazeCellEdge[],
) => {
  getNeighborCells(cell).forEach((neighbor) => {
    if (!visitedCells.has(getCellId(neighbor))) {
      frontierEdges.push({ from: cell, to: neighbor });
    }
  });
};

const generatePrimMazeEdges = (random: () => number) => {
  const visitedCells = new Set<string>([getCellId(ENTRY_CELL)]);
  const frontierEdges: MazeCellEdge[] = [];
  const mazeEdges: MazeCellEdge[] = [];

  addFrontierEdges(ENTRY_CELL, visitedCells, frontierEdges);

  while (
    frontierEdges.length > 0 &&
    visitedCells.size < MAZE_WIDTH * MAZE_HEIGHT
  ) {
    const edgeIndex = Math.floor(random() * frontierEdges.length);
    const [edge] = frontierEdges.splice(edgeIndex, 1);

    if (!edge) {
      break;
    }

    const fromVisited = visitedCells.has(getCellId(edge.from));
    const toVisited = visitedCells.has(getCellId(edge.to));

    if (fromVisited !== toVisited) {
      const nextCell = fromVisited ? edge.to : edge.from;
      visitedCells.add(getCellId(nextCell));
      mazeEdges.push(edge);
      addFrontierEdges(nextCell, visitedCells, frontierEdges);
    }
  }

  return mazeEdges;
};

const buildCellAdjacency = (edges: MazeCellEdge[]) => {
  const adjacency = new Map<string, MazeCell[]>();

  edges.forEach((edge) => {
    const fromId = getCellId(edge.from);
    const toId = getCellId(edge.to);

    adjacency.set(fromId, [...(adjacency.get(fromId) ?? []), edge.to]);
    adjacency.set(toId, [...(adjacency.get(toId) ?? []), edge.from]);
  });

  return adjacency;
};

const findCellPath = (
  from: MazeCell,
  to: MazeCell,
  adjacency: Map<string, MazeCell[]>,
) => {
  const targetId = getCellId(to);
  const queue: MazeCell[][] = [[from]];
  const visitedCells = new Set<string>([getCellId(from)]);

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path?.[path.length - 1];

    if (path && current && getCellId(current) === targetId) {
      return path;
    }

    if (path && current) {
      (adjacency.get(getCellId(current)) ?? []).forEach((neighbor) => {
        const neighborId = getCellId(neighbor);

        if (!visitedCells.has(neighborId)) {
          visitedCells.add(neighborId);
          queue.push([...path, neighbor]);
        }
      });
    }
  }

  return [from, to];
};

const getEvenlySpacedPathCells = (path: MazeCell[], count: number) => {
  const candidates = path.slice(1, -1);

  if (candidates.length <= count) {
    return candidates;
  }

  return Array.from({ length: count }, (_, index) => {
    const candidateIndex = Math.round(
      ((index + 1) * (candidates.length - 1)) / (count + 1),
    );

    return candidates[candidateIndex];
  }).filter((cell): cell is MazeCell => cell !== undefined);
};

const buildMaze = (
  word: string,
  correctPath: string[],
  exitWords: string[],
  random: () => number,
) => {
  const exitCells = EXIT_CELLS.slice(0, exitWords.length);
  const exitCellsByKey = new Map(
    exitCells.map((cell, index) => [getCellId(cell), index] as const),
  );
  const correctExitIndex = Math.max(
    0,
    exitWords.findIndex((exitWord) => exitWord === word),
  );
  const correctExitCell =
    exitCells[correctExitIndex] ?? exitCells[0] ?? ENTRY_CELL;
  const primEdges = generatePrimMazeEdges(random);
  const adjacency = buildCellAdjacency(primEdges);
  const correctCellPath = findCellPath(ENTRY_CELL, correctExitCell, adjacency);
  const labelCells = getEvenlySpacedPathCells(
    correctCellPath,
    correctPath.length,
  );
  const labelByCellId = new Map(
    labelCells.map((cell, index) => [
      getCellId(cell),
      correctPath[index] ?? '',
    ]),
  );
  let decoyWordIndex = 0;
  const decoyWords = shuffle(
    catalog
      .map((entry) => entry.word)
      .filter(
        (candidate) => candidate !== word && !correctPath.includes(candidate),
      ),
    random,
  );
  const getDecoyWord = () => {
    const decoyWord = decoyWords[decoyWordIndex] ?? '';
    decoyWordIndex += 1;

    return decoyWord;
  };
  const correctPathCellIds = new Set(correctCellPath.map(getCellId));
  const leafCellIds = Array.from(adjacency.entries())
    .filter(
      ([cellId, neighbors]) =>
        neighbors.length === 1 &&
        cellId !== getCellId(ENTRY_CELL) &&
        !exitCellsByKey.has(cellId) &&
        !correctPathCellIds.has(cellId),
    )
    .map(([cellId]) => cellId);
  const decoyLabelByCellId = new Map(
    shuffle(leafCellIds, random)
      .slice(0, 10)
      .map((cellId) => [cellId, getDecoyWord()] as const),
  );
  const nodes: MazeNode[] = [];
  const edges = primEdges.map((edge) => ({
    from: getNodeIdForCell(edge.from, exitCellsByKey),
    to: getNodeIdForCell(edge.to, exitCellsByKey),
  }));

  for (let y = 0; y < MAZE_HEIGHT; y += 1) {
    for (let x = 0; x < MAZE_WIDTH; x += 1) {
      const cell = { x, y };
      const cellId = getCellId(cell);
      const exitIndex = exitCellsByKey.get(cellId);

      const isEntryCell = cellId === getCellId(ENTRY_CELL);

      if (isEntryCell) {
        nodes.push(createNode('entry', x, y, word, 'entry'));
      } else if (exitIndex !== undefined) {
        nodes.push(
          createNode(
            `exit-node-${exitIndex}`,
            x,
            y,
            exitWords[exitIndex] ?? `Exit ${exitIndex + 1}`,
            'exit',
            `exit-${exitIndex}`,
          ),
        );
      } else {
        const decoyLabel = decoyLabelByCellId.get(cellId);
        const pathLabel = labelByCellId.get(cellId);

        nodes.push(
          createNode(
            getNodeIdForCell(cell, exitCellsByKey),
            x,
            y,
            pathLabel ?? decoyLabel ?? '',
            decoyLabel ? 'deadEnd' : 'path',
          ),
        );
      }
    }
  }

  return { nodes, edges };
};

export const createDailyPuzzle = (date: string): DailyPuzzle => {
  const random = createSeededRandom(date);
  const eligibleWords = catalog.filter((entry) => entry.neighbors.length >= 3);
  const entry = pickOne(eligibleWords, random) ?? catalog[0];

  if (!entry) {
    throw new Error('Vocabulary catalog is empty.');
  }

  const correctPath = walkPath(entry, random);
  const exitWords = getNearbyExitWords(entry, random);
  const exits = exitWords.map((exitWord, index) => {
    const exitEntry = getEntry(exitWord);

    return {
      id: `exit-${index}`,
      word: exitWord,
      isCorrect: exitWord === entry.word,
      fallbackMeaning: buildFallbackMeaning(exitWord),
      synonyms: exitEntry?.close.slice(0, 4) ?? [],
    };
  });

  return {
    date,
    word: entry.word,
    partOfSpeech: entry.partOfSpeech,
    correctPath,
    exits,
    maze: buildMaze(entry.word, correctPath, exitWords, random),
  };
};
