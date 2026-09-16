import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { CvData } from "../app/types/cv";
import {
	getRecommendedFields,
	isSectionFilled,
	PERSONAL_INFO_KEY,
} from "../app/utils/cv-completeness";
import {
	createEmptyCustomSection,
	createEmptyCvData,
	createEmptyEducation,
	createEmptyExperience,
} from "../app/utils/cv-data";

function emptyCv(): CvData {
	return JSON.parse(JSON.stringify(createEmptyCvData())) as CvData;
}

describe("getRecommendedFields", () => {
	test("an empty CV has every recommended field missing", () => {
		const fields = getRecommendedFields(emptyCv());
		assert.ok(fields.length > 0);
		assert.ok(fields.every((field) => !field.done));
	});

	test("whitespace-only values do not count as filled", () => {
		const data = emptyCv();
		data.personalInfo.name = "   ";
		const name = getRecommendedFields(data).find((f) => f.key === "name");
		assert.equal(name?.done, false);
	});

	test("filling every recommended field completes the list", () => {
		const data = emptyCv();
		data.personalInfo.name = "Ada Lovelace";
		data.personalInfo.desiredRole = "Engineer";
		data.personalInfo.email = "ada@example.com";
		data.personalInfo.phone = "900000000";
		data.experiences = [createEmptyExperience()];
		data.education = [createEmptyEducation()];

		assert.ok(getRecommendedFields(data).every((field) => field.done));
	});

	test("every field points at a section, and personal fields at an input", () => {
		for (const field of getRecommendedFields(emptyCv())) {
			assert.ok(field.section, `${field.key} has no section`);
			if (field.section === PERSONAL_INFO_KEY) {
				assert.ok(field.inputId, `${field.key} has no input to focus`);
			}
		}
	});
});

describe("isSectionFilled", () => {
	test("personal information counts links as content", () => {
		const data = emptyCv();
		assert.equal(isSectionFilled(PERSONAL_INFO_KEY, data), false);
		data.links = [{ type: "GitHub", value: "github.com/ada" }];
		assert.equal(isSectionFilled(PERSONAL_INFO_KEY, data), true);
	});

	test("text sections need non-blank text", () => {
		const data = emptyCv();
		data.resume = "  ";
		assert.equal(isSectionFilled("professional_summary", data), false);
		data.resume = "Summary";
		assert.equal(isSectionFilled("professional_summary", data), true);
	});

	test("list sections are filled once they have an entry", () => {
		const data = emptyCv();
		assert.equal(isSectionFilled("professional_experience", data), false);
		data.experiences = [createEmptyExperience()];
		assert.equal(isSectionFilled("professional_experience", data), true);
	});

	test("a custom section needs a field with content, not just an empty field", () => {
		const data = emptyCv();
		const section = createEmptyCustomSection();
		data.customSections = [section];
		const key = `custom_${section.id}` as const;

		assert.equal(isSectionFilled(key, data), false);
		section.fields[0].label = "Award";
		assert.equal(isSectionFilled(key, data), true);
	});

	test("an unknown custom section is not filled", () => {
		assert.equal(isSectionFilled("custom_missing", emptyCv()), false);
	});
});
