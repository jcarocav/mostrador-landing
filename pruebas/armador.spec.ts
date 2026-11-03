import { expect, test, type Page } from '@playwright/test';
import { necesidades, recomendar, totales } from '../src/config/armador';
import { conIva, formatoPesos } from '../src/config/precios';

/** Responde las preguntas en orden, tocando el botón con ese texto. */
async function responder(page: Page, opciones: string[]) {
  const armador = page.locator('[data-armador]');
  for (const texto of opciones) {
    await armador.locator('[data-pregunta]:visible').getByRole('button', { name: texto, exact: true }).click();
  }
}

const SIMPLE = ['Almacén', '1', 'No', '1', 'Solo yo', 'Hasta 1.000', 'En el celular', 'Estable', 'Vender más rápido'];
const POCO_MAS = ['Minimarket', '1', 'Sí, una', '2', '4', 'Hasta 2.000', 'Un poco de todo', 'Se corta a veces', 'Emitir boletas'];
const VARIOS_LOCALES = ['Ropa', '2 o 3', 'Sí, una', '3 a 5', '5 a 15', 'Hasta 10.000', 'En tablet o PC', 'Estable', 'Saber cuánto gano'];
const GRANDE = ['Otro', 'Más de 10', 'Sí, más de una', 'Más de 5', 'Más de 15', 'Más de 10.000', 'En tablet o PC', 'Estable', 'Controlar mi stock'];

async function abrir({ page }: { page: Page }) {
  await page.goto('/#arma-tu-plan');
  await expect(page.locator('[data-armador]')).toBeVisible();
}

test.describe('recomendación', () => {
  test('el cálculo elige el plan más barato que alcanza', () => {
    const plan = (r: Record<string, string>) => recomendar(necesidades(r));
    expect(plan({ locales: 'uno', bodega: 'una', cajas: 'una', personas: 'hasta3', productos: 'hasta1000' })).toEqual({ plan: 'emprende', adicionales: [] });
    // La caja adicional trae su usuario: con 4 personas y 2 cajas no hace falta sumar otro.
    expect(plan({ locales: 'uno', bodega: 'no', cajas: 'dos', personas: 'cuatro', productos: 'hasta2000' })).toEqual({ plan: 'emprende', adicionales: ['caja', 'productos'] });
    expect(plan({ locales: 'uno', bodega: 'no', cajas: 'una', personas: 'cuatro', productos: 'hasta1000' })).toEqual({ plan: 'emprende', adicionales: ['usuario'] });
    // Las ubicaciones no se venden aparte: un local con dos bodegas ya es Pyme.
    expect(plan({ locales: 'uno', bodega: 'varias', cajas: 'una', personas: 'solo', productos: 'hasta1000' })).toEqual({ plan: 'pyme', adicionales: [] });
    expect(plan({ locales: 'muchos', bodega: 'no', cajas: 'una', personas: 'solo', productos: 'hasta1000' })).toEqual({ plan: 'empresa', adicionales: [] });
    expect(plan({ locales: 'uno', bodega: 'no', cajas: 'una', personas: 'solo', productos: 'mas' })).toEqual({ plan: 'empresa', adicionales: [] });
    expect(plan({ locales: 'varios', bodega: 'varias', cajas: 'hasta5', personas: 'hasta15', productos: 'hasta10000' })).toEqual({ plan: 'pyme', adicionales: [] });
  });

  test('la promoción rebaja el plan y los adicionales cuestan lo mismo después', () => {
    expect(totales('emprende', [])).toMatchObject({ promocional: 14990, normal: 19990 });
    expect(totales('emprende', ['usuario'])).toMatchObject({ promocional: 17980, normal: 22980, promocionalConIva: conIva(17980), meses: 3 });
    expect(totales('pyme', [])).toMatchObject({ promocional: 29990, normal: 34990 });
    expect(totales('empresa', [])).toBeNull();
  });
});

