import Link from "next/link";

type CommonProps = {
  children: React.ReactNode;
  /** Render full-width (useful for mobile actions). */
  block?: boolean;
  className?: string;
};

type ButtonAsButton = CommonProps & {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: never;
  type?: never;
  disabled?: never;
};

const BASE_CLASSES = [
  "inline-flex h-[49px] items-center justify-center gap-3.5 rounded-[100px_100px_100px_35px]",
  "border border-plum bg-plum px-6 text-xs font-bold text-cream",
  "transition hover:-translate-y-0.5 hover:bg-plum-light hover:shadow-[0_7px_18px_#49324f20]",
  "active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:bg-plum",
];

/** The one plum, paper-cut storybook button used everywhere. */
export default function Button(props: ButtonAsButton | ButtonAsLink) {
  const { block, className = "" } = props;
  const classes = `${BASE_CLASSES.join(" ")} ${block ? "w-full" : "w-fit"} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {props.children}
      </Link>
    );
  }

  const { children, onClick, type = "button", disabled } = props as ButtonAsButton;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
