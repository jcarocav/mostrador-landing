import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

// Páginas del sitio. Al agregar una, se agrega aquí y queda cubierta por todas las pruebas.
const PAGINAS = ['/'];
const PAGINA_ESCENA = '/';

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

/**
 * Espera la página en reposo: nada cambia de opacidad, posición, recorte ni texto durante 300 ms.
 * axe calcula el contraste con la opacidad del momento, así que medir en plena animación da resultados
 * que dependen de la velocidad de la máquina (DECISIONES.md #12). Si la página no se aquieta, la prueba
 * falla por tiempo: no se mide «como esté».
 */
async function enReposo(page: Page) {
  await page.evaluate(async () => {
    const foto = () =>
      [...document.querySelectorAll('body *')]
        .map((el) => {
          const s = getComputedStyle(el);
          return `${s.opacity}|${s.transform}|${s.clipPath}|${el.childElementCount ? '' : el.textContent}`;
        })
        .join('\n');
    let anterior = foto();
    for (let quietos = 0; quietos < 3; ) {
      await new Promise((r) => setTimeout(r, 100));
      const actual = foto();
      quietos = actual === anterior && document.getAnimations().length === 0 ? quietos + 1 : 0;
      anterior = actual;
    }
  });
}

async function revisarConAxe(page: Page, info: TestInfo, alcance?: string) {
  const axe = new AxeBuilder({ page }).withTags(ETIQUETAS_WCAG_21_AA);
  const { violations } = await (alcance ? axe.include(alcance) : axe).analyze();

  // Las moderadas y menores no detienen la CI, pero quedan anotadas en el informe.
  for (const v of violations.filter((v) => !GRAVES.has(v.impact ?? ''))) {
    info.annotations.push({ type: `axe ${v.impact}`, description: `${v.id}: ${v.help} (${v.nodes.length})` });
  }

  const graves = violations
    .filter((v) => GRAVES.has(v.impact ?? ''))
    .map((v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
  expect(graves, 'violaciones graves de WCAG 2.1 AA').toEqual([]);
}

test.describe('escena fija de «Empieza fácil» con movimiento', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(PAGINA_ESCENA);
  });

  test('tras un desplazamiento rápido queda un solo paso visible', async ({ page }) => {
    await recorrer(page);
    await enReposo(page);
    const visibles = await page
      .locator('[data-paso]')
      .evaluateAll((pasos) => pasos.filter((p) => Number(getComputedStyle(p).opacity) > 0).length);
    expect(visibles).toBe(1);
  });

  test('el paso a paso se recorre con un desplazamiento corto en el celular', async ({ page }, info) => {
    await recorrer(page);
    const pantallas = await page.evaluate(() => {
      const contenedor = document.querySelector('[data-empieza]')!.parentElement!;
      return (contenedor.offsetHeight - window.innerHeight) / window.innerHeight;
    });
    expect(pantallas).toBeGreaterThan(0);
    expect(pantallas).toBeLessThanOrEqual(info.project.name === 'celular' ? 1 : 2.6);
  });

  // Con la página arriba, los pasos 2 y 3 están en opacidad 0 y axe no los ve: se detiene en cada uno.
  test('axe WCAG 2.1 AA en cada paso, en reposo', async ({ page }, info) => {
    const total = await page.locator('[data-paso]').count();
    await recorrer(page);
    for (let i = 0; i < total; i++) {
      await page.evaluate(
        ([i, total]) => {
          const contenedor = document.querySelector('[data-empieza]')!.parentElement!;
          const inicio = contenedor.getBoundingClientRect().top + window.scrollY;
          const recorrido = contenedor.offsetHeight - window.innerHeight;
          window.scrollTo(0, inicio + (recorrido * (i + 0.5)) / total);
        },
        [i, total],
      );
      await enReposo(page);
      await expect(page.locator(`[data-paso="${i}"]`)).toHaveCSS('opacity', '1');
      await revisarConAxe(page, info, '[data-empieza]');
    }
  });
});

for (const ruta of PAGINAS) {
  for (const movimiento of ['no-preference', 'reduce'] as const) {
    test(`axe WCAG 2.1 AA sin violaciones graves · ${ruta} · movimiento ${movimiento}`, async ({ page }, info) => {
      await page.emulateMedia({ reducedMotion: movimiento });
      await page.goto(ruta);
      await recorrer(page);
      await enReposo(page);
      await revisarConAxe(page, info);
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
