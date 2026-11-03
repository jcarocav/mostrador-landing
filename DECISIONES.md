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

## 7 · 2026-10-25 · Stack aprobado por el dueño

- Astro 7.4.2, GSAP 3.15.0 con ScrollTrigger y Lenis 1.3.27, con versión exacta. Se instalan en la
  Fase 1 junto con las fuentes autoalojadas (`@fontsource-variable`, licencia OFL 1.1): Plus Jakarta Sans
  (la fuente de la app) y Bricolage Grotesque (solo para probarla en la dirección B).

## 8 · 2026-10-25 · taste-skill: solo el SKILL.md, y nuestras reglas mandan

- **Decisión del dueño:** se instala solo `SKILL.md` (sin `scripts/`, `references/`, `library/` ni
  `assets/`). Copia idéntica a la oficial, commit `12af471f627f866411b4bd785b19646d3672784c`, con
  `LICENSE` y `ORIGEN.txt`. Las capturas las hace `scripts/capturas.mjs`.
- **Qué hacía `taskkill` (para el registro):** `scripts/lib/cdp.mjs` corre
  `taskkill /pid <pid> /T /F` con el **PID del Chrome que el mismo script abrió**. No cierra los Chrome
  por nombre. `/T` cierra también los procesos hijos de ese Chrome y `/F` lo fuerza. El único riesgo,
  muy improbable, es que Windows hubiera reasignado ese número de proceso a otro programa si ese Chrome
  ya se había cerrado. Aparte, `sweepProfiles()` solo borra carpetas de perfil temporales que dejó una
  corrida anterior (las suyas, marcadas con un archivo de dueño) y no cierra procesos.
- **Precedencia:** nuestra paleta manda sobre taste-skill (índigo principal, verde solo para cobrar y
  éxito, aunque la skill prohíbe el violeta y el índigo). Cuando una regla de la skill choca con los
  criterios del documento del dueño (movimientos de menos de un segundo, sin rebotes, pantallas reales
  de la app), mandan los criterios del documento. Queda escrito en `CLAUDE.md`.

## 9 · 2026-10-25 · Protección de `main`

- **Configurada (protección clásica de rama):** exige el check `verificar` de GitHub Actions (es el
  trabajo que corre la CI completa), con la rama al día (`strict`); exige PR para todo cambio, con 0
  aprobaciones porque el dueño trabaja solo; aplica también a los administradores; prohíbe push forzado
  y borrar `main`.
- **Comprobada el 2026-10-25:**
  - push directo a `main`: rechazado (`GH006 Protected branch update failed`);
  - PR con la CI **en curso**: la API de GitHub rechazó la fusión con la cuenta de administrador
    (`Required status check "verificar" is in progress`, HTTP 405);
  - PR con la CI **en rojo** (axe marcó `image-alt` crítico): rechazado
    (`Required status check "verificar" is failing`);
  - PR cuya CI corrió **antes** de que `main` avanzara: rechazado
    (`Required status check "verificar" is expected`): hay que poner la rama al día y repetir la CI.
- **Lo que no bloquea (aprendido a la mala):** un PR que aparece «atrasado» respecto de `main` pero
  cuya CI se lanzó cuando `main` ya estaba en su último commit se considera al día, porque la CI de un
  PR prueba la fusión con el `main` vigente. Así se fusionó por error el PR 3 de prueba: dejó en `main`
  un archivo de texto, que el PR 4 quitó con el OK del dueño. No entró nada más.
- Los PR de prueba 2 y 5 se cerraron sin fusionar y sus ramas se borraron.

## 10 · 2026-10-25 · Fase 1: dos direcciones como prototipos navegables

- Las dos direcciones se construyeron como páginas reales (`/direcciones/a/` y `/direcciones/b/`,
  con `noindex`) para ver el movimiento de verdad, no solo imágenes. Cuando el dueño elija, la otra se
  borra y la elegida pasa a ser la portada.
- **Capturas reales de la app:** cuatro pantallas de `mostrador-dev`
  (`docs/diseno/antes-despues/fase-2c-1`): venta vacía, carrito con dos productos, cobro con vuelto y
  comprobante con WhatsApp. Se copiaron solo las imágenes, re-codificadas sin metadatos. Muestran datos
  de prueba («Negocio E2E», «Vera Vendedora»), no de clientes. Miden 390 × 844 (1x): en celulares de
  alta densidad se ven algo blandas. En la Fase 2 conviene sacarlas de nuevo a 3x y con un negocio de
  ejemplo creíble, en vez de «Negocio E2E» (requiere que el dueño inicie sesión en la app local).
