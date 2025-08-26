// Mock CBO Data for Development
import type { TCBOOccupation, TCBOSearchResponse, TCBOStats } from '@/types/cbo';
import { THttpResponse, THttpResponsePagination } from '@/types/http';

export const mockStatistics: TCBOStats = {
  totalOccupations: 2422,
  totalBigGroups: 10,
  totalSubGroups: 47,
  totalMainSubGroups: 192,
  totalFamily: 596,
};

export const mockOccupations: TCBOOccupation[] = [
  {
    id: 252105,
    label: 'Administrador',
    description: 'Planeja, organiza, controla e avalia as operações das organizações, aplicando conceitos e métodos da administração para prover produtos e serviços com qualidade, produtividade e competitividade.',
    level: 5,
    hierarchy: {
      bigGroup: 'Profissionais das ciências e intelectuais',
      subGroup: 'Profissionais em administração e economia',
      mainSubGroup: 'Administradores',
      family: 'Administradores',
    },
    activities: [
      'Estabelecer diretrizes, políticas e estratégias de gestão organizacional',
      'Administrar recursos humanos, materiais, informacionais, financeiros e tecnológicos',
      'Gerir informações gerenciais',
      'Avaliar desempenho organizacional',
      'Elaborar planejamento organizacional',
    ],
    competencies: [
      'Liderança',
      'Visão sistêmica',
      'Comunicação eficaz',
      'Tomada de decisão',
      'Gestão estratégica',
      'Análise crítica',
    ],
    workConditions: [
      'Trabalha em ambientes fechados, organizados e limpos',
      'Horário comercial ou flexível conforme demanda',
      'Utiliza equipamentos de informática e comunicação',
    ],
    academy: [
      'Ensino superior em Administração',
      'Registro no Conselho Regional de Administração (CRA)',
      'Cursos de especialização em gestão são recomendados',
    ],
    workResources: [
      'Computador e softwares de gestão',
      'Sistemas de informação gerencial',
      'Ferramentas de comunicação',
      'Documentos e relatórios',
    ],
  },
  {
    id: 212405,
    label: 'Engenheiro de Software',
    description: 'Desenvolve, testa e mantém softwares e sistemas computacionais, aplicando princípios de engenharia de software para criar soluções tecnológicas eficientes e confiáveis.',
    level: 5,
    hierarchy: {
      bigGroup: 'Profissionais das ciências e intelectuais',
      subGroup: 'Profissionais de informática',
      mainSubGroup: 'Analistas de sistemas computacionais',
      family: 'Engenheiros de software',
    },
    activities: [
      'Analisar requisitos de software',
      'Projetar arquitetura de sistemas',
      'Desenvolver código fonte',
      'Realizar testes de software',
      'Manter e atualizar sistemas existentes',
      'Documentar processos e sistemas',
    ],
    competencies: [
      'Lógica de programação',
      'Conhecimento em linguagens de programação',
      'Metodologias ágeis',
      'Banco de dados',
      'Arquitetura de software',
      'Resolução de problemas',
    ],
    workConditions: [
      'Trabalha em escritórios com equipamentos de informática',
      'Pode trabalhar remotamente',
      'Horários flexíveis são comuns',
      'Ambiente colaborativo com equipes técnicas',
    ],
    academy: [
      'Ensino superior em Ciência da Computação, Engenharia de Software ou similar',
      'Certificações em tecnologias específicas',
      'Cursos de atualização tecnológica contínua',
    ],
    workResources: [
      'Computador de alta performance',
      'IDEs e ferramentas de desenvolvimento',
      'Sistemas de controle de versão',
      'Ferramentas de teste e deploy',
    ],
  },
  {
    id: 226115,
    label: 'Médico Cardiologista',
    description: 'Realiza consultas médicas, diagnósticos e tratamentos relacionados ao sistema cardiovascular, prevenindo, diagnosticando e tratando doenças do coração e vasos sanguíneos.',
    level: 5,
    hierarchy: {
      bigGroup: 'Profissionais das ciências e intelectuais',
      subGroup: 'Médicos',
      mainSubGroup: 'Médicos especialistas',
      family: 'Cardiologistas',
    },
    activities: [
      'Realizar consultas cardiológicas',
      'Interpretar exames cardiovasculares',
      'Prescrever medicamentos e tratamentos',
      'Realizar procedimentos invasivos quando necessário',
      'Orientar sobre prevenção de doenças cardiovasculares',
      'Acompanhar pacientes crônicos',
    ],
    competencies: [
      'Conhecimento médico especializado',
      'Habilidades cirúrgicas',
      'Interpretação de exames',
      'Comunicação com pacientes',
      'Tomada de decisões clínicas',
      'Atualização científica constante',
    ],
    workConditions: [
      'Hospitais, clínicas e consultórios',
      'Plantões e regime de sobreaviso',
      'Uso de equipamentos médicos especializados',
      'Ambiente estéril quando necessário',
    ],
    academy: [
      'Graduação em Medicina',
      'Residência médica em Cardiologia',
      'Registro no Conselho Regional de Medicina (CRM)',
      'Título de especialista pela SBC',
    ],
    workResources: [
      'Equipamentos de diagnóstico cardiovascular',
      'Instrumentos cirúrgicos especializados',
      'Sistemas de monitoramento cardíaco',
      'Medicamentos cardiológicos',
    ],
  },
  {
    id: 234115,
    label: 'Professor de Ensino Fundamental',
    description: 'Ministra aulas e desenvolve activities pedagógicas para estudantes do ensino fundamental, promovendo o processo ensino-aprendizagem e o desenvolvimento integral dos alunos.',
    level: 5,
    hierarchy: {
      bigGroup: 'Profissionais das ciências e intelectuais',
      subGroup: 'Profissionais do ensino',
      mainSubGroup: 'Professores de nível superior na educação básica',
      family: 'Professores do ensino fundamental',
    },
    activities: [
      'Planejar e ministrar aulas',
      'Elaborar material didático',
      'Avaliar o desempenho dos alunos',
      'Participar de reuniões pedagógicas',
      'Orientar projetos educacionais',
      'Manter comunicação com pais e responsáveis',
    ],
    competencies: [
      'Domínio do conteúdo pedagógico',
      'Metodologias de ensino',
      'Gestão de sala de aula',
      'Comunicação didática',
      'Avaliação educacional',
      'Relacionamento interpessoal',
    ],
    workConditions: [
      'Escolas públicas e privadas',
      'Salas de aula com recursos didáticos',
      'Horário escolar regular',
      'Interação constante com estudantes',
    ],
    academy: [
      'Licenciatura na área de ensino',
      'Especialização em educação é recomendada',
      'Formação continuada em metodologias pedagógicas',
    ],
    workResources: [
      'Livros didáticos e materiais pedagógicos',
      'Recursos audiovisuais',
      'Laboratórios e salas especializadas',
      'Tecnologias educacionais',
    ],
  },
  {
    id: 314205,
    label: 'Técnico em Informática',
    description: 'Executa activities técnicas de desenvolvimento, manutenção e suporte de sistemas computacionais, auxiliando na implantação e operação de recursos de tecnologia da informação.',
    level: 5,
    hierarchy: {
      bigGroup: 'Técnicos de nível médio',
      subGroup: 'Técnicos de nível médio das ciências físicas, químicas, engenharias e afins',
      mainSubGroup: 'Técnicos em informática',
      family: 'Técnicos em informática',
    },
    activities: [
      'Instalar e configurar softwares e hardwares',
      'Prestar suporte técnico aos usuários',
      'Manter e reparar equipamentos de informática',
      'Configurar redes de computadores',
      'Realizar backup e recuperação de dados',
      'Monitorar sistemas computacionais',
    ],
    competencies: [
      'Conhecimento de hardware e software',
      'Redes de computadores',
      'Sistemas operacionais',
      'Suporte técnico',
      'Resolução de problemas',
      'Atendimento ao cliente',
    ],
    workConditions: [
      'Escritórios e empresas diversas',
      'Ambiente com equipamentos tecnológicos',
      'Horário comercial com possibilidade de plantões',
      'Deslocamentos para atendimento externo',
    ],
    academy: [
      'Curso técnico em Informática',
      'Certificações em tecnologias específicas',
      'Cursos de atualização tecnológica',
    ],
    workResources: [
      'Ferramentas de manutenção de hardware',
      'Softwares de diagnóstico',
      'Equipamentos de rede',
      'Instrumentos de medição eletrônica',
    ],
  },
  {
    id: 711100,
    label: 'Pedreiro',
    description: 'Executa trabalhos de construção civil, realizando activities de alvenaria, concreto e outros serviços relacionados à edificação de construções.',
    level: 5,
    hierarchy: {
      bigGroup: 'Trabalhadores qualificados, operários e artesãos',
      subGroup: 'Trabalhadores qualificados da construção civil e afins',
      mainSubGroup: 'Trabalhadores da construção civil',
      family: 'Pedreiros',
    },
    activities: [
      'Construir alvenarias de tijolos e blocos',
      'Preparar e aplicar argamassa',
      'Executar revestimentos e acabamentos',
      'Construir estruturas de concreto',
      'Assentar pisos e azulejos',
      'Interpretar projetos e plantas baixas',
    ],
    competencies: [
      'Técnicas de construção civil',
      'Uso de ferramentas manuais',
      'Interpretação de projetos',
      'Conhecimento de materiais de construção',
      'Medições e cálculos básicos',
      'Trabalho em equipe',
    ],
    workConditions: [
      'Canteiros de obras',
      'Exposição a intempéries',
      'Uso de equipamentos de proteção individual',
      'Trabalho físico intenso',
      'Horário diurno',
    ],
    academy: [
      'Curso profissionalizante em construção civil',
      'Experiência prática na área',
      'Cursos de segurança do trabalho',
    ],
    workResources: [
      'Ferramentas manuais de construção',
      'Equipamentos de medição',
      'Materiais de construção diversos',
      'Equipamentos de proteção individual',
    ],
  },
];

