# VFITCOACH — site (vfitcoachapp.com)

Landing page estática para captação de leads via WhatsApp (Google Ads). HTML/CSS/JS puro, sem framework e sem back-end.

**Vai editar texto, números ou links à mão? Leia o [EDITANDO.md](EDITANDO.md).**

```
public/        ← é isto que vai pro ar (já inclui imagens, fontes, _headers, sitemap)
src/           ← originais: prototipo.html (referência aprovada), foto-victor.jpg
scripts/       ← build.mjs, headers.mjs, qa.mjs, security-check.mjs
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | Uma vez. Depois: `npx puppeteer browsers install chrome-headless-shell` |
| `npm run build` | Regera imagens (AVIF/WebP), fontes, favicon, og.jpg, sitemap e `_headers`. Só precisa ao trocar foto ou fontes. |
| `npm run headers` | Regera só o `_headers` (CSP com o hash do `<script>`/`<style>` inline). O `deploy` já roda isto sozinho. |
| `npm run qa` | QA com Puppeteer: 4 larguras de tela, scroll-reveal, contraste claro/escuro, links de WhatsApp/agenda, cards de clientes completos, SEO e Lighthouse mobile (`-- --no-lh` pula o Lighthouse). Screenshots em `qa-out/`. |
| `npm run security` | Headers, CSP, HTTPS/certificado, formulários, dependências. Só falha com problema real. |

Última medição (Lighthouse mobile, local): Performance 100 · Acessibilidade 100 · Boas práticas 100 · SEO 100 · LCP 1,5 s.

## Deploy (Cloudflare Workers — assets estáticos)

`npm run deploy` → regera o `_headers`, roda a checagem de segurança local e publica `public/` (config em `wrangler.jsonc`; o `_headers` e o `404.html` são aplicados pelo Cloudflare).
Primeira vez numa máquina nova: `npx wrangler login`.

- No ar em https://vfitcoachapp.com e https://www.vfitcoachapp.com (custom domains do Worker `vfitcoach`; o endereço *.workers.dev fica desligado).
- Cloudflare → SSL/TLS → Edge Certificates: **Always Use HTTPS** ligado, TLS mínimo 1.2.
- Domínio: a zona `vfitcoachapp.com` fica no DNS do Cloudflare (nameservers), o registro do domínio continua no Squarespace. Registros de e-mail do Google Workspace (MX, SPF, DKIM) estão em `dns-backup.txt` — nunca apague esses.
- No Cloudflare, deixe **desligados**: Rocket Loader, Email Obfuscation e Web Analytics automático — eles injetam scripts que a CSP bloqueia.
- Depois do domínio no ar: `npm run security` passa a checar os headers ao vivo.

## Google Ads — conversões

Google Tag Manager `GTM-WN5LPTMX` instalado (carrega após o `load` da página). Cada clique envia para o `dataLayer`:
- WhatsApp: `{ event: 'whatsapp_click', cta: 'topo' | 'hero' | 'passos' | 'final' }`
- Agenda: `{ event: 'schedule_click', cta: 'agenda-hero' | 'agenda-final' }`
- Telefone: `{ event: 'phone_click', cta: 'telefone' }`

No GTM: acionador "Evento personalizado = whatsapp_click" → tag de conversão do Google Ads (+ tag "Vinculador de conversões" em todas as páginas). Publique o contêiner.
Domínios do Google liberados na CSP ficam em `scripts/headers.mjs` (objeto `g`). Tag nova de outro fornecedor = liberar o domínio lá, `npm run qa`, `npm run deploy`. Evite tags "HTML personalizado": a CSP bloqueia scripts inline não autorizados.

Os links de WhatsApp abrem com a mensagem "Olá, Victor! Vim pelo site e quero agendar uma avaliação." — assim dá pra identificar no WhatsApp quem veio do site.

## Motion (animações)

Sem biblioteca externa: CSS + JavaScript nativo do navegador (IntersectionObserver, transições), então a página continua leve (Lighthouse 100) e sem código de terceiros.
- Seções aparecem ao rolar; palavras-chave dos títulos ganham um marca-texto (`<span class="hl">`).
- Resultados: o número grande conta a partir de 0 e cada linha mostra uma barra antes → depois, montada a partir do próprio texto (`.de` / `.para`).
- "Como funciona": os passos 1 → 2 → 3 acendem em sequência. Botões de WhatsApp dão 2 brilhos ao aparecer e param.
- Quem usa "reduzir movimento" no celular/computador vê tudo parado, já no valor final.

## Trocar a foto

Substitua `src/foto-victor.jpg` (quadrada) e rode `npm run build`. Como os assets têm cache de 1 ano, renomeie também os arquivos `victor-*` (ex.: `victor2-*`) no build e no index.html.

## Site da Gislane (segunda marca)

Mesma landing, em `gislane/public/` (config: `wrangler.gislane.jsonc`, Worker `gislane-site`). O site do VFITCOACH (`public/`) não muda.
- Comandos: `npm run headers:gislane` · `npm run qa:gislane -- --no-lh` · `npm run security:gislane` · `npm run deploy:gislane`. Os scripts leem `SITE=gislane` (ou `--site=gislane`); sem isso, valem para o VFIT. `npm run build` é só do VFIT (foto/fontes da Gislane são arquivos fixos em `gislane/public/assets`).
- Tudo que falta está como `[A CONFIRMAR: …]` (e `A_CONFIRMAR` nos links). Enquanto houver marcador, o `qa:gislane` reprova de propósito; o `deploy:gislane` não deve ser usado antes de zerar isso.
- Sem GTM por enquanto: o ponto de troca está comentado no `<script>` final do `index.html`.
- Domínio: `gislanepersonaltrainer.com` (em `wrangler.gislane.jsonc`, `scripts/site.mjs` e `gislane/public/`). App em `app.gislanepersonaltrainer.com`.

### Publicar via GitHub Actions

Workflow `.github/workflows/publicar-gislane.yml`: dispara com `workflow_dispatch` (manual no GitHub). Valida headers, segurança local e marcadores de confirmação, depois publica.
Secrets do repositório necessários: `CLOUDFLARE_API_TOKEN` (token da Cloudflare com permissão "Editar Cloudflare Workers" e acesso à zona do domínio) e `CLOUDFLARE_ACCOUNT_ID` (ID da conta).
Só executa se não houver `[A CONFIRMAR` ou `A_CONFIRMAR` em `gislane/public/` — não publica site incompleto.
