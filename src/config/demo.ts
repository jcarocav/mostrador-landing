// Venta de ejemplo de la portada: los mismos productos y montos que muestran las capturas reales de
// la app (src/assets/app/), para que la animación y la pantalla digan lo mismo. El negocio de las
// capturas, «Almacén Peumo Azul», es inventado (DECISIONES.md #14).
export const ventaDemo = {
  productos: [
    { nombre: 'Arroz grado 2, 1 kg', codigo: 'ARROZ', precio: 1590, barras: '7809990010000' },
    { nombre: 'Aceite vegetal 1 L', codigo: 'ACEITE', precio: 3290, barras: '7809990010007' },
  ],
  total: 4880,
  cobro: { recibido: 10000, total: 4880, vuelto: 5120 },
};
