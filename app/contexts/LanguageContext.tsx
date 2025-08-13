'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for available languages
export type Language = 'pt' | 'en' | 'es';

// Available CV types
export type CVType = 'development' | 'marketing' | 'sales' | 'hr' | 'finance' | 'design' | 'health' | 'education' | 'admin' | 'other';

// Context interface for language and CV type management
interface LanguageContextType {
  language: Language;

  setLanguage: (lang: Language) => void;
  cvType: CVType;
  setCVType: (type: CVType) => void;
  t: (key: string) => string;
}

// Create the LanguageContext with the defined interface
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Props for the LanguageProvider component
interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * LanguageProvider component
 * Provides language, CV type, and translation context to the application.
 * Loads preferences from localStorage and detects browser language if not set.
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('pt');
  const [cvType, setCVTypeState] = useState<CVType>('development');

  // Effect: Load language and CV type from localStorage on initialization.
  // If not set, detect browser language. Handles errors gracefully.
  useEffect(() => {
    try {
      // Only run in browser
      if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem('cv-builder-language') as Language;
        if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en' || savedLanguage === 'es')) {
          setLanguageState(savedLanguage);
        } else {
          // Detect browser language if not set
          const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
          let detectedLanguage: Language = 'en';
          if (browserLanguage.startsWith('pt')) {
            detectedLanguage = 'pt';
          } else if (browserLanguage.startsWith('es')) {
            detectedLanguage = 'es';
          }
          setLanguageState(detectedLanguage);
          localStorage.setItem('cv-builder-language', detectedLanguage);
        }

        const savedCVType = localStorage.getItem('cv-builder-type') as CVType;
        if (savedCVType && ['development', 'marketing', 'sales', 'hr', 'finance', 'design', 'health', 'education', 'admin', 'other'].includes(savedCVType)) {
          setCVTypeState(savedCVType);
        }
      }
    } catch (error) {
      console.error('Error initializing language:', error);
    }
  }, []);

  // Change language and persist to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cv-builder-language', lang);
  };

  // Change CV type and persist to localStorage
  const setCVType = (type: CVType) => {
    setCVTypeState(type);
    localStorage.setItem('cv-builder-type', type);
  };

  /**
   * Translation function
   * Returns the translation for a given key based on the current language.
   * If the key is CV type-specific, returns the appropriate translation.
   */
  const t = (key: string): string => {
    let translations: Record<string, string>;
    if (language === 'pt') {
      translations = ptTranslations;
    } else if (language === 'es') {
      translations = esTranslations;
    } else {
      translations = enTranslations;
    }

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

/**
 * Custom hook to use the LanguageContext.
 * Throws an error if used outside of LanguageProvider.
 */
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
  'app.title': 'EasyPeasyCV',
  'app.subtitle': 'Crie um currículo profissional em minutos',

  // Landing Page
  'landing.open.source.badge': 'Projeto Open Source',
  'landing.hero.title': 'Cria o teu CV profissional em minutos',
  'landing.hero.subtitle': 'EasyPeasyCV é uma ferramenta gratuita e open source para criar CVs profissionais. Sem registos, sem custos, sem complicações.',
  'landing.create.cv.button': 'Criar CV Agora',
  'landing.view.github.button': 'Ver no GitHub',
  'landing.stats.templates': 'Templates',
  'landing.stats.free': 'Gratuito',
  'landing.stats.unlimited': 'CVs Ilimitados',
  'landing.stats.languages': 'Idiomas',

  // Features Section
  'landing.features.title': 'Porquê escolher EasyPeasyCV?',
  'landing.features.subtitle': 'Tudo o que precisas para criar um CV profissional, sem complicações.',
  'landing.features.templates.title': 'Templates Profissionais',
  'landing.features.templates.description': '6 templates elegantes e profissionais: Clássico, Profissional, Timeline, Moderno, Criativo e Minimal',
  'landing.features.customization.title': 'Personalização Total',
  'landing.features.customization.description': 'Escolhe cores, reorganiza secções e personaliza cada detalhe',
  'landing.features.responsive.title': 'Responsivo',
  'landing.features.responsive.description': 'Funciona perfeitamente em desktop, tablet e telemóvel',
  'landing.features.autosave.title': 'Auto-Save',
  'landing.features.autosave.description': 'Os teus dados são guardados automaticamente no navegador',
  'landing.features.multilang.title': 'Multi-idioma',
  'landing.features.multilang.description': 'Disponível em Português, Inglês e Espanhol',
  'landing.features.privacy.title': 'Privacidade',
  'landing.features.privacy.description': 'Tudo fica no teu navegador, sem servidores externos',

  // Templates Section
  'landing.templates.title': 'Templates Disponíveis',
  'landing.templates.subtitle': 'Escolhe o template que melhor se adapta ao teu perfil profissional.',
  'landing.templates.classic.name': 'Clássico',
  'landing.templates.classic.description': 'Elegante e tradicional',
  'landing.templates.classic.features': 'Layout limpo,Fonte profissional,Cores neutras',
  'landing.templates.professional.name': 'Profissional',
  'landing.templates.professional.description': 'Sério e tipograficamente refinado',
  'landing.templates.professional.features': 'Cabeçalho sólido,Tipografia destacada,Detalhes subtis',
  'landing.templates.timeline.name': 'Timeline',
  'landing.templates.timeline.description': 'Experiência em formato de linha do tempo',
  'landing.templates.timeline.features': 'Linha temporal,Marcos visuais,Leitura sequencial',
  'landing.templates.modern.name': 'Moderno',
  'landing.templates.modern.description': 'Limpo e contemporâneo',
  'landing.templates.modern.features': 'Design minimalista,Espaçamento generoso,Tipografia moderna',
  'landing.templates.creative.name': 'Criativo',
  'landing.templates.creative.description': 'Original e expressivo',
  'landing.templates.creative.features': 'Cores vibrantes,Layout único,Elementos visuais',
  'landing.templates.minimal.name': 'Minimal',
  'landing.templates.minimal.description': 'Essencial e direto ao ponto',
  'landing.templates.minimal.features': 'Barra lateral limpa,Secções simples,Enfoque no conteúdo',
  'landing.templates.use.button': 'Usar Template',

  // How it works Section
  'landing.how.title': 'Como Funciona',
  'landing.how.subtitle': 'Criar o teu CV nunca foi tão simples. Segue estes 3 passos:',
  'landing.how.step1.title': 'Preenche os Dados',
  'landing.how.step1.description': 'Adiciona as tuas informações pessoais, experiência profissional e educação',
  'landing.how.step2.title': 'Personaliza',
  'landing.how.step2.description': 'Escolhe o template, cores e reorganiza as secções',
  'landing.how.step3.title': 'Descarrega',
  'landing.how.step3.description': 'Gera e descarrega o teu CV em PDF',

  // Testimonials Section
  'landing.benefits.title': 'Vantagens do EasyPeasyCV',
  'landing.benefits.subtitle': 'Descobre porque o EasyPeasyCV é a escolha certa para o teu CV profissional',

  'landing.benefits.privacy.title': 'Privacidade Total',
  'landing.benefits.privacy.subtitle': 'Os teus dados ficam sempre seguros',
  'landing.benefits.privacy.description': 'Todos os dados são guardados localmente no teu navegador. Nenhuma informação é enviada para servidores externos.',

  'landing.benefits.ats.title': 'Otimizado para ATS',
  'landing.benefits.ats.subtitle': 'Compatível com sistemas de recrutamento',
  'landing.benefits.ats.description': 'Os nossos templates estão otimizados para passar nos sistemas de rastreio de candidatos (ATS) das empresas.',

  'landing.benefits.performance.title': 'Rápido e Eficiente',
  'landing.benefits.performance.subtitle': 'Geração instantânea de PDF',
  'landing.benefits.performance.description': 'Gera o teu CV em PDF de alta qualidade em segundos, sem esperas nem complicações.',

  // Open Source Section
  'landing.opensource.title': 'Projeto Open Source',
  'landing.opensource.subtitle': 'EasyPeasyCV é um projeto open source. Contribuições são bem-vindas! Juntos podemos tornar esta ferramenta ainda melhor.',
  'landing.opensource.contribute.button': 'Contribuir no GitHub',
  'landing.opensource.support.button': 'Apoiar o Projeto',

  // CTA Section
  'landing.cta.title': 'Pronto para criar o teu CV?',
  'landing.cta.subtitle': 'Começa agora mesmo e cria um CV profissional em minutos',
  'landing.cta.button': 'Criar CV Gratuitamente',
  'generate.cv': 'Gerar CV',
  'generate.resume': 'Gerar Currículo',
  'generate.ats.resume': 'Gerar CV',
  'data.xml.title': 'Dados (XML)',
  'data.xml.export': 'Exportar XML',
  'data.xml.import': 'Importar XML',
  'preview.cv': 'Preview do CV',
  'preview': 'Preview',
  'select.language': 'Escolher idioma:',
  'language.portuguese': 'Português',
  'language.english': 'English',
  'language.spanish': 'Español',

  // Notifications
  'data.loaded': 'Dados carregados automaticamente do navegador.',
  'data.loaded.local': 'Dados carregados automaticamente do navegador.',
  'data.loaded.xml': 'Dados importados a partir de XML.',
  'cv.generated': 'Currículo gerado com sucesso! O download deve começar automaticamente.',
  'fill.example': 'Preencher com dados de exemplo',
  'validation.required': 'Por favor, preencha todos os campos obrigatórios:',
  'validation.name': 'Nome completo',
  'validation.email': 'Email',
  'validation.role': 'Cargo desejado',
  'validation.resume': 'Resumo profissional',

  // Thank you modal
  'thank.you.title': 'Obrigado por usar o EasyPeasyCV!',
  'thank.you.message': 'O seu currículo foi gerado com sucesso. Esperamos que esta ferramenta tenha sido útil para si. Se gostou do projeto, considere fazer uma pequena doação para ajudar a manter o desenvolvimento.',
  'thank.you.close': 'Fechar',
  'donation.title': 'Apoiar o Projeto',
  'donation.message': 'As suas doações ajudam a manter o EasyPeasyCV gratuito e a melhorar continuamente a ferramenta.',
  'donation.button': 'Fazer Doação',

  // Form Sections
  'section.personal.info': 'Informações Pessoais',
  'section.professional.summary': 'Resumo Profissional',
  'section.professional.experience': 'Experiência Profissional',
  'section.academic.education': 'Educação Académica',
  'section.technical.skills': 'Competências Técnicas',
  'section.languages': 'Línguas',
  'section.certifications': 'Certificações e Cursos',
  'section.volunteer': 'Voluntariado',
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
  'field.education.type': 'Tipo de Formação',
  'field.education.status': 'Estado',
  'add.education': 'Adicionar Formação',
  'education.title': 'Educação',

  // Education types
  'education.type.secondary': 'Ensino Secundário',
  'education.type.technical': 'Técnico',
  'education.type.bachelor': 'Licenciatura',
  'education.type.postgraduate': 'Pós-graduação',
  'education.type.master': 'Mestrado',
  'education.type.phd': 'Doutoramento',

  // Education status
  'education.status.completed': 'Completo',
  'education.status.in.progress': 'Em andamento',
  'education.status.interrupted': 'Interrompido',

  // Technical Skills
  'skills.placeholder': 'Ex: JavaScript, React, Node.js, SQL',
  'field.technical.skills.helper': 'Separe as competências por vírgula',

  // Languages
  'field.language': 'Língua',
  'field.level': 'Nível',
  'add.language': 'Adicionar Língua',
  'language.title': 'Língua',

  // Language levels - CEFR (Common European Framework of Reference for Languages)
  'language.level.a1': 'A1',
  'language.level.a2': 'A2',
  'language.level.b1': 'B1',
  'language.level.b2': 'B2',
  'language.level.c1': 'C1',
  'language.level.c2': 'C2',

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
  'field.project.sourceCode': 'Código-fonte',
  'add.project': 'Adicionar Projeto',
  'project.title': 'Projeto',

  // Volunteer Work
  'field.organization': 'Organização',
  'field.impact': 'Impacto',
  'add.volunteer': 'Adicionar Voluntariado',
  'volunteer.title': 'Voluntariado',

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
  'placeholder.validation.link': 'Ex: www.certificate.institution.com/123456',
  'placeholder.project.name': 'Ex: Portfolio Website',
  'placeholder.project.year': 'Ex: 2023',
  'placeholder.project.tech': 'Ex: React, Node.js, MongoDB',
  'placeholder.project.link': 'Ex: www.meuprojeto.com',
  'placeholder.project.sourceCode': 'Ex: www.github.com/user/repo',
  'placeholder.project.description': 'Breve descrição do projeto, objetivos, resultados...',
  'placeholder.organization': 'Ex: Cruz Vermelha Portuguesa',
  'placeholder.volunteer.role': 'Ex: Voluntário de Apoio Social',
  'placeholder.volunteer.description': 'Ex: Prestação de apoio social a famílias carenciadas, distribuição de alimentos e roupas.',
  'placeholder.volunteer.impact': 'Ex: Ajudou mais de 50 famílias durante a pandemia, organizou campanhas de recolha de donativos.',
  'placeholder.activities': 'Descreva suas responsabilidades (um item por linha)',
  'placeholder.achievements': 'Ex: Reestruturei a arquitetura da aplicação usando Next.js com SSR, o que melhorou o SEO e aumentou a retenção de usuários em 25%.',
  'placeholder.education.description': 'Ex: Tese sobre inteligência artificial, disciplinas relevantes, projetos académicos...',
  'placeholder.certification.description': 'Ex: Curso focado em desenvolvimento de APIs REST com Node.js...',
  'placeholder.year': 'Ex: 2023',
  'placeholder.language': 'Ex: Inglês',

  // Dropdown options
  'select.month': 'Selecione',
  'select.country': 'Selecionar país',
  'select.date': 'Selecionar data',
  'select.education.type': 'Selecione',
  'select.education.status': 'Selecione',
  'select.language.level': 'Selecione',

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

  // Custom link name
  'field.link.custom.name': 'Nome da Plataforma',
  'placeholder.link.custom.name': 'Ex: Behance, Dribbble, Medium',

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
  'empty.volunteer': 'Nenhum voluntariado adicionado',
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

  // Template selector
  'template.selector': 'Selecionar Template',
  'template.classic.name': 'Clássico',
  'template.classic.description': 'Layout tradicional e profissional',
  'template.professional.name': 'Profissional',
  'template.professional.description': 'Layout profissional',
  'template.modern.name': 'Moderno',
  'template.modern.description': 'Design limpo e minimalista',
  'template.creative.name': 'Criativo',
  'template.creative.description': 'Layout inovador e expressivo',
  'template.minimal.name': 'Minimalista',
  'template.minimal.description': 'Design limpo e focado no essencial',
  'template.timeline.name': 'Linha do Tempo',
  'template.timeline.description': 'Experiência em formato cronológico',
  'color.selector': 'Selecionar Cor',

  // Actions
  'actions': 'Ações',
  'cv.actions': 'Opções do CV',
  'extra.features': 'Funcionalidades Extra',

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

  // Job Analysis
  'job.analysis.title': 'Análise de Vagas',
  'job.analysis.subtitle': 'Introduza o texto da vaga para receber conselhos personalizados',
  'job.analysis.input.label': 'Texto da Vaga',
  'job.analysis.input.placeholder': 'Cole aqui o texto completo da oferta de emprego...',
  'job.analysis.analyze': 'Analisar Vaga',
  'job.analysis.analyzing': 'A analisar...',
  'job.analysis.clear': 'Limpar',
  'job.analysis.results': 'Resultados da Análise',
  'job.analysis.error': 'Erro ao analisar a vaga. Tente novamente.',
  'job.analysis.tips.title': 'Como usar esta funcionalidade',
  'job.analysis.tips.content': 'Cole o texto completo da oferta de emprego no campo acima. O sistema irá analisar automaticamente as competências requeridas, nível de experiência e tipo de contrato, fornecendo conselhos personalizados para adaptar o seu CV.',

  // Job Analysis Results
  'job.analysis.skills.title': 'Competências Identificadas',
  'job.analysis.skills.found': 'Competências encontradas na vaga',
  'job.analysis.skills.advice': 'Certifique-se de incluir estas competências no seu CV, especialmente na secção de competências técnicas e experiências profissionais.',
  'job.analysis.skills.notFound': 'Não foram identificadas competências técnicas específicas. Considere incluir competências gerais relevantes para a área.',

  'job.analysis.experience.title': 'Nível de Experiência',
  'job.analysis.experience.senior': 'Esta vaga requer um nível sénior. Destaque experiências de liderança, gestão de projetos e responsabilidades estratégicas no seu CV.',
  'job.analysis.experience.mid': 'Esta vaga requer um nível intermédio. Foque-se em experiências práticas e resultados quantificáveis.',
  'job.analysis.experience.entry': 'Esta vaga é adequada para candidatos com pouca experiência. Destaque projetos académicos, estágios e competências técnicas.',

  'job.analysis.type.title': 'Tipo de Contrato',
  'job.analysis.type.remote': 'Esta vaga permite trabalho remoto. Destaque experiências de trabalho autónomo e competências de comunicação virtual.',
  'job.analysis.type.partTime': 'Esta vaga é a tempo parcial. Adapte o seu CV para mostrar flexibilidade e gestão eficiente do tempo.',
  'job.analysis.type.fullTime': 'Esta vaga é a tempo inteiro. Destaque compromisso e disponibilidade total para o projeto.',

  'job.analysis.general.title': 'Conselhos Gerais',
  'job.analysis.general.advice': 'Personalize o seu CV de acordo com esta análise. Utilize palavras-chave da vaga, destaque experiências relevantes e adapte o resumo profissional para alinhar com os requisitos identificados.',

  // Job Analysis Actions
  'job.analysis.action.button': 'Analisar Vaga',
  'job.analysis.action.description': 'Analise uma oferta de emprego para receber conselhos personalizados',

  // CV Tips Actions
  'cv.tips.action.button': 'Dicas CV',
  'cv.tips.action.description': 'Consulte dicas para criar um CV que passe em sistemas ATS',

  // ATS Explanation
  'ats.explanation.title': 'O que são Sistemas ATS?',
  'ats.explanation.subtitle': 'Compreenda como funcionam e por que são importantes para o seu CV',
  'ats.explanation.what.title': 'O que é um Sistema ATS?',
  'ats.explanation.what.description': 'ATS (Applicant Tracking System) é um software que as empresas utilizam para gerir candidaturas de emprego. Estes sistemas analisam automaticamente os CVs recebidos, procurando palavras-chave e critérios específicos antes de os enviar para revisão humana.',
  'ats.explanation.why.title': 'Por que é importante?',
  'ats.explanation.why.description': 'Mais de 75% das empresas utilizam sistemas ATS para filtrar candidaturas. Se o seu CV não for otimizado para estes sistemas, pode ser automaticamente rejeitado, mesmo que tenha as qualificações necessárias.',
  'ats.explanation.why.warning': 'Sem otimização ATS, o seu CV pode ser rejeitado automaticamente, mesmo sendo qualificado para a vaga!',
  'ats.explanation.how.title': 'Como otimizar o seu CV para ATS',
  'ats.explanation.how.description': 'Siga estas dicas para aumentar as hipóteses do seu CV passar nos filtros ATS:',
  'ats.explanation.how.tip1': 'Utilize palavras-chave exatas do anúncio da vaga',
  'ats.explanation.how.tip2': 'Mantenha um formato simples, sem gráficos ou tabelas',
  'ats.explanation.how.tip3': 'Use cabeçalhos padrão como "Experiência Profissional" e "Educação"',
  'ats.explanation.how.tip4': 'Inclua uma secção de competências técnicas com tecnologias relevantes',
  'ats.explanation.template.title': 'Recomendação de Template',
  'ats.explanation.template.description': 'Para máxima compatibilidade com sistemas ATS, recomendamos o template clássico, que foi especificamente desenhado para passar nos filtros automáticos.',
  'ats.explanation.template.recommendation': 'Template Clássico Recomendado',
  'ats.explanation.extra.title': 'Dica Importante',
  'ats.explanation.extra.content': 'O template clássico deste OpenCVLab foi otimizado para sistemas ATS, mas sempre personalize o conteúdo de acordo com cada vaga específica.',

  // ATS Explanation Actions
  'ats.explanation.action.button': 'Explicação ATS',
  'ats.explanation.action.description': 'Aprenda sobre sistemas ATS e como otimizar o seu CV',

  // Calendar
  'calendar.clear': 'Limpar',
  'calendar.today': 'Hoje',
  'calendar.month.january': 'Janeiro',
  'calendar.month.february': 'Fevereiro',
  'calendar.month.march': 'Março',
  'calendar.month.april': 'Abril',
  'calendar.month.may': 'Maio',
  'calendar.month.june': 'Junho',
  'calendar.month.july': 'Julho',
  'calendar.month.august': 'Agosto',
  'calendar.month.september': 'Setembro',
  'calendar.month.october': 'Outubro',
  'calendar.month.november': 'Novembro',
  'calendar.month.december': 'Dezembro',
  'calendar.day.sun': 'Dom',
  'calendar.day.mon': 'Seg',
  'calendar.day.tue': 'Ter',
  'calendar.day.wed': 'Qua',
  'calendar.day.thu': 'Qui',
  'calendar.day.fri': 'Sex',
  'calendar.day.sat': 'Sáb',

  // Error 404 Page
  'error.404.title': 'Página não encontrada',
  'error.404.description': 'A página que procuras não existe ou foi movida. Verifica o URL ou navega de volta à página inicial.',
  'error.404.home.button': 'Voltar à Página Inicial',
  'error.404.builder.button': 'Criar CV',
  'error.404.helpful.title': 'Páginas úteis',
  'error.404.helpful.features.title': 'Funcionalidades',
  'error.404.helpful.features.description': 'Descobre todas as funcionalidades do EasyPeasyCV para criar o teu CV profissional.',
  'error.404.helpful.templates.title': 'Templates',
  'error.404.helpful.templates.description': 'Explora os nossos templates profissionais e personaliza o teu CV.',

  // Privacy Policy Page
  'privacy.title': 'Política de Privacidade',
  'privacy.last.updated': 'Última atualização',
  'privacy.introduction.title': 'Introdução',
  'privacy.introduction.description': 'A EasyPeasyCV está empenhada em proteger a tua privacidade. Esta política explica como funcionamos.',
  'privacy.no.collection.title': 'Não Recolhemos Dados',
  'privacy.no.collection.description': 'O EasyPeasyCV é uma aplicação simples que funciona inteiramente no teu navegador. Não recolhemos, armazenamos ou processamos nenhum dado pessoal.',
  'privacy.no.collection.highlight': 'Os teus dados ficam sempre no teu dispositivo e nunca são enviados para servidores externos.',
  'privacy.local.storage.title': 'Armazenamento Local',
  'privacy.local.storage.description': 'Todos os dados são armazenados localmente no teu navegador:',
  'privacy.local.storage.browser': 'Os dados ficam no teu navegador (localStorage)',
  'privacy.local.storage.no.server': 'Nenhuma informação é enviada para servidores',
  'privacy.local.storage.control': 'Tens controlo total sobre os teus dados',
  'privacy.cookies.title': 'Cookies',
  'privacy.cookies.description': 'Utilizamos apenas cookies essenciais para o funcionamento do serviço.',
  'privacy.cookies.essential': 'Estes cookies são necessários para o funcionamento básico da aplicação.',
  'privacy.third.party.title': 'Serviços de Terceiros',
  'privacy.third.party.description': 'Utilizamos apenas serviços externos para funcionalidades específicas:',
  'privacy.third.party.github': 'GitHub - Para hospedar o código fonte e issues',
  'privacy.third.party.ko.fi': 'Ko-fi - Para donativos (opcional)',
  'privacy.changes.title': 'Alterações à Política',
  'privacy.changes.description': 'Podemos atualizar esta política ocasionalmente. Notificaremos os utilizadores sobre alterações significativas.',
  'privacy.contact.title': 'Contacto',
  'privacy.contact.description': 'Se tiveres questões sobre esta política de privacidade, contacta-nos:',
  'privacy.back.home': 'Voltar à Página Inicial',

  // Terms of Service Page
  'terms.title': 'Termos de Serviço',
  'terms.last.updated': 'Última atualização',
  'terms.introduction.title': 'Introdução',
  'terms.introduction.description': 'Ao utilizar o EasyPeasyCV, aceitas estes termos de serviço. Lê-os cuidadosamente antes de utilizar a aplicação.',
  'terms.acceptance.title': 'Aceitação dos Termos',
  'terms.acceptance.description': 'Ao aceder ou utilizar o EasyPeasyCV, confirmas que leste, compreendeste e aceitas estar vinculado a estes termos de serviço.',
  'terms.service.title': 'Descrição do Serviço',
  'terms.service.description': 'O EasyPeasyCV é uma aplicação web que permite:',
  'terms.service.features.cv': 'Criar e editar currículos profissionais',
  'terms.service.features.templates': 'Utilizar templates profissionais personalizáveis',
  'terms.service.features.pdf': 'Exportar CVs em formato PDF',
  'terms.service.features.local': 'Armazenamento local dos dados no navegador',
  'terms.responsibilities.title': 'Responsabilidades do Utilizador',
  'terms.responsibilities.description': 'Como utilizador, és responsável por:',
  'terms.responsibilities.accurate': 'Fornecer informações precisas e atualizadas',
  'terms.responsibilities.legal': 'Utilizar o serviço de acordo com a lei aplicável',
  'terms.responsibilities.compliance': 'Cumprir todos os termos e condições',
  'terms.prohibited.title': 'Utilizações Proibidas',
  'terms.prohibited.description': 'Não podes utilizar o serviço para:',
  'terms.prohibited.illegal': 'Atividades ilegais ou fraudulentas',
  'terms.prohibited.harmful': 'Causar danos ou interferir com o serviço',
  'terms.prohibited.copyright': 'Violar direitos de propriedade intelectual',
  'terms.intellectual.title': 'Propriedade Intelectual',
  'terms.intellectual.description': 'O EasyPeasyCV e todo o seu conteúdo são propriedade dos seus criadores. Manténs os direitos sobre o conteúdo que crias.',
  'terms.intellectual.user.content': 'O conteúdo do teu CV é da tua responsabilidade e propriedade.',
  'terms.privacy.title': 'Privacidade e Dados',
  'terms.privacy.description': 'A recolha e utilização de dados pessoais é regida pela nossa Política de Privacidade.',
  'terms.privacy.policy': 'Consulta a nossa',
  'terms.privacy.link': 'Política de Privacidade',
  'terms.availability.title': 'Disponibilidade do Serviço',
  'terms.availability.description': 'Esforçamo-nos por manter o serviço disponível, mas não garantimos disponibilidade contínua:',
  'terms.availability.maintenance': 'Manutenção programada pode causar interrupções',
  'terms.availability.updates': 'Atualizações podem afetar temporariamente o serviço',
  'terms.availability.force': 'Eventos fora do nosso controlo podem afetar a disponibilidade',
  'terms.disclaimers.title': 'Exclusões de Responsabilidade',
  'terms.disclaimers.description': 'O serviço é fornecido "tal como está" sem garantias:',
  'terms.disclaimers.warranty': 'Não garantimos que o serviço seja livre de erros',
  'terms.disclaimers.accuracy': 'Não garantimos a precisão do conteúdo gerado',
  'terms.disclaimers.employment': 'Não garantimos emprego ou resultados de candidaturas',
  'terms.law.title': 'Lei Aplicável',
  'terms.law.description': 'Estes termos são regidos pela lei portuguesa.',
  'terms.changes.title': 'Alterações aos Termos',
  'terms.changes.description': 'Podemos alterar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.',
  'terms.contact.title': 'Contacto',
  'terms.contact.description': 'Para questões sobre estes termos, contacta-nos:',
  'terms.back.home': 'Voltar à Página Inicial',

  // Footer
  'footer.privacy': 'Privacidade',
  'footer.terms': 'Termos',
};

