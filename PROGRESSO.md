# Progresso

Status: CONCLUÍDO

<!-- A tarefa agendada "retomar-vfitcoach-site" lê este arquivo. Se Status for EM ANDAMENTO,
     ela continua pelos "Próximos passos" (em ordem), atualiza este arquivo e faz commit.
     Ao terminar tudo, mude para CONCLUÍDO. -->

## Feito
- 2026-09-25: site de produção em `public/`, QA + Lighthouse 100, CSP e headers, deploy no Cloudflare, GTM `GTM-WN5LPTMX`.
- 2026-09-28: código organizado para edição manual (`EDITANDO.md`, marcadores de seção, `npm run headers` automático no deploy).
- 2026-09-28: revisão de segurança com 3 agentes. Aplicado no código: `gtm.blocklist`, página `/privacidade` (LGPD),
  `workers_dev`/`preview_urls` desligados, `.assetsignore`, `.gitignore` reforçado.
- 2026-09-28: clientes só com iniciais; resultados logo após o topo, com número grande animado e barras antes → depois;
  seção "Como funciona" (3 passos + CTA); marca-texto e brilho nos CTAs; ícone do WhatsApp nos botões. Motion 100% nativo.

## Próximos passos
(Nenhum pendente do lado do código.)

## Pendências do dono (segurança — fora do código)
1. (Feito no site: só iniciais.) Ainda recomendado: autorização por escrito dos 4 clientes (dado de saúde, LGPD art. 11).
2. DMARC no Cloudflare DNS: TXT `_dmarc` = `v=DMARC1; p=quarantine; rua=mailto:victor@vfitcoachapp.com; fo=1`.
3. Religar DNSSEC: Cloudflare → DNS → Settings → Enable DNSSEC; copiar o DS no Squarespace.
4. 2FA (passkey/chave) em Google Workspace, Squarespace, Cloudflare, GitHub; trava de transferência no Squarespace.
5. WhatsApp: verificação em duas etapas (PIN) + PIN anti-portabilidade na operadora.
6. GTM/Ads: só o dono com permissão de Publicar; não usar tag "HTML personalizado".
7. Opcional: CAA no DNS; banner de consentimento (Consent Mode) se for fazer remarketing.
