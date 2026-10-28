import { describe, expect, it } from "vitest";
import { EXTRA_COLORS, normalizeHex, resizeColors, syncHexText } from "./color";

describe("normalizeHex", () => {
  it("expande #abc a #aabbcc", () => {
    expect(normalizeHex("#abc")).toBe("#aabbcc");
  });
  it("acepta mayúsculas y sin #", () => {
    expect(normalizeHex("FFFFFF")).toBe("#ffffff");
    expect(normalizeHex(" #80A0C0 ")).toBe("#80a0c0");
  });
  it("rechaza hex inválido", () => {
    expect(normalizeHex("#12")).toBeNull();
    expect(normalizeHex("rojo")).toBeNull();
    expect(normalizeHex("#gggggg")).toBeNull();
    expect(normalizeHex("")).toBeNull();
  });
});

describe("resizeColors", () => {
  const base = ["#808080", "#ffffff"];
  it("agrega colores hasta n", () => {
    const out = resizeColors(base, 4);
    expect(out).toHaveLength(4);
    expect(out.slice(0, 2)).toEqual(base);
    out.forEach((c) => expect(normalizeHex(c)).toBe(c));
  });
  it("recorta sin huecos", () => {
    expect(resizeColors(resizeColors(base, 4), 2)).toEqual(base);
  });
  it("llega hasta 6", () => {
    expect(resizeColors(base, 6)).toHaveLength(6);
  });
});

describe("syncHexText", () => {
  it("conserva lo escrito si ya equivale al valor (#1f4 a medio escribir)", () => {
    expect(syncHexText("#1f4", "#11ff44")).toBe("#1f4");
    expect(syncHexText("#808", "#880088")).toBe("#808");
    expect(syncHexText("#FFFFFF", "#ffffff")).toBe("#FFFFFF");
  });
  it("toma el valor externo si cambió (selector, intercambiar)", () => {
    expect(syncHexText("#1f4", "#000000")).toBe("#000000");
    expect(syncHexText("#12", "#808080")).toBe("#808080");
  });
});

describe("resizeColors usa EXTRA_COLORS en orden", () => {
  it("el tercer color es el primero de la lista", () => {
    expect(resizeColors(["#808080", "#ffffff"], 3)).toEqual(["#808080", "#ffffff", EXTRA_COLORS[0]]);
    expect(resizeColors(["#808080", "#ffffff"], 6).slice(2)).toEqual(EXTRA_COLORS.slice(0, 4));
  });
});
