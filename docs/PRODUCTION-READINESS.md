# SND Noturno — preparação para uso institucional (V3.4)
## Escopo
Aplicativo de apoio à rotina operacional do SND noturno, 19h–07h. Não substitui prontuário, protocolos assistenciais, passagem formal ou decisões da equipe. A versão pública é local, sem autenticação ou sincronização. Não registrar informações identificáveis de pacientes. Não utilizar dados reais em testes públicos.
## Operação
1. Em aparelho autorizado, confirmar data/escala, horário do dispositivo e versão no cabeçalho.
2. Registrar recebimento, conferir equipe e acompanhar atividades. Intercorrências exigem justificativa; reaberturas preservam o histórico.
3. Verificar auditorias, pendências e passagem. Conferências externas não contam como tarefas concluídas.
4. Exportar backup protegido em Gestão ao encerramento conforme rotina institucional definida. Conferir o arquivo, guardar senha separadamente e armazenar somente em local aprovado.
## Recuperação
Se houver aviso de gravação bloqueada, interromper alterações. Exportar dados da sessão, registro original (quando disponível) e recuperação IndexedDB; não apagar dados do navegador. Em conflito entre abas, fechar a outra aba após preservar os registros, recarregar e comparar versões. Restaurar apenas após verificação da origem e autorização: a restauração substitui o conjunto local; guarda cópia anterior quando o armazenamento permite. Não sobrescrever histórico mais recente. Testar recuperação em perfil separado sem dados reais. Perda de senha do backup protegido impede a recuperação.
## Segurança e privacidade
LocalStorage e IndexedDB não possuem criptografia em repouso pelo aplicativo. A separação local não é controle de identidade. Utilizar perfil de navegador e aparelho dedicados ou protegidos por controle de acesso do sistema operacional. Bloquear a tela ao afastar-se. Não compartilhar arquivos de backup por canais pessoais. Definir responsáveis, retenção, descarte e resposta a incidentes com TI/privacidade da instituição. O relógio do dispositivo é a fonte temporal; o registro local não é trilha de auditoria inviolável.
## Manutenção
Branch main é fonte da versão moderna. GitHub Actions compila e executa testes antes da publicação em Pages. Conferir resultado do deploy e versão efetivamente servida; aprovação da PR não confirma publicação. Antes de atualizar, exportar backup. Rollback legado é manual, requer validação de compatibilidade e pode ser revertido por novo push. Não apagar armazenamento ao atualizar. Reportar versão, horário, passos e mensagem de erro, sem anexar dados pessoais a issues públicas.
## Checklist de homologação — todos pendentes de aceite institucional
- [ ] Responsável operacional aprova fluxo 19h–07h e catálogo de tarefas.
- [ ] TI valida dispositivos, navegadores, rede, atualização PWA e acesso.
- [ ] Privacidade e segurança aprovam finalidade, dados permitidos, acesso, retenção e descarte.
- [ ] Simular plantão completo, incluindo passagem da meia-noite, indisponibilidade de rede e recuperação.
- [ ] Validar impressão, passagem, recebimento e escala em ambiente real de teste, sem dados pessoais.
- [ ] Testar restauração em aparelho separado e comparar registros.
- [ ] Validar atualização de versão e rollback sem perda de registros.
- [ ] Definir suporte, contingência manual, responsável e aceite documentado.
## Conexão remota — bloqueada
Não ativar a opção experimental até homologação de identidade, RLS, revogação, minimização de payload, idempotência, concorrência, segregação de dispositivos, retenção e recuperação. Não usar chaves de serviço no frontend. A base SQL e a fila são experimentais; não são uma solução conectada homologada.
## Critérios de release estável local
CI aprovado para commit exato, deploy confirmado, versão verificada no endereço público, teste de atualização e restauração, pendências críticas resolvidas e documentação revisada. Estabilidade técnica local não equivale a autorização institucional.
