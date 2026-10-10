import type {
  ActivityId,
  BudgetChoice,
  SessionPreferences,
  SocialChoice,
  TimeChoice,
} from "../types";
// `SocialChoice` is used in MissionConstraints below.

/**
 * A mission from the local library. Each mission declares which preferences
 * it serves; the generator filters by those constraints rather than missions
 * being hardcoded inside a page component.
 */
export type MissionRecord = {
  id: string;
  activity: ActivityId;
  /** Short label shown in the journal, e.g. "a little observation". */
  intensity: string;
  emoji: string;
  color: "lavender" | "peach" | "rose" | "butter";
  title: string;
  intro: string;
  instructions: string[];
  reflectionPrompt: string;
};

/** Ordered from cheapest to priciest so we can compare budgets. */
const BUDGET_ORDER: BudgetChoice[] = ["₦0", "₦1k", "₦5k+"];

/** Ordered from shortest to longest so we can compare times. */
const TIME_ORDER: TimeChoice[] = ["15 min", "30 min", "1 hour", "2+ hours"];



type MissionConstraints = {
  /** Maximum budget the mission may require, e.g. "₦1k" = costs at most ₦1k. */
  maxBudget: BudgetChoice;
  /** Minimum time the user needs for this mission. */
  minTime: TimeChoice;
  /** Social appetite this mission caters to (exact match). */
  social: SocialChoice;
};

export type LocalMission = MissionRecord & MissionConstraints;

/**
 * The local mission library. Deliberately small but covering the preference
 * matrix: every activity has missions that respect budget, time and social
 * needs.
 */
