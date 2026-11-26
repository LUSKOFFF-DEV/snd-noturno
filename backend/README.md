# Connected Operations — fundação V3.0
Esta etapa não conecta o aplicativo publicado a nenhum servidor. A migração SQL é destinada a um ambiente Supabase/PostgreSQL de homologação aprovado pela instituição. Não contém credenciais.
## Acesso
O administrador autorizado provisiona unidades, usuários no Auth e vínculos em snd_members por um canal administrativo seguro. Não há autoinscrição de membros. Cada usuário lê somente suas unidades. Nesta política inicial, técnico, nutricionista e gestão podem gravar plantões; administrativo pode consultar. Gestão pode consultar metadados de alterações. Essa matriz é provisória e deve ser validada pela instituição.
## Contrato
Leitura de snd_shifts por unidade e data retorna payload e revision. RPC snd_write_shift recebe p_unit, p_date, p_expected, p_payload; revisão 0 cria, revisão existente atualiza atomicamente. SQLSTATE 40001 significa conflito: buscar revisão atual, apresentar diferenças, nunca sobrescrever automaticamente. O log registra autor, horário do servidor e revisão na mesma transação. Não é imutável contra administradores do banco.
## Próximos requisitos antes de ativar
- Validar políticas em banco de homologação com usuários de duas unidades, todos os papéis, acesso anônimo e duas gravações concorrentes.
- Definir esquema estrito dos campos do payload, minimização de dados, retenção, backup, política de acesso, revogação e regras de conflito por atividade. O JSON genérico atual não é suficiente para produção.
- Implementar login, sessão, fila IndexedDB por usuário/unidade, reenvio idempotente, reconciliação e isolamento de dados em dispositivos compartilhados. Não armazenar senha ou chave de serviço no frontend. Não usar a chave service_role no navegador.
- Verificar aprovação institucional, segurança e privacidade antes de transmitir nomes ou informações operacionais. Não incluir informações identificáveis de pacientes.
- Testar offline, expiração da sessão, revogação, concorrência e recuperação. A interface V2.7 segue local e independente.

## V3.0.2 — acesso experimental
Configure VITE_SND_AUTH_URL (origem HTTPS aprovada) e VITE_SND_PUBLIC_KEY (chave sb_publishable_) no ambiente de build de homologação. Sem ambos, o painel fica desativado. A sessão mantém somente o token de acesso em memória, sem renovação automática; expira ou é descartada ao recarregar ou sair. Encerrar sessão local não revoga o token no servidor. Nenhum plantão é enviado e o login não protege os registros locais. Não ativar antes da homologação de Auth, RLS, expiração, revogação e política de dispositivos compartilhados.
