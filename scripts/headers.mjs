// Gera public/_headers (CSP + headers de segurança). Roda sozinho no "npm run deploy",
// então editar o <style>/<script> do index.html à mão não quebra nada em produção.
// Uso manual: npm run headers
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const pub = (p) => fileURLToPath(new URL(`../public/${p}`, import.meta.url));

// CSP com o hash exato de cada <script>/<style> inline de todas as páginas .html.
const sha = (s) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`;
const hashes = (html, tag) => [...html.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'))].map((m) => sha(m[1]));
const files = (await readdir(pub(''))).filter((f) => f.endsWith('.html'));
const pages = await Promise.all(files.map((f) => readFile(pub(f), 'utf8')));
const js = [...new Set(pages.flatMap((h) => hashes(h, 'script')))];
const css = [...new Set(pages.flatMap((h) => hashes(h, 'style')))];

// Google Tag Manager + conversões do Google Ads (domínios da documentação de CSP do Google).
// Tag nova de outro fornecedor no GTM = liberar o domínio aqui e rodar "npm run headers".
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
// Cache de 1 ano em /assets/*: se trocar a foto, renomeie os arquivos (ex.: victor2-680.webp).

console.log('headers ok');
