# Graph Report - vfitcoach-site  (2026-10-17)

## Corpus Check
- 16 files · ~289,664 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 52 file(s) not represented in the graph (top: .avif 38, (none) 6, .woff2 4)

## Summary
- 110 nodes · 135 edges · 13 communities (9 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `660f68ea`
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

## God Nodes (most connected - your core abstractions)
1. `scripts` - 11 edges
2. `VFITCOACH — site (vfitcoachapp.com)` - 7 edges
3. `Editando o site à mão` - 6 edges
4. `launch()` - 5 edges
5. `pubDir` - 5 edges
6. `root` - 4 edges
7. `Progresso` - 4 edges
8. `sharp` - 3 edges
9. `isDefault` - 3 edges
10. `host` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (13 total, 4 thin omitted)

### Community 0 - "VFITCOACH — site (vfitcoachapp.com)"
Cohesion: 0.12
Nodes (14): Comandos, Editando o site à mão, Não mexa, Onde fica cada coisa, Receita (sempre a mesma), Site da Gislane, Comandos, Deploy (Cloudflare Workers — assets estáticos) (+6 more)

### Community 1 - "security-check.mjs"
Cohesion: 0.15
Nodes (9): f(), info, pages, problems, arg, host, isDefault, root (+1 more)

### Community 2 - "qa.mjs"
Cohesion: 0.13
Nodes (8): cards, fails, finalTexts, out, rules, server, types, viewports

### Community 3 - "build.mjs"
Cohesion: 0.21
Nodes (5): puppeteer, sharp, launch(), logo, root

### Community 4 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, deploy, deploy:gislane, headers, headers:gislane, qa, qa:gislane (+3 more)

### Community 5 - "headers.mjs"
Cohesion: 0.20
Nodes (8): csp, css, files, g, hashes(), js, sha(), pubDir

### Community 6 - "package.json"
Cohesion: 0.20
Nodes (9): name, overrides, sharp, private, type, @fontsource-variable/inter, @fontsource-variable/montserrat, lighthouse (+1 more)

### Community 7 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @fontsource-variable/inter, @fontsource-variable/montserrat, lighthouse, puppeteer, sharp, wrangler

### Community 8 - "Progresso"
Cohesion: 0.40
Nodes (4): Feito, Pendências do dono (segurança — fora do código), Progresso, Próximos passos

## Knowledge Gaps
- **3 isolated node(s):** `@fontsource-variable/inter`, `@fontsource-variable/montserrat`, `wrangler`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 77 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `@fontsource-variable/montserrat`, `wrangler` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `VFITCOACH — site (vfitcoachapp.com)` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Why does `sharp` connect `build.mjs` to `package.json`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Should `qa.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Why does `lighthouse` connect `package.json` to `qa.mjs`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._