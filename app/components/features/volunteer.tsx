"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import type { SectionControlProps, Volunteer } from "../../types/cv";
import { AutoResizeTextarea } from "../ui/auto_resize_textarea";
import { CurrentCheckbox, DateRangeFields } from "../ui/date_range_fields";
import { EntryCard } from "../ui/entry_card";
import { FormField } from "../ui/form_field";
import { Icons } from "../ui/icons";
import { ListSection } from "../ui/list_section";
import { TextInput } from "../ui/text_input";

/**
 * Props interface for the VolunteerWork component
 */
interface VolunteerWorkProps extends SectionControlProps {
	/** Array of volunteer entries */
	volunteers: Volunteer[];
	/** Handler for updating volunteer fields */
	onVolunteerChange: (
		idx: number,
		field: string,
		value: string | boolean,
	) => void;
	/** Handler for adding new volunteer entry */
	onAddVolunteer: () => void;
	/** Handler for removing volunteer entry */
	onRemoveVolunteer: (idx: number) => void;
	/** Handler for reordering volunteer entries */
	onReorderVolunteers?: (fromIndex: number, toIndex: number) => void;
}

/**
 * Volunteer work component
 * Manages volunteering entries with drag-and-drop reordering
 * @returns JSX element representing the volunteer form section
 */
export function VolunteerWork({
	volunteers,
	onVolunteerChange,
	onAddVolunteer,
	onRemoveVolunteer,
	onReorderVolunteers,
	...reorder
}: VolunteerWorkProps) {
	const { t } = useLanguage();

	// Generates a display title for each volunteer card based on available data
	const getVolunteerTitle = (vol: Volunteer, idx: number) => {
		if (vol.role && vol.organization)
			return `${vol.role} | ${vol.organization}`;
		if (vol.role) return vol.role;
		if (vol.organization) return vol.organization;
		return `${t("volunteer.title")} ${idx + 1}`;
	};

	return (
		<ListSection
			{...reorder}
			title={t("section.volunteer")}
			icon={Icons.volunteer}
			items={volunteers}
			emptyMessage={t("empty.volunteer")}
			addLabel={t("add.volunteer")}
			onAdd={onAddVolunteer}
			onReorder={onReorderVolunteers}
			renderItem={(vol, idx, draggable) => (
				<EntryCard
					key={idx}
					entityLabel="volunteer experience"
					title={getVolunteerTitle(vol, idx)}
					draggable={draggable}
					onRemove={() => onRemoveVolunteer(idx)}
				>
					{/* Organization and role fields */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
						<FormField label={t("field.organization")}>
							<TextInput
								placeholder={t("placeholder.organization")}
								value={vol.organization}
								onChange={(e) =>
									onVolunteerChange(idx, "organization", e.target.value)
								}
							/>
						</FormField>
						<FormField label={t("field.role")}>
							<TextInput
								placeholder={t("placeholder.role")}
								value={vol.role}
								onChange={(e) => onVolunteerChange(idx, "role", e.target.value)}
							/>
						</FormField>
					</div>

					<DateRangeFields
						startMonth={vol.startMonth}
						startYear={vol.startYear}
						endMonth={vol.endMonth}
						endYear={vol.endYear}
						showEnd={!vol.current}
						onChange={(field, value) => onVolunteerChange(idx, field, value)}
					/>

					<CurrentCheckbox
						id={`volunteer-current-${idx}`}
						checked={vol.current}
						onChange={(checked) => onVolunteerChange(idx, "current", checked)}
					/>

					{/* Description field */}
					<div className="mb-4">
						<FormField label={t("field.description")}>
							<AutoResizeTextarea
								placeholder={t("placeholder.volunteer.description")}
								value={vol.description}
								onChange={(e) =>
									onVolunteerChange(idx, "description", e.target.value)
								}
								minHeight={80}
							/>
						</FormField>
					</div>

					{/* Impact field */}
					<FormField
						label={t("field.impact")}
						helperText={t("field.achievements.helper")}
					>
						<AutoResizeTextarea
							placeholder={t("placeholder.volunteer.impact")}
							value={vol.impact}
							onChange={(e) => onVolunteerChange(idx, "impact", e.target.value)}
							minHeight={80}
						/>
					</FormField>
				</EntryCard>
			)}
		/>
	);
}
