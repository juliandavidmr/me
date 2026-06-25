import { useMemo, useState } from 'react';

import { cn } from '@/utils/cn';

import { getConnectedNodeIds } from './domain/maze';
import type { DailyPuzzle, MazeNode, PuzzleExit } from './domain/types';
import { useDictionaryMeanings } from './hooks/useDictionaryMeanings';
import { useElapsedTimer } from './hooks/useElapsedTimer';
import { useReminder } from './hooks/useReminder';
import { useSpeech } from './hooks/useSpeech';
import { useStoredAttempt } from './hooks/useStoredAttempt';
import { ExitPanel } from './ui/ExitPanel';
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
  const [selectedExit, setSelectedExit] = useState<PuzzleExit | null>(null);
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
      setSelectedExit(
        puzzle.exits.find((exit) => exit.id === node.exitId) ?? null,
      );
    } else {
      setSelectedExit(null);
    }
  };

  const confirmExit = () => {
    if (!selectedExit) {
      return;
    }

    saveAttempt({
      date: puzzle.date,
      selectedExitId: selectedExit.id,
      selectedExitWord: selectedExit.word,
      isCorrect: selectedExit.isCorrect,
      elapsedSeconds,
      finishedAt: new Date().toISOString(),
    });
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
            <p>Tiempo</p>
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
            onNodeSelect={moveToNode}
          />

          <div
            className={cn(
              'min-h-36',
              selectedExit
                ? 'block'
                : 'grid place-items-center border-y border-line py-5 text-center text-xs text-muted dark:border-line-dark dark:text-muted-dark',
            )}
          >
            {selectedExit ? (
              <ExitPanel
                exit={selectedExit}
                meaning={meanings[selectedExit.word]}
                onBack={() => setSelectedExit(null)}
                onConfirm={confirmExit}
              />
            ) : (
              <p>
                Sigue el rastro, toca nodos visitados para volver y confirma
                solo cuando una salida defina la palabra.
              </p>
            )}
          </div>
        </>
      )}

      {dictionary.status === 'error' && (
        <p className="text-xs text-muted dark:text-muted-dark">
          La definicion extendida no esta disponible ahora; el juego sigue con
          datos del catalogo local.
        </p>
      )}
    </section>
  );
};
