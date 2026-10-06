// Gera imagens, fontes, favicon, og.jpg, sitemap e _headers. Rode após trocar a foto ou as fontes.
// Só editou texto/CSS/JS do index.html? Não precisa: o deploy já regera o _headers.
import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

import { launch } from './browser.mjs';

const SITE = 'https://vfitcoachapp.com';
const root = fileURLToPath(new URL('..', import.meta.url));
const pub = (p) => `${root}public/${p}`;
const src = (p) => `${root}src/${p}`;
await mkdir(pub('assets/img'), { recursive: true });
await mkdir(pub('assets/fonts'), { recursive: true });

// Fontes variáveis, subset latin (cobre acentos do PT-BR)
const font = (pkg) => `${root}node_modules/@fontsource-variable/${pkg}/files/${pkg}-latin-wght-normal.woff2`;
await copyFile(font('montserrat'), pub('assets/fonts/montserrat.woff2'));
await copyFile(font('inter'), pub('assets/fonts/inter.woff2'));

// Foto: AVIF + WebP em 3 larguras
const photo = await readFile(src('foto-victor.jpg'));
for (const w of [400, 680, 1080]) {
  const img = sharp(photo).resize(w, w, { fit: 'cover' });
  await img.clone().avif({ quality: 55 }).toFile(pub(`assets/img/victor-${w}.avif`));
  await img.clone().webp({ quality: 78 }).toFile(pub(`assets/img/victor-${w}.webp`));
}

// Prints do app (seção ===== APP =====)
await import('./app-shots.mjs');

// Favicon (V branco sobre navy) + PNGs
const favicon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0B1E3D"/><path d="M16 17h9l7 20 7-20h9L37 47h-10z" fill="#fff"/></svg>';
await writeFile(pub('favicon.svg'), favicon);
await sharp(Buffer.from(favicon)).resize(32, 32).png().toFile(pub('favicon-32.png'));
await sharp(Buffer.from(favicon)).resize(180, 180).flatten({ background: '#0B1E3D' }).png().toFile(pub('apple-touch-icon.png'));

// Imagem OG 1200x630 renderizada com as fontes reais
const html = await readFile(pub('index.html'), 'utf8');
const logo = html.match(/<svg class="logo-mark"[\s\S]*?<\/svg>/)[0].replace('class="logo-mark"', 'style="height:34px;width:auto;align-self:flex-start"').replace(/<circle class="lm-selo"[^>]*\/>/, '');
const f = (p) => pathToFileURL(p).href;
const og = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:M;src:url(${f(pub('assets/fonts/montserrat.woff2'))});font-weight:100 900}
@font-face{font-family:I;src:url(${f(pub('assets/fonts/inter.woff2'))});font-weight:100 900}
body{margin:0;width:1200px;height:630px;display:flex;color:#fff;font-family:I;overflow:hidden;
background:radial-gradient(900px 420px at 90% -10%,rgba(74,123,175,.45),transparent 60%),linear-gradient(180deg,#0B1E3D,#0F2A52)}
.c{flex:1;padding:64px 0 64px 72px;display:flex;flex-direction:column;justify-content:space-between}
h1{font-family:M;font-weight:800;font-size:54px;line-height:1.08;margin:0;max-width:13ch}
p{font-size:22px;color:#CBD8ED;margin:0}
img{width:470px;height:470px;align-self:flex-end;border-radius:20px 20px 0 0;object-fit:cover;margin-right:40px}
</style><div class="c">${logo}<h1>Aqui você aprende a se mover com confiança, não com medo.</h1><p>Personal trainer · São Paulo · presencial e online</p></div>
<img src="${f(src('foto-victor.jpg'))}">`;
await mkdir(`${root}qa-out`, { recursive: true });
const tmp = `${root}qa-out/og.html`;
await writeFile(tmp, og);
const browser = await launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.goto(f(tmp), { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const shot = await page.screenshot({ type: 'png' });
await browser.close();
await sharp(shot).jpeg({ quality: 84, mozjpeg: true }).toFile(pub('og.jpg'));

// SEO
await writeFile(pub('robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
await writeFile(pub('sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>
</urlset>
`);

// Headers de segurança (CSP com hash dos <script>/<style> inline)
await import('./headers.mjs');

console.log('build ok');
