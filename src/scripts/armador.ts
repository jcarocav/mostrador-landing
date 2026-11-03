// «Arma tu plan» en la pantalla. Las respuestas viven solo en esta variable: no se guardan ni se envían,
// y desaparecen al recargar. Los enlaces de WhatsApp se abren únicamente si la persona los toca.
import { necesidades, recomendar, totales, type Recomendacion, type Respuestas } from '../config/armador';
import { formatoPesos } from '../config/precios';

type Datos = {
  whatsapp: string;
  aCotizar: string;
  planes: { id: string; nombre: string }[];
  adicionales: { id: string; nombre: string }[];
  preguntas: { id: string; corto: string; opciones: { id: string; texto: string }[] }[];
  titulos: Record<string, string>;
  frases: Record<string, string>;
  notas: Record<string, string>;
  plantillas: Record<string, string>;
};

const raiz = document.querySelector<HTMLElement>('[data-armador]');
const crudo = document.querySelector('[data-armador-datos]')?.textContent;

if (raiz && crudo) iniciar(raiz, JSON.parse(crudo) as Datos);

function iniciar(raiz: HTMLElement, d: Datos) {
  const uno = <T extends HTMLElement>(s: string) => raiz.querySelector<T>(s)!;
  const preguntas = [...raiz.querySelectorAll<HTMLElement>('[data-pregunta]')];
  const interruptores = [...raiz.querySelectorAll<HTMLInputElement>('[data-adicional]')];
  const atras = uno<HTMLButtonElement>('[data-atras]');
  const resultado = uno('[data-resultado]');
  const avance = uno('[data-avance]');
  const llenar = (s: string, v: Record<string, string | number>) => Object.entries(v).reduce((t, [k, x]) => t.replace(`{${k}}`, String(x)), s);
  const enlace = (mensaje: string) => `https://wa.me/${d.whatsapp}?text=${encodeURIComponent(mensaje)}`;

  let respuestas: Respuestas = {};
  let actual = 0;
  let reco: Recomendacion = { plan: 'emprende', adicionales: [] };

  const nombrePlan = (id: string) => d.planes.find((p) => p.id === id)?.nombre ?? id;

  function pintarAvance(respondidas: number) {
    const total = preguntas.length;
    avance.setAttribute('aria-valuenow', String(respondidas));
    uno('[data-avance-barra]').style.transform = `scaleX(${respondidas / total})`;
    uno('[data-avance-texto]').textContent = llenar(d.plantillas.avance, { a: Math.min(respondidas + 1, total), t: total });
  }

  function mostrarPregunta(i: number, enfocar: boolean) {
    actual = i;
    resultado.hidden = true;
    preguntas.forEach((p, j) => (p.hidden = j !== i));
    atras.hidden = i === 0;
    pintarAvance(i);
    if (enfocar) preguntas[i].querySelector('h3')!.focus({ preventScroll: true });
  }

  function notas(): string[] {
    const n = d.notas;
    const lista: string[] = [];
    if (respuestas.internet !== 'estable') lista.push(n.internet);
    if (respuestas.equipo !== 'pc') lista.push(n.celular);
    const prioridad = n[respuestas.prioridad];
    if (prioridad) lista.push(prioridad);
    return lista;
  }

  function resumenDeRespuestas() {
    return d.preguntas.map((p) => `${p.corto}: ${p.opciones.find((o) => o.id === respuestas[p.id])?.texto ?? ''}`);
  }

  function actualizarTotal() {
    const elegidos = interruptores.filter((i) => i.checked).map((i) => i.dataset.adicional!);
    const t = totales(reco.plan, elegidos);
    const promo = t ? formatoPesos(t.promocional) : '';
    const normal = t ? formatoPesos(t.normal) : '';

    uno('[data-total-monto]').textContent = t ? promo : d.aCotizar;
    uno('[data-total-unidad]').textContent = t ? d.plantillas.promocion : '';
    uno('[data-total-despues]').textContent = t ? llenar(d.plantillas.despues, { m: normal }) : '';
    uno('[data-total-iva]').textContent = t
      ? llenar(d.plantillas.conIva, { p: formatoPesos(t.promocionalConIva), n: formatoPesos(t.normalConIva) })
      : '';

    const nombres = d.adicionales.filter((a) => elegidos.includes(a.id)).map((a) => a.nombre);
    const lineas = [
      d.plantillas.mensajeInicio,
      '',
      ...resumenDeRespuestas(),
      '',
      llenar(d.plantillas.mensajePlan, { p: nombrePlan(reco.plan) }),
      ...(nombres.length ? [llenar(d.plantillas.mensajeAdicionales, { l: nombres.join(', ') })] : []),
      ...(t ? [llenar(d.plantillas.mensajeTotal, { p: promo, n: normal })] : []),
    ];
    uno<HTMLAnchorElement>('[data-enlace-asesoren]').href = enlace(lineas.join('\n'));
    uno<HTMLAnchorElement>('[data-enlace-probar]').href = enlace(llenar(d.plantillas.mensajeProbar, { p: nombrePlan(reco.plan) }));
  }

  function mostrarResultado() {
    reco = recomendar(necesidades(respuestas));
    preguntas.forEach((p) => (p.hidden = true));
    atras.hidden = false;
    pintarAvance(preguntas.length);
    uno('[data-avance-texto]').textContent = '';
    resultado.hidden = false;

    const titulo = uno('[data-resultado-titulo]');
    titulo.textContent = d.titulos[reco.plan];
    uno('[data-resultado-frase]').textContent = d.frases[reco.plan];
    uno('[data-resultado-notas]').replaceChildren(
      ...notas().map((texto) => {
        const li = document.createElement('li');
        li.textContent = texto;
        return li;
      }),
    );
    const cotiza = reco.plan === 'empresa';
    uno('[data-bloque-adicionales]').hidden = cotiza;
    uno('[data-enlace-probar]').hidden = cotiza;
    interruptores.forEach((i) => (i.checked = reco.adicionales.includes(i.dataset.adicional!)));
    actualizarTotal();
    titulo.focus({ preventScroll: true });
    titulo.scrollIntoView({ block: 'center', behavior: 'instant' });
  }

  raiz.addEventListener('click', (e) => {
    const opcion = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-opcion]');
    if (!opcion) return;
    const pregunta = opcion.closest<HTMLElement>('[data-pregunta]')!;
    respuestas = { ...respuestas, [pregunta.dataset.pregunta!]: opcion.dataset.opcion! };
    pregunta.querySelectorAll('[data-opcion]').forEach((b) => b.setAttribute('aria-pressed', String(b === opcion)));
    if (actual + 1 < preguntas.length) mostrarPregunta(actual + 1, true);
    else mostrarResultado();
  });

  atras.addEventListener('click', () => mostrarPregunta(resultado.hidden ? actual - 1 : preguntas.length - 1, true));
  interruptores.forEach((i) => i.addEventListener('change', actualizarTotal));

  uno('[data-reiniciar]').addEventListener('click', () => {
    respuestas = {};
    raiz.querySelectorAll('[data-opcion]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    mostrarPregunta(0, true);
  });
}
