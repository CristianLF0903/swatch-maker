# Swatch Maker

Genera imágenes cuadradas de swatch con 2 a 6 colores en bandas (horizontal, vertical o diagonal) para el metaobject Color de Shopify. Exporta PNG, JPG o SVG. Todo corre en el navegador.

Los colores de un solo tono no necesitan imagen: en Shopify basta con el código hex.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:5173/swatch-maker/
npm test        # pruebas (Vitest)
npm run build   # genera dist/
```

## Despliegue (GitHub Pages)

1. En el repo de GitHub: **Settings → Pages → Source: GitHub Actions**.
2. Cada push a `main` corre las pruebas, construye y publica (`.github/workflows/deploy.yml`).
3. La app queda en `https://<usuario>.github.io/swatch-maker/`.

Si el repo tiene otro nombre, cambia `base` en `vite.config.ts` a `"/<nombre-del-repo>/"`.

## Estructura

- `src/lib/buildSvg.ts`: genera el SVG (única fuente de verdad para vista previa y descargas).
- `src/lib/exportImage.ts`: SVG → Blob (PNG/JPG vía canvas).
- `src/lib/fileName.ts`, `colorName.ts`, `slug.ts`, `color.ts`: nombre sugerido y validación.
- `src/components/`: controles y vista previa.
- `docs/superpowers/`: diseño y plan de implementación.
