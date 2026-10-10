import type { VocabularySuggestion } from "../../data/vocabulary";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `You are the vocabulary coach for Little Outside, a warm,
thoughtful companion that helps people describe real-world experiences.

Read the user's reflection and suggest ONE useful English word or phrase
that fits what they actually described.

Return valid JSON with these fields:
{
  "word": "the word or phrase",
  "partOfSpeech": "part of speech",
  "definition": "a clear, simple definition",
  "whyItFits": "why this word fits their particular reflection",
  "example": "a natural example sentence based on their experience",
  "challenge": "a gentle prompt asking them to rewrite one sentence using the word"
}

Choose a word that adds precision, nuance, or vividness rather than
simply replacing an ordinary word with a complicated one.
Use accessible language, be encouraging but not patronizing, and never
invent details that aren't in the reflection.
If the reflection is very short or unclear, still offer a useful word
and acknowledge the limited context.
Return only the JSON object, with no markdown fences.`;

export function isOnlineProviderConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_MODEL);
}

const REQUIRED_FIELDS = [
  "word",
  "partOfSpeech",
  "definition",
  "whyItFits",
  "example",
  "challenge",
] as const;

/**
 * Ask OpenRouter for a vocabulary suggestion. Throws on any failure — the
 * AI layer (vocabulary.ts) is responsible for catching and falling back.
 */
export async function generateVocabularyOnline(
  reflection: string,
): Promise<VocabularySuggestion> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;

  if (!apiKey || !model) {
    throw new Error("The vocabulary coach isn't configured yet.");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 450,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: reflection.trim() },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("The vocabulary coach couldn't respond. Please try again.");
  }

  const result = await response.json();
  const content: unknown = result?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error("The model returned an empty response.");
  }

  const cleaned = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    throw new Error("The model returned an unreadable response.");
  }

  for (const field of REQUIRED_FIELDS) {
    if (typeof parsed[field] !== "string" || !(parsed[field] as string).trim()) {
      throw new Error("The model returned an incomplete response.");
    }
  }

  return {
    word: parsed.word as string,
    partOfSpeech: parsed.partOfSpeech as string,
    definition: parsed.definition as string,
    whyItFits: parsed.whyItFits as string,
    example: parsed.example as string,
    challenge: parsed.challenge as string,
    source: "ai",
  };
}
