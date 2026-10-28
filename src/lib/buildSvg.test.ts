import { describe, expect, it } from "vitest";
import type { Orientation } from "../types";
import { buildSvg } from "./buildSvg";

const stops = (svg: string) => [...svg.matchAll(/<stop offset="([\d.]+)" stop-color="(#[0-9a-f]{6})"\/>/g)];

describe("buildSvg", () => {
  it("2 colores diagonal-left: 4 stops y vector 0,0 → 1,1", () => {
    const svg = buildSvg(["#808080", "#ffffff"], "diagonal-left", 128);
    expect(stops(svg)).toHaveLength(4);
    expect(svg).toContain('x1="0" y1="0" x2="1" y2="1"');
    expect(svg).toContain('width="128" height="128" viewBox="0 0 128 128"');
    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).toContain('<rect width="128" height="128" fill="url(#g)"/>');
  });

  it.each([2, 3, 4, 5, 6])("%i colores: 2N stops con offsets i/N", (n) => {
    const colors = Array.from({ length: n }, (_, i) => `#${String(i).repeat(6)}`);
    const found = stops(buildSvg(colors, "vertical", 64));
    expect(found).toHaveLength(2 * n);
    colors.forEach((color, i) => {
      const [a, b] = [found[2 * i], found[2 * i + 1]];
      expect(a[2]).toBe(color);
      expect(b[2]).toBe(color);
      expect(Number(a[1])).toBeCloseTo(i / n, 4);
      expect(Number(b[1])).toBeCloseTo((i + 1) / n, 4);
    });
  });

  it.each<[Orientation, string]>([
    ["horizontal", 'x1="0" y1="0" x2="0" y2="1"'],
    ["vertical", 'x1="0" y1="0" x2="1" y2="0"'],
    ["diagonal-left", 'x1="0" y1="0" x2="1" y2="1"'],
    ["diagonal-right", 'x1="1" y1="0" x2="0" y2="1"'],
  ])("%s usa su vector", (orientation, vector) => {
    expect(buildSvg(["#808080", "#ffffff"], orientation, 128)).toContain(vector);
  });
});
