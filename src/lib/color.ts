const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Colores que toman los campos nuevos al subir el número de colores. */
export const EXTRA_COLORS = ["#000000", "#c8102e", "#1f4e99", "#2e7d32", "#f2c200", "#8b5a2b"];

/** Devuelve "#rrggbb" en minúsculas, o null si el texto no es un hex válido. */
export function normalizeHex(input: string): string | null {
  const match = HEX.exec(input.trim());
  if (!match) return null;
  let digits = match[1].toLowerCase();
  if (digits.length === 3) digits = [...digits].map((d) => d + d).join("");
  return `#${digits}`;
}

/** Ajusta la lista a n colores: recorta o agrega desde EXTRA_COLORS. */
export function resizeColors(colors: string[], n: number): string[] {
  if (n <= colors.length) return colors.slice(0, n);
  const added = Array.from({ length: n - colors.length }, (_, i) => EXTRA_COLORS[(colors.length + i) % EXTRA_COLORS.length]);
  return [...colors, ...added];
}

/** Texto a mostrar cuando cambia el valor: conserva lo escrito si ya equivale (p. ej. "#1f4" a medio escribir). */
export function syncHexText(text: string, value: string): string {
  return normalizeHex(text) === value ? text : value;
}

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
