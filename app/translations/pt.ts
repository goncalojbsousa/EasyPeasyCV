// Portuguese translations
const ptTranslations: Record<string, string> = {
	// Header
	"app.title": "EasyPeasyCV",

	// Landing Page - Legacy
	"landing.view.github.button": "Ver no GitHub",

	// Open Source Section
	"landing.opensource.support.button": "Apoiar o Projeto",

	// CTA Section
	"generate.ats.resume": "Gerar CV",
	"data.xml.title": "Dados (XML)",
	"data.xml.export": "Exportar XML",
	"data.xml.import": "Importar XML",
	"data.import.error":
		"Erro ao importar XML. Verifique o ficheiro e tente novamente.",
	"pdf.download.error": "Erro ao gerar PDF. Por favor, tente novamente.",
	"preview.cv": "Preview do CV",
	preview: "Preview",
	"live.preview.loading": "A gerar preview…",
	"live.preview.empty": "Sem conteúdo para pré-visualizar.",
	"pdf.preview.title": "Preview do PDF",
	"pdf.preview.refresh": "Atualizar preview",
	"pdf.preview.loading": "A gerar PDF...",
	"pdf.preview.retry": "Tentar novamente",
	"pdf.preview.download": "Baixar PDF",
	"pdf.preview.open.new.tab": "Abrir PDF numa nova aba",
	"pdf.preview.mobile.success": "PDF gerado com sucesso!",
	"pdf.preview.mobile.info":
		"A visualização direta do PDF pode não funcionar no telemóvel.",
	"pdf.preview.size": "Tamanho",
	"pdf.preview.error.generate": "Erro ao gerar PDF",
	"pdf.preview.error.unknown": "Erro desconhecido",
	"pdf.preview.error.loading": "Erro ao carregar PDF",
	"layout.controls.font.label": "Fonte",
	"layout.controls.textScale.label": "Escala do texto",
	"layout.controls.margins.title": "Margens",
	"layout.controls.margins.top": "Superior",
	"layout.controls.margins.bottom": "Inferior",
	"layout.controls.margins.left": "Esquerda",
	"layout.controls.margins.right": "Direita",
	"layout.controls.lineSpacing.label": "Espaçamento de linha",
	"layout.controls.sectionSpacing.label": "Espaçamento entre secções",

	// Profiles
	"profile.selector": "Perfis de CV",
	"profile.manage": "Gerir perfis",
	"profile.new": "Novo perfil",
	"profile.copy": "Duplicar",
	"profile.copy.name": "Cópia de {name}",
	"profile.rename": "Renomear",
	"profile.rename.save": "Guardar nome",
	"profile.rename.cancel": "Cancelar edição",
	"profile.delete.title": 'Apagar o perfil "{name}"?',
	"profile.delete": "Apagar",
	"profile.delete.confirm":
		"O CV deste perfil é apagado deste browser. Não é possível recuperá-lo.",
	"profile.delete.cancel": "Cancelar",
	"profile.unnamed": "Perfil sem nome",
	"layout.controls.header.nameSection": "Nome e Cargo",
	"layout.controls.header.nameSize": "Tamanho do nome",
	"layout.controls.header.weight.label": "Peso",
	"layout.controls.header.weight.normal": "Normal",
	"layout.controls.header.weight.bold": "Bold",
	"layout.controls.header.weight.heavy": "Heavy",
	"layout.controls.header.color": "Cor",
	"layout.controls.header.titleStyle.label": "Estilo do título",
	"layout.controls.header.titleStyle.normal": "Normal",
	"layout.controls.header.titleStyle.italic": "Itálico",
	"layout.controls.header.titleStyle.uppercase": "Maiúsculas",
	"layout.controls.header.divider.title": "Linha divisória",
	"layout.controls.header.divider.thickness": "Espessura",
	"layout.controls.header.divider.style.label": "Estilo",
	"layout.controls.header.divider.style.solid": "Sólida",
	"layout.controls.header.divider.style.dashed": "Tracejada",
	"layout.controls.photo.title": "Foto",
	"layout.controls.photo.enable": "Ativar foto",
	"layout.controls.photo.borderRadius.label": "Raio de Borda",
	"layout.controls.photo.choose": "Escolher foto",
	"layout.controls.photo.atsWarning":
		"A inclusão de foto não é recomendada. Sistemas ATS não a utilizam e, na triagem humana, pode introduzir vieses desnecessários.",
	"layout.controls.links.useThemeColor.label": "Usar cor do tema nos links",
	"layout.controls.links.useThemeColor.help":
		"Desliga para manter o azul padrão de hiperligação.",
	"layout.controls.density.label": "Densidade do Layout",
	"layout.controls.density.compact": "Compacto",
	"layout.controls.density.normal": "Normal",
	"layout.controls.density.spacious": "Espaçoso",
	"layout.controls.density.help":
		"Ajusta automaticamente margens, espaçamentos e tamanho de texto",
	"layout.controls.singlePageMode.label": "Muito Compacto",
	"layout.controls.singlePageMode.help":
		"Cabe o máximo de informação possível por página",
	"layout.controls.textAlignment.label": "Alinhamento do Texto",
	"layout.controls.textAlignment.left": "Esquerda",
	"layout.controls.textAlignment.justify": "Justificado",
	"layout.controls.sections.titleColor": "Cor dos títulos",
	"layout.controls.sections.titleSize": "Tamanho dos títulos",
	"layout.controls.sections.dateFormat.label": "Formato de Data",
	"layout.controls.dateFormat.short": "Curto (01/2020)",
	"layout.controls.dateFormat.medium": "Médio (Jan 2020)",
	"layout.controls.dateFormat.long": "Longo (Janeiro 2020)",
	"layout.controls.reset": "Repor layout para padrão",
	"language.portuguese": "Português",
	"language.english": "English",
	"language.spanish": "Español",
	"language.brazilianPortuguese": "Português-BR",

	// Notifications
	"data.loaded.from.browser": "Dados carregados automaticamente do navegador.",
	"data.loaded.xml": "Dados importados a partir de XML.",
	"cv.generated":
		"Currículo gerado com sucesso! O download deve começar automaticamente.",
	"section.order.reset": "Restaurar Ordem Padrão do Template",
	"fill.example": "Preencher com dados de exemplo",

	// Thank you modal
	"thank.you.title": "Obrigado por usar o EasyPeasyCV!",
	"thank.you.message":
		"O seu currículo foi gerado com sucesso. Esperamos que esta ferramenta tenha sido útil para si. Se gostou do projeto, considere fazer uma pequena doação para ajudar a manter o desenvolvimento.",
	"thank.you.close": "Fechar",
	"donation.title": "Apoiar o Projeto",
	"donation.message":
		"As suas doações ajudam a manter o EasyPeasyCV gratuito e a melhorar continuamente a ferramenta.",
	"donation.button": "Fazer Doação",

	// PDF Export
	"pdf.section.summary": "RESUMO",
	"pdf.section.experience": "EXPERIÊNCIA",
	"pdf.section.education": "EDUCAÇÃO",
	"pdf.section.skills": "COMPETÊNCIAS",
	"pdf.section.languages": "IDIOMAS",
	"pdf.section.certifications": "CERTIFICAÇÕES",
	"pdf.section.projects": "PROJETOS",
	"pdf.section.volunteer": "VOLUNTARIADO",
	"pdf.section.custom": "SECÇÃO PERSONALIZADA",

	// Form Sections
	"section.personal.info": "Informações Pessoais",
	"section.professional.summary": "Resumo Profissional",
	"section.professional.experience": "Experiência Profissional",
	"section.academic.education": "Educação Académica",
	"section.technical.skills": "Competências Técnicas",
	"section.languages": "Línguas",
	"section.certifications": "Certificações e Cursos",
	"section.volunteer": "Voluntariado",
	"section.projects": "Projetos",
	"custom.section.add": "Adicionar secção personalizada",
	"custom.section.default": "Secção personalizada",
	"custom.section.name": "Título da secção",
	"custom.section.placeholder.name": "Ex: Prémios",
	"custom.section.remove": "Remover secção",
	"custom.section.empty.fields": "Ainda não adicionou campos",
	"custom.field.label": "Nome do campo",
	"custom.field.subtitle": "Subtítulo",
	"custom.field.value": "Conteúdo",
	"custom.field.placeholder.label": "Ex: Prémio",
	"custom.field.placeholder.subtitle": "Ex: Conferência",
	"custom.field.placeholder.value": "Ex: Vencedor da conferência XYZ 2024",
	"custom.field.bullets": "Lista de bullets",
	"custom.field.placeholder.bullets": "Um item por linha",
	"custom.field.start": "Início (mês/ano)",
	"custom.field.end": "Fim (mês/ano)",
	"custom.field.placeholder.month": "Mês",
	"custom.field.placeholder.year": "Ano",
	"custom.field.current": "Atual",
	"custom.field.add": "Adicionar campo",
	"custom.field.default": "Campo",

	// Personal Information
	"field.full.name": "Nome completo",
	"field.postal.code": "Código Postal",
	"field.city": "Cidade",
	"field.email": "Email",
	"field.country.code": "Código do País",
	"field.phone": "Telemóvel",
	"field.links.social": "Links e Redes Sociais",
	"field.link.type": "Tipo de Link",
	"field.url": "URL",

	// Professional Summary
	"field.professional.summary": "Resumo Profissional",

	// Professional Experience
	"field.role": "Cargo",
	"field.company": "Empresa",
	"field.start.month": "Mês Início",
	"field.start.year": "Ano Início",
	"field.end.month": "Mês Fim",
	"field.end.year": "Ano Fim",
	"field.current": "Atual",
	"field.activities": "Atividades Desenvolvidas",
	"field.achievements.label": "Conquistas",
	"field.achievements.helper": "com métricas",
	"add.experience": "Adicionar Experiência",
	"experience.title": "Experiência",

	// Academic Education
	"field.course": "Curso",
	"field.institution": "Instituição",
	"field.description": "Descrição",
	"field.education.type": "Tipo de Formação",
	"field.education.status": "Estado",
	"add.education": "Adicionar Formação",
	"education.title": "Educação",

	// Education types
	"education.type.secondary": "Ensino Secundário",
	"education.type.technical": "Técnico",
	"education.type.bachelor": "Licenciatura",
	"education.type.postgraduate": "Pós-graduação",
	"education.type.master": "Mestrado",
	"education.type.phd": "Doutoramento",

	// Education status
	"education.status.completed": "Completo",
	"education.status.in.progress": "Em andamento",
	"education.status.interrupted": "Interrompido",
	"education.option.none": "Não mostrar",

	// Technical Skills
	"field.technical.skills.helper": "Separe as competências por vírgula",

	// Languages
	"field.language": "Língua",
	"field.level": "Nível",
	"add.language": "Adicionar Língua",

	// Language levels - CEFR (Common European Framework of Reference for Languages)
	"language.level.a1": "A1",
	"language.level.a2": "A2",
	"language.level.b1": "B1",
	"language.level.b2": "B2",
	"language.level.c1": "C1",
	"language.level.c2": "C2",
	"language.level.native": "Nativo",

	// Certifications
	"field.certification": "Certificação",
	"field.issuer": "Emissor/Instituição",
	"field.completion.date": "Data de Conclusão",
	"field.hours": "Carga Horária",
	"field.validation.link": "Link de Validação",
	"add.certification": "Adicionar Certificação/Curso",
	"certification.title": "Certificação",

	// Projects
	"field.project.name": "Nome do Projeto",
	"field.year": "Ano",
	"field.project.link": "Link",
	"field.project.sourceCode": "Código-fonte",
	"add.project": "Adicionar Projeto",
	"project.title": "Projeto",

	// Volunteer Work
	"field.organization": "Organização",
	"field.impact": "Impacto",
	"add.volunteer": "Adicionar Voluntariado",
	"volunteer.title": "Voluntariado",

	// Placeholders
	"placeholder.full.name": "Ex: Gonçalo Sousa",
	"placeholder.postal.code": "Ex: 1234-567",
	"placeholder.city": "Ex: Viana do Castelo",
	"placeholder.email": "Ex: email@exemplo.com",
	"placeholder.phone": "Ex: 912345678",
	"placeholder.role": "Ex: Desenvolvedor Full Stack",
	"placeholder.company": "Ex: Amazon",
	"placeholder.course": "Ex: Licenciatura em Engenharia Informática",
	"placeholder.institution": "Ex: Universidade do Porto",
	"placeholder.certification.name": "Ex: Certificação AWS Cloud Practitioner",
	"placeholder.issuer": "Ex: Udemy, Alura, AWS",
	"placeholder.hours": "Ex: 40 horas",
	"placeholder.validation.link": "Ex: www.certificate.institution.com/123456",
	"placeholder.project.year": "Ex: 2023",
	"placeholder.project.link": "Ex: www.meuprojeto.com",
	"placeholder.project.sourceCode": "Ex: www.github.com/user/repo",
	"placeholder.project.impact":
		"Ex: Aumentou o engajamento dos usuários em 30% após o lançamento",
	"placeholder.organization": "Ex: Cruz Vermelha Portuguesa",
	"placeholder.volunteer.description":
		"Ex: Prestação de apoio social a famílias carenciadas, distribuição de alimentos e roupas.",
	"placeholder.volunteer.impact":
		"Ex: Ajudou mais de 50 famílias durante a pandemia, organizou campanhas de recolha de donativos.",
	"placeholder.achievements":
		"Ex: Reestruturei a arquitetura da aplicação usando Next.js com SSR, o que melhorou o SEO e aumentou a retenção de usuários em 25%.",
	"placeholder.education.description":
		"Ex: Tese sobre inteligência artificial, disciplinas relevantes, projetos académicos...",
	"placeholder.certification.description":
		"Ex: Curso focado em desenvolvimento de APIs REST com Node.js...",
	"placeholder.year": "Ex: 2023",
	"placeholder.language": "Ex: Inglês",

	// Dropdown options
	"select.month": "Selecione",
	"select.country": "Selecionar país",
	"select.date": "Selecionar data",
	"select.education.type": "Selecione",
	"select.education.status": "Selecione",
	"select.language.label": "Escolher idioma:",
	"select.language.level": "Selecione",

	// Link types
	"link.type.linkedin": "LinkedIn",
	"link.type.github": "GitHub",
	"link.type.gitlab": "GitLab",
	"link.type.portfolio": "Portfolio",
	"link.type.other": "Outro",

	// Link placeholders
	"link.placeholder.linkedin": "Ex: meuperfil",
	"link.placeholder.github": "Ex: utilizador",
	"link.placeholder.gitlab": "Ex: utilizador",
	"link.placeholder.portfolio": "Ex: meuwebsite.com",
	"link.placeholder.other": "Ex: meuwebsite.com",

	// Custom link name
	"field.link.custom.name": "Nome da Plataforma",
	"placeholder.link.custom.name": "Ex: Behance, Dribbble, Medium",
	"field.link.hide.label": "Ocultar nome do link",

	// Months
	"month.jan": "Jan",
	"month.feb": "Fev",
	"month.mar": "Mar",
	"month.apr": "Abr",
	"month.may": "Mai",
	"month.jun": "Jun",
	"month.jul": "Jul",
	"month.aug": "Ago",
	"month.sep": "Set",
	"month.oct": "Out",
	"month.nov": "Nov",
	"month.dec": "Dez",

	// Empty states
	"empty.experience": "Nenhuma experiência adicionada",
	"empty.education": "Nenhuma educação adicionada",
	"empty.language": "Nenhuma língua adicionada",
	"empty.certification": "Nenhuma certificação adicionada",
	"empty.volunteer": "Nenhum voluntariado adicionado",
	"empty.project": "Nenhum projeto adicionado",

	// Tip content
	"tip.keywords.title": "Utiliza palavras-chave exatas do anúncio",
	"tip.keywords.desc":
		"Copia os termos usados no anúncio da oferta (tecnologias, funções, competências). O ATS procura correspondências exatas.",
	"tip.headers.title": "Evita cabeçalhos personalizados",
	"tip.headers.desc":
		"Utiliza termos comuns como 'Experiência Profissional', 'Educação', 'Competências'.",
	"tip.acronyms.title": "Não uses siglas sem escrever também o significado",
	"tip.acronyms.desc":
		"Exemplo: escreve 'JavaScript (JS)' ou 'Base de Dados (BD)' para garantir que é reconhecido.",
	"tip.chronological.title":
		"Coloca as informações por ordem cronológica inversa",
	"tip.chronological.desc":
		"Começa pela experiência mais recente, pois é isso que o ATS e o recrutador querem ver.",
	"tip.job.titles.title": "Inclui títulos de cargos comuns",
	"tip.job.titles.desc":
		"Utiliza nomes genéricos como 'Desenvolvedor Backend', 'Analista de Sistemas', etc., mesmo que o nome oficial da função fosse diferente.",
	"tip.spelling.title": "Evita erros ortográficos",
	"tip.spelling.desc":
		"O ATS pode não reconhecer palavras mal escritas, o que pode levar à exclusão do currículo.",
	"tip.technical.skills.title": "Inclui uma secção de competências técnicas",
	"tip.technical.skills.desc":
		"Lista as tecnologias, linguagens e ferramentas que utilizaste (ex: Java, Git, SQL, Docker).",

	// Template selector
	"template.professional.name": "Professional",
	"template.timeline.name": "Timeline",
	"template.classic.name": "Classic",
	"template.modern.name": "Moderno",
	"template.creative.name": "Criativo",
	"template.minimal.name": "Minimalista",
	"color.selector": "Selecionar Cor",

	// Actions
	actions: "Ações",

	// CV Type Selector
	"cv.type.development": "Desenvolvimento/IT",
	"cv.type.marketing": "Marketing/Digital",
	"cv.type.sales": "Vendas/Comercial",
	"cv.type.hr": "Recursos Humanos",
	"cv.type.finance": "Finanças/Contabilidade",
	"cv.type.design": "Design/Criativo",
	"cv.type.health": "Saúde/Medicina",
	"cv.type.education": "Educação/Ensino",
	"cv.type.admin": "Administração/Gestão",
	"cv.type.other": "Outros",

	// Development specific translations
	"development.field.desired.role": "Cargo Desejado",
	"development.placeholder.desired.role": "Ex: Desenvolvedor Full Stack",
	"development.placeholder.role": "Ex: Desenvolvedor Full Stack",
	"development.field.technologies": "Tecnologias Utilizadas",
	"development.placeholder.technologies":
		"Ex: TypeScript, React, Node.js, PostgreSQL",
	"development.field.technical.skills": "Competências Técnicas",
	"development.placeholder.technical.skills":
		"Ex: JavaScript, React, Node.js, SQL, Git, Docker",
	"development.placeholder.professional.summary":
		"Ex: Desenvolvedor Full Stack com 5 anos de experiência em desenvolvimento web, especializado em React, Node.js e bases de dados. Apaixonado por criar soluções escaláveis e eficientes.",
	"development.placeholder.project.description":
		"Ex: Aplicação web full-stack para gestão de tarefas com autenticação, dashboard interativo e API RESTful. Utilizou React, Node.js e MongoDB.",
	"development.placeholder.project.name": "Ex: Portfolio Website",

	// Marketing specific translations
	"marketing.field.desired.role": "Cargo Desejado",
	"marketing.placeholder.desired.role": "Ex: Marketing Digital Manager",
	"marketing.placeholder.role": "Ex: Marketing Digital Manager",
	"marketing.field.technologies": "Ferramentas Utilizadas",
	"marketing.placeholder.technologies":
		"Ex: Google Analytics, Facebook Ads, Mailchimp, Canva",
	"marketing.field.technical.skills": "Competências Técnicas",
	"marketing.placeholder.technical.skills":
		"Ex: Google Analytics, Facebook Ads, SEO, Email Marketing",
	"marketing.placeholder.professional.summary":
		"Ex: Profissional de Marketing Digital com 4 anos de experiência em campanhas online, especializado em SEO, SEM e análise de dados. Experiência em gestão de redes sociais e email marketing.",
	"marketing.placeholder.project.description":
		"Ex: Campanha de marketing digital para lançamento de produto, incluindo estratégia de redes sociais, email marketing e publicidade paga. Resultado: 300% aumento em vendas.",
	"marketing.placeholder.project.name": "Ex: Campanha de Marketing Digital",

	// Sales specific translations
	"sales.field.desired.role": "Cargo Desejado",
	"sales.placeholder.desired.role": "Ex: Representante de Vendas",
	"sales.placeholder.role": "Ex: Representante de Vendas",
	"sales.field.technologies": "Ferramentas Utilizadas",
	"sales.placeholder.technologies":
		"Ex: Salesforce, HubSpot, LinkedIn Sales Navigator",
	"sales.field.technical.skills": "Competências Técnicas",
	"sales.placeholder.technical.skills":
		"Ex: CRM, Prospecting, Negociação, LinkedIn",
	"sales.placeholder.professional.summary":
		"Ex: Representante de Vendas com 6 anos de experiência em vendas B2B, especializado em prospeção de clientes e fecho de negócios. Histórico comprovado de superação de metas de vendas.",
	"sales.placeholder.project.description":
		"Ex: Campanha de vendas para novo produto SaaS, incluindo prospeção, demonstrações e negociação. Resultado: 15 novos clientes e €150K em vendas.",
	"sales.placeholder.project.name": "Ex: Campanha de Vendas B2B",

	// HR specific translations
	"hr.field.desired.role": "Cargo Desejado",
	"hr.placeholder.desired.role": "Ex: Recrutador",
	"hr.placeholder.role": "Ex: Recrutador",
	"hr.field.technologies": "Ferramentas Utilizadas",
	"hr.placeholder.technologies": "Ex: Workday, BambooHR, LinkedIn Recruiter",
	"hr.field.technical.skills": "Competências Técnicas",
	"hr.placeholder.technical.skills":
		"Ex: Recrutamento, Seleção, Workday, LinkedIn Recruiter",
	"hr.placeholder.professional.summary":
		"Ex: Profissional de Recursos Humanos com 5 anos de experiência em recrutamento e seleção, especializado em recrutamento técnico e gestão de talentos. Experiência em implementação de políticas de RH.",
	"hr.placeholder.project.description":
		"Ex: Projeto de recrutamento para equipa de desenvolvimento, incluindo definição de perfis, sourcing e seleção. Resultado: 8 contratações em 3 meses.",
	"hr.placeholder.project.name": "Ex: Projeto de Recrutamento",

	// Finance specific translations
	"finance.field.desired.role": "Cargo Desejado",
	"finance.placeholder.desired.role": "Ex: Contabilista",
	"finance.placeholder.role": "Ex: Contabilista",
	"finance.field.technologies": "Ferramentas Utilizadas",
	"finance.placeholder.technologies": "Ex: SAP, Excel, QuickBooks, Primavera",
	"finance.field.technical.skills": "Competências Técnicas",
	"finance.placeholder.technical.skills":
		"Ex: SAP, Excel, Contabilidade, Análise Financeira",
	"finance.placeholder.professional.summary":
		"Ex: Contabilista com 7 anos de experiência em contabilidade empresarial, especializado em análise financeira e relatórios fiscais. Experiência em auditoria e controlo interno.",
	"finance.placeholder.project.description":
		"Ex: Projeto de implementação de sistema de contabilidade, incluindo migração de dados e formação de utilizadores. Resultado: redução de 30% no tempo de processamento.",
	"finance.placeholder.project.name": "Ex: Projeto de Contabilidade",

	// Design specific translations
	"design.field.desired.role": "Cargo Desejado",
	"design.placeholder.desired.role": "Ex: Designer Gráfico",
	"design.placeholder.role": "Ex: Designer Gráfico",
	"design.field.technologies": "Ferramentas Utilizadas",
	"design.placeholder.technologies": "Ex: Adobe Creative Suite, Figma, Sketch",
	"design.field.technical.skills": "Competências Técnicas",
	"design.placeholder.technical.skills":
		"Ex: Photoshop, Illustrator, Figma, Design Thinking",
	"design.placeholder.professional.summary":
		"Ex: Designer Gráfico com 6 anos de experiência em design digital e impressão, especializado em identidade visual e design de interfaces. Apaixonado por criar experiências visuais memoráveis.",
	"design.placeholder.project.description":
		"Ex: Redesign completo da identidade visual de uma startup, incluindo logo, website e materiais promocionais. Resultado: aumento de 50% no reconhecimento da marca.",
	"design.placeholder.project.name": "Ex: Projeto de Design",

	// Health specific translations
	"health.field.desired.role": "Cargo Desejado",
	"health.placeholder.desired.role": "Ex: Enfermeiro",
	"health.placeholder.role": "Ex: Enfermeiro",
	"health.field.technologies": "Ferramentas Utilizadas",
	"health.placeholder.technologies": "Ex: Sistema de Gestão Hospitalar, Excel",
	"health.field.technical.skills": "Competências Técnicas",
	"health.placeholder.technical.skills":
		"Ex: Gestão de Doentes, Procedimentos Clínicos, Excel",
	"health.placeholder.professional.summary":
		"Ex: Enfermeiro com 8 anos de experiência em cuidados intensivos, especializado em gestão de doentes críticos e coordenação de equipas. Experiência em formação de novos profissionais.",
	"health.placeholder.project.description":
		"Ex: Projeto de implementação de protocolos de higiene hospitalar, incluindo formação de equipas e monitorização de indicadores. Resultado: redução de 40% em infeções hospitalares.",
	"health.placeholder.project.name": "Ex: Projeto de Saúde",

	// Education specific translations
	"education.field.desired.role": "Cargo Desejado",
	"education.placeholder.desired.role": "Ex: Professor",
	"education.placeholder.role": "Ex: Professor",
	"education.field.technologies": "Ferramentas Utilizadas",
	"education.placeholder.technologies":
		"Ex: Moodle, Google Classroom, PowerPoint",
	"education.field.technical.skills": "Competências Técnicas",
	"education.placeholder.technical.skills":
		"Ex: Moodle, Google Classroom, Metodologias de Ensino",
	"education.placeholder.professional.summary":
		"Ex: Professor com 10 anos de experiência em ensino secundário, especializado em Matemática e Ciências. Experiência em coordenação pedagógica e desenvolvimento de currículos.",
	"education.placeholder.project.description":
		"Ex: Projeto de implementação de ensino híbrido, incluindo desenvolvimento de recursos digitais e formação de professores. Resultado: melhoria de 25% no desempenho dos alunos.",
	"education.placeholder.project.name": "Ex: Projeto Educativo",

	// Admin specific translations
	"admin.field.desired.role": "Cargo Desejado",
	"admin.placeholder.desired.role": "Ex: Assistente Administrativo",
	"admin.placeholder.role": "Ex: Assistente Administrativo",
	"admin.field.technologies": "Ferramentas Utilizadas",
	"admin.placeholder.technologies": "Ex: Microsoft Office, SAP, Excel",
	"admin.field.technical.skills": "Competências Técnicas",
	"admin.placeholder.technical.skills":
		"Ex: Microsoft Office, SAP, Gestão de Documentos",
	"admin.placeholder.professional.summary":
		"Ex: Assistente Administrativo com 9 anos de experiência em gestão administrativa, especializado em organização de eventos e gestão de documentos. Experiência em coordenação de equipas.",
	"admin.placeholder.project.description":
		"Ex: Projeto de digitalização de processos administrativos, incluindo implementação de sistema de gestão documental e formação de equipas. Resultado: redução de 60% no tempo de processamento.",
	"admin.placeholder.project.name": "Ex: Projeto Administrativo",

	// Other specific translations
	"other.field.desired.role": "Cargo Desejado",
	"other.placeholder.desired.role": "Ex: Especialista",
	"other.placeholder.role": "Ex: Especialista",
	"other.field.technologies": "Ferramentas Utilizadas",
	"other.placeholder.technologies": "Ex: Ferramentas específicas da área",
	"other.field.technical.skills": "Competências Técnicas",
	"other.placeholder.technical.skills": "Ex: Competências específicas da área",
	"other.placeholder.professional.summary":
		"Ex: Profissional especializado com experiência na área, demonstrando competências relevantes e resultados comprovados. Adaptável e orientado para resultados.",
	"other.placeholder.project.description":
		"Ex: Projeto específico da área, incluindo objetivos, metodologia e resultados alcançados.",
	"other.placeholder.project.name": "Ex: Projeto Específico",

	// Development specific activities and achievements
	"development.placeholder.activities":
		"Ex: Desenvolvi aplicações web full-stack utilizando React e Node.js\nImplementei APIs RESTful e integração com bases de dados",
	"development.placeholder.achievements":
		"Ex: Reduzi o tempo de carregamento da aplicação em 40%\nImplementei testes automatizados com 90% de cobertura",

	// Marketing specific activities and achievements
	"marketing.placeholder.activities":
		"Ex: Gestionei campanhas de marketing digital para múltiplos clientes\nImplementei estratégias de SEO e SEM para aumentar visibilidade",
	"marketing.placeholder.achievements":
		"Ex: Aumentei o tráfego orgânico em 40% para clientes B2B\nMelhorei a taxa de conversão em 25% através de otimização",

	// Sales specific activities and achievements
	"sales.placeholder.activities":
		"Ex: Prospectei e qualifiquei leads para pipeline de vendas\nConduzi demonstrações de produtos e negociações",
	"sales.placeholder.achievements":
		"Ex: Excedi metas de vendas em 120% por 3 anos consecutivos\nDesenvolvi pipeline de €500K em novos negócios",

	// HR specific activities and achievements
	"hr.placeholder.activities":
		"Ex: Recrutei candidatos para posições técnicas e de gestão\nConduzi entrevistas e avaliações de competências",
	"hr.placeholder.achievements":
		"Ex: Reduzi o tempo de contratação em 30%\nAumentei a diversidade da equipa em 40%",

	// Finance specific activities and achievements
	"finance.placeholder.activities":
		"Ex: Gestionei contabilidade de múltiplas empresas\nPreparei relatórios financeiros mensais e anuais",
	"finance.placeholder.achievements":
		"Ex: Reduzi erros contabilísticos em 60%\nOtimizei processos de fecho mensal em 40%",

	// Design specific activities and achievements
	"design.placeholder.activities":
		"Ex: Criei identidades visuais para marcas e produtos\nDesenvolvi materiais promocionais e campanhas",
	"design.placeholder.achievements":
		"Ex: Aumentei o reconhecimento da marca em 50%\nReduzi o tempo de produção de materiais em 35%",

	// Health specific activities and achievements
	"health.placeholder.activities":
		"Ex: Prestei cuidados de enfermagem especializados\nCoordenei equipas de cuidados de saúde",
	"health.placeholder.achievements":
		"Ex: Reduzi infeções hospitalares em 40%\nMelhorei satisfação dos doentes em 60%",

	// Education specific activities and achievements
	"education.placeholder.activities":
		"Ex: Lecionei disciplinas de Matemática e Ciências\nDesenvolvi planos de aula inovadores",
	"education.placeholder.achievements":
		"Ex: Melhorei desempenho dos alunos em 25%\nImplementei programa de ensino híbrido com sucesso",

	// Admin specific activities and achievements
	"admin.placeholder.activities":
		"Ex: Gestionei administração de empresa com 50 funcionários\nCoordenei eventos corporativos e reuniões",
	"admin.placeholder.achievements":
		"Ex: Reduzi tempo de processamento administrativo em 60%\nOtimizei gestão de documentos em 50%",

	// Other specific activities and achievements
	"other.placeholder.activities":
		"Ex: Desenvolvi projetos específicos da área\nImplementei processos e melhorias",
	"other.placeholder.achievements":
		"Ex: Alcançei objetivos específicos da área\nImplementei melhorias com resultados positivos",

	// Calendar
	"calendar.clear": "Limpar",
	"calendar.today": "Hoje",
	"calendar.month.january": "Janeiro",
	"calendar.month.february": "Fevereiro",
	"calendar.month.march": "Março",
	"calendar.month.april": "Abril",
	"calendar.month.may": "Maio",
	"calendar.month.june": "Junho",
	"calendar.month.july": "Julho",
	"calendar.month.august": "Agosto",
	"calendar.month.september": "Setembro",
	"calendar.month.october": "Outubro",
	"calendar.month.november": "Novembro",
	"calendar.month.december": "Dezembro",
	"calendar.day.sun": "Dom",
	"calendar.day.mon": "Seg",
	"calendar.day.tue": "Ter",
	"calendar.day.wed": "Qua",
	"calendar.day.thu": "Qui",
	"calendar.day.fri": "Sex",
	"calendar.day.sat": "Sáb",

	// Error 404 Page
	"error.404.title": "Página não encontrada",
	"error.404.description":
		"A página que procuras não existe ou foi movida. Verifica o URL ou navega de volta à página inicial.",
	"error.404.home.button": "Voltar à Página Inicial",
	"error.404.builder.button": "Criar CV",

	// Privacy Policy Page
	"privacy.title": "Política de Privacidade",
	"privacy.last.updated": "Última atualização",
	"privacy.introduction.title": "Introdução",
	"privacy.introduction.description":
		"A EasyPeasyCV está empenhada em proteger a tua privacidade. Esta política explica como funcionamos.",
	"privacy.no.collection.title": "Não Recolhemos Dados",
	"privacy.no.collection.description":
		"O EasyPeasyCV é uma aplicação simples que funciona inteiramente no teu navegador. Não recolhemos, armazenamos ou processamos nenhum dado pessoal.",
	"privacy.no.collection.highlight":
		"Os teus dados ficam sempre no teu dispositivo e nunca são enviados para servidores externos.",
	"privacy.local.storage.title": "Armazenamento Local",
	"privacy.local.storage.description":
		"Todos os dados são armazenados localmente no teu navegador:",
	"privacy.local.storage.browser":
		"Os dados ficam no teu navegador (localStorage)",
	"privacy.local.storage.no.server":
		"Nenhuma informação é enviada para servidores",
	"privacy.local.storage.control": "Tens controlo total sobre os teus dados",
	"privacy.cookies.title": "Cookies",
	"privacy.cookies.description":
		"Utilizamos apenas cookies essenciais para o funcionamento do serviço.",
	"privacy.cookies.essential":
		"Estes cookies são necessários para o funcionamento básico da aplicação.",
	"privacy.third.party.title": "Serviços de Terceiros",
	"privacy.third.party.description":
		"Utilizamos apenas serviços externos para funcionalidades específicas:",
	"privacy.third.party.github":
		"GitHub - Para hospedar o código fonte e issues",
	"privacy.third.party.ko.fi": "Ko-fi - Para donativos (opcional)",
	"privacy.changes.title": "Alterações à Política",
	"privacy.changes.description":
		"Podemos atualizar esta política ocasionalmente. Notificaremos os utilizadores sobre alterações significativas.",
	"privacy.contact.title": "Contacto",
	"privacy.contact.description":
		"Se tiveres questões sobre esta política de privacidade, contacta-nos:",
	"privacy.back.home": "Voltar à Página Inicial",

	// Terms of Service Page
	"terms.title": "Termos de Serviço",
	"terms.last.updated": "Última atualização",
	"terms.introduction.title": "Introdução",
	"terms.introduction.description":
		"Ao utilizar o EasyPeasyCV, aceitas estes termos de serviço. Lê-os cuidadosamente antes de utilizar a aplicação.",
	"terms.acceptance.title": "Aceitação dos Termos",
	"terms.acceptance.description":
		"Ao aceder ou utilizar o EasyPeasyCV, confirmas que leste, compreendeste e aceitas estar vinculado a estes termos de serviço.",
	"terms.service.title": "Descrição do Serviço",
	"terms.service.description": "O EasyPeasyCV é uma aplicação web que permite:",
	"terms.service.features.cv": "Criar e editar currículos profissionais",
	"terms.service.features.templates":
		"Utilizar templates profissionais personalizáveis",
	"terms.service.features.pdf": "Exportar CVs em formato PDF",
	"terms.service.features.local": "Armazenamento local dos dados no navegador",
	"terms.responsibilities.title": "Responsabilidades do Utilizador",
	"terms.responsibilities.description": "Como utilizador, és responsável por:",
	"terms.responsibilities.accurate":
		"Fornecer informações precisas e atualizadas",
	"terms.responsibilities.legal":
		"Utilizar o serviço de acordo com a lei aplicável",
	"terms.responsibilities.compliance": "Cumprir todos os termos e condições",
	"terms.prohibited.title": "Utilizações Proibidas",
	"terms.prohibited.description": "Não podes utilizar o serviço para:",
	"terms.prohibited.illegal": "Atividades ilegais ou fraudulentas",
	"terms.prohibited.harmful": "Causar danos ou interferir com o serviço",
	"terms.prohibited.copyright": "Violar direitos de propriedade intelectual",
	"terms.intellectual.title": "Propriedade Intelectual",
	"terms.intellectual.description":
		"O EasyPeasyCV e todo o seu conteúdo são propriedade dos seus criadores. Manténs os direitos sobre o conteúdo que crias.",
	"terms.intellectual.user.content":
		"O conteúdo do teu CV é da tua responsabilidade e propriedade.",
	"terms.privacy.title": "Privacidade e Dados",
	"terms.privacy.description":
		"A recolha e utilização de dados pessoais é regida pela nossa Política de Privacidade.",
	"terms.privacy.policy": "Consulta a nossa",
	"terms.privacy.link": "Política de Privacidade",
	"terms.availability.title": "Disponibilidade do Serviço",
	"terms.availability.description":
		"Esforçamo-nos por manter o serviço disponível, mas não garantimos disponibilidade contínua:",
	"terms.availability.maintenance":
		"Manutenção programada pode causar interrupções",
	"terms.availability.updates":
		"Atualizações podem afetar temporariamente o serviço",
	"terms.availability.force":
		"Eventos fora do nosso controlo podem afetar a disponibilidade",
	"terms.disclaimers.title": "Exclusões de Responsabilidade",
	"terms.disclaimers.description":
		'O serviço é fornecido "tal como está" sem garantias:',
	"terms.disclaimers.warranty":
		"Não garantimos que o serviço seja livre de erros",
	"terms.disclaimers.accuracy": "Não garantimos a precisão do conteúdo gerado",
	"terms.disclaimers.employment":
		"Não garantimos emprego ou resultados de candidaturas",
	"terms.law.title": "Lei Aplicável",
	"terms.law.description": "Estes termos são regidos pela lei portuguesa.",
	"terms.changes.title": "Alterações aos Termos",
	"terms.changes.description":
		"Podemos alterar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.",
	"terms.contact.title": "Contacto",
	"terms.contact.description":
		"Para questões sobre estes termos, contacta-nos:",
	"terms.back.home": "Voltar à Página Inicial",

	// Section Reordering
	"section.move.up": "Mover secção para cima",
	"section.move.down": "Mover secção para baixo",

	// Footer
	"footer.privacy": "Privacidade",
	"footer.terms": "Termos",

	// Forms and validation
	"search.placeholder": "Procurar...",
	"link.error.duplicate": "Já existe um link com este tipo e nome.",
	"content.required.pdf": "Adicione algum conteúdo antes de gerar o PDF.",
	"content.required.preview":
		"Adicione algum conteúdo antes de visualizar o PDF.",
	"thank.you.recommended.title": "Atenção: Campos Recomendados",
	"thank.you.recommended.message":
		"Recomendamos preencher os seguintes campos para um CV mais completo:",

	// Design system (modular CV customisation)
	"design.title": "Design",
	"design.tab.presets": "Base",
	"design.tab.page": "Página",
	"design.tab.header": "Cabeçalho",
	"design.tab.sections": "Secções",
	"design.presets.title": "Ponto de partida",
	"design.presets.help": "Escolhe uma base e ajusta cada opção à tua maneira.",
	"design.presets.customised": "Personalizado a partir de uma base.",
	"design.page.spacing": "Espaçamento",
	"design.page.typography": "Tipografia",
	"design.align.left": "À esquerda",
	"design.align.center": "Centrado",
	"design.header.layout": "Disposição",
	"design.header.align": "Alinhamento",
	"design.header.contact": "Contactos",
	"design.header.divider": "Linha abaixo do cabeçalho",
	"design.header.divider.help": "Separa os teus dados do resto do currículo.",
	"design.contact.inline": "Em linha",
	"design.contact.separated": "Com separador",
	"design.contact.stacked": "Um por linha",
	"design.titles.title": "Títulos das secções",
	"design.titles.help":
		"Aplica-se a todas as secções, para o currículo ler de forma consistente.",
	"design.titles.variant": "Estilo",
	"design.titles.align": "Alinhamento",
	"design.titles.transform": "Maiúsculas",
	"design.titles.transform.help":
		"Afeta os títulos que escreves nas secções personalizadas.",
	"design.title.plain": "Só texto",
	"design.title.ruled": "Com linha",
	"design.title.inlineRule": "Texto + linha",
	"design.title.block": "Faixa",
	"design.dates.title": "Datas",
	"design.dates.help": "Aplica-se a todas as entradas do currículo.",
	"design.dates.placement": "Posição",
	"design.dates.right": "À direita",
	"design.dates.below": "Abaixo do título",
	"design.bullets.title": "Marcadores",
	"design.bullets.help": "Aplica-se a todas as listas do currículo.",
	"design.bullets.marker": "Marcador",
	"design.bullets.dot": "Ponto",
	"design.bullets.dash": "Traço",
	"design.bullets.none": "Sem marcador",
	"design.sections.title": "Estilo por secção",
	"design.sections.help":
		"Cada secção pode ser apresentada de forma diferente.",
	"design.sections.entryStyle": "Apresentação das entradas",
	"design.entries.plain": "Simples",
	"design.entries.card": "Com barra",
	"design.entries.timeline": "Cronologia",
	"design.languages.inline": "Em linha",
	"design.languages.rows": "Em linhas",
	"design.languages.leaders": "Com guia",
	"design.skills.paragraph": "Parágrafo",
	"design.skills.centered": "Centrado",
	"design.skills.bulleted": "Lista",
	"design.section.customise": "Personalizar esta secção",
	"design.section.sheet.help":
		"Encontras todas as opções de design na barra inferior.",
	"design.transform.none": "Como escrito",
	"design.transform.uppercase": "MAIÚSCULAS",
	"section.expand": "Expandir secção",
	"section.collapse": "Recolher secção",
	close: "Fechar",

	// Builder status, navigation and undo
	"a11y.skipToContent": "Saltar para o conteúdo",
	"save.status.saved": "Guardado",
	"save.status.savedAt": "Guardado às {time}",
	"save.status.help": "O teu CV é guardado automaticamente neste navegador.",
	"save.status.error": "Não foi possível guardar",
	"save.status.error.help":
		"O armazenamento do navegador está cheio. Remove a fotografia ou exporta o CV em XML para não perder alterações.",
	"preview.pages.one": "1 página",
	"preview.pages.many": "{n} páginas",
	"preview.compact.try": "Usar modo Muito Compacto",
	"preview.compact.active": "Modo Muito Compacto ativo",
	"completeness.title": "Recomendados",
	"completeness.complete": "Campos recomendados preenchidos",
	"completeness.help":
		"Recrutadores e sistemas ATS contam encontrar estes campos. Clica num para lá ir.",
	"generate.disabled.reason": "Adiciona conteúdo ao CV para o poderes gerar",
	"undo.removed": "Item removido",
	"undo.sectionRemoved": "Secção removida",
	"undo.action": "Anular",
	"section.menu": "Opções da secção",
	"navigator.title": "Secções",
	"navigator.help": "Clica para ir · arrasta para reordenar",
	"navigator.reorder": "Arrastar para reordenar",
	"navigator.filled": "Preenchida",
	"navigator.empty": "Por preencher",

	// Individually styled custom sections
	"design.custom.title": "Secções personalizadas",
	"design.custom.help":
		"Define um estilo por omissão e, se quiseres, dá a cada secção o seu próprio estilo.",
	"design.sections.customDefault": "Estilo por omissão",
	"design.custom.own": "Tem estilo próprio.",
	"design.custom.useDefault": "Usar o estilo por omissão",
	"design.custom.followsDefault": "Segue o estilo por omissão.",
	"examples.title": "Exemplos",
	"examples.selector": "Exemplos para a área",
	"examples.help":
		"Muda apenas os exemplos e sugestões dos campos, neste perfil. O teu CV não é alterado.",
	"examples.current": "Exemplos: {area}",
	"footer.faq": "Ajuda",
	"faq.badge": "Ajuda",
	"faq.title": "Perguntas frequentes",
	"faq.subtitle":
		"Respostas rápidas sobre os teus dados, como criar o CV e o projeto. Se não encontrares o que procuras, fala connosco no fim da página.",
	"faq.group.data": "Privacidade e dados",
	"faq.group.building": "Criar o CV",
	"faq.group.project": "Sobre o EasyPeasyCV",
	"faq.account.q": "Preciso de criar conta?",
	"faq.account.a":
		"Não. Abres o criador e começas a escrever. Não há registo, login nem email.",
	"faq.where.q": "Onde ficam guardados os meus dados?",
	"faq.where.a":
		"Só no teu browser, neste dispositivo. O CV e o PDF são gerados no teu computador e o conteúdo do teu CV nunca é enviado para um servidor.",
	"faq.lose.q": "Posso perder o meu CV?",
	"faq.lose.a":
		"Sim, se limpares os dados do browser, usares uma janela privada ou mudares de browser ou de dispositivo. Para teres uma cópia, usa de vez em quando Dados (XML) › Exportar XML.",
	"faq.move.q": "Como passo o CV para outro computador?",
	"faq.move.a":
		"Exporta o XML neste browser e, no outro, usa Dados (XML) › Importar XML. A importação substitui o conteúdo do perfil aberto, por isso cria antes um perfil novo se quiseres manter o atual.",
	"faq.profiles.q": "Posso ter vários CVs?",
	"faq.profiles.a":
		"Sim. Em Perfis de CV podes criar, duplicar e renomear perfis, por exemplo um CV para cada tipo de vaga. Cada perfil guarda o seu conteúdo e o seu design.",
	"faq.design.q": "Como mudo o aspeto do CV?",
	"faq.design.a":
		"Em Design escolhes uma base e depois ajustas a cor, o tipo de letra, as margens, o cabeçalho e o estilo de cada secção. A pré-visualização atualiza enquanto mexes.",
	"faq.pages.q": "O meu CV tem páginas a mais. O que posso fazer?",
	"faq.pages.a":
		"Experimenta o modo Muito Compacto, que aparece por cima da pré-visualização e em Design › Página. Também podes reduzir a densidade e as margens, ou encurtar experiências mais antigas.",
	"faq.language.q": "Posso descarregar o CV noutra língua?",
	"faq.language.a":
		"Sim. Em Gerar CV escolhes a língua do PDF: os títulos das secções e os textos fixos ficam nessa língua. O que escreveste não é traduzido.",
	"faq.examples.q": "Para que servem os Exemplos?",
	"faq.examples.a":
		"Mudam os exemplos e sugestões dos campos para a tua área profissional. Não alteram o CV.",
	"faq.free.q": "É mesmo grátis?",
	"faq.free.a":
		"Sim, sem planos pagos nem marcas de água. O projeto é open source (licença MIT) e mantém-se com apoios voluntários.",
	"faq.ats.q": "O CV passa nos sistemas ATS?",
	"faq.ats.a":
		"O PDF tem texto real e uma estrutura simples, que os ATS conseguem ler. Nenhuma ferramenta garante que passa: o conteúdo e as palavras-chave da vaga continuam a ser o mais importante.",
	"faq.contact.title": "Não encontraste a resposta?",
	"faq.contact.description":
		"O EasyPeasyCV é open source e o feedback é tratado no GitHub. Precisas de uma conta GitHub, que é gratuita.",
	"faq.contact.bug.title": "Reportar um erro",
	"faq.contact.bug.description":
		"Algo não funciona como devia? Conta o que aconteceu e como repetir.",
	"faq.contact.idea.title": "Sugerir uma ideia",
	"faq.contact.idea.description":
		"Uma funcionalidade ou melhoria que te dava jeito.",
	"faq.contact.note":
		"As issues no GitHub são públicas: não incluas dados pessoais nem o teu CV.",
	"faq.contact.opensInNewTab": "(abre num novo separador)",
	"home.cta": "Criar o meu CV",
	"home.hero.eyebrow": "Gratuito e open source",
	"home.hero.title": "Faz o teu CV em minutos",
	"home.hero.subtitle":
		"Escreves, vês o resultado ao lado e descarregas o PDF. Sem conta, sem pagar e sem marca de água.",
	"home.hero.note":
		"Não pedimos email. O teu CV fica guardado só no teu computador.",
	"home.hero.media.alt":
		"O construtor do EasyPeasyCV: o formulário à esquerda e o CV a atualizar à direita",
	"home.result.title": "É isto que descarregas",
	"home.result.subtitle":
		"Um PDF limpo, pronto a enviar. O CV é teu do início ao fim.",
	"home.result.watermark":
		"Sem marca de água, sem o nosso logótipo e sem pagar no último passo.",
	"home.result.ats":
		"Fácil de ler pelos filtros automáticos que muitas empresas usam para triar CVs.",
	"home.result.language":
		"Descarrega o mesmo CV com os títulos em português, inglês ou espanhol.",
	"home.compare.title": "Porque é diferente",
	"home.compare.subtitle":
		"Muitos sites de CV dizem que são grátis até carregares em descarregar.",
	"home.compare.others": "Muitos sites de CV",
	"home.compare.account.others": "Pedem email e obrigam a criar conta",
	"home.compare.account.us": "Começas logo a escrever",
	"home.compare.data.others": "Guardam o teu CV nos servidores deles",
	"home.compare.data.us": "O CV fica no teu computador. Nós não o vemos.",
	"home.compare.download.others": "Cobram ou põem marca de água no PDF",
	"home.compare.download.us": "PDF grátis e limpo, sempre",
	"home.compare.subscription.others": "Subscrições que se renovam sozinhas",
	"home.compare.subscription.us": "Não há nada para pagar nem cancelar",
	"home.styles.title": "Escolhe um estilo",
	"home.styles.subtitle":
		"Começa por um estilo base e ajusta as cores, a letra e cada secção.",
	"home.styles.media.alt": "Exemplo de estilo de CV",
	"home.styles.link": "Experimentar os estilos",
	"home.details.title": "Pensado para o dia a dia",
	"home.details.mobile.title": "Também no telemóvel",
	"home.details.mobile.description":
		"Dá para fazer o CV todo no telemóvel, sem instalar nada.",
	"home.details.mobile.media.alt": "O EasyPeasyCV aberto num telemóvel",
	"home.details.versions.title": "Um CV para cada candidatura",
	"home.details.versions.description":
		"Guarda várias versões e duplica uma para a adaptar a outra vaga.",
	"home.details.autosave.title": "Guardado automaticamente",
	"home.details.autosave.description":
		"Fecha a página e continua mais tarde, no mesmo browser.",
	"home.details.backup.title": "Cópia num ficheiro",
	"home.details.backup.description":
		"Guarda o teu CV num ficheiro e abre-o noutro computador.",
	"home.details.languages.title": "Em 4 línguas",
	"home.details.languages.description":
		"Português de Portugal e do Brasil, inglês e espanhol.",
	"home.details.ats.title": "Pronto para os filtros automáticos",
	"home.details.ats.description":
		"Texto real e uma estrutura simples, que os sistemas de recrutamento conseguem ler.",
	"home.about.title": "Quem faz o EasyPeasyCV",
	"home.about.p1":
		"Olá! Criei o EasyPeasyCV porque fazer um CV não devia obrigar a criar conta, a entregar os teus dados ou a pagar no último passo.",
	"home.about.p2":
		"É um projeto pessoal e open source: o código está público e qualquer pessoa pode ver como funciona. Se te ajudou, podes apoiar o projeto ou deixar uma sugestão.",
	"home.about.media.alt": "Foto de quem faz o EasyPeasyCV",
	"home.about.github": "Ver o código no GitHub",
	"home.about.support": "Apoiar o projeto",
	"home.about.feedback": "Deixar uma sugestão",
	"home.faq.title": "Perguntas frequentes",
	"home.faq.link": "Ver todas as perguntas",
	"home.final.title": "Pronto para começar?",
	"home.final.subtitle": "Demora poucos minutos e não precisas de conta.",
	"home.styles.custom": "Personalizado",
	"faq.tips.title": "Dicas para um bom CV",
	"faq.tips.subtitle":
		"Pequenos cuidados que ajudam o teu CV a passar nos filtros automáticos e a ser lido por quem decide.",
	"completeness.tipsLink": "Dicas para um bom CV",
};

export default ptTranslations;
