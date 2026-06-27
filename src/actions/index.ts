import { defineAction } from 'astro:actions';

import { getUtcDayKey } from '@/components/vocabulary-maze/domain/date';
import { createDailyPuzzle } from '@/components/vocabulary-maze/domain/puzzle';

export const server = {
  getVocabularyMazePuzzle: defineAction({
    handler: () => createDailyPuzzle(getUtcDayKey()),
  }),
};
