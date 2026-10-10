
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { reflection } = await request.json();

    if (
      typeof reflection !== "string" ||
      !reflection.trim() ||
      reflection.length > 3000
    ) {
      return NextResponse.json(
        { error: "Please enter a reflection under 3,000 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;

    if (!apiKey || !model) {
      return NextResponse.json(
        { error: "The vocabulary coach isn't configured yet." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
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
            {
              role: "system",
              content: `You are the vocabulary coach for Little Outside, a warm,
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
Return only the JSON object, with no markdown fences.`,
            },
            {
              role: "user",
              content: reflection.trim(),
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "The vocabulary coach couldn't respond. Please try again." },
        { status: 502 }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
      throw new Error("The model returned an empty response.");
    }

    const cleaned = content
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const wordCoach = JSON.parse(cleaned);

    const requiredFields = [
      "word",
      "partOfSpeech",
      "definition",
      "whyItFits",
      "example",
      "challenge",
    ];

    for (const field of requiredFields) {
      if (
        typeof wordCoach[field] !== "string" ||
        !wordCoach[field].trim()
      ) {
        throw new Error("The model returned an incomplete response.");
      }
    }

    return NextResponse.json({ wordCoach });
  } catch (error) {
    console.error("Vocabulary coach error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
