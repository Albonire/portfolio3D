// Renderiza public/og-es.png y public/og-en.png desde scripts/og/og.html.
// Playwright y las fuentes de Google no son dependencias del repositorio. Uso:
//   npm i --no-save playwright && node scripts/og/render.mjs
// o, con un Playwright ya instalado: PLAYWRIGHT_MODULE=/ruta/a/playwright/index.mjs node scripts/og/render.mjs
// (CHROMIUM_PATH indica un Chromium ya instalado, si hace falta.)
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const here = dirname(fileURLToPath(import.meta.url));
const page_url = pathToFileURL(resolve(here, "og.html")).href;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const lang of ["es", "en"]) {
  await page.goto(`${page_url}?lang=${lang}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const out = resolve(here, "..", "..", "public", `og-${lang}.png`);
  await page.screenshot({ path: out });
  console.log("escrito", out);
}
await browser.close();
