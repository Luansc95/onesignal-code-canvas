# OneSignal — Área Administrativa com dados reais

Migrar a aplicação de "frontend + localStorage + seeds" para "frontend + Lovable Cloud (Supabase) + banco persistente + autenticação real + storage", sem recriar o projeto e sem alterar o site público visualmente.

## Auditoria da situação atual

Camada de serviços (tudo em `localStorage`, com dados de demonstração):

- `src/services/leadService.ts` (522 linhas) — validação, atribuição UTM, algoritmo determinístico de Lead Scoring (6 fatores, 0–100, prioridade alta/média/baixa), atividades e pipeline. **A lógica de scoring será preservada integralmente.**
- `src/services/contactService.ts` — contatos + conversão em Lead; possui `getSeedContacts()`.
- `src/services/projectService.ts` — CRUD, duplicar, publicar/despublicar, slug, contador de views; semeado a partir de `src/data/projectsData.ts`.
- `src/services/analyticsService.ts` — eventos em localStorage, `generateRealisticHistoricalEvents()` (180 eventos falsos), KPIs com números fallback (`|| 1420`, `|| 28`…) e fontes de tráfego fixas.
- `src/services/adminService.ts` — settings, notificações, audit logs e campanhas, todos com seeds.
- `src/services/authService.ts` — login simulado com `DEMO_ADMIN_USERS`, e-mails hardcoded, fallback "qualquer e-mail + senha ≥ 4 caracteres" e token fictício. **Será removido.**

Telas administrativas existentes (`src/components/admin/*`, ~4.000 linhas) serão mantidas; muda apenas a fonte de dados (services → Cloud).

## Modelo de dados

Tabelas no banco: `profiles`, `user_roles`, `projects`, `project_images`, `leads`, `lead_activities`, `contacts`, `diagnostics`, `diagnostic_answers`, `analytics_events`, `campaigns`, `notifications`, `audit_logs`, `company_settings`. Usuários vêm de `auth.users` (não duplicar).

Papéis em tabela separada (`user_roles` + enum `admin | editor | commercial | marketing`) com função `has_role()` security definer — nunca no perfil.

RLS por tabela:
- Inserção pública (visitante anônimo): `leads`, `contacts`, `diagnostics`, `diagnostic_answers`, `analytics_events` — apenas INSERT, sem SELECT.
- Leitura pública: `projects` publicados e suas imagens.
- Todo o restante: somente usuários autenticados com o papel adequado.
- GRANTs explícitos por tabela em cada migração.

Storage: bucket público `project-images` (leitura pública, escrita restrita a admin/editor), com validação de tipo e tamanho no upload.

## Etapas de implementação

1. **Backend base** — habilitar Cloud, migração com enums, tabelas, índices (por data/status/evento), GRANTs, RLS, `has_role()`, trigger de criação de `profiles`, bucket de storage.
2. **Autenticação real** — remover `authService.ts` e a tela demo; nova `/admin/login` com Supabase Auth (e-mail/senha), sessão persistente, `ProtectedRoute` com verificação de papel, logout real. Primeiro administrador criado de forma segura via backend (cadastro do owner + atribuição do papel `admin`), sem contas fictícias.
3. **Leads** — reescrever a persistência de `leadService` para o banco preservando validação, UTM e scoring; fluxo formulário → lead → score → atividade → evento de analytics → notificação. `/admin/leads` com filtros/busca/paginação server-side, mudança de status, prioridade, observações, histórico, arquivamento e realtime.
4. **Contatos** — `contactService` no banco, conversão em Lead sem duplicar (checagem por e-mail/WhatsApp), realtime.
5. **Projetos e Storage** — CRUD no banco, upload de capa e galeria em Storage, publicar/despublicar/arquivar; site público lê apenas publicados.
6. **Diagnóstico** — persistir diagnóstico, respostas, resultado e soluções recomendadas; vincular ao Lead quando houver captura de contato.
7. **Analytics real** — remover `generateRealisticHistoricalEvents()`, seeds e fallbacks; identificação anônima de visitante/sessão (UUID em cookie/sessionStorage, sem PII); persistir todos os eventos listados com UTM, referrer, landing page e metadata.
8. **BI, funil e origem** — dashboard alimentado por funções de agregação SQL por período (hoje, 7d, 30d, mês, personalizado); funil visitantes → interações → diagnóstico/formulário → lead → contato → negociação → conversão; relatório de origem (UTM/referrer → visitantes → leads → conversões). Taxas só quando houver dados.
9. **Marketing, notificações, auditoria e configurações** — campanhas com gerador de URL UTM, notificações reais de novo Lead (nome, empresa, serviço, prioridade, score, origem), audit logs de ações administrativas, `company_settings` centralizando contatos/SEO (Instagram oficial `@onesignal_tech`).
10. **Limpeza e estados vazios** — remover todos os seeds e números fallback; mensagens como "Você ainda não possui Leads." e "Não há dados suficientes para este relatório."
11. **Validação** — build + TypeScript, e teste do fluxo ponta a ponta (envio público → banco → admin → score → atividade → evento → notificação → mudança de status), projeto rascunho invisível no site, acesso negado sem permissão, logout e refresh de sessão.

## Notas técnicas

- Estrutura preservada: `src/components`, `src/services`, `src/data`, `src/config`, `src/lib`, `src/types.ts`. Os services continuam sendo a fachada — mudam de síncronos (localStorage) para assíncronos (Cloud); os componentes admin passam a tratar estados de loading/erro/vazio.
- Realtime via subscriptions do Supabase em leads, contatos e notificações; demais telas usam refetch por filtro.
- Nenhuma consulta traz todos os registros: paginação, filtros e agregações no servidor.
- Migração incremental: cada etapa é entregue funcionando, sem quebrar o site público.
