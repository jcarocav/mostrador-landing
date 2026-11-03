// Tamaños que se generan de cada captura. El navegador elige el menor que le sirve: un celular común
// baja unos 20 KB por pantalla, no los 1170 px del original a 3x. Tres por formato: cada tamaño más
// alarga el HTML de todas las imágenes.
export const ANCHOS_CELULAR = [390, 780, 1170];
export const ANCHOS_PC = [960, 1920, 2880];
// AVIF a 50 se ve igual que WebP a 80 en estas capturas y pesa un 38 % menos; WebP queda de respaldo
// para los navegadores sin AVIF (DECISIONES.md #20).
export const FORMATOS_CAPTURA = ['avif', 'webp'] as const;
export const CALIDAD_CAPTURA = { avif: 50, webp: 80 } as const;
