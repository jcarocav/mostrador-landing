# Landing de Mostrador · reglas permanentes para Claude Code

Landing de venta de **Mostrador** (nombre provisorio), la plataforma de punto de venta e inventario
para negocios chilenos. Sitio estático: Astro, GSAP con ScrollTrigger y Lenis.

**Este proyecto es independiente de `mostrador-dev`** y no comparte nada con él: sin Supabase, sin
claves, sin sus documentos internos. De `mostrador-dev` solo se **leen** funciones (para saber qué está
terminado) y solo se **copian imágenes** de la app, sin datos de clientes reales. El repositorio
`github.com/jcarocav/mostrador-landing` es **público**: todo lo que se sube queda a la vista.

Documentos: `DECISIONES.md` (decisiones numeradas) y este archivo.

## Comandos

| Qué | Comando |
|---|---|
| Servidor de desarrollo | `npm run dev` |
| Verificación completa (lo mismo que la CI) | `npm run verificar` |
| Privacidad del repositorio | `npm run privacidad` |
| Tipos / compilar | `npm run check` · `npm run build` |
| Accesibilidad con axe (sobre `dist/`) | `npm run test:a11y` |
| Lighthouse en celular (sobre `dist/`) | `npm run lighthouse` |

## Reglas permanentes

1. **Todo en español de Chile:** reportes, textos del sitio, commits y PRs.
2. **Puntos de control:** se trabaja por fases y se **detiene en cada punto de control** hasta que el
   dueño confirme. El reporte trae capturas en PC y celular, el puntaje de Lighthouse y de axe, las
   decisiones tomadas y la lista corta de lo que el dueño debe probar en su celular.
3. **Rama y PR por bloque.** Nunca push directo a `main` ni push forzado. Cada bloque va en su rama y
   su PR, con `DECISIONES.md` al día dentro de la misma rama.
4. **CI en verde antes de fusionar:** se espera la CI del último commit del PR y se informa su
   resultado. **Se fusiona solo con el OK explícito del dueño**, con
   `gh pr merge <PR> --merge --match-head-commit <sha>`.
5. **Nada se publica en internet sin el OK del dueño:** ni el sitio (GitHub Pages, Netlify, Vercel,
   Cloudflare u otro), ni dominios, ni informes. Lighthouse guarda sus informes en disco; nunca usar
   `temporary-public-storage` ni otro servicio que los suba.
6. **Repositorio público:** antes de cada commit correr `npm run privacidad`. Nunca subir claves,
   `.env`, documentos de la plataforma, datos de clientes ni capturas con datos reales. Si por error se
   sube algo privado, avisar al dueño de inmediato (borrarlo en un commit nuevo no basta: queda en el
   historial).
7. **Anti-gasto: nada que cueste dinero sin la confirmación del dueño en el chat para esa acción**
   (dominios, hosting o planes de pago, APIs de pago, servicios de terceros, suscripciones). Antes de
   pedirla se dice qué servicio, cuántas veces y el costo estimado. No crear cuentas ni claves en
   proveedores.
8. **Accesibilidad WCAG 2.1 AA:** axe sin violaciones graves (`serious` o `critical`) en celular y PC,
   con y sin movimiento reducido. Lighthouse en celular: rendimiento ≥ 90 y accesibilidad ≥ 95. Texto
   principal de 16 px como mínimo (14 px solo en datos secundarios), contraste AA, todo usable con
   teclado y con foco visible, botones fáciles de tocar (44 px) y nada comunicado solo con color. Las
   pruebas de accesibilidad nunca se debilitan, se saltan ni se borran: una prueba en rojo se arregla
   con código.
9. **Movimiento y `prefers-reduced-motion`:** con movimiento reducido la página se ve completa y
   quieta, y Lenis no se activa. Todo se entiende sin animación. Movimientos de menos de un segundo, sin
   rebotes, solo `transform` y `opacity`, y cargados solo cuando la sección aparece en pantalla. Cada
   sección con movimiento pasa por la skill `review-animations`.
10. **Marca, precios y textos en un solo lugar:** nombre, logo y colores en `src/marca/` (`marca.ts` y
    `logo.svg`); precios en `src/config/precios.ts`; textos visibles en `src/textos/`. Los componentes
    usan solo las variables de tema de `src/estilos/global.css`, nunca colores fijos. Índigo es el color
    principal; **verde solo para cobrar y éxito**.
11. **Contenido honesto:** solo se promete lo que existe hoy en la app; lo demás va marcado como
    «Próximamente». No se nombra a ninguna competencia. Las cifras, testimonios y logos de clientes no
    se inventan.
12. **Sin formularios, sin cookies, sin analítica y sin peticiones a terceros** (las fuentes se
    autoalojan). El armador de planes calcula todo en el navegador y no guarda ni envía nada; solo el
    botón de WhatsApp abre un enlace con las respuestas escritas, por decisión del visitante. La prueba
    «sin terceros ni cookies» lo vigila.
13. **Dependencias:** versiones exactas (`.npmrc` con `save-exact`), solo las necesarias, con
    `npm audit` limpio y, de preferencia, publicadas hace al menos una semana.
14. **Leer el resumen completo de cada prueba** (pasadas, fallidas y omitidas) antes de un commit o de
    reportar verde.
15. **Credenciales:** este proyecto no usa ninguna. Nunca pedirlas ni mostrarlas en el chat.

## Skills de este proyecto

- **Una sola skill de «gusto»: `taste-skill`** (pendiente de la decisión del dueño, ver
  `DECISIONES.md`). No se mezcla con Impeccable, UI UX Pro Max ni Frontend Design, que quedan
  desactivados para este proyecto en `.claude/settings.json`.
- **`emil-design-eng`**: criterio para diseñar cada animación (curvas, duraciones, cuándo no animar).
- **`review-animations`**: revisión obligatoria de cada sección con movimiento. La skill trae
  `disable-model-invocation` (Claude no puede invocarla solo), así que Claude la aplica leyendo su
  `SKILL.md` y `STANDARDS.md` y entrega la tabla Antes / Después / Por qué con el veredicto. El dueño
  también puede correrla con `/review-animations`.
- Las skills se copian desde su repositorio oficial con `LICENSE` y `ORIGEN.txt` (commit y fecha).
  Antes de instalar o actualizar una se lee completa, con sus scripts.
- **context7:** solo nombres de librerías y preguntas de documentación; nunca código propio.
