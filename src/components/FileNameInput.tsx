import { useId } from "react";
import { fieldLabel } from "./ui";

interface Props {
  value: string;
  suggested: string;
  extension: string;
  onChange: (name: string) => void;
}

export function FileNameInput({ value, suggested, extension, onChange }: Props) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={fieldLabel}>
        Nombre del archivo
      </label>
      <div className="flex items-center rounded-lg border border-neutral-300 bg-white focus-within:ring-2 focus-within:ring-sky-500 dark:border-neutral-700 dark:bg-neutral-800">
        <input
          id={id}
          value={value}
          placeholder={suggested}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-describedby={`${id}-hint`}
          className="min-w-0 flex-1 rounded-l-lg bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-500 dark:text-neutral-100"
        />
        <span className="pr-3 text-sm text-neutral-500 dark:text-neutral-400">.{extension}</span>
      </div>
      <p id={`${id}-hint`} className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Vacío usa el sugerido. Se guarda en minúsculas, sin tildes ni espacios.
      </p>
    </div>
  );
}