// English translations
const enTranslations: Record<string, string> = {
  'landing.benefits.title': 'EasyPeasyCV Advantages',
  'landing.benefits.subtitle': 'Discover why EasyPeasyCV is the right choice for your professional CV',
  'landing.benefits.privacy.title': 'Complete Privacy',
  'landing.benefits.privacy.subtitle': 'Your data stays secure',
  'landing.benefits.privacy.description': 'All data is stored locally in your browser. No information is sent to external servers.',
  'landing.benefits.ats.title': 'ATS Optimized',
  'landing.benefits.ats.subtitle': 'Compatible with recruitment systems',
  'landing.benefits.ats.description': 'Our templates are optimized to pass through company applicant tracking systems (ATS).',
  'landing.benefits.performance.title': 'Fast and Efficient',
  'landing.benefits.performance.subtitle': 'Instant PDF generation',
  'landing.benefits.performance.description': 'Generate your high-quality CV in PDF in seconds, without waiting or complications.',
  // Header
  'app.title': 'EasyPeasyCV',
  'app.subtitle': 'Create a professional resume in minutes',

  // Landing Page
  'landing.open.source.badge': 'Open Source Project',
  'landing.hero.title': 'Create your professional CV in minutes',
  'landing.hero.subtitle': 'EasyPeasyCV is a free and open source tool for creating professional CVs. No registration, no costs, no complications.',
  'landing.create.cv.button': 'Create CV Now',
  'landing.view.github.button': 'View on GitHub',
  'landing.stats.templates': 'Templates',
  'landing.stats.free': 'Free',
  'landing.stats.unlimited': 'Unlimited CVs',
  'landing.stats.languages': 'Languages',

  // Features Section
  'landing.features.title': 'Why choose EasyPeasyCV?',
  'landing.features.subtitle': 'Everything you need to create a professional CV, without complications.',
  'landing.features.templates.title': 'Professional Templates',
  'landing.features.templates.description': '6 elegant and professional templates: Classic, Professional, Timeline, Modern, Creative and Minimal',
  'landing.features.customization.title': 'Full Customization',
  'landing.features.customization.description': 'Choose colors, reorder sections and customize every detail',
  'landing.features.responsive.title': 'Responsive',
  'landing.features.responsive.description': 'Works perfectly on desktop, tablet and mobile',
  'landing.features.autosave.title': 'Auto-Save',
  'landing.features.autosave.description': 'Your data is automatically saved in the browser',
  'landing.features.multilang.title': 'Multi-language',
  'landing.features.multilang.description': 'Available in Portuguese, English and Spanish',
  'landing.features.privacy.title': 'Privacy',
  'landing.features.privacy.description': 'Everything stays in your browser, no external servers',

  // Templates Section
  'landing.templates.title': 'Available Templates',
  'landing.templates.subtitle': 'Choose the template that best fits your professional profile.',
  'landing.templates.classic.name': 'Classic',
  'landing.templates.classic.description': 'Elegant and traditional',
  'landing.templates.classic.features': 'Clean layout,Professional font,Neutral colors',
  'landing.templates.professional.name': 'Professional',
  'landing.templates.professional.description': 'Serious look with refined typography',
  'landing.templates.professional.features': 'Solid header,Typographic emphasis,Subtle accents',
  'landing.templates.timeline.name': 'Timeline',
  'landing.templates.timeline.description': 'Experience laid out as a timeline',
  'landing.templates.timeline.features': 'Time rail,Visual milestones,Sequential reading',
  'landing.templates.modern.name': 'Modern',
  'landing.templates.modern.description': 'Clean and contemporary',
  'landing.templates.modern.features': 'Minimalist design,Generous spacing,Modern typography',
  'landing.templates.creative.name': 'Creative',
  'landing.templates.creative.description': 'Original and expressive',
  'landing.templates.creative.features': 'Vibrant colors,Unique layout,Visual elements',
  'landing.templates.minimal.name': 'Minimal',
  'landing.templates.minimal.description': 'Essential and straight to the point',
  'landing.templates.minimal.features': 'Clean sidebar,Simple sections,Content-focused',
  'landing.templates.use.button': 'Use Template',

  // How it works Section
  'landing.how.title': 'How it Works',
  'landing.how.subtitle': 'Creating your CV has never been so simple. Follow these 3 steps:',
  'landing.how.step1.title': 'Fill in Your Data',
  'landing.how.step1.description': 'Add your personal information, professional experience and education',
  'landing.how.step2.title': 'Customize',
  'landing.how.step2.description': 'Choose template, colors and reorder sections',
  'landing.how.step3.title': 'Download',
  'landing.how.step3.description': 'Generate and download your CV as PDF',

  // Testimonials Section
  'landing.testimonials.title': 'What users say',
  'landing.testimonials.maria.name': 'Maria Silva',
  'landing.testimonials.maria.role': 'Frontend Developer',
  'landing.testimonials.maria.quote': '"I created my CV in 10 minutes. The modern template was perfect!"',
  'landing.testimonials.joao.name': 'João Santos',
  'landing.testimonials.joao.role': 'Project Manager',
  'landing.testimonials.joao.quote': '"Very intuitive interface. I was able to customize everything easily."',
  'landing.testimonials.ana.name': 'Ana Costa',
  'landing.testimonials.ana.role': 'UX/UI Designer',
  'landing.testimonials.ana.quote': '"I loved the creative template. I stood out from the competition!"',

  // Open Source Section
  'landing.opensource.title': 'Open Source Project',
  'landing.opensource.subtitle': 'EasyPeasyCV is an open source project. Contributions are welcome! Together we can make this tool even better.',
  'landing.opensource.contribute.button': 'Contribute on GitHub',
  'landing.opensource.support.button': 'Support the Project',

  // CTA Section
  'landing.cta.title': 'Ready to create your CV?',
  'landing.cta.subtitle': 'Start now and create a professional CV in minutes',
  'landing.cta.button': 'Create CV for Free',
  'generate.cv': 'Generate CV',
  'generate.resume': 'Generate Resume',
  'generate.ats.resume': 'Generate CV',
  'data.xml.title': 'Data (XML)',
  'data.xml.export': 'Export XML',
  'data.xml.import': 'Import XML',
  'preview.cv': 'CV Preview',
  'preview': 'Preview',
  'select.language': 'Choose language:',
  'language.portuguese': 'Português',
  'language.english': 'English',
  'language.spanish': 'Español',

  // Notifications
  'data.loaded': 'Data automatically loaded from browser.',
  'data.loaded.local': 'Data automatically loaded from browser.',
  'data.loaded.xml': 'Data imported from XML.',
  'cv.generated': 'Resume generated successfully! Download should start automatically.',
  'fill.example': 'Fill with example data',
  'validation.required': 'Please fill in all required fields:',
  'validation.name': 'Full name',
  'validation.email': 'Email',
  'validation.role': 'Desired role',
  'validation.resume': 'Professional summary',

  // Thank you modal
  'thank.you.title': 'Thank you for using EasyPeasyCV!',
  'thank.you.message': 'Your resume has been generated successfully. We hope this tool has been useful for you. If you liked the project, consider making a small donation to help maintain development.',
  'thank.you.close': 'Close',
  'donation.title': 'Support the Project',
  'donation.message': 'Your donations help keep EasyPeasyCV free and continuously improve the tool.',
  'donation.button': 'Make Donation',

  // Form Sections
  'section.personal.info': 'Personal Information',
  'section.professional.summary': 'Professional Summary',
  'section.professional.experience': 'Professional Experience',
  'section.academic.education': 'Academic Education',
  'section.technical.skills': 'Technical Skills',
  'section.languages': 'Languages',
  'section.certifications': 'Certifications & Courses',
  'section.volunteer': 'Volunteer Work',
  'section.projects': 'Projects',

  // Personal Information
  'field.full.name': 'Full name',
  'field.desired.role': 'Desired Role',
  'field.postal.code': 'ZIP code',
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
  'field.education.type': 'Education Type',
  'field.education.status': 'Status',
  'add.education': 'Add Education',
  'education.title': 'Education',

  // Education types
  'education.type.secondary': 'Secondary Education',
  'education.type.technical': 'Technical',
  'education.type.bachelor': 'Bachelor\'s Degree',
  'education.type.postgraduate': 'Postgraduate',
  'education.type.master': 'Master\'s Degree',
  'education.type.phd': 'PhD',

  // Education status
  'education.status.completed': 'Completed',
  'education.status.in.progress': 'In Progress',
  'education.status.interrupted': 'Interrupted',

  // Technical Skills
  'skills.placeholder': 'e.g., JavaScript, React, Node.js, SQL',
  'field.technical.skills.helper': 'Separate skills by comma',

  // Languages
  'field.language': 'Language',
  'field.level': 'Level',
  'add.language': 'Add Language',
  'language.title': 'Language',

  // Language levels - CEFR (Common European Framework of Reference for Languages)
  'language.level.a1': 'A1',
  'language.level.a2': 'A2',
  'language.level.b1': 'B1',
  'language.level.b2': 'B2',
  'language.level.c1': 'C1',
  'language.level.c2': 'C2',

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
  'field.project.sourceCode': 'Source Code',
  'add.project': 'Add Project',
  'project.title': 'Project',

  // Volunteer Work
  'field.organization': 'Organization',
  'field.impact': 'Impact',
  'add.volunteer': 'Add Volunteer Work',
  'volunteer.title': 'Volunteer Work',

  // Placeholders
  'placeholder.full.name': 'e.g., John Doe',
  'placeholder.desired.role': 'e.g., Full Stack Developer',
  'placeholder.postal.code': 'e.g., 12345',
  'placeholder.city': 'e.g., Lisbon',
  'placeholder.email': 'e.g., email@example.com',
  'placeholder.phone': 'e.g., 912345678',
  'placeholder.role': 'e.g., Full Stack Developer',
  'placeholder.company': 'e.g., Amazon',
  'placeholder.course': 'e.g., Computer Science',
  'placeholder.institution': 'e.g., University of Lisbon',
  'placeholder.certification': 'e.g., AWS Cloud Practitioner Certification',
  'placeholder.issuer': 'e.g., Udemy, Alura, AWS',
  'placeholder.hours': 'e.g., 40 hours',
  'placeholder.validation.link': 'e.g., www.certificate.institution.com/123456',
  'placeholder.project.name': 'e.g., Portfolio Website',
  'placeholder.project.year': 'e.g., 2023',
  'placeholder.project.tech': 'e.g., React, Node.js, MongoDB',
  'placeholder.project.link': 'e.g., www.myproject.com',
  'placeholder.project.sourceCode': 'e.g., www.github.com/user/repo',
  'placeholder.project.description': 'Brief project description, objectives, results...',
  'placeholder.organization': 'e.g., Red Cross Portugal',
  'placeholder.volunteer.role': 'e.g., Social Support Volunteer',
  'placeholder.volunteer.description': 'e.g., Providing social support to families in need, distributing food and clothing.',
  'placeholder.volunteer.impact': 'e.g., Helped more than 50 families during the pandemic, organized donation campaigns.',
  'placeholder.activities': 'Describe your responsibilities (one item per line)',
  'placeholder.achievements': 'e.g., I restructured the application architecture using Next.js with SSR, which improved SEO and increased user retention by 25%.',
  'placeholder.education.description': 'e.g., Thesis on artificial intelligence, relevant subjects, academic projects...',
  'placeholder.certification.description': 'e.g., Course focused on REST API development with Node.js...',
  'placeholder.year': 'e.g., 2023',
  'placeholder.language': 'e.g., English',

  // Dropdown options
  'select.month': 'Select',
  'select.country': 'Select country',
  'select.date': 'Select date',
  'select.education.type': 'Select',
  'select.education.status': 'Select',
  'select.language.level': 'Select',

  // Link types
  'link.type.linkedin': 'LinkedIn',
  'link.type.github': 'GitHub',
  'link.type.gitlab': 'GitLab',
  'link.type.portfolio': 'Portfolio',
  'link.type.other': 'Other',

  // Link placeholders
  'link.placeholder.linkedin': 'e.g., myprofile',
  'link.placeholder.github': 'e.g., user',
  'link.placeholder.gitlab': 'e.g., user',
  'link.placeholder.portfolio': 'e.g., mywebsite.com',
  'link.placeholder.other': 'e.g., mywebsite.com',

  // Custom link name
  'field.link.custom.name': 'Platform Name',
  'placeholder.link.custom.name': 'e.g., Behance, Dribbble, Medium',

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
  'empty.volunteer': 'No volunteer work added',
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

  // Template selector
  'template.selector': 'Select Template',
  'template.classic.name': 'Classic',
  'template.classic.description': 'Traditional and professional layout',
  'template.professional.name': 'Professional',
  'template.professional.description': 'Professional layout',
  'template.modern.name': 'Modern',
  'template.modern.description': 'Clean and minimalist design',
  'template.creative.name': 'Creative',
  'template.creative.description': 'Innovative and expressive layout',
  'template.minimal.name': 'Minimal',
  'template.minimal.description': 'Clean, essentials-first layout',
  'template.timeline.name': 'Timeline',
  'template.timeline.description': 'Chronological experience layout',
  'color.selector': 'Select Color',

  // Actions
  'actions': 'Actions',
  'cv.actions': 'CV Options',
  'extra.features': 'Extra Features',

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
  'development.placeholder.desired.role': 'e.g., Full Stack Developer',
  'development.placeholder.role': 'e.g., Full Stack Developer',
  'development.field.technologies': 'Technologies Used',
  'development.placeholder.technologies': 'e.g., TypeScript, React, Node.js, PostgreSQL',
  'development.field.technical.skills': 'Technical Skills',
  'development.placeholder.technical.skills': 'e.g., JavaScript, React, Node.js, SQL, Git, Docker',
  'development.placeholder.professional.summary': 'e.g., Full Stack Developer with 5 years of experience in web development, specialized in React, Node.js and databases. Passionate about creating scalable and efficient solutions.',
  'development.placeholder.experience.description': 'e.g., Developed and maintained full-stack web applications using React, Node.js and PostgreSQL. Implemented authentication features, RESTful APIs and external system integrations.',
  'development.placeholder.project.description': 'e.g., Full-stack web application for task management with authentication, interactive dashboard and RESTful API. Used React, Node.js and MongoDB.',
  'development.placeholder.project.name': 'e.g., Portfolio Website',

  // Marketing specific translations
  'marketing.field.desired.role': 'Desired Role',
  'marketing.placeholder.desired.role': 'e.g., Digital Marketing Manager',
  'marketing.placeholder.role': 'e.g., Digital Marketing Manager',
  'marketing.field.technologies': 'Tools Used',
  'marketing.placeholder.technologies': 'e.g., Google Analytics, Facebook Ads, Mailchimp, Canva',
  'marketing.field.technical.skills': 'Technical Skills',
  'marketing.placeholder.technical.skills': 'e.g., Google Analytics, Facebook Ads, SEO, Email Marketing',
  'marketing.placeholder.professional.summary': 'e.g., Digital Marketing Professional with 4 years of experience in online campaigns, specialized in SEO, SEM and data analysis. Experience in social media management and email marketing.',
  'marketing.placeholder.experience.description': 'e.g., Managed digital marketing campaigns for B2B and B2C clients, increasing organic traffic by 40% and improving conversion rate by 25%.',
  'marketing.placeholder.project.description': 'e.g., Digital marketing campaign for product launch, including social media strategy, email marketing and paid advertising. Result: 300% increase in sales.',
  'marketing.placeholder.project.name': 'e.g., Digital Marketing Campaign',

  // Sales specific translations
  'sales.field.desired.role': 'Desired Role',
  'sales.placeholder.desired.role': 'e.g., Sales Representative',
  'sales.placeholder.role': 'e.g., Sales Representative',
  'sales.field.technologies': 'Tools Used',
  'sales.placeholder.technologies': 'e.g., Salesforce, HubSpot, LinkedIn Sales Navigator',
  'sales.field.technical.skills': 'Technical Skills',
  'sales.placeholder.technical.skills': 'e.g., CRM, Prospecting, Negotiation, LinkedIn',
  'sales.placeholder.professional.summary': 'e.g., Sales Representative with 6 years of B2B sales experience, specialized in client prospecting and deal closing. Proven track record of exceeding sales targets.',
  'sales.placeholder.experience.description': 'e.g., Developed and maintained a €500K sales pipeline, prospecting new clients and managing relationships with existing clients. Used CRM to optimize sales processes.',
  'sales.placeholder.project.description': 'e.g., Sales campaign for new SaaS product, including prospecting, demos and negotiation. Result: 15 new clients and €150K in sales.',
  'sales.placeholder.project.name': 'e.g., B2B Sales Campaign',

  // HR specific translations
  'hr.field.desired.role': 'Desired Role',
  'hr.placeholder.desired.role': 'e.g., Recruiter',
  'hr.placeholder.role': 'e.g., Recruiter',
  'hr.field.technologies': 'Tools Used',
  'hr.placeholder.technologies': 'e.g., Workday, BambooHR, LinkedIn Recruiter',
  'hr.field.technical.skills': 'Technical Skills',
  'hr.placeholder.technical.skills': 'e.g., Recruitment, Selection, Workday, LinkedIn Recruiter',
  'hr.placeholder.professional.summary': 'e.g., Human Resources Professional with 5 years of experience in recruitment and selection, specialized in technical recruitment and talent management. Experience in HR policy implementation.',
  'hr.placeholder.experience.description': 'e.g., Recruited and selected candidates for technical and management positions, managing the entire process from prospecting to onboarding. Used ATS and social networks for sourcing.',
  'hr.placeholder.project.description': 'e.g., Recruitment project for development team, including profile definition, sourcing and selection. Result: 8 hires in 3 months.',
  'hr.placeholder.project.name': 'e.g., Recruitment Project',

  // Finance specific translations
  'finance.field.desired.role': 'Desired Role',
  'finance.placeholder.desired.role': 'e.g., Accountant',
  'finance.placeholder.role': 'e.g., Accountant',
  'finance.field.technologies': 'Tools Used',
  'finance.placeholder.technologies': 'e.g., SAP, Excel, QuickBooks, Primavera',
  'finance.field.technical.skills': 'Technical Skills',
  'finance.placeholder.technical.skills': 'e.g., SAP, Excel, Accounting, Financial Analysis',
  'finance.placeholder.professional.summary': 'e.g., Accountant with 7 years of business accounting experience, specialized in financial analysis and tax reporting. Experience in auditing and internal control.',
  'finance.placeholder.experience.description': 'e.g., Managed accounting for 15 companies, preparing monthly, quarterly and annual reports. Implemented internal control processes and optimized workflows.',
  'finance.placeholder.project.description': 'e.g., Accounting system implementation project, including data migration and user training. Result: 30% reduction in processing time.',
  'finance.placeholder.project.name': 'e.g., Accounting Project',

  // Design specific translations
  'design.field.desired.role': 'Desired Role',
  'design.placeholder.desired.role': 'e.g., Graphic Designer',
  'design.placeholder.role': 'e.g., Graphic Designer',
  'design.field.technologies': 'Tools Used',
  'design.placeholder.technologies': 'e.g., Adobe Creative Suite, Figma, Sketch',
  'design.field.technical.skills': 'Technical Skills',
  'design.placeholder.technical.skills': 'e.g., Photoshop, Illustrator, Figma, Design Thinking',
  'design.placeholder.professional.summary': 'e.g., Graphic Designer with 6 years of experience in digital and print design, specialized in visual identity and interface design. Passionate about creating memorable visual experiences.',
  'design.placeholder.experience.description': 'e.g., Created visual identities for 20+ brands, including logos, guidelines and promotional materials. Collaborated with marketing teams to develop visual campaigns.',
  'design.placeholder.project.description': 'e.g., Complete visual identity redesign for a startup, including logo, website and promotional materials. Result: 50% increase in brand recognition.',
  'design.placeholder.project.name': 'e.g., Design Project',

  // Health specific translations
  'health.field.desired.role': 'Desired Role',
  'health.placeholder.desired.role': 'e.g., Nurse',
  'health.placeholder.role': 'e.g., Nurse',
  'health.field.technologies': 'Tools Used',
  'health.placeholder.technologies': 'e.g., Hospital Management System, Excel',
  'health.field.technical.skills': 'Technical Skills',
  'health.placeholder.technical.skills': 'e.g., Patient Management, Clinical Procedures, Excel',
  'health.placeholder.professional.summary': 'e.g., Nurse with 8 years of intensive care experience, specialized in critical patient management and team coordination. Experience in training new professionals.',
  'health.placeholder.experience.description': 'e.g., Provided specialized nursing care to critical patients in ICU, coordinating teams of 6 nurses and implementing safety protocols.',
  'health.placeholder.project.description': 'e.g., Hospital hygiene protocol implementation project, including team training and indicator monitoring. Result: 40% reduction in hospital infections.',
  'health.placeholder.project.name': 'e.g., Healthcare Project',

  // Education specific translations
  'education.field.desired.role': 'Desired Role',
  'education.placeholder.desired.role': 'e.g., Teacher',
  'education.placeholder.role': 'e.g., Teacher',
  'education.field.technologies': 'Tools Used',
  'education.placeholder.technologies': 'e.g., Moodle, Google Classroom, PowerPoint',
  'education.field.technical.skills': 'Technical Skills',
  'education.placeholder.technical.skills': 'e.g., Moodle, Google Classroom, Teaching Methodologies',
  'education.placeholder.professional.summary': 'e.g., Teacher with 10 years of secondary education experience, specialized in Mathematics and Sciences. Experience in pedagogical coordination and curriculum development.',
  'education.placeholder.experience.description': 'e.g., Taught Mathematics and Sciences to classes of 25-30 students, developing innovative lesson plans and using educational technologies to improve student engagement.',
  'education.placeholder.project.description': 'e.g., Hybrid teaching implementation project, including digital resource development and teacher training. Result: 25% improvement in student performance.',
  'education.placeholder.project.name': 'e.g., Educational Project',

  // Admin specific translations
  'admin.field.desired.role': 'Desired Role',
  'admin.placeholder.desired.role': 'e.g., Administrative Assistant',
  'admin.placeholder.role': 'e.g., Administrative Assistant',
  'admin.field.technologies': 'Tools Used',
  'admin.placeholder.technologies': 'e.g., Microsoft Office, SAP, Excel',
  'admin.field.technical.skills': 'Technical Skills',
  'admin.placeholder.technical.skills': 'e.g., Microsoft Office, SAP, Document Management',
  'admin.placeholder.professional.summary': 'e.g., Administrative Assistant with 9 years of administrative management experience, specialized in event organization and document management. Experience in team coordination.',
  'admin.placeholder.experience.description': 'e.g., Managed administration for a company with 50 employees, coordinating corporate events, document management and executive support.',
  'admin.placeholder.project.description': 'e.g., Administrative process digitization project, including document management system implementation and team training. Result: 60% reduction in processing time.',
  'admin.placeholder.project.name': 'e.g., Administrative Project',

  // Other specific translations
  'other.field.desired.role': 'Desired Role',
  'other.placeholder.desired.role': 'e.g., Specialist',
  'other.placeholder.role': 'e.g., Specialist',
  'other.field.technologies': 'Tools Used',
  'other.placeholder.technologies': 'e.g., Area-specific tools',
  'other.field.technical.skills': 'Technical Skills',
  'other.placeholder.technical.skills': 'e.g., Area-specific skills',
  'other.placeholder.professional.summary': 'e.g., Specialized professional with experience in the area, demonstrating relevant skills and proven results. Adaptable and results-oriented.',
  'other.placeholder.experience.description': 'e.g., Developed and implemented projects in the area, demonstrating technical skills and soft skills relevant to the position.',
  'other.placeholder.project.description': 'e.g., Area-specific project, including objectives, methodology and achieved results.',
  'other.placeholder.project.name': 'e.g., Specific Project',

  // Development specific activities and achievements
  'development.placeholder.activities': 'e.g., Developed full-stack web applications using React and Node.js\nImplemented RESTful APIs and database integration',
  'development.placeholder.achievements': 'e.g., Reduced application loading time by 40%\nImplemented automated tests with 90% coverage',

  // Marketing specific activities and achievements
  'marketing.placeholder.activities': 'e.g., Managed digital marketing campaigns for multiple clients\nImplemented SEO and SEM strategies to increase visibility',
  'marketing.placeholder.achievements': 'e.g., Increased organic traffic by 40% for B2B clients\nImproved conversion rate by 25% through optimization',

  // Sales specific activities and achievements
  'sales.placeholder.activities': 'e.g., Prospected and qualified leads for sales pipeline\nConducted product demos and negotiations',
  'sales.placeholder.achievements': 'e.g., Exceeded sales targets by 120% for 3 consecutive years\nDeveloped €500K pipeline in new business',

  // HR specific activities and achievements
  'hr.placeholder.activities': 'e.g., Recruited candidates for technical and management positions\nConducted interviews and competency assessments',
  'hr.placeholder.achievements': 'e.g., Reduced hiring time by 30%\nIncreased team diversity by 40%',

  // Finance specific activities and achievements
  'finance.placeholder.activities': 'e.g., Managed accounting for multiple companies\nPrepared monthly and annual financial reports',
  'finance.placeholder.achievements': 'e.g., Reduced accounting errors by 60%\nOptimized monthly closing processes by 40%',

  // Design specific activities and achievements
  'design.placeholder.activities': 'e.g., Created visual identities for brands and products\nDeveloped promotional materials and campaigns',
  'design.placeholder.achievements': 'e.g., Increased brand recognition by 50%\nReduced material production time by 35%',

  // Health specific activities and achievements
  'health.placeholder.activities': 'e.g., Provided specialized nursing care\nCoordinated healthcare teams',
  'health.placeholder.achievements': 'e.g., Reduced hospital infections by 40%\nImproved patient satisfaction by 60%',

  // Education specific activities and achievements
  'education.placeholder.activities': 'e.g., Taught Mathematics and Sciences subjects\nDeveloped innovative lesson plans',
  'education.placeholder.achievements': 'e.g., Improved student performance by 25%\nSuccessfully implemented hybrid teaching program',

  // Admin specific activities and achievements
  'admin.placeholder.activities': 'e.g., Managed administration for company with 50 employees\nCoordinated corporate events and meetings',
  'admin.placeholder.achievements': 'e.g., Reduced administrative processing time by 60%\nOptimized document management by 50%',

  // Other specific activities and achievements
  'other.placeholder.activities': 'e.g., Developed area-specific projects\nImplemented processes and improvements',
  'other.placeholder.achievements': 'e.g., Achieved area-specific objectives\nImplemented improvements with positive results',

  // Job Analysis
  'job.analysis.title': 'Job Analysis',
  'job.analysis.subtitle': 'Enter job posting text to receive personalized advice',
  'job.analysis.input.label': 'Job Posting Text',
  'job.analysis.input.placeholder': 'Paste the complete job posting text here...',
  'job.analysis.analyze': 'Analyze Job',
  'job.analysis.analyzing': 'Analyzing...',
  'job.analysis.clear': 'Clear',
  'job.analysis.results': 'Analysis Results',
  'job.analysis.error': 'Error analyzing job posting. Please try again.',
  'job.analysis.tips.title': 'How to use this feature',
  'job.analysis.tips.content': 'Paste the complete job posting text in the field above. The system will automatically analyze required skills, experience level, and contract type, providing personalized advice to adapt your CV.',

  // Job Analysis Results
  'job.analysis.skills.title': 'Identified Skills',
  'job.analysis.skills.found': 'Skills found in the job posting',
  'job.analysis.skills.advice': 'Make sure to include these skills in your CV, especially in the technical skills section and professional experiences.',
  'job.analysis.skills.notFound': 'No specific technical skills were identified. Consider including general skills relevant to the field.',

  'job.analysis.experience.title': 'Experience Level',
  'job.analysis.experience.senior': 'This job requires a senior level. Highlight leadership experiences, project management, and strategic responsibilities in your CV.',
  'job.analysis.experience.mid': 'This job requires a mid-level. Focus on practical experiences and quantifiable results.',
  'job.analysis.experience.entry': 'This job is suitable for candidates with little experience. Highlight academic projects, internships, and technical skills.',

  'job.analysis.type.title': 'Contract Type',
  'job.analysis.type.remote': 'This job allows remote work. Highlight autonomous work experiences and virtual communication skills.',
  'job.analysis.type.partTime': 'This job is part-time. Adapt your CV to show flexibility and efficient time management.',
  'job.analysis.type.fullTime': 'This job is full-time. Highlight commitment and full availability for the project.',

  'job.analysis.general.title': 'General Advice',
  'job.analysis.general.advice': 'Personalize your CV according to this analysis. Use keywords from the job posting, highlight relevant experiences, and adapt the professional summary to align with the identified requirements.',

  // Job Analysis Actions
  'job.analysis.action.button': 'Analyze Job',
  'job.analysis.action.description': 'Analyze a job posting to receive personalized advice',

  // CV Tips Actions
  'cv.tips.action.button': 'CV Tips',
  'cv.tips.action.description': 'View tips for creating a CV that passes ATS systems',

  // ATS Explanation
  'ats.explanation.title': 'What are ATS Systems?',
  'ats.explanation.subtitle': 'Understand how they work and why they are important for your CV',
  'ats.explanation.what.title': 'What is an ATS System?',
  'ats.explanation.what.description': 'ATS (Applicant Tracking System) is software that companies use to manage job applications. These systems automatically analyze received CVs, looking for specific keywords and criteria before sending them for human review.',
  'ats.explanation.why.title': 'Why is it important?',
  'ats.explanation.why.description': 'More than 75% of companies use ATS systems to filter applications. If your CV is not optimized for these systems, it can be automatically rejected, even if you have the necessary qualifications.',
  'ats.explanation.why.warning': 'Without ATS optimization, your CV can be automatically rejected, even if you are qualified for the position!',
  'ats.explanation.how.title': 'How to optimize your CV for ATS',
  'ats.explanation.how.description': 'Follow these tips to increase your CV\'s chances of passing ATS filters:',
  'ats.explanation.how.tip1': 'Use exact keywords from the job posting',
  'ats.explanation.how.tip2': 'Keep a simple format, without graphics or tables',
  'ats.explanation.how.tip3': 'Use standard headers like "Professional Experience" and "Education"',
  'ats.explanation.how.tip4': 'Include a technical skills section with relevant technologies',
  'ats.explanation.template.title': 'Template Recommendation',
  'ats.explanation.template.description': 'For maximum compatibility with ATS systems, we recommend the classic template, which was specifically designed to pass automatic filters.',
  'ats.explanation.template.recommendation': 'Classic Template Recommended',
  'ats.explanation.extra.title': 'Important Tip',
  'ats.explanation.extra.content': 'The classic template from this OpenCVLab has been optimized for ATS systems, but always personalize the content according to each specific job posting.',

  // ATS Explanation Actions
  'ats.explanation.action.button': 'ATS Explanation',
  'ats.explanation.action.description': 'Learn about ATS systems and how to optimize your CV',

  // Calendar
  'calendar.clear': 'Clear',
  'calendar.today': 'Today',
  'calendar.month.january': 'January',
  'calendar.month.february': 'February',
  'calendar.month.march': 'March',
  'calendar.month.april': 'April',
  'calendar.month.may': 'May',
  'calendar.month.june': 'June',
  'calendar.month.july': 'July',
  'calendar.month.august': 'August',
  'calendar.month.september': 'September',
  'calendar.month.october': 'October',
  'calendar.month.november': 'November',
  'calendar.month.december': 'December',
  'calendar.day.sun': 'Sun',
  'calendar.day.mon': 'Mon',
  'calendar.day.tue': 'Tue',
  'calendar.day.wed': 'Wed',
  'calendar.day.thu': 'Thu',
  'calendar.day.fri': 'Fri',
  'calendar.day.sat': 'Sat',

  // Error 404 Page
  'error.404.title': 'Page Not Found',
  'error.404.description': 'The page you are looking for does not exist or has been moved. Check the URL or navigate back to the home page.',
  'error.404.home.button': 'Back to Home',
  'error.404.builder.button': 'Create CV',
  'error.404.helpful.title': 'Helpful Pages',
  'error.404.helpful.features.title': 'Features',
  'error.404.helpful.features.description': 'Discover all EasyPeasyCV features to create your professional CV.',
  'error.404.helpful.templates.title': 'Templates',
  'error.404.helpful.templates.description': 'Explore our professional templates and customize your CV.',

  // Privacy Policy Page
  'privacy.title': 'Privacy Policy',
  'privacy.last.updated': 'Last Updated',
  'privacy.introduction.title': 'Introduction',
  'privacy.introduction.description': 'EasyPeasyCV is committed to protecting your privacy. This policy explains how we work.',
  'privacy.no.collection.title': 'We Do Not Collect Data',
  'privacy.no.collection.description': 'EasyPeasyCV is a simple application that runs entirely in your browser. We do not collect, store, or process any personal data.',
  'privacy.no.collection.highlight': 'Your data always stays on your device and is never sent to external servers.',
  'privacy.local.storage.title': 'Local Storage',
  'privacy.local.storage.description': 'All data is stored locally in your browser:',
  'privacy.local.storage.browser': 'Data stays in your browser (localStorage)',
  'privacy.local.storage.no.server': 'No information is sent to servers',
  'privacy.local.storage.control': 'You have full control over your data',
  'privacy.cookies.title': 'Cookies',
  'privacy.cookies.description': 'We use only essential cookies for service operation.',
  'privacy.cookies.essential': 'These cookies are necessary for basic application functionality.',
  'privacy.third.party.title': 'Third-party Services',
  'privacy.third.party.description': 'We only use external services for specific functionalities:',
  'privacy.third.party.github': 'GitHub - To host source code and issues',
  'privacy.third.party.ko.fi': 'Ko-fi - For donations (optional)',
  'privacy.changes.title': 'Policy Changes',
  'privacy.changes.description': 'We may update this policy occasionally. We will notify users of significant changes.',
  'privacy.contact.title': 'Contact',
  'privacy.contact.description': 'If you have questions about this privacy policy, contact us:',
  'privacy.back.home': 'Back to Home',

  // Terms of Service Page
  'terms.title': 'Terms of Service',
  'terms.last.updated': 'Last Updated',
  'terms.introduction.title': 'Introduction',
  'terms.introduction.description': 'By using EasyPeasyCV, you accept these terms of service. Read them carefully before using the application.',
  'terms.acceptance.title': 'Acceptance of Terms',
  'terms.acceptance.description': 'By accessing or using EasyPeasyCV, you confirm that you have read, understood, and agree to be bound by these terms of service.',
  'terms.service.title': 'Service Description',
  'terms.service.description': 'EasyPeasyCV is a web application that allows:',
  'terms.service.features.cv': 'Create and edit professional resumes',
  'terms.service.features.templates': 'Use customizable professional templates',
  'terms.service.features.pdf': 'Export CVs in PDF format',
  'terms.service.features.local': 'Local storage of data in browser',
  'terms.responsibilities.title': 'User Responsibilities',
  'terms.responsibilities.description': 'As a user, you are responsible for:',
  'terms.responsibilities.accurate': 'Providing accurate and up-to-date information',
  'terms.responsibilities.legal': 'Using the service in accordance with applicable law',
  'terms.responsibilities.compliance': 'Complying with all terms and conditions',
  'terms.prohibited.title': 'Prohibited Uses',
  'terms.prohibited.description': 'You may not use the service for:',
  'terms.prohibited.illegal': 'Illegal or fraudulent activities',
  'terms.prohibited.harmful': 'Causing harm or interfering with the service',
  'terms.prohibited.copyright': 'Violating intellectual property rights',
  'terms.intellectual.title': 'Intellectual Property',
  'terms.intellectual.description': 'EasyPeasyCV and all its content are the property of its creators. You retain rights to the content you create.',
  'terms.intellectual.user.content': 'Your CV content is your responsibility and property.',
  'terms.privacy.title': 'Privacy and Data',
  'terms.privacy.description': 'The collection and use of personal data is governed by our Privacy Policy.',
  'terms.privacy.policy': 'See our',
  'terms.privacy.link': 'Privacy Policy',
  'terms.availability.title': 'Service Availability',
  'terms.availability.description': 'We strive to keep the service available, but we do not guarantee continuous availability:',
  'terms.availability.maintenance': 'Scheduled maintenance may cause interruptions',
  'terms.availability.updates': 'Updates may temporarily affect the service',
  'terms.availability.force': 'Events beyond our control may affect availability',
  'terms.disclaimers.title': 'Disclaimers',
  'terms.disclaimers.description': 'The service is provided "as is" without warranties:',
  'terms.disclaimers.warranty': 'We do not guarantee the service is error-free',
  'terms.disclaimers.accuracy': 'We do not guarantee the accuracy of generated content',
  'terms.disclaimers.employment': 'We do not guarantee employment or application results',

  'terms.law.title': 'Governing Law',
  'terms.law.description': 'These terms are governed by Portuguese law.',
  'terms.changes.title': 'Changes to Terms',
  'terms.changes.description': 'We may change these terms at any time. Changes will take effect immediately upon publication.',
  'terms.contact.title': 'Contact',
  'terms.contact.description': 'For questions about these terms, contact us:',
  'terms.back.home': 'Back to Home',

  // Footer
  'footer.privacy': 'Privacy',
  'footer.terms': 'Terms',
};

