"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import type { SectionReorderProps } from "../../types/cv";
import { AutoResizeTextarea } from "../ui/auto_resize_textarea";
import { FormField } from "../ui/form_field";
import { FormSection } from "../ui/form_section";
import { Icons } from "../ui/icons";

/**
 * Props interface for the ProfessionalSummary component
 */
interface ProfessionalSummaryProps extends SectionReorderProps {
	/** Professional summary text content */
	resume: string;
	/** Handler for updating resume text */
	onResumeChange: (resume: string) => void;
}

/**
 * Professional Summary component
 * Manages the professional summary/resume text content for the CV
 * @returns JSX element representing the professional summary form section
 */
export function ProfessionalSummary({
	resume,
	onResumeChange,
	...reorder
}: ProfessionalSummaryProps) {
	const { t } = useLanguage();

	return (
		<form className="space-y-8 flex flex-col items-center w-full">
			<FormSection
				title={t("section.professional.summary")}
				icon={Icons.professionalSummary}
				{...reorder}
			>
				<FormField label={t("field.professional.summary")}>
					<AutoResizeTextarea
						className="min-h-[120px]"
						placeholder={t("cvType.placeholder.professional.summary")}
						value={resume}
						onChange={(e) => onResumeChange(e.target.value)}
						minHeight={120}
					/>
				</FormField>
			</FormSection>
		</form>
	);
}
