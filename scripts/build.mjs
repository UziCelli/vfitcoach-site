// Gera tudo que o index.html referencia. Rode após mudar foto, fontes ou <script>/<style> inline.
import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
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

// Favicon (V branco sobre navy) + PNGs
const favicon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0B1E3D"/><path d="M16 17h9l7 20 7-20h9L37 47h-10z" fill="#fff"/></svg>';
await writeFile(pub('favicon.svg'), favicon);
await sharp(Buffer.from(favicon)).resize(32, 32).png().toFile(pub('favicon-32.png'));
await sharp(Buffer.from(favicon)).resize(180, 180).flatten({ background: '#0B1E3D' }).png().toFile(pub('apple-touch-icon.png'));

// Imagem OG 1200x630 renderizada com as fontes reais
const html = await readFile(pub('index.html'), 'utf8');
const logo = html.match(/<svg class="logo-mark"[\s\S]*?<\/svg>/)[0].replace('class="logo-mark"', 'style="height:34px;width:auto;align-self:flex-start"');
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

// Headers de segurança (Cloudflare Pages / Netlify). CSP com hash exato de cada <script>/<style> inline.
const sha = (s) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`;
const hashes = (file, tag) => [...file.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'))].map((m) => sha(m[1]));
const page404 = await readFile(pub('404.html'), 'utf8');
const js = [...new Set([...hashes(html, 'script'), ...hashes(page404, 'script')])];
const css = [...new Set([...hashes(html, 'style'), ...hashes(page404, 'style')])];
// Google Tag Manager + conversões do Google Ads (domínios da documentação de CSP do Google).
const g = {
  script: 'https://*.googletagmanager.com https://www.googleadservices.com https://www.google.com https://googleads.g.doubleclick.net',
  img: 'https://*.googletagmanager.com https://*.google-analytics.com https://www.google.com https://www.google.com.br https://*.doubleclick.net https://www.googleadservices.com',
  connect: 'https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://www.google.com https://*.doubleclick.net https://www.googleadservices.com https://pagead2.googlesyndication.com',
  frame: 'https://*.googletagmanager.com https://td.doubleclick.net https://www.google.com',
};
const csp = [
  "default-src 'self'",
  `script-src 'self' ${js.join(' ')} ${g.script}`,
  `style-src 'self' ${css.join(' ')}`,
  `img-src 'self' data: ${g.img}`,
  "font-src 'self'",
  `connect-src 'self' ${g.connect}`,
  `frame-src ${g.frame}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');
await writeFile(pub('_headers'), `/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`);
// ponytail: cache imutável com nome fixo — se trocar a foto, renomeie o arquivo (ex.: victor2-680.webp).

console.log('build ok');
