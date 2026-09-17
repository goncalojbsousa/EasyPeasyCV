import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { CvData } from "../app/types/cv";
import {
	createEmptyCvData,
	DEFAULT_RENDER_SETTINGS,
	hasCvContent,
	shouldAutoSaveCvData,
} from "../app/utils/cv-data";

function clone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
}

function cv(mutator?: (data: CvData) => void): CvData {
	const data = clone(createEmptyCvData());
	mutator?.(data);
	return data;
}

describe("hasCvContent", () => {
	const contentCases: Array<[string, CvData]> = [
		[
			"personal information only",
			cv((data) => {
				data.personalInfo.name = "Ada";
			}),
		],
		[
			"skills only",
			cv((data) => {
				data.skills = "TypeScript";
			}),
		],
		[
			"links only",
			cv((data) => {
				data.links = [{ type: "GitHub", value: "github.com/ada" }];
			}),
		],
		[
			"projects only",
			cv((data) => {
				data.projects = [
					{
						name: "Project",
						description: "",
						link: "",
						tech: "",
						year: "",
						impact: "",
					},
				];
			}),
		],
		[
			"languages only",
			cv((data) => {
				data.languages = [{ name: "English", level: "language.level.c1" }];
			}),
		],
		[
			"volunteer only",
			cv((data) => {
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
			"custom section only",
			cv((data) => {
				data.customSections = [
					{
						id: "custom-1",
						title: "",
						fields: [{ id: "field-1", label: "", value: "Value" }],
					},
				];
			}),
		],
		[
			"complete CV",
			cv((data) => {
				data.personalInfo.name = "Grace";
				data.resume = "Summary";
				data.skills = "Compilers";
				data.links = [{ type: "LinkedIn", value: "linkedin.com/in/grace" }];
				data.projects = [
					{
						name: "Compiler",
						description: "Compiler",
						link: "",
						tech: "COBOL",
						year: "1952",
						impact: "Impact",
					},
				];
			}),
		],
	];

	test("empty CV has no content", () => {
		assert.equal(hasCvContent(cv()), false);
	});

	for (const [name, data] of contentCases) {
		test(name, () => {
			assert.equal(hasCvContent(data), true);
		});
	}
});

describe("shouldAutoSaveCvData", () => {
	test("does not create a new profile for an untouched empty CV", () => {
		assert.equal(shouldAutoSaveCvData(cv(), null), false);
	});

	test("saves an empty CV when an existing profile is being cleared", () => {
		assert.equal(shouldAutoSaveCvData(cv(), "profile-1"), true);
	});

	test("saves personal information only", () => {
		assert.equal(
			shouldAutoSaveCvData(
				cv((data) => {
					data.personalInfo.email = "ada@example.com";
				}),
				null,
			),
			true,
		);
	});

	test("saves skills only", () => {
		assert.equal(
			shouldAutoSaveCvData(
				cv((data) => {
					data.skills = "React";
				}),
				null,
			),
			true,
		);
	});

	test("saves links only", () => {
		assert.equal(
			shouldAutoSaveCvData(
				cv((data) => {
					data.links = [
						{
							type: "Other",
							value: "example.com",
							customName: "Site",
							hideLinkLabel: true,
						},
					];
				}),
				null,
			),
			true,
		);
	});

	test("saves projects only", () => {
		assert.equal(
			shouldAutoSaveCvData(
				cv((data) => {
					data.projects = [
						{
							name: "Project",
							description: "",
							link: "",
							tech: "",
							year: "",
							impact: "",
						},
					];
				}),
				null,
			),
			true,
		);
	});

	test("saves languages only", () => {
		assert.equal(
			shouldAutoSaveCvData(
				cv((data) => {
					data.languages = [{ name: "Spanish", level: "language.level.b2" }];
				}),
				null,
			),
			true,
		);
	});

	test("saves volunteer only", () => {
		assert.equal(
			shouldAutoSaveCvData(
				cv((data) => {
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
				null,
			),
			true,
		);
	});

	test("saves custom section only", () => {
		assert.equal(
			shouldAutoSaveCvData(
				cv((data) => {
					data.customSections = [
						{
							id: "custom-1",
							title: "Publications",
							fields: [],
						},
					];
					data.sectionOrder = [...(data.sectionOrder || []), "custom_custom-1"];
				}),
				null,
			),
			true,
		);
	});

	test("saves settings only", () => {
		assert.equal(
			shouldAutoSaveCvData(
				cv((data) => {
					data.settings = {
						...clone(DEFAULT_RENDER_SETTINGS),
						layout: {
							...clone(DEFAULT_RENDER_SETTINGS.layout),
							textScale: 1.1,
						},
					};
				}),
				null,
			),
			true,
		);
	});

	test("saves section order only", () => {
		assert.equal(
			shouldAutoSaveCvData(
				cv((data) => {
					data.sectionOrder = [
						"technical_skills",
						"professional_summary",
						"professional_experience",
					];
				}),
				null,
			),
			true,
		);
	});

	test("saves complete CV", () => {
		assert.equal(
			shouldAutoSaveCvData(
				cv((data) => {
					data.personalInfo.name = "Grace";
					data.resume = "Summary";
					data.skills = "Compilers";
					data.languages = [
						{ name: "English", level: "language.level.native" },
					];
				}),
				null,
			),
			true,
		);
	});
});
