"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import type { Experience, SectionReorderProps } from "../../types/cv";
import { AutoResizeTextarea } from "../ui/auto_resize_textarea";
import { CurrentCheckbox, DateRangeFields } from "../ui/date_range_fields";
import { EntryCard } from "../ui/entry_card";
import { FormField } from "../ui/form_field";
import { Icons } from "../ui/icons";
import { ListSection } from "../ui/list_section";
import { TextInput } from "../ui/text_input";

/**
 * Props interface for the ProfessionalExperience component
 */
interface ProfessionalExperienceProps extends SectionReorderProps {
	/** Array of professional experience entries */
	experiences: Experience[];
	/** Handler for updating experience fields */
	onExperienceChange: (
		idx: number,
		field: string,
		value: string | boolean,
	) => void;
	/** Handler for adding new experience entry */
	onAddExperience: () => void;
	/** Handler for removing experience entry */
	onRemoveExperience: (idx: number) => void;
	/** Handler for reordering experiences */
	onReorderExperiences?: (fromIndex: number, toIndex: number) => void;
}

/**
 * Professional Experience component
 * Manages work experience entries with drag-and-drop reordering
 * @returns JSX element representing the professional experience form section
 */
export function ProfessionalExperience({
	experiences,
	onExperienceChange,
	onAddExperience,
	onRemoveExperience,
	onReorderExperiences,
	...reorder
}: ProfessionalExperienceProps) {
	const { t } = useLanguage();

	// Generates a display title for each experience card based on available data
	const getExperienceTitle = (exp: Experience, idx: number) => {
		if (exp.role && exp.company) return `${exp.role} | ${exp.company}`;
		if (exp.role) return exp.role;
		if (exp.company) return exp.company;
		return `${t("experience.title")} ${idx + 1}`;
	};

	return (
		<ListSection
			{...reorder}
			title={t("section.professional.experience")}
			icon={Icons.professionalExperience}
			items={experiences}
			emptyMessage={t("empty.experience")}
			addLabel={t("add.experience")}
			onAdd={onAddExperience}
			onReorder={onReorderExperiences}
			renderItem={(exp, idx, draggable) => (
				<EntryCard
					key={idx}
					entityLabel="experience"
					title={getExperienceTitle(exp, idx)}
					draggable={draggable}
					onRemove={() => onRemoveExperience(idx)}
				>
					{/* Job title and company fields */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
						<FormField label={t("field.role")}>
							<TextInput
								placeholder={t("cvType.placeholder.role")}
								value={exp.role}
								onChange={(e) =>
									onExperienceChange(idx, "role", e.target.value)
								}
							/>
						</FormField>
						<FormField label={t("field.company")}>
							<TextInput
								placeholder={t("placeholder.company")}
								value={exp.company}
								onChange={(e) =>
									onExperienceChange(idx, "company", e.target.value)
								}
							/>
						</FormField>
					</div>

					<DateRangeFields
						startMonth={exp.startMonth}
						startYear={exp.startYear}
						endMonth={exp.endMonth}
						endYear={exp.endYear}
						showEnd={!exp.current}
						onChange={(field, value) => onExperienceChange(idx, field, value)}
					/>

					<CurrentCheckbox
						id={`experience-current-${idx}`}
						checked={exp.current}
						onChange={(checked) => onExperienceChange(idx, "current", checked)}
					/>

					{/* Technologies used field */}
					<div className="mb-4">
						<FormField label={t("cvType.field.technologies")}>
							<TextInput
								placeholder={t("cvType.placeholder.technologies")}
								value={exp.tech}
								onChange={(e) =>
									onExperienceChange(idx, "tech", e.target.value)
								}
							/>
						</FormField>
					</div>

					{/* Activities and responsibilities field */}
					<div className="mb-4">
						<FormField label={t("field.activities")}>
							<AutoResizeTextarea
								placeholder={t("cvType.placeholder.activities")}
								value={exp.activities}
								onChange={(e) =>
									onExperienceChange(idx, "activities", e.target.value)
								}
								minHeight={80}
							/>
						</FormField>
					</div>

					{/* Achievements and results field */}
					<FormField
						label={t("field.achievements.label")}
						helperText={t("field.achievements.helper")}
					>
						<AutoResizeTextarea
							placeholder={t("cvType.placeholder.achievements")}
							value={exp.results}
							onChange={(e) =>
								onExperienceChange(idx, "results", e.target.value)
							}
							minHeight={80}
						/>
					</FormField>
				</EntryCard>
			)}
		/>
	);
}
