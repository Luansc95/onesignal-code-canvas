/**
 * OneSignal Intelligent Diagnosis Engine
 * 
 * Deterministic, rule-based reasoning engine that evaluates business profile,
 * operational bottlenecks, and digital maturity to provide actionable initial recommendations.
 * 
 * Note: Clearly presented as a rule-based initial assessment, avoiding false AI claims.
 */

import {
  DiagnosticAnswers,
  DiagnosticResultData,
  DigitalMaturityLevel,
  IdentifiedOpportunity,
  RecommendedSolution
} from '../types';

export class DiagnosticEngine {
  /**
   * Calculates the digital maturity score (0 - 100) based on operational indicators
   */
  private static calculateScore(answers: DiagnosticAnswers): number {
    let score = 0;
    let maxPossible = 0;

    // Info control method
    maxPossible += 25;
    if (answers.infoControl === 'sistema_centralizado') score += 25;
    else if (answers.infoControl === 'sistemas_desconectados') score += 15;
    else if (answers.infoControl === 'planilhas') score += 8;
    else if (answers.infoControl === 'anotacoes_manuais') score += 2;
    else score += 10;

    // Manual processes proportion
    maxPossible += 25;
    if (answers.manualProcessesLevel === 'pouco') score += 25;
    else if (answers.manualProcessesLevel === 'moderado') score += 18;
    else if (answers.manualProcessesLevel === 'muito') score += 10;
    else if (answers.manualProcessesLevel === 'maior_parte') score += 4;
    else score += 12;

    // Indicators status
    maxPossible += 20;
    if (answers.indicatorsStatus === 'tempo_real') score += 20;
    else if (answers.indicatorsStatus === 'manualmente') score += 14;
    else if (answers.indicatorsStatus === 'poucos') score += 8;
    else if (answers.indicatorsStatus === 'nao_possuimos') score += 3;
    else score += 10;

    // Systems integration
    maxPossible += 15;
    if (answers.systemsIntegrated === 'sim') score += 15;
    else if (answers.systemsIntegrated === 'parcialmente') score += 9;
    else if (answers.systemsIntegrated === 'nao') score += 3;
    else score += 8;

    // Info accessibility
    maxPossible += 15;
    if (answers.infoAccessEase === 'sim') score += 15;
    else if (answers.infoAccessEase === 'parcialmente') score += 9;
    else if (answers.infoAccessEase === 'nao') score += 3;
    else score += 8;

    const normalized = Math.round((score / maxPossible) * 100);
    return Math.min(100, Math.max(10, normalized));
  }

  /**
   * Translates numerical score into constructive maturity tier
   */
  private static determineMaturityLevel(score: number): {
    level: DigitalMaturityLevel;
    explanation: string;
  } {
    if (score >= 80) {
      return {
        level: 'Avançada',
        explanation: 'Sua empresa já possui processos bem digitalizados e está no momento ideal para inovações de alto impacto, arquiteturas escaláveis em nuvem e novos produtos digitais.'
      };
    } else if (score >= 60) {
      return {
        level: 'Estruturada',
        explanation: 'Sua operação possui uma base consolidada de tecnologia. O maior ganho agora reside em integrar ferramentas isoladas, automatizar tarefas manuais restantes e criar dashboards consolidados.'
      };
    } else if (score >= 35) {
      return {
        level: 'Em evolução',
        explanation: 'Sua empresa já utiliza ferramentas digitais no dia a dia, mas ainda convive com silos de informação, retrabalho e uso excessivo de planilhas que limitam a escala.'
      };
    } else {
      return {
        level: 'Em desenvolvimento',
        explanation: 'Sua empresa possui um potencial expressivo de ganho rápido. A substituição de rotinas manuais por sistemas web centralizados traz melhoria imediata em controle e produtividade.'
      };
    }
  }

