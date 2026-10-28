import { expect, it } from "vitest";
import { slug } from "./slug";

it("limpia tildes, ñ, espacios y símbolos", () => {
  expect(slug("Gris / Blanco Ñandú")).toBe("gris-blanco-nandu");
});
it("solo símbolos da vacío", () => {
  expect(slug("/// ¿?")).toBe("");
});
it("colapsa guiones", () => {
  expect(slug("--Rojo__Azul--")).toBe("rojo-azul");
});
