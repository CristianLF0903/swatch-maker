export type Orientation = "horizontal" | "vertical" | "diagonal-left" | "diagonal-right";
export type Format = "png" | "jpg" | "svg";
export type Size = 64 | 128 | 256 | 512;

export interface SwatchConfig {
  colors: string[]; // 2 a 6, "#rrggbb"
  orientation: Orientation;
  size: Size;
  format: Format;
  fileName: string;
}
