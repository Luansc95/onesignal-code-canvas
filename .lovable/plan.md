# Autenticação real do Admin (Supabase Auth + papéis)

Trocar o login simulado por login de verdade, com sessão persistente, papéis controlados no banco e bloqueio de acesso mesmo fora da tela.

O site público não muda em nada. Nenhuma tela administrativa é removida.

## O que você vai ver no final

- Tela de entrada do Admin pedindo e-mail e senha reais (sem botões de perfil de demonstração, sem "qualquer e-mail entra").
- "Esqueci minha senha" com e-mail de redefinição e uma página para criar a nova senha.
- Ao atualizar a página ou reabrir o navegador, você continua conectado; ao sair, o acesso é encerrado de verdade.
- Menu do Admin mostrando apenas o que o seu perfil permite; se você digitar o endereço de uma área proibida, aparece "Acesso negado".
- Nova tela **Usuários** (só para administrador): lista de pessoas, papel de cada uma, convidar por e-mail, alterar papel, desativar acesso e ver o último acesso.
- Registro automático em Auditoria: entrada, saída, falha de entrada, convite, mudança de papel e desativação.

## Perfis e o que cada um acessa

- **Administrador**: tudo.
- **Editor**: projetos e conteúdo do portfólio.
- **Comercial**: leads, contatos e pipeline.
- **Marketing**: marketing, analytics e diagnósticos.
- Configurações, auditoria e usuários: somente administrador.

O bloqueio vale nos dois lados: a tela esconde o que não é permitido e o banco recusa a leitura mesmo que alguém tente acessar os dados por fora.

## Primeiro administrador

Você escolheu informar o e-mail. **Preciso que você me diga qual é o e-mail** — vou deixá-lo registrado como administrador e enviar o convite; você define a senha pelo link recebido. Enquanto o e-mail não for informado, essa parte fica pendente e o restante segue.

Novos usuários entram sempre por convite: nunca há cadastro público, senha padrão ou senha temporária.

## Como fica organizado (detalhes técnicos)

1. **Banco (migração)**
   - Tabela `admin_users_meta` complementando `profiles` com `is_active`, `last_sign_in_at`, `invited_by` (com GRANTs, RLS e trigger de `updated_at`).
   - Papel pré-atribuído por e-mail: tabela `pending_role_assignments` (e-mail + papel + quem convidou), consumida pelo gatilho `handle_new_user` para gravar em `user_roles` no primeiro acesso.
   - Políticas de RLS revisadas: `anon` só pode inserir em `leads`, `contacts`, `diagnostics`, `diagnostic_answers`, `analytics_events`; nenhuma leitura anônima em `profiles`, `user_roles`, `audit_logs`, `notifications`, `campaigns`. Leitura autenticada por papel via `has_role()` / `has_any_role()` (security definer, já existentes, sem recursão).
   - Função `set_user_role(_user_id, _role)` e `deactivate_user(_user_id)` como security definer restritas a admin, gravando em `audit_logs`.
   - Edge function `admin-invite-user` (service role) para convidar via Supabase Auth, garantir profile, atribuir papel e registrar auditoria — o convite nunca sai do navegador com chave privilegiada.

2. **Estado de autenticação no app**
   - `src/contexts/AuthContext.tsx`: fonte única com `session`, `user`, `profile`, `roles`, `status` (`loading | authenticated | unauthenticated`), `signIn`, `signOut`, `hasRole`, `canAccess`.
   - Registra `onAuthStateChange` primeiro e depois `getSession()`; carrega profile e papéis fora do callback para evitar corrida/duplicação. `SIGNED_OUT` e expiração limpam o estado e redirecionam.
   - `src/services/authService.ts` é **removido**; `AdminLayout`, `AdminSettings`, `AdminProjects`, `AdminMarketing`, `AdminLeads`, `AdminContacts` e `App.tsx` passam a usar o contexto (`useAuth`). Nenhuma referência antiga permanece.

3. **Rotas**
   - `ProtectedRoute` envolvendo todas as rotas `/admin/*`: enquanto carrega mostra estado de carregamento; sem sessão redireciona para `/admin/login`; com sessão e sem permissão mostra "Acesso negado" sem buscar dados.
   - Novas rotas públicas: `/admin/login`, `/admin/recuperar-senha`, `/admin/redefinir-senha` (trata `type=recovery`).
   - Nova rota protegida: `/admin/usuarios`.

4. **Auditoria**
   - Serviço `authAuditService` gravando em `audit_logs`: `login_success`, `login_failed` (só e-mail e motivo genérico), `logout`, `role_changed`, `user_invited`, `user_deactivated`. Nunca senha, token ou refresh token.

5. **Validação antes de concluir**
   - Build e typecheck limpos.
   - Testes de navegador: entrada válida/inválida, sair, atualizar a página com sessão ativa, sessão expirada, acesso sem sessão, e cada papel tentando abrir áreas permitidas e proibidas (editor em leads, comercial em configurações, marketing em leads, usuário sem papel).
   - Teste direto no banco com chave anônima: leitura de `leads`, `contacts`, `audit_logs`, `profiles` e `user_roles` deve ser negada.

## Fora do escopo desta etapa

Nada de migração de Leads, Contatos, Projetos ou BI aqui. Só depois que a autenticação e o bloqueio de dados estiverem comprovados.
