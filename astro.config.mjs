// @ts-check
import { defineConfig } from 'astro/config';

// Sitio 100 % estático: sin servidor, sin adaptador y sin integraciones de terceros.
export default defineConfig({
  output: 'static',
  // Los estilos por componente van como clase: el atributo por defecto sumaba 17 KB al HTML.
  scopedStyleStrategy: 'class',
  build: {
    // El CSS es poco: va dentro del HTML para no esperar otra petición en el celular.
    inlineStylesheets: 'always',
  },
  devToolbar: { enabled: false },
});
