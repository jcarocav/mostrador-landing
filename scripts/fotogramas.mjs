#!/usr/bin/env node
// Fotogramas de las animaciones, en PC y celular: la portada al empezar, a la mitad y al terminar, y
// cada paso de «Empieza fácil». Sirven para revisar el movimiento con review-animations y para el
// reporte de cada punto de control. Quedan en informes/fotogramas/.
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium, devices } from '@playwright/test';
import { nombreDePagina, servirDist } from './lib/servidor.mjs';

const PAGINAS = (process.env.PAGINAS ?? '/direcciones/a/,/direcciones/b/').split(',');
const TAMANOS = [
  { nombre: 'pc', opciones: { viewport: { width: 1440, height: 900 } } },
  { nombre: 'celular', opciones: { ...devices['Pixel 7'], defaultBrowserType: undefined } },
];
// Momentos de la portada, en milisegundos desde que la página cargó.
const MOMENTOS_PORTADA = [
  ['portada-1-inicio', 350],
  ['portada-2-mitad', 1500],
  ['portada-3-final', 3600],
];

const SALIDA = resolve('informes/fotogramas');
mkdirSync(SALIDA, { recursive: true });
const { base, cerrar } = await servirDist();
const navegador = await chromium.launch({ channel: 'chrome' });

try {
  for (const pagina of PAGINAS) {
    for (const { nombre: tamano, opciones } of TAMANOS) {
      const contexto = await navegador.newContext(opciones);
      const page = await contexto.newPage();
      const foto = async (momento) => {
        const archivo = join(SALIDA, `${nombreDePagina(pagina)}-${tamano}-${momento}.png`);
        await page.screenshot({ path: archivo });
        console.log(archivo);
      };

      await page.goto(`${base}${pagina}`, { waitUntil: 'load' });
      // En el celular la escena de la portada queda bajo el borde: se lleva a la vista, que es cuando
      // empieza su animación.
      if (tamano === 'celular') {
        await page.evaluate(() => document.querySelector('[data-escena]')?.scrollIntoView({ block: 'center' }));
      }
      const t0 = Date.now();
      for (const [momento, ms] of MOMENTOS_PORTADA) {
        await page.waitForTimeout(Math.max(0, ms - (Date.now() - t0)));
        await foto(momento);
      }

      // Posición de desplazamiento que deja activo cada paso, sea la escena fija (pin de GSAP) o con
      // celular pegado (sticky).
      const cantidad = await page.locator('[data-paso]').count();
      for (let i = 0; i < cantidad; i++) {
        const y = await page.evaluate((i) => {
          const seccion = document.querySelector('[data-empieza]');
          const pasos = document.querySelectorAll('[data-paso]');
          const espaciador = seccion.parentElement.classList.contains('pin-spacer') ? seccion.parentElement : null;
          if (espaciador) {
            const inicio = espaciador.getBoundingClientRect().top + scrollY;
            const recorrido = espaciador.offsetHeight - innerHeight;
            return inicio + recorrido * ((i + 0.5) / pasos.length);
          }
          const caja = pasos[i].getBoundingClientRect();
          const franja = innerWidth >= 1024 ? 0.5 : 0.75;
          return caja.top + scrollY + Math.min(caja.height / 2, 80) - innerHeight * franja;
        }, i);
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await page.waitForTimeout(1100);
        await foto(`empieza-paso-${i + 1}`);
      }
      await contexto.close();
    }
  }
} finally {
  await navegador.close();
  cerrar();
}

// Hojas de contacto: todos los fotogramas de una página y un tamaño en una sola imagen.
const { default: sharp } = await import('sharp');
const { readdirSync } = await import('node:fs');
for (const pagina of PAGINAS) {
  for (const { nombre: tamano } of TAMANOS) {
    const prefijo = `${nombreDePagina(pagina)}-${tamano}-`;
    const archivos = readdirSync(SALIDA).filter((f) => f.startsWith(prefijo)).sort();
    if (!archivos.length) continue;
    const ancho = tamano === 'pc' ? 720 : 300;
    const columnas = tamano === 'pc' ? 3 : 6;
    const imagenes = await Promise.all(
      archivos.map((f) => sharp(join(SALIDA, f)).resize({ width: ancho }).toBuffer({ resolveWithObject: true })),
    );
    const alto = Math.max(...imagenes.map((i) => i.info.height));
    const filas = Math.ceil(imagenes.length / columnas);
    const hoja = join(SALIDA, `hoja-${nombreDePagina(pagina)}-${tamano}.png`);
    await sharp({ create: { width: columnas * (ancho + 10), height: filas * (alto + 10), channels: 3, background: '#888888' } })
      .composite(imagenes.map((im, k) => ({ input: im.data, left: (k % columnas) * (ancho + 10), top: Math.floor(k / columnas) * (alto + 10) })))
      .png()
      .toFile(hoja);
    console.log(hoja);
  }
}
