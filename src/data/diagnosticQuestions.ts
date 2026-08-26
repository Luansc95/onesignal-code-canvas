export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  scoreWeight?: number;
  tags?: string[];
}

export interface DiagnosticQuestionConfig {
  id: string;
  stepNumber: number;
  stepTitle: string;
  title: string;
  subtitle?: string;
  helperText?: string;
  type: 'single' | 'multiple';
  maxSelections?: number;
  allowCustomInput?: boolean;
  customInputPlaceholder?: string;
  options: QuestionOption[];
}

export interface DiagnosticStepMeta {
  step: number;
  title: string;
  shortTitle: string;
  description: string;
}

export const DIAGNOSTIC_STEPS_META: DiagnosticStepMeta[] = [
  {
    step: 1,
    title: 'Perfil do Negócio',
    shortTitle: 'Perfil',
    description: 'Porte e segmento da sua empresa'
  },
  {
    step: 2,
    title: 'Principal Desafio',
    shortTitle: 'Desafios',
    description: 'Gargalos e dores que você quer resolver'
  },
  {
    step: 3,
    title: 'Processos e Tecnologia',
    shortTitle: 'Processos',
    description: 'Como as informações e rotinas funcionam hoje'
  },
  {
    step: 4,
    title: 'Objetivo Principal',
    shortTitle: 'Objetivos',
    description: 'O resultado que sua empresa quer alcançar'
  },
  {
    step: 5,
    title: 'Maturidade Digital',
    shortTitle: 'Maturidade',
    description: 'Nível de integração e controle de dados'
  }
];

export const COMPANY_SIZE_OPTIONS: QuestionOption[] = [
  { id: 'autonomo', label: 'Profissional autônomo', description: 'Operação individual ou consultoria', scoreWeight: 10 },
  { id: 'micro', label: 'Microempresa (ME)', description: 'Até 9 colaboradores', scoreWeight: 15 },
  { id: 'pequena', label: 'Pequena empresa (EPP)', description: '10 a 49 colaboradores', scoreWeight: 20 },
  { id: 'media', label: 'Média empresa', description: '50 a 249 colaboradores', scoreWeight: 25 },
  { id: 'grande', label: 'Grande empresa / Corporativo', description: 'Mais de 250 colaboradores', scoreWeight: 30 }
];

export const INDUSTRY_OPTIONS: QuestionOption[] = [
  { id: 'servicos', label: 'Serviços' },
  { id: 'comercio', label: 'Comércio / Varejo' },
  { id: 'industria', label: 'Indústria / Manufatura' },
  { id: 'saude', label: 'Saúde / Clínicas / Hospitais' },
  { id: 'educacao', label: 'Educação / Cursos' },
  { id: 'tecnologia', label: 'Tecnologia / Startups' },
  { id: 'seguranca', label: 'Segurança / Facilities' },
  { id: 'outro', label: 'Outro segmento' }
];

export const CHALLENGE_OPTIONS: QuestionOption[] = [
  { 
    id: 'processos_manuais', 
    label: 'Muitos processos manuais', 
    description: 'Tempo excessivo gasto em digitação, conferência ou tarefas repetitivas',
    tags: ['automacao', 'gestao']
  },
  { 
    id: 'organizacao_informacoes', 
    label: 'Falta de organização das informações', 
    description: 'Arquivos espalhados, dificuldade para encontrar históricos e dados',
    tags: ['centralizacao', 'gestao']
  },
  { 
    id: 'excesso_planilhas', 
    label: 'Uso excessivo de planilhas', 
    description: 'Planilhas lentas, desatualizadas, sem controle de versão ou segurança',
    tags: ['gestao', 'dashboards']
  },
  { 
    id: 'falta_indicadores', 
    label: 'Falta de indicadores e relatórios', 
    description: 'Decisões no escuro por falta de dashboards consolidados em tempo real',
    tags: ['dashboards', 'bi']
  },
  { 
    id: 'gestao_clientes', 
    label: 'Dificuldade na gestão de clientes', 
    description: 'Perda de follow-up, atendimento disperso e falta de funil organizado',
    tags: ['crm', 'atendimento']
  },
  { 
    id: 'gestao_equipes', 
    label: 'Dificuldade na gestão de equipes', 
    description: 'Falta de visibilidade sobre produtividade, tarefas e entregas de campo',
    tags: ['gestao', 'mobile']
  },
  { 
    id: 'processos_lentos', 
    label: 'Processos lentos ou repetitivos', 
    description: 'Gargalos operacionais que atrasam entregas e geram retrabalho',
    tags: ['automacao', 'integracao']
  },
  { 
    id: 'falta_integracao', 
    label: 'Falta de integração entre sistemas', 
    description: 'Digitação dos mesmos dados em ferramentas diferentes',
    tags: ['integracao', 'apis']
  },
  { 
    id: 'necessidade_app', 
    label: 'Necessidade de um aplicativo mobile', 
    description: 'Equipes externas, clientes móveis ou necessidade de acesso offline',
    tags: ['mobile', 'app']
  },
  { 
    id: 'outro_desafio', 
    label: 'Outro desafio específico', 
    description: 'Desafio operacional ou estratégico customizado',
    tags: ['custom']
  }
];