  /**
   * Identifies primary bottleneck and opportunity pillars based on answers
   */
  private static identifyOpportunities(answers: DiagnosticAnswers): IdentifiedOpportunity[] {
    const opportunities: IdentifiedOpportunity[] = [];
    const challenges = answers.challenges || [];
    const objectives = answers.objectives || [];

    // 1. Process Automation
    if (
      challenges.includes('processos_manuais') ||
      challenges.includes('processos_lentos') ||
      answers.manualProcessesLevel === 'muito' ||
      answers.manualProcessesLevel === 'maior_parte' ||
      answers.repetitiveTasksAutomable === 'muitas' ||
      objectives.includes('automatizar_tarefas') ||
      objectives.includes('produtividade')
    ) {
      opportunities.push({
        id: 'automacao',
        icon: 'Cpu',
        title: 'Automação de Processos & Redução de Retrabalho',
        description: 'Mapeamento e automação de tarefas repetitivas para liberar sua equipe de rotinas manuais e acelerar o tempo de resposta do negócio.'
      });
    }

    // 2. Centralized System / Data Organisation
    if (
      challenges.includes('organizacao_informacoes') ||
      challenges.includes('excesso_planilhas') ||
      answers.infoControl === 'planilhas' ||
      answers.infoControl === 'anotacoes_manuais' ||
      objectives.includes('melhorar_controle') ||
      objectives.includes('reduzir_erros')
    ) {
      opportunities.push({
        id: 'centralizacao',
        icon: 'Layers',
        title: 'Centralização de Informações & Segurança',
        description: 'Substituição de planilhas dispersas por um sistema web centralizado, com permissões de acesso granulares e dados sempre disponíveis.'
      });
    }

    // 3. Dashboards & Real-time Indicators
    if (
      challenges.includes('falta_indicadores') ||
      answers.indicatorsStatus === 'nao_possuimos' ||
      answers.indicatorsStatus === 'poucos' ||
      objectives.includes('melhores_relatorios')
    ) {
      opportunities.push({
        id: 'indicadores',
        icon: 'BarChart3',
        title: 'Indicadores e Dashboards em Tempo Real',
        description: 'Criação de painéis visuais para transformar dados operacionais em métricas estratégicas para tomada de decisão ágil.'
      });
    }

    // 4. Systems Integration
    if (
      challenges.includes('falta_integracao') ||
      answers.systemsIntegrated === 'nao' ||
      answers.infoControl === 'sistemas_desconectados' ||
      objectives.includes('modernizar_processos')
    ) {
      opportunities.push({
        id: 'integracao',
        icon: 'Workflow',
        title: 'Integração de Sistemas & Conexão de APIs',
        description: 'Conexão direta entre ferramentas e bancos de dados para eliminar a digitação duplicada e sincronizar informações em tempo real.'
      });
    }

    // 5. CRM & Customer Experience
    if (
      challenges.includes('gestao_clientes') ||
      objectives.includes('melhorar_atendimento')
    ) {
      opportunities.push({
        id: 'crm',
        icon: 'Users',
        title: 'Gestão de Clientes & CRM Personalizado',
        description: 'Organização de funil comercial, histórico unificado de interações e automação de follow-ups para reter e converter mais clientes.'
      });
    }

    // 6. Mobile Application / Field Operations
    if (
      challenges.includes('necessidade_app') ||
      challenges.includes('gestao_equipes') ||
      objectives.includes('novo_produto_digital')
    ) {
      opportunities.push({
        id: 'mobile',
        icon: 'Smartphone',
        title: 'Mobilidade & Aplicativos para Campo ou Clientes',
        description: 'Desenvolvimento de aplicativo móvel para permitir acesso seguro a funcionalidades essenciais em qualquer lugar, mesmo offline.'
      });
    }

    // Fallback if none matched: ensure at least 2 relevant opportunities
    if (opportunities.length === 0) {
      opportunities.push({
        id: 'modernizacao',
        icon: 'Sparkles',
        title: 'Modernização de Plataforma Tecnológica',
        description: 'Criação de soluções em nuvem sob medida para conferir velocidade, robustez e segurança à operação da empresa.'
      });
      opportunities.push({
        id: 'automacao',
        icon: 'Cpu',
        title: 'Automação de Rotinas Operacionais',
        description: 'Eliminação de tarefas manuais para ganho escalável de produtividade da equipe.'
      });
    }

    // Limit to top 3 opportunities to prevent cognitive overload
    return opportunities.slice(0, 3);
  }

