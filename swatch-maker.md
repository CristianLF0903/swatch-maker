# Swatch Maker: generador de imágenes de colores combinados

## 1. Descripción

Herramienta web para crear imágenes cuadradas de swatch con 2 o más colores divididos en bandas (por ejemplo Gris/Blanco con división diagonal). Se usa para subir la imagen al metaobject Color de Shopify. Todo corre en el navegador: no hay backend, no se suben datos a ningún servidor.

**Usuario:** equipo de contenido/e-commerce de Madecentro.
**Resultado:** un archivo liviano (menos de 5 KB) listo para subir a Shopify, con el nombre que el usuario elija.

## 2. Requisitos funcionales

| # | Requisito | Detalle |
|---|-----------|---------|
| 1 | Número de colores | Selector de 2 a 6 colores (por defecto 2). Al cambiarlo se agregan o quitan campos de color. |
| 2 | Color | Cada color se define con un selector visual y un campo de texto hex (`#RRGGBB`). Se valida el formato. |
| 3 | Orientación | Cuatro opciones: horizontal, vertical, diagonal izquierda, diagonal derecha. Por defecto diagonal izquierda. |
| 4 | Vista previa | Cuadro grande con la imagen en vivo, más una vista a tamaño real (swatch redondo y cuadrado) para ver cómo queda en la tienda. |
| 5 | Nombre | Campo de texto para el nombre del archivo. Sugerido automáticamente a partir de los colores (`gris-blanco`). Se limpia a minúsculas, sin tildes, espacios ni símbolos. |
| 6 | Formato | PNG (por defecto), JPG/JPEG y SVG. |
| 7 | Tamaño | Lado en píxeles: 64, 128 (por defecto), 256 o 512. No aplica al SVG, que escala solo. |
| 8 | Descarga | Botón «Descargar» que genera el archivo con `nombre.extensión`. |
| 9 | Intercambiar | Botón para invertir el orden de los colores. |

### Definición de orientaciones

Con 2 colores el primero queda en la primera zona y el segundo en la última.

- **Horizontal:** bandas apiladas, el primer color arriba.
- **Vertical:** bandas lado a lado, el primer color a la izquierda.
- **Diagonal izquierda:** línea de corte `/`. El primer color en la esquina superior izquierda.
- **Diagonal derecha:** línea de corte `\`. El primer color en la esquina superior derecha.

Con N colores las bandas son de igual ancho y siguen el mismo eje.

### Notas de formato

- JPG y JPEG son el mismo formato. Se ofrece una sola opción «JPG» y el archivo sale como `.jpg`.
- JPG no admite transparencia, pero la imagen siempre es opaca, así que no hay pérdida.
- Los bordes duros entre colores se ven mejor en PNG o SVG. En JPG pueden aparecer artefactos leves; se exporta con calidad 0.95.

## 3. Requisitos no funcionales

- Cero backend; funciona sin conexión una vez cargado.
- Archivos pequeños: PNG de 128 px cercano a 1 KB.
- Responsive (usable en celular), con accesibilidad básica: etiquetas en los campos, foco visible, contraste suficiente.
- Interfaz en español.

## 4. Stack y librerías

| Librería | Uso | Obligatoria |
|----------|-----|-------------|
| `vite` | Empaquetador y servidor de desarrollo | Sí |
| `react`, `react-dom` | Interfaz | Sí |
| `typescript` | Tipado | Sí |
| `tailwindcss` + `@tailwindcss/vite` | Estilos (Tailwind v4, plugin de Vite, sin archivo de configuración) | Sí |
| `react-colorful` | Selector de color liviano (~2 KB) con entrada hex | Sí |
| `vitest` | Pruebas del generador de SVG | Sí |
| `lucide-react` | Iconos (descargar, intercambiar) | Opcional |
| `jszip` | Descarga en lote (.zip) en una fase posterior | Opcional |

No se usa librería de exportación: el PNG/JPG se genera rasterizando el SVG en un `<canvas>` y el archivo se descarga con un enlace temporal (`URL.createObjectURL`).

## 5. Arquitectura

**Idea central:** el SVG es la única fuente de verdad. La vista previa, el SVG descargable, el PNG y el JPG salen de la misma función.

```
swatch-maker/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ index.css                  // @import "tailwindcss";
│  ├─ lib/
│  │  ├─ buildSvg.ts             // (colores, orientación, tamaño) -> string SVG
│  │  ├─ buildSvg.test.ts
│  │  ├─ exportImage.ts          // SVG -> Blob (png | jpg | svg)
│  │  ├─ download.ts             // Blob + nombre -> descarga
│  │  ├─ slug.ts                 // limpia el nombre de archivo
│  │  └─ color.ts                // valida y normaliza hex
│  ├─ components/
│  │  ├─ ColorCountSelect.tsx
│  │  ├─ ColorField.tsx          // react-colorful + input hex
│  │  ├─ OrientationPicker.tsx   // 4 botones con icono de la división
│  │  ├─ FormatSelect.tsx
│  │  ├─ SizeSelect.tsx
│  │  ├─ Preview.tsx
│  │  └─ FileNameInput.tsx
│  └─ types.ts
```

### Tipos

```ts
type Orientation = "horizontal" | "vertical" | "diagonal-left" | "diagonal-right";
type Format = "png" | "jpg" | "svg";
interface SwatchConfig {
  colors: string[];        // 2 a 6, "#RRGGBB"
  orientation: Orientation;
  size: 64 | 128 | 256 | 512;
  format: Format;
  fileName: string;
}
```

### Generación del SVG

Un `<linearGradient>` con **cortes duros** (dos stops por color en el mismo punto) sobre un `<rect>` cuadrado. Solo cambia el vector del degradado:

| Orientación | x1,y1 → x2,y2 |
|-------------|----------------|
| horizontal | 0,0 → 0,1 |
| vertical | 0,0 → 1,0 |
| diagonal-left | 0,0 → 1,1 |
| diagonal-right | 1,0 → 0,1 |

Para N colores, el color `i` ocupa el tramo `[i/N, (i+1)/N]`, con dos stops por tramo. Se agrega `shape-rendering="crispEdges"` para que el corte sea nítido.

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" shape-rendering="crispEdges">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#808080"/><stop offset="0.5" stop-color="#808080"/>
      <stop offset="0.5" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFFFFF"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" fill="url(#g)"/>
</svg>
```

