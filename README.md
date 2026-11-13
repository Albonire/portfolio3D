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
components/CaseFigure.tsx       figuras de los casos (gráfica, sumador, flujo, captura)
components/Sunny.tsx            modo Sol: interruptor, video de sombras y sonido (ver "Modo Sol")
app/textile.css                 modo Sol: el tejido (costuras, marcos cosidos, bordado). Solo actúa con el modo encendido
app/textile-tiles.css           teselas SVG del tejido. Archivo generado: sale de scripts/textile/build.mjs
lib/                            idiomas, constantes del sitio, lib/refs.ts (numeración de fuentes) y lib/resume.ts
                                (análisis del texto de un PDF, lógica pura sin DOM)
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

Las piezas de cliente son seis (gráfica, sumador, hora, lector de hojas de vida, cambio de idioma y el modo Sol); el
resto se genera en el build. Un solo tema (claro), una sola paleta (neutros slate y azul marino `#1f3a5f`, el mismo
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

### Tejido hecho a mano

Con el modo encendido la página se lee como una tela de lino bordada. Solo cambian las piezas que no son imágenes; las
capturas de los casos quedan como están.

| Pieza | Con el modo Sol |
| --- | --- |
| Fondo y cabecera | Lino: fibras irregulares y el cruce de los hilos |
| Líneas divisorias | Costuras en hilván. Hilo fino entre filas de listas y tablas; pespunte oscuro bajo las cabeceras de tabla |
| Recuadros (gráfica de portada, zona de arrastre, vista previa del PDF) | Marco de puntadas con las esquinas resueltas. Al arrastrar un archivo, el hilo pasa a azul |
| Pasos de un flujo | Retazos cosidos, en dos tonos alternos |
| Botones principales | Etiqueta de sarga azul cosida con hilo crudo |
| Enlaces | Subrayado en hilván; al pasar el cursor se cierra en línea continua |
| Viñetas | Cruces de punto de cruz |
| Gráfica de precisión | Bordado: rejilla en hilván, línea en pespunte (tandas posteriores en hilván suelto), cada medición una cruz y el área bajo la curva en punto de cruz |
| Sumador | Cables bordados (pespunte si llevan 1, hilván suelto si llevan 0) y compuertas con borde de puntadas |
| Barras de horario | Punto de media; "ahora" es un alfiler |
| Marca | La compuerta AND, bordada |
| Interruptor | Un botón de dos agujeros en su ojal |
| Pie de página | La tela termina: cenefa en zigzag y flecos |

Cómo está hecho:

- `app/textile.css` tiene todas las reglas, bajo `html[data-sunny]` y dentro de `@media screen and (forced-colors: none)`:
  al imprimir o con colores forzados quedan las líneas normales. Las clases `tx-*` del marcado son solo ganchos: con
  el modo apagado no hacen nada (está comprobado comparando capturas con la versión anterior).
- Las costuras no mueven nada: la línea de 1 px sigue ahí, transparente, y el hilván va como imagen de fondo.
- `app/textile-tiles.css` trae las teselas SVG como URL de datos (unos 3 KB comprimidos). Lo genera
  `node scripts/textile/build.mjs`: cada puntada lleva un largo, una separación y una inclinación distintos, tomados de un
  generador con semilla fija, así que no parece hecho a máquina y sale igual cada vez. Los colores de los hilos están
  al principio de ese script.
- El relleno de la gráfica se calcula en `components/AccuracyChart.tsx` (`stitchFill`) solo con el modo encendido. Las
  cruces van enteras sobre una cuadrícula (la curva se resuelve en escalera, como en un bordado) y se aclaran al
  alejarse de la línea: cruces completas, medias puntadas y puntadas sueltas. Detrás de cada texto marcado con
  `data-cut` no se borda: se mide el texto real.
- El cambio de modo se hace con un fundido de toda la página (View Transitions, `toggle()` en `components/Sunny.tsx`),
  porque CSS no sabe interpolar una línea hacia una costura. Sin esa API, o con movimiento reducido, el cambio es directo.

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
