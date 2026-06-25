import { useMemo, useState } from 'react';

import { getConnectedNodeIds } from './domain/maze';
import type { DailyPuzzle, MazeNode } from './domain/types';
import { useDictionaryMeanings } from './hooks/useDictionaryMeanings';
import { useElapsedTimer } from './hooks/useElapsedTimer';
import { useReminder } from './hooks/useReminder';
import { useSpeech } from './hooks/useSpeech';
import { useStoredAttempt } from './hooks/useStoredAttempt';
import { MazeBoard } from './ui/MazeBoard';
import { ResultPanel } from './ui/ResultPanel';
import { Timer } from './ui/Timer';

type VocabularyMazeGameProps = {
  initialPuzzle: DailyPuzzle;
};

const findPathWithinDepth = (
  fromId: string,
  toId: string,
  connectedNodeIds: Map<string, string[]>,
  maxDepth: number,
) => {
  const queue: string[][] = [[fromId]];
  const visitedNodeIds = new Set([fromId]);

  while (queue.length > 0) {
    const path = queue.shift();
    const currentNodeId = path?.[path.length - 1];

    if (!path || !currentNodeId) {
      return null;
    }

    if (currentNodeId === toId) {
      return path;
    }

    if (path.length - 1 < maxDepth) {
      (connectedNodeIds.get(currentNodeId) ?? []).forEach((nextNodeId) => {
        if (!visitedNodeIds.has(nextNodeId)) {
          visitedNodeIds.add(nextNodeId);
          queue.push([...path, nextNodeId]);
        }
      });
    }
  }

  return null;
};

