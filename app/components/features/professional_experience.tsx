"use client";

import { GripVertical } from "lucide-react";
import { useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { Experience } from "../../types/cv";
import {
	getTranslatedMonthWithT,
	MONTHS_EN as MONTHS,
	toEN,
} from "../../utils/months";
import { DragHandle, SortableList } from "../dnd/sortable_list";
import { AutoResizeTextarea } from "../ui/auto_resize_textarea";
import { EmptyState } from "../ui/empty_state";
import { FormField } from "../ui/form_field";
import { FormSection } from "../ui/form_section";
import { IconButton } from "../ui/icon_button";
import { Icons } from "../ui/icons";
import { SelectMenu } from "../ui/select_menu";

/**
 * Props interface for the ProfessionalExperience component
 */
interface ProfessionalExperienceProps {
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
 * Professional Experience component
 * Manages work experience entries with drag-and-drop reordering
 * @param experiences - Array of professional experience entries
 * @param onExperienceChange - Function to handle experience field updates
 * @param onAddExperience - Function to add new experience entry
 * @param onRemoveExperience - Function to remove experience entry
 * @param onReorderExperiences - Function to reorder experience entries
 * @returns JSX element representing the professional experience form section
 */
export function ProfessionalExperience({
	experiences,
	onExperienceChange,
	onAddExperience,
	onRemoveExperience,
	onReorderExperiences,
	canReorder = false,
	onMoveUp,
	onMoveDown,
	canMoveUp = true,
	canMoveDown = true,
}: ProfessionalExperienceProps) {
	const { t } = useLanguage();
	const monthOptions = useMemo(
		() =>
			MONTHS.map((month) => ({
				value: month,
				label: getTranslatedMonthWithT(t, month),
			})),
		[t],
	);

	// Generates a display title for each experience card based on available data
	const getExperienceTitle = (exp: Experience, idx: number) => {
		if (exp.role && exp.company) return `${exp.role} | ${exp.company}`;
		if (exp.role) return exp.role;
		if (exp.company) return exp.company;
		return `${t("experience.title")} ${idx + 1}`;
	};

	// Drag & drop handled by SortableList

	return (
		<form className="space-y-8 flex flex-col items-center">
			<FormSection
				title={t("section.professional.experience")}
				icon={Icons.professionalExperience}
				canReorder={canReorder}
				onMoveUp={onMoveUp}
				onMoveDown={onMoveDown}
				canMoveUp={canMoveUp}
				canMoveDown={canMoveDown}
			>
				{/* Display empty state when no experiences exist */}
				{experiences.length === 0 && (
					<EmptyState message={t("empty.experience")} />
				)}

				{/* Render each experience entry via SortableList */}
				<SortableList
					length={experiences.length}
					onReorder={(from, to) => onReorderExperiences?.(from, to)}
					renderItem={(idx) => {
						const exp = experiences[idx];
						return (
							<div
								key={idx}
								className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm relative mb-6 transition-all duration-300"
							>
								{/* Card header with title */}
								<div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 border-b border-gray-200 dark:border-zinc-700 rounded-t-lg transition-colors duration-300">
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2">
											{experiences.length > 1 && (
												<DragHandle
													ariaLabel="Reorder experience"
													className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors duration-300"
												>
													<GripVertical className="w-4 h-4" />
												</DragHandle>
											)}
											<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
												{getExperienceTitle(exp, idx)}
											</h3>
										</div>
										<IconButton
											onClick={() => onRemoveExperience(idx)}
											variant="danger"
											size="sm"
											ariaLabel="Remove experience"
										>
											{Icons.remove}
										</IconButton>
									</div>
								</div>

								{/* Card content */}
								<div className="p-4">
									{/* Job title and company fields */}
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
										<FormField label={t("field.role")}>
											<input
												type="text"
												className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
												placeholder={t(`cvType.placeholder.role`)}
												value={exp.role}
												onChange={(e) =>
													onExperienceChange(idx, "role", e.target.value)
												}
											/>
										</FormField>
										<FormField label={t("field.company")}>
											<input
												type="text"
												className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
												placeholder={t("placeholder.company")}
												value={exp.company}
												onChange={(e) =>
													onExperienceChange(idx, "company", e.target.value)
												}
											/>
										</FormField>
									</div>

									{/* Date range fields */}
									<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4">
										<FormField label={t("field.start.month")}>
											<SelectMenu
												options={monthOptions}
												value={toEN(exp.startMonth) as string | undefined}
												placeholder={t("select.month")}
												onSelect={(month) =>
													onExperienceChange(idx, "startMonth", month)
												}
												renderTriggerLabel={(option) =>
													option?.label || t("select.month")
												}
											/>
										</FormField>
										<FormField label={t("field.start.year")}>
											<input
												type="text"
												className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
												placeholder={t("placeholder.year")}
												value={exp.startYear}
												onChange={(e) =>
													onExperienceChange(idx, "startYear", e.target.value)
												}
											/>
										</FormField>
										{/* End date fields (hidden when current job is selected) */}
										{!exp.current && (
											<>
												<FormField label={t("field.end.month")}>
													<SelectMenu
														options={monthOptions}
														value={toEN(exp.endMonth) as string | undefined}
														placeholder={t("select.month")}
														onSelect={(month) =>
															onExperienceChange(idx, "endMonth", month)
														}
														renderTriggerLabel={(option) =>
															option?.label || t("select.month")
														}
													/>
												</FormField>
												<FormField label={t("field.end.year")}>
													<input
														type="text"
														className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
														placeholder={t("placeholder.year")}
														value={exp.endYear}
														onChange={(e) =>
															onExperienceChange(idx, "endYear", e.target.value)
														}
													/>
												</FormField>
											</>
										)}
									</div>

									{/* Current job checkbox */}
									<div className="flex items-center gap-2 mb-4">
										<input
											type="checkbox"
											checked={exp.current}
											onChange={(e) =>
												onExperienceChange(idx, "current", e.target.checked)
											}
											id={`experience-current-${idx}`}
											className="mr-2"
										/>
										<label
											htmlFor={`experience-current-${idx}`}
											className="text-sm text-gray-900 dark:text-gray-100"
										>
											{t("field.current")}
										</label>
									</div>

									{/* Technologies used field */}
									<div className="mb-4">
										<FormField label={t(`cvType.field.technologies`)}>
											<input
												type="text"
												className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
												placeholder={t(`cvType.placeholder.technologies`)}
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
												className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
												placeholder={t(`cvType.placeholder.activities`)}
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
											className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
											placeholder={t(`cvType.placeholder.achievements`)}
											value={exp.results}
											onChange={(e) =>
												onExperienceChange(idx, "results", e.target.value)
											}
											minHeight={80}
										/>
									</FormField>
								</div>
							</div>
						);
					}}
				/>

				{/* Add experience button at bottom */}
				<div className="flex justify-start mt-4">
					<IconButton onClick={onAddExperience}>
						{Icons.add}
						{t("add.experience")}
					</IconButton>
				</div>
			</FormSection>
		</form>
	);
}