test.describe('flujo', () => {
  test.beforeEach(abrir);

  test('nueve preguntas con barra de avance, y Atrás conserva lo elegido', async ({ page }) => {
    const barra = page.locator('[data-avance]');
    await expect(page.locator('[data-pregunta]:visible')).toHaveCount(1);
    await expect(page.locator('[data-avance-texto]')).toHaveText('Pregunta 1 de 9');
    await expect(barra).toHaveAttribute('aria-valuenow', '0');
    await expect(page.locator('[data-atras]')).toBeHidden();

    await responder(page, SIMPLE.slice(0, 2));
    await expect(page.locator('[data-avance-texto]')).toHaveText('Pregunta 3 de 9');
    await expect(barra).toHaveAttribute('aria-valuenow', '2');

    await page.locator('[data-atras]').click();
    await expect(page.locator('[data-pregunta]:visible h3')).toHaveText('¿Cuántos locales tienes?');
    await expect(page.locator('[data-pregunta]:visible [aria-pressed="true"]')).toHaveText('1');
  });

  test('todo se puede contestar con el teclado y el foco sigue a la pregunta', async ({ page }) => {
    await page.locator('[data-pregunta]:visible button').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-pregunta]:visible h3')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-pregunta]:visible button').first()).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.locator('[data-avance-texto]')).toHaveText('Pregunta 3 de 9');
  });

  test('un negocio simple recibe Emprende, sin adicionales, con el precio y lo que paga después', async ({ page }) => {
    await responder(page, SIMPLE);
    await expect(page.locator('[data-resultado-titulo]')).toHaveText('Te conviene Emprende');
    await expect(page.locator('[data-resultado-titulo]')).toBeFocused();
    await expect(page.locator('[data-total-monto]')).toHaveText(formatoPesos(14990));
    await expect(page.locator('[data-total-unidad]')).toContainText('los primeros 3 meses');
    await expect(page.locator('[data-total-despues]')).toContainText(`Desde el mes 4: ${formatoPesos(19990)}`);
    await expect(page.getByRole('switch', { checked: true })).toHaveCount(0);
  });

  test('los adicionales se activan solos si hacen falta y el total cambia en vivo', async ({ page }) => {
    await responder(page, POCO_MAS);
    await expect(page.locator('[data-resultado-titulo]')).toHaveText('Te conviene Emprende');
    const caja = page.locator('[data-adicional="caja"]');
    const productos = page.locator('[data-adicional="productos"]');
    await expect(caja).toBeChecked();
    await expect(productos).toBeChecked();
    await expect(page.locator('[data-total-monto]')).toHaveText(formatoPesos(14990 + 7990 + 3990));

    await caja.focus();
    await page.keyboard.press('Space');
    await expect(caja).not.toBeChecked();
    await expect(page.locator('[data-total-monto]')).toHaveText(formatoPesos(14990 + 3990));
    await expect(page.locator('[data-total-despues]')).toContainText(formatoPesos(19990 + 3990));

    // Pidió boletas: se le dice la verdad.
    await expect(page.locator('[data-resultado-notas]')).toContainText('aún no están');
  });

  test('con varios locales recomienda Pyme', async ({ page }) => {
    await responder(page, VARIOS_LOCALES);
    await expect(page.locator('[data-resultado-titulo]')).toHaveText('Te conviene Pyme');
    await expect(page.locator('[data-total-monto]')).toHaveText(formatoPesos(29990));
    await expect(page.locator('[data-resultado-notas]')).toContainText('reportes de ventas y rentabilidad aún no están');
  });

  test('sobre los límites de Pyme va a cotizar, sin total ni adicionales', async ({ page }) => {
    await responder(page, GRANDE);
    await expect(page.locator('[data-resultado-titulo]')).toHaveText('Te conviene Empresa');
    await expect(page.locator('[data-total-monto]')).toHaveText('A cotizar');
    await expect(page.locator('[data-bloque-adicionales]')).toBeHidden();
    await expect(page.locator('[data-enlace-probar]')).toBeHidden();
    await expect(page.locator('[data-enlace-asesoren]')).toBeVisible();
  });

  test('«Empezar de nuevo» borra todo', async ({ page }) => {
    await responder(page, SIMPLE);
    await page.locator('[data-reiniciar]').click();
    await expect(page.locator('[data-avance-texto]')).toHaveText('Pregunta 1 de 9');
    await expect(page.locator('[data-resultado]')).toBeHidden();
    await expect(page.locator('[data-armador] [aria-pressed="true"]')).toHaveCount(0);
  });
});

test.describe('privacidad', () => {
  test.beforeEach(abrir);

  test('«Prefiero que me asesoren» lleva las respuestas escritas a WhatsApp', async ({ page }) => {
    await responder(page, POCO_MAS);
    await page.getByRole('switch', { name: /Usuario adicional/ }).check();
    const href = (await page.locator('[data-enlace-asesoren]').getAttribute('href'))!;
    expect(href.startsWith('https://wa.me/')).toBe(true);
    const texto = new URL(href).searchParams.get('text')!;
    expect(texto).toContain('prefiero que me asesoren');
    expect(texto).toContain('Negocio: Minimarket');
    expect(texto).toContain('Cajas: 2');
    expect(texto).toContain('Prioridad: Emitir boletas');
    expect(texto).toContain('Plan recomendado: Emprende');
    expect(texto).toContain('Usuario adicional');
    expect(texto).toContain('Total:');
  });

  test('no se guarda ni se envía nada mientras se responde', async ({ page, context, baseURL }) => {
    const origen = new URL(baseURL!).origin;
    const peticiones: string[] = [];
    page.on('request', (r) => {
      if (new URL(r.url()).origin !== origen || r.method() !== 'GET') peticiones.push(r.url());
    });

    await responder(page, POCO_MAS);
    await page.getByRole('switch', { name: /Usuario adicional/ }).check();

    expect(peticiones).toEqual([]);
    expect(await context.cookies()).toEqual([]);
    const guardado = await page.evaluate(async () => ({
      local: localStorage.length,
      sesion: sessionStorage.length,
      bases: (await indexedDB.databases()).length,
    }));
    expect(guardado).toEqual({ local: 0, sesion: 0, bases: 0 });
  });

  test('al recargar, las respuestas ya no están', async ({ page }) => {
    await responder(page, SIMPLE);
    await page.reload();
    await expect(page.locator('[data-avance-texto]')).toHaveText('Pregunta 1 de 9');
  });
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('ofrece escribir por WhatsApp en vez de botones que no hacen nada', async ({ page }) => {
    await page.goto('/#arma-tu-plan');
    await expect(page.locator('[data-armador]')).toBeHidden();
    await expect(page.getByText('Esta parte necesita JavaScript')).toBeVisible();
  });
});
