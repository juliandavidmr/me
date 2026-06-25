import { cn } from '@/utils/cn';

import type { MazeEdge, MazeNode } from '../domain/types';

type MazeBoardProps = {
  activeNodeId: string;
  activeTrailEdgeIds: Set<string>;
  edges: MazeEdge[];
  highlightedNodeIds: Set<string>;
  reachableNodeIds: Set<string>;
  nodes: MazeNode[];
  onNodeSelect: (node: MazeNode) => void;
  visitedNodeIds: Set<string>;
};

type WallSegment = {
  id: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

const NODE_SIZE_REM = 2.15;

const getNodeStyle = (node: MazeNode, maxX: number, maxY: number) => ({
  left: `${((node.x + 0.5) / (maxX + 1)) * 100}%`,
  top: `${((node.y + 0.5) / (maxY + 1)) * 100}%`,
  width: `${NODE_SIZE_REM}rem`,
  height: `${NODE_SIZE_REM}rem`,
});

const getNodeTitle = (node: MazeNode) => {
  if (node.type === 'entry') {
    return 'Start';
  }

  if (node.type === 'exit') {
    return node.label;
  }

  return node.label;
};

const getWallKeysForStep = (
  x: number,
  y: number,
  nextX: number,
  nextY: number,
) => {
  if (nextX > x) {
    return `v:${x + 1}:${y}`;
  }

  if (nextX < x) {
    return `v:${x}:${y}`;
  }

  if (nextY > y) {
    return `h:${x}:${y + 1}`;
  }

  return `h:${x}:${y}`;
};

const removePassageWalls = (
  removedWalls: Set<string>,
  from: MazeNode,
  to: MazeNode,
) => {
  let currentX = from.x;
  let currentY = from.y;

  while (currentX !== to.x) {
    const nextX = currentX + Math.sign(to.x - currentX);
    removedWalls.add(getWallKeysForStep(currentX, currentY, nextX, currentY));
    currentX = nextX;
  }

  while (currentY !== to.y) {
    const nextY = currentY + Math.sign(to.y - currentY);
    removedWalls.add(getWallKeysForStep(currentX, currentY, currentX, nextY));
    currentY = nextY;
  }
};

const buildWallSegments = (
  nodes: MazeNode[],
  edges: MazeEdge[],
  maxX: number,
  maxY: number,
) => {
  const width = maxX + 1;
  const height = maxY + 1;
  const nodeById = new Map(nodes.map((node) => [node.id, node] as const));
  const removedWalls = new Set<string>();

  edges.forEach((edge) => {
    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);

    if (from && to) {
      removePassageWalls(removedWalls, from, to);
    }
  });

  nodes.forEach((node) => {
    if (node.type === 'entry') {
      removedWalls.add(`v:0:${node.y}`);
    }

    if (node.type === 'exit' && node.x === maxX) {
      removedWalls.add(`v:${width}:${node.y}`);
    }
  });

  const walls: WallSegment[] = [];

  for (let y = 0; y <= height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const id = `h:${x}:${y}`;

      if (!removedWalls.has(id)) {
        walls.push({ id, x1: x, x2: x + 1, y1: y, y2: y });
      }
    }
  }

  for (let x = 0; x <= width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const id = `v:${x}:${y}`;

      if (!removedWalls.has(id)) {
        walls.push({ id, x1: x, x2: x, y1: y, y2: y + 1 });
      }
    }
  }

  return walls;
};

const getTrailPath = (from: MazeNode, to: MazeNode) => {
  const fromX = from.x + 0.5;
  const fromY = from.y + 0.5;
  const toX = to.x + 0.5;
  const toY = to.y + 0.5;

  if (from.x === to.x || from.y === to.y) {
    return `M ${fromX} ${fromY} L ${toX} ${toY}`;
  }

  return `M ${fromX} ${fromY} L ${toX} ${fromY} L ${toX} ${toY}`;
};

