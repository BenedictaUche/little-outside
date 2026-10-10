type PreferenceOptionProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

/**
 * One choice pill inside a preference row. Rendered as a toggle button with
 * aria-pressed so screen readers announce selection.
 */
export default function PreferenceOption({
  label,
  selected,
  onSelect,
}: PreferenceOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        "rounded-full border px-3.5 py-2 text-[11px] transition-colors",
        selected
          ? "border-[#b9a2d1] bg-lavender/70 text-[#634a76]"
          : "border-[#eadce8] bg-[#fffaf4] text-muted hover:border-[#c7b4da]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