export const mockPopularOccupations: TCBOOccupation[] = mockOccupations.slice(0, 6);

export const mockAutocompleteSuggestions = [
  'Administrador',
  'Advogado',
  'Engenheiro Civil',
  'Médico',
  'Professor',
  'Contador',
  'Enfermeiro',
  'Técnico em Informática',
  'Vendedor',
  'Analista de Sistemas',
];

// Function to simulate API delays
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock search function
export const mockSearchOccupations = async (params: any): Promise<TCBOSearchResponse> => {
  await delay(800); // Simulate API delay

  let filteredOccupations = [...mockOccupations];
  
  if (params.q) {
    const query = String(params.q).toLowerCase();
    filteredOccupations = filteredOccupations.filter(occ => 
      occ.label.toLowerCase().includes(query) ||
      occ.id.toString().includes(query) ||
      occ.description?.toLowerCase().includes(query)
    );
  }
  
  if (params.id) {
    filteredOccupations = filteredOccupations.filter(occ => 
      occ.id.toString().includes(params.id)
    );
  }
  
  if (params.level) {
    filteredOccupations = filteredOccupations.filter(occ => 
      occ.level === parseInt(params.level)
    );
  }

  const page = Number(params.page || "1")
  const limit = Number(params.perPage || "20");
  const offset = (page  - 1) * limit;
  const paginatedResults = filteredOccupations.slice(offset, offset + limit);
  const totalPages = Math.ceil(mockOccupations.length / Number(limit))

  const pagination: THttpResponsePagination = {
    items: filteredOccupations.length,
    totalItems: mockOccupations.length,
    page,
    perPage: limit,
    totalPages,
    hasNext: page < totalPages
  }
  
  return {
    success: true,
    data: paginatedResults,
    message: 'Ocupações listadas com sucesso!',
    pagination
  };
};

// Mock get occupation by code
export const mockGetOccupationById = async (id: number): Promise<THttpResponse<TCBOOccupation>> => {
  await delay(500);

  const occupation = mockOccupations.find(occ => occ.id === id) || null;

  if (!occupation) {
    return null
  }

  return {
    success: true,
    message: "Occupação recuperada com sucesso!",
    data: occupation
  }
};

// Mock autocomplete
export const mockAutoComplete = async (query: string, limit: number = 5): Promise<string[]> => {
  await delay(300);
  
  if (query.length < 2) return [];
  
  const filtered = mockAutocompleteSuggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, limit);
    
  return filtered;
};