import type { MissionRecord } from "../../data/missions";

/**
 * Missions are local-first for now: the curated library already respects the
 * preference matrix, and generating them with a model adds latency without
 * adding precision. When a generator is wanted, implement it returning the
 * same MissionRecord shape, and the AI layer will route to it automatically.
 */
export function isOnlineMissionGenerationConfigured(): boolean {
  return false;
}

export type OnlineMissionResult = {
  mission: MissionRecord;
};
