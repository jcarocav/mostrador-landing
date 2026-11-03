// Lógica de «Arma tu plan»: de las respuestas al plan recomendado y a los totales. Corre solo en el
// navegador: no guarda ni envía nada. Los textos de las preguntas viven en src/textos/textos.ts.
import { adicionales, conIva, MESES_PROMOCION, planes, type Limites } from './precios';

export type Necesidades = Limites;
export type Respuestas = Record<string, string>;

// Lo que cada respuesta significa en número. Las preguntas que no están aquí no cambian el plan.
const VALORES: Record<string, Record<string, Partial<Necesidades> & { bodegas?: number }>> = {
  locales: { uno: { ubicaciones: 1 }, pocos: { ubicaciones: 3 }, varios: { ubicaciones: 8 }, muchos: { ubicaciones: 11 } },
  bodega: { no: { bodegas: 0 }, una: { bodegas: 1 }, varias: { bodegas: 2 } },
  cajas: { una: { cajas: 1 }, dos: { cajas: 2 }, hasta5: { cajas: 5 }, mas: { cajas: 6 } },
  personas: { solo: { usuarios: 1 }, hasta3: { usuarios: 3 }, cuatro: { usuarios: 4 }, hasta15: { usuarios: 15 }, mas: { usuarios: 16 } },
  productos: { hasta1000: { productos: 1000 }, hasta2000: { productos: 2000 }, hasta10000: { productos: 10000 }, mas: { productos: 10001 } },
};

export function necesidades(r: Respuestas): Necesidades {
  const n: Necesidades = { cajas: 1, usuarios: 1, ubicaciones: 1, productos: 0 };
  let bodegas = 0;
  for (const [pregunta, respuesta] of Object.entries(r)) {
    const { bodegas: b, ...resto } = VALORES[pregunta]?.[respuesta] ?? {};
    Object.assign(n, resto);
    bodegas += b ?? 0;
  }
  n.ubicaciones += bodegas;
  return n;
}

const limitesDe = (id: 'emprende' | 'pyme'): Limites => {
  const plan = planes.find((p) => p.id === id);
  if (!plan || plan.aCotizar) throw new Error(`Plan sin límites: ${id}`);
  return plan.limites;
};

export type Recomendacion = { plan: 'emprende' | 'pyme' | 'empresa'; adicionales: string[] };

/**
 * El plan más barato que alcanza. Cada adicional se activa una sola vez (son interruptores): si Emprende
 * necesita más que eso, o más ubicaciones, que no se venden aparte, conviene Pyme. Sobre Pyme, Empresa.
 */
export function recomendar(n: Necesidades): Recomendacion {
  const pyme = limitesDe('pyme');
  if (n.cajas > pyme.cajas || n.usuarios > pyme.usuarios || n.ubicaciones > pyme.ubicaciones || n.productos > pyme.productos) {
    return { plan: 'empresa', adicionales: [] };
  }

  const emprende = limitesDe('emprende');
  const cajasDeMas = Math.max(0, n.cajas - emprende.cajas);
  const usuariosDeMas = Math.max(0, n.usuarios - emprende.usuarios - cajasDeMas); // cada caja adicional trae su usuario
  const paquetes = Math.ceil(Math.max(0, n.productos - emprende.productos) / 1000);
  if (n.ubicaciones > emprende.ubicaciones || cajasDeMas > 1 || usuariosDeMas > 1 || paquetes > 1) {
    return { plan: 'pyme', adicionales: [] };
  }

  const elegidos = [cajasDeMas && 'caja', usuariosDeMas && 'usuario', paquetes && 'productos'].filter(Boolean) as string[];
  return { plan: 'emprende', adicionales: elegidos };
}

export type Totales = { promocional: number; normal: number; promocionalConIva: number; normalConIva: number; meses: number };

/** Total mensual neto y con IVA. La promoción rebaja el plan; los adicionales cuestan lo mismo todos los meses. */
export function totales(planId: string, elegidos: string[]): Totales | null {
  const plan = planes.find((p) => p.id === planId);
  if (!plan || plan.aCotizar) return null;
  const extra = adicionales.filter((a) => elegidos.includes(a.id)).reduce((suma, a) => suma + a.precioMensual, 0);
  const promocional = plan.precioPromocional + extra;
  const normal = plan.precioNormal + extra;
  return { promocional, normal, promocionalConIva: conIva(promocional), normalConIva: conIva(normal), meses: MESES_PROMOCION };
}
