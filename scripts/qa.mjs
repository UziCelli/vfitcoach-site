// QA automatizado: layout em 4 larguras, scroll-reveal, links de WhatsApp, dados de clientes,
// erros de console/CSP, SEO e Lighthouse mobile. Sai com código 1 se algo falhar.
// Uso: npm run qa            (tudo)
//      npm run qa -- --no-lh (pula Lighthouse)
import http from 'node:http';
import zlib from 'node:zlib';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { extname, join, normalize } from 'node:path';
import lighthouse from 'lighthouse';
import { launch } from './browser.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const pub = join(root, 'public');
const out = join(root, 'qa-out');
await mkdir(out, { recursive: true });
const fails = [];
const check = (ok, msg) => { console.log(`${ok ? '  ok   ' : '  FALHA'} ${msg}`); if (!ok) fails.push(msg); };

// --- servidor local que imita produção: gzip + headers do _headers ---
const rules = (await readFile(join(pub, '_headers'), 'utf8')).split(/\n(?=\/)/).map((block) => {
  const [pattern, ...lines] = block.trim().split('\n');
  return { re: new RegExp('^' + pattern.replace(/\*/g, '.*') + '$'), headers: lines.map((l) => l.trim().split(/:\s(.+)/).slice(0, 2)) };
});
const types = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' };
const server = http.createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path.endsWith('/')) path += 'index.html';
  const file = normalize(join(pub, path));
  let body, status = 200;
  try { if (!file.startsWith(pub)) throw 0; body = await readFile(file); }
  catch { body = await readFile(join(pub, '404.html')); status = 404; path = '/404.html'; }
  for (const r of rules) if (r.re.test(path)) for (const [k, v] of r.headers) {
    if (k === 'Strict-Transport-Security') continue;
    // upgrade-insecure-requests quebraria o http://127.0.0.1; em produção (HTTPS) vale normalmente
    res.setHeader(k, v.replace('; upgrade-insecure-requests', ''));
  }
  const type = types[extname(path)] || 'application/octet-stream';
  res.setHeader('Content-Type', type);
  if (/text|xml|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '')) { res.setHeader('Content-Encoding', 'gzip'); body = zlib.gzipSync(body); }
  res.writeHead(status).end(body);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
console.log(`servidor local: ${base}`);

const browser = await launch();

// --- 1. dados dos clientes idênticos ao protótipo ---
console.log('\n[dados de clientes]');
const cardsText = (html) => [...html.matchAll(/<article class="client-card[\s\S]*?<\/article>/g)]
  .map((m) => m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const proto = cardsText(await readFile(join(root, 'src/prototipo.html'), 'utf8'));
const built = cardsText(await readFile(join(pub, 'index.html'), 'utf8'));
check(proto.length === 4 && built.length === 4, `4 cards de cliente (protótipo ${proto.length}, site ${built.length})`);
proto.forEach((t, i) => check(t === built[i], `card ${i + 1} idêntico: "${t}"`));

// --- 2. layout, overflow, reveal, console/CSP por viewport ---
const viewports = [
  { name: 'mobile-360', width: 360, height: 740, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: 'mobile-390', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
  { name: 'tablet-768', width: 768, height: 1024, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: 'desktop-1366', width: 1366, height: 768, deviceScaleFactor: 1 },
];
for (const vp of viewports) {
  console.log(`\n[${vp.name}]`);
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.evaluateOnNewDocument(() => document.addEventListener('securitypolicyviolation', (e) => console.error('CSP bloqueou: ' + e.blockedURI + ' ' + e.violatedDirective)));
  await page.setViewport(vp);
  await page.goto(base + '/', { waitUntil: 'networkidle0' });

  const before = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.reveal')];
    const below = els.filter((el) => el.getBoundingClientRect().top > innerHeight);
    return { total: els.length, below: below.length, belowHidden: below.filter((el) => getComputedStyle(el).opacity === '0').length, js: document.documentElement.classList.contains('js') };
  });
  check(before.js && before.below > 0 && before.belowHidden === before.below, `reveal: ${before.below}/${before.total} elementos abaixo da dobra começam ocultos`);

  // rola devagar até o fim pra disparar o IntersectionObserver
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, document.body.scrollHeight); });
  await new Promise((r) => setTimeout(r, 700));
  const after = await page.evaluate(() => [...document.querySelectorAll('.reveal')].filter((el) => !el.classList.contains('in') || getComputedStyle(el).opacity !== '1').length);
  check(after === 0, `reveal: todos visíveis após scroll (${after} pendentes)`);

  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); return r.width && (r.right > vw + 1 || r.left < -1) && !el.closest('.hero'); })
      .slice(0, 5).map((el) => `${el.tagName.toLowerCase()}.${el.className}`);
    return { scroll: document.documentElement.scrollWidth - vw, wide };
  });
  check(overflow.scroll <= 0 && !overflow.wide.length, `sem scroll/elemento vazando na horizontal (${overflow.scroll}px)${overflow.wide.length ? ' → ' + overflow.wide.join(', ') : ''}`);

  const small = await page.evaluate(() => [...document.querySelectorAll('a, summary, button')]
    .filter((el) => { const r = el.getBoundingClientRect(); return r.width && r.height < 24; })
    .map((el) => el.textContent.trim().slice(0, 30)));
  check(small.length === 0, `alvos de toque ≥ 24px${small.length ? ' → ' + small.join(' | ') : ''}`);

  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: join(out, `${vp.name}.png`), fullPage: true });
  check(errors.length === 0, `sem erros de console/CSP${errors.length ? ' → ' + errors.join(' | ') : ''}`);
  await page.close();
}

