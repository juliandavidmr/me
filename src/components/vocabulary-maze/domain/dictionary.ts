import type { DictionaryMeaning } from './types';

type DictionaryApiDefinition = {
  definition?: string;
  example?: string;
  synonyms?: string[];
};

type DictionaryApiMeaning = {
  definitions?: DictionaryApiDefinition[];
  synonyms?: string[];
};

type DictionaryApiEntry = {
  meanings?: DictionaryApiMeaning[];
};

const API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export const fetchDictionaryMeaning = async (
  word: string,
): Promise<DictionaryMeaning | null> => {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(word)}`);

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as DictionaryApiEntry[];
  const meanings = data.flatMap((entry) => entry.meanings ?? []);
  const definitions = meanings.flatMap((meaning) => meaning.definitions ?? []);
  const firstDefinition = definitions.find(
    (definition) => typeof definition.definition === 'string',
  );

  if (!firstDefinition?.definition) {
    return null;
  }

  const synonyms = [
    ...meanings.flatMap((meaning) => meaning.synonyms ?? []),
    ...definitions.flatMap((definition) => definition.synonyms ?? []),
  ]
    .map((synonym) => synonym.toLowerCase())
    .filter((synonym, index, all) => synonym && all.indexOf(synonym) === index)
    .slice(0, 4);

  return {
    definition: firstDefinition.definition,
    example: firstDefinition.example,
    synonyms,
  };
};

export const fetchDictionaryMeanings = async (words: string[]) => {
  const entries = await Promise.all(
    words.map(async (word) => [word, await fetchDictionaryMeaning(word)]),
  );

  return Object.fromEntries(
    entries.filter(
      (entry): entry is [string, DictionaryMeaning] => entry[1] !== null,
    ),
  );
};
