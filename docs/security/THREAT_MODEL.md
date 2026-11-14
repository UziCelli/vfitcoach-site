# Modelo de ameaças — vfitcoach-site

Data: 14/11/2026. Base inspecionada: `490c93bbab8b5120470c991551f2e5e6b984afcc`. Referência: OWASP ASVS 5.0.0; não representa certificação.

## Inventário e fronteiras
HTML/CSS/JS estáticos para VFITCOACH e Gislane; assets Cloudflare Workers, WhatsApp/agenda e Google Tag Manager/Ads. Sem backend, login, pagamento ou Service Worker neste repositório.

Ativos: código, histórico Git, domínios, contas GitHub/Cloudflare, credenciais de publicação, marca, imagens/fontes e dependências. As páginas e os assets são públicos; capturas promocionais precisam de consentimento ou dados sintéticos.

Atores: proprietário, colaboradores, usuários legítimos, visitantes maliciosos e dependência/conta comprometida.

Fluxo: navegador não confiável → Cloudflare → arquivos estáticos públicos. Cliques saem para WhatsApp, agenda e serviços Google; não atribuir a este site os controles do app de treino separado.
GitHub/CI → build/publicação é outra fronteira: revisão e proteção externa dos segredos continuam necessárias.

## Riscos prioritários
- Conta de publicação comprometida permite substituir a aplicação (impacto alto, probabilidade dependente de MFA/permissões não verificados).
- Arquivo interno colocado por engano em public/ podia ser publicado; gate recursivo adicionado. Workflow manual podia publicar branch alternativa; restringido a master.
- Repositório público permite copiar o código atual e o histórico. Torná-lo privado não recolhe cópias existentes.
- Bibliotecas e workflows podem mudar: Dependabot e scanner de segredos adicionados; não garantem ausência de falhas.
- Clone visual e phishing continuam possíveis; marca/monitoramento/resposta jurídica são complementares.

## Limites da revisão
Somente código disponibilizado e testes locais sintéticos. Sem acesso a painéis de produção, políticas reais de Access, DNS, MFA, buckets, backups ou faturamento; sem testes ativos nos domínios. Não registrar valores de segredos. Arquivos entregues ao navegador podem ser copiados.
