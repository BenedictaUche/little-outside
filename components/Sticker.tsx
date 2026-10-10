type StickerVariant = "plain" | "pink";

type StickerProps = {
  children: React.ReactNode;
  variant?: StickerVariant;
  tilt?: "left" | "right" | "none";
  className?: string;
};

const TILT: Record<NonNullable<StickerProps["tilt"]>, string> = {
  left: "-rotate-3",
  right: "rotate-2",
  none: "",
};

const VARIANTS: Record<StickerVariant, string> = {
  plain:
    "border-[#e5d5df] bg-[#fffaf1] text-[#94768d]",
  pink: "border-[#e4c3d2] bg-[#fff5f0] text-[#a26f89]",
};

export default function Sticker({
  children,
  variant = "plain",
  tilt = "left",
  className = "",
}: StickerProps) {
  return (
    <span
      className={`inline-block rounded-[5px_12px_5px_12px] border px-3 py-2 font-display text-xs italic shadow-sm ${VARIANTS[variant]} ${TILT[tilt]} ${className}`}
    >
      {children}
    </span>
  );
}
