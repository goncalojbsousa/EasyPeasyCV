"use client";

import { useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { Education, SectionControlProps } from "../../types/cv";
import { AutoResizeTextarea } from "../ui/auto_resize_textarea";
import { DateRangeFields } from "../ui/date_range_fields";
import { EntryCard } from "../ui/entry_card";
import { FormField } from "../ui/form_field";
import { Icons } from "../ui/icons";
import { ListSection } from "../ui/list_section";
import { SelectMenu } from "../ui/select_menu";
import { TextInput } from "../ui/text_input";

/**
 * Props interface for the AcademicEducation component
 */
interface AcademicEducationProps extends SectionControlProps {
	/** Array of education entries */
	education: Education[];
	/** Handler for updating education fields */
	onEducationChange: (idx: number, field: string, value: string) => void;
	/** Handler for adding new education entry */
	onAddEducation: () => void;
	/** Handler for removing education entry */
	onRemoveEducation: (idx: number) => void;
	/** Handler for reordering education entries */
	onReorderEducation?: (fromIndex: number, toIndex: number) => void;
}

/**
 * Available education types for dropdown selection
 */
const EDUCATION_TYPES = [
	"education.type.secondary",
	"education.type.technical",
	"education.type.bachelor",
	"education.type.postgraduate",
	"education.type.master",
	"education.type.phd",
];

/**
 * Available education status options for dropdown selection
 */
const EDUCATION_STATUS = [
	"education.status.completed",
	"education.status.in.progress",
	"education.status.interrupted",
];

/**
 * Academic Education component
 * Manages educational background entries with drag-and-drop reordering
 * @returns JSX element representing the academic education form section
 */
export function AcademicEducation({
	education,
	onEducationChange,
	onAddEducation,
	onRemoveEducation,
	onReorderEducation,
	...reorder
}: AcademicEducationProps) {
	const { t } = useLanguage();
	const educationTypeOptions = useMemo(
		() => [
			{ value: "", label: t("education.option.none") },
			...EDUCATION_TYPES.map((type) => ({ value: type, label: t(type) })),
		],
		[t],
	);
	const educationStatusOptions = useMemo(
		() => [
			{ value: "", label: t("education.option.none") },
			...EDUCATION_STATUS.map((status) => ({
				value: status,
				label: t(status),
			})),
		],
		[t],
	);

	// Generates a display title for each education card based on available data
	const getEducationTitle = (ed: Education, idx: number) => {
		if (ed.course && ed.type) return `${ed.course} | ${t(ed.type)}`;
		if (ed.course) return ed.course;
		if (ed.type) return t(ed.type);
		return `${t("education.title")} ${idx + 1}`;
	};

	return (
		<ListSection
			{...reorder}
			title={t("section.academic.education")}
			icon={Icons.academicEducation}
			items={education}
			emptyMessage={t("empty.education")}
			addLabel={t("add.education")}
			onAdd={onAddEducation}
			onReorder={onReorderEducation}
			renderItem={(ed, idx, draggable) => (
				<EntryCard
					key={idx}
					entityLabel="education"
					title={getEducationTitle(ed, idx)}
					draggable={draggable}
					onRemove={() => onRemoveEducation(idx)}
				>
					{/* Education type and status fields */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
						<FormField label={t("field.education.type")}>
							<SelectMenu
								options={educationTypeOptions}
								value={ed.type}
								placeholder={t("select.education.type")}
								onSelect={(type) => onEducationChange(idx, "type", type)}
								renderTriggerLabel={(option) =>
									option?.label || t("select.education.type")
								}
							/>
						</FormField>
						<FormField label={t("field.education.status")}>
							<SelectMenu
								options={educationStatusOptions}
								value={ed.status}
								placeholder={t("select.education.status")}
								onSelect={(status) => onEducationChange(idx, "status", status)}
								renderTriggerLabel={(option) =>
									option?.label || t("select.education.status")
								}
							/>
						</FormField>
					</div>

					{/* Course and institution fields */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
						<FormField label={t("field.course")}>
							<TextInput
								placeholder={t("placeholder.course")}
								value={ed.course}
								onChange={(e) =>
									onEducationChange(idx, "course", e.target.value)
								}
							/>
						</FormField>
						<FormField label={t("field.institution")}>
							<TextInput
								placeholder={t("placeholder.institution")}
								value={ed.institution}
								onChange={(e) =>
									onEducationChange(idx, "institution", e.target.value)
								}
							/>
						</FormField>
					</div>

					{/* End dates only make sense once the course is completed */}
					<DateRangeFields
						startMonth={ed.startMonth}
						startYear={ed.startYear}
						endMonth={ed.endMonth}
						endYear={ed.endYear}
						showEnd={ed.status === "education.status.completed"}
						onChange={(field, value) => onEducationChange(idx, field, value)}
					/>

					{/* Description field */}
					<div className="mb-4">
						<FormField label={t("field.description")}>
							<AutoResizeTextarea
								placeholder={t("placeholder.education.description")}
								value={ed.description}
								onChange={(e) =>
									onEducationChange(idx, "description", e.target.value)
								}
								minHeight={80}
							/>
						</FormField>
					</div>

					{/* Achievements field */}
					<FormField
						label={t("field.achievements.label")}
						helperText={t("field.achievements.helper")}
					>
						<AutoResizeTextarea
							placeholder={t("placeholder.achievements")}
							value={ed.achievements}
							onChange={(e) =>
								onEducationChange(idx, "achievements", e.target.value)
							}
							minHeight={80}
						/>
					</FormField>
				</EntryCard>
			)}
		/>
	);
}
