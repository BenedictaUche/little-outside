import PreferenceOption from "./PreferenceOption";

type PreferenceRowProps = {
  icon: string;
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

/** A labeled group of preference pills inside the preferences paper. */
export default function PreferenceRow({
  icon,
  title,
  options,
  value,
  onChange,
}: PreferenceRowProps) {
  return (
    <div>
      <span className="mb-3 block text-[11px] font-extrabold tracking-wide text-[#77647b]">
        <span aria-hidden="true" className="mr-2 text-sm">
          {icon}
        </span>
        {title}
      </span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={title}>
        {options.map((option) => (
          <PreferenceOption
            key={option}
            label={option}
            selected={value === option}
            onSelect={() => onChange(option)}
          />
        ))}
      </div>
    </div>
  );
}
