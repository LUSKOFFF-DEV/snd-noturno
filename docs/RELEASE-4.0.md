# SND Noturno 4.0 — edição local
## Escopo do lançamento
Consolidação da rotina operacional 19h–07h: cockpit, checklist, recebimento, escala, auditoria, passagem, histórico e gestão. Inclui análise preventiva baseada em histórico, comparação de desempenho, backup AES-GCM, cópias IndexedDB, proteção de conflitos, PWA offline e carregamento modular.
## Compatibilidade
Mantém a chave snd-noturno-v1, o esquema de dados versão 1 e o formato de backup criptografado existente. O número 4.0.0 identifica o software, não uma migração de esquema. Antes de atualizar, exportar backup protegido e conferir a versão no cabeçalho.
## Limites
Edição local sem autenticação, sincronização ou criptografia de dados em repouso pelo aplicativo. Os indicadores representam somente o histórico local. A arquitetura conectada permanece experimental e desativada na publicação. Não inserir dados identificáveis de pacientes. A versão não substitui prontuário nem protocolos institucionais.
## Liberação
Aprovar CI do commit exato, integrar à main, verificar execução Publish SND Noturno e versão pública. Testes físicos, atualização de instalações existentes e homologação institucional são etapas separadas. Não afirmar publicação ou aceite sem evidência. Ver docs/PRODUCTION-READINESS.md.
## Manutenção
Após a consolidação, priorizar correções verificadas e feedback de uso, evitando novas funcionalidades sem necessidade operacional. Preservar backup antes de qualquer atualização. O rollback manual exige validação de compatibilidade.
