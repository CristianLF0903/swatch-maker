import { svgToDataUrl } from "../lib/exportImage";

interface Props {
  svg: string;
  fullName: string;
  bytes: number | null;
}

function formatBytes(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

export function Preview({ svg, fullName, bytes }: Props) {
  const src = svgToDataUrl(svg);
  return (
    <section aria-labelledby="preview-title" className="flex flex-col gap-5">
      <h2 id="preview-title" className="sr-only">
        Vista previa
      </h2>
      <img
        src={src}
        alt="Vista previa del swatch"
        className="aspect-square w-full max-w-56 self-center md:max-w-md rounded-2xl border border-neutral-200 shadow-sm dark:border-neutral-700"
      />
      <div className="flex items-center justify-center gap-6">
        <figure className="flex flex-col items-center gap-1">
          <img src={src} alt="" className="size-10 border border-neutral-300 dark:border-neutral-600" />
          <figcaption className="text-xs text-neutral-500 dark:text-neutral-400">Cuadrado</figcaption>
        </figure>
        <figure className="flex flex-col items-center gap-1">
          <img src={src} alt="" className="size-10 rounded-full border border-neutral-300 dark:border-neutral-600" />
          <figcaption className="text-xs text-neutral-500 dark:text-neutral-400">Redondo</figcaption>
        </figure>
      </div>
      <p className="text-center text-sm text-neutral-700 dark:text-neutral-300">
        <span className="font-mono font-medium">{fullName}</span>
        {bytes !== null && <span className="text-neutral-500 dark:text-neutral-400"> · {formatBytes(bytes)}</span>}
      </p>
    </section>
  );
}
