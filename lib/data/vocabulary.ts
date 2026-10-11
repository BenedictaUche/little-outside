import type { ContentSource } from "../types";

/** The typed structure both the AI provider and the local fallback return. */
export type VocabularySuggestion = {
  word: string;
  partOfSpeech: string;
  definition: string;
  whyItFits: string;
  example: string;
  challenge: string;
  source: ContentSource;
};

/** A curated vocabulary entry for the offline fallback. */
export type VocabularyEntry = {
  word: string;
  partOfSpeech: string;
  definition: string;
  /** Words/phrases from a reflection that make this entry fit. */
  keywords: string[];
  /** Example sentences grounded in the kinds of reflections this entry fits. */
  example: string;
};

/**
 * A small, curated offline vocabulary: useful, precise words a person might
 * genuinely reach for after spending time outside. Grouped loosely by theme,
 * favoring utility over difficulty.
 */
const VOCABULARY: VocabularyEntry[] = [
  // observation
  {
    word: "inconspicuous",
    partOfSpeech: "adjective",
    definition: "Not easily noticed or attracting attention.",
    keywords: ["inconspicuous", "overlooked", "hardly noticed", "barely noticed", "blending in", "didn't notice", "never noticed", "hidden", "quiet corner"],
    example: "The inconspicuous drainpipe turned out to be home to a small, determined plant.",},
  {
    word: "linger",
    partOfSpeech: "verb",
    definition: "To stay in a place longer than necessary, often reluctant to leave.",
    keywords: ["linger", "stayed", "didn't want to leave", "took my time", "slowly", "took longer", "kept standing"],
    example: "I lingered by the shut gate long after the taxi had gone.",},
  {
    word: "unassuming",
    partOfSpeech: "adjective",
    definition: "Modest, not trying to draw attention to itself.",
    keywords: ["unassuming", "ordinary", "plain", "simple", "nothing special", "humble", "modest"],
    example: "An unassuming wooden bench held the best view on the street.",},
  // texture / touch
  {
    word: "weathered",
    partOfSpeech: "adjective",
    definition: "Worn or changed by long exposure to weather or time.",
    keywords: ["weathered", "worn", "rough", "old wall", "peeling", "cracked", "rust", "faded", "sun-bleached"],
    example: "The weathered railing left a pale dust on my hand.",},
  {
    word: "velvety",
    partOfSpeech: "adjective",
    definition: "Soft and smooth to the touch, like velvet.",
    keywords: ["velvety", "soft", "smooth", "velvet", "petal", "moss", "furry"],
    example: "The velvety leaf held a bead of last night's rain.",},
  {
    word: "gritty",
    partOfSpeech: "adjective",
    definition: "Covered or filled with small, coarse particles.",
    keywords: ["gritty", "dust", "sand", "dirt road", "rough", "gravel", "dusty", "sandy"],
    example: "My palms had a gritty film from resting on the low wall.",},
  // atmosphere / light
  {
    word: "hushed",
    partOfSpeech: "adjective",
    definition: "Very quiet, as if the whole place were holding its breath.",
    keywords: ["hushed", "quiet", "silent", "calm", "still", "peaceful", "stillness", "no one around"],
    example: "The street was hushed in that hour before the shops opened.",},
  {
    word: "golden",
    partOfSpeech: "adjective",
    definition: "Glowing with the warm yellow light of late afternoon or evening.",
    keywords: ["golden", "sunset", "light", "evening", "warm light", "afternoon", "glow", "golden hour", "sun"],
    example: "The golden light made even the parked cars look sentimental.",},
  {
    word: "silvery",
    partOfSpeech: "adjective",
    definition: "Shining palely, like moonlight or water.",
    keywords: ["silvery", "moon", "morning", "pale", "shiny", "reflect", "reflection", "wet road", "puddle", "rain"],
    example: "The silvery sheen on the wet asphalt doubled every streetlight.",},
  {
    word: "oppressive",
    partOfSpeech: "adjective",
    definition: "Weighing down on you, hard to bear.",
    keywords: ["oppressive", "hot", "heavy air", "humid", "stuffy", "can't breathe", "sticky", "muggy", "heat"],
    example: "The afternoon heat was oppressive; even the dogs had given up.",},
  // movement
  {
    word: "meander",
    partOfSpeech: "verb",
    definition: "To follow a winding, unhurried course.",
    keywords: ["meander", "wandered", "walked slowly", "no destination", "roamed", "ambled", "strolled", "drifted"],
    example: "We meandered past the shuttered stalls without any plan.",},
  {
    word: "sway",
    partOfSpeech: "verb",
    definition: "To move slowly back and forth from side to side.",
    keywords: ["sway", "wind", "tree", "moved", "swing", "hanging", "branch", "fabric", "flag"],
    example: "The laundry lines swayed in the thick evening air.",},
  {
    word: "dart",
    partOfSpeech: "verb",
    definition: "To move suddenly and quickly in a specific direction.",
    keywords: ["dart", "quick", "suddenly", "ran", "rushed", "quickly", "lizard", "bird", "bolted", "flew"],
    example: "A lizard darted across the step just as I sat down.",},
  {
    word: "trundling",
    partOfSpeech: "adjective",
    definition: "Moving slowly, heavily, and often noisily along.",
    keywords: ["trundling", "cart", "wheel", "traffic", "slow vehicle", "lorry", "bus", "pushed"],
    example: "A market woman came trundling past with her goods stacked high.",},
  // sound
  {
    word: "din",
    partOfSpeech: "noun",
    definition: "A loud, sustained, and unpleasant noise.",
    keywords: ["din", "noise", "loud", "traffic", "generator", "horns", "shouting", "noisy", "earache"],
    example: "Above it all rose the familiar din of the evening traffic.",},
  {
    word: "hum",
    partOfSpeech: "noun",
    definition: "A low, steady, continuous sound.",
    keywords: ["hum", "buzz", "low sound", "fans", "engine", "insects", "electricity", "talk", "chatter"],
    example: "The day ended in the hum of the street's single generator.",},
  {
    word: "echo",
    partOfSpeech: "noun",
    definition: "A sound that is repeated as it bounces off a surface.",
    keywords: ["echo", "empty", "repeated", "bounced", "cathedral", "underpass", "big hall", "voice"],
    example: "Her laugh left an echo in the tall stairwell.",},
  // social interaction
  {
    word: "exchange",
    partOfSpeech: "noun",
    definition: "A short act of giving something and receiving something, especially words.",
    keywords: ["exchange", "talked", "conversation", "greeted", "greeting", "chat", "hello", "asked", "answered", "smile", "smiled"],
    example: "Our whole exchange was four words long, and it still made my day.",},
  {
    word: "unhurried",
    partOfSpeech: "adjective",
    definition: "Relaxed, done in your own time without rushing.",
    keywords: ["unhurried", "relaxed", "no rush", "took my time", "slow", "easy", "unrushed", "at ease"],
    example: "The trader gave me an unhurried answer, like time was someone else's problem.",},
  {
    word: "stranger",
    partOfSpeech: "noun",
    definition: "A person you do not know.",
    keywords: ["stranger", "someone", "person", "man", "woman", "woman at", "guy", "she said", "he said", "they said", "met"],
    example: "A stranger held the gate even though her bus was pulling up.",},
  // emotions
  {
    word: "homesick",
    partOfSpeech: "adjective",
    definition: "Feeling a longing for home while away from it.",
    keywords: ["homesick", "missed", "missing home", "sadan", "heavy heart", "longed", "wished", "family", "mother"],
    example: "The smell of rain on hot dust made me oddly homesick.",},
  {
    word: "contentment",
    partOfSpeech: "noun",
    definition: "A quiet state of being satisfied with what you have right now.",
    keywords: ["contentment", "happy", "content", "peace", "okay", "fine", "good day", "grateful", "nothing to worry"],
    example: "Sitting on the step with cold drink, I felt pure contentment.",},
  {
    word: "melancholy",
    partOfSpeech: "noun",
    definition: "A thoughtful sadness, often without a clear reason.",
    keywords: ["melancholy", "sad", "bittersweet", "quiet sadness", "lonely", "empty", "nostalgic", "wistful", "grey", "gray"],
    example: "A mild melancholy settled with the dusk and left with the light.",},
  {
    word: "relief",
    partOfSpeech: "noun",
    definition: "The feeling when something worrying stops or turns out fine.",
    keywords: ["relief", "finally", "worried", "worry", "breathing", "let go", "eased", "settled", "drop", "put down"],
    example: "Setting the day down, I felt a small relief spread through my shoulders.",},
  // environment / nature
  {
    word: "lush",
    partOfSpeech: "adjective",
    definition: "Growing thickly, strongly, and well.",
    keywords: ["lush", "green", "plants", "leaves", "garden", "grass", "flowers", "vegetation", "rain-fed"],
    example: "The rains left the roadside grasses unexpectedly lush.",},
  {
    word: "barren",
    partOfSpeech: "adjective",
    definition: "Land that produces little or no plant life.",
    keywords: ["barren", "dry", "empty lot", "nothing grew", "bare", "dusty ground", "sand", "dry season"],
    example: "The barren lot behind the church hid a single stubborn tree.",},
  {
    word: "canopy",
    partOfSpeech: "noun",
    definition: "A cover formed by the upper branches and leaves of trees.",
    keywords: ["canopy", "tree", "trees", "shade", "leaves overhead", "branches", "under the trees"],
    example: "We walked the whole street under a wide canopy of neem branches.",},
  // appearance
  {
    word: "mismatched",
    partOfSpeech: "adjective",
    definition: "Not matching each other, deliberately or not.",
    keywords: ["mismatched", "mismatch", "different colors", "odd", "didn't match", "clash", "patchwork", "unmatched"],
    example: "The stall's mismatched plastic chairs somehow looked perfect together.",},
  {
    word: "crooked",
    partOfSpeech: "adjective",
    definition: "Bent, twisted, or not straight.",
    keywords: ["crooked", "bent", "tilted", "leaning", "not straight", "askew", "twisted", "hung"],
    example: "A crooked sign hung by one nail above the doorway.",},
  {
    word: "sprawling",
    partOfSpeech: "adjective",
    definition: "Spreading out over a large area in an untidy way.",
    keywords: ["everywhere", "sprawled", "spread", "across", " vines", "sprawling", "piled"],
    example: "A sprawling pumpkin vine had claimed the whole fence line.",},
  // uncertainty
  {
    word: "elusive",
    partOfSpeech: "adjective",
    definition: "Hard to find, catch, or describe.",
    keywords: ["elusive", "couldn't quite", "hard to", "couldn't find", "almost", "nearly", "eclipsed", "fled", "wouldn't come"],
    example: "The right word stayed elusive all the way home.",},
  {
    word: "indistinct",
    partOfSpeech: "adjective",
    definition: "Not clear or definite; hard to make out.",
    keywords: ["indistinct", "blurry", "unclear", "fog", "mist", "hazy", "shadow", "dark", "couldn't see", "figure"],
    example: "An indistinct shape sat at the far end of the field.",},
  // change
  {
    word: "shifting",
    partOfSpeech: "adjective",
    definition: "Always changing or moving slightly.",
    keywords: ["shifting", "changed", "changing", "moving", "turned", "swapped", "over time", "began", "became"],
    example: "The crowd kept shifting, and with it the street's whole mood.",},
  {
    word: "crumbling",
    partOfSpeech: "adjective",
    definition: "Slowly falling apart into small pieces.",
    keywords: ["crumbling", "falling apart", "broken", "cracked paint", "erosion", "wore down", "decayed", "old building"],
    example: "The crumbling wall had become a ladder for the neighborhood's cats.",},
  {
    word: "flickering",
    partOfSpeech: "adjective",
    definition: "Burning or shining unsteadily; appearing and disappearing quickly.",
    keywords: ["flickering", "light", "candle", "bulb", "flicker", "lantern", "fire", "torchlight"],
    example: "A flickering kerosene lamp kept its small brave circle of light.",},
  ];

