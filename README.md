# anderdev.works

Portafolio de Anderson F. González. Sitio estático bilingüe (`/es` y `/en`) con Next.js 16, React 19 y Tailwind 4.

## Cómo está armado

```
app/[lang]/layout.tsx           <html lang>, fuentes IBM Plex (app/fonts.ts), pie de página y capa del modo Sol
app/[lang]/page.tsx             inicio: presentación, trabajo, lector de hojas de vida, experiencia, formación, habilidades, contacto
app/[lang]/work/[slug]/page.tsx casos de estudio (talento-rosimar, control-vehicular, circuitbreve)
app/[lang]/not-found.tsx        404 dentro de un idioma (por ejemplo /es/work/nope)
app/global-not-found.tsx        404 de cualquier otra dirección (/foo, /es/xyz): lleva su propio <html> y estilos.
                                Requiere experimental.globalNotFound en next.config.ts
app/sitemap.ts, app/robots.ts   SEO, con hreflang
proxy.ts                        "/" redirige a /es o /en según cookie NEXT_LOCALE o Accept-Language (solo corre en "/")
content/es.ts, content/en.ts    todo el texto del sitio, un módulo por idioma (tipo Content en content/types.ts)
components/AccuracyChart.tsx    curva de precisión del lector OCR (portada y caso Talento Rosimar)
components/CircuitToy.tsx       sumador completo interactivo (caso CircuitBreve)
components/TimeOverlap.tsx      "Tu hora y la mía": jornada compartida según la zona horaria (Contacto)
components/ResumeReader.tsx     lector de hojas de vida en el navegador (sección "Prueba tu hoja de vida")
components/Sources.tsx          lista numerada de fuentes de las cifras
components/Header.tsx, Section.tsx, Inline.tsx, ExternalLink.tsx, Mark.tsx, LangSwitch.tsx, NotFoundBody.tsx
                                piezas de página (cabecera, secciones, texto con fuentes, enlaces, marca, cambio de idioma que
                                guarda la cookie, cuerpo del 404)
components/NavSpy.tsx           marca en el menú la sección que se está leyendo (aria-current)
components/CaseFigure.tsx       figuras de los casos (gráfica, sumador, flujo, captura)
components/Sunny.tsx            modo Sol: interruptor, video de sombras y sonido (ver "Modo Sol")
components/Thread.tsx           modo Sol: un trazo SVG dibujado como hilo, en capas
app/textile.css                 modo Sol: las reglas del bordado (costuras, marcos cosidos, parches). Solo actúa con el modo encendido
public/textile-tiles.css        teselas SVG del bordado. Archivo generado (npm run textile); se pide al encender el modo
lib/                            idiomas, constantes del sitio, lib/refs.ts (numeración de fuentes), lib/resume.ts
                                (análisis del texto de un PDF, lógica pura sin DOM), lib/thread.ts (el hilo del bordado:
                                tonos, capas y puntadas) y lib/sunny.ts (constantes y guion de arranque del modo Sol)
scripts/samples/                fuente Typst de la hoja de vida de muestra de dos columnas
public/samples/                 los PDF de muestra generados (datos inventados)
public/cv/                      hojas de vida en PDF (ES y EN)
public/work/<caso>/             capturas en WebP
public/og-es.png, og-en.png    imagen para compartir en redes, una por idioma (1200x630)
scripts/og/                     plantilla HTML y script que renderizan esas dos imágenes
public/icon.svg, favicon.ico,   icono de la pestaña: una compuerta lógica AND (Anderson empieza por "AND"), la misma
  apple-touch-icon.png          de components/Mark.tsx. El SVG cambia de color en modo oscuro; el .ico es el respaldo
                                para Safari, en un azul medio que se ve en pestañas claras y oscuras
```

Las piezas de cliente son siete (gráfica, sumador, hora, lector de hojas de vida, cambio de idioma, el modo Sol y la
marca de la sección activa en el menú); el resto se genera en el build. Un solo tema (claro), una sola paleta (neutros slate y azul marino `#1f3a5f`, el mismo
del CV) y tres fuentes de la familia IBM Plex.

## Desarrollo

Requiere Node 22 (`engines` en `package.json`; pdf.js 6 exige 22.13 o más).

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

## Cambiar contenido

- Texto, proyectos, experiencia y certificaciones: `content/es.ts` y `content/en.ts`. Los dos archivos deben tener
  la misma forma; TypeScript avisa si falta algo en uno.
- Un caso de estudio nuevo: agregarlo en `cases` de los dos idiomas y como proyecto con `slug` en `work.projects`.
- Dentro de un párrafo, lo que va entre comillas invertidas (`así`) se muestra como código.

## Hojas de vida

