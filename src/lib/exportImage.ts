import type { Format } from "../types";

const JPG_QUALITY = 0.95;

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function extensionFor(format: Format): "png" | "jpg" | "svg" {
  return format;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar el SVG"));
    img.src = src;
  });
}

/** SVG -> Blob. PNG/JPG se rasterizan en un canvas del tamaño elegido. */
export async function exportImage(svg: string, format: Format, size: number): Promise<Blob> {
  if (format === "svg") return new Blob([svg], { type: "image/svg+xml" });

  const img = await loadImage(svgToDataUrl(svg));
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");
  ctx.drawImage(img, 0, 0, size, size);

  const [type, quality] = format === "png" ? ["image/png", undefined] : ["image/jpeg", JPG_QUALITY];
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("No se pudo generar la imagen"))), type, quality);
  });
}
