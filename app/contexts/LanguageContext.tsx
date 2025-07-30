'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for available languages
export type Language = 'pt' | 'en';

// Available CV types
export type CVType = 'development' | 'marketing' | 'sales' | 'hr' | 'finance' | 'design' | 'health' | 'education' | 'admin' | 'other';

// Context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  cvType: CVType;
  setCVType: (type: CVType) => void;
  t: (key: string) => string;
}

// Context creation
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider props
interface LanguageProviderProps {
  children: ReactNode;
}

// Context provider
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('pt');
  const [cvType, setCVTypeState] = useState<CVType>('development');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load language and CV type from localStorage on initialization
  useEffect(() => {
    try {
      // Check if we're in the browser
      if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem('cv-builder-language') as Language;
        if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
          setLanguageState(savedLanguage);
        } else {
          // Detect browser language if no language is saved
          const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
          const detectedLanguage = browserLanguage.startsWith('pt') ? 'pt' : 'en';
          setLanguageState(detectedLanguage);
          localStorage.setItem('cv-builder-language', detectedLanguage);
        }
        
        const savedCVType = localStorage.getItem('cv-builder-type') as CVType;
        if (savedCVType && ['development', 'marketing', 'sales', 'hr', 'finance', 'design', 'health', 'education', 'admin', 'other'].includes(savedCVType)) {
          setCVTypeState(savedCVType);
        }
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing language:', error);
      setIsInitialized(true);
    }
  }, []);

  // Function to change language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cv-builder-language', lang);
  };

  // Function to change CV type
  const setCVType = (type: CVType) => {
    setCVTypeState(type);
    localStorage.setItem('cv-builder-type', type);
  };

  // Translation function
  const t = (key: string): string => {
    const translations = language === 'pt' ? ptTranslations : enTranslations;
    const baseTranslation = translations[key] || key;
    
    // If the key contains CV type, return the specific translation
    if (key.includes('cvType.')) {
      const cvTypeKey = key.replace('cvType.', `${cvType}.`);
      const cvTypeTranslation = translations[cvTypeKey];
      if (cvTypeTranslation) {
        return cvTypeTranslation;
      }
    }
    
    return baseTranslation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, cvType, setCVType, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Portuguese translations
const ptTranslations: Record<string, string> = {
  // Header
  'app.title': 'CV Builder',
  'app.subtitle': 'Crie um currículo profissional em minutos',
  'generate.cv': 'Gerar CV',
  'generate.resume': 'Gerar Currículo',
  'generate.ats.resume': 'Gerar Currículo ATS',
  'preview.cv': 'Preview do CV',
  'preview': 'Preview',
  'select.language': 'Escolher idioma:',
  'language.portuguese': 'Português',
  'language.english': 'English',

  // Notifications
  'data.loaded': 'Dados carregados automaticamente do navegador.',
  'cv.generated': 'Currículo gerado com sucesso! O download deve começar automaticamente.',
  'fill.example': 'Preencher com dados de exemplo',
  'validation.required': 'Por favor, preencha todos os campos obrigatórios:',
  'validation.name': 'Nome completo',
  'validation.email': 'Email',
  'validation.role': 'Cargo desejado',
  'validation.resume': 'Resumo profissional',

  // Form Sections
  'section.personal.info': 'Informações Pessoais',
  'section.professional.summary': 'Resumo Profissional',
  'section.professional.experience': 'Experiência Profissional',
  'section.academic.education': 'Educação Académica',
  'section.technical.skills': 'Competências Técnicas',
  'section.languages': 'Línguas',
  'section.certifications': 'Certificações e Cursos',
  'section.projects': 'Projetos',

  // Personal Information
  'field.full.name': 'Nome completo',
  'field.desired.role': 'Cargo Desejado',
  'field.postal.code': 'Código Postal',
  'field.city': 'Cidade',
  'field.email': 'Email',
  'field.country.code': 'Código do País',
  'field.phone': 'Telefone',
  'field.links.social': 'Links e Redes Sociais',
  'field.link.type': 'Tipo de Link',
  'field.url': 'URL',

  // Professional Summary
  'field.professional.summary': 'Resumo Profissional',
  'resume.placeholder': 'Desenvolvedor Fullstack com experiência no desenvolvimento de aplicações web escaláveis, responsivas e centradas no utilizador. Trabalho com TypeScript, React, Next.js, Node.js, PostgreSQL e Prisma, com forte atenção à performance, usabilidade e qualidade do código...',

  // Professional Experience
  'field.role': 'Cargo',
  'field.company': 'Empresa',
  'field.start.month': 'Mês Início',
  'field.start.year': 'Ano Início',
  'field.end.month': 'Mês Fim',
  'field.end.year': 'Ano Fim',
  'field.current': 'Atual',
  'field.technologies': 'Tecnologias Utilizadas',
  'field.activities': 'Atividades Desenvolvidas',
  'field.achievements': 'Conquistas',
  'field.achievements.helper': 'com métricas',
  'add.experience': 'Adicionar Experiência',
  'experience.title': 'Experiência',

  // Academic Education
  'field.course': 'Curso',
  'field.institution': 'Instituição',
  'field.description': 'Descrição',
  'add.education': 'Adicionar Educação',
  'education.title': 'Educação',

  // Technical Skills
  'skills.placeholder': 'Ex: JavaScript, React, Node.js, SQL',

  // Languages
  'field.language': 'Língua',
  'field.level': 'Nível',
  'add.language': 'Adicionar Língua',
  'language.title': 'Língua',

  // Certifications
  'field.certification': 'Certificação',
  'field.issuer': 'Emissor/Instituição',
  'field.completion.date': 'Data de Conclusão',
  'field.hours': 'Carga Horária',
  'field.validation.link': 'Link de Validação',
  'add.certification': 'Adicionar Certificação/Curso',
  'certification.title': 'Certificação',

  // Projects
  'field.project.name': 'Nome do Projeto',
  'field.year': 'Ano',
  'field.project.technologies': 'Tecnologias',
  'field.project.link': 'Link',
  'add.project': 'Adicionar Projeto',
  'project.title': 'Projeto',

  // Placeholders
  'placeholder.full.name': 'Ex: Gonçalo Sousa',
  'placeholder.desired.role': 'Ex: Desenvolvedor Full Stack',
  'placeholder.postal.code': 'Ex: 1234-567',
  'placeholder.city': 'Ex: Viana do Castelo',
  'placeholder.email': 'Ex: email@exemplo.com',
  'placeholder.phone': 'Ex: 912345678',
  'placeholder.role': 'Ex: Desenvolvedor Full Stack',
  'placeholder.company': 'Ex: Amazon',
  'placeholder.course': 'Ex: Licenciatura em Engenharia Informática',
  'placeholder.institution': 'Ex: Universidade do Porto',
  'placeholder.certification': 'Ex: Certificação AWS Cloud Practitioner',
  'placeholder.issuer': 'Ex: Udemy, Alura, AWS',
  'placeholder.hours': 'Ex: 40 horas',
  'placeholder.validation.link': 'Ex: https://certificate.institution.com/123456',
  'placeholder.project.name': 'Ex: Portfolio Website',
  'placeholder.project.year': 'Ex: 2023',
  'placeholder.project.tech': 'Ex: React, Node.js, MongoDB',
  'placeholder.project.link': 'Ex: https://github.com/user/project',
  'placeholder.project.description': 'Breve descrição do projeto, objetivos, resultados...',
  'placeholder.activities': 'Descreva suas responsabilidades (um item por linha)',
  'placeholder.achievements': 'Ex: Reestruturei a arquitetura da aplicação usando Next.js com SSR, o que melhorou o SEO e aumentou a retenção de usuários em 25%.',
  'placeholder.education.description': 'Ex: Tese sobre inteligência artificial, disciplinas relevantes, projetos académicos...',
  'placeholder.certification.description': 'Ex: Curso focado em desenvolvimento de APIs REST com Node.js...',

  // Dropdown options
  'select.month': 'Selecione',
  'select.country': 'Selecionar país',
  'select.date': 'Selecionar data',

  // Link types
  'link.type.linkedin': 'LinkedIn',
  'link.type.github': 'GitHub',
  'link.type.gitlab': 'GitLab',
  'link.type.portfolio': 'Portfolio',
  'link.type.other': 'Outro',

  // Link placeholders
  'link.placeholder.linkedin': 'Ex: meuperfil',
  'link.placeholder.github': 'Ex: utilizador',
  'link.placeholder.gitlab': 'Ex: utilizador',
  'link.placeholder.portfolio': 'Ex: meuwebsite.com',
  'link.placeholder.other': 'Ex: meuwebsite.com',

  // Months
  'month.jan': 'Jan',
  'month.feb': 'Fev',
  'month.mar': 'Mar',
  'month.apr': 'Abr',
  'month.may': 'Mai',
  'month.jun': 'Jun',
  'month.jul': 'Jul',
  'month.aug': 'Ago',
  'month.sep': 'Set',
  'month.oct': 'Out',
  'month.nov': 'Nov',
  'month.dec': 'Dez',

  // Countries
  'country.portugal': 'Portugal (+351)',
  'country.brazil': 'Brasil (+55)',
  'country.spain': 'Espanha (+34)',

  // Empty states
  'empty.experience': 'Nenhuma experiência adicionada',
  'empty.education': 'Nenhuma educação adicionada',
  'empty.language': 'Nenhuma língua adicionada',
  'empty.certification': 'Nenhuma certificação adicionada',
  'empty.project': 'Nenhum projeto adicionado',

  // CV Tips
  'tips.title': 'Dicas para um Currículo que Passe em Sistemas ATS',
  'tips.subtitle': 'Siga estas recomendações para aumentar as suas hipóteses de ser selecionado',
  'tips.extra.title': 'Dica Extra',
  'tips.extra.content': 'O currículo gerado por esta aplicação já segue estas boas práticas, mas certifique-se de personalizar o conteúdo de acordo com cada oferta específica.',

  // Tip content
  'tip.format.simple': 'Usa um formato simples (sem gráficos nem tabelas)',
  'tip.format.simple.desc': 'Os sistemas ATS têm dificuldade em ler elementos visuais. Utiliza apenas texto com uma estrutura clara.',
  'tip.keywords': 'Utiliza palavras-chave exatas do anúncio',
  'tip.keywords.desc': 'Copia os termos usados no anúncio da oferta (tecnologias, funções, competências). O ATS procura correspondências exatas.',
  'tip.headers': 'Evita cabeçalhos personalizados',
  'tip.headers.desc': 'Utiliza termos comuns como \'Experiência Profissional\', \'Educação\', \'Competências\'.',
  'tip.format.file': 'Guarda o currículo em formato .docx ou .pdf (simples)',
  'tip.format.file.desc': 'Alguns ATS têm problemas com PDFs mal formatados ou versões antigas do Word.',
  'tip.acronyms': 'Não uses siglas sem escrever também o significado',
  'tip.acronyms.desc': 'Exemplo: escreve \'JavaScript (JS)\' ou \'Base de Dados (BD)\' para garantir que é reconhecido.',
  'tip.chronological': 'Coloca as informações por ordem cronológica inversa',
  'tip.chronological.desc': 'Começa pela experiência mais recente, pois é isso que o ATS e o recrutador querem ver.',
  'tip.job.titles': 'Inclui títulos de cargos comuns',
  'tip.job.titles.desc': 'Utiliza nomes genéricos como \'Desenvolvedor Backend\', \'Analista de Sistemas\', etc., mesmo que o nome oficial da função fosse diferente.',
  'tip.spelling': 'Evita erros ortográficos',
  'tip.spelling.desc': 'O ATS pode não reconhecer palavras mal escritas, o que pode levar à exclusão do currículo.',
  'tip.technical.skills': 'Inclui uma secção de competências técnicas',
  'tip.technical.skills.desc': 'Lista as tecnologias, linguagens e ferramentas que utilizaste (ex: Java, Git, SQL, Docker).',

  // Actions
  'actions': 'Ações',

  // CV Type Selector
  'cv.type.selector': 'Tipo de Currículo',
  'cv.type.development': 'Desenvolvimento/IT',
  'cv.type.marketing': 'Marketing/Digital',
  'cv.type.sales': 'Vendas/Comercial',
  'cv.type.hr': 'Recursos Humanos',
  'cv.type.finance': 'Finanças/Contabilidade',
  'cv.type.design': 'Design/Criativo',
  'cv.type.health': 'Saúde/Medicina',
  'cv.type.education': 'Educação/Ensino',
  'cv.type.admin': 'Administração/Gestão',
  'cv.type.other': 'Outros',

  // Development specific translations
  'development.field.desired.role': 'Cargo Desejado',
  'development.placeholder.desired.role': 'Ex: Desenvolvedor Full Stack',
  'development.placeholder.role': 'Ex: Desenvolvedor Full Stack',
  'development.field.technologies': 'Tecnologias Utilizadas',
  'development.placeholder.technologies': 'Ex: TypeScript, React, Node.js, PostgreSQL',
  'development.field.technical.skills': 'Competências Técnicas',
  'development.placeholder.technical.skills': 'Ex: JavaScript, React, Node.js, SQL, Git, Docker',
  'development.placeholder.professional.summary': 'Ex: Desenvolvedor Full Stack com 5 anos de experiência em desenvolvimento web, especializado em React, Node.js e bases de dados. Apaixonado por criar soluções escaláveis e eficientes.',
  'development.placeholder.experience.description': 'Ex: Desenvolvi e mantive aplicações web full-stack utilizando React, Node.js e PostgreSQL. Implementei funcionalidades de autenticação, APIs RESTful e integração com sistemas externos.',
  'development.placeholder.project.description': 'Ex: Aplicação web full-stack para gestão de tarefas com autenticação, dashboard interativo e API RESTful. Utilizou React, Node.js e MongoDB.',
  'development.placeholder.project.name': 'Ex: Portfolio Website',

  // Marketing specific translations
  'marketing.field.desired.role': 'Cargo Desejado',
  'marketing.placeholder.desired.role': 'Ex: Marketing Digital Manager',
  'marketing.placeholder.role': 'Ex: Marketing Digital Manager',
  'marketing.field.technologies': 'Ferramentas Utilizadas',
  'marketing.placeholder.technologies': 'Ex: Google Analytics, Facebook Ads, Mailchimp, Canva',
  'marketing.field.technical.skills': 'Competências Técnicas',
  'marketing.placeholder.technical.skills': 'Ex: Google Analytics, Facebook Ads, SEO, Email Marketing',
  'marketing.placeholder.professional.summary': 'Ex: Profissional de Marketing Digital com 4 anos de experiência em campanhas online, especializado em SEO, SEM e análise de dados. Experiência em gestão de redes sociais e email marketing.',
  'marketing.placeholder.experience.description': 'Ex: Gestionei campanhas de marketing digital para clientes B2B e B2C, aumentando o tráfego orgânico em 40% e melhorando a taxa de conversão em 25%.',
  'marketing.placeholder.project.description': 'Ex: Campanha de marketing digital para lançamento de produto, incluindo estratégia de redes sociais, email marketing e publicidade paga. Resultado: 300% aumento em vendas.',
  'marketing.placeholder.project.name': 'Ex: Campanha de Marketing Digital',

  // Sales specific translations
  'sales.field.desired.role': 'Cargo Desejado',
  'sales.placeholder.desired.role': 'Ex: Representante de Vendas',
  'sales.placeholder.role': 'Ex: Representante de Vendas',
  'sales.field.technologies': 'Ferramentas Utilizadas',
  'sales.placeholder.technologies': 'Ex: Salesforce, HubSpot, LinkedIn Sales Navigator',
  'sales.field.technical.skills': 'Competências Técnicas',
  'sales.placeholder.technical.skills': 'Ex: CRM, Prospecting, Negociação, LinkedIn',
  'sales.placeholder.professional.summary': 'Ex: Representante de Vendas com 6 anos de experiência em vendas B2B, especializado em prospeção de clientes e fecho de negócios. Histórico comprovado de superação de metas de vendas.',
  'sales.placeholder.experience.description': 'Ex: Desenvolvi e mantive um pipeline de vendas de €500K, prospectando novos clientes e gerindo relacionamentos com clientes existentes. Utilizei CRM para otimizar processos de vendas.',
  'sales.placeholder.project.description': 'Ex: Campanha de vendas para novo produto SaaS, incluindo prospeção, demonstrações e negociação. Resultado: 15 novos clientes e €150K em vendas.',
  'sales.placeholder.project.name': 'Ex: Campanha de Vendas B2B',

  // HR specific translations
  'hr.field.desired.role': 'Cargo Desejado',
  'hr.placeholder.desired.role': 'Ex: Recrutador',
  'hr.placeholder.role': 'Ex: Recrutador',
  'hr.field.technologies': 'Ferramentas Utilizadas',
  'hr.placeholder.technologies': 'Ex: Workday, BambooHR, LinkedIn Recruiter',
  'hr.field.technical.skills': 'Competências Técnicas',
  'hr.placeholder.technical.skills': 'Ex: Recrutamento, Seleção, Workday, LinkedIn Recruiter',
  'hr.placeholder.professional.summary': 'Ex: Profissional de Recursos Humanos com 5 anos de experiência em recrutamento e seleção, especializado em recrutamento técnico e gestão de talentos. Experiência em implementação de políticas de RH.',
  'hr.placeholder.experience.description': 'Ex: Recrutei e selecionei candidatos para posições técnicas e de gestão, gerindo todo o processo desde a prospeção até à integração. Utilizei ATS e redes sociais para sourcing.',
  'hr.placeholder.project.description': 'Ex: Projeto de recrutamento para equipa de desenvolvimento, incluindo definição de perfis, sourcing e seleção. Resultado: 8 contratações em 3 meses.',
  'hr.placeholder.project.name': 'Ex: Projeto de Recrutamento',

  // Finance specific translations
  'finance.field.desired.role': 'Cargo Desejado',
  'finance.placeholder.desired.role': 'Ex: Contabilista',
  'finance.placeholder.role': 'Ex: Contabilista',
  'finance.field.technologies': 'Ferramentas Utilizadas',
  'finance.placeholder.technologies': 'Ex: SAP, Excel, QuickBooks, Primavera',
  'finance.field.technical.skills': 'Competências Técnicas',
  'finance.placeholder.technical.skills': 'Ex: SAP, Excel, Contabilidade, Análise Financeira',
  'finance.placeholder.professional.summary': 'Ex: Contabilista com 7 anos de experiência em contabilidade empresarial, especializado em análise financeira e relatórios fiscais. Experiência em auditoria e controlo interno.',
  'finance.placeholder.experience.description': 'Ex: Gestionei a contabilidade de 15 empresas, preparando relatórios mensais, trimestrais e anuais. Implementei processos de controlo interno e otimizei fluxos de trabalho.',
  'finance.placeholder.project.description': 'Ex: Projeto de implementação de sistema de contabilidade, incluindo migração de dados e formação de utilizadores. Resultado: redução de 30% no tempo de processamento.',
  'finance.placeholder.project.name': 'Ex: Projeto de Contabilidade',

  // Design specific translations
  'design.field.desired.role': 'Cargo Desejado',
  'design.placeholder.desired.role': 'Ex: Designer Gráfico',
  'design.placeholder.role': 'Ex: Designer Gráfico',
  'design.field.technologies': 'Ferramentas Utilizadas',
  'design.placeholder.technologies': 'Ex: Adobe Creative Suite, Figma, Sketch',
  'design.field.technical.skills': 'Competências Técnicas',
  'design.placeholder.technical.skills': 'Ex: Photoshop, Illustrator, Figma, Design Thinking',
  'design.placeholder.professional.summary': 'Ex: Designer Gráfico com 6 anos de experiência em design digital e impressão, especializado em identidade visual e design de interfaces. Apaixonado por criar experiências visuais memoráveis.',
  'design.placeholder.experience.description': 'Ex: Criei identidades visuais para 20+ marcas, incluindo logos, guidelines e materiais promocionais. Colaborei com equipas de marketing para desenvolver campanhas visuais.',
  'design.placeholder.project.description': 'Ex: Redesign completo da identidade visual de uma startup, incluindo logo, website e materiais promocionais. Resultado: aumento de 50% no reconhecimento da marca.',
  'design.placeholder.project.name': 'Ex: Projeto de Design',

  // Health specific translations
  'health.field.desired.role': 'Cargo Desejado',
  'health.placeholder.desired.role': 'Ex: Enfermeiro',
  'health.placeholder.role': 'Ex: Enfermeiro',
  'health.field.technologies': 'Ferramentas Utilizadas',
  'health.placeholder.technologies': 'Ex: Sistema de Gestão Hospitalar, Excel',
  'health.field.technical.skills': 'Competências Técnicas',
  'health.placeholder.technical.skills': 'Ex: Gestão de Doentes, Procedimentos Clínicos, Excel',
  'health.placeholder.professional.summary': 'Ex: Enfermeiro com 8 anos de experiência em cuidados intensivos, especializado em gestão de doentes críticos e coordenação de equipas. Experiência em formação de novos profissionais.',
  'health.placeholder.experience.description': 'Ex: Prestei cuidados de enfermagem especializados a doentes críticos em UCI, coordenando equipas de 6 enfermeiros e implementando protocolos de segurança.',
  'health.placeholder.project.description': 'Ex: Projeto de implementação de protocolos de higiene hospitalar, incluindo formação de equipas e monitorização de indicadores. Resultado: redução de 40% em infeções hospitalares.',
  'health.placeholder.project.name': 'Ex: Projeto de Saúde',

  // Education specific translations
  'education.field.desired.role': 'Cargo Desejado',
  'education.placeholder.desired.role': 'Ex: Professor',
  'education.placeholder.role': 'Ex: Professor',
  'education.field.technologies': 'Ferramentas Utilizadas',
  'education.placeholder.technologies': 'Ex: Moodle, Google Classroom, PowerPoint',
  'education.field.technical.skills': 'Competências Técnicas',
  'education.placeholder.technical.skills': 'Ex: Moodle, Google Classroom, Metodologias de Ensino',
  'education.placeholder.professional.summary': 'Ex: Professor com 10 anos de experiência em ensino secundário, especializado em Matemática e Ciências. Experiência em coordenação pedagógica e desenvolvimento de currículos.',
  'education.placeholder.experience.description': 'Ex: Lecionei Matemática e Ciências a turmas de 25-30 alunos, desenvolvendo planos de aula inovadores e utilizando tecnologias educativas para melhorar o envolvimento dos alunos.',
  'education.placeholder.project.description': 'Ex: Projeto de implementação de ensino híbrido, incluindo desenvolvimento de recursos digitais e formação de professores. Resultado: melhoria de 25% no desempenho dos alunos.',
  'education.placeholder.project.name': 'Ex: Projeto Educativo',

  // Admin specific translations
  'admin.field.desired.role': 'Cargo Desejado',
  'admin.placeholder.desired.role': 'Ex: Assistente Administrativo',
  'admin.placeholder.role': 'Ex: Assistente Administrativo',
  'admin.field.technologies': 'Ferramentas Utilizadas',
  'admin.placeholder.technologies': 'Ex: Microsoft Office, SAP, Excel',
  'admin.field.technical.skills': 'Competências Técnicas',
  'admin.placeholder.technical.skills': 'Ex: Microsoft Office, SAP, Gestão de Documentos',
  'admin.placeholder.professional.summary': 'Ex: Assistente Administrativo com 9 anos de experiência em gestão administrativa, especializado em organização de eventos e gestão de documentos. Experiência em coordenação de equipas.',
  'admin.placeholder.experience.description': 'Ex: Gestionei a administração de uma empresa com 50 funcionários, coordenando eventos corporativos, gestão de documentos e apoio à direção executiva.',
  'admin.placeholder.project.description': 'Ex: Projeto de digitalização de processos administrativos, incluindo implementação de sistema de gestão documental e formação de equipas. Resultado: redução de 60% no tempo de processamento.',
  'admin.placeholder.project.name': 'Ex: Projeto Administrativo',

  // Other specific translations
  'other.field.desired.role': 'Cargo Desejado',
  'other.placeholder.desired.role': 'Ex: Especialista',
  'other.placeholder.role': 'Ex: Especialista',
  'other.field.technologies': 'Ferramentas Utilizadas',
  'other.placeholder.technologies': 'Ex: Ferramentas específicas da área',
  'other.field.technical.skills': 'Competências Técnicas',
  'other.placeholder.technical.skills': 'Ex: Competências específicas da área',
  'other.placeholder.professional.summary': 'Ex: Profissional especializado com experiência na área, demonstrando competências relevantes e resultados comprovados. Adaptável e orientado para resultados.',
  'other.placeholder.experience.description': 'Ex: Desenvolvi e implementei projetos na área, demonstrando competências técnicas e soft skills relevantes para o cargo.',
  'other.placeholder.project.description': 'Ex: Projeto específico da área, incluindo objetivos, metodologia e resultados alcançados.',
  'other.placeholder.project.name': 'Ex: Projeto Específico',

  // Development specific activities and achievements
  'development.placeholder.activities': 'Ex: Desenvolvi aplicações web full-stack utilizando React e Node.js\nImplementei APIs RESTful e integração com bases de dados',
  'development.placeholder.achievements': 'Ex: Reduzi o tempo de carregamento da aplicação em 40%\nImplementei testes automatizados com 90% de cobertura',

  // Marketing specific activities and achievements
  'marketing.placeholder.activities': 'Ex: Gestionei campanhas de marketing digital para múltiplos clientes\nImplementei estratégias de SEO e SEM para aumentar visibilidade',
  'marketing.placeholder.achievements': 'Ex: Aumentei o tráfego orgânico em 40% para clientes B2B\nMelhorei a taxa de conversão em 25% através de otimização',

  // Sales specific activities and achievements
  'sales.placeholder.activities': 'Ex: Prospectei e qualifiquei leads para pipeline de vendas\nConduzi demonstrações de produtos e negociações',
  'sales.placeholder.achievements': 'Ex: Excedi metas de vendas em 120% por 3 anos consecutivos\nDesenvolvi pipeline de €500K em novos negócios',

  // HR specific activities and achievements
  'hr.placeholder.activities': 'Ex: Recrutei candidatos para posições técnicas e de gestão\nConduzi entrevistas e avaliações de competências',
  'hr.placeholder.achievements': 'Ex: Reduzi o tempo de contratação em 30%\nAumentei a diversidade da equipa em 40%',

  // Finance specific activities and achievements
  'finance.placeholder.activities': 'Ex: Gestionei contabilidade de múltiplas empresas\nPreparei relatórios financeiros mensais e anuais',
  'finance.placeholder.achievements': 'Ex: Reduzi erros contabilísticos em 60%\nOtimizei processos de fecho mensal em 40%',

  // Design specific activities and achievements
  'design.placeholder.activities': 'Ex: Criei identidades visuais para marcas e produtos\nDesenvolvi materiais promocionais e campanhas',
  'design.placeholder.achievements': 'Ex: Aumentei o reconhecimento da marca em 50%\nReduzi o tempo de produção de materiais em 35%',

  // Health specific activities and achievements
  'health.placeholder.activities': 'Ex: Prestei cuidados de enfermagem especializados\nCoordenei equipas de cuidados de saúde',
  'health.placeholder.achievements': 'Ex: Reduzi infeções hospitalares em 40%\nMelhorei satisfação dos doentes em 60%',

  // Education specific activities and achievements
  'education.placeholder.activities': 'Ex: Lecionei disciplinas de Matemática e Ciências\nDesenvolvi planos de aula inovadores',
  'education.placeholder.achievements': 'Ex: Melhorei desempenho dos alunos em 25%\nImplementei programa de ensino híbrido com sucesso',

  // Admin specific activities and achievements
  'admin.placeholder.activities': 'Ex: Gestionei administração de empresa com 50 funcionários\nCoordenei eventos corporativos e reuniões',
  'admin.placeholder.achievements': 'Ex: Reduzi tempo de processamento administrativo em 60%\nOtimizei gestão de documentos em 50%',

  // Other specific activities and achievements
  'other.placeholder.activities': 'Ex: Desenvolvi projetos específicos da área\nImplementei processos e melhorias',
  'other.placeholder.achievements': 'Ex: Alcançei objetivos específicos da área\nImplementei melhorias com resultados positivos',
};

// English translations
const enTranslations: Record<string, string> = {
  // Header
  'app.title': 'CV Builder',
  'app.subtitle': 'Create a professional resume in minutes',
  'generate.cv': 'Generate CV',
  'generate.resume': 'Generate Resume',
  'generate.ats.resume': 'Generate ATS Resume',
  'preview.cv': 'CV Preview',
  'preview': 'Preview',
  'select.language': 'Choose language:',
  'language.portuguese': 'Português',
  'language.english': 'English',

  // Notifications
  'data.loaded': 'Data automatically loaded from browser.',
  'cv.generated': 'Resume generated successfully! Download should start automatically.',
  'fill.example': 'Fill with example data',
  'validation.required': 'Please fill in all required fields:',
  'validation.name': 'Full name',
  'validation.email': 'Email',
  'validation.role': 'Desired role',
  'validation.resume': 'Professional summary',

  // Form Sections
  'section.personal.info': 'Personal Information',
  'section.professional.summary': 'Professional Summary',
  'section.professional.experience': 'Professional Experience',
  'section.academic.education': 'Academic Education',
  'section.technical.skills': 'Technical Skills',
  'section.languages': 'Languages',
  'section.certifications': 'Certifications & Courses',
  'section.projects': 'Projects',

  // Personal Information
  'field.full.name': 'Full name',
  'field.desired.role': 'Desired Role',
  'field.postal.code': 'Postal Code',
  'field.city': 'City',
  'field.email': 'Email',
  'field.country.code': 'Country Code',
  'field.phone': 'Phone',
  'field.links.social': 'Links & Social Media',
  'field.link.type': 'Link Type',
  'field.url': 'URL',

  // Professional Summary
  'field.professional.summary': 'Professional Summary',
  'resume.placeholder': 'Fullstack developer with experience in developing scalable, responsive, and user-centered web applications. I work with TypeScript, React, Next.js, Node.js, PostgreSQL and Prisma, with strong attention to performance, usability and code quality...',

  // Professional Experience
  'field.role': 'Role',
  'field.company': 'Company',
  'field.start.month': 'Start Month',
  'field.start.year': 'Start Year',
  'field.end.month': 'End Month',
  'field.end.year': 'End Year',
  'field.current': 'Current',
  'field.technologies': 'Technologies Used',
  'field.activities': 'Activities Developed',
  'field.achievements': 'Achievements',
  'field.achievements.helper': 'with metrics',
  'add.experience': 'Add Experience',
  'experience.title': 'Experience',

  // Academic Education
  'field.course': 'Course',
  'field.institution': 'Institution',
  'field.description': 'Description',
  'add.education': 'Add Education',
  'education.title': 'Education',

  // Technical Skills
  'skills.placeholder': 'Ex: JavaScript, React, Node.js, SQL',

  // Languages
  'field.language': 'Language',
  'field.level': 'Level',
  'add.language': 'Add Language',
  'language.title': 'Language',

  // Certifications
  'field.certification': 'Certification',
  'field.issuer': 'Issuer/Institution',
  'field.completion.date': 'Completion Date',
  'field.hours': 'Hours',
  'field.validation.link': 'Validation Link',
  'add.certification': 'Add Certification/Course',
  'certification.title': 'Certification',

  // Projects
  'field.project.name': 'Project Name',
  'field.year': 'Year',
  'field.project.technologies': 'Technologies',
  'field.project.link': 'Link',
  'add.project': 'Add Project',
  'project.title': 'Project',

  // Placeholders
  'placeholder.full.name': 'Ex: John Doe',
  'placeholder.desired.role': 'Ex: Full Stack Developer',
  'placeholder.postal.code': 'Ex: 1234-567',
  'placeholder.city': 'Ex: Lisbon',
  'placeholder.email': 'Ex: email@example.com',
  'placeholder.phone': 'Ex: 912345678',
  'placeholder.role': 'Ex: Full Stack Developer',
  'placeholder.company': 'Ex: Amazon',
  'placeholder.course': 'Ex: Computer Science',
  'placeholder.institution': 'Ex: University of Lisbon',
  'placeholder.certification': 'Ex: AWS Cloud Practitioner Certification',
  'placeholder.issuer': 'Ex: Udemy, Alura, AWS',
  'placeholder.hours': 'Ex: 40 hours',
  'placeholder.validation.link': 'Ex: https://certificate.institution.com/123456',
  'placeholder.project.name': 'Ex: Portfolio Website',
  'placeholder.project.year': 'Ex: 2023',
  'placeholder.project.tech': 'Ex: React, Node.js, MongoDB',
  'placeholder.project.link': 'Ex: https://github.com/user/project',
  'placeholder.project.description': 'Brief project description, objectives, results...',
  'placeholder.activities': 'Describe your responsibilities (one item per line)',
  'placeholder.achievements': 'Ex: I restructured the application architecture using Next.js with SSR, which improved SEO and increased user retention by 25%.',
  'placeholder.education.description': 'Ex: Thesis on artificial intelligence, relevant subjects, academic projects...',
  'placeholder.certification.description': 'Ex: Course focused on REST API development with Node.js...',

  // Dropdown options
  'select.month': 'Select',
  'select.country': 'Select country',
  'select.date': 'Select date',

  // Link types
  'link.type.linkedin': 'LinkedIn',
  'link.type.github': 'GitHub',
  'link.type.gitlab': 'GitLab',
  'link.type.portfolio': 'Portfolio',
  'link.type.other': 'Other',

  // Link placeholders
  'link.placeholder.linkedin': 'Ex: myprofile',
  'link.placeholder.github': 'Ex: user',
  'link.placeholder.gitlab': 'Ex: user',
  'link.placeholder.portfolio': 'Ex: mywebsite.com',
  'link.placeholder.other': 'Ex: mywebsite.com',

  // Months
  'month.jan': 'Jan',
  'month.feb': 'Feb',
  'month.mar': 'Mar',
  'month.apr': 'Apr',
  'month.may': 'May',
  'month.jun': 'Jun',
  'month.jul': 'Jul',
  'month.aug': 'Aug',
  'month.sep': 'Sep',
  'month.oct': 'Oct',
  'month.nov': 'Nov',
  'month.dec': 'Dec',

  // Countries
  'country.portugal': 'Portugal (+351)',
  'country.brazil': 'Brazil (+55)',
  'country.spain': 'Spain (+34)',

  // Empty states
  'empty.experience': 'No experience added',
  'empty.education': 'No education added',
  'empty.language': 'No language added',
  'empty.certification': 'No certification added',
  'empty.project': 'No project added',

  // CV Tips
  'tips.title': 'Tips for an ATS-Friendly Resume',
  'tips.subtitle': 'Follow these recommendations to increase your chances of being selected',
  'tips.extra.title': 'Extra Tip',
  'tips.extra.content': 'The resume generated by this application already follows these best practices, but make sure to customize the content according to each specific offer.',

  // Tip content
  'tip.format.simple': 'Use a simple format (no graphics or tables)',
  'tip.format.simple.desc': 'ATS systems have difficulty reading visual elements. Use only text with a clear structure.',
  'tip.keywords': 'Use exact keywords from the job posting',
  'tip.keywords.desc': 'Copy the terms used in the job posting (technologies, functions, skills). ATS looks for exact matches.',
  'tip.headers': 'Avoid custom headers',
  'tip.headers.desc': 'Use common terms like \'Professional Experience\', \'Education\', \'Skills\'.',
  'tip.format.file': 'Save the resume in .docx or .pdf format (simple)',
  'tip.format.file.desc': 'Some ATS have problems with poorly formatted PDFs or old Word versions.',
  'tip.acronyms': 'Don\'t use acronyms without also writing the meaning',
  'tip.acronyms.desc': 'Example: write \'JavaScript (JS)\' or \'Database (DB)\' to ensure it is recognized.',
  'tip.chronological': 'Put information in reverse chronological order',
  'tip.chronological.desc': 'Start with the most recent experience, as that\'s what the ATS and recruiter want to see.',
  'tip.job.titles': 'Include common job titles',
  'tip.job.titles.desc': 'Use generic names like \'Backend Developer\', \'Systems Analyst\', etc., even if the official job title was different.',
  'tip.spelling': 'Avoid spelling errors',
  'tip.spelling.desc': 'ATS may not recognize misspelled words, which can lead to resume exclusion.',
  'tip.technical.skills': 'Include a technical skills section',
  'tip.technical.skills.desc': 'List the technologies, languages and tools you used (e.g., Java, Git, SQL, Docker).',

  // Actions
  'actions': 'Actions',

  // CV Type Selector
  'cv.type.selector': 'Resume Type',
  'cv.type.development': 'Development/IT',
  'cv.type.marketing': 'Marketing/Digital',
  'cv.type.sales': 'Sales/Commercial',
  'cv.type.hr': 'Human Resources',
  'cv.type.finance': 'Finance/Accounting',
  'cv.type.design': 'Design/Creative',
  'cv.type.health': 'Healthcare/Medicine',
  'cv.type.education': 'Education/Teaching',
  'cv.type.admin': 'Administration/Management',
  'cv.type.other': 'Other',

  // Development specific translations
  'development.field.desired.role': 'Desired Role',
  'development.placeholder.desired.role': 'Ex: Full Stack Developer',
  'development.placeholder.role': 'Ex: Full Stack Developer',
  'development.field.technologies': 'Technologies Used',
  'development.placeholder.technologies': 'Ex: TypeScript, React, Node.js, PostgreSQL',
  'development.field.technical.skills': 'Technical Skills',
  'development.placeholder.technical.skills': 'Ex: JavaScript, React, Node.js, SQL, Git, Docker',
  'development.placeholder.professional.summary': 'Ex: Full Stack Developer with 5 years of experience in web development, specialized in React, Node.js and databases. Passionate about creating scalable and efficient solutions.',
  'development.placeholder.experience.description': 'Ex: Developed and maintained full-stack web applications using React, Node.js and PostgreSQL. Implemented authentication features, RESTful APIs and external system integrations.',
  'development.placeholder.project.description': 'Ex: Full-stack web application for task management with authentication, interactive dashboard and RESTful API. Used React, Node.js and MongoDB.',
  'development.placeholder.project.name': 'Ex: Portfolio Website',

  // Marketing specific translations
  'marketing.field.desired.role': 'Desired Role',
  'marketing.placeholder.desired.role': 'Ex: Digital Marketing Manager',
  'marketing.placeholder.role': 'Ex: Digital Marketing Manager',
  'marketing.field.technologies': 'Tools Used',
  'marketing.placeholder.technologies': 'Ex: Google Analytics, Facebook Ads, Mailchimp, Canva',
  'marketing.field.technical.skills': 'Technical Skills',
  'marketing.placeholder.technical.skills': 'Ex: Google Analytics, Facebook Ads, SEO, Email Marketing',
  'marketing.placeholder.professional.summary': 'Ex: Digital Marketing Professional with 4 years of experience in online campaigns, specialized in SEO, SEM and data analysis. Experience in social media management and email marketing.',
  'marketing.placeholder.experience.description': 'Ex: Managed digital marketing campaigns for B2B and B2C clients, increasing organic traffic by 40% and improving conversion rate by 25%.',
  'marketing.placeholder.project.description': 'Ex: Digital marketing campaign for product launch, including social media strategy, email marketing and paid advertising. Result: 300% increase in sales.',
  'marketing.placeholder.project.name': 'Ex: Digital Marketing Campaign',

  // Sales specific translations
  'sales.field.desired.role': 'Desired Role',
  'sales.placeholder.desired.role': 'Ex: Sales Representative',
  'sales.placeholder.role': 'Ex: Sales Representative',
  'sales.field.technologies': 'Tools Used',
  'sales.placeholder.technologies': 'Ex: Salesforce, HubSpot, LinkedIn Sales Navigator',
  'sales.field.technical.skills': 'Technical Skills',
  'sales.placeholder.technical.skills': 'Ex: CRM, Prospecting, Negotiation, LinkedIn',
  'sales.placeholder.professional.summary': 'Ex: Sales Representative with 6 years of B2B sales experience, specialized in client prospecting and deal closing. Proven track record of exceeding sales targets.',
  'sales.placeholder.experience.description': 'Ex: Developed and maintained a €500K sales pipeline, prospecting new clients and managing relationships with existing clients. Used CRM to optimize sales processes.',
  'sales.placeholder.project.description': 'Ex: Sales campaign for new SaaS product, including prospecting, demos and negotiation. Result: 15 new clients and €150K in sales.',
  'sales.placeholder.project.name': 'Ex: B2B Sales Campaign',

  // HR specific translations
  'hr.field.desired.role': 'Desired Role',
  'hr.placeholder.desired.role': 'Ex: Recruiter',
  'hr.placeholder.role': 'Ex: Recruiter',
  'hr.field.technologies': 'Tools Used',
  'hr.placeholder.technologies': 'Ex: Workday, BambooHR, LinkedIn Recruiter',
  'hr.field.technical.skills': 'Technical Skills',
  'hr.placeholder.technical.skills': 'Ex: Recruitment, Selection, Workday, LinkedIn Recruiter',
  'hr.placeholder.professional.summary': 'Ex: Human Resources Professional with 5 years of experience in recruitment and selection, specialized in technical recruitment and talent management. Experience in HR policy implementation.',
  'hr.placeholder.experience.description': 'Ex: Recruited and selected candidates for technical and management positions, managing the entire process from prospecting to onboarding. Used ATS and social networks for sourcing.',
  'hr.placeholder.project.description': 'Ex: Recruitment project for development team, including profile definition, sourcing and selection. Result: 8 hires in 3 months.',
  'hr.placeholder.project.name': 'Ex: Recruitment Project',

  // Finance specific translations
  'finance.field.desired.role': 'Desired Role',
  'finance.placeholder.desired.role': 'Ex: Accountant',
  'finance.placeholder.role': 'Ex: Accountant',
  'finance.field.technologies': 'Tools Used',
  'finance.placeholder.technologies': 'Ex: SAP, Excel, QuickBooks, Primavera',
  'finance.field.technical.skills': 'Technical Skills',
  'finance.placeholder.technical.skills': 'Ex: SAP, Excel, Accounting, Financial Analysis',
  'finance.placeholder.professional.summary': 'Ex: Accountant with 7 years of business accounting experience, specialized in financial analysis and tax reporting. Experience in auditing and internal control.',
  'finance.placeholder.experience.description': 'Ex: Managed accounting for 15 companies, preparing monthly, quarterly and annual reports. Implemented internal control processes and optimized workflows.',
  'finance.placeholder.project.description': 'Ex: Accounting system implementation project, including data migration and user training. Result: 30% reduction in processing time.',
  'finance.placeholder.project.name': 'Ex: Accounting Project',

  // Design specific translations
  'design.field.desired.role': 'Desired Role',
  'design.placeholder.desired.role': 'Ex: Graphic Designer',
  'design.placeholder.role': 'Ex: Graphic Designer',
  'design.field.technologies': 'Tools Used',
  'design.placeholder.technologies': 'Ex: Adobe Creative Suite, Figma, Sketch',
  'design.field.technical.skills': 'Technical Skills',
  'design.placeholder.technical.skills': 'Ex: Photoshop, Illustrator, Figma, Design Thinking',
  'design.placeholder.professional.summary': 'Ex: Graphic Designer with 6 years of experience in digital and print design, specialized in visual identity and interface design. Passionate about creating memorable visual experiences.',
  'design.placeholder.experience.description': 'Ex: Created visual identities for 20+ brands, including logos, guidelines and promotional materials. Collaborated with marketing teams to develop visual campaigns.',
  'design.placeholder.project.description': 'Ex: Complete visual identity redesign for a startup, including logo, website and promotional materials. Result: 50% increase in brand recognition.',
  'design.placeholder.project.name': 'Ex: Design Project',

  // Health specific translations
  'health.field.desired.role': 'Desired Role',
  'health.placeholder.desired.role': 'Ex: Nurse',
  'health.placeholder.role': 'Ex: Nurse',
  'health.field.technologies': 'Tools Used',
  'health.placeholder.technologies': 'Ex: Hospital Management System, Excel',
  'health.field.technical.skills': 'Technical Skills',
  'health.placeholder.technical.skills': 'Ex: Patient Management, Clinical Procedures, Excel',
  'health.placeholder.professional.summary': 'Ex: Nurse with 8 years of intensive care experience, specialized in critical patient management and team coordination. Experience in training new professionals.',
  'health.placeholder.experience.description': 'Ex: Provided specialized nursing care to critical patients in ICU, coordinating teams of 6 nurses and implementing safety protocols.',
  'health.placeholder.project.description': 'Ex: Hospital hygiene protocol implementation project, including team training and indicator monitoring. Result: 40% reduction in hospital infections.',
  'health.placeholder.project.name': 'Ex: Healthcare Project',

  // Education specific translations
  'education.field.desired.role': 'Desired Role',
  'education.placeholder.desired.role': 'Ex: Teacher',
  'education.placeholder.role': 'Ex: Teacher',
  'education.field.technologies': 'Tools Used',
  'education.placeholder.technologies': 'Ex: Moodle, Google Classroom, PowerPoint',
  'education.field.technical.skills': 'Technical Skills',
  'education.placeholder.technical.skills': 'Ex: Moodle, Google Classroom, Teaching Methodologies',
  'education.placeholder.professional.summary': 'Ex: Teacher with 10 years of secondary education experience, specialized in Mathematics and Sciences. Experience in pedagogical coordination and curriculum development.',
  'education.placeholder.experience.description': 'Ex: Taught Mathematics and Sciences to classes of 25-30 students, developing innovative lesson plans and using educational technologies to improve student engagement.',
  'education.placeholder.project.description': 'Ex: Hybrid teaching implementation project, including digital resource development and teacher training. Result: 25% improvement in student performance.',
  'education.placeholder.project.name': 'Ex: Educational Project',

  // Admin specific translations
  'admin.field.desired.role': 'Desired Role',
  'admin.placeholder.desired.role': 'Ex: Administrative Assistant',
  'admin.placeholder.role': 'Ex: Administrative Assistant',
  'admin.field.technologies': 'Tools Used',
  'admin.placeholder.technologies': 'Ex: Microsoft Office, SAP, Excel',
  'admin.field.technical.skills': 'Technical Skills',
  'admin.placeholder.technical.skills': 'Ex: Microsoft Office, SAP, Document Management',
  'admin.placeholder.professional.summary': 'Ex: Administrative Assistant with 9 years of administrative management experience, specialized in event organization and document management. Experience in team coordination.',
  'admin.placeholder.experience.description': 'Ex: Managed administration for a company with 50 employees, coordinating corporate events, document management and executive support.',
  'admin.placeholder.project.description': 'Ex: Administrative process digitization project, including document management system implementation and team training. Result: 60% reduction in processing time.',
  'admin.placeholder.project.name': 'Ex: Administrative Project',

  // Other specific translations
  'other.field.desired.role': 'Desired Role',
  'other.placeholder.desired.role': 'Ex: Specialist',
  'other.placeholder.role': 'Ex: Specialist',
  'other.field.technologies': 'Tools Used',
  'other.placeholder.technologies': 'Ex: Area-specific tools',
  'other.field.technical.skills': 'Technical Skills',
  'other.placeholder.technical.skills': 'Ex: Area-specific skills',
  'other.placeholder.professional.summary': 'Ex: Specialized professional with experience in the area, demonstrating relevant skills and proven results. Adaptable and results-oriented.',
  'other.placeholder.experience.description': 'Ex: Developed and implemented projects in the area, demonstrating technical skills and soft skills relevant to the position.',
  'other.placeholder.project.description': 'Ex: Area-specific project, including objectives, methodology and achieved results.',
  'other.placeholder.project.name': 'Ex: Specific Project',

  // Development specific activities and achievements
  'development.placeholder.activities': 'Ex: Developed full-stack web applications using React and Node.js\nImplemented RESTful APIs and database integration',
  'development.placeholder.achievements': 'Ex: Reduced application loading time by 40%\nImplemented automated tests with 90% coverage',

  // Marketing specific activities and achievements
  'marketing.placeholder.activities': 'Ex: Managed digital marketing campaigns for multiple clients\nImplemented SEO and SEM strategies to increase visibility',
  'marketing.placeholder.achievements': 'Ex: Increased organic traffic by 40% for B2B clients\nImproved conversion rate by 25% through optimization',

  // Sales specific activities and achievements
  'sales.placeholder.activities': 'Ex: Prospected and qualified leads for sales pipeline\nConducted product demos and negotiations',
  'sales.placeholder.achievements': 'Ex: Exceeded sales targets by 120% for 3 consecutive years\nDeveloped €500K pipeline in new business',

  // HR specific activities and achievements
  'hr.placeholder.activities': 'Ex: Recruited candidates for technical and management positions\nConducted interviews and competency assessments',
  'hr.placeholder.achievements': 'Ex: Reduced hiring time by 30%\nIncreased team diversity by 40%',

  // Finance specific activities and achievements
  'finance.placeholder.activities': 'Ex: Managed accounting for multiple companies\nPrepared monthly and annual financial reports',
  'finance.placeholder.achievements': 'Ex: Reduced accounting errors by 60%\nOptimized monthly closing processes by 40%',

  // Design specific activities and achievements
  'design.placeholder.activities': 'Ex: Created visual identities for brands and products\nDeveloped promotional materials and campaigns',
  'design.placeholder.achievements': 'Ex: Increased brand recognition by 50%\nReduced material production time by 35%',

  // Health specific activities and achievements
  'health.placeholder.activities': 'Ex: Provided specialized nursing care\nCoordinated healthcare teams',
  'health.placeholder.achievements': 'Ex: Reduced hospital infections by 40%\nImproved patient satisfaction by 60%',

  // Education specific activities and achievements
  'education.placeholder.activities': 'Ex: Taught Mathematics and Sciences subjects\nDeveloped innovative lesson plans',
  'education.placeholder.achievements': 'Ex: Improved student performance by 25%\nSuccessfully implemented hybrid teaching program',

  // Admin specific activities and achievements
  'admin.placeholder.activities': 'Ex: Managed administration for company with 50 employees\nCoordinated corporate events and meetings',
  'admin.placeholder.achievements': 'Ex: Reduced administrative processing time by 60%\nOptimized document management by 50%',

  // Other specific activities and achievements
  'other.placeholder.activities': 'Ex: Developed area-specific projects\nImplemented processes and improvements',
  'other.placeholder.achievements': 'Ex: Achieved area-specific objectives\nImplemented improvements with positive results',
}; 