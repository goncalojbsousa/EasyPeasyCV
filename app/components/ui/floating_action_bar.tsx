"use client";

import {
	Database,
	Download,
	Eye,
	FileText,
	Grid2x2,
	Menu,
	Users,
	X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
	CvTypeMenu,
	PdfLanguageMenu,
	ProfileMenu,
	XmlDataMenu,
} from "../builder/action_menus";
import type { BuilderActions } from "../builder/builder_actions";
import { useBuilderDialogs } from "../builder/use_builder_dialogs";
import { BottomSheet } from "./bottom_sheet";
import { CvTypeIcon } from "./cv_type_icon";
import { LayoutControls } from "./layout_controls";

type Sheet = null | "profile" | "cvType" | "layout" | "pdf" | "data";

interface FloatingActionBarProps extends BuilderActions {
	/** Opens the full preview (a PDF tab on mobile, a modal otherwise) */
	onShowPdfPreview: () => void;
}

const FAB_CLASS =
	"bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-zinc-700 shadow-lg p-3 rounded-full h-12 w-12 flex items-center justify-center transition-all hover:shadow-xl";

/**
 * Mobile/tablet action bar: an expanding FAB stack whose entries open the same
 * menus the desktop BottomActionBar shows in popovers, presented as bottom
 * sheets instead.
 */
export function FloatingActionBar(props: FloatingActionBarProps) {
	const {
		data,
		onColorChange,
		onSettingsChange,
		onResetSectionOrder,
		onShowPdfPreview,
		onGeneratePDF,
		onShowSuccessMessage,
		onExportXml,
		onImportXml,
		hasAnyContent,
		profiles,
		currentProfileId,
		onCreateProfile,
		onDuplicateProfile,
		onSwitchProfile,
		onRenameProfile,
	} = props;

	const { t, cvType } = useLanguage();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [sheet, setSheet] = useState<Sheet>(null);
	const {
		dialogs,
		openTemplatePicker,
		requestProfileDeletion,
		onPdfGenerated,
	} = useBuilderDialogs(props);

	const closeSheet = () => setSheet(null);

	/** FAB that opens a bottom sheet, collapsing the stack on the way. */
	const sheetButton = (
		target: Exclude<Sheet, null>,
		title: string,
		icon: ReactNode,
		disabled = false,
	) => (
		<button
			type="button"
			disabled={disabled}
			onClick={() => {
				setSheet(target);
				setIsMenuOpen(false);
			}}
			className={FAB_CLASS}
			title={title}
		>
			{icon}
		</button>
	);

	return (
		<>
			<div className="lg:hidden fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
				{isMenuOpen && (
					<div className="flex flex-col gap-2 mb-2">
						{sheetButton(
							"pdf",
							t("generate.ats.resume"),
							<Download className="w-5 h-5" />,
							!hasAnyContent,
						)}

						<button
							type="button"
							onClick={onShowPdfPreview}
							disabled={!hasAnyContent}
							className={FAB_CLASS}
							title={t("preview.cv")}
						>
							<Eye className="w-5 h-5" />
						</button>

						{sheetButton(
							"layout",
							t("layout.menu.title"),
							<Grid2x2 className="w-5 h-5" />,
						)}

						<button
							type="button"
							onClick={() => {
								openTemplatePicker();
								setIsMenuOpen(false);
							}}
							className={FAB_CLASS}
							title={t("template.selector")}
						>
							<FileText className="w-5 h-5" />
						</button>

						{sheetButton(
							"profile",
							t("profile.selector"),
							<Users className="w-5 h-5" />,
						)}

						{sheetButton(
							"data",
							t("data.xml.title"),
							<Database className="w-5 h-5" />,
						)}

						{sheetButton(
							"cvType",
							t("cv.type.selector"),
							<CvTypeIcon type={cvType} className="w-5 h-5" />,
						)}
					</div>
				)}

				<button
					type="button"
					onClick={() => setIsMenuOpen((open) => !open)}
					className="bg-sky-600 hover:bg-sky-700 text-white shadow-xl hover:shadow-2xl p-3 rounded-full h-14 w-14 flex items-center justify-center transition-all active:scale-95"
					title={isMenuOpen ? t("close") : "Menu"}
				>
					{isMenuOpen ? (
						<X className="w-6 h-6" />
					) : (
						<Menu className="w-6 h-6" />
					)}
				</button>
			</div>

			<BottomSheet
				show={sheet === "pdf"}
				title={t("select.language.label")}
				onClose={closeSheet}
				maxWidthClassName="max-w-sm"
			>
				<PdfLanguageMenu
					data={data}
					onGeneratePDF={onGeneratePDF}
					onShowSuccessMessage={onShowSuccessMessage}
					onPdfGenerated={onPdfGenerated}
					onDone={closeSheet}
				/>
			</BottomSheet>

			<BottomSheet
				show={sheet === "layout"}
				title={t("layout.menu.controls")}
				onClose={closeSheet}
			>
				<LayoutControls
					settings={data.settings}
					selectedColor={data.color ?? "blue"}
					onColorChange={onColorChange}
					onSettingsChange={onSettingsChange}
					onResetSectionOrder={onResetSectionOrder}
				/>
			</BottomSheet>

			<BottomSheet
				show={sheet === "profile"}
				title={t("profile.selector")}
				onClose={closeSheet}
				maxWidthClassName="max-w-sm"
			>
				<ProfileMenu
					profiles={profiles}
					currentProfileId={currentProfileId}
					onCreateProfile={onCreateProfile}
					onDuplicateProfile={onDuplicateProfile}
					onSwitchProfile={onSwitchProfile}
					onRenameProfile={onRenameProfile}
					onRequestDelete={(profile) => {
						requestProfileDeletion(profile);
						closeSheet();
					}}
					onDone={closeSheet}
				/>
			</BottomSheet>

			<BottomSheet
				show={sheet === "data"}
				title={t("data.xml.title")}
				onClose={closeSheet}
				maxWidthClassName="max-w-sm"
			>
				<XmlDataMenu
					onExportXml={onExportXml}
					onImportXml={onImportXml}
					onDone={closeSheet}
				/>
			</BottomSheet>

			<BottomSheet
				show={sheet === "cvType"}
				title={t("cv.type.selector")}
				onClose={closeSheet}
				maxWidthClassName="max-w-sm"
			>
				<CvTypeMenu onSelected={closeSheet} />
			</BottomSheet>

			{dialogs}
		</>
	);
}
