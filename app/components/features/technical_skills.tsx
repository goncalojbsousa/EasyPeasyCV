"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { FormField } from "../ui/form_field";
import { FormSection } from "../ui/form_section";
import { Icons } from "../ui/icons";

/**
 * Props interface for the TechnicalSkills component
 */
interface TechnicalSkillsProps {
	/** Technical skills text content */
	skills: string;
	/** Handler for updating skills text */
	onSkillsChange: (value: string) => void;
	/** Whether this section can be reordered */
	canReorder?: boolean;
	/** Callback when user clicks move up button */
	onMoveUp?: () => void;
	/** Callback when user clicks move down button */
	onMoveDown?: () => void;
	/** Whether move up button should be disabled */
	canMoveUp?: boolean;
	/** Whether move down button should be disabled */
	canMoveDown?: boolean;
}

/**
 * Technical Skills component
 * Manages technical skills and competencies text content for the CV
 * @param skills - Technical skills text content
 * @param onSkillsChange - Function to handle skills text updates
 * @returns JSX element representing the technical skills form section
 */
export function TechnicalSkills({
	skills,
	onSkillsChange,
	canReorder = false,
	onMoveUp,
	onMoveDown,
	canMoveUp = true,
	canMoveDown = true,
}: TechnicalSkillsProps) {
	const { t } = useLanguage();
	return (
		<form className="space-y-8 flex flex-col items-center">
			<FormSection
				title={t("section.technical.skills")}
				icon={Icons.technicalSkills}
				canReorder={canReorder}
				onMoveUp={onMoveUp}
				onMoveDown={onMoveDown}
				canMoveUp={canMoveUp}
				canMoveDown={canMoveDown}
			>
				<FormField
					label={t(`cvType.field.technical.skills`)}
					helperText={t("field.technical.skills.helper")}
				>
					<input
						type="text"
						className="w-full p-3 sm:p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
						placeholder={t(`cvType.placeholder.technical.skills`)}
						value={skills}
						onChange={(e) => onSkillsChange(e.target.value)}
					/>
				</FormField>
			</FormSection>
		</form>
	);
}
