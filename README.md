# anderdev.works

Portafolio de Anderson F. González. Sitio estático bilingüe (`/es` y `/en`) con Next.js 16, React 19 y Tailwind 4.

## Cómo está armado

```
app/[lang]/layout.tsx           <html lang>, fuentes IBM Plex, pie de página
app/[lang]/page.tsx             inicio: presentación, trabajo, experiencia, formación, habilidades, contacto
app/[lang]/work/[slug]/page.tsx casos de estudio (talento-rosimar, control-vehicular, circuitbreve)
app/[lang]/not-found.tsx        404
app/sitemap.ts, app/robots.ts   SEO, con hreflang
proxy.ts                        "/" redirige a /es o /en según cookie NEXT_LOCALE o Accept-Language
content/es.ts, content/en.ts    todo el texto del sitio, un módulo por idioma (tipo Content en content/types.ts)
components/RequestLab.tsx       simulador de la portada: una petición de Control Vehicular, paso a paso
components/AccuracyChart.tsx    curva de precisión del lector OCR (caso Talento Rosimar)
components/CircuitToy.tsx       sumador completo interactivo (caso CircuitBreve)
components/Sources.tsx          lista numerada de fuentes de las cifras
lib/                            idiomas, constantes del sitio y lib/refs.ts (numeración de fuentes)
public/cv/                      hojas de vida en PDF (ES y EN)
public/work/<caso>/             capturas en WebP
public/og.png                   imagen para compartir en redes
```

Las únicas piezas de cliente son las tres interactivas (simulador, gráfica y sumador); el resto se genera en el build.
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

## Fidelidad del simulador

`RequestLab` simula el flujo documentado de Control Vehicular (código privado). Cada escenario se verificó contra
`src/app.js`, `src/auth.js` y `src/routes/auth.js` y tiene su prueba de integración en ese repositorio: CSRF devuelve 400,
la falta de permiso redirige con aviso (302) y el bloqueo de login vuelve el formulario (200). Si el sistema cambia, hay que
releer esos archivos antes de tocar `hero.lab` en `content/`.

## Reglas de redacción

Las mismas del CV: sin rayas largas, sin emojis, sin adverbios de relleno ni palabras de humo, y cifras solo si se
pueden comprobar. Cada número de un caso de estudio debe poder rastrearse a un documento o a un repositorio.

## Despliegue

Vercel, desde la rama `main`. El dominio de producción es `https://anderdev.works` (constante en `lib/site.ts`).
