// Brazilian Portuguese
const brTranslations: Record<string, string> = {
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
		"Erro ao importar XML. Verifique o arquivo e tente novamente.",
	"pdf.download.error": "Erro ao gerar PDF. Por favor, tente novamente.",
	"preview.cv": "Pré-visualização do CV",
	preview: "Pré-visualização",
	"live.preview.loading": "Gerando pré-visualização…",
	"live.preview.empty": "Sem conteúdo para pré-visualização.",
	"pdf.preview.title": "Pré-visualização do PDF",
	"pdf.preview.refresh": "Atualizar pré-visualização",
	"pdf.preview.loading": "Gerando PDF...",
	"pdf.preview.retry": "Tentar novamente",
	"pdf.preview.download": "Baixar PDF",
	"pdf.preview.open.new.tab": "Abrir PDF em uma nova aba",
	"pdf.preview.mobile.success": "PDF gerado com sucesso!",
	"pdf.preview.mobile.info":
		"A pré-visualização direta do PDF pode não funcionar no celular.",
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
	"layout.controls.sectionSpacing.label": "Espaçamento entre seções",

	// Profiles
	"profile.selector": "Perfis de CV",
	"profile.manage": "Gerenciar perfis",
	"profile.new": "Novo perfil",
	"profile.copy": "Duplicar",
	"profile.copy.name": "Cópia de {name}",
	"profile.rename": "Renomear",
	"profile.rename.save": "Salvar nome",
	"profile.rename.cancel": "Cancelar edição",
	"profile.delete.title": "Confirmar exclusão",
	"profile.delete": "Excluir",
	"profile.delete.confirm": 'O perfil "{name}" será removido permanentemente.',
	"profile.delete.warning": "Esta ação não pode ser desfeita.",
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
		"Desative para manter o azul padrão de hiperlink.",
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
	"layout.controls.reset": "Resetar layout para padrão",
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
		"Seu currículo foi gerado com sucesso. Esperamos que esta ferramenta tenha sido útil para você. Se gostou do projeto, considere fazer uma pequena doação para ajudar a manter o desenvolvimento.",
	"thank.you.close": "Fechar",
	"donation.title": "Apoiar o Projeto",
	"donation.message":
		"Suas doações ajudam a manter o EasyPeasyCV gratuito e a melhorar continuamente a ferramenta.",
	"donation.button": "Fazer Doação",

	// Form Sections
	"pdf.section.summary": "RESUMO",
	"pdf.section.experience": "EXPERIÊNCIA",
	"pdf.section.education": "EDUCAÇÃO",
	"pdf.section.skills": "COMPETÊNCIAS",
	"pdf.section.languages": "IDIOMAS",
	"pdf.section.certifications": "CERTIFICAÇÕES",
	"pdf.section.projects": "PROJETOS",
	"pdf.section.volunteer": "VOLUNTARIADO",
	"pdf.section.custom": "SEÇÃO PERSONALIZADA",

	"section.personal.info": "Informações Pessoais",
	"section.professional.summary": "Resumo Profissional",
	"section.professional.experience": "Experiência Profissional",
	"section.academic.education": "Educação Acadêmica",
	"section.technical.skills": "Competências Técnicas",
	"section.languages": "Idiomas",
	"section.certifications": "Certificações e Cursos",
	"section.volunteer": "Voluntariado",
	"section.projects": "Projetos",
	"custom.section.add": "Adicionar seção personalizada",
	"custom.section.default": "Seção personalizada",
	"custom.section.name": "Título da seção",
	"custom.section.placeholder.name": "Ex: Prêmios",
	"custom.section.remove": "Remover seção",
	"custom.section.empty.fields": "Ainda não adicionou campos",
	"custom.field.label": "Nome do campo",
	"custom.field.subtitle": "Subtítulo",
	"custom.field.value": "Conteúdo",
	"custom.field.placeholder.label": "Ex: Prêmio",
	"custom.field.placeholder.subtitle": "Ex: Conferência",
	"custom.field.placeholder.value": "Ex: Vencedor da conferência XYZ 2024",
	"custom.field.bullets": "Lista de bullets",
	"custom.field.placeholder.bullets": "Um item por linha",
	"custom.field.start": "Início (mês/ano)",
	"custom.field.end": "Fim (mês/ano)",
	"custom.field.placeholder.month": "Mês",
	"custom.field.placeholder.year": "Ano",
	"custom.field.current": "Atual",
	"custom.field.center": "Centralizar conteúdo",
	"custom.field.add": "Adicionar campo",
	"custom.field.default": "Campo",

	// Personal Information
	"field.full.name": "Nome completo",
	"field.postal.code": "CEP",
	"field.city": "Cidade",
	"field.email": "E-mail",
	"field.country.code": "Código do País",
	"field.phone": "Celular",
	"field.links.social": "Links e Redes Sociais",
	"field.link.type": "Tipo de Link",
	"field.url": "URL",

	// Professional Summary
	"field.professional.summary": "Resumo Profissional",

	// Professional Experience
	"field.role": "Cargo",
	"field.company": "Empresa",
	"field.start.month": "Mês de Início",
	"field.start.year": "Ano de Início",
	"field.end.month": "Mês de Término",
	"field.end.year": "Ano de Término",
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
	"field.education.status": "Status",
	"add.education": "Adicionar Formação",
	"education.title": "Educação",

	// Education types
	"education.type.secondary": "Ensino Médio",
	"education.type.technical": "Técnico",
	"education.type.bachelor": "Graduação",
	"education.type.postgraduate": "Pós-graduação",
	"education.type.master": "Mestrado",
	"education.type.phd": "Doutorado",

	// Education status
	"education.status.completed": "Concluído",
	"education.status.in.progress": "Em andamento",
	"education.status.interrupted": "Interrompido",
	"education.option.none": "Não exibir",

	// Technical Skills
	"field.technical.skills.helper": "Separe as competências por vírgula",

	// Languages
	"field.language": "Idioma",
	"field.level": "Nível",
	"add.language": "Adicionar Idioma",

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
	"placeholder.postal.code": "Ex: 12345-678",
	"placeholder.city": "Ex: São Paulo",
	"placeholder.email": "Ex: email@exemplo.com",
	"placeholder.phone": "Ex: (11) 91234-5678",
	"placeholder.role": "Ex: Desenvolvedor Full Stack",
	"placeholder.company": "Ex: Amazon",
	"placeholder.course": "Ex: Graduação em Engenharia de Software",
	"placeholder.institution": "Ex: Universidade de São Paulo",
	"placeholder.certification.name": "Ex: Certificação AWS Cloud Practitioner",
	"placeholder.issuer": "Ex: Udemy, Alura, AWS",
	"placeholder.hours": "Ex: 40 horas",
	"placeholder.validation.link": "Ex: www.certificate.institution.com/123456",
	"placeholder.project.year": "Ex: 2023",
	"placeholder.project.link": "Ex: www.meuprojeto.com",
	"placeholder.project.sourceCode": "Ex: www.github.com/user/repo",
	"placeholder.project.impact":
		"Ex: Aumentou o engajamento dos usuários em 30% após o lançamento",
	"placeholder.organization": "Ex: Cruz Vermelha Brasileira",
	"placeholder.volunteer.description":
		"Ex: Prestação de apoio social a famílias carentes, distribuição de alimentos e roupas.",
	"placeholder.volunteer.impact":
		"Ex: Ajudou mais de 50 famílias durante a pandemia, organizou campanhas de arrecadação de doações.",
	"placeholder.achievements":
		"Ex: Reestruturei a arquitetura da aplicação usando Next.js com SSR, o que melhorou o SEO e aumentou a retenção de usuários em 25%.",
	"placeholder.education.description":
		"Ex: Tese sobre inteligência artificial, disciplinas relevantes, projetos acadêmicos...",
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
	"link.type.portfolio": "Portfólio",
	"link.type.other": "Outro",

	// Link placeholders
	"link.placeholder.linkedin": "Ex: meuperfil",
	"link.placeholder.github": "Ex: usuario",
	"link.placeholder.gitlab": "Ex: usuario",
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
	"empty.education": "Nenhuma formação adicionada",
	"empty.language": "Nenhum idioma adicionado",
	"empty.certification": "Nenhuma certificação adicionada",
	"empty.volunteer": "Nenhum voluntariado adicionado",
	"empty.project": "Nenhum projeto adicionado",

	// CV Tips
	"tips.title": "Dicas para um Currículo que Passe em Sistemas ATS",
	"tips.subtitle":
		"Siga estas recomendações para aumentar suas chances de ser selecionado",
	"tips.extra.title": "Dica Extra",
	"tips.extra.content":
		"O currículo gerado por esta aplicação já segue estas boas práticas, mas certifique-se de personalizar o conteúdo de acordo com cada vaga específica.",

	// Tip content
	"tip.format.simple.title":
		"Use um formato simples (sem gráficos nem tabelas)",
	"tip.format.simple.desc":
		"Os sistemas ATS têm dificuldade em ler elementos visuais. Utilize apenas texto com uma estrutura clara.",
	"tip.keywords.title": "Use palavras-chave exatas da vaga",
	"tip.keywords.desc":
		"Copie os termos usados no anúncio da vaga (tecnologias, funções, competências). O ATS procura correspondências exatas.",
	"tip.headers.title": "Evite cabeçalhos personalizados",
	"tip.headers.desc":
		"Use termos comuns como 'Experiência Profissional', 'Educação', 'Competências'.",
	"tip.format.file.title":
		"Salve o currículo em formato .docx ou .pdf (simples)",
	"tip.format.file.desc":
		"Alguns ATS têm problemas com PDFs mal formatados ou versões antigas do Word.",
	"tip.acronyms.title": "Não use siglas sem escrever também o significado",
	"tip.acronyms.desc":
		"Exemplo: escreva 'JavaScript (JS)' ou 'Banco de Dados (BD)' para garantir que seja reconhecido.",
	"tip.chronological.title":
		"Coloque as informações em ordem cronológica inversa",
	"tip.chronological.desc":
		"Comece pela experiência mais recente, pois é isso que o ATS e o recrutador querem ver.",
	"tip.job.titles.title": "Inclua títulos de cargos comuns",
	"tip.job.titles.desc":
		"Use nomes genéricos como 'Desenvolvedor Backend', 'Analista de Sistemas', etc., mesmo que o nome oficial da função fosse diferente.",
	"tip.spelling.title": "Evite erros ortográficos",
	"tip.spelling.desc":
		"O ATS pode não reconhecer palavras escritas de forma incorreta, o que pode levar à exclusão do currículo.",
	"tip.technical.skills.title": "Inclua uma seção de competências técnicas",
	"tip.technical.skills.desc":
		"Liste as tecnologias, linguagens e ferramentas que você utilizou (ex: Java, Git, SQL, Docker).",

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
	"development.field.technical.skills": "Habilidades Técnicas",
	"development.placeholder.technical.skills":
		"Ex: JavaScript, React, Node.js, SQL, Git, Docker",
	"development.placeholder.professional.summary":
		"Ex: Desenvolvedor Full Stack com 5 anos de experiência em desenvolvimento web, especializado em React, Node.js e bancos de dados. Apaixonado por criar soluções escaláveis e eficientes.",
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
	"marketing.field.technical.skills": "Habilidades Técnicas",
	"marketing.placeholder.technical.skills":
		"Ex: Google Analytics, Facebook Ads, SEO, Email Marketing",
	"marketing.placeholder.professional.summary":
		"Ex: Profissional de Marketing Digital com 4 anos de experiência em campanhas online, especializado em SEO, SEM e análise de dados. Experiência em gestão de redes sociais e email marketing.",
	"marketing.placeholder.project.description":
		"Ex: Campanha de marketing digital para lançamento de produto, incluindo estratégia de redes sociais, email marketing e publicidade paga. Resultado: aumento de 300% nas vendas.",
	"marketing.placeholder.project.name": "Ex: Campanha de Marketing Digital",

	// Sales specific translations
	"sales.field.desired.role": "Cargo Desejado",
	"sales.placeholder.desired.role": "Ex: Representante de Vendas",
	"sales.placeholder.role": "Ex: Representante de Vendas",
	"sales.field.technologies": "Ferramentas Utilizadas",
	"sales.placeholder.technologies":
		"Ex: Salesforce, HubSpot, LinkedIn Sales Navigator",
	"sales.field.technical.skills": "Habilidades Técnicas",
	"sales.placeholder.technical.skills":
		"Ex: CRM, Prospecção, Negociação, LinkedIn",
	"sales.placeholder.professional.summary":
		"Ex: Representante de Vendas com 6 anos de experiência em vendas B2B, especializado em prospecção de clientes e fechamento de negócios. Histórico comprovado de superação de metas de vendas.",
	"sales.placeholder.project.description":
		"Ex: Campanha de vendas para novo produto SaaS, incluindo prospecção, demonstrações e negociação. Resultado: 15 novos clientes e R$150K em vendas.",
	"sales.placeholder.project.name": "Ex: Campanha de Vendas B2B",

	// HR specific translations
	"hr.field.desired.role": "Cargo Desejado",
	"hr.placeholder.desired.role": "Ex: Recrutador",
	"hr.placeholder.role": "Ex: Recrutador",
	"hr.field.technologies": "Ferramentas Utilizadas",
	"hr.placeholder.technologies": "Ex: Workday, BambooHR, LinkedIn Recruiter",
	"hr.field.technical.skills": "Habilidades Técnicas",
	"hr.placeholder.technical.skills":
		"Ex: Recrutamento, Seleção, Workday, LinkedIn Recruiter",
	"hr.placeholder.professional.summary":
		"Ex: Profissional de Recursos Humanos com 5 anos de experiência em recrutamento e seleção, especializado em recrutamento técnico e gestão de talentos. Experiência em implementação de políticas de RH.",
	"hr.placeholder.project.description":
		"Ex: Projeto de recrutamento para equipe de desenvolvimento, incluindo definição de perfis, sourcing e seleção. Resultado: 8 contratações em 3 meses.",
	"hr.placeholder.project.name": "Ex: Projeto de Recrutamento",

	// Finance specific translations
	"finance.field.desired.role": "Cargo Desejado",
	"finance.placeholder.desired.role": "Ex: Contador",
	"finance.placeholder.role": "Ex: Contador",
	"finance.field.technologies": "Ferramentas Utilizadas",
	"finance.placeholder.technologies": "Ex: SAP, Excel, QuickBooks, Totvs",
	"finance.field.technical.skills": "Habilidades Técnicas",
	"finance.placeholder.technical.skills":
		"Ex: SAP, Excel, Contabilidade, Análise Financeira",
	"finance.placeholder.professional.summary":
		"Ex: Contador com 7 anos de experiência em contabilidade empresarial, especializado em análise financeira e relatórios fiscais. Experiência em auditoria e controle interno.",
	"finance.placeholder.project.description":
		"Ex: Projeto de implementação de sistema de contabilidade, incluindo migração de dados e treinamento de usuários. Resultado: redução de 30% no tempo de processamento.",
	"finance.placeholder.project.name": "Ex: Projeto de Contabilidade",

	// Design specific translations
	"design.field.desired.role": "Cargo Desejado",
	"design.placeholder.desired.role": "Ex: Designer Gráfico",
	"design.placeholder.role": "Ex: Designer Gráfico",
	"design.field.technologies": "Ferramentas Utilizadas",
	"design.placeholder.technologies": "Ex: Adobe Creative Suite, Figma, Sketch",
	"design.field.technical.skills": "Habilidades Técnicas",
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
	"health.field.technical.skills": "Habilidades Técnicas",
	"health.placeholder.technical.skills":
		"Ex: Gestão de Pacientes, Procedimentos Clínicos, Excel",
	"health.placeholder.professional.summary":
		"Ex: Enfermeiro com 8 anos de experiência em cuidados intensivos, especializado em gestão de pacientes críticos e coordenação de equipes. Experiência em treinamento de novos profissionais.",
	"health.placeholder.project.description":
		"Ex: Projeto de implementação de protocolos de higiene hospitalar, incluindo treinamento de equipes e monitoramento de indicadores. Resultado: redução de 40% em infecções hospitalares.",
	"health.placeholder.project.name": "Ex: Projeto de Saúde",

	// Education specific translations
	"education.field.desired.role": "Cargo Desejado",
	"education.placeholder.desired.role": "Ex: Professor",
	"education.placeholder.role": "Ex: Professor",
	"education.field.technologies": "Ferramentas Utilizadas",
	"education.placeholder.technologies":
		"Ex: Moodle, Google Classroom, PowerPoint",
	"education.field.technical.skills": "Habilidades Técnicas",
	"education.placeholder.technical.skills":
		"Ex: Moodle, Google Classroom, Metodologias de Ensino",
	"education.placeholder.professional.summary":
		"Ex: Professor com 10 anos de experiência no ensino médio, especializado em Matemática e Ciências. Experiência em coordenação pedagógica e desenvolvimento de currículos.",
	"education.placeholder.project.description":
		"Ex: Projeto de implementação de ensino híbrido, incluindo desenvolvimento de recursos digitais e treinamento de professores. Resultado: melhoria de 25% no desempenho dos alunos.",
	"education.placeholder.project.name": "Ex: Projeto Educacional",

	// Admin specific translations
	"admin.field.desired.role": "Cargo Desejado",
	"admin.placeholder.desired.role": "Ex: Assistente Administrativo",
	"admin.placeholder.role": "Ex: Assistente Administrativo",
	"admin.field.technologies": "Ferramentas Utilizadas",
	"admin.placeholder.technologies": "Ex: Microsoft Office, SAP, Excel",
	"admin.field.technical.skills": "Habilidades Técnicas",
	"admin.placeholder.technical.skills":
		"Ex: Microsoft Office, SAP, Gestão de Documentos",
	"admin.placeholder.professional.summary":
		"Ex: Assistente Administrativo com 9 anos de experiência em gestão administrativa, especializado em organização de eventos e gestão de documentos. Experiência em coordenação de equipes.",
	"admin.placeholder.project.description":
		"Ex: Projeto de digitalização de processos administrativos, incluindo implementação de sistema de gestão documental e treinamento de equipes. Resultado: redução de 60% no tempo de processamento.",
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
		"Ex: Profissional especializado com experiência na área, demonstrando competências relevantes e resultados comprovados. Adaptável e orientado a resultados.",
	"other.placeholder.project.description":
		"Ex: Projeto específico da área, incluindo objetivos, metodologia e resultados alcançados.",
	"other.placeholder.project.name": "Ex: Projeto Específico",

	// Development specific activities and achievements
	"development.placeholder.activities":
		"Ex: Desenvolvi aplicações web full-stack utilizando React e Node.js\nImplementei APIs RESTful e integração com bancos de dados",
	"development.placeholder.achievements":
		"Ex: Reduzi o tempo de carregamento da aplicação em 40%\nImplementei testes automatizados com 90% de cobertura",

	// Marketing specific activities and achievements
	"marketing.placeholder.activities":
		"Ex: Gerenciei campanhas de marketing digital para múltiplos clientes\nImplementei estratégias de SEO e SEM para aumentar visibilidade",
	"marketing.placeholder.achievements":
		"Ex: Aumentei o tráfego orgânico em 40% para clientes B2B\nMelhorei a taxa de conversão em 25% através de otimização",

	// Sales specific activities and achievements
	"sales.placeholder.activities":
		"Ex: Prospectei e qualifiquei leads para pipeline de vendas\nConduzi demonstrações de produtos e negociações",
	"sales.placeholder.achievements":
		"Ex: Superei metas de vendas em 120% por 3 anos consecutivos\nDesenvolvi pipeline de €500K em novos negócios",

	// HR specific activities and achievements
	"hr.placeholder.activities":
		"Ex: Recrutei candidatos para posições técnicas e de gestão\nConduzi entrevistas e avaliações de competências",
	"hr.placeholder.achievements":
		"Ex: Reduzi o tempo de contratação em 30%\nAumentei a diversidade da equipe em 40%",

	// Finance specific activities and achievements
	"finance.placeholder.activities":
		"Ex: Gerenciei contabilidade de múltiplas empresas\nPreparei relatórios financeiros mensais e anuais",
	"finance.placeholder.achievements":
		"Ex: Reduzi erros contábeis em 60%\nOtimizei processos de fechamento mensal em 40%",

	// Design specific activities and achievements
	"design.placeholder.activities":
		"Ex: Criei identidades visuais para marcas e produtos\nDesenvolvi materiais promocionais e campanhas",
	"design.placeholder.achievements":
		"Ex: Aumentei o reconhecimento da marca em 50%\nReduzi o tempo de produção de materiais em 35%",

	// Health specific activities and achievements
	"health.placeholder.activities":
		"Ex: Prestei cuidados de enfermagem especializados\nCoordenei equipes de cuidados de saúde",
	"health.placeholder.achievements":
		"Ex: Reduzi infecções hospitalares em 40%\nMelhorei a satisfação dos pacientes em 60%",

	// Education specific activities and achievements
	"education.placeholder.activities":
		"Ex: Lecionei disciplinas de Matemática e Ciências\nDesenvolvi planos de aula inovadores",
	"education.placeholder.achievements":
		"Ex: Melhorei desempenho dos alunos em 25%\nImplementei programa de ensino híbrido com sucesso",

	// Admin specific activities and achievements
	"admin.placeholder.activities":
		"Ex: Gerenciei administração de empresa com 50 funcionários\nCoordenei eventos corporativos e reuniões",
	"admin.placeholder.achievements":
		"Ex: Reduzi tempo de processamento administrativo em 60%\nOtimizei gestão de documentos em 50%",

	// Other specific activities and achievements
	"other.placeholder.activities":
		"Ex: Desenvolvi projetos específicos da área\nImplementei processos e melhorias",
	"other.placeholder.achievements":
		"Ex: Alcançei objetivos específicos da área\nImplementei melhorias com resultados positivos",

	// ATS Explanation
	"ats.explanation.title": "O que são Sistemas ATS?",
	"ats.explanation.subtitle":
		"Entenda como funcionam e por que são importantes para o seu CV",
	"ats.explanation.what.title": "O que é um Sistema ATS?",
	"ats.explanation.what.description":
		"ATS (Applicant Tracking System) é um software que as empresas usam para gerenciar candidaturas de emprego. Esses sistemas analisam automaticamente os CVs recebidos, procurando palavras-chave e critérios específicos antes de enviá-los para revisão humana.",
	"ats.explanation.why.title": "Por que é importante?",
	"ats.explanation.why.description":
		"Mais de 75% das empresas usam sistemas ATS para filtrar candidaturas. Se o seu CV não estiver otimizado para esses sistemas, ele pode ser automaticamente rejeitado, mesmo que você tenha as qualificações necessárias.",
	"ats.explanation.why.warning":
		"Sem otimização ATS, seu CV pode ser rejeitado automaticamente, mesmo que você seja qualificado para a vaga!",
	"ats.explanation.how.title": "Como otimizar seu CV para ATS",
	"ats.explanation.how.description":
		"Siga estas dicas para aumentar as chances do seu CV passar pelos filtros ATS:",
	"ats.explanation.how.tip1": "Use palavras-chave exatas do anúncio da vaga",
	"ats.explanation.how.tip2":
		"Mantenha um formato simples, sem gráficos ou tabelas",
	"ats.explanation.how.tip3":
		'Use cabeçalhos padrão como "Experiência Profissional" e "Educação"',
	"ats.explanation.how.tip4":
		"Inclua uma seção de competências técnicas com tecnologias relevantes",
	"ats.explanation.template.title": "Recomendação de Template",
	"ats.explanation.template.description":
		"Para máxima compatibilidade com sistemas ATS, recomendamos o template clássico, que foi especificamente projetado para passar pelos filtros automáticos.",
	"ats.explanation.template.recommendation": "Template Clássico Recomendado",
	"ats.explanation.extra.title": "Dica Importante",
	"ats.explanation.extra.content":
		"O template clássico deste OpenCVLab foi otimizado para sistemas ATS, mas sempre personalize o conteúdo de acordo com cada vaga específica.",

	// ATS Explanation Actions
	"ats.explanation.action.button": "Explicação ATS",
	"ats.explanation.action.description":
		"Aprenda sobre sistemas ATS e como otimizar seu CV",

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
		"A página que você procura não existe ou foi movida. Verifique o URL ou volte para a página inicial.",
	"error.404.home.button": "Voltar à Página Inicial",
	"error.404.builder.button": "Criar CV",

	// Privacy Policy Page
	"privacy.title": "Política de Privacidade",
	"privacy.last.updated": "Última atualização",
	"privacy.introduction.title": "Introdução",
	"privacy.introduction.description":
		"O EasyPeasyCV está comprometido em proteger sua privacidade. Esta política explica como funcionamos.",
	"privacy.no.collection.title": "Não Coletamos Dados",
	"privacy.no.collection.description":
		"O EasyPeasyCV é uma aplicação simples que funciona inteiramente no seu navegador. Não coletamos, armazenamos ou processamos nenhum dado pessoal.",
	"privacy.no.collection.highlight":
		"Seus dados ficam sempre no seu dispositivo e nunca são enviados para servidores externos.",
	"privacy.local.storage.title": "Armazenamento Local",
	"privacy.local.storage.description":
		"Todos os dados são armazenados localmente no seu navegador:",
	"privacy.local.storage.browser":
		"Os dados ficam no seu navegador (localStorage)",
	"privacy.local.storage.no.server":
		"Nenhuma informação é enviada para servidores",
	"privacy.local.storage.control": "Você tem controle total sobre seus dados",
	"privacy.cookies.title": "Cookies",
	"privacy.cookies.description":
		"Utilizamos apenas cookies essenciais para o funcionamento do serviço.",
	"privacy.cookies.essential":
		"Esses cookies são necessários para o funcionamento básico da aplicação.",
	"privacy.third.party.title": "Serviços de Terceiros",
	"privacy.third.party.description":
		"Usamos apenas serviços externos para funcionalidades específicas:",
	"privacy.third.party.github":
		"GitHub - Para hospedar o código-fonte e issues",
	"privacy.third.party.ko.fi": "Ko-fi - Para doações (opcional)",
	"privacy.changes.title": "Alterações à Política",
	"privacy.changes.description":
		"Podemos atualizar esta política ocasionalmente. Notificaremos os usuários sobre alterações significativas.",
	"privacy.contact.title": "Contato",
	"privacy.contact.description":
		"Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco:",
	"privacy.back.home": "Voltar à Página Inicial",

	// Terms of Service Page
	"terms.title": "Termos de Serviço",
	"terms.last.updated": "Última atualização",
	"terms.introduction.title": "Introdução",
	"terms.introduction.description":
		"Ao usar o EasyPeasyCV, você aceita estes termos de serviço. Leia-os atentamente antes de utilizar a aplicação.",
	"terms.acceptance.title": "Aceitação dos Termos",
	"terms.acceptance.description":
		"Ao acessar ou usar o EasyPeasyCV, você confirma que leu, compreendeu e aceita estar vinculado a estes termos de serviço.",
	"terms.service.title": "Descrição do Serviço",
	"terms.service.description": "O EasyPeasyCV é uma aplicação web que permite:",
	"terms.service.features.cv": "Criar e editar currículos profissionais",
	"terms.service.features.templates":
		"Usar templates profissionais personalizáveis",
	"terms.service.features.pdf": "Exportar CVs em formato PDF",
	"terms.service.features.local": "Armazenamento local dos dados no navegador",
	"terms.responsibilities.title": "Responsabilidades do Usuário",
	"terms.responsibilities.description": "Como usuário, você é responsável por:",
	"terms.responsibilities.accurate":
		"Fornecer informações precisas e atualizadas",
	"terms.responsibilities.legal":
		"Usar o serviço de acordo com a legislação aplicável",
	"terms.responsibilities.compliance": "Cumprir todos os termos e condições",
	"terms.prohibited.title": "Usos Proibidos",
	"terms.prohibited.description": "Você não pode usar o serviço para:",
	"terms.prohibited.illegal": "Atividades ilegais ou fraudulentas",
	"terms.prohibited.harmful": "Causar danos ou interferir com o serviço",
	"terms.prohibited.copyright": "Violar direitos de propriedade intelectual",
	"terms.intellectual.title": "Propriedade Intelectual",
	"terms.intellectual.description":
		"O EasyPeasyCV e todo o seu conteúdo são propriedade de seus criadores. Você mantém os direitos sobre o conteúdo que cria.",
	"terms.intellectual.user.content":
		"O conteúdo do seu CV é de sua responsabilidade e propriedade.",
	"terms.privacy.title": "Privacidade e Dados",
	"terms.privacy.description":
		"A coleta e uso de dados pessoais é regida pela nossa Política de Privacidade.",
	"terms.privacy.policy": "Consulte nossa",
	"terms.privacy.link": "Política de Privacidade",
	"terms.availability.title": "Disponibilidade do Serviço",
	"terms.availability.description":
		"Nos esforçamos para manter o serviço disponível, mas não garantimos disponibilidade contínua:",
	"terms.availability.maintenance":
		"Manutenção programada pode causar interrupções",
	"terms.availability.updates":
		"Atualizações podem afetar temporariamente o serviço",
	"terms.availability.force":
		"Eventos fora do nosso controle podem afetar a disponibilidade",
	"terms.disclaimers.title": "Isenções de Responsabilidade",
	"terms.disclaimers.description":
		'O serviço é fornecido "como está" sem garantias:',
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
	"terms.contact.title": "Contato",
	"terms.contact.description":
		"Para dúvidas sobre estes termos, entre em contato:",
	"terms.back.home": "Voltar à Página Inicial",

	// Section Reordering
	"section.move.up": "Mover seção para cima",
	"section.move.down": "Mover seção para baixo",

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
	"design.tab.sections": "Seções",
	"design.presets.title": "Ponto de partida",
	"design.presets.help": "Escolha uma base e ajuste cada opção do seu jeito.",
	"design.presets.customised": "Personalizado a partir de uma base.",
	"design.page.spacing": "Espaçamento",
	"design.page.typography": "Tipografia",
	"design.align.left": "À esquerda",
	"design.align.center": "Centralizado",
	"design.header.layout": "Disposição",
	"design.header.align": "Alinhamento",
	"design.header.contact": "Contatos",
	"design.header.divider": "Linha abaixo do cabeçalho",
	"design.header.divider.help": "Separa seus dados do resto do currículo.",
	"design.contact.inline": "Em linha",
	"design.contact.separated": "Com separador",
	"design.contact.stacked": "Um por linha",
	"design.titles.title": "Títulos das seções",
	"design.titles.help":
		"Vale para todas as seções, para o currículo ficar consistente.",
	"design.titles.variant": "Estilo",
	"design.titles.align": "Alinhamento",
	"design.titles.transform": "Maiúsculas",
	"design.titles.transform.help":
		"Afeta os títulos que você escreve nas seções personalizadas.",
	"design.title.plain": "Só texto",
	"design.title.ruled": "Com linha",
	"design.title.inlineRule": "Texto + linha",
	"design.title.block": "Faixa",
	"design.dates.title": "Datas",
	"design.dates.help": "Vale para todas as entradas do currículo.",
	"design.dates.placement": "Posição",
	"design.dates.right": "À direita",
	"design.dates.below": "Abaixo do título",
	"design.bullets.title": "Marcadores",
	"design.bullets.help": "Vale para todas as listas do currículo.",
	"design.bullets.marker": "Marcador",
	"design.bullets.dot": "Ponto",
	"design.bullets.dash": "Traço",
	"design.bullets.none": "Sem marcador",
	"design.sections.title": "Estilo por seção",
	"design.sections.help":
		"Cada seção pode ser apresentada de um jeito diferente.",
	"design.sections.entryStyle": "Apresentação das entradas",
	"design.entries.plain": "Simples",
	"design.entries.card": "Com barra",
	"design.entries.timeline": "Linha do tempo",
	"design.languages.inline": "Em linha",
	"design.languages.rows": "Em linhas",
	"design.languages.leaders": "Com guia",
	"design.skills.paragraph": "Parágrafo",
	"design.skills.centered": "Centralizado",
	"design.skills.bulleted": "Lista",
	"design.section.customise": "Personalizar esta seção",
	"design.section.sheet.help":
		"Todas as opções de design estão na barra inferior.",
	"design.transform.none": "Como escrito",
	"design.transform.uppercase": "MAIÚSCULAS",
	"section.expand": "Expandir seção",
	"section.collapse": "Recolher seção",
	close: "Fechar",

	// Builder status, navigation and undo
	"a11y.skipToContent": "Pular para o conteúdo",
	"save.status.saved": "Salvo",
	"save.status.savedAt": "Salvo às {time}",
	"save.status.help": "Seu currículo é salvo automaticamente neste navegador.",
	"save.status.error": "Não foi possível salvar",
	"save.status.error.help":
		"O armazenamento do navegador está cheio. Remova a foto ou exporte o currículo em XML para não perder alterações.",
	"preview.pages.one": "1 página",
	"preview.pages.many": "{n} páginas",
	"preview.compact.try": "Usar modo Muito Compacto",
	"preview.compact.active": "Modo Muito Compacto ativo",
	"completeness.title": "Recomendados",
	"completeness.complete": "Campos recomendados preenchidos",
	"completeness.help":
		"Recrutadores e sistemas ATS esperam encontrar estes campos. Clique em um para ir até ele.",
	"generate.disabled.reason":
		"Adicione conteúdo ao currículo para poder gerá-lo",
	"undo.removed": "Item removido",
	"undo.sectionRemoved": "Seção removida",
	"undo.action": "Desfazer",
	"section.menu": "Opções da seção",
	"navigator.title": "Seções",
	"navigator.help": "Clique para ir · arraste para reordenar",
	"navigator.reorder": "Arrastar para reordenar",
	"navigator.filled": "Preenchida",
	"navigator.empty": "Não preenchida",

	// Individually styled custom sections
	"design.custom.title": "Seções personalizadas",
	"design.custom.help":
		"Defina um estilo padrão e, se quiser, dê a cada seção seu próprio estilo.",
	"design.sections.customDefault": "Estilo padrão",
	"design.custom.own": "Tem estilo próprio.",
	"design.custom.useDefault": "Usar o estilo padrão",
	"design.custom.followsDefault": "Segue o estilo padrão.",
	"examples.title": "Exemplos",
	"examples.selector": "Exemplos para a área",
	"examples.help":
		"Muda apenas os exemplos e sugestões dos campos, neste perfil. Seu currículo não é alterado.",
	"examples.current": "Exemplos: {area}",
	"footer.faq": "Ajuda",
	"faq.badge": "Ajuda",
	"faq.title": "Perguntas frequentes",
	"faq.subtitle":
		"Respostas rápidas sobre seus dados, como criar o currículo e o projeto. Se não encontrar o que procura, fale com a gente no fim da página.",
	"faq.group.data": "Privacidade e dados",
	"faq.group.building": "Criar o currículo",
	"faq.group.project": "Sobre o EasyPeasyCV",
	"faq.account.q": "Preciso criar uma conta?",
	"faq.account.a":
		"Não. Você abre o criador e começa a escrever. Não há cadastro, login nem e-mail.",
	"faq.where.q": "Onde meus dados ficam salvos?",
	"faq.where.a":
		"Só no seu navegador, neste dispositivo. O currículo e o PDF são gerados no seu computador e o conteúdo do seu currículo nunca é enviado para um servidor.",
	"faq.lose.q": "Posso perder meu currículo?",
	"faq.lose.a":
		"Sim, se você limpar os dados do navegador, usar uma janela anônima ou trocar de navegador ou de dispositivo. Para ter uma cópia, use de vez em quando Dados (XML) › Exportar XML.",
	"faq.move.q": "Como passo o currículo para outro computador?",
	"faq.move.a":
		"Exporte o XML neste navegador e, no outro, use Dados (XML) › Importar XML. A importação substitui o conteúdo do perfil aberto, então crie antes um perfil novo se quiser manter o atual.",
	"faq.profiles.q": "Posso ter vários currículos?",
	"faq.profiles.a":
		"Sim. Em Perfis de CV você pode criar, duplicar e renomear perfis, por exemplo um currículo para cada tipo de vaga. Cada perfil guarda seu conteúdo e seu design.",
	"faq.design.q": "Como mudo a aparência do currículo?",
	"faq.design.a":
		"Em Design você escolhe uma base e depois ajusta a cor, a fonte, as margens, o cabeçalho e o estilo de cada seção. A pré-visualização atualiza enquanto você mexe.",
	"faq.pages.q": "Meu currículo tem páginas demais. O que posso fazer?",
	"faq.pages.a":
		"Experimente o modo Muito Compacto, que aparece acima da pré-visualização e em Design › Página. Você também pode reduzir a densidade e as margens, ou encurtar experiências mais antigas.",
	"faq.language.q": "Posso baixar o currículo em outro idioma?",
	"faq.language.a":
		"Sim. Em Gerar CV você escolhe o idioma do PDF: os títulos das seções e os textos fixos ficam nesse idioma. O que você escreveu não é traduzido.",
	"faq.examples.q": "Para que servem os Exemplos?",
	"faq.examples.a":
		"Eles mudam os exemplos e sugestões dos campos para a sua área profissional. Não alteram o currículo.",
	"faq.free.q": "É grátis mesmo?",
	"faq.free.a":
		"Sim, sem planos pagos nem marcas d'água. O projeto é open source (licença MIT) e se mantém com apoios voluntários.",
	"faq.ats.q": "O currículo passa nos sistemas ATS?",
	"faq.ats.a":
		"O PDF tem texto real e uma estrutura simples, que os ATS conseguem ler. Nenhuma ferramenta garante a aprovação: o conteúdo e as palavras-chave da vaga continuam sendo o mais importante.",
	"faq.contact.title": "Não encontrou a resposta?",
	"faq.contact.description":
		"O EasyPeasyCV é open source e o feedback é tratado no GitHub. Você precisa de uma conta no GitHub, que é gratuita.",
	"faq.contact.bug.title": "Relatar um erro",
	"faq.contact.bug.description":
		"Algo não funciona como deveria? Conte o que aconteceu e como repetir.",
	"faq.contact.idea.title": "Sugerir uma ideia",
	"faq.contact.idea.description":
		"Uma funcionalidade ou melhoria que seria útil para você.",
	"faq.contact.note":
		"As issues no GitHub são públicas: não inclua dados pessoais nem seu currículo.",
	"faq.contact.opensInNewTab": "(abre em uma nova aba)",
	"home.cta": "Criar meu currículo",
	"home.hero.eyebrow": "Gratuito e open source",
	"home.hero.title": "Faça seu currículo em minutos",
	"home.hero.subtitle":
		"Você escreve, vê o resultado ao lado e baixa o PDF. Sem cadastro, sem pagar e sem marca d'água.",
	"home.hero.note":
		"Não pedimos e-mail. Seu currículo fica salvo só no seu computador.",
	"home.hero.media.alt":
		"O criador do EasyPeasyCV: o formulário à esquerda e o currículo atualizando à direita",
	"home.result.title": "É isto que você baixa",
	"home.result.subtitle":
		"Um PDF limpo, pronto para enviar. O currículo é seu do começo ao fim.",
	"home.result.watermark":
		"Sem marca d'água, sem o nosso logo e sem pagar no último passo.",
	"home.result.ats":
		"Fácil de ler pelos filtros automáticos que muitas empresas usam para triar currículos.",
	"home.result.language":
		"Baixe o mesmo currículo com os títulos em português, inglês ou espanhol.",
	"home.compare.title": "Por que é diferente",
	"home.compare.subtitle":
		"Muitos sites de currículo dizem que são grátis até você clicar em baixar.",
	"home.compare.others": "Muitos sites de currículo",
	"home.compare.account.others": "Pedem e-mail e obrigam a criar conta",
	"home.compare.account.us": "Você já começa escrevendo",
	"home.compare.data.others": "Guardam seu currículo nos servidores deles",
	"home.compare.data.us":
		"O currículo fica no seu computador. Nós não o vemos.",
	"home.compare.download.others": "Cobram ou colocam marca d'água no PDF",
	"home.compare.download.us": "PDF grátis e limpo, sempre",
	"home.compare.subscription.others": "Assinaturas que renovam sozinhas",
	"home.compare.subscription.us": "Não há nada para pagar nem cancelar",
	"home.styles.title": "Escolha um estilo",
	"home.styles.subtitle":
		"Comece por um estilo base e ajuste as cores, a fonte e cada seção.",
	"home.styles.media.alt": "Exemplo de estilo de currículo",
	"home.styles.link": "Experimentar os estilos",
	"home.details.title": "Pensado para o dia a dia",
	"home.details.mobile.title": "No celular também",
	"home.details.mobile.description":
		"Dá para fazer o currículo inteiro no celular, sem instalar nada.",
	"home.details.mobile.media.alt": "O EasyPeasyCV aberto em um celular",
	"home.details.versions.title": "Um currículo para cada vaga",
	"home.details.versions.description":
		"Salve várias versões e duplique uma para adaptar a outra vaga.",
	"home.details.autosave.title": "Salvo automaticamente",
	"home.details.autosave.description":
		"Feche a página e continue mais tarde, no mesmo navegador.",
	"home.details.backup.title": "Cópia em um arquivo",
	"home.details.backup.description":
		"Salve seu currículo em um arquivo e abra em outro computador.",
	"home.details.languages.title": "Em 4 idiomas",
	"home.details.languages.description":
		"Português do Brasil e de Portugal, inglês e espanhol.",
	"home.details.ats.title": "Pronto para os filtros automáticos",
	"home.details.ats.description":
		"Texto real e uma estrutura simples, que os sistemas de recrutamento conseguem ler.",
	"home.about.title": "Quem faz o EasyPeasyCV",
	"home.about.p1":
		"Oi! Criei o EasyPeasyCV porque fazer um currículo não deveria obrigar você a criar conta, entregar seus dados ou pagar no último passo.",
	"home.about.p2":
		"É um projeto pessoal e open source: o código é público e qualquer pessoa pode ver como funciona. Se ele te ajudou, você pode apoiar o projeto ou deixar uma sugestão.",
	"home.about.media.alt": "Foto de quem faz o EasyPeasyCV",
	"home.about.github": "Ver o código no GitHub",
	"home.about.support": "Apoiar o projeto",
	"home.about.feedback": "Deixar uma sugestão",
	"home.faq.title": "Perguntas frequentes",
	"home.faq.link": "Ver todas as perguntas",
	"home.final.title": "Pronto para começar?",
	"home.final.subtitle": "Leva poucos minutos e você não precisa de cadastro.",
	"home.styles.custom": "Personalizado",
};

export default brTranslations;
