export type ReflectionFormProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  /** Hide the hint shown under the field. */
  hideHint?: boolean;
};

/** A paper-textured textarea for writing what you noticed. */
export default function ReflectionForm({
  id,
  label,
  placeholder,
  value,
  onChange,
  rows = 6,
  hideHint = false,
}: ReflectionFormProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-3 mt-7 block text-[13px] font-bold leading-[1.7] text-plum"
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="block min-h-[150px] w-full resize-y rounded-[15px] border border-[#d9c9e5] bg-paper/90 p-4 text-sm leading-[1.8] text-plum placeholder:text-[#b0a0b1] focus:border-[#a38acb] focus:outline focus:outline-[3px] focus:outline-lavender"
      />
      {!hideHint && (
        <p className="mt-2 text-[10px] leading-[1.7] text-[#a08fa3]">
          Saved on your device, not sent anywhere until you ask for a word.
        </p>
      )}
    </div>
  );
}
