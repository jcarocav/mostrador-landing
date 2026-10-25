// Todos los textos visibles del sitio. Los provisorios se reemplazan con el documento del dueño.
import { marca } from '../marca/marca';

export const textos = {
  portada: {
    titulo: 'Tu inventario, tus ventas, tu negocio.',
    subtitulo:
      'Vende, controla tu stock y administra tu negocio desde el PC o el celular que ya tienes. Sin instalar programas, sin contratos y desde el primer día.',
    botonPrueba: 'Prueba gratis',
    botonPlan: 'Arma tu plan',
  },
  enConstruccion: 'Estamos preparando esta página. Muy pronto vas a poder conocer todo lo que hace.',
  logoAlt: `Inicio de ${marca.nombre}`,
  pie: {
    derechos: (anio: number) => `© ${anio} ${marca.nombre}. Hecho en Chile.`,
  },
} as const;
