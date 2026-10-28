import { ArrowLeftRight, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ColorCountSelect } from "./components/ColorCountSelect";
import { ColorField } from "./components/ColorField";
import { FileNameInput } from "./components/FileNameInput";
import { FormatSelect } from "./components/FormatSelect";
import { OrientationPicker } from "./components/OrientationPicker";
import { Preview } from "./components/Preview";
import { SizeSelect } from "./components/SizeSelect";
import { focusRing } from "./components/ui";
import { buildSvg } from "./lib/buildSvg";
import { resizeColors } from "./lib/color";
import { downloadBlob } from "./lib/download";
import { exportImage, extensionFor } from "./lib/exportImage";
import { resolveFileName, suggestFileName } from "./lib/fileName";
import type { Format, Orientation, Size } from "./types";

// Tamaño de referencia del SVG; el archivo SVG escala solo.
const SVG_SIZE = 128;

export default function App() {
  const [colors, setColorsState] = useState(["#808080", "#ffffff"]);
  const [orientation, setOrientation] = useState<Orientation>("diagonal-left");
  const [format, setFormat] = useState<Format>("png");
  const [size, setSize] = useState<Size>(128);
  const [fileName, setFileName] = useState("");
  const [bytes, setBytes] = useState<number | null>(null);

  // Al cambiar los colores, el nombre vuelve al sugerido.
  const setColors = (next: string[]) => {
    setColorsState(next);
    setFileName("");
  };

  const exportSize = format === "svg" ? SVG_SIZE : size;
  const svg = useMemo(() => buildSvg(colors, orientation, exportSize), [colors, orientation, exportSize]);
  const extension = extensionFor(format);
  const fullName = `${resolveFileName(fileName, colors)}.${extension}`;

  useEffect(() => {
    let cancelled = false;
    exportImage(svg, format, exportSize)
      .then((blob) => !cancelled && setBytes(blob.size))
      .catch(() => !cancelled && setBytes(null));
    return () => {
      cancelled = true;
    };
  }, [svg, format, exportSize]);

  const handleDownload = async () => {
    downloadBlob(await exportImage(svg, format, exportSize), fullName);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Swatch Maker</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Imágenes de colores combinados para el metaobject Color de Shopify.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <ColorCountSelect value={colors.length} onChange={(n) => setColors(resizeColors(colors, n))} />

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">Colores</legend>
              {colors.map((color, i) => (
                <ColorField
                  key={i}
                  index={i}
                  value={color}
                  onChange={(hex) => setColors(colors.map((c, j) => (j === i ? hex : c)))}
                />
              ))}
              <button
                type="button"
                onClick={() => setColors([...colors].reverse())}
                className={`inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950 ${focusRing}`}
              >
                <ArrowLeftRight className="size-4" aria-hidden />
                Intercambiar orden
              </button>
            </fieldset>

            <OrientationPicker value={orientation} onChange={setOrientation} />
            <FormatSelect value={format} onChange={setFormat} />
            <SizeSelect value={size} onChange={setSize} disabled={format === "svg"} />
            <FileNameInput
              value={fileName}
              suggested={suggestFileName(colors)}
              extension={extension}
              onChange={setFileName}
            />

            <button
              type="button"
              onClick={handleDownload}
              className={`inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-3 font-semibold text-white hover:bg-sky-700 ${focusRing}`}
            >
              <Download className="size-5" aria-hidden />
              Descargar
            </button>
          </form>

          {/* En celular la vista previa va primero para verla mientras se edita. */}
          <div className="order-first md:order-none md:sticky md:top-8 md:self-start">
            <Preview svg={svg} fullName={fullName} bytes={bytes} />
          </div>
        </div>
      </main>
    </div>
  );
}
