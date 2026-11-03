// Precios de la landing: se cambian solo aquí. Montos netos en pesos chilenos; el IVA se suma aparte.

export const IVA = 0.19;

/** Duración del precio promocional, en meses desde la contratación. */
export const MESES_PROMOCION = 3;

export type Limites = { cajas: number; usuarios: number; ubicaciones: number; productos: number };

export type Plan =
  | { id: 'emprende' | 'pyme'; nombre: string; aCotizar: false; precioPromocional: number; precioNormal: number; limites: Limites }
  | { id: 'empresa'; nombre: string; aCotizar: true };

// Los límites son los de la tabla `planes` de la app (Emprende y Pyme): no se inventan aquí.
export const planes: Plan[] = [
  {
    id: 'emprende',
    nombre: 'Emprende',
    aCotizar: false,
    precioPromocional: 14990,
    precioNormal: 19990,
    limites: { cajas: 1, usuarios: 3, ubicaciones: 2, productos: 1000 },
  },
  {
    id: 'pyme',
    nombre: 'Pyme',
    aCotizar: false,
    precioPromocional: 29990,
    precioNormal: 34990,
    limites: { cajas: 5, usuarios: 15, ubicaciones: 10, productos: 10000 },
  },
  { id: 'empresa', nombre: 'Empresa', aCotizar: true },
];

/**
 * Adicionales del armador de planes. PRECIOS DE EJEMPLO puestos por Claude: el dueño debe confirmarlos
 * antes de publicar (DECISIONES.md #18). Las cantidades son las de la tabla `adicionales` de la app.
 */
export const adicionales: { id: string; nombre: string; detalle: string; precioMensual: number }[] = [
  { id: 'usuario', nombre: 'Usuario adicional', detalle: 'Una persona más con su usuario y su PIN.', precioMensual: 2990 },
  { id: 'caja', nombre: 'Caja con usuario adicional', detalle: 'Una caja más, con la persona que la atiende.', precioMensual: 7990 },
  { id: 'productos', nombre: 'Paquete de 1.000 productos', detalle: 'Más espacio en tu catálogo.', precioMensual: 3990 },
];

export const conIva = (neto: number) => Math.round(neto * (1 + IVA));

export const formatoPesos = (monto: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(monto);

export const formatoNumero = (n: number) => new Intl.NumberFormat('es-CL').format(n);
