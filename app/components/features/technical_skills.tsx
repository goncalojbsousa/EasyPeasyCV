"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import type { SectionControlProps } from "../../types/cv";
import { FormField } from "../ui/form_field";
import { FormSection } from "../ui/form_section";
import { Icons } from "../ui/icons";
import { TextInput } from "../ui/text_input";

/**
 * Props interface for the TechnicalSkills component
 */
interface TechnicalSkillsProps extends SectionControlProps {
	/** Technical skills text content */
	skills: string;
	/** Handler for updating skills text */
	onSkillsChange: (value: string) => void;
}

/**
 * Technical Skills component
 * Manages technical skills and competencies text content for the CV
 * @returns JSX element representing the technical skills form section
 */
export function TechnicalSkills({
	skills,
	onSkillsChange,
	...reorder
}: TechnicalSkillsProps) {
	const { t } = useLanguage();
	return (
		<form className="space-y-8 flex flex-col items-center">
			<FormSection
				title={t("section.technical.skills")}
				icon={Icons.technicalSkills}
				{...reorder}
			>
				<FormField
					label={t("cvType.field.technical.skills")}
					helperText={t("field.technical.skills.helper")}
				>
					<TextInput
						placeholder={t("cvType.placeholder.technical.skills")}
						value={skills}
						onChange={(e) => onSkillsChange(e.target.value)}
					/>
				</FormField>
			</FormSection>
		</form>
	);
}
