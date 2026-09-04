# Corrigir "Serviço de autenticação indisponível" no login do Admin

## Causa raiz (confirmada)

O site publicado é montado **sem os dados de conexão** com o Supabase.

- No ambiente de desenvolvimento os valores existem num arquivo local (`.env`) e o login funciona.
- Esse arquivo é intencionalmente excluído do repositório, então a versão publicada é gerada sem eles.
- Baixei o arquivo do site no ar (`onesignal26.lovable.app`) e confirmei: no lugar do endereço real do Supabase estão os valores inertes de segurança (`supabase.invalid` / `missing-publishable-key`) — o endereço real não aparece nenhuma vez.
- Com esses valores inertes, o app marca a autenticação como "não configurada" e o login devolve exatamente a frase "Serviço de autenticação indisponível no momento." antes de tentar qualquer conexão.

Verifiquei também que o serviço de autenticação do Supabase está no ar e respondendo normalmente com as credenciais corretas (uma tentativa de login com conta inexistente devolveu "credenciais inválidas", como esperado). Ou seja: o problema é só de configuração no build publicado, não do Supabase.

## O que será feito

1. **Conexão sempre disponível na versão publicada**
   O endereço do projeto e a chave pública (a mesma que já viaja no navegador e é protegida pelas regras de acesso do banco) passam a ter um valor padrão no próprio código do cliente, usado só quando a configuração de ambiente não estiver presente. Nenhuma chave privilegiada entra no frontend — a chave de serviço continua exclusiva do servidor.

2. **Mensagens de erro distintas** (hoje tudo cai na mesma frase genérica):
   - configuração ausente → aviso técnico de configuração;
   - falha de rede/serviço fora do ar → "não foi possível conectar, tente novamente";
   - e-mail ou senha errados → "E-mail ou senha inválidos.";
   - conta válida sem papel/desativada → "Usuário autenticado, mas ainda não possui autorização para acessar o painel."

3. **Uma única fonte de verdade**
   Auditoria confirmou que já não existe login de demonstração, senha padrão nem token fictício: `authService` já é uma fachada real sobre o Supabase Auth. Ele permanece como fachada única (login, logout, recuperação de senha, perfil e papel), com estados explícitos `loading | authenticated | unauthenticated | error` e um único ouvinte de sessão com limpeza correta.

4. **Área administrativa durante o carregamento**
   Enquanto a sessão é verificada, o Admin mostra "Verificando sessão..." — nunca joga direto para a tela de login. Sem sessão → login; com sessão sem permissão → acesso negado; com permissão → painel.

5. **Recuperação de senha e saída** continuam pelo Supabase Auth (link por e-mail e `signOut` real), sem senha temporária e sem mecanismo paralelo.

## Verificação antes de concluir

- Build limpo e verificação de tipos.
- Conferir no arquivo gerado que o endereço real do Supabase está presente.
- Testes no navegador: site público carrega; `/admin/login` abre; senha incorreta; usuário inexistente; acesso direto a `/admin` sem sessão; recarregar a página; sair.
- Testes com conta real (login válido, papéis editor/comercial/marketing/admin, usuário sem papel) dependem de credenciais suas — este projeto usa um Supabase externo e não há sessão de teste aqui. Se quiser, me passe um e-mail de teste que eu valido; caso contrário, informo o que ficou por validar.

## Arquivos previstos

- `src/integrations/supabase/client.ts` — valores padrão públicos da conexão.
- `src/services/authService.ts` — estados e mensagens de erro diferenciadas.
- `src/components/admin/AdminLogin.tsx` — exibição das novas mensagens.
- `src/App.tsx` — estado "Verificando sessão..." nas rotas administrativas.

## Fora do escopo

Nenhuma mudança visual no site público, nenhuma funcionalidade nova, nenhuma alteração de banco além de conferir as regras de acesso já existentes.
