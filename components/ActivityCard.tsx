import { memo } from "react";
import type { ActivityId } from "@/lib/types";

type ActivityCardProps = {
  id: ActivityId;
  emoji: string;
  title: string;
  description: string;
  color: "lavender" | "peach" | "rose" | "butter";
  selected: boolean;
  onToggle: (id: ActivityId) => void;
};

const COLOR_CLASSES = {
  lavender: "bg-lavender/70",
  peach: "bg-peach/60",
  rose: "bg-rose/50",
  butter: "bg-butter/60",
} as const;

function ActivityCard({
  id,
  emoji,
  title,
  description,
  color,
  selected,
  onToggle,
}: ActivityCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(id)}
      className={`relative flex min-h-[170px] flex-col items-start overflow-hidden rounded-[19px_19px_12px_19px] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-card md:min-h-[185px] md:p-[21px_18px] ${
        selected
          ? "border-[#8c6da7] shadow-[0_0_0_3px_#dcd0ff80,0_8px_24px_#49324f0c]"
          : "border-transparent"
      } ${COLOR_CLASSES[color]}`}
    >
      <span
        aria-hidden="true"
        className="mb-5 grid h-[45px] w-[45px] place-items-center rounded-[15px_15px_9px_15px] border border-white/70 bg-white/60 text-[23px] md:mb-[22px]"
      >
        {emoji}
      </span>
      <span
        aria-hidden="true"
        className={`absolute right-3 top-3 grid h-[22px] w-[22px] place-items-center rounded-full border text-xs ${
          selected
            ? "border-plum bg-plum text-white"
            : "border-[#d8c8e7] bg-paper text-[#82669c]"
        }`}
      >
        {selected ? "✓" : "+"}
      </span>
      <span className="mb-1.5 font-display text-base font-semibold tracking-tight text-plum md:text-[17px]">
        {title}
      </span>
      <span className="text-[11px] leading-[1.8] text-[#796981]">
        {description}
      </span>
    </button>
  );
}

export default memo(ActivityCard);
