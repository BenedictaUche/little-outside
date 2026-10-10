import type { Mission } from "@/lib/ai/missions";
import MissionMeta from "./MissionMeta";

type MissionCardProps = {
  mission: Mission;
  time: string;
  budget: string;
  social: string;
  /** Extra UI rendered by the mission page inside the card (actions). */
  children?: React.ReactNode;
};

const COLOR_CLASSES = {
  lavender: "bg-lavender/60",
  peach: "bg-peach/50",
  rose: "bg-rose/40",
  butter: "bg-butter/50",
} as const;

/**
 * The paper card a mission rides on. Renders the mission copy itself;
 * stage-specific actions flow in through children.
 */
export default function MissionCard({
  mission,
  time,
  budget,
  social,
  children,
}: MissionCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-[28px_28px_19px_28px] border border-[#e4d5e8] p-6 shadow-soft md:p-12 ${COLOR_CLASSES[mission.color]}`}
    >
      <div className="flex items-center justify-between gap-5">
        <span
          aria-hidden="true"
          className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-dashed border-[#c9b3d9] bg-white/50 text-[27px]"
        >
          {mission.emoji}
        </span>
      </div>

      <h1 className="mt-6 max-w-[570px] font-display text-[clamp(35px,5vw,53px)] font-medium leading-[1.12] tracking-[-2px] text-plum">
        {mission.title}
      </h1>
      <p className="mt-3 max-w-[560px] text-sm leading-[1.8] text-[#77667b]">
        {mission.intro}
      </p>

      <MissionMeta time={time} budget={budget} social={social} />

      <div className="mt-6">
        <h2 className="font-display text-2xl font-medium tracking-tight text-plum">
          Your little mission
        </h2>
        <ol className="my-5 grid list-none gap-4 p-0 [counter-reset:mission-step]">
          {mission.instructions.map((instruction) => (
            <li
              key={instruction}
              className="grid grid-cols-[30px_1fr] items-start gap-3 text-[13px] leading-[1.8] text-[#65566a] [counter-increment:mission-step]"
            >
              <span
                aria-hidden="true"
                className="grid h-[29px] place-items-center rounded-full border border-[#d9c9e9] bg-white/60 text-[10px] font-extrabold text-[#80679a] [content:counter(mission-step,decimal-leading-zero)]"
              >
                {mission.instructions.indexOf(instruction) + 1}
              </span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="my-7 flex items-start gap-3 rounded-[14px] border border-dashed border-[#d9c5d9] bg-[#fffaf2]/60 p-4">
        <span aria-hidden="true" className="text-[22px]">
          ☀
        </span>
        <p className="m-0 text-xs leading-[1.8] text-[#7c687e]">
          No need to take pictures or prove anything. Just go somewhere safe and
          see what you notice.
        </p>
      </div>

      {children}
    </article>
  );
}