/**
 * Score a reflection against a vocabulary entry by counting keyword hits.
 * Longer keywords are worth more: a phrase match beats a single word.
 */
function scoreEntry(entry: VocabularyEntry, text: string): number {
  let score = 0;
  for (const keyword of entry.keywords) {
    // Use word boundaries to avoid partial matches (e.g., "din" matching "building")
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
    if (pattern.test(text)) {
      // Give higher weight to the word itself
      const isWordItself = keyword === entry.word;
      const isPhrase = keyword.includes(" ");
      score += isWordItself ? 10 : isPhrase ? 3 : 2;
    }
  }
  return score;
}

/** Minimum score needed before an entry can be suggested. */
const MATCH_THRESHOLD = 3;

/** A small, honest fallback used when nothing in the reflection matched. */
const DEFAULT_ENTRY: VocabularyEntry = {
  word: "inconspicuous",
  partOfSpeech: "adjective",
  definition: "Not easily noticed or attracting attention.",
  keywords: [],
  example: "The inconspicuous drainpipe turned out to be home to a small, determined plant.",
};

/**
 * Choose the best-fitting vocabulary entry for a reflection using the local
 * dataset. Returns a fully-formed, honestly-labeled local suggestion.
 */
export function suggestVocabularyLocally(reflection: string): VocabularySuggestion {
  const text = reflection.toLowerCase().replace(/\s+/g, " ").trim();

  let best: VocabularyEntry | null = null;
  let bestScore = 0;

  for (const entry of VOCABULARY) {
    const score = scoreEntry(entry, text);
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }

  // Below the threshold, an AI word would be a guess wearing a costume. The
  // local fallback keeps things useful without pretending to know more.
  if (!best || bestScore < MATCH_THRESHOLD) {
    const fallback = best ?? DEFAULT_ENTRY;
    return {
      word: fallback.word,
      partOfSpeech: fallback.partOfSpeech,
      definition: fallback.definition,
      whyItFits:
        "Your reflection was short, so here is a word the app can vouch for on its own: it suits the quiet, noticing sort of outing you just took.",
      example: fallback.example,
      challenge: `Try rewriting one sentence from your reflection using the word "${fallback.word}". Even one honest sentence is enough.`,
      source: "local",
    };
  }

  return {
    word: best.word,
    partOfSpeech: best.partOfSpeech,
    definition: best.definition,
    whyItFits:
      "This word comes from the app's own small word collection — it matched phrases in what you wrote, so it may fit how you described things.",
    example: best.example,
    challenge: `Try rewriting one sentence from your reflection using the word "${best.word}". See if it can carry what you actually noticed.`,
    source: "local",
  };
}

export const localVocabularySize = VOCABULARY.length;
