# Auditoria de segurança — vfitcoach-site

Data/base/escopo: ver THREAT_MODEL.md. Comprovado = visto no código/teste; não verificado = sem evidência suficiente. Prioridade por impacto × probabilidade × exposição. Não há alegação de cobertura integral nem conformidade ASVS.

## Achados com correção preparada
| ID | Nível | Problema | Evidência, correção e exploração plausível |
|---|---|---|---|
| SITE-01 | Alta | Publicação de branch alternativa | `.github/workflows/publicar-gislane.yml`: workflow_dispatch antes sem filtro; agora job exige refs/heads/master. Exige permissão de executar workflow + acesso ao token; esforço baixo. O YAML de outra branch ainda pode ser adulterado: configurar Environment externamente. |
| SITE-02 | Média | Artefatos internos públicos | `scripts/security-check.mjs`: antes só HTML/headers; novo `public-artifacts.mjs` inspeciona subpastas e rejeita symlinks, .env, .git, bancos, chaves e mapas. Não é scanner universal de segredos. Esforço baixo. |
| SITE-03 | Média | Falta gate por PR | Nova `.github/workflows/ci.yml` valida duas marcas e teste sintético sem publicar. Obrigatoriedade depende de ruleset externo. |

Comum: `.github/workflows/secret-scanning.yml` adiciona Gitleaks com action por commit, histórico completo, token somente leitura e sem comentários/artefatos públicos. `.github/dependabot.yml` acompanha dependências e actions. Não há segredos novos nem mudança de produção.

## Matriz T01–T30
| Ameaça | Estado | Evidência/limite |
|---|---|---|
| T01 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T02 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T03 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T04 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T05 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T06 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T07 | Scanner executado | Gitleaks 8.24.3: zero detecções no histórico; não prova inexistência de segredos. CI acrescentado. |
| T08 | Parcialmente corrigido | Branch principal para publicação Gislane agora exigida no YAML (master). Proteção externa não verificada. |
| T09 | Parcialmente verificado | npm audit sem altas/críticas; lockfile existente. |
| T10 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T11 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T12 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T13 | Lacuna corrigida | Scanner recursivo barra mapas e artefatos internos nas duas pastas públicas. |
| T14 | Não verificado | Exige ambiente/provedor ou revisão adicional; ausência de evidência não comprova segurança. |
| T15 | Exposição confirmada | Repositório público; nenhum bloqueio de DevTools foi inserido. |
| T16 | Não verificado | Exige ambiente/provedor ou revisão adicional; ausência de evidência não comprova segurança. |
| T17 | Parcialmente verificado | CSP com hashes e sem handlers inline já existente; gate local passou para as duas marcas. |
| T18 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T19 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T20 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T21 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T22 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T23 | Não verificado | Exige ambiente/provedor ou revisão adicional; ausência de evidência não comprova segurança. |
| T24 | Não verificado | Exige ambiente/provedor ou revisão adicional; ausência de evidência não comprova segurança. |
| T25 | Risco residual | GTM/Ads são scripts remotos autorizados; minimizar permissões e revisar publicação do contêiner. |
| T26 | Não verificado | Exige ambiente/provedor ou revisão adicional; ausência de evidência não comprova segurança. |
| T27 | Não verificado | Exige ambiente/provedor ou revisão adicional; ausência de evidência não comprova segurança. |
| T28 | Não se aplica ao site estático | Sem API, identidade, pagamento, SW, uploads ou banco neste repositório; serviços externos têm escopo próprio. |
| T29 | Inventariado parcialmente | Snapshot de metadados de licenças em DEPENDENCY_LICENSES.json; revisão jurídica de obrigações e ativos pendente. |
| T30 | Não verificado | Contratos de autoria/cessão não disponibilizados. |

## Validação e risco residual
`npm test`, `npm run security -- --local`, `npm run security:gislane -- --local` passaram. Teste sintético injeta arquivo .env, mapa, SQLite e symlink; assets JS/SVG legítimos passam. Layout e HTML não foram modificados; build de imagens não é necessário para este diff.

Gitleaks 8.24.3 executado no histórico local: zero detecções. Nenhuma credencial foi testada contra provedores. Novos testes verificam o comportamento antes ausente; não foi executado ataque em produção. CI remoto deve validar a última versão da branch. Resultado: 1 teste de regressão passou e os dois gates locais passaram.

Actions existentes de checkout/setup/upload fixadas por SHA obtido das respectivas tags oficiais; Dependabot acompanha atualizações.
