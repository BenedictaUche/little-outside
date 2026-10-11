/**
 * Client-side entry point for the vocabulary AI layer.
 *
 * The UI calls `requestVocabulary` — never an AI provider directly, and
 * never a raw fetch against one. This function:
 *
 *   1. asks our own API route (which runs the AI layer server-side: online
 *      provider first, local dataset second), and
 *   2. if that fails (offline, server unreachable, route error), runs the
 *      deterministic local dataset itself.
 *
 * Either way the result is a fully-formed VocabularySuggestion whose
 * `source` honestly says where it came from.
 */

import { suggestVocabularyLocally, type VocabularySuggestion } from "../data/vocabulary";
import { isReflectionValid } from "./vocabulary";

/**
 * Check if the browser is currently offline.
 */
function isOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

export async function requestVocabulary(
  reflection: string,
): Promise<VocabularySuggestion> {
  if (!isReflectionValid(reflection)) {
    throw new Error("Please write a reflection under 3,000 characters first.");
  }

  try {
    const response = await fetch("/api/vocabulary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reflection: reflection.trim() }),
    });

    const data: unknown = await response.json();

    if (response.ok && data && typeof data === "object" && "suggestion" in data) {
      return data.suggestion as VocabularySuggestion;
    }

    const message =
      data && typeof data === "object" && "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? ((data as { error: string }).error)
        : "Couldn't find your words.";
    throw new Error(message);
  } catch {
    // If we're offline or the server is unreachable, fall back to local data
    const local = suggestVocabularyLocally(reflection);
    if (local) return local;
    // If even local fallback fails (shouldn't happen with our curated dataset)
    const message = isOffline()
      ? "You're offline, but the local word library couldn't find a match. Your reflection is still saved."
      : "Something went wrong. Your reflection will be saved, and you can try finding words again later.";
    throw new Error(message);
  }
}
