"use client";

import {
	Check,
	Copy,
	Download,
	Pencil,
	Plus,
	Trash2,
	Upload,
	Users,
	X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { CVType, CvData } from "../../types/cv";
import { CV_TYPES } from "../../utils/cv-types";
import type { CvProfileMeta } from "../../utils/useCvProfiles";
import PdfDownloadButton, {
	type PdfDownloadButtonHandle,
} from "../pdf/pdf_download_button";
import { CvTypeIcon } from "../ui/cv_type_icon";
import { FlagIcon, LANGUAGE_OPTIONS } from "../ui/flags";
import { MenuItem } from "../ui/popover_menu";
import { FIELD_CLASS } from "../ui/text_input";

/**
 * The menu bodies shared by the desktop action bar and the mobile action
 * sheet. Each one owns its own behaviour, so the two bars only decide *where*
 * to show them (an anchored popover vs. a bottom sheet).
 */

const ICON_BUTTON =
	"inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700";

// ---------------------------------------------------------------- CV type menu

export function CvTypeMenu({
	value,
	onSelect,
}: {
	value: CVType;
	onSelect: (type: CVType) => void;
}) {
	const { t } = useLanguage();

	return (
		<div className="py-1">
			{CV_TYPES.map((type) => (
				<MenuItem
					key={type}
					icon={<CvTypeIcon type={type} />}
					selected={value === type}
					onClick={() => onSelect(type)}
				>
					{t(`cv.type.${type}`)}
				</MenuItem>
			))}
		</div>
	);
}

// ------------------------------------------------------------- XML data menu

export function XmlDataMenu({
	onExportXml,
	onImportXml,
	onDone,
}: {
	onExportXml: () => void;
	onImportXml: (xml: string) => void;
	onDone?: () => void;
}) {
	const { t } = useLanguage();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFile = (file: File) => {
		const reader = new FileReader();
		reader.onload = () => {
			const text = typeof reader.result === "string" ? reader.result : "";
			if (!text) return;
			onImportXml(text);
			if (fileInputRef.current) fileInputRef.current.value = "";
			onDone?.();
		};
		reader.readAsText(file, "UTF-8");
	};

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				accept=".xml,application/xml,text/xml"
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file) handleFile(file);
				}}
			/>
			<MenuItem
				icon={<Download className="w-4 h-4" />}
				onClick={() => {
					onDone?.();
					onExportXml();
				}}
			>
				{t("data.xml.export")}
			</MenuItem>
			<MenuItem
				icon={<Upload className="w-4 h-4" />}
				onClick={() => fileInputRef.current?.click()}
			>
				{t("data.xml.import")}
			</MenuItem>
		</>
	);
}

// ------------------------------------------------------- PDF-by-language menu

export function PdfLanguageMenu({
	data,
	onGeneratePDF,
	onShowSuccessMessage,
	onPdfGenerated,
	onDone,
}: {
	data: CvData;
	onGeneratePDF: () => boolean;
	onShowSuccessMessage: () => void;
	onPdfGenerated: () => void;
	onDone?: () => void;
}) {
	const { t } = useLanguage();
	const buttonRefs = useRef<Record<string, PdfDownloadButtonHandle | null>>({});

	const download = async (code: string) => {
		if (!onGeneratePDF()) return;
		await buttonRefs.current[code]?.generatePdf();
		onDone?.();
		onShowSuccessMessage();
	};

	return (
		<div className="py-1 flex flex-col">
			{LANGUAGE_OPTIONS.map((option) => (
				<MenuItem
					key={option.code}
					icon={<FlagIcon code={option.code} className="w-6 h-6" />}
					onClick={() => download(option.code)}
				>
					{t(option.labelKey)}
				</MenuItem>
			))}

			{/* Renderers are kept mounted but hidden; each is driven via its ref. */}
			<div className="hidden">
				{LANGUAGE_OPTIONS.map((option) => (
					<PdfDownloadButton
						key={option.code}
						ref={(ref) => {
							buttonRefs.current[option.code] = ref;
						}}
						data={data}
						lang={option.code}
						onPdfGenerated={onPdfGenerated}
					/>
				))}
			</div>
		</div>
	);
}

// ---------------------------------------------------------------- Profile menu

