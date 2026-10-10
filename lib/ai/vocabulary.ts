import {
  suggestVocabularyLocally,
  type VocabularySuggestion,
} from "../data/vocabulary";
import {
  generateVocabularyOnline,
  isOnlineProviderConfigured,
} from "./providers/online";

export type { VocabularySuggestion } from "../data/vocabulary";

const MIN_REFLECTION_LENGTH = 3;
const MAX_REFLECTION_LENGTH = 3000;

export function isReflectionValid(reflection: string): boolean {
  return (
    typeof reflection === "string" &&
    reflection.trim().length >= MIN_REFLECTION_LENGTH &&
    reflection.trim().length <= MAX_REFLECTION_LENGTH
  );
}

export async function generateVocabulary(
  reflection: string,
): Promise<VocabularySuggestion> {
  if (!isReflectionValid(reflection)) {
    throw new Error("Please write a reflection under 3,000 characters first.");
  }

  if (isOnlineProviderConfigured()) {
    try {
      return await generateVocabularyOnline(reflection);
    } catch {
      // fall through to the local fallback
    }
  }

  return suggestVocabularyLocally(reflection);
}