- La animación de la portada usa los mismos productos y montos que las capturas
  (`src/config/demo.ts`). Arranca recién cuando la escena se ve en pantalla.
- **review-animations** se aplicó leyendo su SKILL.md y STANDARDS.md (la skill no se deja invocar
  sola). Hallazgo corregido: en la B los pasos inactivos quedaban con `visibility: hidden` (vía
  `autoAlpha` de GSAP) y un lector de pantalla solo habría leído el paso activo; ahora se ocultan solo
  con opacidad.
- Rendimiento: la B tiene 94 en Lighthouse celular (LCP 2,9 s, por la imagen del teléfono) contra 100
  de la A (LCP 1,7 s). GSAP, ScrollTrigger y Lenis se cargan solo con movimiento permitido y después
  de la primera pintura.
- Las páginas de direcciones dan SEO 60-63 en Lighthouse porque llevan `noindex` a propósito (es un
  aviso, no detiene la CI).
- `sharp` (Apache-2.0) queda como dependencia de desarrollo explícita: ya venía con Astro y lo usan
  las hojas de fotogramas.

## 11 · 2026-11-02 · Dirección visual elegida: B, «Mostrador de noche»

- **Decisión del dueño:** la landing sigue con la dirección B (`/direcciones/b/`): índigo profundo,
  Bricolage Grotesque en los títulos, cifras grandes y «Empieza fácil» como escena fija con GSAP
  ScrollTrigger, más Lenis en el PC.
- **Motivo:** elección del dueño en el punto de control de la Fase 1, comparando las dos direcciones.
- **Alternativa descartada:** dirección A, «Comprobante claro».
- **Pendiente para la Fase 2, en una sesión nueva abierta en la carpeta de la landing:** borrar la
  dirección A, pasar la B a la portada y quitar el índice `/direcciones/`, como dice la decisión 10.
  Esta decisión no cambia código: las dos direcciones siguen en la rama `fase-1`. El PR 6 sigue en
  borrador.

## 12 · 2026-11-02 · Falla de contraste en la CI del PR 6: dos causas, las dos arregladas

- **Síntoma:** la CI falló en `2a583ce` con `color-contrast` en `li[data-paso="2"] h3` de
  `/direcciones/b/` (celular, con movimiento) y había pasado en `9174385`. Entre esos commits solo
  cambió `DECISIONES.md`, así que el código era el mismo.
- **Reproducción:** en este PC, 60 repeticiones de la prueba pasaron. Con la misma secuencia y la CPU
  frenada por Chrome (`Emulation.setCPUThrottlingRate`), midiendo opacidades antes, después y 1,5 s
  después de axe, 30 corridas por velocidad:

  | CPU | axe de inmediato con falla | axe en reposo con falla | Opacidades en reposo |
  |---|---|---|---|
  | normal | 1 de 30 | 0 de 30 | `1, 1, 0` en 30 de 30 |
  | 4 veces más lenta | 30 de 30 | 0 de 30 | `1, 1, 0` en 30 de 30 |
  | 8 veces más lenta | 0 de 30 | 0 de 30 | `1, 1, 0` en 30 de 30 |

- **Causa 1, la que se sospechaba (confirmada): axe mide durante el desvanecimiento.** La prueba volvía
  arriba y lanzaba axe de inmediato, y el paso 3 seguía apagándose. axe calcula el contraste con la
  opacidad del momento: midió el h3 casi transparente (1,01 a 1,09 contra un mínimo de 3:1). Si axe
  llegaba al título con el paso aún visible, pero ya casi apagado, fallaba; si llegaba antes o después,
  no. Por eso pasaba o fallaba según la velocidad de la máquina. A velocidad normal falla poco. Que a
  8x no falle sería porque axe tarda tanto que llega al título con el paso ya apagado: **NO VERIFICADO**,
  es la lectura de esos datos, sin medir el instante exacto.
