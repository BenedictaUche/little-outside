import Link from "next/link";

type TopBarProps = {
  /** Right-hand link; omit for pages that only need the brand. */
  trailing?: { href: string; label: string };
};

/**
 * The shared brand bar. Client pages can pass a trailing "Journal"/"Back"
 * link; server pages can render it statically.
 */
export default function TopBar({ trailing }: TopBarProps) {
  return (
    <header className="flex min-h-[82px] items-center justify-between gap-5 border-b border-plum/10">
      <Link
        href="/"
        aria-label="Little Outside home"
        className="inline-flex items-center gap-2.5 font-display text-[21px] font-bold tracking-[-0.02em] text-plum no-underline"
      >
        <span
          aria-hidden="true"
          className="grid h-[34px] w-[34px] place-items-center rounded-full border border-[#e6d7ee] bg-lavender/60 text-[21px] text-[#9273b2]"
        >
          ✿
        </span>
        <span>little outside</span>
      </Link>
      {trailing && (
        <Link
          href={trailing.href}
          className="text-xs text-muted no-underline transition-colors hover:text-plum"
        >
          {trailing.label}
        </Link>
      )}
    </header>
  );
}
