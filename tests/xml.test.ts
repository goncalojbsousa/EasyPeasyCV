import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type {
	CvData,
	CvRenderSettings,
	CvStyleSettings,
} from "../app/types/cv";
import {
	createEmptyCvData,
	DEFAULT_RENDER_SETTINGS,
} from "../app/utils/cv-data";
import { STYLE_PRESETS } from "../app/utils/style-presets";
import { CV_XML_VERSION, cvDataToXml, xmlToCvData } from "../app/utils/xml";

function clone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
}

function baseCv(): CvData {
	return clone(createEmptyCvData());
}

function withCv(mutator: (data: CvData) => void): CvData {
	const data = baseCv();
	mutator(data);
	return data;
}

function customSettings(): CvRenderSettings {
	return {
		layout: {
			fontFamily: "Custom",
			customFont: {
				name: "My Font",
				dataUrl: "data:font/ttf;base64,AAECAwQ=",
				style: "normal",
			},
			textScale: 1.15,
			marginsCm: { top: 1.1, right: 1.2, bottom: 1.3, left: 1.4 },
			lineSpacing: 1.7,
			sectionSpacingPx: 24,
			columns: 2,
			atsSafe: true,
			density: "compact",
			textAlignment: "left",
			singlePageMode: true,
		},
		header: {
			nameFontSize: 26,
			nameFontWeight: "heavy",
			nameColor: "#123456",
			titleStyle: "uppercase",
			titlePosition: "above",
			dividerThickness: 3,
			dividerStyle: "dashed",
			iconSizePx: 24,
			iconSpacingPx: 15,
			iconAlignment: "center",
		},
		photo: {
			enabled: true,
			aspectRatio: "3:4",
			borderRadius: 8,
			crop: { x: 2, y: 3, width: 80, height: 100 },
			dataUrl: "data:image/png;base64,iVBORw0KGgo=",
		},
		sections: {
			titleColor: "#654321",
			titleFontSize: 14,
			dateFormat: "long",
			useThemeColorForLinks: true,
		},
	};
}

/** A style where every modular option differs from the defaults. */
function customStyle(): CvStyleSettings {
	return {
		sectionTitle: { variant: "block", align: "center", transform: "none" },
		header: { align: "center", contact: "stacked", divider: true },
		datePlacement: "below",
		bullets: "dash",
		languages: "leaders",
		skills: "bulleted",
		entries: {
			professional_experience: "timeline",
			academic_education: "card",
			certifications: "plain",
			projects: "card",
			volunteer: "timeline",
			custom: "plain",
		},
	};
}

