export type Game = {
  date: string;
  description: string;
  href: string;
  meta: string;
  title: string;
};

export const games = [
  {
    date: '2026.06.25',
    title: 'Vocabulary Maze',
    meta: 'English · Daily puzzle',
    description:
      'A daily vocabulary maze for practicing meaning, synonyms, and pronunciation.',
    href: '/games/vocabulary-maze/',
  },
] satisfies Game[];
