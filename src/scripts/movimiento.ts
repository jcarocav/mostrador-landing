// Utilidades de movimiento compartidas por las dos direcciones.

/** Curvas de emil-design-eng: salida fuerte (entradas) y entrada-salida fuerte (traslados). */
export const CURVA_SALIDA = 'cubic-bezier(0.23, 1, 0.32, 1)';
export const CURVA_TRASLADO = 'cubic-bezier(0.77, 0, 0.175, 1)';

export const pesos = (monto: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(monto);

export const esperar = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** ¿Está activo el modo con movimiento? (lo decide el script del <head> de Base.astro). */
export function hayMovimiento() {
  return document.documentElement.classList.contains('js-movimiento');
}

/** El script empezó: se cancela el respaldo que deja todo a la vista a los 4 segundos. */
export function cancelarRespaldo() {
  clearTimeout((window as unknown as { __respaldoMovimiento?: number }).__respaldoMovimiento);
}

/** Sube un monto en pantalla de «desde» a «hasta» con salida suave, sin rebote. */
export function contar(el: HTMLElement, desde: number, hasta: number, duracion = 380) {
  return new Promise<void>((listo) => {
    const inicio = performance.now();
    const paso = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      const suave = 1 - Math.pow(1 - t, 3);
      el.textContent = pesos(Math.round(desde + (hasta - desde) * suave));
      if (t < 1) requestAnimationFrame(paso);
      else listo();
    };
    requestAnimationFrame(paso);
  });
}

/** Una copia del nombre del producto viaja de la etiqueta a la pantalla del celular y se desvanece. */
export function vuelo(origen: HTMLElement, destino: HTMLElement, escena: HTMLElement, texto: string, duracion = 440) {
  const caja = escena.getBoundingClientRect();
  const a = origen.getBoundingClientRect();
  const b = destino.getBoundingClientRect();
  const ficha = document.createElement('div');
  ficha.className = 'ficha-vuelo';
  ficha.setAttribute('aria-hidden', 'true');
  ficha.textContent = texto;
  ficha.style.left = `${a.left - caja.left}px`;
  ficha.style.top = `${a.top - caja.top}px`;
  escena.appendChild(ficha);
  const dx = b.left + b.width / 2 - (a.left + ficha.offsetWidth / 2);
  const dy = b.top + b.height * 0.32 - (a.top + ficha.offsetHeight / 2);
  const animacion = ficha.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.72)`, opacity: 0 },
    ],
    { duration: duracion, easing: CURVA_TRASLADO, fill: 'forwards' },
  );
  return animacion.finished.then(() => ficha.remove());
}

/** El haz de lectura recorre el código de barras de la etiqueta. */
export function leer(etiqueta: HTMLElement, duracion = 420) {
  const haz = etiqueta.querySelector<HTMLElement>('[data-haz]');
  const barras = haz?.parentElement;
  if (!haz || !barras) return Promise.resolve();
  const ancho = barras.clientWidth - haz.offsetWidth;
  return haz
    .animate(
      [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: `translateX(${ancho}px)`, opacity: 1, offset: 0.9 },
        { transform: `translateX(${ancho}px)`, opacity: 0 },
      ],
      { duration: duracion, easing: CURVA_TRASLADO },
    )
    .finished.then(() => undefined);
}

/** Llama a «accion» una sola vez, cuando el elemento ya se ve en buena parte. */
export function alAparecer(el: Element, accion: () => void, umbral = 0.45) {
  const observador = new IntersectionObserver(
    (entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      observador.disconnect();
      accion();
    },
    { threshold: umbral },
  );
  observador.observe(el);
}
