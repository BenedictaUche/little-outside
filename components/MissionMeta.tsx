type MissionMetaProps = {
  time: string;
  budget: string;
  social: string;
};

/** Small pills showing the preferences chosen for this outing. */
export default function MissionMeta({ time, budget, social }: MissionMetaProps) {
  const items = [
    { icon: "◷", label: time },
    { icon: "♡", label: budget },
    { icon: "✿", label: social },
  ];

  return (
    <div className="flex flex-wrap gap-2 py-6 md:py-7">
      {items.map((item) => (
        <span
          key={item.label}
          className="rounded-full border border-white/70 bg-paper/60 px-2.5 py-2 text-[11px] text-[#6f5b76]"
        >
          <span aria-hidden="true" className="mr-1.5">
            {item.icon}
          </span>
          {item.label}
        </span>
      ))}
    </div>
  );
}
