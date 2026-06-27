const HASH_MODULUS = 2147483647;
const HASH_MULTIPLIER = 48271;

export const hashSeed = (value: string) => {
  let hash = 17 + value.length;

  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    const position = index + 1;

    hash = (hash * 131 + code * (position + 17)) % HASH_MODULUS;
    hash = (hash * 524287 + code + position * 8191) % HASH_MODULUS;
  }

  return (
    (hash * HASH_MULTIPLIER + value.length * 961748927) % HASH_MODULUS || 1
  );
};

export const createSeededRandom = (seed: string) => {
  let state = hashSeed(seed) % HASH_MODULUS || 1;

  return () => {
    state = (state * HASH_MULTIPLIER) % HASH_MODULUS;

    return (state - 1) / (HASH_MODULUS - 1);
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
