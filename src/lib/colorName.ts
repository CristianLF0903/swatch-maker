import { hexToRgb } from "./color";

const NAMES: [string, string][] = [
  ["blanco", "#ffffff"],
  ["negro", "#000000"],
  ["gris", "#808080"],
  ["gris-claro", "#c8c8c8"],
  ["gris-oscuro", "#404040"],
  ["rojo", "#d00000"],
  ["vinotinto", "#6d1a2a"],
  ["rosado", "#f4a6c0"],
  ["naranja", "#f28c28"],
  ["amarillo", "#f5d000"],
  ["beige", "#e8d8b8"],
  ["cafe", "#7a4a24"],
  ["verde", "#2e8b3a"],
  ["azul", "#1f4ea0"],
  ["azul-claro", "#7fb8e6"],
  ["morado", "#6a3d9a"],
];

/** Nombre base en español más cercano al hex, por distancia RGB. */
export function nearestColorName(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  let best = NAMES[0][0];
  let bestDist = Infinity;
  for (const [name, ref] of NAMES) {
    const [r2, g2, b2] = hexToRgb(ref);
    const dist = (r - r2) ** 2 + (g - g2) ** 2 + (b - b2) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = name;
    }
  }
  return best;
}
