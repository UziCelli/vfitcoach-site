# Arquitetura

- Duas landing pages estáticas, sem backend de aplicação: `public/` para VFIT; `gislane/public/` para Gislane. Cloudflare Workers serve assets; configurações em `wrangler.jsonc` e `wrangler.gislane.jsonc`.
- `src/` guarda originais VFIT; `scripts/` gera recursos, headers e QA. O build padrão é VFIT; recursos Gislane têm fluxo próprio descrito no [README](README.md).
- Navegador renderiza HTML/CSS/JS; contatos saem para WhatsApp/agenda. Eventos de conversão VFIT passam por dataLayer/GTM, sob CSP.
- CI verifica testes e segurança local das duas marcas. Publicação Gislane tem workflow manual e bloqueio de marcadores incompletos; respeitar contas separadas.
- Reutilize scripts e componentes existentes; avalie desempenho, privacidade e custo antes de ampliar rastreamento ou dependências. Não executar deploy por estar documentado.
