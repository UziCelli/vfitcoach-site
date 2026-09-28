// Checagem de segurança. Sai com código 1 só se houver problema real.
// Uso: npm run security            (local + site ao vivo)
//      npm run security -- --local (só arquivos locais)
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import tls from 'node:tls';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const SITE = 'vfitcoachapp.com';
const root = fileURLToPath(new URL('..', import.meta.url));
const pub = join(root, 'public');
const problems = [];
const info = [];
const bad = (m) => problems.push(m);

// --- 1. HTML: sem formulários, scripts externos, handlers inline ou links inseguros ---
const pages = (await readdir(pub)).filter((f) => f.endsWith('.html'));
const headers = await readFile(join(pub, '_headers'), 'utf8');
for (const f of pages) {
  const html = await readFile(join(pub, f), 'utf8');
  if (/<form\b/i.test(html)) bad(`${f}: tem <form> — precisa de proteção anti-spam/validação antes de publicar`);
  if (/<script[^>]+src=["']?https?:/i.test(html)) bad(`${f}: script externo (atualize a CSP e avalie o risco)`);
  if (/<[a-z]+\s[^>]*\son[a-z]+\s*=/i.test(html)) bad(`${f}: handler inline (onclick=...) — bloqueado pela CSP`);
  for (const a of html.match(/<a\b[^>]*target=["']?_blank[^>]*>/gi) || []) if (!/noopener|noreferrer/.test(a)) bad(`${f}: link _blank sem rel=noopener → ${a.slice(0, 80)}`);
  if (/href=["']http:\/\//i.test(html)) bad(`${f}: link http:// (sem HTTPS)`);
  // CSP desatualizada = script/estilo bloqueado em produção
  for (const tag of ['script', 'style']) for (const m of html.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'))) {
    const h = `sha256-${createHash('sha256').update(m[1]).digest('base64')}`;
    if (!headers.includes(h)) bad(`${f}: <${tag}> inline mudou e a CSP não — rode "npm run headers"`);
  }
}
for (const h of ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options', 'Referrer-Policy', 'frame-ancestors']) if (!headers.includes(h)) bad(`_headers sem ${h}`);

// --- 2. dependências (todas são de build; nenhuma vai pro site publicado) ---
try { execSync('npm audit --audit-level=high', { cwd: root, stdio: 'pipe' }); }
catch (e) { bad(`npm audit: vulnerabilidade alta/crítica em dependência de build\n${String(e.stdout).split('\n').slice(0, 12).join('\n')}`); }
try { execSync('npm outdated', { cwd: root, stdio: 'pipe' }); }
catch (e) { if (String(e.stdout).trim()) info.push(`dependências com versão nova (não é urgente):\n${String(e.stdout).trim()}`); }

// --- 3. site ao vivo ---
if (!process.argv.includes('--local')) {
  try {
    const res = await fetch(`https://${SITE}/`);
    const body = await res.text();
    if (!body.includes('data-cta="hero"')) {
      info.push(`https://${SITE} ainda não serve este site (servidor: ${res.headers.get('server') || '?'}) — checagem de headers ao vivo pulada até o deploy`);
    } else {
      for (const h of ['content-security-policy', 'strict-transport-security', 'x-content-type-options', 'referrer-policy']) if (!res.headers.get(h)) bad(`ao vivo: header ${h} ausente (o _headers não foi aplicado?)`);
      const csp = res.headers.get('content-security-policy') || '';
      for (const m of body.matchAll(/<script>([\s\S]*?)<\/script>/g)) if (!csp.includes(createHash('sha256').update(m[1]).digest('base64'))) bad('ao vivo: CSP não autoriza o script da página — tracking de WhatsApp e animações quebrados');
      const plain = await fetch(`http://${SITE}/`, { redirect: 'manual' }).catch(() => null);
      if (plain && !(plain.status >= 300 && plain.status < 400 && plain.headers.get('location')?.startsWith('https://'))) bad(`ao vivo: http:// não redireciona para https:// (status ${plain.status})`);
    }
    const cert = await new Promise((ok, fail) => { const s = tls.connect(443, SITE, { servername: SITE }, () => { ok(s.getPeerCertificate()); s.end(); }); s.on('error', fail); });
    const days = Math.floor((new Date(cert.valid_to) - Date.now()) / 864e5);
    if (days < 14) bad(`ao vivo: certificado HTTPS vence em ${days} dias`);
  } catch (e) { bad(`ao vivo: não consegui acessar https://${SITE} (${e.message})`); }
}

for (const i of info) console.log(`info: ${i}`);
if (problems.length) { console.log(`\n${problems.length} PROBLEMA(S):`); for (const p of problems) console.log(`- ${p}`); process.exit(1); }
console.log('segurança ok');