- **Causa 2, que nadie sospechaba y es un defecto real de la página: dos pasos quedaban visibles.**
  Al desplazarse rápido, `mostrar()` apagaba el paso anterior en 0,18 s, pero la entrada de ese mismo
  paso, de 0,42 s, seguía corriendo y lo volvía a dejar en opacidad 1. El texto de dos pasos quedaba
  encimado hasta que el paso cambiaba otra vez. Pasaba en todas las corridas y en celular y en PC. axe
  no lo marcaba porque ambos textos tienen buen contraste por separado.
- **Arreglo de la página:** `mostrar()` cancela la línea de tiempo anterior antes de empezar la nueva y
  apaga todos los pasos que no son el actual, no solo el anterior.
- **Arreglo de la prueba:** axe mide con la página en reposo. `enReposo()` espera a que ningún elemento
  cambie de opacidad, posición, recorte ni texto durante 300 ms y a que no quede ninguna animación
  activa. Si la página nunca se aquieta, la prueba falla por tiempo: no se mide «como esté».
- **La prueba quedó más exigente, no menos:**
  - agrega «tras un desplazamiento rápido queda un solo paso visible», que falló en celular y PC antes
    del arreglo (recibió 2, esperaba 1);
  - agrega axe en reposo en cada uno de los tres pasos: antes, con movimiento, axe solo veía el primero
    porque los otros estaban en opacidad 0.
- **Comprobado después del arreglo:** en reposo `1, 0, 0` en 60 de 60 corridas; la prueba real, con
  `enReposo()`, 40 de 40 a velocidad normal, 40 de 40 a 4x y 40 de 40 a 8x; suite completa 28 de 28. Sin
  la espera, axe sigue fallando (33 de 60), o sea que la causa 1 existe por sí sola.
- **Alternativas descartadas:** subir `retries` (escondería la falla), una espera fija de 1,5 s (se
  rompe en una máquina lenta o con una animación más larga) y excluir la escena de axe (debilita la
  prueba).

## 13 · 2026-11-02 · Cierre de la Fase 1: la B pasa a la portada y sale la A

- **Decisión del dueño:** el PR 6 lleva a `main` solo la dirección B y lo compartido. Se borran
  `/direcciones/a/`, el índice `/direcciones/` y sus textos. La B pasa a `/` sin `noindex`, y la página
  provisoria de la Fase 0 desaparece. `src/scripts/direccion-b.ts` pasa a llamarse `escenas.ts`.
- **Cómo era la dirección A, «Comprobante claro», por si se quiere recuperar** (el código completo
  queda en el commit `9174385`, archivo `src/pages/direcciones/a.astro`):
  - **Color:** fondo claro `--neutro-100`, tarjetas blancas, texto `--neutro-900`, banda de «Empieza
    fácil» en `--marca-50`; botón principal índigo.
  - **Tipografía:** solo Plus Jakarta Sans (la fuente de la app), peso 800, títulos de hasta 100 px con
    tracking de -0.045em.
  - **Forma:** botones de borde completamente redondo y etiquetas con esquinas de 14 px.
  - **Portada:** a la izquierda el título y los botones; a la derecha dos etiquetas de producto, el
    celular al centro y un comprobante blanco. Al escanear cada etiqueta, el producto vuela al celular,
    aparece su línea en el comprobante y el total sube. El comprobante era el hilo de la página.
  - **Empieza fácil:** el celular quedaba fijo con `position: sticky` y los pasos seguían su flujo
    normal al lado. Una franja de lectura con `IntersectionObserver` marcaba el paso activo con una
    barra índigo vertical. No usaba GSAP ni Lenis: era solo CSS y un observador.
  - **Rendimiento:** 100 en Lighthouse celular (LCP 1,7 s) contra 94 de la B.

## 14 · 2026-11-02 · Capturas a 3x con un negocio de ejemplo inventado

- **Negocio de ejemplo:** «Almacén Peumo Azul», con Rosa como dueña y Camila como cajera (solo nombres
  de pila), dos ubicaciones («Local Centro» y «Bodega») y doce productos genéricos sin marcas. El nombre
  se buscó en la web el 2026-11-02 y no apareció ningún negocio con él. **NO VERIFICADO** contra el
  registro del SII: un almacén chico puede no estar en internet.
