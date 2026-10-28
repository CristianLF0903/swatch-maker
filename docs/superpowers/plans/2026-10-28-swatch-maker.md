# Swatch Maker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** App web estática que genera swatches cuadrados de 2 a 6 colores en bandas y los descarga en PNG, JPG o SVG.

**Architecture:** `buildSvg` produce un string SVG con un `linearGradient` de cortes duros; es la única fuente de verdad. La vista previa lo muestra como `<img>` con data URL, y `exportImage` lo rasteriza en `<canvas>` para PNG/JPG. La lógica pura vive en `src/lib/` con pruebas Vitest; la UI en `src/components/` y `src/App.tsx`.

**Tech Stack:** Vite, React, TypeScript, Tailwind v4 (`@tailwindcss/vite`), `react-colorful`, `lucide-react`, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-28-swatch-maker-design.md` (base: `swatch-maker.md`).

## Global Constraints

- Sin backend. Todo en el navegador.
- Colores: 2 a 6, por defecto 2: `#808080`, `#ffffff`. Hex normalizado a minúsculas `#rrggbb`.
- Orientación por defecto `diagonal-left`. Formato por defecto `png`. Tamaño por defecto `128`; opciones `64 | 128 | 256 | 512`.
- JPG exporta con calidad `0.95` y extensión `.jpg`.
- PNG de 128 px debe pesar menos de 5 KB.
- Tailwind: solo utilidades; `src/index.css` contiene solo `@import "tailwindcss";`. Modo oscuro con `dark:` según sistema.
- Interfaz en español. Campos con `<label>`, foco visible.
- `vite.config.ts` con `base: "/swatch-maker/"`.
- **Git: nunca `git commit`.** Solo `git add`. El usuario hace los commits. Los pasos "Stage" reemplazan los commits.

## Review Focus

1. Hex a medio escribir (`#12`): la vista previa conserva el último color válido y el campo marca error; no se rompe el SVG. Prueba en Task 2 (`normalizeHex`) + comportamiento en Task 5.
2. Nombre con solo símbolos (`"/// ¿?"`): `slug` da `""` y se usa el sugerido. Prueba en Task 2 (`resolveFileName`).
3. Hex en mayúsculas o sin `#` (`FFFFFF`): se acepta y normaliza. Prueba en Task 2.
4. Bajar de 4 a 2 colores y subir de nuevo: no quedan huecos, los nuevos toman colores de la lista fija. Prueba en Task 2 (`resizeColors`).
5. Mismo color repetido (`gris-gris`): nombre válido, no se deduplica. Prueba en Task 2.

---

### Task 1: Base del proyecto y git

**Files:**
- Create: `.gitignore`, `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`

**Interfaces:**
- Produces: scripts `npm run dev`, `npm run build`, `npm test` (`vitest run`).

- [ ] **Step 1:** `git init -b main`.
- [ ] **Step 2:** Escribir `.gitignore`: `node_modules/`, `dist/`, `*.log`, `.env*` (excepto `.env.example`), `.vscode/` salvo `extensions.json`, `.idea/`, `.DS_Store`, `Thumbs.db`, `coverage/`, y Claude Code: `.claude/`, `CLAUDE.local.md`, `.mcp.json`, `graphify-out/`.
- [ ] **Step 3:** Scaffold con plantilla Vite `react-ts` en el directorio actual (sin sobrescribir `swatch-maker.md` ni `docs/`). Instalar `tailwindcss @tailwindcss/vite react-colorful lucide-react` y `-D vitest`.
- [ ] **Step 4:** `vite.config.ts` con `react()`, `tailwindcss()`, `base: "/swatch-maker/"` y `test: { environment: "node" }` (importar `defineConfig` de `vitest/config`). `index.css` solo `@import "tailwindcss";`. `index.html` con `lang="es"` y título «Swatch Maker». `App.tsx` placeholder.
- [ ] **Step 5:** Run `npm run build`. Expected: build sin errores, `dist/` generado.

### Task 2: Lógica pura (color, slug, nombre)

