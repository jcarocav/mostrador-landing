import type { Page } from '@playwright/test';

/** Recorre la página hasta el final para que se carguen las secciones que aparecen al desplazarse. */
export async function recorrer(page: Page) {
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
export async function enReposo(page: Page) {
  // content-visibility deja sin renderizar lo que está lejos, con sus transiciones congeladas. Se fuerza a
  // renderizar todo: la espera termina y axe mide la página completa, no solo lo que está en pantalla.
  await page.addStyleTag({ content: '.seccion { content-visibility: visible !important; }' });
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
