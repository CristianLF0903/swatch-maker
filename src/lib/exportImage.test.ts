import { expect, it } from "vitest";
import { exportImage, extensionFor, svgToDataUrl } from "./exportImage";

it("svg sale como Blob image/svg+xml con el mismo contenido", async () => {
  const blob = await exportImage("<svg/>", "svg", 128);
  expect(blob.type).toBe("image/svg+xml");
  expect(await blob.text()).toBe("<svg/>");
});

it("extensiones por formato", () => {
  expect(extensionFor("png")).toBe("png");
  expect(extensionFor("jpg")).toBe("jpg");
  expect(extensionFor("svg")).toBe("svg");
});

it("data URL codifica el SVG", () => {
  const url = svgToDataUrl('<svg fill="url(#g)"/>');
  expect(url).toMatch(/^data:image\/svg\+xml;charset=utf-8,/);
  expect(url).not.toContain("#");
});
