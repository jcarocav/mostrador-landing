import { expect, test } from '@playwright/test';
import { WHATSAPP } from '../src/config/contacto';
import { formatoPesos, MESES_PROMOCION, planes } from '../src/config/precios';
import { enReposo, recorrer } from './ayuda';

test.describe('secciones', () => {
  test('el orden de las secciones es el que pidió el dueño', async ({ page }) => {
    await page.goto('/');
    const titulos = await page.locator('main h1, main h2').allTextContents();
    expect(titulos.map((t) => t.replace(/\s+/g, ' ').trim()).slice(1)).toEqual([
      'Empieza fácil',
      'Para tu rubro',
      'Nunca te deja parado',
      'Control real',
      'Crece contigo',
      'Planes y precios',
      'Confianza',
      'Preguntas frecuentes',
      'Contacto',
    ]);
  });

  test('el pie enlaza a la privacidad y esa página dice lo que debe decir', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Privacidad' }).click();
    await expect(page).toHaveURL(/\/privacidad\/$/);
    await expect(page.getByRole('main')).toContainText('No usamos cookies');
    await expect(page.getByRole('main')).toContainText('no guardamos ningún dato');
    await expect(page.getByRole('main')).toContainText('tus datos los maneja WhatsApp');
  });
});

test.describe('para tu rubro', () => {
  const nombres = ['Almacén', 'Minimarket', 'Petshop', 'Ferretería', 'Ropa', 'Otro'];

  test('las pestañas responden a las flechas, Inicio y Fin, y solo se ve un panel', async ({ page }) => {
    await page.goto('/');
    const pestana = (nombre: string) => page.getByRole('tab', { name: nombre, exact: true });
    await pestana('Almacén').focus();

    await page.keyboard.press('ArrowRight');
    await expect(pestana('Minimarket')).toBeFocused();
    await expect(pestana('Minimarket')).toHaveAttribute('aria-selected', 'true');
    await expect(pestana('Almacén')).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByRole('tabpanel')).toHaveCount(1);
    await expect(page.getByRole('tabpanel')).toContainText('Miles de productos');

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(pestana('Otro')).toBeFocused();
    await page.keyboard.press('Home');
    await expect(pestana('Almacén')).toBeFocused();
    await page.keyboard.press('End');
    await expect(pestana('Otro')).toHaveAttribute('aria-selected', 'true');

    // Tab sale de la lista de pestañas al panel: las demás no son paradas del teclado.
    await page.keyboard.press('Tab');
    await expect(page.locator('#panel-otro')).toBeFocused();
  });

  test('se puede elegir con un clic o un toque', async ({ page }) => {
    await page.goto('/');
    for (const nombre of nombres) {
      await page.getByRole('tab', { name: nombre, exact: true }).click();
      await expect(page.getByRole('tabpanel')).toHaveCount(1);
      await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', `pestana-${nombre === 'Almacén' ? 'almacen' : nombre === 'Ferretería' ? 'ferreteria' : nombre.toLowerCase()}`);
    }
  });
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('todo el contenido se ve, incluidos los seis rubros', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[role="tabpanel"]:visible')).toHaveCount(6);
    await expect(page.locator('[data-precio-promocional]:visible')).toHaveCount(2);
    await expect(page.locator('[data-paso]:visible')).toHaveCount(3);
  });
});

test.describe('precios', () => {
  test('cada plan muestra su promoción, cuánto dura y cuánto se paga después', async ({ page }) => {
    await page.goto('/');
    for (const plan of planes) {
      const tarjeta = page.locator(`[data-plan="${plan.id}"]`);
      if (plan.aCotizar) {
        await expect(tarjeta).toContainText('A cotizar');
        continue;
      }
      await expect(tarjeta.locator('[data-precio-promocional]')).toHaveText(formatoPesos(plan.precioPromocional));
      await expect(tarjeta).toContainText(`los primeros ${MESES_PROMOCION} meses`);
      await expect(tarjeta).toContainText(`Desde el mes ${MESES_PROMOCION + 1}`);
      await expect(tarjeta.locator('[data-precio-normal]')).toHaveText(formatoPesos(plan.precioNormal));
    }
  });
});

test.describe('navegación', () => {
  test('los enlaces del menú llevan a su sección aunque aún no esté renderizada', async ({ page }, info) => {
    await page.goto('/');
    // Desde 720 px el menú muestra todos sus enlaces; en el celular, solo la acción principal.
    const destinos = info.project.name === 'pc' ? [['Planes', 'planes'], ['Preguntas', 'preguntas'], ['Prueba gratis', 'contacto']] : [['Prueba gratis', 'contacto']];
    for (const [nombre, id] of destinos) {
      await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: nombre, exact: true }).click();
      await expect(page.locator(`#${id}`)).toBeInViewport();
      await page.evaluate(() => window.scrollTo(0, 0));
    }
  });
});

