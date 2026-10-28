import type { Size } from "../types";
import { fieldLabel, segment } from "./ui";

const SIZES: Size[] = [64, 128, 256, 512];

interface Props {
  value: Size;
  onChange: (s: Size) => void;
  disabled: boolean;
}

export function SizeSelect({ value, onChange, disabled }: Props) {
  return (
    <fieldset disabled={disabled}>
      <legend className={fieldLabel}>Tamaño (px)</legend>
      <div className="flex flex-wrap gap-2">
        {SIZES.map((s) => (
          <button key={s} type="button" aria-pressed={value === s} className={segment(value === s)} onClick={() => onChange(s)}>
            {s}
          </button>
        ))}
      </div>
      {disabled && <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">El SVG escala solo.</p>}
    </fieldset>
  );
}
