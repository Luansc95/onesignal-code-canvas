# Recuperação: site público em branco após a migração de autenticação

## Diagnóstico (já verificado agora)

- No ambiente de desenvolvimento o site público carrega normalmente (todas as seções renderizam, sem erros no console) e a tela `/admin/login` também aparece. O build atual está OK.
- No site publicado (onesignal26.lovable.app) **nada aparece**: a página fica totalmente vazia e o navegador registra o erro `supabaseUrl is required.` em `/`, `/admin/login` e `/admin`.

**Causa raiz:** a conexão com o Supabase é criada logo no arranque da aplicação, antes de qualquer tela ser desenhada. Na versão publicada as credenciais públicas do Supabase não estavam presentes, então essa criação falhou e derrubou a página inteira — inclusive o site público, que nem precisa dessa conexão para aparecer. As credenciais estão presentes hoje no ambiente do projeto; a versão no ar foi gerada sem elas.

## Correção proposta (mínima, sem mudança visual)

1. **Tornar o arranque à prova de falha**
   - Em `src/integrations/supabase/client.ts`: se as credenciais estiverem ausentes, não deixar a aplicação quebrar. A conexão passa a ser criada de forma protegida; sem credenciais, qualquer chamada devolve um erro tratado em vez de interromper o carregamento.
   - Em `src/services/authService.ts`: proteger a verificação de sessão e o ouvinte de login com tratamento de erro, marcando "sem sessão" em vez de propagar exceção.
   - Nada de credenciais fixas no código; continuamos usando apenas as chaves públicas do ambiente. A chave de serviço não entra no frontend.

2. **Isolar o site público**
   - Garantir que o código de autenticação só é acionado quando o endereço começa com `/admin` (hoje o `App` já separa as áreas; a verificação de sessão passa a ficar restrita à área administrativa).

3. **Republicar com as credenciais corretas**
   - Confirmar as três variáveis do Supabase no ambiente e publicar de novo, para que a versão no ar deixe de ficar em branco.

## Validação

- Build e verificação de tipos sem erros.
- Teste no navegador (ambiente de desenvolvimento e, após publicar, no site no ar):
  1. página inicial e as seções serviços, projetos, diagnóstico e contato;
  2. site público continua carregando mesmo com as credenciais do Supabase ausentes (simulação);
  3. `/admin/login` sem sessão;
  4. entrada com conta válida;
  5. atualizar a página com sessão ativa;
  6. sair da conta;
  7. tentar abrir `/admin` sem sessão — deve continuar bloqueado.

## Relatório final

Ao terminar, informo: causa raiz, arquivos alterados, correção aplicada, resultado do build e resultado de cada teste.

## Fora de escopo

Nenhuma funcionalidade nova, nenhuma mudança visual, nenhuma reversão da migração de autenticação.
