// Todos los textos visibles del sitio. Los provisorios se reemplazan con el documento del dueño.
import { marca } from '../marca/marca';

export const textos = {
  saltarAlContenido: 'Saltar al contenido',
  nav: {
    comoFunciona: 'Cómo funciona',
    accion: 'Prueba gratis',
  },
  portada: {
    titulo: 'Tu inventario, tus ventas, tu negocio.',
    subtitulo:
      'Vende, controla tu stock y administra tu negocio desde el PC o el celular que ya tienes. Sin instalar programas, sin contratos y desde el primer día.',
    botonPrueba: 'Prueba gratis',
    botonPlan: 'Arma tu plan',
    total: 'Total de la venta',
    escaneado: 'En el carrito',
    comprobante: 'Comprobante',
    altVentaVacia: `Pantalla de venta de ${marca.nombre} en el celular, lista para escanear el primer producto`,
    altVentaCarrito: `Pantalla de venta de ${marca.nombre} en el celular con dos productos en el carrito y el botón Cobrar $14.986`,
  },
  empiezaFacil: {
    titulo: 'Empieza fácil',
    bajada: 'Una venta en tres pasos, desde el primer día y con el celular que ya tienes.',
    pasos: [
      {
        corto: 'Escanea',
        titulo: 'Escanea el producto',
        texto: 'Con la cámara del celular o con una pistola lectora. El producto entra al carrito con su precio.',
        alt: 'Carrito de la venta con dos productos y el botón Cobrar en verde',
      },
      {
        corto: 'Cobra',
        titulo: 'Cobra y da el vuelto',
        texto:
          'Efectivo, débito, crédito o transferencia. Suma los billetes que te entregan y el vuelto se calcula solo, con el redondeo legal.',
        alt: 'Pantalla de cobro en efectivo: recibido $25.000 y vuelto $2.820',
      },
      {
        corto: 'Envía',
        titulo: 'Envía el comprobante',
        texto: 'Por WhatsApp, por correo o como imagen. Es un comprobante interno; la boleta electrónica llega pronto.',
        alt: 'Comprobante de la venta con los botones para compartirlo por WhatsApp o correo',
      },
    ],
    billetes: ['+ $20.000', '+ $5.000'],
    vuelto: 'Vuelto',
    enviado: 'Enviado por WhatsApp',
  },
  enConstruccion: 'Estamos preparando esta página. Muy pronto vas a poder conocer todo lo que hace.',
  logoAlt: `Inicio de ${marca.nombre}`,
  direcciones: {
    titulo: 'Direcciones visuales',
    bajada: 'Dos propuestas para la portada y la sección «Empieza fácil». Elige una.',
    a: { nombre: 'Dirección A · Comprobante claro', texto: 'Fondo claro, la fuente de la app y el comprobante como hilo.' },
    b: { nombre: 'Dirección B · Mostrador de noche', texto: 'Índigo profundo, números grandes y una escena fija al desplazarse.' },
  },
  pie: {
    derechos: (anio: number) => `© ${anio} ${marca.nombre}. Hecho en Chile.`,
  },
} as const;