export const VocabularyMazeGame = ({
  initialPuzzle,
}: VocabularyMazeGameProps) => {
  const puzzle = initialPuzzle;
  const [activeNodeId, setActiveNodeId] = useState('entry');
  const [visitedNodeIds, setVisitedNodeIds] = useState<Set<string>>(
    () => new Set(['entry']),
  );
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const { attempt, saveAttempt } = useStoredAttempt(puzzle.date);
  const elapsedSeconds = useElapsedTimer(!attempt);
  const { speak } = useSpeech(puzzle.word);
  const { enableReminder, state: reminderState } = useReminder();
  const exitWords = useMemo(
    () => puzzle.exits.map((exit) => exit.word),
    [puzzle.exits],
  );
  const dictionary = useDictionaryMeanings(exitWords);
  const connectedNodeIds = useMemo(
    () => getConnectedNodeIds(puzzle.maze.nodes, puzzle.maze.edges),
    [puzzle.maze.edges, puzzle.maze.nodes],
  );
  const suggestedNodePaths = useMemo(() => {
    const paths = new Map<string, string[]>();

    puzzle.maze.nodes.forEach((node) => {
      if (node.id === activeNodeId || visitedNodeIds.has(node.id)) {
        return;
      }

      const path = findPathWithinDepth(
        activeNodeId,
        node.id,
        connectedNodeIds,
        2,
      );

      if (path) {
        paths.set(node.id, path);
      }
    });

    return paths;
  }, [activeNodeId, connectedNodeIds, puzzle.maze.nodes, visitedNodeIds]);
  const suggestedNodeIds = useMemo(
    () => new Set(suggestedNodePaths.keys()),
    [suggestedNodePaths],
  );
  const highlightedNodeIds = useMemo(() => {
    const intermediateNodeIds = new Set(
      Array.from(suggestedNodePaths.values()).flatMap((path) =>
        path.slice(1, -1),
      ),
    );

    return new Set(
      Array.from(suggestedNodePaths.keys()).filter(
        (nodeId) => !intermediateNodeIds.has(nodeId),
      ),
    );
  }, [suggestedNodePaths]);
  const activeTrailEdgeIds = useMemo(
    () =>
      new Set(
        puzzle.maze.edges.flatMap((edge) =>
          visitedNodeIds.has(edge.from) && visitedNodeIds.has(edge.to)
            ? [`${edge.from}:${edge.to}`, `${edge.to}:${edge.from}`]
            : [],
        ),
      ),
    [puzzle.maze.edges, visitedNodeIds],
  );
  const activeNode = puzzle.maze.nodes.find((node) => node.id === activeNodeId);
  const focusedNode = puzzle.maze.nodes.find(
    (node) => node.id === focusedNodeId,
  );
  const spotNode = focusedNode ?? activeNode;
  const correctExit =
    puzzle.exits.find((exit) => exit.isCorrect) ?? puzzle.exits[0];
  const meanings =
    dictionary.status === 'ready' || dictionary.status === 'error'
      ? dictionary.meanings
      : {};

  if (!correctExit) {
    return null;
  }

  const moveToNode = (node: MazeNode) => {
    const suggestedPath = suggestedNodePaths.get(node.id);
    const canMove = Boolean(suggestedPath) || visitedNodeIds.has(node.id);

    if (!canMove || attempt) {
      return;
    }

    setActiveNodeId(node.id);
    setVisitedNodeIds(
      (current) => new Set([...current, ...(suggestedPath ?? [node.id])]),
    );

    if (node.type === 'exit' && node.exitId) {
      const selectedExit =
        puzzle.exits.find((exit) => exit.id === node.exitId) ?? null;

      if (selectedExit) {
        saveAttempt({
          date: puzzle.date,
          selectedExitId: selectedExit.id,
          selectedExitWord: selectedExit.word,
          isCorrect: selectedExit.isCorrect,
          elapsedSeconds,
          finishedAt: new Date().toISOString(),
        });
      }
    }
  };

  const getSpotLabel = (node?: MazeNode) => {
    if (!node) {
      return '—';
    }

    if (node.type === 'entry') {
      return puzzle.word;
    }

    return node.label || 'Empty spot';
  };

  const getSpotMeta = (node?: MazeNode) => {
    if (!node) {
      return 'Spot';
    }

    if (node.id === activeNodeId) {
      return 'Current';
    }

    if (node.type === 'exit') {
      return 'Exit';
    }

    if (highlightedNodeIds.has(node.id)) {
      return 'Available';
    }

    return 'Spot';
  };

  return (
    <section className="mx-auto grid w-full max-w-120 gap-7 py-8">
      <header className="grid gap-4">
        <div className="flex items-center justify-between gap-5">
          <div>
            <p className="text-3xs font-semibold uppercase tracking-label text-muted dark:text-muted-dark">
              Daily maze · UTC {puzzle.date}
            </p>
            <h1 className="mt-2 text-prose-h3-mobile font-medium tracking-title">
              Vocabulary Maze
            </h1>
          </div>
          <div className="text-right text-xs text-muted dark:text-muted-dark">
            <p>Time</p>
            <strong className="text-base font-medium text-ink dark:text-ink-dark">
              <Timer seconds={attempt?.elapsedSeconds ?? elapsedSeconds} />
            </strong>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-y border-line py-4 dark:border-line-dark">
          <div>
            <p className="text-3xs font-semibold uppercase tracking-label text-muted dark:text-muted-dark">
              Word
            </p>
            <p className="mt-1 text-card-title font-medium tracking-card-title">
              {puzzle.word}
            </p>
          </div>
          <button
            className="size-11 border border-line text-sm transition-colors hover:border-accent dark:border-line-dark"
            type="button"
            onClick={speak}
            aria-label={`Listen to ${puzzle.word}`}
            title={`Listen to ${puzzle.word}`}
          >
            ▶
          </button>
        </div>
      </header>

      {attempt ? (
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
      ) : (
        <>
          <MazeBoard
            activeNodeId={activeNode?.id ?? 'entry'}
            activeTrailEdgeIds={activeTrailEdgeIds}
            edges={puzzle.maze.edges}
            highlightedNodeIds={highlightedNodeIds}
            nodes={puzzle.maze.nodes}
            reachableNodeIds={suggestedNodeIds}
            visitedNodeIds={visitedNodeIds}
            onNodePreview={setFocusedNodeId}
            onNodePreviewEnd={() => setFocusedNodeId(null)}
            onNodeSelect={moveToNode}
          />

          <div className="flex min-h-16 items-center justify-between gap-4 border-y border-line py-3 dark:border-line-dark">
            <p className="text-3xs font-semibold uppercase tracking-label text-muted dark:text-muted-dark">
              {getSpotMeta(spotNode)}
            </p>
            <p className="min-w-0 text-right text-sm font-medium text-ink dark:text-ink-dark">
              {getSpotLabel(spotNode)}
            </p>
          </div>

          <div className="grid place-items-center text-center text-sm text-muted dark:text-muted-dark">
            <p>
              Follow the trail, tap visited nodes to go back, and choose an exit
              to finish.
            </p>
          </div>
        </>
      )}

      {dictionary.status === 'error' && (
        <p className="text-xs text-muted dark:text-muted-dark">
          The extended definition is not available right now; the game will keep
          using local catalog data.
        </p>
      )}
    </section>
  );
};
