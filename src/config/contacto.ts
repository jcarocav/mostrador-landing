// Contacto del sitio. El número es de EJEMPLO: el dueño pone aquí el real antes de publicar.
// Formato internacional sin «+» ni espacios. WhatsApp no tiene asignado este número.
export const WHATSAPP = '56900000000';

/** Enlace que abre WhatsApp con el mensaje ya escrito. Nada se envía hasta que la persona lo manda. */
export const enlaceWhatsApp = (mensaje: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