- **Cómo se sacaron:** con el stack local de pruebas de `mostrador-dev` (Postgres embebido y PostgREST,
  sin Supabase), sin pedirle al dueño que iniciara sesión. Un archivo temporal en `e2e/capturas/` armó
  el negocio y se borró al terminar: `git status` de `mostrador-dev` quedó limpio y de ese proyecto solo
  se copiaron las imágenes, re-codificadas sin metadatos.
- **Tamaños:** celular 1170 × 2532 (3x de 390 × 844) y PC 2880 × 1800 (2x de 1440 × 900; a 3x pesan
  mucho sin aportar nada a ese ancho).
- **Son pantallas reales de la app.** Solo se cambiaron datos en la base local: el nombre del negocio,
  el código `PEUMO` y la fecha del último respaldo, para que el aviso de respaldo no tape la pantalla.
- La venta de la portada (`src/config/demo.ts`) es la misma de las capturas: arroz $1.590 + aceite
  $3.290 = $4.880, recibido $10.000, vuelto $5.120. Antes el total de la animación ($14.986) no coincidía
  con el cobro de la captura ($22.180).

## 15 · 2026-11-02 · LCP: de 2,8 s a 1,7 s y Lighthouse celular de 94 a 100

- **LCP real, medido:** la imagen del celular de la portada, como pensaba el dueño.
- **Causas y arreglos:**
  - la prioridad alta estaba en la pantalla del carrito, oculta al cargar, y no en la vacía, que es la
    que se ve: Telefono recibe `primera`, y esa imagen se precarga en el `<head>` con su mismo `srcset`;
  - GSAP, ScrollTrigger y Lenis (131 KB) se pedían antes de pintar: ahora se cargan después de `load`, en
    un momento libre del navegador;
  - se pedían imágenes que aún no se veían: con movimiento quedan en `display: none` hasta que hacen
    falta, y el navegador no baja un `lazy` oculto;
  - las capturas se sirven en WebP en cinco tamaños (260 a 1170 px): un celular común baja unos 30 KB.
- **El respaldo de 4 segundos sigue activo** hasta que llega el script: si llega tarde, la página ya
  quedó completa y el script no hace nada.
- Las fuentes se declaran a mano solo con el subconjunto latino (trae acentos y ñ), en vez de las hojas
  de `@fontsource` con todos sus subconjuntos.
- **Mínimo de Lighthouse:** el rendimiento sube de 90 a 95, como pidió el dueño, en `scripts/lighthouse.mjs`,
  la CI y `CLAUDE.md`.

## 16 · 2026-11-02 · Fuentes y escena fija en el celular

- **Bricolage Grotesque** solo en títulos y cifras grandes. El nombre de la marca en la barra pasa a la
  fuente de la app (Plus Jakarta Sans), igual que el texto corrido y los botones.
- **Escena de «Empieza fácil» en el celular:** cada paso se recorre con 0,3 pantallas de desplazamiento
  (0,9 en total, antes 2,55), o sea un deslizamiento corto del dedo. En el PC sigue en 0,85 por paso.
  Queda vigilado por la prueba «el paso a paso se recorre con un desplazamiento corto en el celular».
  **NO VERIFICADO** en un celular físico: el dueño debe probar si se siente natural.
- Los colores de la dirección B pasaron de `.dir-b` a las variables del tema en `global.css`, porque
  ahora es el único tema del sitio.

## 17 · 2026-11-02 · Tabla «disponible / próximamente» (para que el dueño la revise al final)

