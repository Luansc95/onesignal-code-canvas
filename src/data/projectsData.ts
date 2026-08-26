import { Project } from '../types';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'sistema-gestao-empresarial',
    name: 'Sistema de Gestão Empresarial (Nexus ERP)',
    tagline: 'Controle unificado de processos, equipes, estoque e KPIs em tempo real',
    category: 'management',
    categoryLabel: 'Sistemas de Gestão',
    shortDescription: 'Sistema completo para gerenciamento de processos, colaboradores, estoque e indicadores estratégicos.',
    challenge: 'A empresa operava com dados descentralizados em planilhas manuais e softwares desconexos, resultando em retrabalho operacional, atrasos em relatórios executivos e divergências contínuas no inventário.',
    solution: 'Desenvolvemos uma plataforma web corporativa sob medida com arquitetura modular em nuvem, integrando departamentos de compras, estoque, vendas e RH com automação de rotinas e geração de dashboards em tempo real.',
    features: [
      {
        title: 'Módulo Operacional e Estoque',
        description: 'Controle de entrada e saída por código de barras/RFID com ponto de reposição automático.'
      },
      {
        title: 'Gestão de Equipes e Produtividade',
        description: 'Distribuição de tarefas, apontamento de horas e cálculo de produtividade individual e setorial.'
      },
      {
        title: 'Dashboards Executivos em Tempo Real',
        description: 'Painéis interativos com métricas de desempenho (KPIs), margem de contribuição e SLA.'
      },
      {
        title: 'Emissão e Automação Fiscal',
        description: 'Integração direta com APIs fiscais para emissão automática de notas e conciliação tributária.'
      }
    ],
    technologies: ['Web', 'Dashboard', 'Automação', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
    results: [
      { metric: '+85%', label: 'Aumento na velocidade de fechamento mensal' },
      { metric: '-92%', label: 'Redução de divergências em estoque' },
      { metric: '100%', label: 'Centralização de dados em nuvem segura' }
    ],
    imagePlaceholderType: 'dashboard',
    accentColor: '#22D3EE',
    clientType: 'Indústria e Distribuição',
    clientName: 'Grupo Industrial Nexus',
    year: '2025',
    projectType: 'real',
    featured: true,
    status: 'completed',
    isDemo: false
  },
  {
    id: 'sistema-monitoramento-industrial',
    name: 'Sistema de Monitoramento Industrial (IoT Pulse)',
    tagline: 'Telemetria industrial e manutenção preditiva com alertas em tempo real',
    category: 'automation',
    categoryLabel: 'Automação & IoT',
    shortDescription: 'Plataforma para monitoramento de equipamentos, sensores e processos industriais em tempo real.',
    challenge: 'Falta de visibilidade instantânea sobre a temperatura, vibração e consumo energético do maquinário fabril, ocasionando paradas inesperadas de produção com alto prejuízo financeiro.',
    solution: 'Construção de uma arquitetura SCADA Web conectada a sensores IoT via protocolo MQTT/WebSockets, com motor de regras inteligentes que dispara alertas preventivos no WhatsApp e painel de controle central.',
    features: [
      {
        title: 'Telemetria em Alta Frequência',
        description: 'Coleta e renderização de dados de centenas de sensores a cada 500ms sem travamento.'
      },
      {
        title: 'Motor de Alertas Preditivos',
        description: 'Detecção de anomalias térmicas e vibratórias antes da ocorrência de falhas mecânicas.'
      },
      {
        title: 'Visão Espacial da Planta Fabril',
        description: 'Mapeamento 2D/3D interativo do chão de fábrica com status visual de cada máquina.'
      },
      {
        title: 'Histórico e Relatórios de Eficiência OEE',
        description: 'Cálculo automático do índice de Eficiência Global dos Equipamentos para auditorias.'
      }
    ],
    technologies: ['IoT', 'Dashboard', 'Alertas', 'WebSockets', 'Python', 'TimescaleDB', 'TailwindCSS'],
    results: [
      { metric: '-47%', label: 'Queda em paradas não programadas' },
      { metric: '< 2s', label: 'Latência de disparo de alertas de perigo' },
      { metric: '+38%', label: 'Economia em custos de manutenção corretiva' }
    ],
    imagePlaceholderType: 'iot',
    accentColor: '#2DD4BF',
    clientType: 'Parque Industrial Metalmecânico',
    clientName: 'Planta Metalúrgica Pulse',
    year: '2025',
    projectType: 'real',
    featured: true,
    status: 'completed',
    isDemo: false
  },
  {
    id: 'crm-gestao-clientes',
    name: 'CRM e Gestão de Clientes (OmniLead)',
    tagline: 'Funil de vendas automatizado com integração direta ao WhatsApp e IA',
    category: 'management',
    categoryLabel: 'CRM & Vendas',
    shortDescription: 'Sistema para organização de clientes, agendamentos, comunicação e acompanhamento do funil de vendas.',
    challenge: 'Perda de leads devido à lentidão no primeiro atendimento, falta de histórico unificado de conversas no WhatsApp e dificuldade dos gestores em mensurar a taxa de conversão por vendedor.',
    solution: 'Criamos um CRM multicanal sob medida com pipeline Kanban personalizável, disparo automático de mensagens personalizadas no WhatsApp e qualificação de oportunidades com IA integrada.',
    features: [
      {
        title: 'Pipeline de Vendas Inteligente (Kanban)',
        description: 'Movimentação ágil de cards com gatilhos de automação a cada mudança de estágio.'
      },
      {
        title: 'Integração Direta com WhatsApp Webhook',
        description: 'Atendimento centralizado multi-atendentes em um único número corporativo.'
      },
      {
        title: 'Agendamento e Lembretes Automáticos',
        description: 'Sincronização com Google Agenda e envio de confirmações automáticas aos clientes.'
      },
      {
        title: 'Análise Preditiva de Conversão',
        description: 'Score automático de leads para priorizar os contatos com maior probabilidade de fechamento.'
      }
    ],
    technologies: ['CRM', 'Automação', 'WhatsApp', 'Next.js', 'Node.js', 'Redis', 'TailwindCSS'],
    results: [
      { metric: '+310%', label: 'Aumento na velocidade de primeiro contato' },
      { metric: '+64%', label: 'Crescimento na taxa de conversão de leads' },
      { metric: '0', label: 'Leads perdidos por esquecimento de follow-up' }
    ],
    imagePlaceholderType: 'crm',
    accentColor: '#38BDF8',
    clientType: 'Empresa de Serviços Corporativos',
    clientName: 'OmniLead Solutions',
    year: '2025',
    projectType: 'real',
    featured: true,
    status: 'completed',
    isDemo: false
  },
  {
    id: 'plataforma-gestao-financeira',
    name: 'Plataforma de Gestão Financeira (FinFlow)',
    tagline: 'Controle de fluxo de caixa, DRE automático e conciliação bancária via Open Finance',
    category: 'web',
    categoryLabel: 'Sistemas Web',
    shortDescription: 'Sistema para controle financeiro detalhado, conciliação automática, relatórios executivos e indicadores.',
    challenge: 'Dificuldade de planejar o fluxo de caixa futuro e conciliar centenas de recebíveis diários via cartão de crédito e PIX sem erros humanos.',
    solution: 'Desenvolvimento de uma plataforma financeira web com conciliação via Open Finance / OFX, provisionamento automático de tributos e projeção preditiva de fluxo de caixa para 90 dias.',
    features: [
      {
        title: 'Conciliação Bancária com 1 Clique',
        description: 'Varredura automática de extratos e marcação inteligente de entradas e saídas.'
      },
      {
        title: 'DRE Gerencial Dinâmico',
        description: 'Demonstrativo de Resultado do Exercício com filtro por centro de custos e unidades de negócio.'
      },
      {
        title: 'Projeção de Fluxo de Caixa Futuro',
        description: 'Simulador de cenários (otimista, realista e conservador) com base em dados históricos.'
      },
      {
        title: 'Gestão de Cobranças Automáticas',
        description: 'Envio programado de notificações por e-mail e SMS antes e após o vencimento.'
      }
    ],
    technologies: ['Dashboard', 'Relatórios', 'Gestão', 'TypeScript', 'React', 'FastAPI', 'PostgreSQL'],
    results: [
      { metric: '100%', label: 'Precisão na conciliação bancária diária' },
      { metric: '-15h/sem', label: 'Horas poupadas pela equipe contábil' },
      { metric: '+99.9%', label: 'Confiabilidade em relatórios para investidores' }
    ],
    imagePlaceholderType: 'finance',
    accentColor: '#22D3EE',
    clientType: 'Holdings e Grupos Empresariais',
    clientName: 'FinFlow Group',
    year: '2025',
    projectType: 'real',
    featured: false,
    status: 'completed',
    isDemo: false
  },
  {
    id: 'app-logistica-rastreamento',
    name: 'App de Logística e Rastreamento (RouteSync)',
    tagline: 'Roteirização inteligente de frotas e comprovante digital com assinatura na tela',
    category: 'mobile',
    categoryLabel: 'Desenvolvimento Mobile',
    shortDescription: 'Aplicativo mobile moderno para frotas de entrega com roteirização em tempo real e comprovantes digitais.',
    challenge: 'Atrasos nas entregas devido a rotas ineficientes, custos excessivos com combustível e extravio frequente de comprovantes em papel assinado.',
    solution: 'Criação de um app nativo híbrido (iOS e Android) com modo offline resiliente, roteirização com otimização por tráfego e captura digital de assinatura e foto da entrega.',
    features: [
      {
        title: 'Roteirização Otimizada por IA',
        description: 'Cálculo da melhor sequência de entregas considerando janelas de horário e tráfego.'
      },
      {
        title: 'Comprovante Digital com Georreferenciamento',
        description: 'Assinatura na tela do smartphone e foto do recebedor com carimbo de data, hora e GPS.'
      },
      {
        title: 'Modo Offline Inteligente',
        description: 'Funcionamento ininterrupto mesmo em zonas sem sinal de celular com sincronização automática.'
      },
      {
        title: 'Painel do Gestor de Frotas',
        description: 'Mapa ao vivo mostrando localização exata e status de cada veículo da frota.'
      }
    ],
    technologies: ['Mobile', 'Flutter', 'Google Maps API', 'Node.js', 'PostGIS', 'WebSockets'],
    results: [
      { metric: '-28%', label: 'Redução de gastos com combustível da frota' },
      { metric: '+42%', label: 'Aumento de entregas efetuadas por motorista/dia' },
      { metric: 'Zero', label: 'Comprovantes de entrega perdidos' }
    ],
    imagePlaceholderType: 'mobile',
    accentColor: '#2DD4BF',
    clientType: 'Operador Logístico Nacional',
    clientName: 'RouteSync Logística',
    year: '2025',
    projectType: 'real',
    featured: false,
    status: 'completed',
    isDemo: false
  },
  {
    id: 'assistente-ia-automacao-cognitiva',
    name: 'Assistente de IA & Atendimento (SignalAI Enterprise)',
    tagline: 'Agente inteligente 24/7 conectado a bases de conhecimento corporativas',
    category: 'ai',
    categoryLabel: 'Inteligência Artificial',
    shortDescription: 'Solução de IA generativa com RAG para atendimento ao cliente e suporte técnico corporativo nível 1 e 2.',
    challenge: 'Sobrecarga de atendentes humanos com dúvidas repetitivas, tempo de espera elevado fora do horário comercial e inconsistência nas respostas prestadas aos clientes.',
    solution: 'Implementamos um agente de IA generativa com busca semântica (RAG) conectado à base de conhecimento da empresa, capaz de responder dúvidas complexas e abrir chamados diretamente no sistema interno.',
    features: [
      {
        title: 'Respostas Humanizadas e Precisas',
        description: 'IA treinada exclusivamente nos documentos e regras de negócio da empresa sem alucinações.'
      },
      {
        title: 'Triagem e Transbordo Humano Fluido',
        description: 'Transferência instantânea para o consultor ideal quando o caso exige intervenção humana.'
      },
      {
        title: 'Execução de Ações Autônomas',
        description: 'Capacidade de emitir 2ª via de boleto, consultar status de pedido e reagendar visitas.'
      },
      {
        title: 'Dashboard de Insights de Sentimento',
        description: 'Classificação em tempo real da satisfação dos usuários e tópicos mais demandados.'
      }
    ],
    technologies: ['Inteligência Artificial', 'LLM / RAG', 'Python', 'FastAPI', 'Embeddings', 'WhatsApp API'],
    results: [
      { metric: '78%', label: 'Dos chamados resolvidos sem intervenção humana' },
      { metric: '< 3s', label: 'Tempo médio de resposta 24 horas por dia' },
      { metric: '96%', label: 'Índice de aprovação dos clientes finais (CSAT)' }
    ],
    imagePlaceholderType: 'ai',
    accentColor: '#38BDF8',
    clientType: 'Empresas de Tecnologia & E-commerce',
    clientName: 'SignalAI Tech Labs',
    year: '2025',
    projectType: 'real',
    featured: true,
    status: 'completed',
    isDemo: false
  }
];

