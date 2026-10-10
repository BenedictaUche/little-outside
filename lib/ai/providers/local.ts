import type { SessionPreferences } from "../../types";
import {
  pickLocalMission,
  type LocalMission,
} from "../../data/missions";

/**
 * The deterministic, offline mission provider. Missions come entirely from
 * the local library, so they work with no network and no model.
 */
export function generateMissionLocally(
  preferences: SessionPreferences,
  seed?: number,
): LocalMission | null {
  return pickLocalMission(preferences, seed);
}
