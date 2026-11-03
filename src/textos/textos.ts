// Todos los textos visibles del sitio. Lo que se promete aquí sale de la tabla «disponible /
// próximamente» de DECISIONES.md #17: si una función no está terminada, va como próximamente.
import { IVA, MESES_PROMOCION } from '../config/precios';
import { marca } from '../marca/marca';

const n = marca.nombre;

export const textos = {
  saltarAlContenido: 'Saltar al contenido',
  logoAlt: `Inicio de ${n}`,
  proximamente: 'Próximamente',
  nav: {
    principal: 'Principal',
    comoFunciona: 'Cómo funciona',
    planes: 'Planes',
    preguntas: 'Preguntas',
    accion: 'Prueba gratis',
  },
  portada: {
    tituloLineas: ['Tu inventario,', 'tus ventas,', 'tu negocio.'],
    subtitulo:
      'Vende, controla tu stock y administra tu negocio desde el PC o el celular que ya tienes. Sin instalar programas, sin contratos y desde el primer día.',
    botonPrueba: 'Prueba gratis',
    botonPlan: 'Arma tu plan',
    total: 'Total de la venta',
    escaneado: 'En el carrito',
    altVentaVacia: `Pantalla de venta de ${n} en el celular, lista para escanear el primer producto`,
    altVentaCarrito: `Pantalla de venta de ${n} en el celular con dos productos en el carrito y el botón Cobrar $4.880`,
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
        alt: 'Pantalla de cobro en efectivo: recibido $10.000 y vuelto $5.120',
      },
      {
        corto: 'Envía',
        titulo: 'Envía el comprobante',
        texto: 'Por WhatsApp, por correo o como imagen. Es un comprobante interno; la boleta electrónica llega pronto.',
        alt: 'Comprobante de la venta con los botones para compartirlo por WhatsApp o correo',
      },
    ],
    billetes: ['+ $5.000', '+ $5.000'],
    vuelto: 'Vuelto',
    enviado: 'Enviado por WhatsApp',
  },
  rubros: {
    titulo: 'Para tu rubro',
    bajada: 'Al registrarte eliges tu rubro y partes con sus categorías listas. Mira qué es lo que más vas a usar.',
    etiquetaPestanas: 'Elige tu rubro',
    usaras: 'Lo que más vas a usar',
    ejemplos: 'Productos de ejemplo',
    lista: [
      {
        id: 'almacen',
        nombre: 'Almacén',
        titulo: 'Lo de siempre, a un toque',
        texto: 'Deja a mano lo que más vendes y cobra sin buscar. En efectivo, el vuelto sale solo y con el redondeo legal.',
        puntos: ['Accesos rápidos a tus productos más vendidos', 'Ventas en espera para atender al que sigue', 'Categorías de almacén listas'],
        pronto: ['Boleta electrónica', 'Fiado y cuenta corriente'],
        productos: [
          { nombre: 'Pan de molde 500 g', precio: 2290, barras: '7809990010021' },
          { nombre: 'Leche entera 1 L', precio: 1190, barras: '7809990010014' },
        ],
      },
      {
        id: 'minimarket',
        nombre: 'Minimarket',
        titulo: 'Miles de productos bajo control',
        texto: 'Sube tu catálogo por Excel y deja que las alertas de stock mínimo te digan qué reponer antes de que se acabe.',
        puntos: ['Carga y edición de productos por Excel', 'Alertas de stock mínimo por local', 'Hasta 5 cajas con el plan Pyme'],
        pronto: ['Boleta electrónica', 'Impuestos adicionales de bebidas y alcoholes'],
        productos: [
          { nombre: 'Agua mineral 1,5 L', precio: 1090, barras: '7809990010069' },
          { nombre: 'Yogur natural 1 L', precio: 2490, barras: '7809990010076' },
        ],
      },
      {
        id: 'petshop',
        nombre: 'Petshop',
        titulo: 'Compras por caja y vendes por unidad',
        texto: 'Cada producto puede tener un código de unidad y otro de caja. Si escaneas la caja, suma todas sus unidades.',
        puntos: ['Códigos de unidad y de caja', 'Traslados entre bodega y tienda', 'Categorías de mascotas listas'],
        pronto: ['Lotes y vencimiento'],
        productos: [
          { nombre: 'Arena sanitaria 10 kg', precio: 12990, barras: '7809990000035' },
          { nombre: 'Collar ajustable', precio: 5990, barras: '7809990000028' },
        ],
      },
      {
        id: 'ferreteria',
        nombre: 'Ferretería',
        titulo: 'Si no trae código, le haces uno',
        texto: 'Genera códigos internos e imprime etiquetas para lo que llega sin código de barras, desde un perno hasta un rollo de cable.',
        puntos: ['Códigos internos y etiquetas para imprimir', 'Conteos de inventario con aprobación', 'Pedidos a proveedores'],
        pronto: ['Factura electrónica', 'Cotizaciones'],
        productos: [
          { nombre: 'Perno hexagonal 3/8"', precio: 190, barras: '7809990010083' },
          { nombre: 'Cable eléctrico, 10 m', precio: 8990, barras: '7809990010090' },
        ],
      },
      {
        id: 'ropa',
        nombre: 'Ropa',
        titulo: 'Tus prendas, contadas por local',
        texto: 'Hoy cada talla o color se carga como un producto con su propio código, y ves cuántas quedan en cada local.',
        puntos: ['Stock en vivo por local', 'Devoluciones y vales de cambio', 'Categorías de ropa, calzado y accesorios listas'],
        pronto: ['Variantes de talla y color', 'Boleta electrónica'],
        productos: [
          { nombre: 'Polera algodón, talla M', precio: 8990, barras: '7809990010106' },
          { nombre: 'Jeans recto, talla 42', precio: 24990, barras: '7809990010113' },
        ],
      },
      {
        id: 'otro',
        nombre: 'Otro',
        titulo: 'Parte simple y ordénalo a tu manera',
        texto: 'Si tu rubro no aparece, te registras con lo mínimo y creas tus propias categorías. También hay una plantilla para librerías.',
        puntos: ['Categorías a tu medida', 'Tu logo y tus colores en la app', 'Usuarios con su rol y su PIN'],
        pronto: ['Boletas y facturas electrónicas'],
        productos: [
          { nombre: 'Cuaderno universitario', precio: 2190, barras: '7809990010120' },
          { nombre: 'Servicio de ejemplo', precio: 5000, barras: '7809990010137' },
        ],
      },
    ],
  },
  nuncaParado: {
    titulo: 'Nunca te deja parado',
    bajada: 'Se corta internet y la caja sigue cobrando. La venta queda guardada en tu equipo y se envía sola cuando vuelve la señal.',
    secuencia: ['Sin señal', 'Venta guardada en este equipo', 'Enviada al volver la señal'],
    detalles: [
      {
        titulo: 'Tu catálogo viaja contigo',
        texto: 'Productos y precios bajan a tu equipo al iniciar el turno. Escaneas y buscas igual, con o sin señal.',
      },
      {
        titulo: 'Ninguna venta se pierde',
        texto: 'Cada venta toma su número de comprobante al llegar al servidor. Si algo no cuadra, queda a la vista para revisarla.',
      },
      {
        titulo: 'Lo único que espera',
        texto: 'Lo que necesita el PIN de un administrador, como un descuento sobre tu límite, debe esperar a que vuelva la señal.',
      },
    ],
    alt: 'Caja en el celular con el aviso de venta guardada sin conexión y una venta pendiente de enviarse',
  },
  control: {
    titulo: 'Control real',
    bajada: 'Sabes qué tienes, qué falta y quién hizo qué, aunque no estés en el local.',
    stock: {
      titulo: 'Stock en vivo',
      texto: 'Cada venta y cada traslado mueven el stock al instante, por local y por bodega. Lo bajas a Excel cuando quieras.',
      alt: 'Portal en el PC con el stock en vivo de doce productos en la bodega y el local',
    },
    caja: {
      titulo: 'Cada caja cierra con su informe',
      texto: 'Efectivo esperado, contado y diferencia. Si faltan $500, queda escrito, con la hora y con el nombre de quien atendió.',
      alt: 'Informe de cierre de caja en el celular con un faltante de $500',
    },
    reportes: {
      titulo: 'Reportes de inventario',
      texto: 'Valor de tu stock, productos sin movimiento, quiebres, rotación y mermas, por local y por categoría.',
      alt: 'Portal en el PC con el reporte de stock valorizado por categoría y los diez productos de mayor valor',
      pronto: 'Reportes de ventas y rentabilidad',
    },
    personas: {
      titulo: 'Cada persona, con su PIN',
      texto: 'Turnos por persona y cuatro roles: Super Administrador, Administrador, Vendedor y Reponedor. Cada uno ve lo suyo.',
    },
  },
  crece: {
    titulo: 'Crece contigo',
    bajada: 'Partes con una caja. Cuando abras otro local, sumas cajas, personas y bodegas sin cambiar de sistema.',
    filas: [
      { clave: 'cajas', nombre: 'cajas' },
      { clave: 'usuarios', nombre: 'usuarios' },
      { clave: 'ubicaciones', nombre: 'locales y bodegas' },
      { clave: 'productos', nombre: 'productos' },
    ],
    entrada: 'Con Emprende',
    salida: 'Con Pyme',
    vieneTitulo: 'Lo que viene',
    viene: [
      { nombre: 'Boletas y facturas electrónicas del SII', texto: 'Hoy el comprobante es interno. La emisión electrónica es lo próximo importante.' },
      { nombre: 'Reportes de ventas y rentabilidad', texto: 'Ventas por producto, vendedor y medio de pago, con tu margen real.' },
      { nombre: 'Starterpack', texto: 'Dos pistolas lectoras y dos impresoras térmicas en tu puerta, con un solo pago.' },
      { nombre: 'POS móvil con QR', texto: 'El vendedor arma la venta en su celular y en la caja solo se cobra.' },
      { nombre: 'Integraciones', texto: 'Terminales de pago, tiendas en línea, despachos y contabilidad.' },
    ],
  },
  planes: {
    titulo: 'Planes y precios',
    bajada: `Precio promocional por ${MESES_PROMOCION} meses. Después pagas el precio normal, que ves aquí mismo. Sin contratos.`,
    alMes: '+ IVA al mes',
    primerosMeses: `los primeros ${MESES_PROMOCION} meses`,
    desdeMes: `Desde el mes ${MESES_PROMOCION + 1}:`,
    conIva: (promocional: string, normal: string) => `Con IVA del ${IVA * 100} %: ${promocional} y después ${normal} al mes.`,
    limites: {
      cajas: (x: string) => `${x} ${x === '1' ? 'caja' : 'cajas'}`,
      usuarios: (x: string) => `${x} usuarios`,
      ubicaciones: (x: string) => `${x} locales o bodegas`,
      productos: (x: string) => `${x} productos`,
    },
    planEmprende: 'Para un local que parte.',
    planPyme: 'Para más cajas, locales y bodegas.',
    planEmpresa: 'Para cadenas y operaciones más grandes.',
    aCotizar: 'A cotizar',
    empresaTexto: 'Si necesitas más de 5 cajas o más de 10 locales, conversamos y armamos el plan contigo.',
    boton: 'Prueba gratis',
    botonEmpresa: 'Pedir cotización',
    mensajeProbar: (plan: string) => `Hola, quiero probar ${n} con el plan ${plan}.`,
    mensajeCotizar: `Hola, quiero cotizar el plan Empresa de ${n}.`,
    incluyenTitulo: 'Todos los planes incluyen',
    incluyen: [
      'Caja en PC, tablet y celular',
      'Venta sin conexión',
      'Inventario y traslados',
      'Cierre de caja con informe',
      'Devoluciones y vales',
      'Reportes de inventario',
      'Exportar a Excel y respaldos',
    ],
    prontoTitulo: 'Boletas y facturas electrónicas',
  },
  confianza: {
    titulo: 'Confianza',
    bajada: 'Sin logos prestados ni testimonios armados. Esto es lo que puedes comprobar tú.',
    lista: [
      { titulo: 'Tus datos son tuyos.', texto: 'Bajas productos, stock y reportes a Excel, y haces un respaldo cuando quieras.' },
      { titulo: 'Cada negocio va aparte.', texto: 'Tu información queda separada de la de otros negocios, y cada persona ve solo lo que su rol permite.' },
      { titulo: 'Sin contratos.', texto: 'Pagas mes a mes, en pesos chilenos, y sabes desde hoy cuánto pagarás después de la promoción.' },
      { titulo: 'Decimos lo que falta.', texto: 'Lo que aún no está listo dice «Próximamente». Y hoy el comprobante es interno: no reemplaza a la boleta.' },
      { titulo: 'Hecho en Chile.', texto: 'Con redondeo legal del efectivo y pensado para negocios de aquí.' },
    ],
  },
  preguntas: {
    titulo: 'Preguntas frecuentes',
    lista: [
      {
        p: '¿Tengo que instalar algo?',
        r: 'No. Funciona en el navegador del PC, la tablet o el celular que ya tienes. Si quieres, lo agregas a la pantalla de inicio y se abre como una app.',
      },
      {
        p: '¿Emite boletas y facturas?',
        r: 'Todavía no. Hoy entrega un comprobante interno, que no reemplaza a la boleta ni a la factura. La emisión electrónica ante el SII está en camino.',
      },
      {
        p: '¿Funciona sin internet?',
        r: 'Para vender, sí. Las ventas quedan guardadas en tu equipo y se envían solas al volver la señal. Necesitas internet para iniciar el turno y para lo que pide el PIN de un administrador.',
      },
      {
        p: '¿Qué equipos necesito?',
        r: 'Un PC, tablet o celular con navegador. Para escanear sirve la cámara o una pistola lectora conectada al equipo. Los comprobantes se imprimen con la impresora que tengas instalada.',
      },
      {
        p: '¿Cuánto pago cuando termina la promoción?',
        r: `Los primeros ${MESES_PROMOCION} meses pagas el precio promocional. Desde el mes ${MESES_PROMOCION + 1}, Emprende queda en $19.990 + IVA y Pyme en $34.990 + IVA.`,
      },
      {
        p: '¿Tengo que firmar un contrato?',
        r: 'No. Pagas mes a mes y no hay permanencia mínima.',
      },
      {
        p: '¿Cómo cargo mis productos?',
        r: 'Con una planilla Excel, de una sola vez, o uno por uno desde la app. Si un producto no trae código de barras, la app le genera uno interno.',
      },
      {
        p: '¿Puedo cambiar de plan?',
        r: 'Sí. Por ahora nos escribes y lo cambiamos nosotros. Pronto podrás hacerlo tú mismo desde la app.',
      },
      {
        p: '¿Puedo llevarme mis datos?',
        r: 'Sí. Exportas tus productos, tu stock y tus reportes a Excel cuando quieras, y puedes hacer un respaldo completo.',
      },
    ],
  },
  contacto: {
    titulo: 'Contacto',
    bajada: 'Cuéntanos de tu negocio y te ayudamos a partir. Respondemos por WhatsApp, sin formularios.',
    boton: 'Escríbenos por WhatsApp',
    flotante: 'Escríbenos por WhatsApp',
    mensaje: `Hola, quiero saber más de ${n}.`,
    aviso: 'Al escribirnos, tus datos los maneja WhatsApp.',
    avisoEnlace: 'Lee la privacidad',
  },
  pie: {
    derechos: (anio: number) => `© ${anio} ${n}. Hecho en Chile.`,
    privacidad: 'Privacidad',
    navegacion: 'Pie de página',
  },
  privacidad: {
    tituloPagina: `Privacidad · ${n}`,
    descripcion: `Esta página de ${n} no usa cookies ni guarda tus datos.`,
    titulo: 'Privacidad',
    volver: 'Volver al inicio',
    bloques: [
      {
        titulo: 'Esta página no te sigue',
        texto: 'No usamos cookies ni herramientas de analítica, y no guardamos ningún dato de quienes la visitan. Tampoco carga nada desde otros servicios.',
      },
      {
        titulo: 'Arma tu plan queda en tu navegador',
        texto: 'Tus respuestas y el precio se calculan en tu navegador. No se guardan ni se envían, y desaparecen al cerrar o recargar la página.',
      },
      {
        titulo: 'Si nos escribes por WhatsApp',
        texto: 'Los botones de WhatsApp abren esa aplicación con un mensaje escrito, que tú decides enviar. Desde ese momento, tus datos los maneja WhatsApp según sus propias condiciones.',
      },
    ],
  },
} as const;
