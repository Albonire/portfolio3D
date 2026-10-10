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
components/Sunny.tsx, Halftone.tsx, HalftoneShader.tsx
                                modo Sol: video de sombras y textura de puntos (ver "Modo Sol")
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

Las piezas de cliente son siete (gráfica, sumador, hora, lector de hojas de vida, cambio de idioma y las dos del modo
Sol); el resto se genera en el build. Un solo tema (claro), una sola paleta (neutros slate y azul marino `#1f3a5f`, el mismo
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

La intensidad del video es la opacidad de `.sunny-layer[data-on="true"]` en `app/globals.css` (0,68; con 1 es el original
de dany).

Con el modo encendido, el área bajo la curva de la gráfica de precisión (portada y caso Talento Rosimar) se rellena con una
trama de puntos de media tinta ("halftone"), la textura que dany muestra en sus imágenes al quitar el cursor. Aquí es fija,
sin hover. La trama se dibuja desde los datos de la gráfica en un canvas y se recorta con `clip-path` a la forma del área;
detrás de cada texto marcado con `data-cut` se deja un recuadro blanco medido sobre el texto real, así que ninguna etiqueta
queda sobre puntos. Las capturas de CircuitBreve no llevan textura: se probó y se descartó.

El efecto es `components/Halftone.tsx` (`HalftoneLayer`), que usa el shader `HalftoneDots` de
[Paper Shaders](https://github.com/paper-design/shaders) (`@paper-design/shaders-react`, licencia Apache-2.0). El shader
va en un chunk aparte (`components/HalftoneShader.tsx`, unos 9 KB comprimidos) que solo se descarga al encender el modo y
solo se monta mientras el componente está a menos de 150 px de la pantalla. Sin WebGL no se pinta nada y queda el
original. Para ajustarlo, cada uso pasa sus propios valores: `size` (tamaño de la rejilla, relativo a la imagen), `radius`,
`contrast`, `grain` y `clip`. Para quitar la textura basta con borrar el `HalftoneLayer` de `components/AccuracyChart.tsx`.

## Reglas de redacción

Las mismas del CV: sin rayas largas, sin emojis, sin adverbios de relleno ni palabras de humo, y cifras solo si se
pueden comprobar. Cada número de un caso de estudio debe poder rastrearse a un documento o a un repositorio.

## Despliegue

Vercel, desde la rama `main`. El dominio de producción es `https://anderdev.works` (constante en `lib/site.ts`).