Los PDF de `public/cv/` salen del repositorio `Albonire/my-cv` (carpeta `dist/`). Para actualizarlos, regenerar allí
(`python3 cv/scripts/build.py`) y copiar los dos PDF. No publicar nunca el PDF de soportes ni nada de `archivo/`:
traen la cédula.

## Recibos: fuentes de las cifras

Dentro de un texto, `[[89,8 %|ocr-medicion]]` muestra la cifra con un superíndice que lleva a su fuente. Las fuentes están
en `sources.items` de cada idioma; la numeración sale del orden de aparición en la página. Una cifra nueva lleva su fuente
(archivo o repositorio, fecha y si es privado) o no entra.

## Lector de hojas de vida

`ResumeReader` lee el PDF con pdf.js (compilación `legacy`, que no exige funciones de JavaScript recientes) y
`lib/resume.ts` analiza el texto: caracteres, correo, teléfono, enlaces, títulos de sección en español e inglés y
posibles columnas. El archivo no sale del navegador: pdf.js y su worker se descargan del propio sitio la primera vez
que se elige un archivo y no hay peticiones de red durante el análisis. No hace OCR ni da puntuación.

Los PDF de `public/samples/` salen de `scripts/samples/two-column.typ` (Typst), con datos inventados. Hace falta el paquete
`typst` de Python (`pip install typst`) y la fuente Liberation Sans instalada:

```bash
python3 -c "import typst; [typst.compile('scripts/samples/two-column.typ', output=f'public/samples/{n}', sys_inputs={'lang': l}) for l, n in (('es', 'muestra-dos-columnas.pdf'), ('en', 'sample-two-column.pdf'))]"
```

## Imagen para compartir

`public/og-es.png` y `public/og-en.png` salen de `scripts/og/og.html` (el idioma va en `?lang=`). Para regenerarlas hace
falta Playwright con su Chromium, que no son dependencia del repositorio, y red para las fuentes de Google:

```bash
npm i --no-save playwright && npx playwright install chromium && node scripts/og/render.mjs
```

(Con `CHROMIUM_PATH` se puede usar un Chromium que ya esté instalado.)

La compuerta es el mismo trazado de `components/Mark.tsx`. Las plataformas guardan la imagen en caché: tras cambiarla,
hay que volver a pedirla en el depurador de cada una (LinkedIn Post Inspector, Facebook Sharing Debugger).

## Modo Sol (experimento)

El interruptor "Sol" de la cabecera pone una capa de video con sombras de hojas (mezcla `multiply`) y un tinte cálido
sobre el papel. Es una prueba del efecto que tiene dany.works con la tecla `S`. El video se enlaza desde
`https://dany.works/leaves.mp4` (constante `SUNNY_VIDEO` en `components/Sunny.tsx`) y **no está en este repositorio**:
es de otra persona. **Antes de publicar el sitio con este modo hay que cambiarlo por un archivo propio o tener permiso de
su autor.** El video no se pide hasta encender el modo, con movimiento reducido queda quieto en su primer fotograma y
al apagarlo se pausa y se oculta.

La intensidad del video es la opacidad de `.sunny-layer[data-on="true"]` en `app/globals.css` (0,58; con 1 es el original
de dany).

### Bordado

Con el modo encendido el papel queda liso (solo el tinte cálido) y lo que se borda son las piezas. El fondo no lleva
textura y las imágenes (las capturas de los casos) quedan como están. Antes el fondo imitaba una tela de lino; se
quitó porque ensuciaba la lectura.

El hilo no es una raya punteada. Cada trazo se dibuja en cuatro capas con la luz arriba a la izquierda: la sombra que
deja sobre el papel, el borde oscuro, el cuerpo y un brillo fino (`lib/thread.ts`). Donde una puntada entra en el papel
asoma el agujero de la aguja.

| Pieza | Con el modo Sol |
| --- | --- |
| Fondo y cabecera | Papel liso con el tinte cálido. Sin textura |
| Divisores de sección (portada) | Un muestrario: cada sección se abre con un punto distinto en hilo ocre. Trabajo, cadeneta; lector, escapulario; Experiencia, espina; Formación, punto de cruz; Habilidades, mosca; Contacto, tallo; Fuentes, festón |
| Otras líneas divisorias | Hilván en ocre. Hilo fino de lino entre filas de listas y tablas; pespunte en tinta bajo las cabeceras de tabla |
| Recuadro de la gráfica de portada | Parche aplicado: orilla en festón ocre y un nudo francés azul en cada esquina |
| Zona de arrastre del lector | Hilván (la costura provisional). Al arrastrar un archivo encima se cierra en pespunte azul |
| Vista previa del PDF, selector de zona horaria | Marco de hilván fino |
| Pasos de un flujo | Retazos de fieltro en dos tonos alternos, cada uno con su orilla de festón |
| Botones principales | Parche: fondo de sarga azul y la orilla remallada con puntadas apretadas |
| Enlaces | El subrayado es una costura en hilván ocre; al pasar el cursor se cierra en pespunte azul. La sección activa del menú lleva esa misma costura azul |
| Viñetas | Nudos franceses |
| Gráfica de precisión | Rejilla en hilván fino, línea en pespunte azul con puntadas enteras entre mediciones (las tandas posteriores, en hilván suelto), cada medición un nudo francés (la caída, en rojo), la medición elegida rodeada por una estrella de puntadas y el área bajo la curva en punto de cruz sombreado con dos madejas de azul |
| Sumador | Cables bordados (pespunte azul si llevan 1, hilván gris si llevan 0), empalmes en nudo francés, compuertas como parches de fieltro con festón y entradas y salidas como etiquetas cosidas |
| Barras de horario | Punto raso (hilos paralelos y apretados, cada uno con su brillo); "ahora" es un alfiler |
| Marca | La compuerta AND en pespunte |
| Interruptor | Un botón de hueso de cuatro agujeros en su ojal |
| Pie de página | Cenefa en punto de cruz con la compuerta AND de la marca, como la firma de un muestrario |

