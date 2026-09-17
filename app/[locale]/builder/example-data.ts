import type { CvData } from "../../types/cv";

/**
 * Demo CV used by the "fill with example data" button, which is only rendered
 * outside production builds.
 */
export const EXAMPLE_CV: Partial<CvData> = {
	personalInfo: {
		name: "John Doe",
		desiredRole: "Senior Full Stack Developer",
		city: "Lisbon",
		postalCode: "1000-001",
		email: "john.doe@example.com",
		countryCode: "Portugal (+351)",
		phone: "912345678",
	},
	links: [
		{
			type: "LinkedIn",
			value: "linkedin.com/in/johndoe",
			hideLinkLabel: false,
		},
		{ type: "GitHub", value: "github.com/johndoe", hideLinkLabel: false },
		{ type: "Portfolio", value: "johndoe.example.com", hideLinkLabel: false },
		{
			type: "Other",
			value: "dev.to/johndoe",
			customName: "Blog",
			hideLinkLabel: false,
		},
	],
	resume:
		"Accomplished Full Stack Developer with 8+ years of experience building scalable web applications and leading cross-functional teams. Expertise in modern JavaScript frameworks, cloud architecture, and agile methodologies. Proven track record of delivering high-impact solutions that drive business growth and enhance user experience. Passionate about clean code, performance optimization, and mentoring junior developers.",
	experiences: [
		{
			role: "Senior Full Stack Developer",
			company: "Red Hat",
			startMonth: "Mar",
			startYear: "2021",
			endMonth: "",
			endYear: "",
			current: true,
			tech: "React, Next.js, TypeScript, Node.js, PostgreSQL, AWS, Docker, Kubernetes",
			activities:
				"Lead development of enterprise SaaS platform serving 10,000+ users. Architect microservices infrastructure and mentor team of 6 developers. Conduct code reviews and establish best practices. Collaborate with product managers to define technical requirements and roadmap.",
			results:
				"Reduced application load time by 60% through optimization. Increased system reliability to 99.9% uptime. Successfully migrated monolithic application to microservices architecture, improving deployment frequency by 400%.",
		},
		{
			role: "Full Stack Developer",
			company: "Canonical",
			startMonth: "Jun",
			startYear: "2018",
			endMonth: "Feb",
			endYear: "2021",
			current: false,
			tech: "React, Redux, Node.js, Express, MongoDB, GraphQL, Jest",
			activities:
				"Developed and maintained multiple client-facing web applications. Implemented RESTful and GraphQL APIs. Integrated third-party services and payment gateways. Participated in agile sprint planning and daily standups.",
			results:
				"Delivered 15+ features that increased user engagement by 35%. Reduced API response time by 45% through database optimization. Achieved 90%+ test coverage across all projects.",
		},
		{
			role: "Frontend Developer",
			company: "Mozilla",
			startMonth: "Jan",
			startYear: "2016",
			endMonth: "May",
			endYear: "2018",
			current: false,
			tech: "React, JavaScript, HTML5, CSS3, Webpack, Git",
			activities:
				"Built responsive user interfaces for mobile and web applications. Collaborated with UX designers to implement pixel-perfect designs. Integrated frontend with backend APIs. Maintained component library and documentation.",
			results:
				"Improved mobile conversion rate by 28% through responsive design improvements. Reduced bundle size by 40% using code splitting and lazy loading.",
		},
	],
	education: [
		{
			type: "education.type.bachelor",
			status: "education.status.completed",
			course: "Computer Science",
			institution: "University of California, Berkeley",
			startMonth: "Sep",
			startYear: "2012",
			endMonth: "Jun",
			endYear: "2016",
			current: false,
			description:
				"Relevant coursework: Data Structures & Algorithms, Software Engineering, Database Systems, Web Development, Computer Networks, Operating Systems, Artificial Intelligence.",
			achievements:
				"Graduated Magna Cum Laude with 3.8 GPA. Dean's List all semesters. Led university programming club with 50+ members. Completed senior capstone project on machine learning recommendation systems.",
		},
	],
	skills:
		"React, Next.js, TypeScript, Node.js, Express, PostgreSQL, MongoDB, GraphQL, REST APIs, Docker, Kubernetes, AWS, CI/CD, Git, Jest, React Testing Library, Agile/Scrum, System Design",
	languages: [
		{ name: "English", level: "language.level.native" },
		{ name: "Spanish", level: "language.level.c1" },
		{ name: "French", level: "language.level.b2" },
	],
	certifications: [
		{
			name: "AWS Certified Solutions Architect - Professional",
			issuer: "Amazon Web Services",
			completionDate: "2023-08-15",
			hours: "40",
			validationLink:
				"https://aws.amazon.com/certification/certified-solutions-architect-professional/",
			description:
				"Advanced certification covering design of distributed systems, migration planning, cost optimization, and security best practices on AWS platform.",
		},
		{
			name: "Professional Scrum Master I (PSM I)",
			issuer: "Scrum.org",
			completionDate: "2022-03-20",
			hours: "16",
			validationLink:
				"https://www.scrum.org/professional-scrum-master-i-certification",
			description:
				"Demonstrates fundamental understanding of Scrum framework, including roles, events, and artifacts. Focus on servant leadership and team facilitation.",
		},
	],
	projects: [
		{
			name: "Real-Time Collaboration Platform",
			description:
				"Built a real-time collaboration tool similar to Notion with live editing, comments, and team workspaces. Features WebSocket connections for instant updates and rich text editing capabilities.",
			tech: "Next.js, TypeScript, Socket.io, PostgreSQL, Redis, Tailwind CSS",
			link: "demo-collab-platform.example.com",
			sourceCode: "github.com/johndoe/collab-platform-demo",
			year: "2023",
			impact:
				"Gained 2,500+ active users within 3 months of launch. Achieved 99.5% uptime with average response time under 200ms. Featured on Product Hunt with 400+ upvotes.",
		},
		{
			name: "E-Commerce Analytics Dashboard",
			description:
				"Comprehensive analytics dashboard for e-commerce businesses with real-time sales tracking, customer insights, and inventory management. Includes data visualization and export capabilities.",
			tech: "React, D3.js, Node.js, Express, MongoDB, Chart.js",
			link: "analytics-demo.example.com",
			sourceCode: "github.com/johndoe/ecommerce-analytics",
			year: "2022",
			impact:
				"Helped businesses increase revenue by 25% through actionable insights. Processes over 100,000 transactions daily. Used by 150+ small to medium businesses.",
		},
		{
			name: "Open Source Component Library",
			description:
				"Accessible React component library with 50+ components following WAI-ARIA guidelines. Full TypeScript support, comprehensive documentation, and extensive test coverage.",
			tech: "React, TypeScript, Storybook, Jest, Rollup",
			link: "npm.com/package/example-ui-components",
			sourceCode: "github.com/johndoe/example-ui-components",
			year: "2024",
			impact:
				"Downloaded 10,000+ times monthly on NPM. Adopted by 200+ projects. 500+ GitHub stars and active community contributions.",
		},
	],
	volunteers: [
		{
			organization: "Code.org",
			role: "Technical Mentor",
			startMonth: "Jan",
			startYear: "2022",
			endMonth: "",
			endYear: "",
			current: true,
			description:
				"Mentor aspiring developers from underrepresented backgrounds in web development fundamentals. Conduct weekly coding sessions, code reviews, and career guidance workshops. Help students build portfolio projects and prepare for technical interviews.",
			impact:
				"Mentored 30+ students with 80% securing their first tech role within 6 months. Organized 5 hackathons with 200+ participants. Contributed to curriculum development used by 500+ students.",
		},
		{
			organization: "freeCodeCamp",
			role: "Workshop Instructor",
			startMonth: "Sep",
			startYear: "2020",
			endMonth: "Dec",
			endYear: "2021",
			current: false,
			description:
				"Taught free programming workshops to high school students focusing on HTML, CSS, JavaScript, and web development basics. Created hands-on projects and learning materials. Coordinated with schools to expand program reach.",
			impact:
				"Taught 200+ students across 15 workshops. 60% of participants continued pursuing computer science education. Program expanded to 8 additional schools in the district.",
		},
	],
};
