import type { Format } from "../types";
import { fieldLabel, segment } from "./ui";

const FORMATS: { value: Format; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPG" },
  { value: "svg", label: "SVG" },
];

interface Props {
  value: Format;
  onChange: (f: Format) => void;
}

export function FormatSelect({ value, onChange }: Props) {
  return (
    <fieldset>
      <legend className={fieldLabel}>Formato</legend>
      <div className="flex gap-2">
        {FORMATS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={value === f.value}
            className={segment(value === f.value)}
            onClick={() => onChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
