// Movimiento de la dirección B: se carga solo con movimiento permitido (ver b.astro).
// GSAP y ScrollTrigger para la portada y la escena fija; Lenis para el desplazamiento suave en PC.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { alAparecer, esperar, leer, pesos, vuelo } from './movimiento';

gsap.registerPlugin(ScrollTrigger);

// Salida fuerte equivalente a cubic-bezier(0.23, 1, 0.32, 1); nunca curvas con rebote.
const SALIDA = 'expo.out';

type Producto = { nombre: string; precio: number };

function desplazamientoSuave() {
  // Solo con mouse o trackpad: en pantallas táctiles el desplazamiento nativo ya es suave.
  if (!window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches) return;
  const lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((tiempo) => lenis.raf(tiempo * 1000));
  gsap.ticker.lagSmoothing(0);
}

async function portada(escena: HTMLElement) {
  const productos: Producto[] = JSON.parse(escena.dataset.productos ?? '[]');
  const total = document.querySelector<HTMLElement>('[data-total]')!;
  const pantalla = escena.querySelector<HTMLElement>('.telefono-pantalla')!;
  const carrito = escena.querySelector<HTMLElement>('.pantalla[data-pantalla="carrito"]')!;
  const contador = { valor: 0 };

  total.textContent = pesos(0);
  await document.fonts?.ready;
  await esperar(150);
  document.querySelector('[data-bloque-total]')?.classList.add('contando');

  for (const [i, p] of productos.entries()) {
    const etiqueta = escena.querySelector<HTMLElement>(`[data-etiqueta="${i}"]`)!;
    await leer(etiqueta);
    etiqueta.classList.add('escaneada');
    await vuelo(etiqueta, pantalla, escena, `${p.nombre} · ${pesos(p.precio)}`);
    await gsap.to(contador, {
      valor: contador.valor + p.precio,
      duration: 0.5,
      ease: SALIDA,
      onUpdate: () => {
        total.textContent = pesos(Math.round(contador.valor));
      },
    });
    await esperar(120);
  }

  // La pantalla con el carrito sube desde abajo, como si se llenara.
  await gsap.fromTo(
    carrito,
    { clipPath: 'inset(100% 0% 0% 0%)', opacity: 1 },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: SALIDA },
  );
  escena.classList.add('terminada');
}

function empieza(seccion: HTMLElement) {
  const pasos = [...seccion.querySelectorAll<HTMLElement>('[data-paso]')];
  const pantallas = [...seccion.querySelectorAll<HTMLElement>('.escenario .pantalla')];
  const barras = [...seccion.querySelectorAll<HTMLElement>('[data-barra]')];
  const nombres = [...seccion.querySelectorAll<HTMLElement>('[data-indicador]')];
  let actual = -1;
  let capa = 1;

  const mostrar = (i: number) => {
    if (i === actual) return;
    const anterior = actual;
    actual = i;
    const tl = gsap.timeline({ defaults: { ease: SALIDA } });
    if (anterior >= 0) {
      tl.to(pasos[anterior], { opacity: 0, y: -16, duration: 0.18, ease: 'power2.out' }, 0);
    }
    tl.fromTo(pasos[i], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.42 }, 0.06);
    tl.fromTo(
      pasos[i].querySelectorAll('[data-extra]'),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.32, stagger: 0.07 },
      0.22,
    );
    gsap.set(pantallas[i], { zIndex: ++capa, opacity: 1 });
    tl.fromTo(pantallas[i], { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5 }, 0);
    barras.forEach((b, j) => tl.to(b, { scaleX: j === i ? 1 : 0, duration: 0.3 }, 0));
    nombres.forEach((n, j) => n.classList.toggle('activo', j === i));
  };

  seccion.classList.add('escena-fija');
  gsap.set(pasos, { opacity: 0 });
  gsap.set(pantallas, { opacity: 0 });
  mostrar(0);

  ScrollTrigger.create({
    trigger: seccion,
    start: 'top top',
    end: () => `+=${window.innerHeight * 0.85 * pasos.length}`,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (s) => mostrar(Math.min(pasos.length - 1, Math.floor(s.progress * pasos.length))),
  });
}

export function iniciar() {
  desplazamientoSuave();
  const escena = document.querySelector<HTMLElement>('[data-escena]');
  if (escena) alAparecer(escena, () => portada(escena));

  // La escena fija se arma recién cuando la sección está a una pantalla de aparecer.
  const seccion = document.querySelector<HTMLElement>('[data-empieza]');
  if (!seccion) return;
  const observador = new IntersectionObserver(
    (entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      observador.disconnect();
      empieza(seccion);
      ScrollTrigger.refresh();
    },
    { rootMargin: '100% 0px' },
  );
  observador.observe(seccion);
}
