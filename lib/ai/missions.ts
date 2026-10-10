import type { MissionRecord } from "../data/missions";
import type { SessionPreferences } from "../types";
import { generateMissionLocally } from "./providers/local";

export type Mission = MissionRecord & { source: "local" | "ai" };
export function generateMission(
  preferences: SessionPreferences,
  seed?: number,
): Mission | null {
  const local = generateMissionLocally(preferences, seed);
  if (!local) return null;
  return { ...local, source: "local" };
}
