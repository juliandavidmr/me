import { actions } from 'astro:actions';
import { type ComponentType, useEffect, useState } from 'react';

import type { DailyPuzzle } from '../../domain/types';
import { VocabularyMazeLoadedState } from '../components/VocabularyMazeLoadedState';
import { VocabularyMazeLoader } from '../components/VocabularyMazeLoader';
import type { PuzzleComponentProps } from '../types/PuzzleComponentProps';

export const withServerPuzzle = (
  PuzzleComponent: ComponentType<PuzzleComponentProps>,
) => {
  const ServerPuzzleLoader = () => {
    const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
    const [status, setStatus] = useState<'error' | 'loading'>('loading');

    useEffect(() => {
      let isMounted = true;

      const loadPuzzle = async () => {
        setStatus('loading');
        const { data, error } = await actions.getVocabularyMazePuzzle();

        if (!isMounted) {
          return;
        }

        if (error || !data) {
          setStatus('error');

          return;
        }

        setPuzzle(data);
      };

      loadPuzzle().catch(() => {
        if (isMounted) {
          setStatus('error');
        }
      });

      return () => {
        isMounted = false;
      };
    }, []);

    if (!puzzle) {
      return <VocabularyMazeLoader status={status} />;
    }

    return (
      <VocabularyMazeLoadedState
        PuzzleComponent={PuzzleComponent}
        puzzle={puzzle}
      />
    );
  };

  return ServerPuzzleLoader;
};