const MISSIONS: LocalMission[] = [
  // ── Notice things ──────────────────────────────────────────────
  {
    id: "notice-familiar-detail",
    activity: "notice",
    intensity: "a little observation",
    emoji: "🌼",
    color: "lavender",
    title: "The Ordinary, More Carefully",
    intro: "There's more to your everyday world than meets the eye.",
    instructions: [
      "Take a walk somewhere familiar.",
      "Find something you've probably seen many times but never really examined.",
      "Notice its shape, color, texture, or the way people interact with it.",
      "Keep your phone away for a little while. Let yourself be curious.",
    ],
    reflectionPrompt: "What's one detail you would normally have overlooked?",
    maxBudget: "₦0",
    minTime: "15 min",
    social: "Just me",
  },
  {
    id: "notice-texture-hunt",
    activity: "notice",
    intensity: "a little observation",
    emoji: "🪨",
    color: "butter",
    title: "A Small World of Details",
    intro: "Today, ordinary things get to be interesting.",
    instructions: [
      "Walk slowly through your street or a nearby park.",
      "Touch two things that grew and two things that were made.",
      "Pay attention to the differences: warmth, roughness, weight.",
      "Remember the pairing that surprised you most.",
    ],
    reflectionPrompt: "What did things feel like today, and why was that surprising?",
    maxBudget: "₦0",
    minTime: "15 min",
    social: "Just me",
  },
  {
    id: "notice-street-sounds",
    activity: "notice",
    intensity: "a little observation",
    emoji: "🔔",
    color: "peach",
    title: "An Ear for the Street",
    intro: "Your neighborhood has a soundtrack. Find it.",
    instructions: [
      "Sit somewhere comfortable outdoors, or walk without headphones.",
      "Close your eyes for a minute and count the different sounds you can hear.",
      "Pick the one you'd miss most if it disappeared.",
      "Try to describe it without naming its source directly.",
    ],
    reflectionPrompt: "Which sound caught you, and what did it remind you of?",
    maxBudget: "₦0",
    minTime: "30 min",
    social: "Just me",
  },
  {
    id: "notice-long-walk",
    activity: "notice",
    intensity: "a longer observation",
    emoji: "🚶",
    color: "lavender",
    title: "The Long Way Round",
    intro: "Give yourself permission to wander without a destination.",
    instructions: [
      "Pick a direction and follow it for a good while.",
      "Every ten minutes or so, stop and name three things you can see that you couldn't a moment ago.",
      "Let yourself be led by curiosity rather than habit.",
      "Turn back before you're tired — leaving something unexplored is part of the game.",
    ],
    reflectionPrompt: "Where did the walk take you that you didn't expect?",
    maxBudget: "₦1k",
    minTime: "1 hour",
    social: "Just me",
  },

  // ── Find better words ──────────────────────────────────────────
  {
    id: "words-people-watching",
    activity: "vocabulary",
    intensity: "a little noticing & words",
    emoji: "📖",
    color: "peach",
    title: "The Noticer's Notebook",
    intro: "You'll gather raw detail first — the words come later.",
    instructions: [
      "Sit somewhere with a bit of street life: a bench, a doorstep, a stall.",
      "Watch how people move, wait, greet each other, carry their things.",
      "In your head, try to describe one person without using words like 'old' or 'happy'. Use details instead.",
      "Hold onto that description for when you're back.",
    ],
    reflectionPrompt: "Who or what did you describe in your head, and how did it look?",
    maxBudget: "₦0",
    minTime: "30 min",
    social: "Just me",
  },
  {
    id: "words-weather-walk",
    activity: "vocabulary",
    intensity: "a little noticing & words",
    emoji: "🌦",
    color: "butter",
    title: "Weather Report, Personally",
    intro: "The sky and the air are worth a better word than 'nice'.",
    instructions: [
      "Step outside and let your face feel the weather first.",
      "Notice what the light is doing — to walls, trees, the road, your hands.",
      "Think of the worst word for today's weather ('nice'), then hunt privately for a truer one.",
      "You'll meet the word-coach when you get back.",
    ],
    reflectionPrompt: "How did the air and light actually feel out there?",
    maxBudget: "₦0",
    minTime: "15 min",
    social: "Just me",
  },
  {
    id: "words-market-colors",
    activity: "vocabulary",
    intensity: "a little noticing & words",
    emoji: "🎨",
    color: "rose",
    title: "Color Collecting",
    intro: "Today's harvest isn't fruit — it's shades.",
    instructions: [
      "Walk through a market or a colorful street.",
      "Pick three colors that stop you and try to name them precisely in your head.",
      "For each, note what it was attached to and what it did to the scene.",
      "Bring the memory home; we'll find words sharp enough to hold them.",
    ],
    reflectionPrompt: "Which colors stayed with you, and what were they part of?",
    maxBudget: "₦1k",
    minTime: "30 min",
    social: "A little interaction",
  },

  // ── Talk to someone ────────────────────────────────────────────
  {
    id: "talk-small-greeting",
    activity: "talk",
    intensity: "a tiny interaction",
    emoji: "🦋",
    color: "rose",
    title: "The Unhurried Hello",
    intro: "The smallest interactions often cost the least and give the most.",
    instructions: [
      "Go somewhere people pass by at an easy pace.",
      "Make eye contact with one person and simply smile or greet them.",
      "Notice what happens next — no need to force a conversation.",
      "That's all. Really. You're done once you've done it once.",
    ],
    reflectionPrompt: "Who did you greet, and what happened in that little moment?",
    maxBudget: "₦0",
    minTime: "15 min",
    social: "A little interaction",
  },
  {
    id: "talk-shop-small",
    activity: "talk",
    intensity: "a tiny interaction",
    emoji: "🧺",
    color: "peach",
    title: "A Chat With Purpose",
    intro: "Buying one small thing is a fine excuse for a good word with someone.",
    instructions: [
      "Visit a small shop or stall and buy something tiny.",
      "Ask the seller one real question — about the goods, the day, the weather.",
      "Listen to the whole answer before you move on.",
      "Take the long way home afterwards.",
    ],
    reflectionPrompt: "What did you ask about, and what did you hear back?",
    maxBudget: "₦1k",
    minTime: "30 min",
    social: "A little interaction",
  },
  {
    id: "talk-invite-a-friend",
    activity: "talk",
    intensity: "a proper conversation",
    emoji: "☕",
    color: "lavender",
    title: "One Drink, One Long Talk",
    intro: "Some missions are better shared.",
    instructions: [
      "Invite someone who's easy to be quiet with.",
      "Sit outside somewhere you can hear each other and the world.",
      "No agenda. Let the conversation wander where it wants.",
      "Notice one thing they said that you'll keep thinking about.",
    ],
    reflectionPrompt: "What did the two of you end up talking about?",
    maxBudget: "₦5k+",
    minTime: "1 hour",
    social: "I'm feeling social",
  },
  {
    id: "talk-group-outing",
    activity: "talk",
    intensity: "a proper conversation",
    emoji: "🌳",
    color: "butter",
    title: "The Round-Table Walk",
    intro: "Three or more makes a moving living room.",
    instructions: [
      "Gather two or more people for an evening walk.",
      "Pick a route nobody knows well, or take turns choosing turns.",
      "Somewhere along the way, each person shares one thing they noticed.",
      "Compare notes — you'll each have walked a different street.",
    ],
    reflectionPrompt: "What did someone else notice that you had missed entirely?",
    maxBudget: "₦0",
    minTime: "1 hour",
    social: "I'm feeling social",
  },

  // ── Clear your head ────────────────────────────────────────────
  {
    id: "clear-sit-still",
    activity: "clear-head",
    intensity: "a quiet pause",
    emoji: "☁️",
    color: "butter",
    title: "Sixty Seconds of Sky",
    intro: "A short reset for a full mind.",
    instructions: [
      "Find a spot where you can see some sky — a doorstep, a balcony, a patch of grass.",
      "Sit down and put the phone somewhere you can't reach without standing.",
      "Let thoughts arrive and leave without chasing them.",
      "When a single worry keeps returning, note it — you'll write it down later.",
    ],
    reflectionPrompt: "What settled down once you stopped feeding it?",
    maxBudget: "₦0",
    minTime: "15 min",
    social: "Just me",
  },
  {
    id: "clear-aimless-walk",
    activity: "clear-head",
    intensity: "a quiet pause",
    emoji: "🌙",
    color: "lavender",
    title: "The Unscheduled Half Hour",
    intro: "You don't owe the walk any productivity.",
    instructions: [
      "Walk for a while with no destination and no errand attached.",
      "If your mind offers you a task, acknowledge it and leave it by the roadside.",
      "Let your eyes rest on middles-distance things: rooftops, tree lines, far corners.",
      "End wherever you happen to be when the timer in your head expires.",
    ],
    reflectionPrompt: "What loosened its grip somewhere along the way?",
    maxBudget: "₦0",
    minTime: "30 min",
    social: "Just me",
  },
  {
    id: "clear-write-outside",
    activity: "clear-head",
    intensity: "a quiet pause",
    emoji: "📝",
    color: "rose",
    title: "A Letter to the Pavement",
    intro: "Some evenings need a page more than a plan.",
    instructions: [
      "Take a pen and something to write on — paper, not a screen.",
      "Sit outside and write one honest paragraph about whatever is loudest in your head.",
      "Don't fix it. Don't solve it. Just set it down where the sky can read it.",
      "Keep the page or fold it into your pocket; bring the feeling home.",
    ],
    reflectionPrompt: "What did the loudest thing in your head have to say?",
    maxBudget: "₦0",
    minTime: "30 min",
    social: "Just me",
  },
  {
    id: "clear-evening-stroll",
    activity: "clear-head",
    intensity: "a longer unwind",
    emoji: "🌇",
    color: "peach",
    title: "The Slow Sunset Shift",
    intro: "Let the light change while you change with it.",
    instructions: [
      "Time a walk to start before golden hour and end after.",
      "Stop when the sky is doing something worth waiting for.",
      "Let the day's leftovers drain out with each block.",
      "Head home once you feel the volume in your head has dropped a setting.",
    ],
    reflectionPrompt: "What changed between the sky and you from start to finish?",
    maxBudget: "₦0",
    minTime: "1 hour",
    social: "Just me",
  },
];

