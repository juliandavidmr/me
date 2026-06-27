export const findPathWithinDepth = (
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
