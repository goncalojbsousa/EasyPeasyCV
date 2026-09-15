"use client";

import type { ReactNode } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type {
	CustomField,
	CustomSection,
	SectionReorderProps,
} from "../../types/cv";
import { SortableList } from "../dnd/sortable_list";
import { AutoResizeTextarea } from "../ui/auto_resize_textarea";
import { EmptyState } from "../ui/empty_state";
import { EntryCard } from "../ui/entry_card";
import { FormField } from "../ui/form_field";
import { FormSection } from "../ui/form_section";
import { IconButton } from "../ui/icon_button";
import { Icons } from "../ui/icons";
import { TextInput } from "../ui/text_input";

/** Keys of a custom field that the form can edit. */
type CustomFieldKey = keyof Omit<CustomField, "id">;

interface CustomSectionCardProps extends SectionReorderProps {
	section: CustomSection;
	onTitleChange: (value: string) => void;
	onAddField: () => void;
	onFieldChange: (
		fieldId: string,
		key: CustomFieldKey,
		value: string | boolean,
	) => void;
	onRemoveField: (fieldId: string) => void;
	onRemoveSection: () => void;
	onReorderFields?: (fromIndex: number, toIndex: number) => void;
}

/** Small labelled checkbox used by the per-field toggles. */
function FieldToggle({
	checked,
	onChange,
	children,
}: {
	checked: boolean;
	onChange: (checked: boolean) => void;
	children: ReactNode;
}) {
	return (
		<label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
			<input
				type="checkbox"
				className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
			/>
			{children}
		</label>
	);
}

export function CustomSectionCard({
	section,
	onTitleChange,
	onAddField,
	onFieldChange,
	onRemoveField,
	onRemoveSection,
	onReorderFields,
	...reorder
}: CustomSectionCardProps) {
	const { t } = useLanguage();

	/** Renders a free-text month/year pair for one end of the date range. */
	const monthYearPair = (
		field: CustomField,
		monthKey: "startMonth" | "endMonth",
		yearKey: "startYear" | "endYear",
	) => (
		<div className="grid grid-cols-2 gap-2">
			<TextInput
				placeholder={t("custom.field.placeholder.month")}
				value={field[monthKey] || ""}
				onChange={(e) => onFieldChange(field.id, monthKey, e.target.value)}
			/>
			<TextInput
				placeholder={t("custom.field.placeholder.year")}
				value={field[yearKey] || ""}
				onChange={(e) => onFieldChange(field.id, yearKey, e.target.value)}
			/>
		</div>
	);

	return (
		<div className="space-y-4">
			<FormSection
				title={section.title || t("custom.section.default")}
				icon={Icons.actions}
				{...reorder}
				actionButton={
					<IconButton
						onClick={onRemoveSection}
						variant="danger"
						size="sm"
						ariaLabel={t("custom.section.remove")}
					>
						{Icons.remove}
						{t("custom.section.remove")}
					</IconButton>
				}
			>
				<div className="space-y-4">
					<FormField label={t("custom.section.name")}>
						<TextInput
							placeholder={t("custom.section.placeholder.name")}
							value={section.title}
							onChange={(e) => onTitleChange(e.target.value)}
						/>
					</FormField>

					{section.fields.length === 0 && (
						<EmptyState message={t("custom.section.empty.fields")} />
					)}

					<SortableList
						length={section.fields.length}
						onReorder={(from, to) => onReorderFields?.(from, to)}
						renderItem={(idx) => {
							const field = section.fields[idx];
							return (
								<EntryCard
									key={field.id}
									entityLabel={t("custom.field.default")}
									title={
										field.label || `${t("custom.field.default")} ${idx + 1}`
									}
									draggable={section.fields.length > 1}
									onRemove={() => onRemoveField(field.id)}
								>
									<div className="space-y-3">
										<FormField label={t("custom.field.label")}>
											<TextInput
												placeholder={t("custom.field.placeholder.label")}
												value={field.label}
												onChange={(e) =>
													onFieldChange(field.id, "label", e.target.value)
												}
											/>
										</FormField>
										<FormField label={t("custom.field.subtitle")}>
											<TextInput
												placeholder={t("custom.field.placeholder.subtitle")}
												value={field.subtitle || ""}
												onChange={(e) =>
													onFieldChange(field.id, "subtitle", e.target.value)
												}
											/>
										</FormField>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<FormField label={t("custom.field.start")}>
												{monthYearPair(field, "startMonth", "startYear")}
											</FormField>
											{!field.current && (
												<FormField label={t("custom.field.end")}>
													{monthYearPair(field, "endMonth", "endYear")}
												</FormField>
											)}
										</div>
										<div className="flex flex-wrap gap-4">
											<FieldToggle
												checked={!!field.current}
												onChange={(checked) =>
													onFieldChange(field.id, "current", checked)
												}
											>
												{t("custom.field.current")}
											</FieldToggle>
											<FieldToggle
												checked={!!field.centerValue}
												onChange={(checked) =>
													onFieldChange(field.id, "centerValue", checked)
												}
											>
												{t("custom.field.center")}
											</FieldToggle>
										</div>
										<FormField label={t("custom.field.value")}>
											<AutoResizeTextarea
												placeholder={t("custom.field.placeholder.value")}
												value={field.value}
												onChange={(e) =>
													onFieldChange(field.id, "value", e.target.value)
												}
												minHeight={80}
											/>
										</FormField>
										<FormField label={t("custom.field.bullets")}>
											<AutoResizeTextarea
												placeholder={t("custom.field.placeholder.bullets")}
												value={field.bullets || ""}
												onChange={(e) =>
													onFieldChange(field.id, "bullets", e.target.value)
												}
												minHeight={80}
											/>
										</FormField>
									</div>
								</EntryCard>
							);
						}}
					/>

					<div className="flex justify-start mt-4">
						<IconButton onClick={onAddField}>
							{Icons.add}
							{t("custom.field.add")}
						</IconButton>
					</div>
				</div>
			</FormSection>
		</div>
	);
}
