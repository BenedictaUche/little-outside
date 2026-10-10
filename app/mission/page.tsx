"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import MissionCard from "@/components/MissionCard";
import ReflectionForm from "@/components/ReflectionForm";
import TopBar from "@/components/TopBar";
import WordCard from "@/components/WordCard";
import StickerPanel from "@/components/StickerPanel";
import { generateMission, type Mission } from "@/lib/ai/missions";
import { requestVocabulary } from "@/lib/ai";
import type { VocabularySuggestion } from "@/lib/data/vocabulary";
import { saveSession, saveWord } from "@/lib/storage";
import type { SessionPreferences } from "@/lib/types";

const HANDOFF_KEY = "little-outside-handoff";

type Stage = "mission" | "reflect" | "word";

const NO_HANDOFF = Symbol("no-handoff");

/**
 * What the home page hands over: the chosen preferences plus a seed
 * generated at click time (event handlers may be random; render must not).
 */
type HandoffData = {
  preferences: SessionPreferences;
  seed: number;
};

type Handoff = HandoffData | typeof NO_HANDOFF | null;

let cachedRaw: string | null | undefined;
let cachedParsed: HandoffData | null;

function parseHandoff(raw: string): HandoffData | null {
  try {
    const parsed = JSON.parse(raw) as
      | (SessionPreferences & { seed?: number })
      | { preferences: SessionPreferences; seed?: number };
    const preferences = "preferences" in parsed ? parsed.preferences : parsed;
    if (!Array.isArray(preferences.activities) || preferences.activities.length === 0) {
      return null;
    }
    const seed =
      typeof parsed.seed === "number" && Number.isFinite(parsed.seed)
        ? parsed.seed
        : 0;
    return { preferences, seed };
  } catch {
    return null;
  }
}

function readHandoffSnapshot(): Handoff {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(HANDOFF_KEY);
  } catch {
    raw = null;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedParsed = raw ? parseHandoff(raw) : null;
  }

  return cachedParsed ?? NO_HANDOFF;
}

function getServerHandoffSnapshot(): Handoff {
  return null;
}

function subscribeHandoff(): () => void {
  return () => {};
}

