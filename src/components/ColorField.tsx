import { useEffect, useId, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { normalizeHex, syncHexText } from "../lib/color";
import { focusRing } from "./ui";

interface Props {
  index: number;
  value: string;
  onChange: (hex: string) => void;
}

export function ColorField({ index, value, onChange }: Props) {
  const id = useId();
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const valid = normalizeHex(text) !== null;

  // Si el color cambia desde fuera (selector, intercambiar), se refleja en el texto.
  useEffect(() => setText((t) => syncHexText(t, value)), [value]);

  const handleText = (next: string) => {
    setText(next);
    const hex = normalizeHex(next);
    if (hex) onChange(hex);
  };

  return (
    <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Abrir selector del color ${index + 1}`}
          aria-expanded={open}
          aria-controls={`${id}-picker`}
          onClick={() => setOpen((o) => !o)}
          className={`size-10 shrink-0 rounded-lg border border-neutral-300 shadow-inner dark:border-neutral-600 ${focusRing}`}
          style={{ backgroundColor: value }}
        />
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Color {index + 1}
          </label>
          <input
            id={id}
            value={text}
            onChange={(e) => handleText(e.target.value)}
            onBlur={() => setText(value)}
            spellCheck={false}
            autoComplete="off"
            aria-invalid={!valid}
            aria-describedby={valid ? undefined : `${id}-error`}
            className={`w-full rounded-md border bg-white px-2 py-1 font-mono text-sm uppercase text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 ${focusRing} ${
              valid ? "border-neutral-300 dark:border-neutral-600" : "border-red-500"
            }`}
          />
        </div>
      </div>
      {!valid && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">
          Usa el formato #RRGGBB o #RGB.
        </p>
      )}
      {open && (
        <div id={`${id}-picker`} className="mt-3 [&_.react-colorful]:w-full">
          <HexColorPicker color={value} onChange={(hex) => onChange(normalizeHex(hex) ?? value)} />
        </div>
      )}
    </div>
  );
}
