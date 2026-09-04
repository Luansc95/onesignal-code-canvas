/**
 * Constantes de aplicação da OneSignal.
 * ATENÇÃO: dados administráveis (telefone, WhatsApp, e-mail, endereço, horário,
 * redes sociais, SEO) NÃO moram mais aqui — a fonte de verdade é a tabela
 * `company_settings`, acessada via `companySettingsService`.
 * Os valores abaixo servem apenas como fallback seguro de tipagem/build.
 */

import { companySettingsService } from '../services/companySettingsService';


export interface CommercialConfig {
  companyName: string;
  tradingName: string;
  commercialEmail: string;
  supportEmail: string;
  phoneDisplay: string;
  rawWhatsappNumber: string; // international format without symbols (e.g. 5511999999999)
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  businessHours: string;
  social: {
    linkedin: string;
    instagram: string;
    github?: string;
  };
}

export const COMMERCIAL_CONFIG: CommercialConfig = {
  companyName: 'OneSignal Soluções Tecnológicas Ltda.',
  tradingName: 'OneSignal Soluções Tecnológicas Ltda',
  commercialEmail: 'onesignal@outlook.com.br',
  supportEmail: 'onesignal@outlook.com.br',
  phoneDisplay: '',
  rawWhatsappNumber: '',
  address: {
    street: 'Rua Moreira dos Santos, 52 - Centro',
    city: 'Barra do Piraí',
    state: 'RJ',
    country: 'Brasil'
  },
  businessHours: 'Segunda a Sexta: 08:30 às 18:30 (Sistemas em Nuvem 24/7)',
  social: {
    linkedin: '',
    instagram: 'https://www.instagram.com/onesignal_tech/'

  }
};

export type WhatsAppContext = 
  | 'general' 
  | 'consultative' 
  | 'service' 
  | 'project_case' 
  | 'budget_request' 
  | 'estimator_result'
  | 'diagnostic_result';

export interface WhatsAppContextDetails {
  clientName?: string;
  companyName?: string;
  serviceTitle?: string;
  projectName?: string;
  budgetEstimated?: string;
  digitalMaturity?: string;
  topSolution?: string;
  customMessage?: string;
}

/**
 * Generates contextual WhatsApp redirection URLs with professional prefilled copy.
 * O número vem SEMPRE das configurações persistentes (company_settings).
 * Retorna null quando o número ainda não foi configurado — nesse caso o canal
 * deve ser ocultado no site.
 */
export function getWhatsAppUrl(
  context: WhatsAppContext = 'general',
  details?: WhatsAppContextDetails
): string | null {
  let message = 'Olá OneSignal! Gostaria de conversar sobre uma solução tecnológica para minha empresa.';


  switch (context) {
    case 'consultative':
      message = details?.clientName
        ? `Olá OneSignal! Me chamo ${details.clientName}${details.companyName ? ` da ${details.companyName}` : ''}. Gostaria de agendar uma conversa consultiva para entender a melhor solução tecnológica para nosso desafio.`
        : 'Olá OneSignal! Gostaria de conversar com um especialista para entender qual a melhor solução tecnológica para os desafios da minha empresa.';
      break;

    case 'diagnostic_result':
      message = details?.topSolution
        ? `Olá OneSignal! Completei o Diagnóstico Inteligente no site da OneSignal (Maturidade: ${details.digitalMaturity || 'Em evolução'}). O resultado indicou foco em ${details.topSolution}. Gostaria de conversar com um especialista para entender os próximos passos.`
        : 'Olá OneSignal! Realizei o Diagnóstico de Tecnologia no site e gostaria de conversar sobre as oportunidades identificadas para minha empresa.';
      break;

    case 'service':
      message = details?.serviceTitle
        ? `Olá OneSignal! Gostaria de saber mais sobre ${details.serviceTitle} e como vocês podem aplicar essa tecnologia no meu negócio.`
        : 'Olá OneSignal! Gostaria de mais detalhes sobre os serviços de desenvolvimento sob medida.';
      break;

    case 'project_case':
      message = details?.projectName
        ? `Olá OneSignal! Vi o case "${details.projectName}" no portfólio de vocês e gostaria de avaliar a viabilidade de desenvolver uma solução semelhante para minha empresa.`
        : 'Olá OneSignal! Vi os projetos desenvolvidos por vocês e gostaria de conversar sobre um projeto similar.';
      break;

    case 'budget_request':
      message = details?.clientName
        ? `Olá OneSignal! Me chamo ${details.clientName}${details.companyName ? ` da ${details.companyName}` : ''}. Gostaria de solicitar um orçamento para um projeto de ${details.serviceTitle || 'software sob medida'}.`
        : 'Olá OneSignal! Gostaria de solicitar uma proposta técnica e orçamento para o meu projeto.';
      break;

    case 'estimator_result':
      message = details?.budgetEstimated
        ? `Olá OneSignal! Realizei uma estimativa no simulador do site (${details.serviceTitle || 'Projeto Sob Medida'} - aprox. ${details.budgetEstimated}) e gostaria de avançar para uma proposta detalhada.`
        : 'Olá OneSignal! Utilizei o simulador de orçamento no site e gostaria de detalhar meu escopo.';
      break;

    case 'general':
    default:
      if (details?.customMessage) {
        message = details.customMessage;
      }
      break;
  }

  const encodedMessage = encodeURIComponent(message);
  const rawNumber = (companySettingsService.getSettings().rawWhatsappNumber || '').replace(/\D/g, '');
  if (!rawNumber) return null;
  return `https://wa.me/${rawNumber}?text=${encodedMessage}`;
}


/**
 * Extracts UTM parameters from the current URL if available
 */
export function getUtmParameters(): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
} {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  return {
    utmSource: urlParams.get('utm_source') || undefined,
    utmMedium: urlParams.get('utm_medium') || undefined,
    utmCampaign: urlParams.get('utm_campaign') || undefined,
    referrer: document.referrer || undefined
  };
}
