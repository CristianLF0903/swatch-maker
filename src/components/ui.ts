// Clases compartidas por los controles.
export const fieldLabel = "mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900";

export const segment = (active: boolean) =>
  `rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${focusRing} ${
    active
      ? "border-sky-600 bg-sky-600 text-white"
      : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
  }`;
