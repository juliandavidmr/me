import type { MazeEdge, MazeNode } from './types';

export const getConnectedNodeIds = (nodes: MazeNode[], edges: MazeEdge[]) => {
  const map = new Map<string, string[]>();

  nodes.forEach((node) => map.set(node.id, []));
  edges.forEach((edge) => {
    map.get(edge.from)?.push(edge.to);
    map.get(edge.to)?.push(edge.from);
  });

  return map;
};
