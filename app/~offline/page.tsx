import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <span
        aria-hidden="true"
        className="grid h-16 w-16 place-items-center rounded-full border border-lavender bg-white/60 text-3xl text-plum/70"
      >
        ☁
      </span>
      <h1 className="mt-6 max-w-md font-display text-4xl leading-tight tracking-tight text-plum">
        Looks like the air is a little thin out here.
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-8 text-muted">
        You&apos;re offline, and this page hasn&apos;t been tucked away in your
        pocket yet. The pages you&apos;ve visited before still work — try
        heading back home.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-[49px] items-center justify-center gap-3 rounded-[100px_100px_100px_35px] bg-plum px-6 text-xs font-bold text-cream transition hover:-translate-y-0.5 hover:bg-plum-light"
      >
        Put your feet back on the ground <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