test.describe('preguntas', () => {
  test('se abren con el teclado', async ({ page }) => {
    await page.goto('/');
    const pregunta = page.getByText('¿Emite boletas y facturas?');
    await pregunta.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Todavía no. Hoy entrega un comprobante interno')).toBeVisible();
  });
});

test.describe('whatsapp', () => {
  test('el botón flotante se ve siempre y abre WhatsApp con el mensaje escrito', async ({ page }) => {
    await page.goto('/');
    const flotante = page.locator('[data-whatsapp-flotante]');
    await expect(flotante).toBeVisible();
    await expect(flotante).toHaveAttribute('href', new RegExp(`^https://wa\\.me/${WHATSAPP}\\?text=`));
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(flotante).toBeInViewport();
  });
});

test.describe('movimiento', () => {
  test('con movimiento, todo lo que entra al desplazarse termina visible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await recorrer(page);
    await enReposo(page);
    const escondidos = await page
      .locator('[data-aparece], [data-paso-senal]')
      .evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
    expect(escondidos).toBe(0);
  });

  test('con movimiento reducido la página queda completa y quieta desde el inicio', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('load');
    expect(await page.evaluate(() => document.documentElement.classList.contains('js-movimiento'))).toBe(false);
    // Las transiciones quedan en 1 ms: pueden estar corriendo en este instante, pero ninguna dura de verdad.
    const conDuracion = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => Number(a.effect?.getTiming().duration) > 1)
        .map((a) => `${(a.effect as KeyframeEffect).target?.nodeName}: ${a.effect?.getTiming().duration} ms`),
    );
    expect(conDuracion).toEqual([]);
    await enReposo(page);
    await expect(page.locator('[data-total]')).toHaveText(/\$4\.880/);
    await expect(page.locator('.pantalla[data-pantalla="carrito"]').first()).toHaveCSS('opacity', '1');
    const escondidos = await page
      .locator('[data-aparece], [data-paso-senal], [data-paso]')
      .evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
    expect(escondidos).toBe(0);
    // Lenis y GSAP no se cargan.
    const scripts = await page.evaluate(() => performance.getEntriesByType('resource').map((r) => r.name));
    expect(scripts.filter((s) => s.includes('escenas'))).toEqual([]);
  });
});

test.describe('diseño', () => {
  test('no hay desplazamiento horizontal', async ({ page }) => {
    for (const ruta of ['/', '/privacidad/']) {
      await page.goto(ruta);
      await recorrer(page);
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(sobra, ruta).toBeLessThanOrEqual(0);
    }
  });

  test('Bricolage solo en títulos y cifras grandes; botones y texto con la fuente de la app', async ({ page }) => {
    await page.goto('/');
    const fuente = (selector: string) =>
      page.locator(selector).first().evaluate((e) => getComputedStyle(e).fontFamily.split(',')[0].replaceAll('"', ''));
    expect(await fuente('h1')).toBe('Bricolage Grotesque Variable');
    expect(await fuente('[data-total]')).toBe('Bricolage Grotesque Variable');
    expect(await fuente('.marca')).toBe('Plus Jakarta Sans Variable');
    expect(await fuente('.boton')).toBe('Plus Jakarta Sans Variable');
    expect(await fuente('.subtitulo')).toBe('Plus Jakarta Sans Variable');
    expect(await fuente('.pestana')).toBe('Plus Jakarta Sans Variable');
  });

  test('los textos miden 16 px o más; 14 px solo en datos secundarios', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const chicos = await page.evaluate(() => {
      const paseo = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const encontrados = new Set<string>();
      while (paseo.nextNode()) {
        const el = paseo.currentNode.parentElement!;
        if (!paseo.currentNode.textContent?.trim() || ['SCRIPT', 'STYLE'].includes(el.tagName)) continue;
        const tamano = parseFloat(getComputedStyle(el).fontSize);
        const secundario = el.closest('.pronto, .etiqueta-estado');
        if (tamano < (secundario ? 14 : 16)) encontrados.add(`${tamano}px: ${el.textContent?.trim().slice(0, 40)}`);
      }
      return [...encontrados];
    });
    expect(chicos).toEqual([]);
  });

  test('los controles miden al menos 44 px de alto', async ({ page }) => {
    await page.goto('/');
    const bajos = await page
      .locator('.boton, .pestana, summary, [data-whatsapp-flotante], footer nav a, .marca')
      .evaluateAll((els) =>
        els.filter((e) => e.getClientRects().length && e.getBoundingClientRect().height < 44).map((e) => e.textContent?.trim()),
      );
    expect(bajos).toEqual([]);
  });
});
