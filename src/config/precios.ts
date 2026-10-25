// Precios provisorios: se cambian solo aquí. Montos netos en pesos chilenos; el IVA se suma aparte.

export const IVA = 0.19;

/** Duración del precio promocional, en meses desde la contratación. */
export const MESES_PROMOCION = 3;

export type Plan =
  | { id: string; nombre: string; aCotizar: false; precioPromocional: number; precioNormal: number }
  | { id: string; nombre: string; aCotizar: true };

export const planes: Plan[] = [
  { id: 'emprende', nombre: 'Emprende', aCotizar: false, precioPromocional: 14990, precioNormal: 19990 },
  { id: 'pyme', nombre: 'Pyme', aCotizar: false, precioPromocional: 29990, precioNormal: 34990 },
  { id: 'empresa', nombre: 'Empresa', aCotizar: true },
];

/** Adicionales del armador de planes: llegan con el documento de beneficios del dueño. */
export const adicionales: { id: string; nombre: string; precioMensual: number }[] = [];

export const formatoPesos = (monto: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(monto);
