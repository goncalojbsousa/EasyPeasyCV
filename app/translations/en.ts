// English translations
const enTranslations: Record<string, string> = {
	// Header
	"app.title": "EasyPeasyCV",

	// Landing Page - Legacy
	"landing.view.github.button": "View on GitHub",

	// Open Source Section
	"landing.opensource.support.button": "Support the Project",

	// CTA Section
	"generate.ats.resume": "Generate CV",
	"data.xml.title": "Data (XML)",
	"data.xml.export": "Export XML",
	"data.xml.import": "Import XML",
	"data.import.error":
		"Error importing XML. Please check the file and try again.",
	"pdf.download.error": "Error generating PDF. Please try again.",
	"preview.cv": "CV Preview",
	preview: "Preview",
	"live.preview.loading": "Generating preview…",
	"live.preview.empty": "No content to preview.",
	"pdf.preview.title": "PDF Preview",
	"pdf.preview.refresh": "Refresh preview",
	"pdf.preview.loading": "Generating PDF...",
	"pdf.preview.retry": "Try again",
	"pdf.preview.download": "Download PDF",
	"pdf.preview.open.new.tab": "Open PDF in a new tab",
	"pdf.preview.mobile.success": "PDF generated successfully!",
	"pdf.preview.mobile.info": "Direct PDF preview may not work on mobile.",
	"pdf.preview.size": "Size",
	"pdf.preview.error.generate": "Error generating PDF",
	"pdf.preview.error.unknown": "Unknown error",
	"pdf.preview.error.loading": "Error loading PDF",
	"layout.controls.font.label": "Font",
	"layout.controls.textScale.label": "Text scale",
	"layout.controls.margins.title": "Margins",
	"layout.controls.margins.top": "Top",
	"layout.controls.margins.bottom": "Bottom",
	"layout.controls.margins.left": "Left",
	"layout.controls.margins.right": "Right",
	"layout.controls.lineSpacing.label": "Line spacing",
	"layout.controls.sectionSpacing.label": "Section spacing",

	// Profiles
	"profile.selector": "CV Profiles",
	"profile.manage": "Manage profiles",
	"profile.new": "New profile",
	"profile.copy": "Duplicate",
	"profile.copy.name": "Copy of {name}",
	"profile.rename": "Rename",
	"profile.rename.save": "Save name",
	"profile.rename.cancel": "Cancel edit",
	"profile.delete.title": 'Delete the "{name}" profile?',
	"profile.delete": "Delete",
	"profile.delete.confirm":
		"This profile's CV is erased from this browser. It can't be recovered.",
	"profile.delete.cancel": "Cancel",
	"profile.unnamed": "Unnamed profile",
	"layout.controls.header.nameSection": "Name and Title",
	"layout.controls.header.nameSize": "Name size",
	"layout.controls.header.weight.label": "Weight",
	"layout.controls.header.weight.normal": "Normal",
	"layout.controls.header.weight.bold": "Bold",
	"layout.controls.header.weight.heavy": "Heavy",
	"layout.controls.header.color": "Color",
	"layout.controls.header.titleStyle.label": "Title style",
	"layout.controls.header.titleStyle.normal": "Normal",
	"layout.controls.header.titleStyle.italic": "Italic",
	"layout.controls.header.titleStyle.uppercase": "Uppercase",
	"layout.controls.header.divider.title": "Divider line",
	"layout.controls.header.divider.thickness": "Thickness",
	"layout.controls.header.divider.style.label": "Style",
	"layout.controls.header.divider.style.solid": "Solid",
	"layout.controls.header.divider.style.dashed": "Dashed",
	"layout.controls.photo.title": "Photo",
	"layout.controls.photo.enable": "Enable photo",
	"layout.controls.photo.borderRadius.label": "Border Radius",
	"layout.controls.photo.choose": "Choose photo",
	"layout.controls.photo.atsWarning":
		"Heads up: using a photo is not recommended. ATS systems ignore images, and at the human stage a photo can introduce bias against you.",
	"layout.controls.links.useThemeColor.label": "Use theme color on links",
	"layout.controls.links.useThemeColor.help":
		"Turn off to keep the standard hyperlink blue.",
	"layout.controls.density.label": "Layout Density",
	"layout.controls.density.compact": "Compact",
	"layout.controls.density.normal": "Normal",
	"layout.controls.density.spacious": "Spacious",
	"layout.controls.density.help":
		"Automatically adjusts margins, spacing and text size",
	"layout.controls.singlePageMode.label": "Super Compact",
	"layout.controls.singlePageMode.help":
		"Fits maximum information possible per page",
	"layout.controls.textAlignment.label": "Text Alignment",
	"layout.controls.textAlignment.left": "Left",
	"layout.controls.textAlignment.justify": "Justify",
	"layout.controls.sections.titleColor": "Title color",
	"layout.controls.sections.titleSize": "Title size",
	"layout.controls.sections.dateFormat.label": "Date Format",
	"layout.controls.dateFormat.short": "Short (01/2020)",
	"layout.controls.dateFormat.medium": "Medium (Jan 2020)",
	"layout.controls.dateFormat.long": "Long (January 2020)",
	"layout.controls.reset": "Reset layout to default",
	"language.portuguese": "Português",
	"language.english": "English",
	"language.spanish": "Español",
	"language.brazilianPortuguese": "Português-BR",

	// Notifications
	"data.loaded.from.browser": "Data automatically loaded from browser.",
	"data.loaded.xml": "Data imported from XML.",
	"cv.generated":
		"Resume generated successfully! Download should start automatically.",
	"section.order.reset": "Restore Default Template Order",
	"fill.example": "Fill with example data",

	// Thank you modal
	"thank.you.title": "Thank you for using EasyPeasyCV!",
	"thank.you.message":
		"Your resume has been generated successfully. We hope this tool has been useful for you. If you liked the project, consider making a small donation to help maintain development.",
	"thank.you.close": "Close",
	"donation.title": "Support the Project",
	"donation.message":
		"Your donations help keep EasyPeasyCV free and continuously improve the tool.",
	"donation.button": "Make Donation",

	// Form Sections
	"pdf.section.summary": "SUMMARY",
	"pdf.section.experience": "EXPERIENCE",
	"pdf.section.education": "EDUCATION",
	"pdf.section.skills": "SKILLS",
	"pdf.section.languages": "LANGUAGES",
	"pdf.section.certifications": "CERTIFICATIONS",
	"pdf.section.projects": "PROJECTS",
	"pdf.section.volunteer": "VOLUNTEER",
	"pdf.section.custom": "CUSTOM SECTION",

	"section.personal.info": "Personal Information",
	"section.professional.summary": "Professional Summary",
	"section.professional.experience": "Professional Experience",
	"section.academic.education": "Academic Education",
	"section.technical.skills": "Technical Skills",
	"section.languages": "Languages",
	"section.certifications": "Certifications & Courses",
	"section.volunteer": "Volunteer Work",
	"section.projects": "Projects",
	"custom.section.add": "Add custom section",
	"custom.section.default": "Custom section",
	"custom.section.name": "Section title",
	"custom.section.placeholder.name": "e.g., Awards",
	"custom.section.remove": "Remove section",
	"custom.section.empty.fields": "No fields added yet",
	"custom.field.label": "Field label",
	"custom.field.subtitle": "Subtitle",
	"custom.field.value": "Field content",
	"custom.field.placeholder.label": "e.g., Award",
	"custom.field.placeholder.subtitle": "e.g., Conference",
	"custom.field.placeholder.value": "e.g., Winner of XYZ conference 2024",
	"custom.field.bullets": "Bullet list",
	"custom.field.placeholder.bullets": "One item per line",
	"custom.field.start": "Start (month/year)",
	"custom.field.end": "End (month/year)",
	"custom.field.placeholder.month": "Mon",
	"custom.field.placeholder.year": "Year",
	"custom.field.current": "Current",
	"custom.field.center": "Center content",
	"custom.field.add": "Add field",
	"custom.field.default": "Field",

	// Personal Information
	"field.full.name": "Full name",
	"field.postal.code": "ZIP code",
	"field.city": "City",
	"field.email": "Email",
	"field.country.code": "Country Code",
	"field.phone": "Phone",
	"field.links.social": "Links & Social Media",
	"field.link.type": "Link Type",
	"field.url": "URL",

	// Professional Summary
	"field.professional.summary": "Professional Summary",

	// Professional Experience
	"field.role": "Role",
	"field.company": "Company",
	"field.start.month": "Start Month",
	"field.start.year": "Start Year",
	"field.end.month": "End Month",
	"field.end.year": "End Year",
	"field.current": "Current",
	"field.activities": "Activities Developed",
	"field.achievements.label": "Achievements",
	"field.achievements.helper": "with metrics",
	"add.experience": "Add Experience",
	"experience.title": "Experience",

	// Academic Education
	"field.course": "Course",
	"field.institution": "Institution",
	"field.description": "Description",
	"field.education.type": "Education Type",
	"field.education.status": "Status",
	"add.education": "Add Education",
	"education.title": "Education",

	// Education types
	"education.type.secondary": "Secondary Education",
	"education.type.technical": "Technical",
	"education.type.bachelor": "Bachelor's Degree",
	"education.type.postgraduate": "Postgraduate",
	"education.type.master": "Master's Degree",
	"education.type.phd": "PhD",

	// Education status
	"education.status.completed": "Completed",
	"education.status.in.progress": "In Progress",
	"education.status.interrupted": "Interrupted",
	"education.option.none": "Do not show",

	// Technical Skills
	"field.technical.skills.helper": "Separate skills by comma",

	// Languages
	"field.language": "Language",
	"field.level": "Level",
	"add.language": "Add Language",

	// Language levels - CEFR (Common European Framework of Reference for Languages)
	"language.level.a1": "A1",
	"language.level.a2": "A2",
	"language.level.b1": "B1",
	"language.level.b2": "B2",
	"language.level.c1": "C1",
	"language.level.c2": "C2",
	"language.level.native": "Native",

	// Certifications
	"field.certification": "Certification",
	"field.issuer": "Issuer/Institution",
	"field.completion.date": "Completion Date",
	"field.hours": "Hours",
	"field.validation.link": "Validation Link",
	"add.certification": "Add Certification/Course",
	"certification.title": "Certification",

	// Projects
	"field.project.name": "Project Name",
	"field.year": "Year",
	"field.project.link": "Link",
	"field.project.sourceCode": "Source Code",
	"add.project": "Add Project",
	"project.title": "Project",

	// Volunteer Work
	"field.organization": "Organization",
	"field.impact": "Impact",
	"add.volunteer": "Add Volunteer Work",
	"volunteer.title": "Volunteer Work",

	// Placeholders
	"placeholder.full.name": "e.g., John Doe",
	"placeholder.postal.code": "e.g., 12345",
	"placeholder.city": "e.g., Lisbon",
	"placeholder.email": "e.g., email@example.com",
	"placeholder.phone": "e.g., 912345678",
	"placeholder.role": "e.g., Full Stack Developer",
	"placeholder.company": "e.g., Amazon",
	"placeholder.course": "e.g., Computer Science",
	"placeholder.institution": "e.g., University of Lisbon",
	"placeholder.certification.name":
		"e.g., AWS Cloud Practitioner Certification",
	"placeholder.issuer": "e.g., Udemy, Alura, AWS",
	"placeholder.hours": "e.g., 40 hours",
	"placeholder.validation.link": "e.g., www.certificate.institution.com/123456",
	"placeholder.project.year": "e.g., 2023",
	"placeholder.project.link": "e.g., www.myproject.com",
	"placeholder.project.sourceCode": "e.g., www.github.com/user/repo",
	"placeholder.project.impact":
		"e.g., Increased user engagement by 30% after launch",
	"placeholder.organization": "e.g., Red Cross Portugal",
	"placeholder.volunteer.description":
		"e.g., Providing social support to families in need, distributing food and clothing.",
	"placeholder.volunteer.impact":
		"e.g., Helped more than 50 families during the pandemic, organized donation campaigns.",
	"placeholder.achievements":
		"e.g., I restructured the application architecture using Next.js with SSR, which improved SEO and increased user retention by 25%.",
	"placeholder.education.description":
		"e.g., Thesis on artificial intelligence, relevant subjects, academic projects...",
	"placeholder.certification.description":
		"e.g., Course focused on REST API development with Node.js...",
	"placeholder.year": "e.g., 2023",
	"placeholder.language": "e.g., English",

	// Dropdown options
	"select.month": "Select",
	"select.country": "Select country",
	"select.date": "Select date",
	"select.education.type": "Select",
	"select.education.status": "Select",
	"select.language.label": "Select language:",
	"select.language.level": "Select",

	// Link types
	"link.type.linkedin": "LinkedIn",
	"link.type.github": "GitHub",
	"link.type.gitlab": "GitLab",
	"link.type.portfolio": "Portfolio",
	"link.type.other": "Other",

	// Link placeholders
	"link.placeholder.linkedin": "e.g., myprofile",
	"link.placeholder.github": "e.g., user",
	"link.placeholder.gitlab": "e.g., user",
	"link.placeholder.portfolio": "e.g., mywebsite.com",
	"link.placeholder.other": "e.g., mywebsite.com",

	// Custom link name
	"field.link.custom.name": "Platform Name",
	"placeholder.link.custom.name": "E.g.: Behance, Dribbble, Medium",
	"field.link.hide.label": "Hide link name",

	// Months
	"month.jan": "Jan",
	"month.feb": "Feb",
	"month.mar": "Mar",
	"month.apr": "Apr",
	"month.may": "May",
	"month.jun": "Jun",
	"month.jul": "Jul",
	"month.aug": "Aug",
	"month.sep": "Sep",
	"month.oct": "Oct",
	"month.nov": "Nov",
	"month.dec": "Dec",

	// Empty states
	"empty.experience": "No experience added",
	"empty.education": "No education added",
	"empty.language": "No language added",
	"empty.certification": "No certification added",
	"empty.volunteer": "No volunteer work added",
	"empty.project": "No project added",

	// Tip content
	"tip.keywords.title": "Use exact keywords from the job posting",
	"tip.keywords.desc":
		"Copy the terms used in the job posting (technologies, functions, skills). ATS looks for exact matches.",
	"tip.headers.title": "Avoid custom headers",
	"tip.headers.desc":
		"Use common terms like 'Professional Experience', 'Education', 'Skills'.",
	"tip.acronyms.title": "Don't use acronyms without also writing the meaning",
	"tip.acronyms.desc":
		"Example: write 'JavaScript (JS)' or 'Database (DB)' to ensure it is recognized.",
	"tip.chronological.title": "Put information in reverse chronological order",
	"tip.chronological.desc":
		"Start with the most recent experience, as that's what the ATS and recruiter want to see.",
	"tip.job.titles.title": "Include common job titles",
	"tip.job.titles.desc":
		"Use generic names like 'Backend Developer', 'Systems Analyst', etc., even if the official job title was different.",
	"tip.spelling.title": "Avoid spelling errors",
	"tip.spelling.desc":
		"ATS may not recognize misspelled words, which can lead to resume exclusion.",
	"tip.technical.skills.title": "Include a technical skills section",
	"tip.technical.skills.desc":
		"List the technologies, languages and tools you used (e.g., Java, Git, SQL, Docker).",

	// Template selector
	"template.professional.name": "Professional",
	"template.timeline.name": "Timeline",
	"template.classic.name": "Classic",
	"template.modern.name": "Modern",
	"template.creative.name": "Creative",
	"template.minimal.name": "Minimal",
	"color.selector": "Select Color",

	// Actions
	actions: "Actions",

	// CV Type Selector
	"cv.type.development": "Development/IT",
	"cv.type.marketing": "Marketing/Digital",
	"cv.type.sales": "Sales/Commercial",
	"cv.type.hr": "Human Resources",
	"cv.type.finance": "Finance/Accounting",
	"cv.type.design": "Design/Creative",
	"cv.type.health": "Healthcare/Medicine",
	"cv.type.education": "Education/Teaching",
	"cv.type.admin": "Administration/Management",
	"cv.type.other": "Other",

	// Development specific translations
	"development.field.desired.role": "Desired Role",
	"development.placeholder.desired.role": "e.g., Full Stack Developer",
	"development.placeholder.role": "e.g., Full Stack Developer",
	"development.field.technologies": "Technologies Used",
	"development.placeholder.technologies":
		"e.g., TypeScript, React, Node.js, PostgreSQL",
	"development.field.technical.skills": "Technical Skills",
	"development.placeholder.technical.skills":
		"e.g., JavaScript, React, Node.js, SQL, Git, Docker",
	"development.placeholder.professional.summary":
		"e.g., Full Stack Developer with 5 years of experience in web development, specialized in React, Node.js and databases. Passionate about creating scalable and efficient solutions.",
	"development.placeholder.project.description":
		"e.g., Full-stack web application for task management with authentication, interactive dashboard and RESTful API. Used React, Node.js and MongoDB.",
	"development.placeholder.project.name": "e.g., Portfolio Website",

	// Marketing specific translations
	"marketing.field.desired.role": "Desired Role",
	"marketing.placeholder.desired.role": "e.g., Digital Marketing Manager",
	"marketing.placeholder.role": "e.g., Digital Marketing Manager",
	"marketing.field.technologies": "Tools Used",
	"marketing.placeholder.technologies":
		"e.g., Google Analytics, Facebook Ads, Mailchimp, Canva",
	"marketing.field.technical.skills": "Technical Skills",
	"marketing.placeholder.technical.skills":
		"e.g., Google Analytics, Facebook Ads, SEO, Email Marketing",
	"marketing.placeholder.professional.summary":
		"e.g., Digital Marketing Professional with 4 years of experience in online campaigns, specialized in SEO, SEM and data analysis. Experience in social media management and email marketing.",
	"marketing.placeholder.project.description":
		"e.g., Digital marketing campaign for product launch, including social media strategy, email marketing and paid advertising. Result: 300% increase in sales.",
	"marketing.placeholder.project.name": "e.g., Digital Marketing Campaign",

	// Sales specific translations
	"sales.field.desired.role": "Desired Role",
	"sales.placeholder.desired.role": "e.g., Sales Representative",
	"sales.placeholder.role": "e.g., Sales Representative",
	"sales.field.technologies": "Tools Used",
	"sales.placeholder.technologies":
		"e.g., Salesforce, HubSpot, LinkedIn Sales Navigator",
	"sales.field.technical.skills": "Technical Skills",
	"sales.placeholder.technical.skills":
		"e.g., CRM, Prospecting, Negotiation, LinkedIn",
	"sales.placeholder.professional.summary":
		"e.g., Sales Representative with 6 years of B2B sales experience, specialized in client prospecting and deal closing. Proven track record of exceeding sales targets.",
	"sales.placeholder.project.description":
		"e.g., Sales campaign for new SaaS product, including prospecting, demos and negotiation. Result: 15 new clients and €150K in sales.",
	"sales.placeholder.project.name": "e.g., B2B Sales Campaign",

	// HR specific translations
	"hr.field.desired.role": "Desired Role",
	"hr.placeholder.desired.role": "e.g., Recruiter",
	"hr.placeholder.role": "e.g., Recruiter",
	"hr.field.technologies": "Tools Used",
	"hr.placeholder.technologies": "e.g., Workday, BambooHR, LinkedIn Recruiter",
	"hr.field.technical.skills": "Technical Skills",
	"hr.placeholder.technical.skills":
		"e.g., Recruitment, Selection, Workday, LinkedIn Recruiter",
	"hr.placeholder.professional.summary":
		"e.g., Human Resources Professional with 5 years of experience in recruitment and selection, specialized in technical recruitment and talent management. Experience in HR policy implementation.",
	"hr.placeholder.project.description":
		"e.g., Recruitment project for development team, including profile definition, sourcing and selection. Result: 8 hires in 3 months.",
	"hr.placeholder.project.name": "e.g., Recruitment Project",

	// Finance specific translations
	"finance.field.desired.role": "Desired Role",
	"finance.placeholder.desired.role": "e.g., Accountant",
	"finance.placeholder.role": "e.g., Accountant",
	"finance.field.technologies": "Tools Used",
	"finance.placeholder.technologies": "e.g., SAP, Excel, QuickBooks, Primavera",
	"finance.field.technical.skills": "Technical Skills",
	"finance.placeholder.technical.skills":
		"e.g., SAP, Excel, Accounting, Financial Analysis",
	"finance.placeholder.professional.summary":
		"e.g., Accountant with 7 years of business accounting experience, specialized in financial analysis and tax reporting. Experience in auditing and internal control.",
	"finance.placeholder.project.description":
		"e.g., Accounting system implementation project, including data migration and user training. Result: 30% reduction in processing time.",
	"finance.placeholder.project.name": "e.g., Accounting Project",

	// Design specific translations
	"design.field.desired.role": "Desired Role",
	"design.placeholder.desired.role": "e.g., Graphic Designer",
	"design.placeholder.role": "e.g., Graphic Designer",
	"design.field.technologies": "Tools Used",
	"design.placeholder.technologies":
		"e.g., Adobe Creative Suite, Figma, Sketch",
	"design.field.technical.skills": "Technical Skills",
	"design.placeholder.technical.skills":
		"e.g., Photoshop, Illustrator, Figma, Design Thinking",
	"design.placeholder.professional.summary":
		"e.g., Graphic Designer with 6 years of experience in digital and print design, specialized in visual identity and interface design. Passionate about creating memorable visual experiences.",
	"design.placeholder.project.description":
		"e.g., Complete visual identity redesign for a startup, including logo, website and promotional materials. Result: 50% increase in brand recognition.",
	"design.placeholder.project.name": "e.g., Design Project",

	// Health specific translations
	"health.field.desired.role": "Desired Role",
	"health.placeholder.desired.role": "e.g., Nurse",
	"health.placeholder.role": "e.g., Nurse",
	"health.field.technologies": "Tools Used",
	"health.placeholder.technologies": "e.g., Hospital Management System, Excel",
	"health.field.technical.skills": "Technical Skills",
	"health.placeholder.technical.skills":
		"e.g., Patient Management, Clinical Procedures, Excel",
	"health.placeholder.professional.summary":
		"e.g., Nurse with 8 years of intensive care experience, specialized in critical patient management and team coordination. Experience in training new professionals.",
	"health.placeholder.project.description":
		"e.g., Hospital hygiene protocol implementation project, including team training and indicator monitoring. Result: 40% reduction in hospital infections.",
	"health.placeholder.project.name": "e.g., Healthcare Project",

	// Education specific translations
	"education.field.desired.role": "Desired Role",
	"education.placeholder.desired.role": "e.g., Teacher",
	"education.placeholder.role": "e.g., Teacher",
	"education.field.technologies": "Tools Used",
	"education.placeholder.technologies":
		"e.g., Moodle, Google Classroom, PowerPoint",
	"education.field.technical.skills": "Technical Skills",
	"education.placeholder.technical.skills":
		"e.g., Moodle, Google Classroom, Teaching Methodologies",
	"education.placeholder.professional.summary":
		"e.g., Teacher with 10 years of secondary education experience, specialized in Mathematics and Sciences. Experience in pedagogical coordination and curriculum development.",
	"education.placeholder.project.description":
		"e.g., Hybrid teaching implementation project, including digital resource development and teacher training. Result: 25% improvement in student performance.",
	"education.placeholder.project.name": "e.g., Educational Project",

	// Admin specific translations
	"admin.field.desired.role": "Desired Role",
	"admin.placeholder.desired.role": "e.g., Administrative Assistant",
	"admin.placeholder.role": "e.g., Administrative Assistant",
	"admin.field.technologies": "Tools Used",
	"admin.placeholder.technologies": "e.g., Microsoft Office, SAP, Excel",
	"admin.field.technical.skills": "Technical Skills",
	"admin.placeholder.technical.skills":
		"e.g., Microsoft Office, SAP, Document Management",
	"admin.placeholder.professional.summary":
		"e.g., Administrative Assistant with 9 years of administrative management experience, specialized in event organization and document management. Experience in team coordination.",
	"admin.placeholder.project.description":
		"e.g., Administrative process digitization project, including document management system implementation and team training. Result: 60% reduction in processing time.",
	"admin.placeholder.project.name": "e.g., Administrative Project",

	// Other specific translations
	"other.field.desired.role": "Desired Role",
	"other.placeholder.desired.role": "e.g., Specialist",
	"other.placeholder.role": "e.g., Specialist",
	"other.field.technologies": "Tools Used",
	"other.placeholder.technologies": "e.g., Area-specific tools",
	"other.field.technical.skills": "Technical Skills",
	"other.placeholder.technical.skills": "e.g., Area-specific skills",
	"other.placeholder.professional.summary":
		"e.g., Specialized professional with experience in the area, demonstrating relevant skills and proven results. Adaptable and results-oriented.",
	"other.placeholder.project.description":
		"e.g., Area-specific project, including objectives, methodology and achieved results.",
	"other.placeholder.project.name": "e.g., Specific Project",

	// Development specific activities and achievements
	"development.placeholder.activities":
		"e.g., Developed full-stack web applications using React and Node.js\nImplemented RESTful APIs and database integration",
	"development.placeholder.achievements":
		"e.g., Reduced application loading time by 40%\nImplemented automated tests with 90% coverage",

	// Marketing specific activities and achievements
	"marketing.placeholder.activities":
		"e.g., Managed digital marketing campaigns for multiple clients\nImplemented SEO and SEM strategies to increase visibility",
	"marketing.placeholder.achievements":
		"e.g., Increased organic traffic by 40% for B2B clients\nImproved conversion rate by 25% through optimization",

	// Sales specific activities and achievements
	"sales.placeholder.activities":
		"e.g., Prospected and qualified leads for sales pipeline\nConducted product demos and negotiations",
	"sales.placeholder.achievements":
		"e.g., Exceeded sales targets by 120% for 3 consecutive years\nDeveloped €500K pipeline in new business",

	// HR specific activities and achievements
	"hr.placeholder.activities":
		"e.g., Recruited candidates for technical and management positions\nConducted interviews and competency assessments",
	"hr.placeholder.achievements":
		"e.g., Reduced hiring time by 30%\nIncreased team diversity by 40%",

	// Finance specific activities and achievements
	"finance.placeholder.activities":
		"e.g., Managed accounting for multiple companies\nPrepared monthly and annual financial reports",
	"finance.placeholder.achievements":
		"e.g., Reduced accounting errors by 60%\nOptimized monthly closing processes by 40%",

	// Design specific activities and achievements
	"design.placeholder.activities":
		"e.g., Created visual identities for brands and products\nDeveloped promotional materials and campaigns",
	"design.placeholder.achievements":
		"e.g., Increased brand recognition by 50%\nReduced material production time by 35%",

	// Health specific activities and achievements
	"health.placeholder.activities":
		"e.g., Provided specialized nursing care\nCoordinated healthcare teams",
	"health.placeholder.achievements":
		"e.g., Reduced hospital infections by 40%\nImproved patient satisfaction by 60%",

	// Education specific activities and achievements
	"education.placeholder.activities":
		"e.g., Taught Mathematics and Sciences subjects\nDeveloped innovative lesson plans",
	"education.placeholder.achievements":
		"e.g., Improved student performance by 25%\nSuccessfully implemented hybrid teaching program",

	// Admin specific activities and achievements
	"admin.placeholder.activities":
		"e.g., Managed administration for company with 50 employees\nCoordinated events and meetings",
	"admin.placeholder.achievements":
		"e.g., Reduced administrative processing time by 60%\nOptimized document management by 50%",

	// Other specific activities and achievements
	"other.placeholder.activities":
		"e.g., Developed area-specific projects\nImplemented processes and improvements",
	"other.placeholder.achievements":
		"e.g., Achieved area-specific objectives\nImplemented improvements with positive results",

	// Calendar
	"calendar.clear": "Clear",
	"calendar.today": "Today",
	"calendar.month.january": "January",
	"calendar.month.february": "February",
	"calendar.month.march": "March",
	"calendar.month.april": "April",
	"calendar.month.may": "May",
	"calendar.month.june": "June",
	"calendar.month.july": "July",
	"calendar.month.august": "August",
	"calendar.month.september": "September",
	"calendar.month.october": "October",
	"calendar.month.november": "November",
	"calendar.month.december": "December",
	"calendar.day.sun": "Sun",
	"calendar.day.mon": "Mon",
	"calendar.day.tue": "Tue",
	"calendar.day.wed": "Wed",
	"calendar.day.thu": "Thu",
	"calendar.day.fri": "Fri",
	"calendar.day.sat": "Sat",

	// Error 404 Page
	"error.404.title": "Page Not Found",
	"error.404.description":
		"The page you are looking for does not exist or has been moved. Check the URL or navigate back to the home page.",
	"error.404.home.button": "Back to Home",
	"error.404.builder.button": "Create CV",

	// Privacy Policy Page
	"privacy.title": "Privacy Policy",
	"privacy.last.updated": "Last Updated",
	"privacy.introduction.title": "Introduction",
	"privacy.introduction.description":
		"EasyPeasyCV is committed to protecting your privacy. This policy explains how we work.",
	"privacy.no.collection.title": "We Do Not Collect Data",
	"privacy.no.collection.description":
		"EasyPeasyCV is a simple application that runs entirely in your browser. We do not collect, store, or process any personal data.",
	"privacy.no.collection.highlight":
		"Your data always stays on your device and is never sent to external servers.",
	"privacy.local.storage.title": "Local Storage",
	"privacy.local.storage.description":
		"All data is stored locally in your browser:",
	"privacy.local.storage.browser": "Data stays in your browser (localStorage)",
	"privacy.local.storage.no.server": "No information is sent to servers",
	"privacy.local.storage.control": "You have full control over your data",
	"privacy.cookies.title": "Cookies",
	"privacy.cookies.description":
		"We use only essential cookies for service operation.",
	"privacy.cookies.essential":
		"These cookies are necessary for basic application functionality.",
	"privacy.third.party.title": "Third-party Services",
	"privacy.third.party.description":
		"We only use external services for specific functionalities:",
	"privacy.third.party.github": "GitHub - To host source code and issues",
	"privacy.third.party.ko.fi": "Ko-fi - For donations (optional)",
	"privacy.changes.title": "Policy Changes",
	"privacy.changes.description":
		"We may update this policy occasionally. We will notify users of significant changes.",
	"privacy.contact.title": "Contact",
	"privacy.contact.description":
		"If you have questions about this privacy policy, contact us:",
	"privacy.back.home": "Back to Home",

	// Terms of Service Page
	"terms.title": "Terms of Service",
	"terms.last.updated": "Last Updated",
	"terms.introduction.title": "Introduction",
	"terms.introduction.description":
		"By using EasyPeasyCV, you accept these terms of service. Read them carefully before using the application.",
	"terms.acceptance.title": "Acceptance of Terms",
	"terms.acceptance.description":
		"By accessing or using EasyPeasyCV, you confirm that you have read, understood, and agree to be bound by these terms of service.",
	"terms.service.title": "Service Description",
	"terms.service.description": "EasyPeasyCV is a web application that allows:",
	"terms.service.features.cv": "Create and edit professional resumes",
	"terms.service.features.templates": "Use customizable professional templates",
	"terms.service.features.pdf": "Export CVs in PDF format",
	"terms.service.features.local": "Local storage of data in browser",
	"terms.responsibilities.title": "User Responsibilities",
	"terms.responsibilities.description": "As a user, you are responsible for:",
	"terms.responsibilities.accurate":
		"Providing accurate and up-to-date information",
	"terms.responsibilities.legal":
		"Using the service in accordance with applicable law",
	"terms.responsibilities.compliance":
		"Complying with all terms and conditions",
	"terms.prohibited.title": "Prohibited Uses",
	"terms.prohibited.description": "You may not use the service for:",
	"terms.prohibited.illegal": "Illegal or fraudulent activities",
	"terms.prohibited.harmful": "Causing harm or interfering with the service",
	"terms.prohibited.copyright": "Violating intellectual property rights",
	"terms.intellectual.title": "Intellectual Property",
	"terms.intellectual.description":
		"EasyPeasyCV and all its content are the property of its creators. You retain rights to the content you create.",
	"terms.intellectual.user.content":
		"Your CV content is your responsibility and property.",
	"terms.privacy.title": "Privacy and Data",
	"terms.privacy.description":
		"The collection and use of personal data is governed by our Privacy Policy.",
	"terms.privacy.policy": "See our",
	"terms.privacy.link": "Privacy Policy",
	"terms.availability.title": "Service Availability",
	"terms.availability.description":
		"We strive to keep the service available, but we do not guarantee continuous availability:",
	"terms.availability.maintenance":
		"Scheduled maintenance may cause interruptions",
	"terms.availability.updates": "Updates may temporarily affect the service",
	"terms.availability.force":
		"Events beyond our control may affect availability",
	"terms.disclaimers.title": "Disclaimers",
	"terms.disclaimers.description":
		'The service is provided "as is" without warranties:',
	"terms.disclaimers.warranty": "We do not guarantee the service is error-free",
	"terms.disclaimers.accuracy":
		"We do not guarantee the accuracy of generated content",
	"terms.disclaimers.employment":
		"We do not guarantee employment or application results",

	"terms.law.title": "Governing Law",
	"terms.law.description": "These terms are governed by Portuguese law.",
	"terms.changes.title": "Changes to Terms",
	"terms.changes.description":
		"We may change these terms at any time. Changes will take effect immediately upon publication.",
	"terms.contact.title": "Contact",
	"terms.contact.description": "For questions about these terms, contact us:",
	"terms.back.home": "Back to Home",

	// Section Reordering
	"section.move.up": "Move section up",
	"section.move.down": "Move section down",

	// Footer
	"footer.privacy": "Privacy",
	"footer.terms": "Terms",

	// Forms and validation
	"search.placeholder": "Search...",
	"link.error.duplicate": "A link with this type and name already exists.",
	"content.required.pdf": "Add some content before generating the PDF.",
	"content.required.preview": "Add some content before previewing the PDF.",
	"thank.you.recommended.title": "Attention: Recommended Fields",
	"thank.you.recommended.message":
		"We recommend filling in the following fields for a more complete CV:",

	// Design system (modular CV customisation)
	"design.title": "Design",
	"design.tab.presets": "Preset",
	"design.tab.page": "Page",
	"design.tab.header": "Header",
	"design.tab.sections": "Sections",
	"design.presets.title": "Starting point",
	"design.presets.help": "Pick a starting point, then fine-tune any option.",
	"design.presets.customised": "Customised from a starting point.",
	"design.page.spacing": "Spacing",
	"design.page.typography": "Typography",
	"design.align.left": "Left",
	"design.align.center": "Centred",
	"design.header.layout": "Layout",
	"design.header.align": "Alignment",
	"design.header.contact": "Contact details",
	"design.header.divider": "Rule below the header",
	"design.header.divider.help":
		"Separates your details from the rest of the CV.",
	"design.contact.inline": "Inline",
	"design.contact.separated": "With separator",
	"design.contact.stacked": "One per line",
	"design.titles.title": "Section headings",
	"design.titles.help":
		"Applies to every section, so the CV reads consistently.",
	"design.titles.variant": "Style",
	"design.titles.align": "Alignment",
	"design.titles.transform": "Capitalisation",
	"design.titles.transform.help":
		"Affects the titles you type for custom sections.",
	"design.title.plain": "Text only",
	"design.title.ruled": "Underlined",
	"design.title.inlineRule": "Text + rule",
	"design.title.block": "Banner",
	"design.dates.title": "Dates",
	"design.dates.help": "Applies to every entry in the CV.",
	"design.dates.placement": "Position",
	"design.dates.right": "Right",
	"design.dates.below": "Below the title",
	"design.bullets.title": "Bullets",
	"design.bullets.help": "Applies to every list in the CV.",
	"design.bullets.marker": "Marker",
	"design.bullets.dot": "Dot",
	"design.bullets.dash": "Dash",
	"design.bullets.none": "None",
	"design.sections.title": "Per-section style",
	"design.sections.help": "Each section can be presented differently.",
	"design.sections.entryStyle": "Entry presentation",
	"design.entries.plain": "Plain",
	"design.entries.card": "Accent bar",
	"design.entries.timeline": "Timeline",
	"design.languages.inline": "Inline",
	"design.languages.rows": "Rows",
	"design.languages.leaders": "With leader",
	"design.skills.paragraph": "Paragraph",
	"design.skills.centered": "Centred",
	"design.skills.bulleted": "List",
	"design.section.customise": "Customise this section",
	"design.section.sheet.help": "All design options live in the bottom bar.",
	"design.transform.none": "As typed",
	"design.transform.uppercase": "UPPERCASE",
	"section.expand": "Expand section",
	"section.collapse": "Collapse section",
	close: "Close",

	// Builder status, navigation and undo
	"a11y.skipToContent": "Skip to content",
	"save.status.saved": "Saved",
	"save.status.savedAt": "Saved at {time}",
	"save.status.help": "Your CV is saved automatically in this browser.",
	"save.status.error": "Couldn't save",
	"save.status.error.help":
		"Browser storage is full. Remove the photo or export your CV as XML so you don't lose changes.",
	"preview.pages.one": "1 page",
	"preview.pages.many": "{n} pages",
	"preview.compact.try": "Use Super Compact mode",
	"preview.compact.active": "Super Compact mode is on",
	"completeness.title": "Recommended",
	"completeness.complete": "Recommended fields complete",
	"completeness.help":
		"Recruiters and ATS systems expect these fields. Click one to jump to it.",
	"generate.disabled.reason": "Add some content to your CV to generate it",
	"undo.removed": "Item removed",
	"undo.sectionRemoved": "Section removed",
	"undo.action": "Undo",
	"section.menu": "Section options",
	"navigator.title": "Sections",
	"navigator.help": "Click to jump · drag to reorder",
	"navigator.reorder": "Drag to reorder",
	"navigator.filled": "Filled in",
	"navigator.empty": "Not filled in",

	// Individually styled custom sections
	"design.custom.title": "Custom sections",
	"design.custom.help":
		"Set a default style, and give any section its own style if you like.",
	"design.sections.customDefault": "Default style",
	"design.custom.own": "Has its own style.",
	"design.custom.useDefault": "Use the default",
	"design.custom.followsDefault": "Follows the default style.",
	"examples.title": "Examples",
	"examples.selector": "Examples for your field",
	"examples.help":
		"Only changes the field examples and hints, for this profile. Your resume itself is not changed.",
	"examples.current": "Examples: {area}",
	"footer.faq": "Help",
	"faq.badge": "Help",
	"faq.title": "Frequently asked questions",
	"faq.subtitle":
		"Quick answers about your data, building your CV and the project. If you can't find what you need, get in touch at the bottom of the page.",
	"faq.group.data": "Privacy and data",
	"faq.group.building": "Building your CV",
	"faq.group.project": "About EasyPeasyCV",
	"faq.account.q": "Do I need an account?",
	"faq.account.a":
		"No. Open the builder and start writing. There is no sign-up, login or email.",
	"faq.where.q": "Where is my data stored?",
	"faq.where.a":
		"Only in your browser, on this device. Your CV and its PDF are created on your computer, and the content of your CV is never sent to a server.",
	"faq.lose.q": "Can I lose my CV?",
	"faq.lose.a":
		"Yes, if you clear your browser data, use a private window, or switch browser or device. To keep a copy, use Data (XML) › Export XML every now and then.",
	"faq.move.q": "How do I move my CV to another computer?",
	"faq.move.a":
		"Export the XML in this browser, then use Data (XML) › Import XML in the other one. Importing replaces the content of the open profile, so create a new profile first if you want to keep the current one.",
	"faq.profiles.q": "Can I have more than one CV?",
	"faq.profiles.a":
		"Yes. In CV Profiles you can create, duplicate and rename profiles, for example one CV per kind of job. Each profile keeps its own content and design.",
	"faq.design.q": "How do I change how my CV looks?",
	"faq.design.a":
		"In Design, pick a preset and then adjust the colour, font, margins, header and the style of each section. The preview updates as you go.",
	"faq.pages.q": "My CV has too many pages. What can I do?",
	"faq.pages.a":
		"Try Super Compact mode, offered above the preview and under Design › Page. You can also lower the density and margins, or shorten older experience.",
	"faq.language.q": "Can I download my CV in another language?",
	"faq.language.a":
		"Yes. In Generate CV you choose the PDF's language: section titles and fixed labels use that language. What you wrote is not translated.",
	"faq.examples.q": "What are the Examples for?",
	"faq.examples.a":
		"They switch the field examples and hints to your professional field. They don't change your CV.",
	"faq.free.q": "Is it really free?",
	"faq.free.a":
		"Yes, with no paid plans and no watermarks. The project is open source (MIT licence) and runs on voluntary support.",
	"faq.ats.q": "Will my CV get through ATS software?",
	"faq.ats.a":
		"The PDF contains real text and a simple structure that ATS software can read. No tool can guarantee a pass: your content and the job's keywords still matter most.",
	"faq.contact.title": "Didn't find your answer?",
	"faq.contact.description":
		"EasyPeasyCV is open source and feedback is handled on GitHub. You'll need a free GitHub account.",
	"faq.contact.bug.title": "Report a bug",
	"faq.contact.bug.description":
		"Something not working as it should? Tell us what happened and how to reproduce it.",
	"faq.contact.idea.title": "Suggest an idea",
	"faq.contact.idea.description":
		"A feature or improvement that would help you.",
	"faq.contact.note":
		"GitHub issues are public: don't include personal data or your CV.",
	"faq.contact.opensInNewTab": "(opens in a new tab)",
	"home.cta": "Create my CV",
	"home.hero.eyebrow": "Free and open source",
	"home.hero.title": "Make your CV in minutes",
	"home.hero.subtitle":
		"Type, see the result next to it, and download the PDF. No account, no payment and no watermark.",
	"home.hero.note":
		"We don't ask for your email. Your CV is only saved on your computer.",
	"home.hero.media.alt":
		"The EasyPeasyCV builder: the form on the left and the CV updating on the right",
	"home.result.title": "This is what you download",
	"home.result.subtitle":
		"A clean PDF, ready to send. The CV is yours from start to finish.",
	"home.result.watermark":
		"No watermark, no logo of ours and no payment at the last step.",
	"home.result.ats":
		"Easy to read for the automatic filters many companies use to screen CVs.",
	"home.result.language":
		"Download the same CV with headings in English, Portuguese or Spanish.",
	"home.compare.title": "Why it's different",
	"home.compare.subtitle":
		"Many CV sites are free right up until you click download.",
	"home.compare.others": "Many CV sites",
	"home.compare.account.others": "Ask for your email and make you sign up",
	"home.compare.account.us": "You start writing straight away",
	"home.compare.data.others": "Keep your CV on their servers",
	"home.compare.data.us": "Your CV stays on your computer. We never see it.",
	"home.compare.download.others": "Charge you or watermark the PDF",
	"home.compare.download.us": "A free, clean PDF, every time",
	"home.compare.subscription.others": "Subscriptions that renew on their own",
	"home.compare.subscription.us": "Nothing to pay for or cancel",
	"home.styles.title": "Pick a style",
	"home.styles.subtitle":
		"Start from a base style, then adjust colours, font and each section.",
	"home.styles.media.alt": "Example CV style",
	"home.styles.link": "Try the styles",
	"home.details.title": "Made for real life",
	"home.details.mobile.title": "On your phone too",
	"home.details.mobile.description":
		"You can build your whole CV on your phone, with nothing to install.",
	"home.details.mobile.media.alt": "EasyPeasyCV open on a phone",
	"home.details.versions.title": "A CV for every application",
	"home.details.versions.description":
		"Keep several versions and duplicate one to tailor it to another job.",
	"home.details.autosave.title": "Saved automatically",
	"home.details.autosave.description":
		"Close the page and carry on later, in the same browser.",
	"home.details.backup.title": "A copy in a file",
	"home.details.backup.description":
		"Save your CV to a file and open it on another computer.",
	"home.details.languages.title": "In 4 languages",
	"home.details.languages.description":
		"English, Spanish, and Portuguese from Portugal and Brazil.",
	"home.details.ats.title": "Ready for automatic filters",
	"home.details.ats.description":
		"Real text and a simple structure that recruitment software can read.",
	"home.about.title": "Who makes EasyPeasyCV",
	"home.about.p1":
		"Hi! I made EasyPeasyCV because writing a CV shouldn't mean signing up, handing over your data or paying at the last step.",
	"home.about.p2":
		"It's a personal, open source project: the code is public and anyone can see how it works. If it helped you, you can support the project or send a suggestion.",
	"home.about.media.alt": "Photo of the person who makes EasyPeasyCV",
	"home.about.github": "See the code on GitHub",
	"home.about.support": "Support the project",
	"home.about.feedback": "Send a suggestion",
	"home.faq.title": "Frequently asked questions",
	"home.faq.link": "See all questions",
	"home.final.title": "Ready to start?",
	"home.final.subtitle":
		"It takes a few minutes and you don't need an account.",
	"home.styles.custom": "Custom",
	"faq.tips.title": "Tips for a good CV",
	"faq.tips.subtitle":
		"Small things that help your CV get through automatic filters and get read by the people who decide.",
	"completeness.tipsLink": "Tips for a good CV",
	"builder.heading": "Build your CV",
};

export default enTranslations;
