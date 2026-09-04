# Configurações do painel sincronizadas com o site

## Causa raiz

Hoje existem duas fontes independentes: o painel salva as configurações no navegador do administrador (armazenamento local), e o site público lê valores fixos escritos no código. Por isso nada do que é salvo aparece no site. A tabela `company_settings` já existe no banco, com permissão de leitura pública e escrita apenas para administradores, mas está vazia e nenhuma tela a utiliza.

## O que será feito

1. **Gravar os dados oficiais no banco** (uma única linha em `company_settings`), já com os valores reais conhecidos:
   - e-mail comercial e de suporte: onesignal@outlook.com.br
   - endereço: Rua Moreira dos Santos, 52 - Centro, Barra do Piraí - RJ
   - Instagram: https://www.instagram.com/onesignal_tech/
   - horário e textos de SEO atuais
   - telefone, WhatsApp, LinkedIn, YouTube e GitHub ficam **vazios** (os valores de hoje são fictícios) e serão preenchidos por você no painel.

2. **Painel de Configurações**: passa a carregar do banco, salvar no banco e só mostrar "salvo com sucesso" depois da confirmação do banco; erro real é exibido caso falhe. Cada alteração gera registro de auditoria com os campos modificados (antes/depois), sem dados sensíveis.

3. **Site público**: um serviço central de configurações carrega os dados uma vez no início e os distribui para as telas. Enquanto carrega, o site aparece normalmente; se a consulta falhar, usa os valores padrão de segurança — o site nunca deixa de abrir.

4. **Telas atualizadas** para consumir o banco, mantendo o visual idêntico (inclusive o card "Canais de Atendimento OneSignal"): rodapé, seção de contato, contato flutuante, modal de orçamento, modal de projeto, resultado do diagnóstico, calculadora de automação, seção final de CTA, serviços e política de privacidade.

5. **Canais sem valor configurado ficam ocultos**: se WhatsApp, telefone, LinkedIn, YouTube ou GitHub estiverem vazios, o botão/linha simplesmente não aparece — nenhum número ou link fictício é exibido.

6. **SEO**: título e descrição salvos no painel passam a ser aplicados como padrão do site; títulos próprios de páginas específicas continuam prevalecendo.

7. **Multi-dispositivo**: como tudo vem do banco, salvar no computador A já reflete no computador B; nada depende mais do armazenamento local.

## Detalhes técnicos

- `company_settings` já possui as políticas necessárias (`company_settings_public_read` para anônimo, `company_settings_admin_manage` para administradores). Será inserida a linha única (`singleton`) via operação de dados — sem mudança de estrutura.
- Novo `src/services/companySettingsService.ts`: busca, cache em memória com invalidação após salvar, `subscribe` para atualização imediata, mapeamento snake_case ↔ camelCase.
- Novo `src/hooks/useCompanySettings.ts` + provedor de contexto em `src/App.tsx` com estados carregando/carregado/erro.
- `getWhatsAppUrl()` em `src/config/commercialConfig.ts` passa a usar o número persistente (retorna `null` quando não configurado, para ocultar o canal); `COMMERCIAL_CONFIG` fica apenas como valor padrão de segurança.
- `adminService.getSettings/updateSettings` passam a operar sobre o banco (assíncronos) e chamam `audit_admin_action` com os campos alterados.
- Validação final: verificação de tipos, build, teste do painel (salvar/recarregar/persistir) e do site público para WhatsApp, e-mail, endereço, horário, Instagram, LinkedIn e SEO.

## Pendência sua

Depois de aplicado, cadastre no painel o telefone, o WhatsApp e o LinkedIn reais — até lá esses canais ficarão ocultos no site.
