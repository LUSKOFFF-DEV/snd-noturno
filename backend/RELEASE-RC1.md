# SND Noturno V3.0 RC1 — modo local

Release candidata exclusivamente local. A publicação em GitHub Pages desabilita acesso conectado por variáveis de build, não provisiona banco e não envia plantões. A opção experimental só pode ser ativada em build separado de homologação com VITE_SND_CONNECTED_EXPERIMENT=true e configuração autorizada.

## Publicação
Push em main que altere código moderno ou assets dispara compilação, testes de navegador e, se aprovados, publicação. O acionamento manual permanece para modern ou legacy. Antes de atualizar, exportar backup externo e verificar a versão no cabeçalho. O rollback legacy deve ser manual; novas alterações em main podem republicar a versão moderna.

## Limitações
LocalStorage continua fonte principal; IndexedDB é cópia complementar. Dados locais não são criptografados nem protegidos por login. A fila conectada ainda não integra o aplicativo, não possui reenvio idempotente no servidor e não foi homologada. RLS, revogação, concorrência, privacidade e autorização institucional precisam de validação antes de qualquer conexão real. O painel gerencial considera apenas plantões registrados neste navegador. Não inserir dados identificáveis de pacientes.
