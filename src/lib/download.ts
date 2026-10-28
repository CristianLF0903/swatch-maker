// Margen antes de liberar la URL: algunos navegadores cancelan la descarga si se revoca enseguida.
const REVOKE_DELAY_MS = 10_000;

/** Descarga el Blob con un enlace temporal y libera la URL. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
}
