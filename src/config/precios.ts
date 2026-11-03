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
 * Adicionales, + IVA al mes, con los precios del documento del dueño (DECISIONES.md #23). `suma` dice qué
 * límite amplía cada uno: Arma tu plan lo usa para recomendarlos. Los «próximamente» se muestran con su
 * precio, pero no se pueden activar ni entran al total. Nombres y descripciones: src/textos/textos.ts.
 */
export type Adicional = { id: string; precioMensual: number; proximamente?: boolean; suma?: Partial<Limites> };

export const adicionales: Adicional[] = [
  { id: 'usuario', precioMensual: 1990, suma: { usuarios: 1 } },
  { id: 'caja', precioMensual: 4990, suma: { cajas: 1, usuarios: 1 } },
  { id: 'ubicacion', precioMensual: 4990, suma: { ubicaciones: 1 } },
  { id: 'productos', precioMensual: 2990, suma: { productos: 5000 } },
  { id: 'pos-movil', precioMensual: 2990, proximamente: true },
  { id: 'mercadolibre', precioMensual: 7990, proximamente: true },
  { id: 'shopify', precioMensual: 7990, proximamente: true },
  { id: 'woocommerce', precioMensual: 7990, proximamente: true },
];

export const conIva = (neto: number) => Math.round(neto * (1 + IVA));

export const formatoPesos = (monto: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(monto);

export const formatoNumero = (n: number) => new Intl.NumberFormat('es-CL').format(n);
