"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ActivityCard from "@/components/ActivityCard";
import GardenScene from "@/components/GardenScene";
import PreferenceRow from "@/components/PreferenceRow";
import TopBar from "@/components/TopBar";
import type {
  ActivityId,
  BudgetChoice,
  SessionPreferences,
  SocialChoice,
  TimeChoice,
} from "@/lib/types";

/**
 * The home flow is client-side because preferences are chosen here and
 * handed to the mission page through sessionStorage (a tiny handoff, not
 * storage: anything durable is written to IndexedDB later in the flow).
 */
const ACTIVITIES: {
  id: ActivityId;
  emoji: string;
  title: string;
  description: string;
  color: "lavender" | "peach" | "rose" | "butter";
}[] = [
  {
    id: "notice",
    emoji: "🌼",
    title: "Notice things",
    description: "Find little details hiding in plain sight.",
    color: "lavender",
  },
  {
    id: "vocabulary",
    emoji: "📖",
    title: "Find better words",
    description: "Put your experiences into words.",
    color: "peach",
  },
  {
    id: "talk",
    emoji: "🦋",
    title: "Talk to someone",
    description: "Try a tiny, low-pressure interaction.",
    color: "rose",
  },
  {
    id: "clear-head",
    emoji: "☁️",
    title: "Clear your head",
    description: "Give a thought some room to breathe.",
    color: "butter",
  },
];

const TIMES: TimeChoice[] = ["15 min", "30 min", "1 hour", "2+ hours"];
const BUDGETS: BudgetChoice[] = ["₦0", "₦1k", "₦5k+"];
const SOCIALS: SocialChoice[] = [
  "Just me",
  "A little interaction",
  "I'm feeling social",
];

export default function Home() {
  const router = useRouter();
  const [selectedActivities, setSelectedActivities] = useState<ActivityId[]>([
    "notice",
  ]);
  const [time, setTime] = useState<TimeChoice>("30 min");
  const [budget, setBudget] = useState<BudgetChoice>("₦0");
  const [social, setSocial] = useState<SocialChoice>("Just me");

  const toggleActivity = useCallback((id: ActivityId) => {
    setSelectedActivities((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }, []);

  function startAdventure() {
    if (selectedActivities.length === 0) return;

    const preferences: SessionPreferences = {
      activities: selectedActivities,
      time,
      budget,
      social,
    };

    // Seed the mission pick here, in the click handler, so rendering the
    // mission page later stays pure.
    const handoff = {
      preferences,
      seed: Math.floor(Math.random() * 100_000),
    };

    sessionStorage.setItem(
      "little-outside-handoff",
      JSON.stringify(handoff),
    );
    router.push("/mission");
  }

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-64px))] md:w-[min(100%-40px,760px)] max-[700px]:w-[calc(100%-32px)] max-[380px]:w-[calc(100%-24px)]">
      <TopBar
        trailing={{
          href: "/journal",
          label: "♡ My journal",
        }}
      />

      <section className="grid grid-cols-1 items-center gap-7 py-10 md:grid-cols-[minmax(0,1fr)_minmax(250px,0.8fr)] md:gap-7.5 md:py-16">
        <div className="relative z-10">
          <h1 className="my-4 max-w-137.5 font-display text-[clamp(43px,10vw,59px)] font-medium leading-[1.05] tracking-[-2.5px] text-plum md:my-4.5 md:text-[clamp(42px,6vw,68px)] md:tracking-[-3px]">
            Life is happening
            <br />
            <em className="font-normal not-italic text-[#9a78b6]">
              out there.
            </em>
          </h1>
          <p className="m-0 max-w-[440px] text-[13px] leading-[1.9] text-muted md:text-sm">
            Let&apos;s go find something lovely, learn a new word, or simply
            see the world a little differently.
          </p>
        </div>
        <GardenScene />
      </section>

      <section className="pb-16">
        <div className="mb-5 flex flex-col items-start justify-between gap-2 md:flex-row md:items-end md:gap-5">
          <div>
            <h2 className="mt-2 font-display text-[27px] font-medium tracking-[-1px] text-plum md:text-[29px]">
              What do you feel like doing?
            </h2>
            <p className="m-0 max-w-[300px] text-xs leading-[1.8] text-muted">
              Pick a few. You can change your mind.
            </p>
          </div>
          <span aria-hidden="true" className="text-base text-[#c7a4d2]">
            ✳
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {ACTIVITIES.map((activity) => (
            <ActivityCard
              key={activity.id}
              id={activity.id}
              emoji={activity.emoji}
              title={activity.title}
              description={activity.description}
              color={activity.color}
              selected={selectedActivities.includes(activity.id)}
              onToggle={toggleActivity}
            />
          ))}
        </div>

        <section className="mt-7 grid gap-6 rounded-[23px_23px_15px_23px] border border-[#eadce8] bg-paper p-5 shadow-soft md:grid-cols-3 md:p-8">
          <PreferenceRow
            icon="◷"
            title="How much time have you got?"
            options={TIMES}
            value={time}
            onChange={(value) => setTime(value as TimeChoice)}
          />
          <PreferenceRow
            icon="♡"
            title="What's the budget?"
            options={BUDGETS}
            value={budget}
            onChange={(value) => setBudget(value as BudgetChoice)}
          />
          <PreferenceRow
            icon="☀"
            title="People today?"
            options={SOCIALS}
            value={social}
            onChange={(value) => setSocial(value as SocialChoice)}
          />
        </section>

        <div className="mt-8 flex flex-col items-stretch gap-4 pb-16 sm:flex-row sm:items-center sm:justify-between sm:pb-[65px]">
          <div className="flex items-center gap-2.5 text-[11px] text-[#927b93]">
            <span aria-hidden="true" className="text-lg text-[#c18ca9]">
              🌷
            </span>
            <p className="m-0 leading-[1.7]">
              Your plans don&apos;t have to be grand
              <br />
              to make a lovely day.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-3.5 rounded-[100px_100px_100px_35px] border border-plum bg-plum px-6 py-[14px] text-xs font-bold text-cream transition hover:-translate-y-0.5 hover:bg-plum-light hover:shadow-[0_7px_18px_#49324f20] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
              disabled={selectedActivities.length === 0}
              onClick={startAdventure}
            >
              Let&apos;s go outside <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-1 border-t border-plum/10 py-6 text-[11px] text-muted sm:flex-row sm:justify-between">
        <span>Made for the curious, the daydreamers &amp; you.</span>
        <Link
          href="/journal"
          className="text-muted no-underline hover:text-plum"
        >
          Take the long way home ✿
        </Link>
      </footer>
    </main>
  );
}
