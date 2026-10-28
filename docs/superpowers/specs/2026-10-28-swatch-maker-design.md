# Swatch Maker: diseño

Fuente base: `swatch-maker.md` (spec original). Este documento lo confirma y registra las decisiones tomadas en la conversación.

## Intención

El equipo de contenido de Madecentro necesita imágenes de swatch para los colores combinados del metaobject Color de Shopify. Los colores de un solo tono no llevan imagen: se carga el hex y el tema renderiza el swatch. Solo los combinados (2 o más colores) necesitan un archivo. Se crean con poca frecuencia, así que la herramienta debe ser simple, sin cuentas ni estado.

## Objetivos

- Generar un swatch cuadrado de 2 a 6 colores en bandas, con 4 orientaciones (horizontal, vertical, diagonal izquierda, diagonal derecha).
- Exportar en PNG (por defecto), JPG o SVG. Tamaño 64, 128 (por defecto), 256 o 512 px.
- Vista previa en vivo, más una vista a tamaño real en cuadrado y círculo.
- Nombre de archivo sugerido a partir de los colores y limpiado (minúsculas, sin tildes, espacios ni símbolos).
- Botón para invertir el orden de los colores.
- Todo en el navegador, interfaz en español, responsive, con accesibilidad básica y modo claro/oscuro.

## No objetivos

- Swatches de un solo color (el tema ya los resuelve con el hex).
- Guardar combinaciones en el navegador (decidido: no).
- Más de 6 colores (decidido: 6 es el máximo).
- Descarga en lote, importación CSV, subida directa a Shopify, bandas desiguales, formas no cuadradas.

## Anti-objetivos

- Un PNG de 128 px que pese más de 5 KB.
- Bordes borrosos entre colores en PNG o SVG.
- Cualquier dependencia de un backend.

## Restricciones

- Stack del spec: Vite, React, TypeScript, Tailwind v4 con `@tailwindcss/vite`, `react-colorful`, Vitest, `lucide-react`.
- El SVG es la única fuente de verdad. Preview, SVG, PNG y JPG salen de `buildSvg`.
- PNG/JPG se rasterizan con `<canvas>`. JPG con calidad 0.95.
- **Despliegue: GitHub Pages** (reemplaza la fase de Vercel del spec). Vite usa `base: "/swatch-maker/"`. Un workflow de GitHub Actions construye y publica `dist/` en cada push a `main`.

## Lo que decidió el usuario

- Máximo 6 colores, sin persistencia.
- Por defecto PNG 128×128.
- Hosting en GitHub Pages.
- Git: se inicializa el repo y se hace `git add .`. El usuario hace el commit.

## Decisiones del constructor (mi criterio)

- **Nombre sugerido:** una tabla pequeña de colores base en español (gris, blanco, negro, rojo, azul, verde, amarillo, naranja, café, beige, rosado, morado, etc.). Cada hex toma el nombre más cercano por distancia RGB. Ejemplo: `#808080` + `#FFFFFF` da `gris-blanco`. Si el usuario borra el campo, se usa el sugerido. Si el usuario escribe un nombre, se respeta mientras no cambien los colores.
- **Peso estimado:** se genera el blob del formato elegido en cada cambio y se muestra su tamaño real.
- **Nombre del repo** asumido `swatch-maker`. Si cambia, se ajusta `base` en `vite.config.ts`.
- **Colores por defecto:** `#808080` y `#FFFFFF`. Al subir el número de colores, los nuevos toman tonos de una lista fija.
- `.gitignore` incluye `node_modules`, `dist`, logs, `.env*`, archivos del editor, y todo lo de Claude Code: `.claude/`, `CLAUDE.local.md`, `.mcp.json`, `graphify-out/`.

## Pruebas (Vitest)

Las del spec: 4 stops y vector `0,0 → 1,1` con 2 colores diagonal izquierda; `2N` stops con offsets `i/N`; las 4 orientaciones; `slug("Gris / Blanco Ñandú")` da `gris-blanco-nandu`; hex inválido rechazado y `#abc` expandido; nombre vacío usa el sugerido. Se agrega una prueba del nombre de color más cercano.
