import { nearestColorName } from "./colorName";
import { slug } from "./slug";

export function suggestFileName(colors: string[]): string {
  return colors.map(nearestColorName).join("-");
}

/** Nombre escrito por el usuario ya limpio; si queda vacío, el sugerido. */
export function resolveFileName(input: string, colors: string[]): string {
  return slug(input) || suggestFileName(colors);
}
