import { NextResponse } from "next/server";
import { generateVocabulary, isReflectionValid } from "@/lib/ai/vocabulary";

export async function POST(request: Request) {
  let reflection: string;

  try {
    const body = await request.json();
    reflection = body.reflection;
  } catch {
    return NextResponse.json(
      { error: "Please enter a reflection under 3,000 characters." },
      { status: 400 },
    );
  }

  if (!isReflectionValid(reflection)) {
    return NextResponse.json(
      { error: "Please enter a reflection under 3,000 characters." },
      { status: 400 },
    );
  }

  try {
    const suggestion = await generateVocabulary(reflection);
    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("Vocabulary generation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
