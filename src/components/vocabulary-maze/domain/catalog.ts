import rawCatalog from '@/components/vocabulary-maze/data/catalog.json';

import type { CatalogEntry, CatalogPair, PartOfSpeech } from './types';

const catalogPairs = rawCatalog as CatalogPair[];

const pushUnique = (items: string[], value: string) => {
  if (!items.includes(value)) {
    items.push(value);
  }
};

export const buildCatalog = () => {
  const entries = new Map<string, CatalogEntry>();

  const ensureEntry = (word: string, partOfSpeech: PartOfSpeech) => {
    const existing = entries.get(word);

    if (existing) {
      return existing;
    }

    const entry: CatalogEntry = {
      word,
      partOfSpeech,
      close: [],
      contrast: [],
      neighbors: [],
      index: entries.size,
    };

    entries.set(word, entry);

    return entry;
  };

  catalogPairs.forEach((pair) => {
    const source = ensureEntry(pair.source, pair.partOfSpeech);
    const target = ensureEntry(pair.target, pair.partOfSpeech);
    const bucket = pair.relation === 'close' ? 'close' : 'contrast';

    pushUnique(source[bucket], pair.target);
    pushUnique(target[bucket], pair.source);
    pushUnique(source.neighbors, pair.target);
    pushUnique(target.neighbors, pair.source);
  });

  return Array.from(entries.values()).filter(
    (entry) => entry.neighbors.length >= 2,
  );
};

export const catalog = buildCatalog();

export const catalogByWord = new Map(
  catalog.map((entry) => [entry.word, entry] as const),
);

export const getEntry = (word: string) => catalogByWord.get(word);