// Spanish translations
const esTranslations: Record<string, string> = {
  // CV Type specific fields
  'cvType.field.desired.role': 'Cargo Deseado',
  'cvType.field.technical.skills': 'Competencias Técnicas',
  'cvType.field.technologies': 'Tecnologías Utilizadas',
  // Header
  'app.title': 'EasyPeasyCV',
  'app.subtitle': 'Crea un currículum profesional en minutos',

  // Development specific placeholders
  'development.placeholder.desired.role': 'Ej: Desarrollador Full Stack',
  'development.placeholder.professional.summary': 'Ej: Desarrollador Full Stack con 5 años de experiencia en desarrollo web, especializado en React, Node.js y bases de datos. Apasionado por crear soluciones escalables y eficientes.',
  'development.placeholder.activities': 'Ej: Desarrollé aplicaciones web full-stack utilizando React y Node.js\nImplementé APIs RESTful e integración con bases de datos',
  'development.placeholder.achievements': 'Ej: Reduje el tiempo de carga de la aplicación en un 40%\nImplementé pruebas automatizadas con 90% de cobertura',

  // Marketing specific placeholders
  'marketing.placeholder.desired.role': 'Ej: Gerente de Marketing Digital',
  'marketing.placeholder.professional.summary': 'Ej: Profesional de Marketing Digital con 4 años de experiencia en campañas online, especializado en SEO, SEM y análisis de datos. Experiencia en gestión de redes sociales y email marketing.',
  'marketing.placeholder.activities': 'Ej: Gestioné campañas de marketing digital para múltiples clientes\nImplementé estrategias de SEO y SEM para aumentar la visibilidad',
  'marketing.placeholder.achievements': 'Ej: Aumenté el tráfico orgánico en un 40% para clientes B2B\nMejoré la tasa de conversión en un 25% mediante optimización',

  // Sales specific placeholders
  'sales.placeholder.desired.role': 'Ej: Representante de Ventas',
  'sales.placeholder.professional.summary': 'Ej: Representante de Ventas con 6 años de experiencia en ventas B2B, especializado en prospección de clientes y cierre de negocios. Historial comprobado de superación de metas de ventas.',
  'sales.placeholder.activities': 'Ej: Prospecté y califiqué leads para el pipeline de ventas\nRealicé demostraciones de productos y negociaciones',
  'sales.placeholder.achievements': 'Ej: Superé las metas de ventas en un 120% durante 3 años consecutivos\nDesarrollé un pipeline de €500K en nuevos negocios',

  // HR specific placeholders
  'hr.placeholder.desired.role': 'Ej: Reclutador',
  'hr.placeholder.professional.summary': 'Ej: Profesional de Recursos Humanos con 5 años de experiencia en reclutamiento y selección, especializado en reclutamiento técnico y gestión de talentos. Experiencia en implementación de políticas de RRHH.',
  'hr.placeholder.activities': 'Ej: Recluté candidatos para posiciones técnicas y de gestión\nRealicé entrevistas y evaluaciones de competencias',
  'hr.placeholder.achievements': 'Ej: Reduje el tiempo de contratación en un 30%\nAumenté la diversidad del equipo en un 40%',

  // Finance specific placeholders
  'finance.placeholder.desired.role': 'Ej: Contable',
  'finance.placeholder.professional.summary': 'Ej: Contable con 7 años de experiencia en contabilidad empresarial, especializado en análisis financiero e informes fiscales. Experiencia en auditoría y control interno.',
  'finance.placeholder.activities': 'Ej: Gestioné la contabilidad para múltiples empresas\nPreparé informes financieros mensuales y anuales',
  'finance.placeholder.achievements': 'Ej: Reduje los errores contables en un 60%\nOptimicé los procesos de cierre mensual en un 40%',

  // Design specific placeholders
  'design.placeholder.desired.role': 'Ej: Diseñador Gráfico',
  'design.placeholder.professional.summary': 'Ej: Diseñador Gráfico con 6 años de experiencia en diseño digital e impreso, especializado en identidad visual y diseño de interfaces. Apasionado por crear experiencias visuales memorables.',
  'design.placeholder.activities': 'Ej: Creé identidades visuales para marcas y productos\nDesarrollé materiales promocionales y campañas',
  'design.placeholder.achievements': 'Ej: Aumenté el reconocimiento de marca en un 50%\nReduje el tiempo de producción de materiales en un 35%',

  // Health specific placeholders
  'health.placeholder.desired.role': 'Ej: Enfermero',
  'health.placeholder.professional.summary': 'Ej: Enfermero con 8 años de experiencia en cuidados intensivos, especializado en gestión de pacientes críticos y coordinación de equipos. Experiencia en formación de nuevos profesionales.',
  'health.placeholder.activities': 'Ej: Proporcioné atención de enfermería especializada\nCoordiné equipos de atención médica',
  'health.placeholder.achievements': 'Ej: Reduje las infecciones hospitalarias en un 40%\nMejoré la satisfacción del paciente en un 60%',

  // Education specific placeholders
  'education.placeholder.desired.role': 'Ej: Profesor',
  'education.placeholder.professional.summary': 'Ej: Profesor con 10 años de experiencia en educación secundaria, especializado en Matemáticas y Ciencias. Experiencia en coordinación pedagógica y desarrollo curricular.',
  'education.placeholder.activities': 'Ej: Enseñé asignaturas de Matemáticas y Ciencias\nDesarrollé planes de lecciones innovadores',
  'education.placeholder.achievements': 'Ej: Mejoré el rendimiento de los estudiantes en un 25%\nImplementé con éxito un programa de enseñanza híbrida',

  // Admin specific placeholders
  'admin.placeholder.desired.role': 'Ej: Asistente Administrativo',
  'admin.placeholder.professional.summary': 'Ej: Asistente Administrativo con 9 años de experiencia en gestión administrativa, especializado en organización de eventos y gestión documental. Experiencia en coordinación de equipos.',
  'admin.placeholder.activities': 'Ej: Gestioné la administración para una empresa con 50 empleados\nCoordiné eventos corporativos y reuniones',
  'admin.placeholder.achievements': 'Ej: Reduje el tiempo de procesamiento administrativo en un 60%\nOptimicé la gestión documental en un 50%',

  // Other specific placeholders
  'other.placeholder.desired.role': 'Ej: Especialista',
  'other.placeholder.professional.summary': 'Ej: Profesional especializado con experiencia en el área, demostrando competencias relevantes y resultados comprobados. Adaptable y orientado a resultados.',
  'other.placeholder.activities': 'Ej: Desarrollé proyectos específicos del área\nImplementé procesos y mejoras',
  'other.placeholder.achievements': 'Ej: Logré objetivos específicos del área\nImplementé mejoras con resultados positivos',
  'other.placeholder.experience.description': 'Ej: Desarrollé e implementé proyectos en el área, demostrando competencias técnicas y habilidades interpersonales relevantes para el puesto.',
  'other.placeholder.project.description': 'Ej: Proyecto específico del área, incluyendo objetivos, metodología y resultados alcanzados.',
  'other.placeholder.project.name': 'Ej: Proyecto Específico',

  // Development specific placeholders for projects and experience
  'development.placeholder.experience.description': 'Ej: Desarrollé aplicaciones web full-stack utilizando React y Node.js. Implementé APIs RESTful y optimicé el rendimiento de la aplicación, reduciendo el tiempo de carga en un 40%.',
  'development.placeholder.project.description': 'Ej: Aplicación web para gestión de tareas desarrollada con React, Node.js y MongoDB. Incluye autenticación, roles de usuario y funcionalidades en tiempo real.',
  'development.placeholder.project.name': 'Ej: Aplicación de Gestión de Tareas',

  // Marketing specific placeholders for projects and experience
  'marketing.placeholder.experience.description': 'Ej: Gestioné campañas de marketing digital para múltiples clientes, implementando estrategias de SEO, SEM y redes sociales que aumentaron el tráfico orgánico en un 40%.',
  'marketing.placeholder.project.description': 'Ej: Campaña de marketing digital para lanzamiento de producto, incluyendo estrategia de contenidos, SEO y redes sociales. Resultado: 200% de aumento en conversiones.',
  'marketing.placeholder.project.name': 'Ej: Campaña de Lanzamiento',

  // Sales specific placeholders for projects and experience
  'sales.placeholder.experience.description': 'Ej: Gestioné una cartera de 50 clientes B2B, desarrollando relaciones comerciales y superando las metas de ventas en un 120% durante tres años consecutivos.',
  'sales.placeholder.project.description': 'Ej: Implementación de nueva estrategia de ventas para mercado internacional, incluyendo prospección, negociación y cierre. Resultado: aumento de 35% en ventas internacionales.',
  'sales.placeholder.project.name': 'Ej: Expansión Internacional',

  // HR specific placeholders for projects and experience
  'hr.placeholder.experience.description': 'Ej: Gestioné procesos de reclutamiento y selección para 30+ posiciones técnicas y gerenciales, reduciendo el tiempo de contratación en un 30% e implementando nuevas políticas de RRHH.',
  'hr.placeholder.project.description': 'Ej: Implementación de nuevo sistema de evaluación de desempeño, incluyendo definición de KPIs, formación y seguimiento. Resultado: mejora de 40% en retención de talento.',
  'hr.placeholder.project.name': 'Ej: Sistema de Evaluación',

  // Finance specific placeholders for projects and experience
  'finance.placeholder.experience.description': 'Ej: Gestioné la contabilidad para 15 empresas, preparando informes mensuales, trimestrales y anuales. Implementé procesos de control interno y optimicé flujos de trabajo.',
  'finance.placeholder.project.description': 'Ej: Proyecto de implementación de sistema contable, incluyendo migración de datos y formación de usuarios. Resultado: reducción del 30% en tiempo de procesamiento.',
  'finance.placeholder.project.name': 'Ej: Proyecto Contable',

  // Design specific placeholders for projects and experience
  'design.placeholder.experience.description': 'Ej: Creé identidades visuales para más de 20 marcas, incluyendo logos, guías de estilo y materiales promocionales. Colaboré con equipos de marketing para desarrollar campañas visuales.',
  'design.placeholder.project.description': 'Ej: Rediseño completo de la identidad visual de una startup, incluyendo logo, sitio web y materiales promocionales. Resultado: aumento del 50% en reconocimiento de marca.',
  'design.placeholder.project.name': 'Ej: Proyecto de Diseño',

  // Health specific placeholders for projects and experience
  'health.placeholder.experience.description': 'Ej: Proporcioné atención especializada a pacientes en unidad de cuidados intensivos, coordinando equipos multidisciplinarios y mejorando protocolos de atención que redujeron las infecciones hospitalarias en un 40%.',
  'health.placeholder.project.description': 'Ej: Implementación de nuevo protocolo de atención al paciente, incluyendo formación del personal y seguimiento. Resultado: mejora del 60% en satisfacción del paciente.',
  'health.placeholder.project.name': 'Ej: Protocolo de Atención',

  // Education specific placeholders for projects and experience
  'education.placeholder.experience.description': 'Ej: Enseñé asignaturas de Matemáticas y Ciencias a estudiantes de secundaria, desarrollando planes de estudio innovadores que mejoraron el rendimiento de los estudiantes en un 25%.',
  'education.placeholder.project.description': 'Ej: Desarrollo e implementación de programa de enseñanza híbrida, incluyendo creación de contenidos digitales y evaluación. Resultado: mejora del 30% en participación estudiantil.',
  'education.placeholder.project.name': 'Ej: Programa Educativo',

  // Admin specific placeholders for projects and experience
  'admin.placeholder.experience.description': 'Ej: Gestioné la administración para una empresa con 50 empleados, coordinando eventos corporativos, optimizando procesos y reduciendo el tiempo de procesamiento administrativo en un 60%.',
  'admin.placeholder.project.description': 'Ej: Proyecto de digitalización de procesos administrativos, incluyendo implementación de sistema de gestión documental y formación de equipos. Resultado: reducción del 60% en tiempo de procesamiento.',
  'admin.placeholder.project.name': 'Ej: Proyecto Administrativo',

  // Technical skills placeholders by CV type
  'development.placeholder.technical.skills': 'Ej: JavaScript, React, Node.js, SQL, Git, Docker',
  'marketing.placeholder.technical.skills': 'Ej: Google Analytics, Facebook Ads, SEO, Email Marketing',
  'sales.placeholder.technical.skills': 'Ej: CRM, Prospección, Negociación, LinkedIn',
  'hr.placeholder.technical.skills': 'Ej: Reclutamiento, Selección, Workday, LinkedIn Recruiter',
  'finance.placeholder.technical.skills': 'Ej: SAP, Excel, Contabilidad, Análisis Financiero',
  'design.placeholder.technical.skills': 'Ej: Photoshop, Illustrator, Figma, Design Thinking',
  'health.placeholder.technical.skills': 'Ej: Gestión de Pacientes, Procedimientos Clínicos, Excel',
  'education.placeholder.technical.skills': 'Ej: Moodle, Google Classroom, Metodologías de Enseñanza',
  'admin.placeholder.technical.skills': 'Ej: Microsoft Office, SAP, Gestión de Documentos',
  'other.placeholder.technical.skills': 'Ej: Competencias específicas del área',

  // Technologies placeholders by CV type
  'development.placeholder.technologies': 'Ej: TypeScript, React, Node.js, PostgreSQL',
  'marketing.placeholder.technologies': 'Ej: Google Analytics, Facebook Ads, Mailchimp, Canva',
  'sales.placeholder.technologies': 'Ej: Salesforce, HubSpot, LinkedIn Sales Navigator',
  'hr.placeholder.technologies': 'Ej: Workday, BambooHR, LinkedIn Recruiter',
  'finance.placeholder.technologies': 'Ej: SAP, Excel, QuickBooks, Primavera',
  'design.placeholder.technologies': 'Ej: Adobe Creative Suite, Figma, Sketch',
  'health.placeholder.technologies': 'Ej: Sistema de Gestión Hospitalaria, Excel',
  'education.placeholder.technologies': 'Ej: Moodle, Google Classroom, PowerPoint',
  'admin.placeholder.technologies': 'Ej: Microsoft Office, SAP, Excel',
  'other.placeholder.technologies': 'Ej: Herramientas específicas del área',

  // Role placeholders by CV type
  'development.placeholder.role': 'Ej: Desarrollador Full Stack',
  'marketing.placeholder.role': 'Ej: Gerente de Marketing Digital',
  'sales.placeholder.role': 'Ej: Representante de Ventas',
  'hr.placeholder.role': 'Ej: Reclutador',
  'finance.placeholder.role': 'Ej: Contable',
  'design.placeholder.role': 'Ej: Diseñador Gráfico',
  'health.placeholder.role': 'Ej: Enfermero',
  'education.placeholder.role': 'Ej: Profesor',
  'admin.placeholder.role': 'Ej: Asistente Administrativo',
  'other.placeholder.role': 'Ej: Especialista',

  // Rule for personal information
  'rule.personal.info': 'La información personal es opcional, pero recomendamos incluir al menos nombre, correo electrónico y teléfono para facilitar el contacto.',

  // Landing Page
  'landing.open.source.badge': 'Proyecto Open Source',
  'landing.hero.title': 'Crea tu CV profesional en minutos',
  'landing.hero.subtitle': 'EasyPeasyCV es una herramienta gratuita y de código abierto para crear CVs profesionales. Sin registros, sin costos, sin complicaciones.',
  'landing.create.cv.button': 'Crear CV Ahora',
  'landing.view.github.button': 'Ver en GitHub',
  'landing.stats.templates': 'Plantillas',
  'landing.stats.free': 'Gratuito',
  'landing.stats.unlimited': 'CVs Ilimitados',
  'landing.stats.languages': 'Idiomas',

  // Features Section
  'landing.features.title': '¿Por qué elegir EasyPeasyCV?',
  'landing.features.subtitle': 'Todo lo que necesitas para crear un CV profesional, sin complicaciones.',
  'landing.features.templates.title': 'Plantillas Profesionales',
  'landing.features.templates.description': '6 plantillas elegantes y profesionales: Clásica, Profesional, Cronología, Moderna, Creativa y Minimal',
  'landing.features.customization.title': 'Personalización Total',
  'landing.features.customization.description': 'Elige colores, reorganiza secciones y personaliza cada detalle',
  'landing.features.responsive.title': 'Responsivo',
  'landing.features.responsive.description': 'Funciona perfectamente en escritorio, tablet y móvil',
  'landing.features.autosave.title': 'Auto-Guardado',
  'landing.features.autosave.description': 'Tus datos se guardan automáticamente en el navegador',
  'landing.features.multilang.title': 'Multi-idioma',
  'landing.features.multilang.description': 'Disponible en Portugués, Inglés y Español',
  'landing.features.privacy.title': 'Privacidad',
  'landing.features.privacy.description': 'Todo se queda en tu navegador, sin servidores externos',

  // Templates Section
  'landing.templates.title': 'Plantillas Disponibles',
  'landing.templates.subtitle': 'Elige la plantilla que mejor se adapte a tu perfil profesional.',
  'landing.templates.classic.name': 'Clásica',
  'landing.templates.classic.description': 'Elegante y tradicional',
  'landing.templates.classic.features': 'Diseño limpio,Fuente profesional,Colores neutros',
  'landing.templates.professional.name': 'Profesional',
  'landing.templates.professional.description': 'Serio y tipográficamente refinado',
  'landing.templates.professional.features': 'Encabezado sólido,Tipografía destacada,Detalles sutiles',
  'landing.templates.timeline.name': 'Cronología',
  'landing.templates.timeline.description': 'Experiencia en formato de línea de tiempo',
  'landing.templates.timeline.features': 'Línea temporal,Hitos visuales,Lectura secuencial',
  'landing.templates.modern.name': 'Moderna',
  'landing.templates.modern.description': 'Limpia y contemporánea',
  'landing.templates.modern.features': 'Diseño minimalista,Espaciado generoso,Tipografía moderna',
  'landing.templates.creative.name': 'Creativa',
  'landing.templates.creative.description': 'Original y expresiva',
  'landing.templates.creative.features': 'Colores vibrantes,Diseño único,Elementos visuales',
  'landing.templates.minimal.name': 'Minimal',
  'landing.templates.minimal.description': 'Esencial y directo al grano',
  'landing.templates.minimal.features': 'Barra lateral limpia,Secciones simples,Enfoque en el contenido',
  'landing.templates.use.button': 'Usar Plantilla',

  // How it works Section
  'landing.how.title': 'Cómo Funciona',
  'landing.how.subtitle': 'Crear tu CV nunca ha sido tan simple. Sigue estos 3 pasos:',
  'landing.how.step1.title': 'Rellena tus Datos',
  'landing.how.step1.description': 'Añade tu información personal, experiencia profesional y educación',
  'landing.how.step2.title': 'Personaliza',
  'landing.how.step2.description': 'Elige plantilla, colores y reorganiza secciones',
  'landing.how.step3.title': 'Descarga',
  'landing.how.step3.description': 'Genera y descarga tu CV en PDF',

  // Testimonials Section
  'landing.testimonials.title': 'Lo que dicen los usuarios',
  'landing.testimonials.maria.name': 'María Silva',
  'landing.testimonials.maria.role': 'Desarrolladora Frontend',
  'landing.testimonials.maria.quote': '"Creé mi CV en 10 minutos. ¡La plantilla moderna fue perfecta!"',
  'landing.testimonials.joao.name': 'João Santos',
  'landing.testimonials.joao.role': 'Gestor de Proyectos',
  'landing.testimonials.joao.quote': '"Interfaz muy intuitiva. Pude personalizar todo fácilmente."',
  'landing.testimonials.ana.name': 'Ana Costa',
  'landing.testimonials.ana.role': 'Diseñadora UX/UI',
  'landing.testimonials.ana.quote': '"¡Me encantó la plantilla creativa. Me destaqué de la competencia!"',

  // Open Source Section
  'landing.opensource.title': 'Proyecto Open Source',
  'landing.opensource.subtitle': 'EasyPeasyCV es un proyecto de código abierto. ¡Las contribuciones son bienvenidas! Juntos podemos hacer esta herramienta aún mejor.',
  'landing.opensource.contribute.button': 'Contribuir en GitHub',
  'landing.opensource.support.button': 'Apoyar el Proyecto',

  // CTA Section
  'landing.cta.title': '¿Listo para crear tu CV?',
  'landing.cta.subtitle': 'Empieza ahora y crea un CV profesional en minutos',
  'landing.cta.button': 'Crear CV Gratuitamente',
  'generate.cv': 'Generar CV',
  'generate.resume': 'Generar Currículum',
  'generate.ats.resume': 'Generar CV',
  'data.xml.title': 'Datos (XML)',
  'data.xml.export': 'Exportar XML',
  'data.xml.import': 'Importar XML',
  'preview.cv': 'Vista Previa del CV',
  'preview': 'Vista Previa',
  'select.language': 'Elegir idioma:',
  'language.portuguese': 'Português',
  'language.english': 'English',
  'language.spanish': 'Español',

  // Notifications
  'data.loaded': 'Datos cargados automáticamente del navegador.',
  'data.loaded.local': 'Datos cargados automáticamente del navegador.',
  'data.loaded.xml': 'Datos importados desde XML.',
  'cv.generated': '¡Currículum generado con éxito! La descarga debe comenzar automáticamente.',
  'fill.example': 'Rellenar con datos de ejemplo',
  'validation.required': 'Por favor, rellena todos los campos obligatorios:',
  'validation.name': 'Nombre completo',
  'validation.email': 'Email',
  'validation.role': 'Cargo deseado',
  'validation.resume': 'Resumen profesional',

  // Thank you modal
  'thank.you.title': '¡Gracias por usar EasyPeasyCV!',
  'thank.you.message': 'Tu currículum ha sido generado con éxito. Esperamos que esta herramienta haya sido útil para ti. Si te gustó el proyecto, considera hacer una pequeña donación para ayudar a mantener el desarrollo.',
  'thank.you.close': 'Cerrar',
  'donation.title': 'Apoyar el Proyecto',
  'donation.message': 'Tus donaciones ayudan a mantener EasyPeasyCV gratuito y mejorar continuamente la herramienta.',
  'donation.button': 'Hacer Donación',

  // Form Sections
  'section.personal.info': 'Información Personal',
  'section.professional.summary': 'Resumen Profesional',
  'section.academic.education': 'Educación Académica',
  'section.technical.skills': 'Competencias Técnicas',
  'section.languages': 'Idiomas',
  'section.certifications': 'Certificaciones y Cursos',
  'section.volunteer': 'Voluntariado',

  // Personal Information
  'field.full.name': 'Nombre completo',
  'field.desired.role': 'Cargo Deseado',
  'field.postal.code': 'Código Postal',
  'field.city': 'Ciudad',
  'field.email': 'Email',
  'field.country.code': 'Código del País',
  'field.phone': 'Teléfono',
  'field.links.social': 'Enlaces y Redes Sociales',
  'field.link.type': 'Tipo de Enlace',
  'field.url': 'URL',

  // Professional Summary
  'field.professional.summary': 'Resumen Profesional',
  'resume.placeholder': 'Desarrollador Fullstack con experiencia en el desarrollo de aplicaciones web escalables, responsivas y centradas en el usuario. Trabajo con TypeScript, React, Next.js, Node.js, PostgreSQL y Prisma, con fuerte atención a la performance, usabilidad y calidad del código...',
  'professional.summary.title': 'Resumen Profesional',
  'professional.summary.description': 'Breve descripción de tu perfil profesional, experiencia y objetivos',
  'professional.summary.placeholder': 'Profesional con X años de experiencia en [área]. Especializado en [competencias principales]. Logros destacados incluyen [mencionar 1-2 logros con métricas si es posible]. Busco [objetivo profesional].',

  // Professional Experience
  'field.role': 'Cargo',
  'field.company': 'Empresa',
  'field.start.month': 'Mes Inicio',
  'field.start.year': 'Año Inicio',
  'field.end.month': 'Mes Fin',
  'field.end.year': 'Año Fin',
  'field.current': 'Actual',
  'field.technologies': 'Tecnologías Utilizadas',
  'field.activities': 'Actividades Desarrolladas',
  'field.achievements': 'Logros',
  'field.achievements.helper': 'con métricas',
  'add.experience': 'Añadir Experiencia',
  'experience.title': 'Experiencia',
  'section.professional.experience': 'Experiencia Profesional',
  'professional.experience.title': 'Experiencia Profesional',
  'professional.experience.description': 'Detalla tu trayectoria laboral en orden cronológico inverso',
  'professional.experience.placeholder': 'Describe tus responsabilidades, proyectos y logros en este puesto. Incluye tecnologías utilizadas y resultados cuantificables cuando sea posible.',

  // Academic Education
  'field.course': 'Curso',
  'field.institution': 'Institución',
  'field.description': 'Descripción',
  'field.education.type': 'Tipo de Formación',
  'field.education.status': 'Estado',
  'add.education': 'Añadir Formación',
  'education.title': 'Educación',

  // Education types
  'education.type.secondary': 'Educación Secundaria',
  'education.type.technical': 'Técnico',
  'education.type.bachelor': 'Licenciatura',
  'education.type.postgraduate': 'Posgrado',
  'education.type.master': 'Máster',
  'education.type.phd': 'Doctorado',

  // Education status
  'education.status.completed': 'Completo',
  'education.status.in.progress': 'En progreso',
  'education.status.interrupted': 'Interrumpido',

  // Technical Skills
  'skills.placeholder': 'Ej: JavaScript, React, Node.js, SQL',
  'field.technical.skills.helper': 'Separa las competencias por coma',
  'technical.skills.title': 'Competencias Técnicas',
  'technical.skills.description': 'Lista tus habilidades técnicas relevantes para el puesto',
  'technical.skills.placeholder': 'Ej: JavaScript, React, Node.js, SQL, Git, Docker',

  // Languages
  'field.language': 'Idioma',
  'field.level': 'Nivel',
  'add.language': 'Añadir Idioma',
  'language.title': 'Idioma',

  // Language levels - CEFR (Common European Framework of Reference for Languages)
  'language.level.a1': 'A1',
  'language.level.a2': 'A2',
  'language.level.b1': 'B1',
  'language.level.b2': 'B2',
  'language.level.c1': 'C1',
  'language.level.c2': 'C2',

  // Certifications
  'field.certification': 'Certificación',
  'field.issuer': 'Emisor/Institución',
  'field.completion.date': 'Fecha de Finalización',
  'field.hours': 'Horas',
  'field.validation.link': 'Enlace de Validación',
  'add.certification': 'Añadir Certificación/Curso',
  'certification.title': 'Certificación',

  // Projects
  'field.project.name': 'Nombre del Proyecto',
  'field.year': 'Año',
  'field.project.technologies': 'Tecnologías',
  'field.project.link': 'Enlace',
  'field.project.sourceCode': 'Código fuente',
  'add.project': 'Añadir Proyecto',
  'project.title': 'Proyecto',
  'section.projects': 'Proyectos',
  'projects.title': 'Proyectos',
  'projects.description': 'Destaca tus proyectos personales o profesionales más relevantes',
  'projects.placeholder': 'Describe brevemente el proyecto, su propósito, tecnologías utilizadas y tu rol específico. Incluye resultados o impacto si es posible.',

  // Volunteer Work
  'field.organization': 'Organización',
  'field.impact': 'Impacto',
  'add.volunteer': 'Añadir Voluntariado',
  'volunteer.title': 'Voluntariado',

  // Placeholders
  'placeholder.full.name': 'Ej: Juan Pérez',
  'placeholder.desired.role': 'Ej: Desarrollador Full Stack',
  'placeholder.postal.code': 'Ej: 1234-567',
  'placeholder.city': 'Ej: Madrid',
  'placeholder.email': 'Ej: email@ejemplo.com',
  'placeholder.phone': 'Ej: 912345678',
  'placeholder.role': 'Ej: Desarrollador Full Stack',
  'placeholder.company': 'Ej: Amazon',
  'placeholder.course': 'Ej: Licenciatura en Ingeniería Informática',
  'placeholder.institution': 'Ej: Universidad de Madrid',
  'placeholder.certification': 'Ej: Certificación AWS Cloud Practitioner',
  'placeholder.issuer': 'Ej: Udemy, Alura, AWS',
  'placeholder.hours': 'Ej: 40 horas',
  'placeholder.validation.link': 'Ej: www.certificate.institution.com/123456',
  'placeholder.project.name': 'Ej: Portfolio Website',
  'placeholder.project.year': 'Ej: 2023',
  'placeholder.project.tech': 'Ej: React, Node.js, MongoDB',
  'placeholder.project.link': 'Ej: www.miproyecto.com',
  'placeholder.project.sourceCode': 'Ej: www.github.com/user/repo',
  'placeholder.project.description': 'Breve descripción del proyecto, objetivos, resultados...',
  'placeholder.organization': 'Ej: Cruz Roja Española',
  'placeholder.volunteer.role': 'Ej: Voluntario de Apoyo Social',
  'placeholder.volunteer.description': 'Ej: Prestación de apoyo social a familias necesitadas, distribución de alimentos y ropa.',
  'placeholder.volunteer.impact': 'Ej: Ayudó a más de 50 familias durante la pandemia, organizó campañas de recogida de donativos.',
  'placeholder.activities': 'Describe tus responsabilidades (un elemento por línea)',
  'placeholder.achievements': 'Ej: Reestructuré la arquitectura de la aplicación usando Next.js con SSR, lo que mejoró el SEO y aumentó la retención de usuarios en un 25%.',
  'placeholder.education.description': 'Ej: Tesis sobre inteligencia artificial, asignaturas relevantes, proyectos académicos...',
  'placeholder.certification.description': 'Ej: Curso enfocado en desarrollo de APIs REST con Node.js...',
  'placeholder.year': 'Ej: 2023',
  'placeholder.language': 'Ej: Inglés',

  // Dropdown options
  'select.month': 'Seleccionar',
  'select.country': 'Seleccionar país',
  'select.date': 'Seleccionar fecha',
  'select.education.type': 'Seleccionar',
  'select.education.status': 'Seleccionar',
  'select.language.level': 'Seleccionar',

  // Link types
  'link.type.linkedin': 'LinkedIn',
  'link.type.github': 'GitHub',
  'link.type.gitlab': 'GitLab',
  'link.type.portfolio': 'Portfolio',
  'link.type.other': 'Otro',

  // Link placeholders
  'link.placeholder.linkedin': 'Ej: miperfil',
  'link.placeholder.github': 'Ej: usuario',
  'link.placeholder.gitlab': 'Ej: usuario',
  'link.placeholder.portfolio': 'Ej: miwebsite.com',
  'link.placeholder.other': 'Ej: miwebsite.com',

  // Custom link name
  'field.link.custom.name': 'Nombre de la Plataforma',
  'placeholder.link.custom.name': 'Ej: Behance, Dribbble, Medium',

  // Months
  'month.jan': 'Ene',
  'month.feb': 'Feb',
  'month.mar': 'Mar',
  'month.apr': 'Abr',
  'month.may': 'May',
  'month.jun': 'Jun',
  'month.jul': 'Jul',
  'month.aug': 'Ago',
  'month.sep': 'Sep',
  'month.oct': 'Oct',
  'month.nov': 'Nov',
  'month.dec': 'Dic',

  // Countries
  'country.portugal': 'Portugal (+351)',
  'country.brazil': 'Brasil (+55)',
  'country.spain': 'España (+34)',

  // Empty states
  'empty.experience': 'Ninguna experiencia añadida',
  'empty.education': 'Ninguna educación añadida',
  'empty.language': 'Ningún idioma añadido',
  'empty.certification': 'Ninguna certificación añadida',
  'empty.volunteer': 'Ningún voluntariado añadido',
  'empty.project': 'Ningún proyecto añadido',

  // CV Tips
  'tips.title': 'Consejos para un Currículum que Pase en Sistemas ATS',
  'tips.subtitle': 'Sigue estas recomendaciones para aumentar tus posibilidades de ser seleccionado',
  'tips.extra.title': 'Consejo Extra',
  'tips.extra.content': 'El currículum generado por esta aplicación ya sigue estas buenas prácticas, pero asegúrate de personalizar el contenido de acuerdo con cada oferta específica.',

  // Tip content
  'tip.format.simple': 'Usa un formato simple (sin gráficos ni tablas)',
  'tip.format.simple.desc': 'Los sistemas ATS tienen dificultad para leer elementos visuales. Utiliza solo texto con una estructura clara.',
  'tip.keywords': 'Utiliza palabras clave exactas del anuncio',
  'tip.keywords.desc': 'Copia los términos usados en el anuncio de la oferta (tecnologías, funciones, competencias). El ATS busca correspondencias exactas.',
  'tip.headers': 'Evita encabezados personalizados',
  'tip.headers.desc': 'Utiliza términos comunes como \'Experiencia Profesional\', \'Educación\', \'Competencias\'.',
  'tip.format.file': 'Guarda el currículum en formato .docx o .pdf (simple)',
  'tip.format.file.desc': 'Algunos ATS tienen problemas con PDFs mal formateados o versiones antiguas de Word.',
  'tip.acronyms': 'No uses siglas sin escribir también el significado',
  'tip.acronyms.desc': 'Ejemplo: escribe \'JavaScript (JS)\' o \'Base de Datos (BD)\' para garantizar que sea reconocido.',
  'tip.chronological': 'Coloca la información por orden cronológico inverso',
  'tip.chronological.desc': 'Empieza por la experiencia más reciente, pues es eso lo que el ATS y el reclutador quieren ver.',
  'tip.job.titles': 'Incluye títulos de cargos comunes',
  'tip.job.titles.desc': 'Utiliza nombres genéricos como \'Desarrollador Backend\', \'Analista de Sistemas\', etc., aunque el nombre oficial de la función fuera diferente.',
  'tip.spelling': 'Evita errores ortográficos',
  'tip.spelling.desc': 'El ATS puede no reconocer palabras mal escritas, lo que puede llevar a la exclusión del currículum.',
  'tip.technical.skills': 'Incluye una sección de competencias técnicas',
  'tip.technical.skills.desc': 'Lista las tecnologías, lenguajes y herramientas que utilizaste (ej: Java, Git, SQL, Docker).',

  // Template selector
  'template.selector': 'Seleccionar Plantilla',
  'template.classic.name': 'Clásica',
  'template.classic.description': 'Diseño tradicional y profesional',
  'template.professional.name': 'Profesional',
  'template.professional.description': 'Diseño profesional',
  'template.modern.name': 'Moderna',
  'template.modern.description': 'Diseño limpio y minimalista',
  'template.creative.name': 'Creativa',
  'template.creative.description': 'Diseño innovador y expresivo',
  'template.minimal.name': 'Minimalista',
  'template.minimal.description': 'Diseño limpio y enfocado en lo esencial',
  'template.timeline.name': 'Línea de Tiempo',
  'template.timeline.description': 'Experiencia en formato cronológico',
  'color.selector': 'Seleccionar Color',

  // Actions
  'actions': 'Acciones',
  'cv.actions': 'Opciones del CV',
  'extra.features': 'Funcionalidades Extra',
  'extra.features.description': 'Herramientas adicionales para mejorar tu CV',
  'extra.features.job.analysis': 'Análisis de Vacantes',
  'extra.features.job.analysis.description': 'Analiza ofertas de empleo para optimizar tu CV',
  'extra.features.ats.tips': 'Consejos ATS',
  'extra.features.ats.tips.description': 'Aprende a optimizar tu CV para sistemas ATS',
  'extra.features.ats.explanation': 'Explicación ATS',
  'extra.features.ats.explanation.description': 'Comprende cómo funcionan los sistemas ATS',

  // CV Type Selector
  'cv.type.selector': 'Tipo de Currículum',
  'cv.type.development': 'Desarrollo/IT',
  'cv.type.marketing': 'Marketing/Digital',
  'cv.type.sales': 'Ventas/Comercial',
  'cv.type.hr': 'Recursos Humanos',
  'cv.type.finance': 'Finanzas/Contabilidad',
  'cv.type.design': 'Diseño/Creativo',
  'cv.type.health': 'Salud/Medicina',
  'cv.type.education': 'Educación/Enseñanza',
  'cv.type.admin': 'Administración/Gestión',
  'cv.type.other': 'Otros',

  // Footer
  'footer.privacy': 'Privacidad',
  'footer.terms': 'Términos',

  // Job Analysis
  'job.analysis.title': 'Análisis de Vacantes',
  'job.analysis.subtitle': 'Introduce el texto de la vacante para recibir consejos personalizados',
  'job.analysis.input.label': 'Texto de la Vacante',
  'job.analysis.input.placeholder': 'Pega aquí el texto completo de la oferta de empleo...',
  'job.analysis.analyze': 'Analizar Vacante',
  'job.analysis.analyzing': 'Analizando...',
  'job.analysis.clear': 'Limpiar',
  'job.analysis.results': 'Resultados del Análisis',
  'job.analysis.error': 'Error al analizar la vacante. Inténtalo de nuevo.',
  'job.analysis.tips.title': 'Cómo usar esta funcionalidad',
  'job.analysis.tips.content': 'Pega el texto completo de la oferta de empleo en el campo de arriba. El sistema analizará automáticamente las competencias requeridas, nivel de experiencia y tipo de contrato, proporcionando consejos personalizados para adaptar tu CV.',

  // Job Analysis Results
  'job.analysis.skills.title': 'Competencias Identificadas',
  'job.analysis.skills.found': 'Competencias encontradas en la vacante',
  'job.analysis.skills.advice': 'Asegúrate de incluir estas competencias en tu CV, especialmente en la sección de competencias técnicas y experiencias profesionales.',
  'job.analysis.skills.notFound': 'No se identificaron competencias técnicas específicas. Considera incluir competencias generales relevantes para el área.',

  'job.analysis.experience.title': 'Nivel de Experiencia',
  'job.analysis.experience.senior': 'Esta vacante requiere un nivel senior. Destaca experiencias de liderazgo, gestión de proyectos y responsabilidades estratégicas en tu CV.',
  'job.analysis.experience.mid': 'Esta vacante requiere un nivel intermedio. Enfócate en experiencias prácticas y resultados cuantificables.',
  'job.analysis.experience.entry': 'Esta vacante es adecuada para candidatos con poca experiencia. Destaca proyectos académicos, prácticas y competencias técnicas.',

  'job.analysis.type.title': 'Tipo de Contrato',
  'job.analysis.type.remote': 'Esta vacante permite trabajo remoto. Destaca experiencias de trabajo autónomo y competencias de comunicación virtual.',
  'job.analysis.type.partTime': 'Esta vacante es a tiempo parcial. Adapta tu CV para mostrar flexibilidad y gestión eficiente del tiempo.',
  'job.analysis.type.fullTime': 'Esta vacante es a tiempo completo. Destaca compromiso y disponibilidad total para el proyecto.',

  'job.analysis.general.title': 'Consejos Generales',
  'job.analysis.general.advice': 'Personaliza tu CV de acuerdo con este análisis. Utiliza palabras clave de la vacante, destaca experiencias relevantes y adapta el resumen profesional para alinear con los requisitos identificados.',

  // Job Analysis Actions
  'job.analysis.action.button': 'Analizar Vacante',
  'job.analysis.action.description': 'Analiza una oferta de empleo para recibir consejos personalizados',

  // CV Tips Actions
  'cv.tips.action.button': 'Consejos CV',
  'cv.tips.action.description': 'Consulta consejos para crear un CV que pase en sistemas ATS',

  // ATS Explanation
  'ats.explanation.title': '¿Qué son los Sistemas ATS?',
  'ats.explanation.subtitle': 'Comprende cómo funcionan y por qué son importantes para tu CV',
  'ats.explanation.what.title': '¿Qué es un Sistema ATS?',
  'ats.explanation.what.description': 'ATS (Applicant Tracking System) es un software que las empresas utilizan para gestionar candidaturas de empleo. Estos sistemas analizan automáticamente los CVs recibidos, buscando palabras clave y criterios específicos antes de enviarlos para revisión humana.',
  'ats.explanation.why.title': '¿Por qué es importante?',
  'ats.explanation.why.description': 'Más del 75% de las empresas utilizan sistemas ATS para filtrar candidaturas. Si tu CV no está optimizado para estos sistemas, puede ser automáticamente rechazado, aunque tengas las calificaciones necesarias.',
  'ats.explanation.why.warning': 'Sin optimización ATS, tu CV puede ser rechazado automáticamente, ¡aunque estés calificado para la vacante!',
  'ats.explanation.how.title': 'Cómo optimizar tu CV para ATS',
  'ats.explanation.how.description': 'Sigue estos consejos para aumentar las posibilidades de que tu CV pase los filtros ATS:',
  'ats.explanation.how.tip1': 'Utiliza palabras clave exactas del anuncio de la vacante',
  'ats.explanation.how.tip2': 'Mantén un formato simple, sin gráficos ni tablas',
  'ats.explanation.how.tip3': 'Usa encabezados estándar como "Experiencia Profesional" y "Educación"',
  'ats.explanation.how.tip4': 'Incluye una sección de competencias técnicas con tecnologías relevantes',
  'ats.explanation.template.title': 'Recomendación de Plantilla',
  'ats.explanation.template.description': 'Para máxima compatibilidad con sistemas ATS, recomendamos la plantilla clásica, que fue específicamente diseñada para pasar los filtros automáticos.',
  'ats.explanation.template.recommendation': 'Plantilla Clásica Recomendada',
  'ats.explanation.extra.title': 'Consejo Importante',
  'ats.explanation.extra.content': 'La plantilla clásica de este OpenCVLab ha sido optimizada para sistemas ATS, pero siempre personaliza el contenido de acuerdo con cada vacante específica.',

  // ATS Explanation Actions
  'ats.explanation.action.button': 'Explicación ATS',
  'ats.explanation.action.description': 'Aprende sobre sistemas ATS y cómo optimizar tu CV',

  // Calendar
  'calendar.clear': 'Limpiar',
  'calendar.today': 'Hoy',
  'calendar.month.january': 'Enero',
  'calendar.month.february': 'Febrero',
  'calendar.month.march': 'Marzo',
  'calendar.month.april': 'Abril',
  'calendar.month.may': 'Mayo',
  'calendar.month.june': 'Junio',
  'calendar.month.july': 'Julio',
  'calendar.month.august': 'Agosto',
  'calendar.month.september': 'Septiembre',
  'calendar.month.october': 'Octubre',
  'calendar.month.november': 'Noviembre',
  'calendar.month.december': 'Diciembre',
  'calendar.day.sun': 'Dom',
  'calendar.day.mon': 'Lun',
  'calendar.day.tue': 'Mar',
  'calendar.day.wed': 'Mié',
  'calendar.day.thu': 'Jue',
  'calendar.day.fri': 'Vie',
  'calendar.day.sat': 'Sáb',

  // Error 404 Page
  'error.404.title': 'Página no encontrada',
  'error.404.description': 'La página que buscas no existe o ha sido movida. Verifica la URL o navega de vuelta a la página inicial.',
  'error.404.home.button': 'Volver a la Página Inicial',
  'error.404.builder.button': 'Crear CV',
  'error.404.helpful.title': 'Páginas útiles',
  'error.404.helpful.features.title': 'Funcionalidades',
  'error.404.helpful.features.description': 'Descubre todas las funcionalidades de EasyPeasyCV para crear tu CV profesional.',
  'error.404.helpful.templates.title': 'Plantillas',
  'error.404.helpful.templates.description': 'Explora nuestras plantillas profesionales y personaliza tu CV.',

  // Privacy Policy Page
  'privacy.title': 'Política de Privacidad',
  'privacy.last.updated': 'Última actualización',
  'privacy.introduction.title': 'Introducción',
  'privacy.introduction.description': 'EasyPeasyCV está comprometido en proteger tu privacidad. Esta política explica cómo funcionamos.',
  'privacy.no.collection.title': 'No Recolectamos Datos',
  'privacy.no.collection.description': 'EasyPeasyCV es una aplicación simple que funciona enteramente en tu navegador. No recolectamos, almacenamos o procesamos ningún dato personal.',
  'privacy.no.collection.highlight': 'Tus datos siempre se quedan en tu dispositivo y nunca son enviados a servidores externos.',
  'privacy.local.storage.title': 'Almacenamiento Local',
  'privacy.local.storage.description': 'Todos los datos se almacenan localmente en tu navegador:',
  'privacy.local.storage.browser': 'Los datos se quedan en tu navegador (localStorage)',
  'privacy.local.storage.no.server': 'Ninguna información es enviada a servidores',
  'privacy.local.storage.control': 'Tienes control total sobre tus datos',
  'privacy.cookies.title': 'Cookies',
  'privacy.cookies.description': 'Utilizamos solo cookies esenciales para el funcionamiento del servicio.',
  'privacy.cookies.essential': 'Estas cookies son necesarias para el funcionamiento básico de la aplicación.',
  'privacy.third.party.title': 'Servicios de Terceros',
  'privacy.third.party.description': 'Solo utilizamos servicios externos para funcionalidades específicas:',
  'privacy.third.party.github': 'GitHub - Para alojar el código fuente y issues',
  'privacy.third.party.ko.fi': 'Ko-fi - Para donaciones (opcional)',
  'privacy.changes.title': 'Cambios a la Política',
  'privacy.changes.description': 'Podemos actualizar esta política ocasionalmente. Notificaremos a los usuarios sobre cambios significativos.',
  'privacy.contact.title': 'Contacto',
  'privacy.contact.description': 'Si tienes preguntas sobre esta política de privacidad, contáctanos:',
  'privacy.back.home': 'Volver a la Página Inicial',

  // Terms of Service Page
  'terms.title': 'Términos de Servicio',
  'terms.last.updated': 'Última actualización',
  'terms.introduction.title': 'Introducción',
  'terms.introduction.description': 'Al utilizar EasyPeasyCV, aceptas estos términos de servicio. Léelos cuidadosamente antes de utilizar la aplicación.',
  'terms.acceptance.title': 'Aceptación de los Términos',
  'terms.acceptance.description': 'Al acceder o utilizar EasyPeasyCV, confirmas que has leído, comprendido y aceptas estar vinculado a estos términos de servicio.',
  'terms.service.title': 'Descripción del Servicio',
  'terms.service.description': 'EasyPeasyCV es una aplicación web que permite:',
  'terms.service.features.cv': 'Crear y editar currículums profesionales',
  'terms.service.features.templates': 'Utilizar plantillas profesionales personalizables',
  'terms.service.features.pdf': 'Exportar CVs en formato PDF',
  'terms.service.features.local': 'Almacenamiento local de datos en navegador',
  'terms.responsibilities.title': 'Responsabilidades del Usuario',
  'terms.responsibilities.description': 'Como usuario, eres responsable de:',
  'terms.responsibilities.accurate': 'Proporcionar información precisa y actualizada',
  'terms.responsibilities.legal': 'Utilizar el servicio de acuerdo con la ley aplicable',
  'terms.responsibilities.compliance': 'Cumplir todos los términos y condiciones',
  'terms.prohibited.title': 'Usos Prohibidos',
  'terms.prohibited.description': 'No puedes utilizar el servicio para:',
  'terms.prohibited.illegal': 'Actividades ilegales o fraudulentas',
  'terms.prohibited.harmful': 'Causar daños o interferir con el servicio',
  'terms.prohibited.copyright': 'Violar derechos de propiedad intelectual',
  'terms.intellectual.title': 'Propiedad Intelectual',
  'terms.intellectual.description': 'EasyPeasyCV y todo su contenido son propiedad de sus creadores. Mantienes los derechos sobre el contenido que creas.',
  'terms.intellectual.user.content': 'El contenido de tu CV es de tu responsabilidad y propiedad.',
  'terms.privacy.title': 'Privacidad y Datos',
  'terms.privacy.description': 'La recolección y uso de datos personales está regida por nuestra Política de Privacidad.',
  'terms.privacy.policy': 'Consulta nuestra',
  'terms.privacy.link': 'Política de Privacidad',
  'terms.availability.title': 'Disponibilidad del Servicio',
  'terms.availability.description': 'Nos esforzamos por mantener el servicio disponible, pero no garantizamos disponibilidad continua:',
  'terms.availability.maintenance': 'El mantenimiento programado puede causar interrupciones',
  'terms.availability.updates': 'Las actualizaciones pueden afectar temporalmente el servicio',
  'terms.availability.force': 'Eventos fuera de nuestro control pueden afectar la disponibilidad',
  'terms.disclaimers.title': 'Exclusiones de Responsabilidad',
  'terms.disclaimers.description': 'El servicio se proporciona "tal como está" sin garantías:',
  'terms.disclaimers.warranty': 'No garantizamos que el servicio esté libre de errores',
  'terms.disclaimers.accuracy': 'No garantizamos la precisión del contenido generado',
  'terms.disclaimers.employment': 'No garantizamos empleo o resultados de candidaturas',
  'terms.law.title': 'Ley Aplicable',
  'terms.law.description': 'Estos términos están regidos por la ley portuguesa.',
  'terms.changes.title': 'Cambios a los Términos',
  'terms.changes.description': 'Podemos cambiar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de la publicación.',
  'terms.contact.title': 'Contacto',
  'terms.contact.description': 'Para preguntas sobre estos términos, contáctanos:',
  'terms.back.home': 'Volver a la Página Inicial',

  // Landing Page Benefits Section
  'landing.benefits.title': 'Ventajas de EasyPeasyCV',
  'landing.benefits.subtitle': 'Descubre por qué EasyPeasyCV es la elección correcta para tu CV profesional',
  'landing.benefits.privacy.title': 'Privacidad Total',
  'landing.benefits.privacy.subtitle': 'Tus datos se mantienen seguros',
  'landing.benefits.privacy.description': 'Todos los datos se almacenan localmente en tu navegador. Ninguna información es enviada a servidores externos.',
  'landing.benefits.ats.title': 'Optimizado para ATS',
  'landing.benefits.ats.subtitle': 'Compatible con sistemas de reclutamiento',
  'landing.benefits.ats.description': 'Nuestras plantillas están optimizadas para pasar los sistemas de seguimiento de candidatos (ATS) de las empresas.',
  'landing.benefits.performance.title': 'Rápido y Eficiente',
  'landing.benefits.performance.subtitle': 'Generación instantánea de PDF',
  'landing.benefits.performance.description': 'Genera tu CV en PDF de alta calidad en segundos, sin esperas ni complicaciones.',

  // View Project link
  'view.project': 'Ver Proyecto',
};