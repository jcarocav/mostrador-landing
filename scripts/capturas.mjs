#!/usr/bin/env node
// Capturas de página completa del sitio compilado (dist/) en PC, tablet y celular, con y sin
// movimiento reducido. Quedan en informes/capturas/ para el reporte de cada punto de control.
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium, devices } from '@playwright/test';
import { nombreDePagina, servirDist } from './lib/servidor.mjs';

const PAGINAS = (process.env.PAGINAS ?? '/,/direcciones/a/,/direcciones/b/').split(',');
const TAMANOS = [
  { nombre: 'pc', opciones: { viewport: { width: 1440, height: 900 } } },
  { nombre: 'tablet', opciones: { ...devices['iPad (gen 7)'], defaultBrowserType: undefined } },
  { nombre: 'celular', opciones: { ...devices['Pixel 7'], defaultBrowserType: undefined } },
];

const SALIDA = resolve('informes/capturas');
mkdirSync(SALIDA, { recursive: true });
const { base, cerrar } = await servirDist();

const navegador = await chromium.launch({ channel: 'chrome' });
try {
  for (const pagina of PAGINAS) {
    const nombre = nombreDePagina(pagina);
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
        // Espera a que terminen las animaciones de entrada (cada una dura menos de un segundo).
        await page.waitForTimeout(3200);
        const archivo = join(SALIDA, `${nombre}-${tamano}${movimiento === 'reduce' ? '-quieta' : ''}.png`);
        await page.screenshot({ path: archivo, fullPage: true });
        console.log(archivo);
        await contexto.close();
      }
    }
  }
} finally {
  await navegador.close();
  cerrar();
}
