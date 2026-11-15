# Segurança

- Site estático público: não publicar segredos, dados reais de alunos ou arquivos internos. Resultados usam apenas iniciais e exigem autorização; prints usam aluno de exemplo.
- Preserve CSP e hashes gerados por `scripts/headers.mjs`, HTTPS, `.assetsignore` e scanners. Não liberar domínios ou scripts inline para silenciar falhas.
- VFIT e Gislane usam contas/configurações separadas; não misturar credenciais nem publicar a Gislane enquanto houver marcadores de confirmação.
- Não apagar registros de e-mail do DNS. Preserve as restrições de GTM e revise privacidade ao adicionar rastreamento; remarketing exige avaliar consentimento.
- Nunca registrar tokens em código, logs ou chat. Suspeita de vazamento exige revogação/rotação, revisão de acessos e correção.
- Vulnerabilidade sensível: usar o reporte privado do GitHub se habilitado, ou canal privado com o dono; não abrir Issue pública com segredo.
- [Remediação](docs/security/REMEDIATION_PLAN.md), [ameaças](docs/security/THREAT_MODEL.md) e [auditoria](docs/security/SECURITY_AUDIT.md) têm evidências datadas. Pendências de conta em [PROGRESSO.md](PROGRESSO.md) precisam de confirmação no provedor.
