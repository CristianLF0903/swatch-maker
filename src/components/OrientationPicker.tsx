import { buildSvg } from "../lib/buildSvg";
import { svgToDataUrl } from "../lib/exportImage";
import type { Orientation } from "../types";
import { fieldLabel, segment } from "./ui";

const OPTIONS: { value: Orientation; label: string }[] = [
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
  { value: "diagonal-left", label: "Diagonal izq." },
  { value: "diagonal-right", label: "Diagonal der." },
];

interface Props {
  value: Orientation;
  onChange: (o: Orientation) => void;
}

export function OrientationPicker({ value, onChange }: Props) {
  return (
    <fieldset>
      <legend className={fieldLabel}>Orientación</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`${segment(value === o.value)} flex flex-col items-center gap-1.5`}
          >
            <img src={svgToDataUrl(buildSvg(["#525252", "#e5e5e5"], o.value, 24))} alt="" className="size-6 rounded" />
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