// --- 3. reduced motion: conteúdo visível sem animação ---
console.log('\n[prefers-reduced-motion]');
{
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(base + '/', { waitUntil: 'networkidle0' });
  const hidden = await page.evaluate(() => [...document.querySelectorAll('.reveal')].filter((el) => getComputedStyle(el).opacity !== '1').length);
  check(hidden === 0, `nada oculto com movimento reduzido (${hidden})`);
  await page.close();
}

// --- 3b. contraste de texto (WCAG AA) nos temas claro e escuro ---
for (const scheme of ['light', 'dark']) {
  console.log(`\n[contraste · tema ${scheme}]`);
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(base + '/', { waitUntil: 'networkidle0' });
  const bad = await page.evaluate(() => {
    const rgb = (s) => s.match(/[\d.]+/g).map(Number);
    const lum = ([r, g, b]) => [r, g, b].map((v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    // mistura camadas semitransparentes até achar o fundo opaco (gradiente → cor escura do navy)
    const bgOf = (el) => {
      const layers = [];
      for (let e = el; e; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.backgroundImage !== 'none' && e.classList.contains('hero')) { layers.push([11, 30, 61, 1]); break; }
        const c = rgb(cs.backgroundColor); const a = c[3] ?? 1;
        if (a > 0) { layers.push([...c.slice(0, 3), a]); if (a === 1) break; }
      }
      let out = [255, 255, 255];
      for (const [r, g, b, a] of layers.reverse()) out = [r * a + out[0] * (1 - a), g * a + out[1] * (1 - a), b * a + out[2] * (1 - a)];
      return out;
    };
    const res = [];
    for (const el of document.querySelectorAll('body *')) {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const cs = getComputedStyle(el);
      const fg = rgb(cs.color);
      const L1 = lum(fg), L2 = lum(bgOf(el));
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const large = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
      if (ratio < (large ? 3 : 4.5)) res.push(`${el.textContent.trim().slice(0, 28)} (${ratio.toFixed(2)})`);
    }
    return res;
  });
  check(bad.length === 0, `texto com contraste AA${bad.length ? ' → ' + bad.join(' | ') : ''}`);
  if (scheme === 'dark') await page.screenshot({ path: join(out, 'mobile-390-dark.png'), fullPage: true });
  await page.close();
}

// --- 4. links de WhatsApp ---
console.log('\n[WhatsApp]');
{
  const page = await browser.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle0' });
  const links = await page.$$eval('a[href*="wa.me"]', (as) => as.map((a) => ({ href: a.href, target: a.target, rel: a.rel, cta: a.dataset.cta, text: a.textContent.trim() })));
  check(links.length === 3, `3 CTAs de WhatsApp (${links.length})`);
  for (const l of links) {
    const u = new URL(l.href);
    check(u.hostname === 'wa.me' && u.pathname === '/5511942739425', `"${l.text}" → número 5511942739425`);
    check(u.searchParams.get('text') === 'Olá, Victor! Vim pelo site e quero agendar uma avaliação.', `"${l.text}" → mensagem pré-preenchida`);
    check(l.target === '_blank' && l.rel.includes('noopener') && !!l.cta, `"${l.text}" → nova aba, noopener, data-cta="${l.cta}"`);
  }
  // clique dispara evento de conversão (sem navegar)
  await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault()));
  await page.click('a[data-cta="hero"]');
  const dl = await page.evaluate(() => window.dataLayer || []);
  check(dl.some((e) => e.event === 'whatsapp_click' && e.cta === 'hero'), 'clique gera evento whatsapp_click no dataLayer');
  const agenda = await page.$$eval('a[href^="https://calendar.app.google/"]', (as) => as.map((a) => a.target === '_blank' && a.rel.includes('noopener') && !!a.dataset.cta));
  check(agenda.length === 2 && agenda.every(Boolean), `2 links de agenda (nova aba, noopener, data-cta) (${agenda.length})`);
  await page.click('a[data-cta="agenda-hero"]');
  check((await page.evaluate(() => window.dataLayer)).some((e) => e.event === 'schedule_click'), 'clique na agenda gera evento schedule_click');
  try {
    const r = await fetch('https://wa.me/5511942739425', { redirect: 'manual' });
    check(r.status < 400, `wa.me responde (HTTP ${r.status})`);
  } catch (e) { console.log(`  aviso: sem rede pra testar wa.me (${e.message})`); }
  await page.close();
}

