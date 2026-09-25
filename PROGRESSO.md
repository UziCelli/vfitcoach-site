# Progresso

Status: CONCLUÍDO

<!-- A tarefa agendada "retomar-vfitcoach-site" lê este arquivo. Se Status for EM ANDAMENTO,
     ela continua pelos "Próximos passos" (em ordem), atualiza este arquivo e faz commit.
     Ao terminar tudo, mude para CONCLUÍDO. -->

## Feito (2026-09-25)
- Site de produção em `public/` reconstruído do protótipo aprovado (copy e dados de clientes idênticos — verificado pelo `npm run qa`).
- Imagens AVIF/WebP, fontes self-hosted, SEO (meta, OG, JSON-LD, sitemap, robots, 404), CSP e headers de segurança.
- QA Puppeteer + Lighthouse mobile 100/100/100/100.
- Agente `security-monitor` + checagem semanal; checkpoint automático por commit a cada fim de turno.

## Próximos passos
(Nenhum pendente do lado do código.)

## Pendências do dono
- Deploy no Cloudflare Pages e troca de DNS (hoje o domínio aponta para o Squarespace) — ver README.
- Criar conta no Google Tag Manager/Ads e passar o ID do GTM para ligar a conversão `whatsapp_click`.