**Files:**
- Create: `src/types.ts`, `src/lib/color.ts`, `src/lib/slug.ts`, `src/lib/colorName.ts`, `src/lib/fileName.ts`
- Test: `src/lib/color.test.ts`, `src/lib/slug.test.ts`, `src/lib/fileName.test.ts`

**Interfaces:**
- Produces:
  - `types.ts`: `Orientation = "horizontal" | "vertical" | "diagonal-left" | "diagonal-right"`, `Format = "png" | "jpg" | "svg"`, `Size = 64 | 128 | 256 | 512`, `SwatchConfig` como en el spec.
  - `normalizeHex(input: string): string | null` — acepta `#rgb`, `#rrggbb`, con o sin `#`, cualquier caja; devuelve `#rrggbb` minúsculas o `null`.
  - `resizeColors(colors: string[], n: number): string[]` — recorta o agrega desde `EXTRA_COLORS` (lista fija de 6 hex).
  - `slug(input: string): string`.
  - `nearestColorName(hex: string): string` — tabla de ~15 nombres base en español, distancia RGB euclidiana.
  - `suggestFileName(colors: string[]): string` — nombres unidos por `-`.
  - `resolveFileName(input: string, colors: string[]): string` — `slug(input) || suggestFileName(colors)`.

- [ ] **Step 1: Pruebas que fallan**

```ts
// color.test.ts
expect(normalizeHex("#abc")).toBe("#aabbcc");
expect(normalizeHex("FFFFFF")).toBe("#ffffff");
expect(normalizeHex("#12")).toBeNull();
expect(normalizeHex("rojo")).toBeNull();
expect(resizeColors(["#808080", "#ffffff"], 4)).toHaveLength(4);
expect(resizeColors(resizeColors(["#808080", "#ffffff"], 4), 2)).toEqual(["#808080", "#ffffff"]);
// slug.test.ts
expect(slug("Gris / Blanco Ñandú")).toBe("gris-blanco-nandu");
expect(slug("/// ¿?")).toBe("");
// fileName.test.ts
expect(nearestColorName("#808080")).toBe("gris");
expect(nearestColorName("#fefefe")).toBe("blanco");
expect(suggestFileName(["#808080", "#ffffff"])).toBe("gris-blanco");
expect(suggestFileName(["#808080", "#808080"])).toBe("gris-gris");
expect(resolveFileName("", ["#808080", "#ffffff"])).toBe("gris-blanco");
expect(resolveFileName("/// ¿?", ["#808080", "#ffffff"])).toBe("gris-blanco");
expect(resolveFileName("Mi Color", ["#808080", "#ffffff"])).toBe("mi-color");
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL, módulos no existen.
- [ ] **Step 3:** Implementar. `slug`: `normalize("NFD")`, quitar diacríticos, minúsculas, no alfanumérico a `-`, colapsar y recortar `-`.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5: Stage:** `git add src/`.

### Task 3: buildSvg

**Files:**
- Create: `src/lib/buildSvg.ts`
- Test: `src/lib/buildSvg.test.ts`

**Interfaces:**
- Produces: `buildSvg(colors: string[], orientation: Orientation, size: number): string`. Vectores: horizontal `0,0→0,1`; vertical `0,0→1,0`; diagonal-left `0,0→1,1`; diagonal-right `1,0→0,1`. Color `i` ocupa `[i/N, (i+1)/N]` con dos stops. `shape-rendering="crispEdges"`. Formato como el ejemplo del spec.

- [ ] **Step 1: Pruebas que fallan**

```ts
const svg = buildSvg(["#808080", "#ffffff"], "diagonal-left", 128);
expect(svg.match(/<stop /g)).toHaveLength(4);
expect(svg).toContain('x1="0" y1="0" x2="1" y2="1"');
expect(svg).toContain('width="128" height="128"');
// por cada N en 2..6: 2N stops y offsets i/N
// por cada orientación: su vector exacto (tabla de arriba)
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementar. Offsets redondeados a 4 decimales.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5: Stage:** `git add src/lib/`.

### Task 4: Exportación y descarga

