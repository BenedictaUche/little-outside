import type { ContentSource } from "../types";
import type { VocabularySuggestion } from "../data/vocabulary";
import { deleteOne, getAll, newId, putOne } from "./db";
import { WORDS_STORE } from "./db";

export type StoredWord = VocabularySuggestion & {
  id: string;
  createdAt: number;
  /** The reflection (+ rewrite) that produced the word, for context. */
  reflection: string;
};

export async function saveWord(input: {
  suggestion: VocabularySuggestion;
  reflection: string;
  sessionId?: string;
}): Promise<StoredWord> {
  const { suggestion, reflection } = input;
  const word: StoredWord = {
    ...suggestion,
    id: newId("word"),
    createdAt: Date.now(),
    reflection,
  };

  await putOne(WORDS_STORE, word);
  return word;
}

export async function listWords(): Promise<StoredWord[]> {
  return getAll<StoredWord>(WORDS_STORE);
}

export async function deleteWord(id: string): Promise<void> {
  await deleteOne(WORDS_STORE, id);
}

export type { ContentSource };
