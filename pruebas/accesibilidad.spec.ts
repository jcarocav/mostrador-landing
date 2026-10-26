import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Páginas del sitio. Al agregar una, se agrega aquí y queda cubierta por todas las pruebas.
const PAGINAS = ['/', '/direcciones/', '/direcciones/a/', '/direcciones/b/'];

const ETIQUETAS_WCAG_21_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const GRAVES = new Set(['serious', 'critical']);

/** Recorre la página hasta el final para que se carguen las secciones que aparecen al desplazarse. */
async function recorrer(page: Page) {
  await page.evaluate(async () => {
    const paso = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += paso) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
}

for (const ruta of PAGINAS) {
  for (const movimiento of ['no-preference', 'reduce'] as const) {
    test(`axe WCAG 2.1 AA sin violaciones graves · ${ruta} · movimiento ${movimiento}`, async ({ page }, info) => {
      await page.emulateMedia({ reducedMotion: movimiento });
      await page.goto(ruta);
      await recorrer(page);

      const { violations } = await new AxeBuilder({ page }).withTags(ETIQUETAS_WCAG_21_AA).analyze();

      // Las moderadas y menores no detienen la CI, pero quedan anotadas en el informe.
      for (const v of violations.filter((v) => !GRAVES.has(v.impact ?? ''))) {
        info.annotations.push({ type: `axe ${v.impact}`, description: `${v.id}: ${v.help} (${v.nodes.length})` });
      }

      const graves = violations
        .filter((v) => GRAVES.has(v.impact ?? ''))
        .map((v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
      expect(graves, 'violaciones graves de WCAG 2.1 AA').toEqual([]);
    });
  }

  test(`sin peticiones a terceros ni cookies · ${ruta}`, async ({ page, context, baseURL }) => {
    const origen = new URL(baseURL!).origin;
    const externas: string[] = [];
    page.on('request', (peticion) => {
      const url = new URL(peticion.url());
      if (url.protocol.startsWith('http') && url.origin !== origen) externas.push(peticion.url());
    });

    await page.goto(ruta);
    await recorrer(page);

    expect(externas, 'peticiones a otros dominios (analítica, fuentes, CDN)').toEqual([]);
    expect(await context.cookies(), 'cookies').toEqual([]);
  });
}
