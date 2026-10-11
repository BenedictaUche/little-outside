"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sticker from "@/components/Sticker";
import TopBar from "@/components/TopBar";
import WordCard from "@/components/WordCard";
import { listSessions, listWords, type StoredSession, type StoredWord } from "@/lib/storage";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function JournalPage() {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [words, setWords] = useState<StoredWord[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listSessions(), listWords()])
      .then(([nextSessions, nextWords]) => {
        if (!cancelled) {
          setSessions(nextSessions);
          setWords(nextWords);
        }
      })
      .catch((error) => console.warn("Could not read journal:", error))
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hasContent = sessions.length > 0 || words.length > 0;

  return (
    <main className="mx-auto w-[min(760px,calc(100%-40px))]">
      <TopBar trailing={{ href: "/", label: "← Back home" }} />

      <section className="py-10">
        <h1 className="font-display text-[clamp(35px,5vw,53px)] font-medium leading-[1.12] tracking-[-2px] text-plum">
          Your journal
        </h1>
        <p className="mt-3 max-w-140 text-sm leading-[1.8] text-[#77667b]">
          Everything you&apos;ve kept lives right here on your device, always
          available, even when the internet isn&apos;t.
        </p>

        {hasContent && (
          <Link
            href="/"
            className="mt-4 inline-flex h-10 w-fit items-center justify-center gap-3.5 rounded-[100px_100px_100px_35px] border border-plum bg-plum px-5 text-xs font-bold text-cream no-underline transition hover:-translate-y-0.5 hover:bg-plum-light"
          >
            Start another adventure ↗
          </Link>
        )}

        {!ready && <p className="mt-8 text-xs text-muted">Opening your pages…</p>}

        {ready && !hasContent && (
          <div className="mt-8 flex flex-col items-start gap-5 rounded-[24px_19px_25px_19px] border border-dashed border-[#d9c6d9] bg-pink-paper p-6">
            <span aria-hidden="true" className="text-[36px] text-[#c18ca9]">
              ✿
            </span>
            <p className="m-0 text-sm leading-[1.8] text-[#7c687e]">
              Nothing tucked away yet. Your first adventure will land here once
              you keep a word.
            </p>
            <Link
              href="/"
              className="inline-flex h-12.25 w-fit items-center justify-center gap-3.5 rounded-[100px_100px_100px_35px] border border-plum bg-plum px-6 text-xs font-bold text-cream no-underline transition hover:-translate-y-0.5 hover:bg-plum-light"
            >
              Plan an adventure ↗
            </Link>
          </div>
        )}

        {ready && sessions.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-2xl font-medium tracking-tight text-plum">
              Outings
            </h2>
            <ul className="mt-4 grid gap-4">
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className="rounded-[19px_19px_12px_19px] border border-[#eadce8] bg-paper p-5 shadow-sm"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <strong className="font-display text-lg text-plum">
                      {session.missionTitle}
                    </strong>
                    <span className="text-[11px] text-[#a08fa3]">
                      {formatDate(session.createdAt)}
                    </span>
                  </div>
                  <Sticker tilt="right" className="mt-2">
                    {session.missionIntensity} · {session.preferences.time} ·{" "}
                    {session.preferences.budget}
                  </Sticker>
                  {session.word && (
                    <div className="mt-3">
                      <p className="text-[13px] leading-[1.8] text-[#76677a]">
                        <span className="font-bold">A word for it:</span>{" "}
                        <span className="font-medium">{session.word}</span>
                        {session.wordPartOfSpeech && (
                          <>
                            {" "}<span className="italic text-[#a26f89]">({session.wordPartOfSpeech})</span>
                          </>
                        )}
                      </p>
                      {session.wordDefinition && (
                        <p className="mt-1 text-[12px] leading-[1.7] text-[#806d83]">
                          {session.wordDefinition}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="mt-2 wrap-break-word border-l-2 border-lavender pl-3 text-[13px] leading-[1.8] text-[#65566a]">
                    {session.reflection}
                  </p>
                  {session.rewrite && (
                    <p className="mt-2 wrap-break-word pl-3 text-[13px] italic leading-[1.8] text-[#806d83]">
                      In your own words: {session.rewrite}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {ready && words.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-medium tracking-tight text-plum">
              Words you&apos;ve kept
            </h2>
            <div className="mt-4 grid gap-6">
              {words.map((word) => (
                <WordCard key={word.id} word={word} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
