import Sticker from "./Sticker";

/** The small, slightly tilted pink sticky-note panel beside the mission. */
export default function StickerPanel() {
  return (
    <aside className="rotate-1 rounded-[24px_19px_25px_19px] border border-dashed border-[#d9c6d9] bg-pink-paper p-5">
      <span aria-hidden="true" className="text-[36px] text-[#c18ca9]">
        ✿
      </span>
      <h2 className="mb-2.5 mt-3 font-display text-2xl font-medium tracking-tight text-plum">
        A little reminder
      </h2>
      <p className="m-0 text-xs leading-[1.9] text-[#806d83]">
        You don&apos;t have to make every moment productive. Sometimes noticing
        one small thing is enough.
      </p>
      <Sticker variant="pink" className="mt-3">
        take your time ♡
      </Sticker>
    </aside>
  );
}
