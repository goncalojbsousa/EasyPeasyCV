"use client";

import { useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { Language, SectionControlProps } from "../../types/cv";
import { EntryCard } from "../ui/entry_card";
import { FormField } from "../ui/form_field";
import { Icons } from "../ui/icons";
import { ListSection } from "../ui/list_section";
import { SelectMenu } from "../ui/select_menu";
import { TextInput } from "../ui/text_input";

/**
 * Props interface for the Languages component
 */
interface LanguagesProps extends SectionControlProps {
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
	...reorder
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
		<ListSection
			{...reorder}
			title={t("section.languages")}
			icon={Icons.languages}
			items={languages}
			emptyMessage={t("empty.language")}
			addLabel={t("add.language")}
			onAdd={onAddLanguage}
			onReorder={onReorderLanguages}
			renderItem={(lang, idx, draggable) => (
				<EntryCard
					key={idx}
					entityLabel="language"
					title={getLanguageTitle(lang, idx)}
					draggable={draggable}
					onRemove={() => onRemoveLanguage(idx)}
				>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
						<FormField label={t("field.language")}>
							<TextInput
								placeholder={t("placeholder.language")}
								value={lang.name}
								onChange={(e) => onLanguageChange(idx, "name", e.target.value)}
							/>
						</FormField>
						<FormField label={t("field.level")}>
							<SelectMenu
								options={levelOptions}
								value={lang.level}
								placeholder={t("select.language.level")}
								onSelect={(level) => onLanguageChange(idx, "level", level)}
								renderTriggerLabel={(option) =>
									option?.label || t("select.language.level")
								}
							/>
						</FormField>
					</div>
				</EntryCard>
			)}
		/>
	);
}
