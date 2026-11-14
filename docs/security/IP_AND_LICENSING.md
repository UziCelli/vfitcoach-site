# Propriedade intelectual e licenciamento

O repositório é público. A visibilidade não comprova cessão, licença de uso ou ausência de direitos; código público pode ser copiado tecnicamente. A proteção autoral não torna JS/HTML secretos.

## Inventário disponível
- Código próprio: histórico/commits identificam contribuições, não comprovam contratos nem cadeia completa de titularidade. Titular legal: PENDENTE DE CONFIRMAÇÃO.
- Marca VFITCOACH e Gislane, logos, fotografias, depoimentos e fontes: confirmar titularidade, autorização de uso e consentimentos aplicáveis; não foram fornecidos contratos/registro INPI.
- Dependências: snapshot local em DEPENDENCY_LICENSES.json, derivado de package-lock.json, incluindo transitivas e opcionais. Ausência de campo significa licença desconhecida, não autorização irrestrita. Metadados não substituem texto integral das licenças.
- Não adicionamos LICENSE proprietária, não removemos avisos e não declaramos titularidade em seu nome.

## Passos do proprietário
1. Organizar cessões/contratos de colaboradores, provas de criação, licenças de fontes/imagens e autorizações de depoimentos.
2. Selecionar release estável, guardar código integral + commit + hash SHA-256 em local privado e cópia de segurança.
3. INPI: consultar procedimento/tabela atuais; cadastro e-INPI → GRU de software → e-Software; preservar certificado/hash e conteúdo correspondente. Não tratamos os preços do guia como verificados nesta sessão.
4. Pesquisar marca, definir titular/classes e protocolar com acompanhamento da RPI; consultar profissional para contratos, classes e LGPD quando necessário.
5. Revisar termos SaaS, política de privacidade e uso de terceiros separadamente. Em suspeita de clone, preservar URLs/datas/provas e denunciar ao provedor com suporte jurídico; não atacar o clone.

## Reproduzir inventário
`npm ci --ignore-scripts` e `npm sbom --sbom-format cyclonedx > sbom.cdx.json`; revisar componentes/avisos da versão efetivamente distribuída. Dependências npm são de build e não são automaticamente distribuídas com os assets.
