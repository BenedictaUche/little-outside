import type { VocabularySuggestion } from "@/lib/data/vocabulary";

type WordCardProps = {
  word: VocabularySuggestion;
};

/**
 * The keepsake card for a vocabulary suggestion. Renders identically whether
 * the word came from the AI or the local library; the source shows honestly
 * as a small note.
 */
export default function WordCard({ word }: WordCardProps) {
  return (
    <aside className="relative my-6 overflow-hidden rounded-[20px_20px_12px_20px] border border-dashed border-[#c4addf] bg-[#fff8ed] p-6 md:p-[26px]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 right-3 text-[115px] text-rose opacity-60"
      >
        ✳
      </span>

      <span className="relative z-10 block text-[10px] font-extrabold uppercase leading-[1.6] tracking-[2px] text-[#9c789e]">
        A word to keep
      </span>
      <h2 className="relative z-10 mt-4 break-words font-display text-[clamp(30px,5vw,43px)] font-medium tracking-[-1.5px] text-plum">
        {word.word}
      </h2>
      <p className="relative z-10 m-0 mb-2 text-xs italic text-[#a26f89]">
        {word.partOfSpeech}
      </p>
      <p className="relative z-10 m-0 max-w-[450px] text-[13px] leading-[1.8] text-[#76677a]">
        {word.definition}
      </p>

      <div className="relative z-10 mt-5 border-t border-dashed border-[#e4d5e8] pt-4">
        <strong className="text-[13px]">Why this word?</strong>
        <p className="m-0 text-[13px] leading-[1.8] text-[#76677a]">
          {word.whyItFits}
        </p>
      </div>

      <div className="relative z-10 mt-5 border-t border-dashed border-[#e4d5e8] pt-4">
        <span className="block text-[10px] font-extrabold uppercase leading-[1.6] tracking-[2px] text-[#9c789e]">
          In context
        </span>
        <p className="m-0 mt-2 text-[13px] leading-[1.8] text-[#76677a]">
          {word.example}
        </p>
      </div>

      <p className="relative z-10 mt-4 text-[11px] italic text-[#a08fa3]">
        {word.source === "local"
          ? "From the app's own little word book — it works offline ♡"
          : "Found for you by the word coach, online ♡"}
      </p>
    </aside>
  );
}
