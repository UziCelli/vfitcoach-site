# Graph Report - vfitcoach-site  (2026-11-14)

## Corpus Check
- 24 files · ~295,238 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 52 file(s) not represented in the graph (top: .avif 38, (none) 6, .woff2 4)

## Summary
- 141 nodes · 168 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `490c93bb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- VFITCOACH — site (vfitcoachapp.com)
- security-check.mjs
- qa.mjs
- build.mjs
- scripts
- headers.mjs
- package.json
- devDependencies
- Progresso
- CLAUDE.md
- .claude/CLAUDE.md
- session-start.sh
- Plano de remediação
- Propriedade intelectual e licenciamento
- Auditoria de segurança — vfitcoach-site
- Modelo de ameaças — vfitcoach-site
- PWA_CACHE_POLICY.md

## God Nodes (most connected - your core abstractions)
1. `scripts` - 12 edges
2. `VFITCOACH — site (vfitcoachapp.com)` - 7 edges
3. `Editando o site à mão` - 6 edges
4. `launch()` - 5 edges
5. `unsafeArtifacts()` - 5 edges
6. `pubDir` - 5 edges
7. `Plano de remediação` - 5 edges
8. `root` - 4 edges
9. `Progresso` - 4 edges
10. `Propriedade intelectual e licenciamento` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (18 total, 5 thin omitted)

### Community 0 - "VFITCOACH — site (vfitcoachapp.com)"
Cohesion: 0.12
Nodes (14): Comandos, Editando o site à mão, Não mexa, Onde fica cada coisa, Receita (sempre a mesma), Site da Gislane, Comandos, Deploy (Cloudflare Workers — assets estáticos) (+6 more)

### Community 1 - "security-check.mjs"
Cohesion: 0.17
Nodes (5): unsafeArtifacts(), info, pages, problems, host

### Community 2 - "qa.mjs"
Cohesion: 0.12
Nodes (13): cards, fails, finalTexts, out, rules, server, types, viewports (+5 more)

### Community 3 - "build.mjs"
Cohesion: 0.20
Nodes (5): puppeteer, launch(), f(), logo, root

### Community 4 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, deploy, deploy:gislane, headers, headers:gislane, qa, qa:gislane (+4 more)

### Community 5 - "headers.mjs"
Cohesion: 0.22
Nodes (7): csp, css, files, g, hashes(), js, sha()

### Community 6 - "package.json"
Cohesion: 0.17
Nodes (11): name, overrides, sharp, undici, private, type, @fontsource-variable/inter, @fontsource-variable/montserrat (+3 more)

### Community 7 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @fontsource-variable/inter, @fontsource-variable/montserrat, lighthouse, puppeteer, sharp, wrangler

### Community 8 - "Progresso"
Cohesion: 0.40
Nodes (4): Feito, Pendências do dono (segurança — fora do código), Progresso, Próximos passos

### Community 13 - "Plano de remediação"
Cohesion: 0.33
Nodes (5): Aceite e rollback, P0 — proprietário e revisor antes de publicar, P1 — responsável técnico + proprietário, P2 — responsável técnico, Plano de remediação

### Community 14 - "Propriedade intelectual e licenciamento"
Cohesion: 0.40
Nodes (4): Inventário disponível, Passos do proprietário, Propriedade intelectual e licenciamento, Reproduzir inventário

### Community 15 - "Auditoria de segurança — vfitcoach-site"
Cohesion: 0.40
Nodes (4): Achados com correção preparada, Auditoria de segurança — vfitcoach-site, Matriz T01–T30, Validação e risco residual

### Community 16 - "Modelo de ameaças — vfitcoach-site"
Cohesion: 0.40
Nodes (4): Inventário e fronteiras, Limites da revisão, Modelo de ameaças — vfitcoach-site, Riscos prioritários

## Knowledge Gaps
- **3 isolated node(s):** `@fontsource-variable/inter`, `@fontsource-variable/montserrat`, `wrangler`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 101 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `@fontsource-variable/montserrat`, `wrangler` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `VFITCOACH — site (vfitcoachapp.com)` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Why does `sharp` connect `package.json` to `qa.mjs`, `build.mjs`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Should `qa.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._
- **Why does `lighthouse` connect `package.json` to `qa.mjs`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._