function budgetsUpTo(choice: BudgetChoice): Set<BudgetChoice> {
  const index = BUDGET_ORDER.indexOf(choice);
  return new Set(BUDGET_ORDER.slice(0, index + 1));
}

function timesOf(choice: TimeChoice): Set<TimeChoice> {
  const index = TIME_ORDER.indexOf(choice);
  // A longer available time also covers missions needing less.
  return new Set(TIME_ORDER.slice(0, index + 1));
}

/**
 * Pick a mission from the local library that actually respects the user's
 * preferences. Falls back to anything matching the activity if the full
 * matrix has no entry, so the user always gets a mission.
 */
export function pickLocalMission(
  preferences: SessionPreferences,
  seed: number = Math.floor(Math.random() * 100_000),
): LocalMission | null {
  const primaryActivity =
    preferences.activities.find((id) => id === "vocabulary") ??
    preferences.activities[0];

  if (!primaryActivity) return null;

  const allowedBudgets = budgetsUpTo(preferences.budget);
  const allowedTimes = timesOf(preferences.time);

  const matches = MISSIONS.filter(
    (mission) =>
      (mission.activity === primaryActivity ||
        preferences.activities.includes(mission.activity)) &&
      allowedBudgets.has(mission.maxBudget) &&
      allowedTimes.has(mission.minTime) &&
      mission.social === preferences.social,
  );

  // Relax social matching before relaxing budget/time: a shy user shouldn't
  // be handed a group mission just because the exact matrix wasn't covered.
  const exactSocial = matches.length > 0;
  const pool =
    exactSocial
      ? matches
      : MISSIONS.filter(
          (mission) =>
            preferences.activities.includes(mission.activity) &&
            allowedBudgets.has(mission.maxBudget) &&
            allowedTimes.has(mission.minTime),
        );

  if (pool.length === 0) return null;

  return pool[seed % pool.length];
}

export function getLocalMissionById(id: string): LocalMission | undefined {
  return MISSIONS.find((mission) => mission.id === id);
}

export const localMissionLibrarySize = MISSIONS.length;
