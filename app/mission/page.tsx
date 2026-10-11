"use client";

import { useMemo, useState, useEffect } from "react";
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
import { saveSession, saveWord, getDraft, saveDraft, clearDraft } from "@/lib/storage";
import type { SessionDraft } from "@/lib/storage/sessions";

type Stage = "mission" | "reflect" | "word";

export default function MissionPage() {
  const [stage, setStage] = useState<Stage>("mission");
  const [reflection, setReflection] = useState("");
  const [rewrite, setRewrite] = useState("");
  const [suggestion, setSuggestion] = useState<VocabularySuggestion | null>(
    null,
  );
  const [loadingWord, setLoadingWord] = useState(false);
  const [wordError, setWordError] = useState("");
  const [kept, setKept] = useState(false);
  const [draft, setDraft] = useState<SessionDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const currentDraft = await getDraft();
        if (currentDraft) {
          setDraft(currentDraft);
          setStage(currentDraft.stage);
          setReflection(currentDraft.reflection);
          setRewrite(currentDraft.rewrite);
        }
      } catch (e) {
        console.error("Failed to hydrate draft:", e);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  const preferences = draft?.handoff.preferences;
  const seed = draft?.handoff.seed ?? 0;

  // Mission pick is derived purely from the handoff data, no randomness
  // in render, so the prerender and the hydration pass agree.
  const mission = useMemo<Mission | null>(
    () => (preferences ? generateMission(preferences, seed) : null),
    [preferences, seed],
  );

  const missionTitle = mission?.title ?? "your mission";
  const missionIntensity = mission?.intensity ?? "a little walk";

  async function handleReflectionChange(text: string) {
    setReflection(text);
    setTimeout(async () => {
      await saveDraft({ reflection: text });
    }, 800);
  }

  async function handleRewriteChange(text: string) {
    setRewrite(text);
    setTimeout(async () => {
      await saveDraft({ rewrite: text });
    }, 800);
  }

  async function findMyWords() {
    if (!reflection.trim()) return;

    setLoadingWord(true);
    setWordError("");
    setSuggestion(null);

    try {
      const suggestion = await requestVocabulary(reflection);
      setSuggestion(suggestion);
      setStage("word");
      await saveDraft({ stage: "word" });
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
        wordDefinition: suggestion.definition,
        wordPartOfSpeech: suggestion.partOfSpeech,
        wordSource: suggestion.source,
      });
      await saveWord({
        suggestion,
        reflection: reflection.trim(),
      });
      await clearDraft();
      void session;
    } catch (error) {
      console.warn("Could not save locally:", error);
    }
  }

  const isOfflineSafe = suggestion?.source === "local";

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <TopBar />
        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
          <span className="animate-pulse text-plum/40">Preparing your adventure...</span>
        </div>
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
                onChange={handleReflectionChange}
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
                  onChange={handleRewriteChange}
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
