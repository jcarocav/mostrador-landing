// Único lugar de la marca: nombre, logo y colores. Al llegar el nombre y el logo definitivos se
// cambian aquí (y el archivo logo.svg) y todo el sitio se actualiza, incluido el favicon.
import logoSvg from './logo.svg?raw';

type Escala = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>;

export const marca = {
  /** Nombre provisorio del producto. */
  nombre: 'Mostrador',
  lema: 'Punto de venta e inventario',
  descripcion:
    'Vende, controla tu stock y administra tu negocio desde el PC o el celular que ya tienes.',
  /** SVG del logo. Usa currentColor para tomar el color del tema. */
  logoSvg,
  /** Número de WhatsApp en formato internacional sin «+» (pendiente del dueño). */
  whatsapp: '',
  colores: {
    // Índigo: color principal (acciones, enlaces, marca). Valores de la app.
    marca: {
      50: '#f4f5ff', 100: '#e8e9fe', 200: '#d3d5ff', 300: '#b4b5ff', 400: '#8f8afe', 500: '#715afc',
      600: '#5431d4', 700: '#4521b6', 800: '#361794', 900: '#280f72', 950: '#16044a',
    },
    // Verde: SOLO para cobrar y éxito.
    exito: {
      50: '#f0faf2', 100: '#dff3e3', 200: '#c1e8ca', 300: '#98d5a8', 400: '#60bb7c', 500: '#259f56',
      600: '#037e3f', 700: '#016732', 800: '#005226', 900: '#003e1b', 950: '#00250d',
    },
    neutro: {
      50: '#f9fafc', 100: '#f2f3f7', 200: '#e4e6ec', 300: '#d2d4dc', 400: '#8c8f98', 500: '#70737b',
      600: '#53555d', 700: '#3d3f47', 800: '#272830', 900: '#16181f', 950: '#080a10',
    },
  } satisfies Record<string, Escala>,
} as const;

/** Las escalas como variables CSS (--marca-600, --exito-600, --neutro-900, ...). */
export const variablesCss = `:root{${Object.entries(marca.colores)
  .flatMap(([familia, escala]) => Object.entries(escala).map(([paso, valor]) => `--${familia}-${paso}:${valor};`))
  .join('')}}`;
