# Decisiones

Cada decisión con número, fecha, qué se decidió, por qué y qué alternativas hubo. Lo que no se pudo
comprobar se marca **NO VERIFICADO**.

## 1 · 2026-10-25 · Proyecto independiente y repositorio público

- **Decisión:** la landing vive en `github.com/jcarocav/mostrador-landing`, público, separado de
  `mostrador-dev`. No comparte código, claves, Supabase ni documentos internos.
- **Por qué:** en repositorios públicos GitHub Actions no tiene límite de minutos, y la landing no
  tiene nada secreto.
- **Cómo se protege:** `npm run privacidad` (también en la CI) revisa nombres y contenido de cada
  archivo buscando claves, tokens, `.env`, documentos de la plataforma y analítica.
- **Sin licencia abierta:** el código queda con todos los derechos reservados (un repositorio público
  sin licencia no autoriza a reutilizarlo). Las skills copiadas mantienen su MIT.

## 2 · 2026-10-25 · Stack: Astro + GSAP/ScrollTrigger + Lenis (propuesto, falta el OK del dueño)

- **Astro 7.4.2 (MIT), sitio estático:** entrega HTML y CSS sin JavaScript por defecto; el JavaScript
  se carga solo en las secciones que lo necesitan. Es lo mejor para el celular.
- **GSAP 3.15.0 con ScrollTrigger** para las escenas al desplazarse: maneja secciones fijas mientras
  se desplaza, avance ligado al scroll y `gsap.matchMedia()` para apagar todo con movimiento reducido.
  Licencia «Standard No Charge» de GSAP: gratis y con uso comercial permitido, incluidos los plugins;
  no es de código abierto y no puede usarse para construir un editor visual de sitios que compita con
  Webflow (no es nuestro caso).
- **Lenis 1.3.27 (MIT)** para el desplazamiento suave, sincronizado con ScrollTrigger y **sin activarse**
  con `prefers-reduced-motion`.
- GSAP y Lenis **todavía no se instalan**: se agregan en la Fase 1 si el dueño aprueba el stack.
- En el celular Lenis deja el desplazamiento táctil nativo (por defecto no suaviza el dedo), así que
  no agrega trabajo donde más cuesta.
- **Alternativas:** solo CSS (`animation-timeline: scroll()` y `position: sticky`): sirve para efectos
  simples, pero su soporte en navegadores no es parejo (**NO VERIFICADO** el estado exacto a la fecha) y
  no da el control fino de GSAP para escenas con varios pasos. Motion (ex Framer Motion): pensado para React y obligaría a
  cargar React. Next.js: más JavaScript en el celular sin ganar nada para un sitio estático.
- Context7 tiene la documentación algo atrasada (Astro 6.3, GSAP 3.13); las versiones se tomaron del
  registro de npm el 2026-10-25.

## 3 · 2026-10-25 · Lighthouse directo en vez de Lighthouse CI

- **Decisión:** `scripts/lighthouse.mjs` corre Lighthouse 13.5.0 tres veces por página, emulando un
  celular, toma la mediana de rendimiento y falla bajo 90 (accesibilidad bajo 95).
- **Por qué:** `@lhci/cli` 0.15.1 (su última versión, de junio de 2025) trae 13 vulnerabilidades altas
  en dependencias viejas. Con Lighthouse directo, `npm audit` queda en 0.
- **Además:** los informes quedan en `informes/lighthouse/` y como artefacto de la CI; nunca se suben a
  un servidor público. El servidor de prueba no comprime: se mide el peor caso.

## 4 · 2026-10-25 · axe con Playwright y Chrome instalado

- **Decisión:** `@axe-core/playwright` revisa WCAG 2.0 y 2.1 A y AA en celular (Pixel 7) y PC
  (1440 px), con y sin movimiento reducido, después de recorrer toda la página. Falla con cualquier
  violación `serious` o `critical`; las moderadas y menores quedan anotadas en el informe.
- Usa el Chrome instalado (`channel: 'chrome'`), que viene en el ubuntu de GitHub Actions: no se
  descargan navegadores.
- Se comprobó que la compuerta falla: con una imagen sin `alt` y un botón sin nombre, axe marcó
  `image-alt` y `button-name` como críticas.
- La misma suite exige **cero peticiones a otros dominios y cero cookies**.

## 5 · 2026-10-25 · Skills

- **emil-design-eng y review-animations** (github.com/emilkowalski/skills, MIT): solo Markdown, sin
  scripts ni llamadas externas. Instaladas en `.claude/skills/` con `LICENSE` y `ORIGEN.txt`.
- **taste-skill** (github.com/Leonxlnx/taste-skill, MIT, uso comercial permitido): **no instalada,
  esperando la decisión del dueño**, porque sus scripts sí ejecutan comandos y contactan servicios:
  - `scripts/lib/cdp.mjs` abre Chrome sin ventana (y en Windows lo cierra con `taskkill`); lo usan
    `inspect.mjs` y `scenes.mjs`, que además levantan un servidor local en 127.0.0.1 para sacar capturas.
  - `scripts/assets.mjs` busca y descarga imágenes de Openverse, Wikimedia Commons, Art Institute of
    Chicago, The Met, Internet Archive y NASA (sin claves).
  - `scripts/draw.mjs` guarda un historial en `~/.taste-skill/history.json` (fuera del proyecto) y sus
    hojas sugieren fotos de picsum.photos y fuentes de Google Fonts.
  - Sus reglas prohíben el violeta y el índigo; con nuestra marca habría que usar `--keep palette,type`
    y `--allow` en el inspector.
- **Impeccable y Frontend Design** quedan desactivados en `.claude/settings.json` para este proyecto, y
  UI UX Pro Max no está instalada aquí. **NO VERIFICADO** que la desactivación surta efecto: se
  comprueba al abrir la primera sesión en esta carpeta.

## 6 · 2026-10-25 · Marca, precios y textos centralizados

- `src/marca/marca.ts` tiene el nombre, el logo (`logo.svg`, con `currentColor`) y las escalas de color
  de la app (índigo `#5431d4`, verde `#037e3f`, neutros). El favicon se genera del mismo logo.
- `src/config/precios.ts`: Emprende $14.990 y Pyme $29.990 + IVA por 3 meses; después $19.990 y
  $34.990 + IVA; Empresa a cotizar. Los adicionales llegan con el documento del dueño.
- `src/textos/textos.ts`: todos los textos visibles.
- Astro trae telemetría activada por defecto: se apagó en este PC (`astro telemetry disable`) y en la
  CI (`ASTRO_TELEMETRY_DISABLED`).