Salió de leer el código de `mostrador-dev` (menú del portal, pantallas, migraciones, pruebas E2E) y su
especificación, con `main` en `9d1eb1b` y la rama `freno-vales`. «Disponible» significa que existe la
pantalla y su prueba E2E. **Producción todavía no existe:** disponible no quiere decir que un cliente
pueda entrar hoy (ver #18).

| Función | Estado | Cómo se comprobó |
|---|---|---|
| Caja en el navegador del PC, tablet y celular | Disponible | `src/pages/caja/`, `fase22-caja` |
| Escanear con cámara o pistola, buscar por nombre | Disponible | `Venta.tsx` |
| Accesos rápidos, ventas en espera, descuentos, notas | Disponible | `Venta.tsx`, capturas |
| Cobro en efectivo, débito, crédito, transferencia y mixto | Disponible, **sin terminal integrado** | `Cobro.tsx` |
| Vuelto con billetes y redondeo legal del efectivo | Disponible | `fase22-caja` |
| Comprobante interno por WhatsApp, correo, imagen, PDF o impresora | Disponible | `Comprobante.tsx` |
| Vender sin conexión; la venta se envía sola al volver la señal | Disponible | `fase22-caja`, «sin conexión» |
| Apertura, arqueo, retiros y cierre de caja con informe | Disponible | `Arqueo.tsx`, `CierreCajaDetalle.tsx` |
| Devoluciones y vales | Disponible | `Devoluciones.tsx`, `Vales.tsx` |
| Stock en vivo por ubicación, traslados, reposición, conteos, mermas | Disponible | menú del portal |
| Pedidos a proveedores y pedidos de clientes | Disponible | menú del portal |
| Importar y editar productos por Excel; stock por Excel | Disponible | `ImportarProductos`, `EdicionMasiva`, `StockMasivo` |
| Códigos internos y etiquetas para imprimir | Disponible | `CodigosBarra`, `Etiquetas` |
| Código de unidad y de caja | Disponible | `Venta.tsx` |
| Reportes de inventario: valorizado, sin movimiento, quiebres, rotación, mermas | Disponible | `Reportes.tsx` |
| Usuarios, cuatro roles, turnos con PIN | Disponible | `Usuarios.tsx`, `fase16-turnos` |
| Exportar a Excel o CSV y respaldo | Disponible | `Exportar.tsx`, `Respaldo.tsx` |
| Logo y colores del negocio | Disponible | `Personalizacion.tsx` |
| Plantillas por rubro: mascotas, minimarket/almacén, ferretería, boutique, librería, genérica | Disponible (solo categorías) | `lib/rubros.ts` |
| Límites por plan aplicados en el servidor | Disponible | migración `organizaciones_y_membresias` |
| Boletas, facturas, notas de crédito y guías del SII | **Próximamente** | Fase 3; el comprobante dice «No es una boleta» |
| Reportes de ventas y rentabilidad | **Próximamente** | sub-paso 2e; el menú solo tiene inventario |
| Starterpack (pistolas e impresoras) | **Próximamente** | Fase 4 |
| POS móvil con QR | **Próximamente** | sub-paso 2e. La caja en el celular sí existe: es otra cosa |
| Integraciones: terminales, tiendas en línea, despachos, contabilidad | **Próximamente** | Fase 5 |
| Clientes, fiado, cotizaciones, listas de precio, ofertas | **Próximamente** | sigue en la lista de pendientes de `PROGRESO.md` |
| Lotes y vencimiento, variantes de talla y color, kits | **Próximamente** | Reportes muestra «Por vencer · próximamente» |
| Impuestos adicionales de bebidas y alcoholes | **Próximamente** | sección 6.3 de la especificación |
| Cambiar de plan y pagar desde la app | **Próximamente** | Fase 4; hoy el plan lo asigna el dueño |
| Apps en Play Store y App Store | **Próximamente** | Fase 4 |

Todos los textos de la landing se escribieron contra esta tabla. Si una fila cambia, se revisan
`src/textos/textos.ts` y `src/config/precios.ts`.

## 18 · 2026-11-02 · Decisiones de contenido tomadas sin esperar al dueño

- **«Prueba gratis» lleva a Contacto y abre WhatsApp.** Producción no existe, así que no hay a dónde
  mandar a registrarse. Cuando exista, se cambia el destino en `Barra.astro`, `Portada.astro` y
  `Planes.astro`. No se dice cuántos días dura la prueba: **el dueño debe definirlo.**
- **Número de WhatsApp de ejemplo:** `56900000000` en `src/config/contacto.ts`. El dueño pone el real.
- **PRECIOS DE EJEMPLO en los adicionales:** usuario $2.990, caja con usuario $7.990 y paquete de 1.000
  productos $3.990, en `src/config/precios.ts`. El documento de beneficios no llegó y la base de la app
  no trae precios. **El dueño debe confirmarlos antes de publicar.**
- **Límites de los planes:** se usaron los de la app (Emprende: 1 caja, 3 usuarios, 2 ubicaciones,
  1.000 productos; Pyme: 5, 15, 10 y 10.000). Los documentos mensuales (300 y 3.000) no se muestran
  mientras el SII sea «Próximamente».
- **«Sin contratos» y «sin permanencia»:** se mantiene la frase del dueño. La respuesta «no hay
  permanencia mínima» es una lectura de esa frase y el dueño debe confirmarla.
- **Plan Empresa a cotizar:** la especificación decía que no se ofrecía; manda la instrucción nueva del
  dueño. Su texto dice «más de 5 cajas o más de 10 locales».
- **Confianza sin logos ni testimonios,** porque no hay clientes: son cinco hechos comprobables.
- **El botón flotante de WhatsApp es blanco y no verde,** por la regla «verde solo para cobrar y éxito».
- **El nombre de la marca en la barra usa la fuente de la app;** en el pie va a todo el ancho con
  Bricolage, como cierre de la página.
- **Productos de ejemplo en «Para tu rubro»:** nombres genéricos sin marcas. Sus precios son ilustrativos.
- **Página larga en el celular:** unas 14.500 px con todo, sobre todo por las capturas. **NO VERIFICADO**
  si se siente larga: el dueño lo juzga en su celular.

## 19 · 2026-11-02 · Rendimiento con la página completa: `content-visibility` y axe sobre todo

- Al sumar las secciones, Lighthouse cayó de 100 a 91 (LCP 3,2 s) y el HTML subió de 32 a 92 KB.
- **Causas y arreglos:** la regla que evita pedir las imágenes de los pasos quedó en el componente
  equivocado al separar la portada (volvieron a pedirse antes de pintar); los estilos por componente
  sumaban 17 KB (`scopedStyleStrategy: 'class'`); los códigos de barra pesaban 15 KB (un solo `path`
  por etiqueta); y el mayor gasto era CPU: maquetar 14.000 px al abrir. `content-visibility: auto` en
  las secciones lejanas lo evita.
- **Resultado:** Lighthouse celular 99, LCP 2,0 s, HTML 75 KB (15 KB con gzip).
- **Riesgo revisado:** `content-visibility` podría esconderle secciones a axe, lo que debilitaría la
  prueba sin que nadie lo note. Se plantó texto de contraste 1:1 en `#planes` y `#contacto` y axe lo
  marcó con y sin movimiento. La primera versión de esa comprobación falló, porque no recorría la
  página, y dejó ver otro problema: las transiciones fuera de pantalla quedan congeladas y `enReposo()`
  no terminaba. `enReposo()` ahora fuerza a renderizar todo antes de medir: axe mide la página completa.
- Queda vigilado que los enlaces del menú lleguen a su sección aunque aún no esté renderizada.

- **La CI del PR 8 cayó** en «con movimiento reducido la página queda completa y quieta»: la prueba exigía
  cero animaciones en un instante y encontró 7. Son las transiciones de 1 ms que deja la regla de
  movimiento reducido, todavía en curso en el runner, más lento que este PC. Es el mismo error de la
  decisión 12: medir un instante. La prueba ahora exige que ninguna animación dure más de 1 ms, lo que
  sí prueba que la página no se mueve, y además que llegue al reposo.

## 20 · 2026-11-02 · Margen de rendimiento para la CI: AVIF, precarga por página y estilos sin clases de alcance

- **Por qué:** el PR 8 pasó la CI con rendimiento 95, justo en el mínimo, y en este PC daba 99: el runner
  de GitHub es más lento. Arma tu plan suma HTML y CSS, así que había que ganar margen sin bajar la vara.
- **Capturas en AVIF a calidad 50, con WebP de respaldo** (`<picture>`): a la vista no se distingue del
  WebP a 80 (se comparó un recorte con texto lado a lado) y pesa un 38 % menos. La imagen del LCP pasó de
  31 a 20 KB. Los navegadores sin AVIF reciben el WebP.
- **Tres tamaños por formato en vez de cinco:** cada tamaño alarga el `srcset` de todas las imágenes.
- **La fuente de los títulos no se precarga si la página tiene una imagen principal:** en la portada
  competía con el LCP. En la privacidad sí se precarga, porque allí el LCP es el título y sin precarga
  el CLS subía de 0,002 a 0,035.
- **Estilos sin clases de alcance:** cada componente pasó de `<style>` con alcance a `<style is:global>`,
  con la raíz del componente delante de cada selector (`#planes h3`). Astro ya no agrega una clase
  `astro-xxxx` a cada etiqueta: el HTML bajó de 100 a 84 KB. La conversión la hizo un script con
  PostCSS, no un reemplazo de texto.
- **Comprobado que la conversión no cambió el diseño:** se compararon el tamaño, la posición y los
  estilos calculados de los 697 elementos de la portada, antes y después. La única diferencia es el
  precio de las etiquetas, que ahora respeta el `margin-top: 2px` que tenía escrito: antes lo anulaba,
  sin querer, la mayor especificidad que daba la clase de alcance.
- **Descartado:** sacar el CSS a un archivo aparte (dio solo 2 puntos y empeoró la privacidad), servir
  comprimido en la prueba (Lighthouse mide el peor caso a propósito, decisión 3) y bajar el mínimo.
- **Resultado en este PC:** portada 98 (LCP 2,0 s) y privacidad 100. La medición varía de 94 a 98 según
  la carga del equipo. **NO VERIFICADO** el margen en la CI hasta que corra el PR.

## 21 · 2026-11-02 · Arma tu plan

- **Nueve preguntas** con botones grandes (72 px de alto): rubro, locales, bodega, cajas, personas,
  productos, equipo, internet y prioridad. Al tocar una respuesta pasa a la siguiente, el foco va al
  título de la nueva pregunta y «Pregunta N de 9» se anuncia a los lectores de pantalla. «Atrás»
  conserva lo elegido.
- **Barra de avance:** `role="progressbar"` con `aria-valuenow`, dibujada con `transform: scaleX`.
- **Recomendación (`src/config/armador.ts`):** el plan más barato que alcanza, con los límites reales
  de la app. Cada adicional es un interruptor (se activa una vez): si Emprende necesita más de una caja,
  un usuario o un paquete de productos extra, o más de 2 ubicaciones, que no se venden aparte, conviene
  Pyme. Sobre los límites de Pyme, Empresa a cotizar. La caja adicional trae su usuario.
- **Total en vivo:** precio promocional del plan más los adicionales, con lo que se paga desde el mes 4 y
  los montos con IVA. Los adicionales no tienen promoción.
- **Notas honestas según las respuestas:** si pide boletas o «saber cuánto gano», se le dice que aún no
  están.
- **Nada se guarda ni se envía:** sin `localStorage`, `sessionStorage`, IndexedDB ni cookies, y sin
  peticiones mientras responde (lo vigila una prueba). Al recargar, las respuestas desaparecen.
  «Prefiero que me asesoren» abre WhatsApp con las respuestas y el resultado escritos, solo si la
  persona lo toca.
- **Sin JavaScript** se ve un aviso con el botón de WhatsApp, en vez de botones que no hacen nada.
- **Un solo campo blanco en la página:** Arma tu plan va en blanco, el momento en que la persona
  responde. El botón flotante de WhatsApp tiene un borde oscuro para verse también ahí.
- **review-animations** (leído de su SKILL.md y STANDARDS.md):

  | Antes | Después | Por qué |
  |---|---|---|
  | Opacidad de las entradas con `ease` | `var(--curva-salida)` | Una entrada con curva débil se siente lenta |
  | El `input` del interruptor quedaba debajo del riel | `input` encima, centrado | El clic directo caía en el riel; con el teclado funcionaba |
  | Pregunta nueva: 180 ms de opacidad y 8 px | Se mantiene | Cambia el contenido completo; ocurre 9 veces por visita, no cientos |
  | Barra de avance: 240 ms `scaleX` | Se mantiene | Solo `transform`, bajo 300 ms, explica el avance |
  | Interruptor: 180 ms `translateX` | Se mantiene | Respuesta directa a la acción, interrumpible (es una transición) |

  Veredicto: **aprobado**. Con movimiento reducido las transiciones duran 1 ms y la prueba exige que
  ninguna animación dure más que eso.

## 22 · 2026-11-02 · Espacio perdido en el título de la portada

- Al revisar las capturas del informe final se vio «Tu inventario,tus ventas» en el PC. Astro no deja
  espacio entre una expresión y la etiqueta `<br>` que la sigue. En el celular ese `<br>` hace el salto
  y no se notaba; en el PC, donde ese salto está oculto, las palabras quedaban pegadas, también para un
  lector de pantalla.
- Arreglo: cada línea del título termina con su espacio. Una prueba nueva exige que el nombre accesible
  y el texto visible sean «Tu inventario, tus ventas, tu negocio.».
- De paso, el nombre de las etiquetas usa `text-wrap: balance`: «Pan de molde 500 g» dejaba la «g» sola
  en una línea.

## 23 · 2026-11-03 · Precios de los adicionales del documento del dueño

- **Decisión del dueño,** + IVA al mes, en `src/config/precios.ts`: usuario adicional $1.990, caja adicional
  con usuario $4.990, tienda o bodega adicional $4.990 y +5.000 productos $2.990. Además, **Próximamente**:
  POS móvil con QR $2.990 y las integraciones con Mercado Libre, Shopify o WooCommerce, $7.990 cada una.
  Reemplazan los precios de ejemplo de la decisión 18.
- **Arma tu plan los recomienda con estos valores.** Emprende crece con una caja (trae su usuario), un
  usuario, una tienda o bodega y 5.000 productos, cada uno una vez, porque son interruptores. Si hace falta
  más, o si así cuesta lo mismo o más que Pyme después de la promoción ($34.990), recomienda Pyme. Ejemplo:
  caja, tienda y 5.000 productos suman $32.960 desde el mes 4, todavía menos que Pyme.
- Antes, las tiendas y bodegas no se vendían aparte: un local con dos bodegas iba directo a Pyme. Ahora le
  conviene Emprende con una tienda o bodega adicional.
- **Lo que es Próximamente se ve con su precio, pero no tiene interruptor ni entra al total.** Lo vigila una
  prueba, igual que la lista de adicionales con sus precios, que también se agregó a «Planes y precios».
- Los nombres y descripciones de los adicionales pasaron a `src/textos/textos.ts`, y en precios quedan
  solo los montos.
- **«Sin permanencia mínima»: confirmado por el dueño** (pendiente de la decisión 18).

## 24 · 2026-11-03 · Antes de publicar (lista del dueño)

El sitio no se publica hasta tener todo esto. «Prueba gratis» y WhatsApp quedan como están hasta entonces.

- [ ] **Número real de WhatsApp:** uno solo para el producto, en `src/config/contacto.ts`.
- [ ] **Prueba de 14 días sin tarjeta,** cuando exista producción: «Prueba gratis» pasa de WhatsApp al
  registro de la app y los textos dicen la duración.
- [ ] **Nombre y logo definitivos:** `src/marca/marca.ts` y `src/marca/logo.svg`. El favicon sale del logo.
- [ ] **Dominio.** Comprarlo cuesta dinero: necesita la confirmación del dueño para esa compra (regla 7).
- [ ] **Revisión de los textos** por el dueño (`src/textos/textos.ts`), con la tabla de la decisión 17
  al día.

## 25 · 2026-11-03 · Regla: nada de copias temporales con enlaces a node_modules

- **Qué pasó (2026-11-02):** para comparar el diseño antes y después de un cambio se armó una copia
  temporal del proyecto (`git worktree`) con un enlace (junction) a `node_modules`. Al borrar la copia,
  Windows siguió el enlace y borró parte de las dependencias reales. Se reinstalaron con `npm ci`, sin
  cambiar el `package-lock.json` y con 0 vulnerabilidades; el repositorio no se vio afectado.
- **Decisión del dueño:** queda como regla 16 de `CLAUDE.md`.

## 26 · 2026-11-03 · La CI del PR 11 cayó en rendimiento (94): Arma tu plan se dibuja desde el script

- **Qué pasó:** la primera corrida de la CI del PR 11 dio 94 en la portada (mínimo 95), con FCP de 2,2 s;
  las 78 pruebas y la accesibilidad pasaron. La protección de `main` bloqueó la fusión, como debe. La lista
  de adicionales sumó HTML, y en la CI el margen es justo.
- **Arreglo:** las preguntas y los adicionales de Arma tu plan los dibuja `src/scripts/armador.ts`, con el
  mismo marcado de antes. Sin JavaScript esa parte no se muestra (se ve el aviso con WhatsApp), así que en
  el HTML solo pesaban en la primera pintura. También salió el atributo `data-alt`, que nadie usaba. El HTML
  bajó de 87 a 80 KB. Las 78 pruebas siguen iguales y pasan sin cambios.
- **Medición en este PC:** varía de 94 a 98 según la carga del equipo (había un juego abierto, con la CPU
  al 77-100 %). `main` dio 98 en las mismas condiciones. La que manda es la CI.
- **No se bajó el mínimo de 95.**
