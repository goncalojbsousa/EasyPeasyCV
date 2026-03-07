"use client";

import { GripVertical } from "lucide-react";
import { useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { Language } from "../../types/cv";
import { DragHandle, SortableList } from "../dnd/sortable_list";
import { EmptyState } from "../ui/empty_state";
import { FormField } from "../ui/form_field";
import { FormSection } from "../ui/form_section";
import { IconButton } from "../ui/icon_button";
import { Icons } from "../ui/icons";
import { SelectMenu } from "../ui/select_menu";

/**
 * Props interface for the Languages component
 */
interface LanguagesProps {
	/** Array of language entries */
	languages: Language[];
	/** Handler for updating language fields */
	onLanguageChange: (idx: number, field: string, value: string) => void;
	/** Handler for adding new language */
	onAddLanguage: () => void;
	/** Handler for removing language */
	onRemoveLanguage: (idx: number) => void;
	/** Handler for reordering languages */
	onReorderLanguages?: (fromIndex: number, toIndex: number) => void;
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
 * Available language levels for dropdown selection
 * Using CEFR (Common European Framework of Reference for Languages) + Native
 */
const LANGUAGE_LEVELS = [
	"language.level.a1",
	"language.level.a2",
	"language.level.b1",
	"language.level.b2",
	"language.level.c1",
	"language.level.c2",
	"language.level.native",
];

/**
 * Languages component manages the languages section of the CV form
 * @param languages - Array of language entries
 * @param onLanguageChange - Function to handle language field updates
 * @param onAddLanguage - Function to add new language entry
 * @param onRemoveLanguage - Function to remove language entry
 * @returns JSX element representing the languages form section
 */
/**
 * Languages component
 * Manages language proficiency entries
 * @param props - Component props including language data and handlers
 * @returns JSX element representing the languages form section
 */
export function Languages({
	languages,
	onLanguageChange,
	onAddLanguage,
	onRemoveLanguage,
	onReorderLanguages,
	canReorder = false,
	onMoveUp,
	onMoveDown,
	canMoveUp = true,
	canMoveDown = true,
}: LanguagesProps) {
	const { t } = useLanguage();
	const levelOptions = useMemo(
		() => LANGUAGE_LEVELS.map((level) => ({ value: level, label: t(level) })),
		[t],
	);

	// Generates a display title for each language card based on available data
	const getLanguageTitle = (lang: Language, idx: number) => {
		if (lang.name && lang.level) {
			const levelLabel =
				levelOptions.find((opt) => opt.value === lang.level)?.label ||
				lang.level;
			return `${lang.name} - ${levelLabel}`;
		}
		if (lang.name) return lang.name;
		return `${t("field.language")} ${idx + 1}`;
	};

	return (
		<form className="space-y-8 flex flex-col items-center">
			<FormSection
				title={t("section.languages")}
				icon={Icons.languages}
				canReorder={canReorder}
				onMoveUp={onMoveUp}
				onMoveDown={onMoveDown}
				canMoveUp={canMoveUp}
				canMoveDown={canMoveDown}
			>
				{/* Display empty state when no languages exist */}
				{languages.length === 0 && <EmptyState message={t("empty.language")} />}

				{/* Render each language entry via SortableList */}
				<SortableList
					length={languages.length}
					onReorder={(from, to) => onReorderLanguages?.(from, to)}
					renderItem={(idx) => {
						const lang = languages[idx];
						return (
							<div
								key={idx}
								className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm relative mb-6 transition-all duration-300"
							>
								{/* Card header with title */}
								<div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 border-b border-gray-200 dark:border-zinc-700 rounded-t-lg transition-colors duration-300">
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2">
											{languages.length > 1 && (
												<DragHandle
													ariaLabel="Reorder language"
													className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors duration-300"
												>
													<GripVertical className="w-4 h-4" />
												</DragHandle>
											)}
											<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
												{getLanguageTitle(lang, idx)}
											</h3>
										</div>
										<IconButton
											onClick={() => onRemoveLanguage(idx)}
											variant="danger"
											size="sm"
											ariaLabel="Remove language"
										>
											{Icons.remove}
										</IconButton>
									</div>
								</div>

								{/* Card content */}
								<div className="p-4">
									{/* Language name and proficiency level fields */}
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
										<FormField label={t("field.language")}>
											<input
												type="text"
												className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
												placeholder={t("placeholder.language")}
												value={lang.name}
												onChange={(e) =>
													onLanguageChange(idx, "name", e.target.value)
												}
											/>
										</FormField>
										<FormField label={t("field.level")}>
											<SelectMenu
												options={levelOptions}
												value={lang.level}
												placeholder={t("select.language.level")}
												onSelect={(level) =>
													onLanguageChange(idx, "level", level)
												}
												renderTriggerLabel={(option) =>
													option?.label || t("select.language.level")
												}
											/>
										</FormField>
									</div>
								</div>
							</div>
						);
					}}
				/>

				{/* Add language button at bottom */}
				<div className="flex justify-start mt-4">
					<IconButton onClick={onAddLanguage}>
						{Icons.add}
						{t("add.language")}
					</IconButton>
				</div>
			</FormSection>
		</form>
	);
}