interface ProfileMenuProps {
	profiles: CvProfileMeta[];
	currentProfileId: string | null;
	onCreateProfile: () => void;
	onDuplicateProfile: (profileId: string) => void;
	onSwitchProfile: (profileId: string) => void;
	onRenameProfile: (profileId: string, nextName: string) => void;
	/** Asks the host to confirm deletion; the host owns the confirm dialog. */
	onRequestDelete: (profile: { id: string; name: string }) => void;
	onDone?: () => void;
}

export function ProfileMenu({
	profiles,
	currentProfileId,
	onCreateProfile,
	onDuplicateProfile,
	onSwitchProfile,
	onRenameProfile,
	onRequestDelete,
	onDone,
}: ProfileMenuProps) {
	const { t } = useLanguage();
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");

	// Deleting the last profile would leave the builder in an empty state.
	const canDelete = profiles.length >= 2;

	const stopEditing = () => {
		setEditingId(null);
		setEditingName("");
	};

	const confirmRename = () => {
		const trimmed = editingName.trim();
		if (!editingId || !trimmed) return;
		onRenameProfile(editingId, trimmed);
		stopEditing();
	};

	return (
		<>
			<div className="px-2 py-2">
				{canDelete && (
					<div className="px-1 pb-2 text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
						{t("profile.manage")}
					</div>
				)}
				<div className="space-y-1">
					{profiles.map((profile) => {
						const profileName = profile.name || t("profile.unnamed");
						const isCurrent = currentProfileId === profile.id;

						if (editingId === profile.id) {
							return (
								<div
									key={profile.id}
									className="flex items-center gap-1.5 rounded-md border border-sky-200 dark:border-sky-800/60 bg-sky-50/60 dark:bg-sky-900/20 px-2 py-1.5"
								>
									<input
										type="text"
										value={editingName}
										onChange={(e) => setEditingName(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												confirmRename();
											}
											if (e.key === "Escape") {
												e.preventDefault();
												stopEditing();
											}
										}}
										className={`${FIELD_CLASS} min-w-0 flex-1 px-2 py-1`}
									/>
									<button
										type="button"
										onClick={confirmRename}
										disabled={editingName.trim() === ""}
										title={t("profile.rename.save")}
										className="inline-flex h-7 w-7 items-center justify-center rounded-md text-sky-700 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40 disabled:opacity-40 disabled:cursor-not-allowed"
									>
										<Check className="h-4 w-4" />
									</button>
									<button
										type="button"
										onClick={stopEditing}
										title={t("profile.rename.cancel")}
										className={ICON_BUTTON}
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							);
						}

						return (
							<div
								key={profile.id}
								className={`flex items-center gap-1.5 rounded-md px-1 py-1 ${
									isCurrent
										? "bg-sky-50 dark:bg-sky-900/20"
										: "hover:bg-gray-50 dark:hover:bg-zinc-700/60"
								}`}
							>
								<button
									type="button"
									onClick={() => {
										onSwitchProfile(profile.id);
										onDone?.();
									}}
									className={`min-w-0 flex-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 dark:text-gray-300 ${
										isCurrent
											? "font-semibold text-sky-700 dark:text-sky-400"
											: ""
									}`}
								>
									<Users className="w-4 h-4 shrink-0" />
									<span className="truncate">{profileName}</span>
								</button>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										onDuplicateProfile(profile.id);
										onDone?.();
									}}
									title={t("profile.copy")}
									className={ICON_BUTTON}
								>
									<Copy className="h-4 w-4" />
								</button>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										setEditingId(profile.id);
										setEditingName(profileName);
									}}
									title={t("profile.rename")}
									className={ICON_BUTTON}
								>
									<Pencil className="h-4 w-4" />
								</button>
								{canDelete && (
									<button
										type="button"
										onClick={() =>
											onRequestDelete({ id: profile.id, name: profileName })
										}
										title={t("profile.delete")}
										className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								)}
							</div>
						);
					})}
				</div>
			</div>
			<button
				type="button"
				onClick={() => {
					onCreateProfile();
					onDone?.();
				}}
				className="w-full flex items-center gap-2 px-3 py-2 text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 border-t border-gray-100 dark:border-zinc-700 mt-1"
			>
				<Plus className="w-4 h-4" />
				<span className="font-semibold text-sm">{t("profile.new")}</span>
			</button>
		</>
	);
}
