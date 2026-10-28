import { describe, expect, it } from "vitest";
import { nearestColorName } from "./colorName";
import { resolveFileName, suggestFileName } from "./fileName";

const grisBlanco = ["#808080", "#ffffff"];

describe("nearestColorName", () => {
  it("nombra colores base", () => {
    expect(nearestColorName("#808080")).toBe("gris");
    expect(nearestColorName("#fefefe")).toBe("blanco");
    expect(nearestColorName("#000000")).toBe("negro");
    expect(nearestColorName("#e00000")).toBe("rojo");
  });
});

describe("suggestFileName", () => {
  it("une nombres con guion", () => {
    expect(suggestFileName(grisBlanco)).toBe("gris-blanco");
  });
  it("no deduplica colores repetidos", () => {
    expect(suggestFileName(["#808080", "#808080"])).toBe("gris-gris");
  });
});

describe("resolveFileName", () => {
  it("vacío usa el sugerido", () => {
    expect(resolveFileName("", grisBlanco)).toBe("gris-blanco");
  });
  it("solo símbolos usa el sugerido", () => {
    expect(resolveFileName("/// ¿?", grisBlanco)).toBe("gris-blanco");
  });
  it("respeta y limpia el nombre escrito", () => {
    expect(resolveFileName("Mi Color", grisBlanco)).toBe("mi-color");
  });
});
