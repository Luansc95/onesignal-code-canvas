import { ServiceItem } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'desenvolvimento-aplicativos',
    title: 'Desenvolvimento de Aplicativos',
    iconName: 'Smartphone',
    shortDescription: 'Criamos aplicativos modernos e personalizados para Android e iOS, focados nas necessidades do seu negócio.',
    fullDescription: 'Desenvolvemos aplicativos nativos e híbridos de alta performance, proporcionando experiências fluidas aos usuários finais e controle total para a sua operação.',
    deliverables: [
      'Apps nativos (iOS / Swift e Android / Kotlin) e híbridos (Flutter / React Native)',
      'Design de interfaces (UI/UX) focado em usabilidade e alta conversão',
      'Arquitetura offline-first com sincronização automática em nuvem',
      'Integração com notificações push segmentadas, geolocalização e biometria',
      'Publicação e suporte completo na App Store e Google Play Store'
    ],
    technologies: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase', 'GraphQL'],
    benefits: [
      'Acesso direto aos clientes na palma da mão',
      'Engajamento contínuo através de notificações inteligentes',
      'Operação em campo sem depender de internet estável'
    ]
  },
  {
    id: 'desenvolvimento-sistemas-web',
    title: 'Desenvolvimento de Sistemas Web',
    iconName: 'Globe',
    shortDescription: 'Criamos sistemas web, plataformas, dashboards e soluções acessíveis de qualquer dispositivo.',
    fullDescription: 'Engenharia de software web sob medida com foco em escalabilidade, segurança e design responsivo premium. Construímos desde painéis administrativos até plataformas SaaS complexas.',
    deliverables: [
      'Portais corporativos, plataformas SaaS e web apps progressivos (PWA)',
      'Dashboards analíticos interativos com gráficos e filtros em tempo real',
      'APIs RESTful e GraphQL robustas e documentadas (Swagger/OpenAPI)',
      'Arquitetura em nuvem resiliente (AWS, Google Cloud, Docker, Kubernetes)',
      'Design responsivo impecável adaptado a qualquer tamanho de tela'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Next.js', 'TailwindCSS', 'PostgreSQL'],
    benefits: [
      'Acesso seguro e veloz a partir de qualquer navegador',
      'Escalabilidade para suportar milhares de usuários simultâneos',
      'Integração fácil com outros sistemas legados da empresa'
    ]
  },
  {
    id: 'automacao-processos',
    title: 'Automação de Processos',
    iconName: 'Cog',
    shortDescription: 'Automatizamos tarefas e processos para aumentar a produtividade e reduzir erros operacionais.',
    fullDescription: 'Eliminamos gargalos e trabalhos manuais repetitivos integrando softwares, bancos de dados e canais de comunicação com robôs inteligentes e fluxos automatizados.',
    deliverables: [
      'Robôs de automação (RPA) para rotinas contábeis, cadastrais e fiscais',
      'Integrações via Webhooks e APIs entre ERPs, CRMs e plataformas externas',
      'Automação de atendimento e disparo de notificações via WhatsApp',
      'Esteiras de processamento de documentos e planilhas com validação automática',
      'Alertas automáticos de inconformidades e falhas operacionais'
    ],
    technologies: ['Python', 'Node.js', 'n8n', 'Webhooks', 'Redis', 'RabbitMQ'],
    benefits: [
      'Redução drástica de até 90% no tempo de execução de tarefas manuais',
      'Eliminação de erros de digitação e digitação redundante',
      'Equipe focada em estratégia e atendimento, não em burocracia'
    ]
  },
  {
    id: 'sistemas-gestao',
    title: 'Sistemas de Gestão',
    iconName: 'BarChart3',
    shortDescription: 'Desenvolvemos sistemas para controle de empresas, equipes, produção, clientes e processos.',
    fullDescription: 'Soluções ERP e ferramentas de governança desenvolvidas com as regras exatas do seu modelo de negócio, garantindo aderência total aos seus fluxos de trabalho.',
    deliverables: [
      'Módulos personalizados de compras, faturamento, estoque e logística',
      'Gestão de projetos, ordens de serviço (O.S.) e apontamento de produção',
      'Controle financeiro avançado: contas a pagar, receber, DRE e conciliação',
      'Gestão de permissões de acesso por níveis hierárquicos e auditoria de logs',
      'Relatórios executivos e exportação em múltiplos formatos (PDF, Excel, JSON)'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Prisma', 'TypeScript'],
    benefits: [
      'Visão 360° da saúde operacional e financeira da empresa',
      'Total aderência às peculiaridades que softwares de prateleira não atendem',
      'Decisões embasadas em dados consolidados e confiáveis'
    ]
  },
  {
    id: 'inteligencia-artificial',
    title: 'Inteligência Artificial',
    iconName: 'Bot',
    shortDescription: 'Aplicamos recursos de inteligência artificial para tornar sistemas e processos mais inteligentes.',
    fullDescription: 'Integramos modelos de linguagem natural (LLMs), visão computacional e algoritmos de aprendizado de máquina em seus sistemas existentes para gerar diferenciais competitivos.',
    deliverables: [
      'Agentes autônomos e chatbots com IA generativa treinados em dados da empresa',
      'Classificação e extração automática de dados de notas fiscais, contratos e PDFs',
      'Modelos preditivos para previsão de vendas, demanda de estoque e churn',
      'Análise de sentimento de clientes e triagem inteligente de tickets de suporte',
      'Reconhecimento de imagens para controle de qualidade visual em linhas de produção'
    ],
    technologies: ['Gemini API', 'OpenAI', 'Python', 'LangChain', 'FastAPI', 'Vector DBs'],
    benefits: [
      'Atendimento inteligente e humanizado 24 horas por dia',
      'Capacidade de antecipar tendências e comportamentos de consumo',
      'Processamento instantâneo de milhares de documentos complexos'
    ]
  },
  {
    id: 'tecnologia-seguranca',
    title: 'Tecnologia e Segurança',
    iconName: 'ShieldCheck',
    shortDescription: 'Desenvolvemos soluções voltadas para controle, monitoramento e segurança de processos e informações.',
    fullDescription: 'Projetamos infraestruturas e softwares em conformidade com as melhores práticas de cibersegurança e LGPD, protegendo os ativos mais valiosos da sua organização.',
    deliverables: [
      'Auditoria de segurança de código e testes de intrusão (PenTest básico)',
      'Implementação de autenticação multifator (MFA) e Single Sign-On (SSO)',
      'Criptografia de ponta a ponta para dados em trânsito e em repouso',
      'Adequação técnica e arquitetural à Lei Geral de Proteção de Dados (LGPD)',
      'Estratégias de backup em nuvem distribuído e Disaster Recovery (DR)'
    ],
    technologies: ['OAuth2', 'JWT', 'SSL/TLS', 'Cloudflare', 'AWS KMS', 'Vault'],
    benefits: [
      'Blindagem contra vazamentos de dados e ataques cibernéticos',
      'Conformidade jurídica com a LGPD e normas do setor',
      'Continuidade operacional garantida mesmo em situações imprevistas'
    ]
  }
];
