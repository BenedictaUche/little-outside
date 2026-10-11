/**
 * Shared domain types for Little Outside.
 *
 * These types are used by the data layer, the AI abstraction layer, the
 * storage layer, and the UI. Keeping them in one place keeps the offline
 * fallback and any future online provider returning the same shapes.
 */

export type ActivityId = "notice" | "vocabulary" | "talk" | "clear-head";

export type TimeChoice = "15 min" | "30 min" | "1 hour" | "2+ hours";

export type BudgetChoice = "₦0" | "₦1k" | "₦5k+";

export type SocialChoice =
  | "Just me"
  | "A little interaction"
  | "I'm feeling social";

/** Which AI provider answered: a real model, or the local library. */
export type ContentSource = "ai" | "local";

export type SessionPreferences = {
  activities: ActivityId[];
  time: TimeChoice;
  budget: BudgetChoice;
  social: SocialChoice;
};

export type StoredSession = {
  id: string;
  createdAt: number;
  preferences: SessionPreferences;
  missionTitle: string;
  missionIntensity: string;
  reflection: string;
  rewrite?: string;
  word?: string;
  wordDefinition?: string;
  wordPartOfSpeech?: string;
  wordSource?: ContentSource;
};
