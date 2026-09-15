"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import type { Project, SectionReorderProps } from "../../types/cv";
import { AutoResizeTextarea } from "../ui/auto_resize_textarea";
import { EntryCard } from "../ui/entry_card";
import { FormField } from "../ui/form_field";
import { Icons } from "../ui/icons";
import { ListSection } from "../ui/list_section";
import { TextInput } from "../ui/text_input";

/**
 * Props interface for the Projects component
 */
interface ProjectsProps extends SectionReorderProps {
	/** Array of project entries */
	projects: Project[];
	/** Handler for updating project fields */
	onProjectChange: (idx: number, field: string, value: string) => void;
	/** Handler for adding new project entry */
	onAddProject: () => void;
	/** Handler for removing project entry */
	onRemoveProject: (idx: number) => void;
	/** Handler for reordering project entries */
	onReorderProjects?: (fromIndex: number, toIndex: number) => void;
}

/**
 * Projects component
 * Manages project portfolio entries with drag-and-drop reordering
 * @returns JSX element representing the projects form section
 */
export function Projects({
	projects,
	onProjectChange,
	onAddProject,
	onRemoveProject,
	onReorderProjects,
	...reorder
}: ProjectsProps) {
	const { t } = useLanguage();

	return (
		<ListSection
			{...reorder}
			title={t("section.projects")}
			icon={Icons.projects}
			items={projects}
			emptyMessage={t("empty.project")}
			addLabel={t("add.project")}
			onAdd={onAddProject}
			onReorder={onReorderProjects}
			renderItem={(proj, idx, draggable) => (
				<EntryCard
					key={idx}
					entityLabel="project"
					title={proj.name || `${t("project.title")} ${idx + 1}`}
					draggable={draggable}
					onRemove={() => onRemoveProject(idx)}
				>
					{/* Project name and year fields */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
						<FormField label={t("field.project.name")}>
							<TextInput
								placeholder={t("cvType.placeholder.project.name")}
								value={proj.name}
								onChange={(e) => onProjectChange(idx, "name", e.target.value)}
							/>
						</FormField>
						<FormField label={t("field.year")}>
							<TextInput
								placeholder={t("placeholder.project.year")}
								value={proj.year}
								onChange={(e) => onProjectChange(idx, "year", e.target.value)}
							/>
						</FormField>
					</div>

					{/* Source code and project link fields */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
						<FormField label={t("field.project.sourceCode")}>
							<TextInput
								type="url"
								placeholder={t("placeholder.project.sourceCode")}
								value={proj.sourceCode || ""}
								onChange={(e) =>
									onProjectChange(idx, "sourceCode", e.target.value)
								}
							/>
						</FormField>
						<FormField label={t("field.project.link")}>
							<TextInput
								type="url"
								placeholder={t("placeholder.project.link")}
								value={proj.link}
								onChange={(e) => onProjectChange(idx, "link", e.target.value)}
							/>
						</FormField>
					</div>

					{/* Technologies field */}
					<div className="grid grid-cols-1 gap-4 sm:gap-6 mb-4">
						<FormField label={t("cvType.field.technologies")}>
							<TextInput
								placeholder={t("cvType.placeholder.technologies")}
								value={proj.tech}
								onChange={(e) => onProjectChange(idx, "tech", e.target.value)}
							/>
						</FormField>
					</div>

					{/* Project description field */}
					<div className="mb-4">
						<FormField label={t("field.description")}>
							<AutoResizeTextarea
								placeholder={t("cvType.placeholder.project.description")}
								value={proj.description}
								onChange={(e) =>
									onProjectChange(idx, "description", e.target.value)
								}
								minHeight={80}
							/>
						</FormField>
					</div>

					{/* Project impact field */}
					<FormField
						label={t("field.impact")}
						helperText={t("field.achievements.helper")}
					>
						<AutoResizeTextarea
							placeholder={t("placeholder.project.impact")}
							value={proj.impact}
							onChange={(e) => onProjectChange(idx, "impact", e.target.value)}
							minHeight={80}
						/>
					</FormField>
				</EntryCard>
			)}
		/>
	);
}
