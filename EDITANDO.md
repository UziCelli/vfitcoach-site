# Editando o site à mão

Tudo o que vai pro ar está em **um arquivo só**: `public/index.html`.
Abra no VS Code e use `Ctrl+F` com o nome da seção (`===== RESULTADOS`, `===== SERVIÇOS`…).

## Receita (sempre a mesma)

1. Edite `public/index.html` e salve.
2. `npm run qa -- --no-lh` → confere se nada quebrou (≈30 s). Tem que terminar com **tudo ok**.
3. `npm run deploy` → publica. A CSP (segurança) é atualizada sozinha.
4. Abra https://vfitcoachapp.com no celular e confira.

Deu erro? Não publique. Desfaça com `git checkout public/index.html` e peça ajuda.

## Onde fica cada coisa

| Quero mudar… | Procure por | Atenção |
|---|---|---|
| Número ou mensagem do WhatsApp | `wa.me/` | Aparece **4 vezes**. Mude todas (o QA avisa se ficarem diferentes, ou diferentes do `tel:` do rodapé). A mensagem é codificada (`%20` = espaço); gere em https://www.urlencoder.org |
| Link da agenda | `calendar.app.google` | Aparece **2 vezes**. |
| Telefone do rodapé | `tel:+55` | Também está no bloco `application/ld+json` no topo (`telephone`). |
| Instagram | `personal.victorcelli` | 3 lugares: rodapé, "Sobre" e JSON-LD no topo. |
| Título do Google / descrição | `<title>` e `name="description"` | Título até 60 caracteres, descrição de 70 a 160. |
| Cliente (números) | `===== RESULTADOS` | Troque só o texto de dentro: `<span class="de">antes</span>` e `<strong class="para">depois</strong>`. As barras e a contagem animada se ajustam sozinhas. Cliente novo: copie um `<article>…</article>` inteiro. |
| Número grande do card | `class="destaque"` | Tem que ser **depois − antes** de uma das linhas do card (ex.: 110,4 − 120,8 = −10,4). Use `−` na frente pra queda e `+` pra ganho. O QA confere a conta. |
| Nome do cliente | `class="name"` | **Só iniciais** (`G.` ou `G. S.`). O QA reprova nome completo (dado de saúde, LGPD). |
| Serviços / FAQ | `===== SERVIÇOS` / `===== PERGUNTAS` | Pergunta nova: copie um `<details>…</details>`. |
| Cores | `:root{` no começo do `<style>` | `--cta` é a cor dos botões. |
| Política de privacidade | `public/privacidade.html` | Atualize a data no topo se mudar algo. Ferramenta nova de rastreamento (ex.: Meta Pixel) = citar lá. |
| Foto | — | Troque `src/foto-victor.jpg` e rode `npm run build` (ver README). |

## Não mexa

- O bloco `<svg class="logo-mark">` (desenho do logo).
- Os `<script>` (um no `<head>`, um no final): contam os cliques de WhatsApp pro Google Ads e fazem as animações. Os atributos `data-cta="…"` dos botões precisam continuar lá.
- O `<svg class="sprite">` logo depois do `<body>`: é o ícone do WhatsApp usado nos botões (`<use href="#i-wa"/>`).
- `public/_headers`: é gerado automaticamente. Edite `scripts/headers.mjs` se precisar.
- Nada de `onclick="…"`, `style="…"` nem `<script src="…">` de outros sites: a CSP bloqueia (e o `npm run security` avisa). Estilo novo = uma classe no `<style>`.

## Comandos

| Comando | Quando |
|---|---|
| `npm run qa -- --no-lh` | Depois de qualquer edição (rápido). |
| `npm run qa` | Com Lighthouse (nota de velocidade), antes de mudanças grandes. |
| `npm run deploy` | Publicar. |
| `npm run build` | Só ao trocar foto ou fontes. |
| `npm run security` | Checagem de segurança (roda também toda semana). |