export const INFO_CONTROL_OPTIONS: QuestionOption[] = [
  { id: 'planilhas', label: 'Planilhas eletrônicas (Excel / Sheets)', scoreWeight: 10 },
  { id: 'sistemas_desconectados', label: 'Sistemas diferentes e não integrados', scoreWeight: 20 },
  { id: 'anotacoes_manuais', label: 'Anotações em papel, WhatsApp ou processos manuais', scoreWeight: 5 },
  { id: 'sistema_centralizado', label: 'Um sistema centralizado ou ERP', scoreWeight: 35 },
  { id: 'outro', label: 'Outro formato' }
];

export const MANUAL_LEVEL_OPTIONS: QuestionOption[] = [
  { id: 'pouco', label: 'Pouco (menos de 25%)', scoreWeight: 35 },
  { id: 'moderado', label: 'Moderadamente (25% a 50%)', scoreWeight: 25 },
  { id: 'muito', label: 'Muito (50% a 75%)', scoreWeight: 15 },
  { id: 'maior_parte', label: 'A maior parte dos processos (+75%)', scoreWeight: 5 }
];

export const INDICATORS_OPTIONS: QuestionOption[] = [
  { id: 'tempo_real', label: 'Sim, dashboards atualizados em tempo real', scoreWeight: 40 },
  { id: 'manualmente', label: 'Sim, mas consolidados manualmente todo mês/semana', scoreWeight: 25 },
  { id: 'poucos', label: 'Poucos indicadores básicos', scoreWeight: 15 },
  { id: 'nao_possuimos', label: 'Não possuímos indicadores estruturados', scoreWeight: 5 }
];

export const OBJECTIVE_OPTIONS: QuestionOption[] = [
  { id: 'produtividade', label: 'Aumentar produtividade', description: 'Fazer mais com a mesma equipe' },
  { id: 'reduzir_erros', label: 'Reduzir erros e retrabalho', description: 'Padronizar fluxos e evitar falhas operacionais' },
  { id: 'automatizar_tarefas', label: 'Automatizar tarefas repetitivas', description: 'Liberar pessoas para atividades estratégicas' },
  { id: 'melhorar_controle', label: 'Melhorar o controle da empresa', description: 'Visibilidade total sobre status e métricas' },
  { id: 'melhores_relatorios', label: 'Ter melhores relatórios e indicadores', description: 'Decisões baseadas em dados confiáveis' },
  { id: 'melhorar_atendimento', label: 'Melhorar atendimento aos clientes', description: 'Agilidade, histórico e canais integrados' },
  { id: 'novo_produto_digital', label: 'Criar um novo produto digital / App', description: 'Lançar uma nova oferta ou plataforma' },
  { id: 'modernizar_processos', label: 'Modernizar processos e sistemas legados', description: 'Trocar ferramentas antigas por tecnologia em nuvem' }
];

export const SYSTEMS_INTEGRATED_OPTIONS: QuestionOption[] = [
  { id: 'sim', label: 'Sim, os dados fluem automaticamente', scoreWeight: 35 },
  { id: 'parcialmente', label: 'Parcialmente, alguns sistemas conversam entre si', scoreWeight: 20 },
  { id: 'nao', label: 'Não, usamos ferramentas totalmente isoladas', scoreWeight: 5 }
];

export const INFO_ACCESS_OPTIONS: QuestionOption[] = [
  { id: 'sim', label: 'Sim, de qualquer lugar com segurança', scoreWeight: 35 },
  { id: 'parcialmente', label: 'Parcialmente, apenas na rede local ou com dificuldade', scoreWeight: 20 },
  { id: 'nao', label: 'Não, encontrar informações é demorado e burocrático', scoreWeight: 5 }
];

export const REPETITIVE_TASKS_OPTIONS: QuestionOption[] = [
  { id: 'muitas', label: 'Sim, muitas tarefas manuais e repetitivas', scoreWeight: 10 },
  { id: 'algumas', label: 'Algumas tarefas específicas', scoreWeight: 20 },
  { id: 'poucas', label: 'Poucas tarefas', scoreWeight: 35 },
  { id: 'nao_sei', label: 'Ainda não mapeamos com clareza', scoreWeight: 15 }
];
