import { useEffect, useState } from 'react';

import { fetchDictionaryMeanings } from '../domain/dictionary';
import type { DictionaryState } from '../domain/types';

export const useDictionaryMeanings = (words: readonly string[]) => {
  const [state, setState] = useState<DictionaryState>({ status: 'idle' });
  const wordsKey = words.join('|');

  useEffect(() => {
    let isMounted = true;
    const requestWords = wordsKey.split('|').filter(Boolean);

    setState({ status: 'loading' });

    fetchDictionaryMeanings(requestWords)
      .then((meanings) => {
        if (isMounted) {
          setState({ status: 'ready', meanings });
        }
      })
      .catch(() => {
        if (isMounted) {
          setState({ status: 'error', meanings: {} });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [wordsKey]);

  return state;
};