  /**
   * Generates 1 to 3 targeted, contextual recommended solutions from OneSignal
   */
  private static recommendSolutions(answers: DiagnosticAnswers): RecommendedSolution[] {
    const solutions: RecommendedSolution[] = [];
    const challenges = answers.challenges || [];
    const objectives = answers.objectives || [];

    // Rule 1: Management System / Centralized Platform
    if (
      challenges.includes('excesso_planilhas') ||
      challenges.includes('organizacao_informacoes') ||
      challenges.includes('gestao_equipes') ||
      answers.infoControl === 'planilhas' ||
      objectives.includes('melhorar_controle') ||
      objectives.includes('reduzir_erros')
    ) {
      solutions.push({
        id: 'sol_sistema_gestao',
        icon: 'LayoutGrid',
        title: 'Sistema de Gestão Web Sob Medida',
        category: 'Sistemas Web',
        description: 'Uma plataforma web exclusiva com painéis administrativos, controle de acesso e regras de negócio adaptadas exatamente à sua operação.',
        problemSolved: 'Elimina o caos de planilhas desatualizadas e unifica o fluxo de informações em um ambiente seguro na nuvem.',
        potentialBenefit: 'Redução drástica de erros operacionais e visibilidade integral das atividades em tempo real.',
        serviceId: 'sistemas-web'
      });
    }

    // Rule 2: Process Automation & RPA
    if (
      challenges.includes('processos_manuais') ||
      challenges.includes('processos_lentos') ||
      answers.manualProcessesLevel === 'muito' ||
      answers.manualProcessesLevel === 'maior_parte' ||
      objectives.includes('automatizar_tarefas') ||
      objectives.includes('produtividade')
    ) {
      solutions.push({
        id: 'sol_automacao',
        icon: 'Cpu',
        title: 'Automação de Processos & Fluxos Digitais',
        category: 'Automação & RPA',
        description: 'Desenvolvimento de scripts inteligentes e fluxos automatizados que executam tarefas repetitivas 24 horas por dia sem falhas.',
        problemSolved: 'Libera dezenas de horas mensais da equipe que eram desperdiçadas em conferências manuais e digitação.',
        potentialBenefit: 'Mais agilidade no atendimento e ganho imediato de eficiência operacional sem aumento de custos fixos.',
        serviceId: 'automacao-processos'
      });
    }

    // Rule 3: Mobile Application
    if (
      challenges.includes('necessidade_app') ||
      objectives.includes('novo_produto_digital') ||
      challenges.includes('gestao_equipes')
    ) {
      solutions.push({
        id: 'sol_mobile',
        icon: 'Smartphone',
        title: 'Aplicativo Mobile Nativo/Híbrido',
        category: 'Apps Mobile',
        description: 'Aplicativo rápido e intuitivo para iOS e Android, com suporte offline, notificações push e integração total com o backend.',
        problemSolved: 'Resolve a necessidade de atuação em campo, agilidade para equipes externas ou contato direto com clientes finais.',
        potentialBenefit: 'Experiência moderna para usuários e comunicação instantânea onde quer que estejam.',
        serviceId: 'apps-mobile'
      });
    }

    // Rule 4: System Integration & APIs
    if (
      challenges.includes('falta_integracao') ||
      answers.systemsIntegrated === 'nao' ||
      answers.infoControl === 'sistemas_desconectados'
    ) {
      if (solutions.length < 3) {
        solutions.push({
          id: 'sol_integracao',
          icon: 'Workflow',
          title: 'Integração de Sistemas & Arquitetura de APIs',
          category: 'Integração & Nuvem',
          description: 'Construção de conectores e APIs seguras para fazer seus diferentes softwares conversarem entre si automaticamente.',
          problemSolved: 'Acaba com a digitação duplicada e silos de dados entre vendas, estoque, financeiro e suporte.',
          potentialBenefit: 'Dados consistentes e sincronizados em toda a empresa sem esforço manual.',
          serviceId: 'sistemas-web'
        });
      }
    }

    // Rule 5: CRM & Customer Experience
    if (
      challenges.includes('gestao_clientes') ||
      objectives.includes('melhorar_atendimento')
    ) {
      if (solutions.length < 3) {
        solutions.push({
          id: 'sol_crm',
          icon: 'Users',
          title: 'Portal de Clientes & CRM Personalizado',
          category: 'Sistemas Web / CRM',
          description: 'Ambiente exclusivo para gestão de leads, acompanhamento de projetos e autoatendimento do cliente.',
          problemSolved: 'Previne a perda de oportunidades comerciais e padroniza a régua de comunicação com clientes.',
          potentialBenefit: 'Aumento na taxa de conversão e retenção com experiência moderna para o cliente.',
          serviceId: 'sistemas-web'
        });
      }
    }

    // Fallback: Ensure 1 to 3 solutions
    if (solutions.length === 0) {
      solutions.push({
        id: 'sol_sistema_gestao',
        icon: 'LayoutGrid',
        title: 'Sistema Web & Automação Sob Medida',
        category: 'Sistemas Web',
        description: 'Desenvolvimento de uma solução personalizada para estruturar as rotinas da sua empresa.',
        problemSolved: 'Resolve gargalos operacionais e centraliza processos.',
        potentialBenefit: 'Maior controle e escalabilidade para o negócio.',
        serviceId: 'sistemas-web'
      });
    }

    return solutions.slice(0, 3);
  }

  /**
   * Generates a coherent diagnostic summary narrative
   */
  private static generateSummary(
    maturityLevel: DigitalMaturityLevel,
    opportunities: IdentifiedOpportunity[],
    recommendedSolutions: RecommendedSolution[],
    answers: DiagnosticAnswers
  ): string {
    const companyProfile = answers.companySize 
      ? `Para o perfil de sua empresa${answers.industry && answers.industry !== 'outro' ? ` no setor de ${answers.industry}` : ''}, ` 
      : 'Para o cenário informado, ';

    return `${companyProfile}identificamos que o seu estágio de maturidade digital é classificado como "${maturityLevel}". Suas principais oportunidades de avanço concentram-se em ${opportunities.map(o => o.title).join(', ')}. A implementação de soluções estruturadas como ${recommendedSolutions.map(s => s.title).join(' ou ')} proporcionará maior controle e agilidade operacional.`;
  }

  /**
   * Main entrypoint to process complete diagnostic answers and return structured result
   */
  public static evaluate(answers: DiagnosticAnswers): DiagnosticResultData {
    const score = this.calculateScore(answers);
    const { level: maturityLevel, explanation: maturityExplanation } = this.determineMaturityLevel(score);
    const identifiedOpportunities = this.identifyOpportunities(answers);
    const recommendedSolutions = this.recommendSolutions(answers);
    const summaryText = this.generateSummary(maturityLevel, identifiedOpportunities, recommendedSolutions, answers);

    return {
      score,
      maturityLevel,
      maturityPercentage: score,
      maturityExplanation,
      identifiedOpportunities,
      recommendedSolutions,
      summaryText,
      answers,
      completedAt: new Date().toISOString()
    };
  }
}
