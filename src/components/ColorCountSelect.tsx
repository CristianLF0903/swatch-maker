import { fieldLabel, segment } from "./ui";

const COUNTS = [2, 3, 4, 5, 6];

interface Props {
  value: number;
  onChange: (n: number) => void;
}

export function ColorCountSelect({ value, onChange }: Props) {
  return (
    <fieldset>
      <legend className={fieldLabel}>Número de colores</legend>
      <div className="flex flex-wrap gap-2">
        {COUNTS.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            className={`${segment(value === n)} w-11`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