export default function MissionPage() {
  const handoff = useSyncExternalStore(
    subscribeHandoff,
    readHandoffSnapshot,
    getServerHandoffSnapshot,
  );
  const preferences = handoff && handoff !== NO_HANDOFF ? handoff.preferences : null;
  const seed = handoff && handoff !== NO_HANDOFF ? handoff.seed : 0;

  const [stage, setStage] = useState<Stage>("mission");
  const [reflection, setReflection] = useState("");
  const [rewrite, setRewrite] = useState("");
  const [suggestion, setSuggestion] = useState<VocabularySuggestion | null>(
    null,
  );
  const [loadingWord, setLoadingWord] = useState(false);
  const [wordError, setWordError] = useState("");
  const [kept, setKept] = useState(false);

  // Mission pick is derived purely from the handoff data — no randomness
  // in render, so the prerender and the hydration pass agree.
  const mission = useMemo<Mission | null>(
    () => (preferences ? generateMission(preferences, seed) : null),
    [preferences, seed],
  );

  const missionTitle = mission?.title ?? "your mission";
  const missionIntensity = mission?.intensity ?? "a little walk";

  async function findMyWords() {
    if (!reflection.trim()) return;

    setLoadingWord(true);
    setWordError("");
    setSuggestion(null);

    try {
      const suggestion = await requestVocabulary(reflection);
      setSuggestion(suggestion);
      setStage("word");
    } catch (error) {
      setWordError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoadingWord(false);
    }
  }

  /** Persist session + word, then move on. */
  async function keepThisWord() {
    if (!preferences || !mission || !suggestion) return;
    setKept(true);

    try {
      const session = await saveSession({
        preferences,
        missionTitle,
        missionIntensity,
        reflection: reflection.trim(),
        rewrite: rewrite.trim() || undefined,
        word: suggestion.word,
        wordSource: suggestion.source,
      });
      await saveWord({
        suggestion,
        reflection: reflection.trim(),
      });
      void session;
    } catch (error) {
      console.warn("Could not save locally:", error);
    }
  }

  const isOfflineSafe = suggestion?.source === "local";

  if (handoff === null) {
    return (
      <main className="min-h-screen">
        <TopBar />
      </main>
    );
  }

  if (!preferences || !mission) {
    return (
      <main className="mx-auto w-[min(760px,calc(100%-40px))]">
        <TopBar />
        <section className="md:py-12 py-8">
          <h1 className="font-display text-[clamp(35px,5vw,53px)] font-medium leading-[1.12] tracking-[-2px] text-plum">
            Let&apos;s plan a little adventure.
          </h1>
          <p className="mt-3 text-sm leading-[1.8] text-muted">
            Choose what you&apos;re in the mood for first.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-[49px] w-fit items-center justify-center gap-3.5 rounded-[100px_100px_100px_35px] border border-plum bg-plum px-6 text-xs font-bold text-cream no-underline transition hover:-translate-y-0.5 hover:bg-plum-light"
          >
            Back to home ↗
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[min(100%-32px,760px)]">
      <TopBar trailing={{ href: "/", label: "← Back home" }} />

      <section className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[minmax(0,1fr)_230px] md:items-start md:gap-7 md:py-12">
        <MissionCard
          mission={mission}
          time={preferences.time}
          budget={preferences.budget}
          social={preferences.social}
        >
          {stage === "mission" && (
            <>
              <Button block onClick={() => setStage("reflect")}>
                I&apos;m ready <span aria-hidden="true">↗</span>
              </Button>

              <div className="mt-5 flex gap-4 rounded-[17px] border border-[#d7c9e5] bg-paper/70 p-4">
                <span aria-hidden="true" className="shrink-0 text-[27px]">
                  🌷
                </span>
                <div>
                  <strong className="font-display text-lg">
                    Off you go!
                  </strong>
                  <p className="m-0 mt-1 text-xs leading-[1.8] text-[#77667b]">
                    Put your phone away. Come back when you&apos;re ready to
                    tell me about it.
                  </p>
                </div>
              </div>
            </>
          )}

          {stage === "reflect" && (
            <>
              <ReflectionForm
                id="reflection"
                label="Tell me about something you saw, heard, or experienced."
                placeholder="I noticed..."
                value={reflection}
                onChange={setReflection}
              />
              <Button
                block
                className="mt-5"
                disabled={!reflection.trim() || loadingWord}
                onClick={findMyWords}
              >
                {loadingWord ? "Finding your words..." : "Find my words"}
                {!loadingWord && <span aria-hidden="true">↗</span>}
              </Button>
              {wordError && (
                <p role="alert" className="mt-3 text-[13px] leading-[1.6] text-[#a13c51]">
                  {wordError}
                </p>
              )}
            </>
          )}

          {stage === "word" && suggestion && (
            <>
              <blockquote className="my-6 rounded-[0_14px_14px_0] border-l-[3px] border-[#c2a9e8] bg-white/60 py-4 pl-5 pr-4">
                <span className="block text-[10px] font-extrabold uppercase leading-[1.6] tracking-[2px] text-[#9c789e]">
                  What you noticed
                </span>
                <p className="m-0 break-words font-display text-base leading-[1.8] text-plum">
                  {reflection}
                </p>
              </blockquote>

              <WordCard word={suggestion} />

              <div className="mt-5">
                <ReflectionForm
                  id="rewrite"
                  label={suggestion.challenge}
                  placeholder="Try putting it in your own words..."
                  value={rewrite}
                  onChange={setRewrite}
                  rows={4}
                  hideHint
                />
                <Button block className="mt-5" onClick={keepThisWord} disabled={!rewrite.trim() || kept}>
                  {kept ? "Kept in your journal ♡" : "Keep this word ♡"}
                </Button>
                {kept && (
                  <p
                    role="status"
                    className="mt-4 rounded-[14px] border border-[#e1d4eb] bg-[#f3e7fa] p-3.5 text-[13px] leading-[1.8] text-[#60446d]"
                  >
                    Lovely. You&apos;ve practiced using &quot;
                    {suggestion.word}&quot; in your own words. Keep noticing,
                    keep describing. 🌷
                  </p>
                )}
              </div>

              {isOfflineSafe && (
                <p className="mt-4 text-[11px] leading-[1.7] text-[#a08fa3]">
                  This word came from the app&apos;s local collection, so it
                  works even without internet.
                </p>
              )}

              <Link
                href="/journal"
                className="mt-6 inline-flex h-[49px] w-full items-center justify-center gap-3.5 rounded-[100px_100px_100px_35px] border border-plum bg-plum px-6 text-xs font-bold text-cream no-underline transition hover:-translate-y-0.5 hover:bg-plum-light sm:w-fit"
              >
                See your journal ↗
              </Link>
            </>
          )}
        </MissionCard>

        <StickerPanel />
      </section>
    </main>
  );
}