export const MazeBoard = ({
  activeNodeId,
  activeTrailEdgeIds,
  edges,
  highlightedNodeIds,
  nodes,
  onNodeSelect,
  reachableNodeIds,
  visitedNodeIds,
}: MazeBoardProps) => {
  const maxX = Math.max(...nodes.map((node) => node.x));
  const maxY = Math.max(...nodes.map((node) => node.y));
  const nodeById = new Map(nodes.map((node) => [node.id, node] as const));
  const width = maxX + 1;
  const height = maxY + 1;
  const walls = buildWallSegments(nodes, edges, maxX, maxY);

  return (
    <div
      className="relative aspect-square w-full bg-transparent"
      aria-label="Vocabulary maze"
    >
      <svg
        className="absolute inset-0 size-full overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <rect
          className="fill-canvas dark:fill-canvas-dark"
          x="0"
          y="0"
          width={width}
          height={height}
        />
        {walls.map((wall) => (
          <line
            key={wall.id}
            className="stroke-ink dark:stroke-ink-dark"
            x1={wall.x1}
            x2={wall.x2}
            y1={wall.y1}
            y2={wall.y2}
            strokeLinecap="square"
            strokeWidth="0.32"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {edges.map((edge) => {
          const from = nodeById.get(edge.from);
          const to = nodeById.get(edge.to);

          if (!from || !to) {
            return null;
          }

          const isVisited =
            visitedNodeIds.has(edge.from) && visitedNodeIds.has(edge.to);
          const isActiveTrail = activeTrailEdgeIds.has(
            `${edge.from}:${edge.to}`,
          );
          const isReachable =
            edge.from === activeNodeId ||
            edge.to === activeNodeId ||
            (highlightedNodeIds.has(edge.from) &&
              highlightedNodeIds.has(edge.to));
          const path = getTrailPath(from, to);

          if (!isVisited && !isReachable) {
            return null;
          }

          return (
            <g key={`${edge.from}-${edge.to}`}>
              {isActiveTrail && (
                <path
                  className="stroke-accent opacity-20"
                  d={path}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="0.58"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              <path
                className={cn(
                  isVisited ? 'stroke-accent' : 'stroke-muted',
                  isActiveTrail ? 'opacity-100' : 'opacity-80',
                  'dark:stroke-muted-dark',
                  isVisited && 'dark:stroke-accent',
                )}
                d={path}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={isActiveTrail ? '0.28' : '0.18'}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </svg>

      {nodes.map((node) => {
        const isActive = node.id === activeNodeId;
        const isVisited = visitedNodeIds.has(node.id);
        const isReachable = reachableNodeIds.has(node.id);
        const canMove = isReachable || isVisited;
        const isNextChoice = highlightedNodeIds.has(node.id) && !isVisited;
        const hasLabel = node.label.length > 0;

        return (
          <button
            key={node.id}
            className={cn(
              'absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full text-[0.48rem] font-semibold uppercase leading-none transition-[background-color,border-color,color,opacity,transform]',
              'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas dark:focus:ring-offset-canvas-dark',
              'grid place-items-center',
              node.type === 'entry' &&
                'bg-ink text-canvas dark:bg-ink-dark dark:text-canvas-dark',
              node.type === 'path' &&
                'bg-canvas text-muted dark:bg-canvas-dark dark:text-muted-dark',
              node.type === 'deadEnd' &&
                'bg-canvas text-muted dark:bg-canvas-dark dark:text-muted-dark',
              node.type === 'exit' &&
                'border border-accent bg-canvas text-accent dark:bg-canvas-dark',
              isVisited && 'bg-accent text-ink',
              isActive &&
                'z-20 scale-110 bg-accent text-ink shadow-[0_0_0_0.35rem_rgba(255,90,31,0.2)]',
              isNextChoice &&
                'animate-pulse bg-accent/20 text-accent ring-2 ring-accent ring-offset-2 ring-offset-canvas dark:ring-offset-canvas-dark',
              !canMove && 'opacity-45',
              canMove ? 'cursor-pointer' : 'cursor-default',
            )}
            type="button"
            disabled={!canMove}
            style={getNodeStyle(node, maxX, maxY)}
            onClick={() => onNodeSelect(node)}
            aria-label={getNodeTitle(node) || node.type}
            title={getNodeTitle(node)}
          >
            {isNextChoice && (
              <span className="absolute inset-[-0.45rem] -z-10 rounded-full bg-accent/20" />
            )}
            {hasLabel ? (
              <span className="max-w-[2rem] truncate px-0.5">
                {node.type === 'entry' ? 'Start' : node.label}
              </span>
            ) : (
              <span
                className={cn(
                  'size-2 rounded-full bg-current opacity-55',
                  isActive && 'opacity-100',
                )}
              />
            )}
            {isActive && (
              <span className="absolute -bottom-1 size-2 rounded-full border border-canvas bg-ink dark:border-canvas-dark dark:bg-ink-dark" />
            )}
          </button>
        );
      })}
    </div>
  );
};
