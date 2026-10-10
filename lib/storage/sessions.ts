import type { SessionPreferences, StoredSession } from "../types";
import { deleteOne, getAll, newId, putOne } from "./db";
import { SESSIONS_STORE } from "./db";

export type { StoredSession };

/**
 * Save a completed session. Called when the user keeps their word at the end
 * of the flow; also called automatically when a reflection is written.
 */
export async function saveSession(input: {
  preferences: SessionPreferences;
  missionTitle: string;
  missionIntensity: string;
  reflection: string;
  rewrite?: string;
  word?: string;
  wordSource?: "ai" | "local";
}): Promise<StoredSession> {
  const session: StoredSession = {
    id: newId("session"),
    createdAt: Date.now(),
    ...input,
  };

  await putOne(SESSIONS_STORE, session);
  return session;
}

export async function listSessions(): Promise<StoredSession[]> {
  return getAll<StoredSession>(SESSIONS_STORE);
}

export async function deleteSession(id: string): Promise<void> {
  await deleteOne(SESSIONS_STORE, id);
}