**Files:**
- Create: `src/lib/exportImage.ts`, `src/lib/download.ts`
- Test: `src/lib/exportImage.test.ts`

**Interfaces:**
- Consumes: `buildSvg`, `Format`.
- Produces:
  - `svgToDataUrl(svg: string): string` — `data:image/svg+xml;charset=utf-8,` + `encodeURIComponent`.
  - `exportImage(svg: string, format: Format, size: number): Promise<Blob>` — svg: Blob `image/svg+xml`; png/jpg: `Image` + `<canvas>` + `toBlob(…, "image/png")` o `("image/jpeg", 0.95)`.
  - `extensionFor(format: Format): "png" | "jpg" | "svg"`.
  - `downloadBlob(blob: Blob, fileName: string): void` — `<a download>` temporal, click, `URL.revokeObjectURL`.

- [ ] **Step 1: Pruebas que fallan** (solo la rama SVG, que corre en Node)

```ts
const blob = await exportImage("<svg/>", "svg", 128);
expect(blob.type).toBe("image/svg+xml");
expect(extensionFor("jpg")).toBe("jpg");
expect(svgToDataUrl("<svg/>")).toMatch(/^data:image\/svg\+xml/);
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5: Stage:** `git add src/lib/`.

### Task 5: Interfaz

**Files:**
- Create: `src/components/ColorCountSelect.tsx`, `ColorField.tsx`, `OrientationPicker.tsx`, `FormatSelect.tsx`, `SizeSelect.tsx`, `Preview.tsx`, `FileNameInput.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: todo `src/lib/`.
- Estado en `App`: `colors`, `orientation`, `format`, `size`, `fileName` (texto crudo). Al cambiar colores, `fileName` vuelve a `""` y el placeholder muestra `suggestFileName`.
- `ColorField`: `HexColorPicker` (react-colorful) + `<input>` de texto. El texto se guarda local; solo se propaga si `normalizeHex` no es `null`; si es `null` el borde y `aria-invalid` marcan error.
- `OrientationPicker`: 4 botones `aria-pressed`, cada uno con un mini SVG de la división (generado con `buildSvg` de 2 colores).
- `Preview`: `<img>` grande, más versión 40 px cuadrada y redonda (`rounded-full`), nombre final `nombre.ext` y peso (`exportImage` en `useEffect`, mostrar en KB con 1 decimal o en bytes).
- Botones «Intercambiar» (`ArrowLeftRight`, invierte `colors`) y «Descargar» (`Download`).
- `SizeSelect` deshabilitado cuando `format === "svg"`, con nota «El SVG escala solo».
- Layout: `grid md:grid-cols-2`, una columna en celular. `focus-visible:ring`. `dark:` en fondos y textos.

- [ ] **Step 1:** Implementar componentes y `App`.
- [ ] **Step 2:** Run `npm run build`. Expected: sin errores de TS.
- [ ] **Step 3:** Verificar en navegador (`npm run dev`): cada control actualiza la vista al instante; las 4 orientaciones coinciden con el spec (diagonal-left: corte `/`, primer color arriba-izquierda); escribir `#12` no rompe la vista; descargar PNG, JPG y SVG abre bien; PNG 128 px < 5 KB.
- [ ] **Step 4: Stage:** `git add src/`.

### Task 6: GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`

- [ ] **Step 1:** Workflow: on push a `main` y `workflow_dispatch`; `actions/checkout@v4`, `actions/setup-node@v4` (node 20, cache npm), `npm ci`, `npm test`, `npm run build`, `actions/upload-pages-artifact@v3` con `dist`, `actions/deploy-pages@v4`. Permisos `pages: write`, `id-token: write`.
- [ ] **Step 2:** `README.md` corto: qué hace, `npm run dev`, `npm test`, despliegue (activar Pages → Source: GitHub Actions; ajustar `base` si cambia el nombre del repo).
- [ ] **Step 3:** Run `npm test && npm run build`. Expected: PASS y build OK.
- [ ] **Step 4: Stage final:** `git add .` y `git status` para confirmar que `.claude/`, `node_modules/` y `dist/` no aparecen.
