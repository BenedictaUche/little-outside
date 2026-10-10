/**
 * The illustrated garden that lives in the home hero. Purely decorative —
 * hidden from assistive tech.
 */
export default function GardenScene() {
  return (
    <div
      aria-hidden="true"
      className="relative grid min-h-[270px] place-items-center overflow-hidden border border-[#e8d9ed] bg-[linear-gradient(160deg,#f5eaff_0%,#fbe7df_53%,#fff0d2_100%)] [border-radius:42%_42%_23px_23px] md:min-h-[310px] md:[border-radius:48%_48%_25px_25px]"
    >
      <span className="absolute left-9 top-14 h-[23px] w-[72px] -rotate-[7deg] rounded-[30px] border border-[#e4d5e8] bg-[#fffaf8]" />
      <span className="absolute right-12 top-9 h-12 w-12 rounded-full border border-[#f0c86e] bg-butter shadow-[0_0_0_9px_#ffe99a38]" />

      {/* hills */}
      <div className="absolute -left-[15%] -right-[15%] bottom-0 h-[145px] -rotate-[5deg] rounded-[50%_50%_0_0] border border-[#9eb68b] bg-[#c4d5a9]" />
      <div className="absolute bottom-[-3px] left-[30%] right-[-25%] h-[120px] rotate-[9deg] rounded-[50%_50%_0_0] bg-[#d8dfb5]" />

      {/* flowers */}
      <span className="absolute bottom-[50px] left-[17%] text-[34px] text-rose -rotate-[12deg]">✿</span>
      <span className="absolute bottom-[73px] right-[16%] text-[27px] text-[#fff4a8] rotate-[12deg]">✿</span>
      <span className="absolute bottom-[27px] left-[47%] text-[25px] text-lavender">✿</span>

      {/* sparkles */}
      <span className="absolute left-[28%] top-[108px] text-[21px] text-[#ad8bc6]">✦</span>
      <span className="absolute right-[21%] top-[145px] text-[21px] text-[#c18ca9]">✧</span>

      {/* pumpkin */}
      <div className="absolute bottom-[28px] left-1/2 z-20 h-[75px] w-[100px] -translate-x-1/2 -rotate-[3deg] rounded-[48%_48%_43%_43%] border-2 border-[#bd7755] bg-[#f4ad7e] shadow-[inset_13px_0_0_#e99a6f,inset_-13px_0_0_#e99a6f]">
        <span className="absolute -top-[15px] left-[45px] h-5 w-3 rotate-[12deg] rounded-[4px_8px_2px_7px] border-2 border-[#82946b] bg-[#a2b17e]" />
        <span className="absolute left-[33px] top-8 h-2.5 w-8 rounded-[50%] border-b-2 border-[#9c604d]" />
      </div>

      <span className="absolute bottom-[15px] right-[15px] z-30 -rotate-[4deg] rounded-[5px_12px_5px_12px] border border-[#e5d5df] bg-[#fffaf1] px-3 py-2 font-display text-xs italic text-[#94768d]">
        your world, a little closer ♡
      </span>
    </div>
  );
}
