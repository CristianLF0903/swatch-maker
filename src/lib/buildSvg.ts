import type { Orientation } from "../types";

// Vector del degradado (x1, y1, x2, y2) en coordenadas relativas al cuadrado.
const VECTORS: Record<Orientation, [number, number, number, number]> = {
  horizontal: [0, 0, 0, 1],
  vertical: [0, 0, 1, 0],
  "diagonal-left": [0, 0, 1, 1],
  "diagonal-right": [1, 0, 0, 1],
};

const round = (n: number) => Number(n.toFixed(4));

/** SVG cuadrado con bandas de igual ancho: dos stops por color en cada corte. */
export function buildSvg(colors: string[], orientation: Orientation, size: number): string {
  const [x1, y1, x2, y2] = VECTORS[orientation];
  const n = colors.length;
  const stops = colors
    .map((color, i) =>
      [i / n, (i + 1) / n].map((offset) => `<stop offset="${round(offset)}" stop-color="${color}"/>`).join(""),
    )
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">` +
    `<defs><linearGradient id="g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops}</linearGradient></defs>` +
    `<rect width="${size}" height="${size}" fill="url(#g)"/>` +
    `</svg>`
  );
}
