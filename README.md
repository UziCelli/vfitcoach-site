# VFITCOACH — site (vfitcoachapp.com)

Landing page estática para captação de leads via WhatsApp (Google Ads). HTML/CSS/JS puro, sem framework e sem back-end.

```
public/        ← é isto que vai pro ar (já inclui imagens, fontes, _headers, sitemap)
src/           ← originais: prototipo.html (referência aprovada), foto-victor.jpg
scripts/       ← build.mjs, qa.mjs, security-check.mjs
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | Uma vez. Depois: `npx puppeteer browsers install chrome-headless-shell` |
| `npm run build` | Regera imagens (AVIF/WebP), fontes, favicon, og.jpg, sitemap e o `_headers` (CSP com hash). **Rode sempre que editar `<script>` ou `<style>` do index.html**, senão a CSP bloqueia em produção. |
| `npm run qa` | QA com Puppeteer: 4 larguras de tela, scroll-reveal, contraste claro/escuro, links de WhatsApp, dados dos clientes idênticos ao protótipo, SEO e Lighthouse mobile. Screenshots em `qa-out/`. |
| `npm run security` | Headers, CSP, HTTPS/certificado, formulários, dependências. Só falha com problema real. |

Última medição (Lighthouse mobile, local): Performance 100 · Acessibilidade 100 · Boas práticas 100 · SEO 100 · LCP 1,5 s.

## Deploy (Cloudflare Pages)

1. Suba esta pasta para um repositório no GitHub (privado).
2. Cloudflare → Workers & Pages → Create → Pages → conectar o repositório.
   - Build command: **vazio** (os arquivos já estão gerados)
   - Build output directory: **public**
3. Custom domains → `vfitcoachapp.com` e `www.vfitcoachapp.com`. Hoje o domínio aponta para o **Squarespace**: troque os registros DNS conforme o Cloudflare indicar (ou transfira os nameservers para o Cloudflare).
4. No Cloudflare, deixe **desligados**: Rocket Loader, Email Obfuscation e Web Analytics automático — eles injetam scripts que a CSP bloqueia.
5. Depois do deploy: `npm run security` passa a checar os headers ao vivo.

Netlify também lê o `_headers`; basta publicar a pasta `public`.

## Google Ads — conversões

Cada clique em WhatsApp/telefone já envia `{ event: 'whatsapp_click', cta: 'topo' | 'hero' | 'final' | 'telefone' }` para o `dataLayer`.
Para ligar ao Google Ads, instale o Google Tag Manager (ID `GTM-XXXX` da conta) e crie um acionador "Evento personalizado = whatsapp_click" → tag de conversão do Ads.
Instalar o GTM exige liberar na CSP (`scripts/build.mjs`): `script-src https://www.googletagmanager.com`, `img-src`/`connect-src https://www.google-analytics.com https://*.google.com https://*.doubleclick.net`. Rode `npm run build` e `npm run qa` depois.

Os links de WhatsApp abrem com a mensagem "Olá, Victor! Vim pelo site e quero agendar uma avaliação." — assim dá pra identificar no WhatsApp quem veio do site.

## Trocar a foto

Substitua `src/foto-victor.jpg` (quadrada) e rode `npm run build`. Como os assets têm cache de 1 ano, renomeie também os arquivos `victor-*` (ex.: `victor2-*`) no build e no index.html.
