# anderdev.works

Portafolio de Anderson F. González. Sitio estático bilingüe (`/es` y `/en`) con Next.js 16, React 19 y Tailwind 4.

## Cómo está armado

```
app/[lang]/layout.tsx           <html lang>, fuentes IBM Plex, pie de página
app/[lang]/page.tsx             inicio: presentación, trabajo, lector de hojas de vida, experiencia, formación, habilidades, contacto
app/[lang]/work/[slug]/page.tsx casos de estudio (talento-rosimar, control-vehicular, circuitbreve)
app/[lang]/not-found.tsx        404
app/sitemap.ts, app/robots.ts   SEO, con hreflang
proxy.ts                        "/" redirige a /es o /en según cookie NEXT_LOCALE o Accept-Language
content/es.ts, content/en.ts    todo el texto del sitio, un módulo por idioma (tipo Content en content/types.ts)
components/AccuracyChart.tsx    curva de precisión del lector OCR (portada y caso Talento Rosimar)
components/CircuitToy.tsx       sumador completo interactivo (caso CircuitBreve)
components/TimeOverlap.tsx      "Tu hora y la mía": jornada compartida según la zona horaria (Contacto)
components/ResumeReader.tsx     lector de hojas de vida en el navegador (sección "Prueba tu hoja de vida")
components/Sources.tsx          lista numerada de fuentes de las cifras
lib/                            idiomas, constantes del sitio, lib/refs.ts (numeración de fuentes) y lib/resume.ts
                                (análisis del texto de un PDF, lógica pura sin DOM)
scripts/samples/                fuente Typst de la hoja de vida de muestra de dos columnas
public/samples/                 los PDF de muestra generados (datos inventados)
public/cv/                      hojas de vida en PDF (ES y EN)
public/work/<caso>/             capturas en WebP
public/og.png                   imagen para compartir en redes
public/icon.svg, favicon.ico,   icono de la pestaña: una compuerta lógica AND (Anderson empieza por "AND"), la misma
  apple-touch-icon.png          de components/Mark.tsx. El SVG cambia de color en modo oscuro; el .ico es el respaldo
                                para Safari, en un azul medio que se ve en pestañas claras y oscuras
```

Las piezas de cliente son cuatro (gráfica, sumador, hora y lector de hojas de vida); el resto se genera en el build.
Un solo tema (claro), una sola
paleta (neutros slate y azul marino `#1f3a5f`, el mismo del CV) y tres fuentes de la familia IBM Plex.

## Desarrollo

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

Los PDF de `public/samples/` salen de `scripts/samples/two-column.typ` (Typst), con datos inventados:

```bash
python3 -c "import typst; [typst.compile('scripts/samples/two-column.typ', output=f'public/samples/{n}', sys_inputs={'lang': l}) for l, n in (('es', 'muestra-dos-columnas.pdf'), ('en', 'sample-two-column.pdf'))]"
```

## Reglas de redacción

Las mismas del CV: sin rayas largas, sin emojis, sin adverbios de relleno ni palabras de humo, y cifras solo si se
pueden comprobar. Cada número de un caso de estudio debe poder rastrearse a un documento o a un repositorio.

## Despliegue

Vercel, desde la rama `main`. El dominio de producción es `https://anderdev.works` (constante en `lib/site.ts`).
