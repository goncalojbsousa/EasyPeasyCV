"use client";

import { GripVertical, Plus, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { Link, PersonalInfo } from "../../types/cv";
import { getCountryOptions } from "../../utils/countries";
import { PERSONAL_INPUT_IDS } from "../../utils/cv-completeness";
import { getLinkType, LINK_TYPES, stripLinkPrefix } from "../../utils/links";
import { DragHandle, SortableList } from "../dnd/sortable_list";
import { FormField } from "../ui/form_field";
import { FormSection } from "../ui/form_section";
import { Icons } from "../ui/icons";
import { SelectMenu } from "../ui/select_menu";
import { FIELD_CLASS, TextInput } from "../ui/text_input";

/**
 * Props interface for the PersonalInformation component
 */
interface PersonalInformationProps {
	/** Array of social media and portfolio links */
	links: Link[];
	/** Personal information data */
	personalInfo: PersonalInfo;
	/** Handler for adding new link */
	onAddLink: (type: string, value: string, customName?: string) => void;
	/** Handler for removing link */
	onRemoveLink: (idx: number) => void;
	/** Handler for updating personal information fields */
	onPersonalInfoChange: (field: string, value: string) => void;
	/** Handler for reordering links */
	onReorderLinks?: (fromIndex: number, toIndex: number) => void;
	/** Handler for toggling link label visibility */
	onToggleLinkLabel?: (idx: number) => void;
	/** Controlled collapsed state, owned by the builder page */
	collapsed?: boolean;
	onToggleCollapsed?: () => void;
}

/**
 * Personal Information component
 * Manages personal details, contact information, and social media links
 * @returns JSX element representing the personal information form section
 */
export function PersonalInformation({
	links,
	personalInfo,
	onAddLink,
	onRemoveLink,
	onPersonalInfoChange,
	onReorderLinks,
	onToggleLinkLabel,
	collapsed,
	onToggleCollapsed,
}: PersonalInformationProps) {
	const { t } = useLanguage();
	const [newLinkType, setNewLinkType] = useState("LinkedIn");
	const [newLinkValue, setNewLinkValue] = useState("");
	const [newLinkCustomName, setNewLinkCustomName] = useState("");
	const [linkError, setLinkError] = useState("");

	const newLinkPrefix = getLinkType(newLinkType).prefix;

	const handleAddLink = () => {
		if (!newLinkValue.trim()) return;

		const normalizedType = newLinkType.trim().toLowerCase();
		const candidateName =
			newLinkType === "Other"
				? newLinkCustomName.trim().toLowerCase()
				: newLinkType.trim().toLowerCase();

		const hasDuplicateTypeAndName = links.some((link) => {
			const currentType = (link.type || "").trim().toLowerCase();
			const currentName =
				link.type === "Other"
					? (link.customName || "").trim().toLowerCase()
					: (link.type || "").trim().toLowerCase();
			return currentType === normalizedType && currentName === candidateName;
		});

		if (hasDuplicateTypeAndName) {
			setLinkError(t("link.error.duplicate"));
			return;
		}

		setLinkError("");

		const fullValue = newLinkPrefix
			? `${newLinkPrefix}${newLinkValue}`
			: newLinkValue;

		onAddLink(
			newLinkType,
			fullValue,
			newLinkType === "Other" ? newLinkCustomName.trim() : undefined,
		);

		setNewLinkValue("");
		setNewLinkCustomName("");
	};

	const translateLinkType = useCallback(
		(type: string, customName?: string) => {
			// If it's "Other" type and has a custom name, return the custom name
			if (type === "Other" && customName) return customName;
			const config = LINK_TYPES.find((lt) => lt.label === type);
			return config ? t(config.labelKey) : type;
		},
		[t],
	);

	const countryOptions = useMemo(() => getCountryOptions(), []);

	const linkTypeOptions = useMemo(
		() =>
			LINK_TYPES.map((linkType) => ({
				value: linkType.label,
				label: t(linkType.labelKey),
			})),
		[t],
	);

	return (
		<form className="space-y-8">
			<FormSection
				title={t("section.personal.info")}
				icon={Icons.personalInfo}
				collapsed={collapsed}
				onToggleCollapsed={onToggleCollapsed}
			>
				{/* Name and desired role fields */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
					<FormField label={t("field.full.name")}>
						<TextInput
							id={PERSONAL_INPUT_IDS.name}
							placeholder={t("placeholder.full.name")}
							value={personalInfo.name}
							onChange={(e) => onPersonalInfoChange("name", e.target.value)}
						/>
					</FormField>
					<FormField label={t("cvType.field.desired.role")}>
						<TextInput
							id={PERSONAL_INPUT_IDS.desiredRole}
							placeholder={t("cvType.placeholder.desired.role")}
							value={personalInfo.desiredRole}
							onChange={(e) =>
								onPersonalInfoChange("desiredRole", e.target.value)
							}
						/>
					</FormField>
				</div>

				{/* Postal code and city: a code is short, a city name is not */}
				<div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 sm:gap-6 mb-4">
					<FormField label={t("field.postal.code")}>
						<TextInput
							placeholder={t("placeholder.postal.code")}
							value={personalInfo.postalCode}
							onChange={(e) =>
								onPersonalInfoChange("postalCode", e.target.value)
							}
						/>
					</FormField>
					<FormField label={t("field.city")}>
						<TextInput
							placeholder={t("placeholder.city")}
							value={personalInfo.city}
							onChange={(e) => onPersonalInfoChange("city", e.target.value)}
						/>
					</FormField>
				</div>

				{/* Email, country code, and phone fields */}
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)] gap-4 sm:gap-6 mb-6">
					<div className="sm:col-span-2 xl:col-span-1">
						<FormField label={t("field.email")}>
							<TextInput
								type="email"
								id={PERSONAL_INPUT_IDS.email}
								placeholder={t("placeholder.email")}
								value={personalInfo.email}
								onChange={(e) => onPersonalInfoChange("email", e.target.value)}
							/>
						</FormField>
					</div>
					<FormField label={t("field.country.code")}>
						<SelectMenu
							options={countryOptions}
							value={personalInfo.countryCode}
							placeholder={t("select.country")}
							onSelect={(country) =>
								onPersonalInfoChange("countryCode", country)
							}
							searchable
							searchPlaceholder={t("search.placeholder")}
							renderTriggerLabel={(option) =>
								option?.label || t("select.country")
							}
						/>
					</FormField>
					<FormField label={t("field.phone")}>
						<TextInput
							id={PERSONAL_INPUT_IDS.phone}
							placeholder={t("placeholder.phone")}
							value={personalInfo.phone}
							onChange={(e) => onPersonalInfoChange("phone", e.target.value)}
						/>
					</FormField>
				</div>

				{/* Social media and portfolio links section */}
				<div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
					<div className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
						{t("field.links.social")}
					</div>
					{links.length > 0 && (
						<div className="mb-4 space-y-2">
							<SortableList
								length={links.length}
								onReorder={(from, to) => onReorderLinks?.(from, to)}
								renderItem={(idx) => {
									const link = links[idx];
									return (
										<div
											key={idx}
											className="flex flex-col sm:flex-row sm:items-center gap-2 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm transition-all"
										>
											<div className="flex items-center gap-2 flex-1 min-w-0">
												{links.length > 1 && (
													<DragHandle
														ariaLabel="Reorder link"
														className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors duration-300 flex-shrink-0"
													>
														<GripVertical className="w-3 h-3" />
													</DragHandle>
												)}
												{!link.hideLinkLabel && (
													<span className="font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
														{translateLinkType(link.type, link.customName)}:
													</span>
												)}
												<span className="text-gray-600 dark:text-gray-400 truncate">
													{stripLinkPrefix(link.type, link.value)}
												</span>
											</div>
											<div className="flex items-center gap-2 sm:flex-shrink-0 ml-auto sm:ml-0">
												{onToggleLinkLabel && (
													<label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
														<input
															type="checkbox"
															checked={!!link.hideLinkLabel}
															onChange={() => onToggleLinkLabel(idx)}
															className="w-3 h-3 rounded border-gray-300 dark:border-zinc-600 text-sky-600 focus:ring-sky-500 focus:ring-offset-0 focus:ring-1"
														/>
														<span className="whitespace-nowrap">
															{t("field.link.hide.label")}
														</span>
													</label>
												)}
												<button
													type="button"
													onClick={() => onRemoveLink(idx)}
													className="text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 flex-shrink-0"
													aria-label="Remove link"
												>
													<X className="w-4 h-4" />
												</button>
											</div>
										</div>
									);
								}}
							/>
						</div>
					)}

					{/* Fixed input section for adding new links */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
						{/* Custom name input for "Other" type */}
						{newLinkType === "Other" && (
							<div className="lg:col-span-2">
								<label
									htmlFor="customLinkName"
									className="block text-sm font-medium mb-1"
								>
									{t("field.link.custom.name")}
								</label>
								<TextInput
									id="customLinkName"
									placeholder={t("placeholder.link.custom.name")}
									value={newLinkCustomName}
									onChange={(e) => setNewLinkCustomName(e.target.value)}
								/>
							</div>
						)}
						{/* Link type selection */}
						<div className="relative">
							<label
								htmlFor="linkTypeSelect"
								className="block text-sm font-medium mb-1"
							>
								{t("field.link.type")}
							</label>
							<SelectMenu
								options={linkTypeOptions}
								value={newLinkType}
								placeholder={t("field.link.type")}
								onSelect={(type) => {
									setNewLinkType(type);
									setLinkError("");
								}}
								renderTriggerLabel={(option) =>
									option?.label || t("field.link.type")
								}
							/>
						</div>

						{/* Link URL input with prefix */}
						<div className="flex flex-col sm:flex-row gap-2 items-end">
							<div className="flex-1 w-full">
								<label
									htmlFor="linkUrlInput"
									className="block text-sm font-medium mb-1"
								>
									{t("field.url")}
								</label>
								<div className="flex">
									{newLinkPrefix && (
										<span className="inline-flex items-center px-2 bg-gray-100 dark:bg-zinc-700 border border-r-0 border-gray-300 dark:border-zinc-600 rounded-l-lg text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
											{newLinkPrefix}
										</span>
									)}
									<input
										id="linkUrlInput"
										type="text"
										placeholder={t(getLinkType(newLinkType).placeholderKey)}
										value={newLinkValue}
										onChange={(e) => {
											setNewLinkValue(e.target.value);
											setLinkError("");
										}}
										onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
										className={`${FIELD_CLASS} ${newLinkPrefix ? "rounded-r-lg rounded-l-none" : ""}`}
									/>
								</div>
								{linkError && (
									<p className="mt-1 text-xs text-red-600 dark:text-red-400">
										{linkError}
									</p>
								)}
							</div>

							{/* Add link button */}
							<button
								type="button"
								onClick={handleAddLink}
								disabled={!newLinkValue.trim()}
								className="flex items-center justify-center w-10 h-10 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 dark:disabled:bg-zinc-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300 shadow-sm flex-shrink-0"
								aria-label="Add link"
							>
								<Plus className="w-4 h-4 sm:w-5 sm:h-5" />
							</button>
						</div>
					</div>
				</div>
			</FormSection>
		</form>
	);
}