const cases: Array<[string, CvData]> = [
	["empty CV", baseCv()],
	[
		"personal information only",
		withCv((data) => {
			data.personalInfo = {
				name: "Ada Lovelace",
				desiredRole: "Mathematician",
				city: "London",
				postalCode: "SW1A",
				email: "ada@example.com",
				countryCode: "Reino Unido (+44)",
				phone: "123456789",
			};
		}),
	],
	[
		"skills only",
		withCv((data) => {
			data.skills = "TypeScript, React, PDF";
		}),
	],
	[
		"links only",
		withCv((data) => {
			data.links = [
				{
					type: "GitHub",
					value: "github.com/ada",
					hideLinkLabel: true,
				},
				{
					type: "Other",
					value: "ada.example.com",
					customName: "Portfolio",
					hideLinkLabel: false,
				},
			];
		}),
	],
	[
		"experience",
		withCv((data) => {
			data.experiences = [
				{
					role: "Engineer",
					company: "Analytical Engines Ltd",
					startMonth: "Jan",
					startYear: "2020",
					endMonth: "",
					endYear: "",
					current: true,
					tech: "TypeScript",
					activities: "Built reliable systems.",
					results: "Reduced manual work.",
				},
			];
		}),
	],
	[
		"education",
		withCv((data) => {
			data.education = [
				{
					type: "education.type.bachelor",
					status: "education.status.completed",
					course: "Computer Science",
					institution: "Example University",
					startMonth: "Sep",
					startYear: "2015",
					endMonth: "Jun",
					endYear: "2018",
					current: false,
					description: "Coursework",
					achievements: "Honors",
				},
			];
		}),
	],
	[
		"projects",
		withCv((data) => {
			data.projects = [
				{
					name: "CV Builder",
					description: "Client-side CV generator.",
					link: "https://example.com",
					sourceCode: "https://github.com/example/cv",
					tech: "Next.js",
					year: "2026",
					impact: "Saved time.",
				},
			];
		}),
	],
	[
		"certifications",
		withCv((data) => {
			data.certifications = [
				{
					name: "TypeScript",
					issuer: "Example Org",
					completionDate: "2026-01-01",
					hours: "20",
					validationLink: "https://example.com/cert",
					description: "Language basics.",
				},
			];
		}),
	],
	[
		"languages",
		withCv((data) => {
			data.languages = [{ name: "English", level: "language.level.c2" }];
		}),
	],
	[
		"volunteer",
		withCv((data) => {
			data.volunteers = [
				{
					organization: "Community Org",
					role: "Mentor",
					startMonth: "Mar",
					startYear: "2022",
					endMonth: "",
					endYear: "",
					current: true,
					description: "Mentored junior developers.",
					impact: "Supported career changes.",
				},
			];
		}),
	],
	[
		"custom sections",
		withCv((data) => {
			data.customSections = [
				{
					id: "custom-1",
					title: "Publications",
					fields: [
						{
							id: "field-1",
							label: "Paper",
							subtitle: "Journal",
							value: "A short description.",
							startMonth: "Jan",
							startYear: "2024",
							endMonth: "Feb",
							endYear: "2024",
							current: false,
							bullets: "Published\nReviewed",
							centerValue: true,
						},
					],
				},
			];
			data.sectionOrder = [...(data.sectionOrder || []), "custom_custom-1"];
		}),
	],
	[
		"different settings",
		withCv((data) => {
			data.settings = customSettings();
		}),
	],
	[
		"different template and layout",
		withCv((data) => {
			data.template = "timeline";
			data.color = "teal";
			data.sectionOrder = [
				"technical_skills",
				"professional_summary",
				"projects",
			];
			data.settings = {
				...clone(DEFAULT_RENDER_SETTINGS),
				layout: {
					...clone(DEFAULT_RENDER_SETTINGS.layout),
					density: "spacious",
					textAlignment: "left",
				},
			};
		}),
	],
	[
		"fully customised modular style",
		withCv((data) => {
			data.settings = {
				...clone(DEFAULT_RENDER_SETTINGS),
				style: customStyle(),
			};
		}),
	],
	[
		"custom sections with their own styles",
		withCv((data) => {
			data.customSections = [
				{ id: "awards", title: "Awards", fields: [] },
				{ id: "talks", title: "Talks", fields: [] },
			];
			data.settings = {
				...clone(DEFAULT_RENDER_SETTINGS),
				style: {
					...customStyle(),
					customSectionEntries: { awards: "timeline", talks: "card" },
				},
			};
		}),
	],
	[
		"classic preset style",
		withCv((data) => {
			data.settings = {
				...clone(DEFAULT_RENDER_SETTINGS),
				style: clone(STYLE_PRESETS.classic),
			};
		}),
	],
	[
		"complete CV",
		withCv((data) => {
			data.personalInfo.name = "Grace Hopper";
			data.links = [
				{
					type: "LinkedIn",
					value: "linkedin.com/in/grace",
					hideLinkLabel: true,
				},
			];
			data.resume = "Computer scientist and leader.";
			data.experiences = [
				{
					role: "Rear Admiral",
					company: "US Navy",
					startMonth: "Jan",
					startYear: "1943",
					endMonth: "Dec",
					endYear: "1986",
					current: false,
					tech: "COBOL",
					activities: "Led teams.",
					results: "Created impact.",
				},
			];
			data.education = [
				{
					type: "education.type.phd",
					status: "education.status.completed",
					course: "Mathematics",
					institution: "Yale",
					startMonth: "Sep",
					startYear: "1930",
					endMonth: "Jun",
					endYear: "1934",
					current: false,
					description: "Doctoral studies.",
					achievements: "PhD.",
				},
			];
			data.skills = "Leadership, compilers";
			data.languages = [{ name: "English", level: "language.level.native" }];
			data.certifications = [
				{
					name: "Award",
					issuer: "Example",
					completionDate: "1950-01-01",
					hours: "",
					validationLink: "",
					description: "Recognition.",
				},
			];
			data.projects = [
				{
					name: "Compiler",
					description: "Built compiler technology.",
					link: "",
					sourceCode: "",
					tech: "Programming languages",
					year: "1952",
					impact: "Changed software.",
				},
			];
			data.volunteers = [
				{
					organization: "Education",
					role: "Speaker",
					startMonth: "Jan",
					startYear: "1970",
					endMonth: "",
					endYear: "",
					current: true,
					description: "Talks.",
					impact: "Inspired people.",
				},
			];
			data.customSections = [
				{
					id: "custom-awards",
					title: "Awards",
					fields: [
						{
							id: "award-1",
							label: "Medal",
							value: "Important award.",
							bullets: "One\nTwo",
							centerValue: false,
						},
					],
				},
			];
			data.template = "classic";
			data.color = "purple";
			data.cvType = "health";
			data.settings = customSettings();
			data.sectionOrder = [
				...(data.sectionOrder || []),
				"custom_custom-awards",
			];
		}),
	],
];

