# Política de cache

Este repositório é um site estático de divulgação, não a PWA de treino. Nenhum Service Worker/IndexedDB ou conteúdo premium foi encontrado. O app vinculado tem repositório e política próprios.

| Conteúdo | Estratégia |
|---|---|
| HTML público e _headers | Atualização pela rede/CDN conforme configuração do provedor |
| /assets/* público | Cache-Control: public, max-age=31536000, immutable já existente |
| Login, APIs, dados privados, premium | Não existem neste repositório; nunca adicionar às pastas public/ |

Ao trocar imagem/fonte/script com cache longo, renomear o arquivo e atualizar referências; publicar HTML e assets juntos. Rollback deve restaurar HTML e os assets referenciados; manter versões antigas enquanto houver páginas que as usem. Não alterar cache longo sem plano de migração. Não há SW para instalar/ativar/recuperar.