### Exportación

- **SVG:** el string tal cual, `Blob` con tipo `image/svg+xml`.
- **PNG/JPG:** crear `Image` desde el SVG (data URL), dibujar en `<canvas>` del tamaño elegido, `canvas.toBlob(cb, "image/png")` o `"image/jpeg", 0.95`.
- **Descarga:** `<a download="nombre.ext" href=blobURL>` creado y clicado por código; luego `URL.revokeObjectURL`.

Nota: en este proyecto el `download` funciona porque es una app propia en su propio dominio (en las páginas publicadas dentro de Claude está bloqueado).

## 6. Interfaz

Una sola pantalla en dos columnas (una en celular):

- **Izquierda, controles:** número de colores, un campo por color (con selector), orientación, formato, tamaño, nombre y botón «Descargar».
- **Derecha, vista previa:** imagen grande, y debajo la vista a tamaño real en cuadrado y círculo, con el nombre final del archivo (`gris-blanco.png`) y el peso estimado.

Estilos con Tailwind: utilidades directas, sin CSS propio salvo `@import "tailwindcss"`. Soporte de modo claro y oscuro con `dark:` según el sistema.

## 7. Plan de trabajo

| Fase | Entregable | Criterio de listo |
|------|------------|-------------------|
| 1. Base | Proyecto Vite + React + TS + Tailwind funcionando | `npm run dev` abre la página |
| 2. Núcleo | `buildSvg`, `slug`, `color` con pruebas | Pruebas pasan: 2 a 6 colores y las 4 orientaciones |
| 3. Interfaz | Controles y vista previa en vivo | Cambiar cualquier control actualiza la imagen al instante |
| 4. Exportación | PNG, JPG y SVG con descarga | Los tres archivos abren bien y el PNG de 128 px pesa menos de 5 KB |
| 5. Pulido | Nombre sugerido, validaciones, responsive, accesibilidad | Se usa bien en celular y con teclado |
| 6. Despliegue | Publicado en Vercel (sitio estático) | URL pública accesible para el equipo |

### Pruebas (Vitest)

- `buildSvg` con 2 colores diagonal-left: contiene 4 stops y el vector `0,0 → 1,1`.
- Con N colores: el número de stops es `2N` y los offsets son `i/N`.
- `slug("Gris / Blanco Ñandú")` devuelve `gris-blanco-nandu`.
- Hex inválido (`#12`, `rojo`) se rechaza; `#abc` se expande a `#aabbcc`.
- El nombre vacío usa el sugerido.

## 8. Comandos de arranque

```bash
npm create vite@latest swatch-maker -- --template react-ts
cd swatch-maker
npm install tailwindcss @tailwindcss/vite react-colorful
npm install -D vitest
# opcional
npm install lucide-react
```

`vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({ plugins: [react(), tailwindcss()] });
```

`src/index.css`:

```css
@import "tailwindcss";
```

## 9. Fuera de alcance (fase posterior)

- Descarga en lote de varias combinaciones en un `.zip` (con `jszip`).
- Importar una lista CSV de combinaciones («Gris/Blanco», «Gris/Negro»).
- Subida directa a Shopify desde la herramienta (requiere backend y credenciales de la API).
- Bandas de ancho desigual y formas distintas al cuadrado (círculo, mitades).

## 10. Decisiones abiertas

- ¿Máximo de 6 colores es suficiente, o se necesita más?
- ¿Se quiere guardar combinaciones frecuentes (por ejemplo en el navegador)?
- ¿Alojar en Vercel con dominio propio o solo uso local?