// --- 5. SEO básico ---
console.log('\n[SEO]');
{
  const page = await browser.newPage();
  const r404 = await page.goto(base + '/nao-existe', { waitUntil: 'load' });
  check(r404.status() === 404, `rota inexistente retorna 404 (${r404.status()})`);
  await page.goto(base + '/', { waitUntil: 'load' });
  const seo = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name=description]')?.content || '',
    canonical: document.querySelector('link[rel=canonical]')?.href,
    og: document.querySelector('meta[property="og:image"]')?.content,
    h1: document.querySelectorAll('h1').length,
    lang: document.documentElement.lang,
    ld: JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@type'],
  }));
  check(seo.title.length <= 60, `title ${seo.title.length} chars`);
  check(seo.desc.length >= 70 && seo.desc.length <= 160, `description ${seo.desc.length} chars`);
  check(seo.canonical === 'https://vfitcoachapp.com/' && seo.og && seo.h1 === 1 && seo.lang === 'pt-BR' && !!seo.ld, 'canonical, og:image, 1 h1, lang pt-BR, JSON-LD');
  for (const f of ['robots.txt', 'sitemap.xml', 'og.jpg', 'favicon.svg']) check((await fetch(`${base}/${f}`)).ok, `/${f} existe`);
  await page.close();
}

// --- 6. Lighthouse mobile (throttling padrão: Moto G Power, 4G lento) ---
if (!process.argv.includes('--no-lh')) {
  console.log('\n[Lighthouse mobile]');
  const port = new URL(browser.wsEndpoint()).port;
  const { lhr } = await lighthouse(base + '/', { port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
  for (const [k, c] of Object.entries(lhr.categories)) check(c.score >= 0.9, `${k}: ${Math.round(c.score * 100)}`);
  const a = lhr.audits;
  console.log(`  LCP ${a['largest-contentful-paint'].displayValue} · CLS ${a['cumulative-layout-shift'].displayValue} · TBT ${a['total-blocking-time'].displayValue} · FCP ${a['first-contentful-paint'].displayValue}`);
  for (const [k, c] of Object.entries(lhr.categories)) for (const ref of c.auditRefs) {
    const x = a[ref.id];
    if (ref.weight > 0 && x.score !== null && x.score < 0.9) console.log(`    - ${k}/${x.id}: ${x.title}`);
  }
}

await browser.close();
server.close();
console.log(`\nscreenshots em qa-out/ · ${fails.length ? fails.length + ' FALHA(S)' : 'tudo ok'}`);
process.exit(fails.length ? 1 : 0);