describe("CV XML round-trip", () => {
	for (const [name, data] of cases) {
		test(name, () => {
			const xml = cvDataToXml(data);
			assert.match(xml, new RegExp(`<cv version="${CV_XML_VERSION}">`));

			const imported = xmlToCvData(xml);
			assert.deepStrictEqual(imported, data);

			const secondImported = xmlToCvData(cvDataToXml(imported));
			assert.deepStrictEqual(secondImported, imported);
		});
	}

	test("ignores an unknown examples area", () => {
		const xml = cvDataToXml(
			withCv((data) => {
				data.cvType = "health";
			}),
		).replace("<cvType>health</cvType>", "<cvType>astronaut</cvType>");
		assert.equal(xmlToCvData(xml).cvType, undefined);
	});

	test("imports legacy v1 XML without requiring a version attribute", () => {
		const legacyXml = `<?xml version="1.0" encoding="UTF-8"?>
<cv>
  <personalInfo>
    <name>Legacy User</name>
    <desiredRole>Developer</desiredRole>
    <city>Lisbon</city>
    <postalCode>1000</postalCode>
    <email>legacy@example.com</email>
    <countryCode>Portugal (+351)</countryCode>
    <phone>900000000</phone>
  </personalInfo>
  <links><link><type>GitHub</type><value>github.com/legacy</value><customName></customName></link></links>
  <resume>Legacy summary</resume>
  <experiences></experiences>
  <educations><education><type></type><status></status><course>Course</course><institution>School</institution><startMonth>Jan</startMonth><startYear>2020</startYear><endMonth>Feb</endMonth><endYear>2021</endYear><description>Desc</description><achievements>Ach</achievements></education></educations>
  <skills>Legacy skills</skills>
  <languages></languages>
  <certifications></certifications>
  <projects></projects>
  <volunteers></volunteers>
  <customSections></customSections>
  <sectionOrder><section>technical_skills</section></sectionOrder>
  <template>professional</template>
  <color>blue</color>
</cv>`;

		const imported = xmlToCvData(legacyXml);
		assert.equal(imported.personalInfo.name, "Legacy User");
		assert.equal(imported.links[0]?.hideLinkLabel, undefined);
		assert.equal(imported.education[0]?.current, undefined);
		assert.equal(imported.settings, undefined);
		assert.deepStrictEqual(imported.sectionOrder, ["technical_skills"]);
	});
});
