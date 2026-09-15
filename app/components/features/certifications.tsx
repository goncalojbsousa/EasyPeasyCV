"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import type { Certification, SectionReorderProps } from "../../types/cv";
import { AutoResizeTextarea } from "../ui/auto_resize_textarea";
import { DatePicker } from "../ui/date_picker";
import { EntryCard } from "../ui/entry_card";
import { FormField } from "../ui/form_field";
import { Icons } from "../ui/icons";
import { ListSection } from "../ui/list_section";
import { TextInput } from "../ui/text_input";

/**
 * Props interface for the Certifications component
 */
interface CertificationsProps extends SectionReorderProps {
	/** Array of certification entries */
	certifications: Certification[];
	/** Handler for updating certification fields */
	onCertificationChange: (idx: number, field: string, value: string) => void;
	/** Handler for adding new certification entry */
	onAddCertification: () => void;
	/** Handler for removing certification entry */
	onRemoveCertification: (idx: number) => void;
	/** Handler for reordering certification entries */
	onReorderCertifications?: (fromIndex: number, toIndex: number) => void;
}

/**
 * Certifications component
 * Manages certification and course entries with drag-and-drop reordering
 * @returns JSX element representing the certifications form section
 */
export function Certifications({
	certifications,
	onCertificationChange,
	onAddCertification,
	onRemoveCertification,
	onReorderCertifications,
	...reorder
}: CertificationsProps) {
	const { t } = useLanguage();

	// Generates a display title for each certification card based on available data
	const getCertificationTitle = (cert: Certification, idx: number) => {
		if (cert.name && cert.issuer) return `${cert.name} | ${cert.issuer}`;
		if (cert.name) return cert.name;
		if (cert.issuer) return cert.issuer;
		return `${t("certification.title")} ${idx + 1}`;
	};

	return (
		<ListSection
			{...reorder}
			title={t("section.certifications")}
			icon={Icons.certifications}
			items={certifications}
			emptyMessage={t("empty.certification")}
			addLabel={t("add.certification")}
			onAdd={onAddCertification}
			onReorder={onReorderCertifications}
			renderItem={(cert, idx, draggable) => (
				<EntryCard
					key={idx}
					entityLabel="certification"
					title={getCertificationTitle(cert, idx)}
					draggable={draggable}
					onRemove={() => onRemoveCertification(idx)}
				>
					{/* Certification name and issuer fields */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
						<FormField label={t("field.certification")}>
							<TextInput
								placeholder={t("placeholder.certification.name")}
								value={cert.name}
								onChange={(e) =>
									onCertificationChange(idx, "name", e.target.value)
								}
							/>
						</FormField>
						<FormField label={t("field.issuer")}>
							<TextInput
								placeholder={t("placeholder.issuer")}
								value={cert.issuer}
								onChange={(e) =>
									onCertificationChange(idx, "issuer", e.target.value)
								}
							/>
						</FormField>
					</div>

					{/* Completion date, hours, and validation link fields */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
						<FormField label={t("field.completion.date")}>
							<DatePicker
								value={cert.completionDate}
								onChange={(value) =>
									onCertificationChange(idx, "completionDate", value)
								}
								placeholder={t("select.date")}
							/>
						</FormField>
						<FormField label={t("field.hours")}>
							<TextInput
								placeholder={t("placeholder.hours")}
								value={cert.hours}
								onChange={(e) =>
									onCertificationChange(idx, "hours", e.target.value)
								}
							/>
						</FormField>
						<FormField label={t("field.validation.link")}>
							<TextInput
								type="url"
								placeholder={t("placeholder.validation.link")}
								value={cert.validationLink}
								onChange={(e) =>
									onCertificationChange(idx, "validationLink", e.target.value)
								}
							/>
						</FormField>
					</div>

					{/* Description field */}
					<FormField label={t("field.description")}>
						<AutoResizeTextarea
							placeholder={t("placeholder.certification.description")}
							value={cert.description}
							onChange={(e) =>
								onCertificationChange(idx, "description", e.target.value)
							}
							minHeight={80}
						/>
					</FormField>
				</EntryCard>
			)}
		/>
	);
}
