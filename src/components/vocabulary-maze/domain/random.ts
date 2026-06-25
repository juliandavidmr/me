export const hashSeed = (value: string) => {
  let hash = 7;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 2147483647;
  }

  return hash;
};

export const createSeededRandom = (seed: string) => {
  let state = hashSeed(seed) || 1;

  return () => {
    state = (state * 48271) % 2147483647;

    return (state - 1) / 2147483646;
  };
};

export const pickOne = <T>(items: readonly T[], random: () => number) =>
  items[Math.floor(random() * items.length)];

export const shuffle = <T>(items: readonly T[], random: () => number) => {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = next[index];
    const swap = next[swapIndex];

    if (current !== undefined && swap !== undefined) {
      next[index] = swap;
      next[swapIndex] = current;
    }
  }

  return next;
};
