"use client";

import { useMemo } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslatedMonthWithT, MONTHS_EN, toEN } from "../../utils/months";
import { FormField } from "./form_field";
import { SelectMenu } from "./select_menu";
import { TextInput } from "./text_input";

interface DateRangeFieldsProps {
	startMonth?: string;
	startYear?: string;
	endMonth?: string;
	endYear?: string;
	/** Called with the entry field name and its new value */
	onChange: (
		field: "startMonth" | "startYear" | "endMonth" | "endYear",
		value: string,
	) => void;
	/** Whether the end-date fields are shown (hidden for ongoing entries) */
	showEnd?: boolean;
}

/**
 * Start/end month + year picker shared by experience, education, volunteering
 * and custom sections. Month values are stored as English abbreviations and
 * displayed in the active UI language.
 */
export function DateRangeFields({
	startMonth,
	startYear,
	endMonth,
	endYear,
	onChange,
	showEnd = true,
}: DateRangeFieldsProps) {
	const { t } = useLanguage();
	const monthOptions = useMemo(
		() =>
			MONTHS_EN.map((month) => ({
				value: month as string,
				label: getTranslatedMonthWithT(t, month),
			})),
		[t],
	);

	const monthField = (
		label: string,
		value: string | undefined,
		field: "startMonth" | "endMonth",
	) => (
		<FormField label={label}>
			<SelectMenu
				options={monthOptions}
				value={toEN(value) as string | undefined}
				placeholder={t("select.month")}
				onSelect={(month) => onChange(field, month)}
				renderTriggerLabel={(option) => option?.label || t("select.month")}
			/>
		</FormField>
	);

	const yearField = (
		label: string,
		value: string | undefined,
		field: "startYear" | "endYear",
	) => (
		<FormField label={label}>
			<TextInput
				placeholder={t("placeholder.year")}
				value={value ?? ""}
				onChange={(e) => onChange(field, e.target.value)}
			/>
		</FormField>
	);

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4">
			{monthField(t("field.start.month"), startMonth, "startMonth")}
			{yearField(t("field.start.year"), startYear, "startYear")}
			{showEnd && (
				<>
					{monthField(t("field.end.month"), endMonth, "endMonth")}
					{yearField(t("field.end.year"), endYear, "endYear")}
				</>
			)}
		</div>
	);
}

interface CurrentCheckboxProps {
	id: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
}

/** "This is my current role" checkbox that accompanies a date range. */
export function CurrentCheckbox({
	id,
	checked,
	onChange,
	label,
}: CurrentCheckboxProps) {
	const { t } = useLanguage();

	return (
		<div className="flex items-center gap-2 mb-4">
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				id={id}
				className="mr-2"
			/>
			<label htmlFor={id} className="text-sm text-gray-900 dark:text-gray-100">
				{label ?? t("field.current")}
			</label>
		</div>
	);
}
