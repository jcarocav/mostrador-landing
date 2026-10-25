#!/usr/bin/env node
// Capturas de página completa del sitio compilado (dist/) en PC, tablet y celular, con y sin
// movimiento reducido. Quedan en informes/capturas/ para el reporte de cada punto de control.
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium, devices } from '@playwright/test';

const PAGINAS = ['/'];
const TAMANOS = [
  { nombre: 'pc', opciones: { viewport: { width: 1440, height: 900 } } },
  { nombre: 'tablet', opciones: { ...devices['iPad (gen 7)'], defaultBrowserType: undefined } },
  { nombre: 'celular', opciones: { ...devices['Pixel 7'], defaultBrowserType: undefined } },
];

const DIST = resolve('dist');
const SALIDA = resolve('informes/capturas');
if (!existsSync(DIST)) {
  console.error('No existe dist/. Corre antes «npm run build».');
  process.exit(2);
}
mkdirSync(SALIDA, { recursive: true });

const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2' };
const servidor = createServer((req, res) => {
  let ruta = join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!ruta.startsWith(DIST)) return res.writeHead(403).end();
  if (existsSync(ruta) && statSync(ruta).isDirectory()) ruta = join(ruta, 'index.html');
  if (!existsSync(ruta)) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': TIPOS[extname(ruta)] ?? 'application/octet-stream' });
  createReadStream(ruta).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const navegador = await chromium.launch({ channel: 'chrome' });
try {
  for (const pagina of PAGINAS) {
    const nombre = pagina === '/' ? 'inicio' : pagina.replace(/\W+/g, '-').replace(/^-|-$/g, '');
    for (const { nombre: tamano, opciones } of TAMANOS) {
      for (const movimiento of ['no-preference', 'reduce']) {
        const contexto = await navegador.newContext({ ...opciones, reducedMotion: movimiento });
        const page = await contexto.newPage();
        await page.goto(`${base}${pagina}`, { waitUntil: 'networkidle' });
        // Recorre la página para que se carguen las secciones que aparecen al desplazarse.
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) {
            scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 150));
          }
          scrollTo(0, 0);
        });
        await page.waitForTimeout(400);
        const archivo = join(SALIDA, `${nombre}-${tamano}${movimiento === 'reduce' ? '-quieta' : ''}.png`);
        await page.screenshot({ path: archivo, fullPage: true });
        console.log(archivo);
        await contexto.close();
      }
    }
  }
} finally {
  await navegador.close();
  servidor.close();
}
