# SND Noturno V2.2 — migração incremental
Shell React/TypeScript, Tailwind, Radix, Lucide e Framer Motion. As telas internas permanecem no motor V2.1, extraído no build, para preservar funcionalidades e a chave localStorage snd-noturno-v1.
Execute npm install e npm run build em modern. Não publique sobre o endereço atual antes de validar todos os fluxos, backups, layout e offline. A build não registra service worker próprio; o worker da versão atual pode interferir se publicada no mesmo escopo. Teste em ambiente separado com dados fictícios. A versão de produção permanece V2.1.