Cómo está hecho:

- `app/textile.css` tiene todas las reglas, bajo `html[data-sunny]` y dentro de `@media screen and (forced-colors: none)`:
  al imprimir o con colores forzados quedan las líneas normales. Las clases `tx-*` del marcado son solo ganchos: con
  el modo apagado no hacen nada.
- El bordado no mueve nada. La línea de 1 px sigue ahí, transparente, y la costura va como imagen de fondo; el
  subrayado cosido compensa con margen el relleno que lo baja. Lo único que crece es el pie, por la cenefa. Está medido:
  la posición de los elementos es la misma con el modo apagado y encendido.
- `public/textile-tiles.css` trae las teselas SVG como URL de datos (unos 48 KB, 12 KB comprimidos). No va en el CSS
  del sitio: `components/Sunny.tsx` lo pide la primera vez que se enciende el modo, así quien no lo usa no lo descarga.
  Lo genera `npm run textile` (`scripts/textile/build.mjs`, que importa `lib/thread.ts`; hace falta Node 22.18 o más):
  cada puntada lleva un largo, una separación y una inclinación distintos, tomados de un generador con semilla fija,
  así que no parece hecho a máquina y sale igual cada vez.
- Los tonos de hilo están en `TONES`, en `lib/thread.ts`: el azul marino del sitio, dos azules más claros para sombrear,
  ocre y lino para las costuras, y rojo solo para la caída de la gráfica.
- Las piezas SVG (gráfica, sumador, marca) usan `components/Thread.tsx`, que dibuja un camino con las capas del hilo.
  En la gráfica y el sumador el bordado solo se calcula con el modo encendido; el trazo liso sigue en el marcado y es
  el que se imprime.
- El relleno de la gráfica se calcula en `components/AccuracyChart.tsx` (`stitchFill`). Las cruces van enteras sobre
  una cuadrícula (la curva se resuelve en escalera, como en un bordado) y se aclaran al alejarse de la línea: cruces
  en azul medio, luego en azul claro, medias puntadas y puntadas sueltas. Detrás de cada texto marcado con `data-cut`
  no se borda (ni pasa la rejilla): se mide el texto real.
- El cambio de modo se hace con un fundido de toda la página (View Transitions, `toggle()` en `components/Sunny.tsx`),
  porque CSS no sabe interpolar una línea hacia una costura. Sin esa API, o con movimiento reducido, el cambio es directo.
- Si el modo venía encendido (recarga, cambio de idioma), un guion al empezar el `<body>` pone el atributo y pide las
  teselas antes de pintar (`SUNNY_BOOT` en `lib/sunny.ts`). Sin él la página aparecía en claro y saltaba a Sol al hidratar.

Antes el área bajo la curva llevaba una trama de puntos de media tinta (shader `HalftoneDots` de Paper Shaders). El
bordado la reemplaza; el componente y la dependencia se quitaron y siguen en el historial de git.

Con el modo encendido también suena un bosque de cigarras higurashi de Japón (`public/audio/cigarras.mp3`, 1,8 MB, loop con
fundido cruzado ya hecho; recodificado desde el archivo que aportó el dueño). Se reproduce con Web Audio (bucle sin hueco), con
fundido de entrada y salida de 1,5 s, y no se descarga hasta la primera vez que se enciende el modo. **Confirmar la licencia del
audio antes de publicar**: proviene de un video de YouTube de otra persona.

## Reglas de redacción

Las mismas del CV: sin rayas largas, sin emojis, sin adverbios de relleno ni palabras de humo, y cifras solo si se
pueden comprobar. Cada número de un caso de estudio debe poder rastrearse a un documento o a un repositorio.

## Despliegue

Vercel, desde la rama `main`. El dominio de producción es `https://anderdev.works` (constante en `lib/site.ts`).
