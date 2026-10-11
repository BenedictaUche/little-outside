import type { SessionPreferences, StoredSession } from "../types";
import { deleteOne, getAll, newId, putOne } from "./db";
import { SESSIONS_STORE, DRAFT_STORE } from "./db";

export type { StoredSession };

export type SessionDraft = {
  id: string; // always "current-draft"
  handoff: { preferences: SessionPreferences; seed: number };
  stage: "mission" | "reflect" | "word";
  reflection: string;
  rewrite: string;
  updatedAt: number;
};

/**
 * Save the current progress of a mission.
 * Called during handoff and during reflection/rewrite input.
 */
export async function saveDraft(draft: Partial<SessionDraft>): Promise<void> {
  const existing = await getDraft();
  const updated: SessionDraft = {
    id: "current-draft",
    handoff: existing?.handoff ?? draft.handoff!,
    stage: draft.stage ?? existing?.stage ?? "mission",
    reflection: draft.reflection ?? existing?.reflection ?? "",
    rewrite: draft.rewrite ?? existing?.rewrite ?? "",
    updatedAt: Date.now(),
  };
  await putOne(DRAFT_STORE, updated);
}

/** Retrieve the in-progress draft. */
export async function getDraft(): Promise<SessionDraft | null> {
  const drafts = await getAll<SessionDraft>(DRAFT_STORE);
  return drafts.find((d) => d.id === "current-draft") ?? null;
}

/** Clear the draft after a word is kept or the user resets. */
export async function clearDraft(): Promise<void> {
  await deleteOne(DRAFT_STORE, "current-draft");
}

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
  wordDefinition?: string;
  wordPartOfSpeech?: string;
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
