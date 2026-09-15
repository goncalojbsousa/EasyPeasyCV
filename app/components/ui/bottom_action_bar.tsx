"use client";

import { Database, FileText, Grid2x2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
	CvTypeMenu,
	PdfLanguageMenu,
	ProfileMenu,
	XmlDataMenu,
} from "../builder/action_menus";
import type { BuilderActions } from "../builder/builder_actions";
import { useBuilderDialogs } from "../builder/use_builder_dialogs";
import { CvTypeIcon } from "./cv_type_icon";
import { LayoutControls } from "./layout_controls";
import { PopoverMenu } from "./popover_menu";

type OpenMenu = null | "profile" | "cvType" | "layout" | "pdf" | "data";

/**
 * Hides the bar while the footer is on screen, so it never covers it.
 */
function useFooterVisible(): boolean {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (typeof IntersectionObserver === "undefined") return;
		const footer = document.querySelector("footer");
		if (!footer) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) setVisible(entry.isIntersecting);
			},
			{ root: null, threshold: 0 },
		);
		observer.observe(footer);
		return () => observer.disconnect();
	}, []);

	return visible;
}

/**
 * Desktop action bar: a floating toolbar that presents the builder actions as
 * anchored popovers. Shares its menu bodies with the mobile FloatingActionBar.
 */
export function BottomActionBar(props: BuilderActions) {
	const {
		data,
		onColorChange,
		onSettingsChange,
		onResetSectionOrder,
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
	const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
	const isFooterVisible = useFooterVisible();
	const {
		dialogs,
		openTemplatePicker,
		requestProfileDeletion,
		onPdfGenerated,
	} = useBuilderDialogs(props);

	const close = () => setOpenMenu(null);
	/** Wires one PopoverMenu into the single-open-menu state. */
	const menuState = (menu: Exclude<OpenMenu, null>) => ({
		open: openMenu === menu,
		onOpenChange: (open: boolean) => setOpenMenu(open ? menu : null),
	});

	const currentProfileName =
		profiles.find((p) => p.id === currentProfileId)?.name ??
		t("profile.unnamed");

	return (
		<>
			<div
				className={`hidden lg:flex fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all ${
					isFooterVisible
						? "opacity-0 pointer-events-none translate-y-2"
						: "opacity-100"
				}`}
			>
				<div className="inline-flex max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200/80 dark:border-zinc-700/60 shadow-xl ring-1 ring-black/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-zinc-900/50">
					<div className="px-2.5 py-2">
						<div className="overflow-x-auto overflow-y-visible no-scrollbar">
							<div className="inline-flex items-center gap-1.5 whitespace-nowrap min-w-max">
								<button
									type="button"
									onClick={openTemplatePicker}
									className="flex h-9 items-center gap-2 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shrink-0 shadow-sm"
									title={t("template.selector")}
								>
									<FileText className="w-4 h-4" />
									<span className="font-medium">
										{t(`template.${data.template ?? "professional"}.name`)}
									</span>
								</button>

								<PopoverMenu
									{...menuState("profile")}
									icon={<Users className="w-4 h-4" />}
									label={currentProfileName}
									panelTitle={t("profile.selector")}
									panelClassName="w-[260px] max-h-[60vh] overflow-auto"
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
											close();
										}}
										onDone={close}
									/>
								</PopoverMenu>

								<PopoverMenu
									{...menuState("cvType")}
									icon={<CvTypeIcon type={cvType} />}
									label={t(`cv.type.${cvType}`)}
									panelTitle={t("cv.type.selector")}
								>
									<CvTypeMenu onSelected={close} />
								</PopoverMenu>

								<Divider />

								<PopoverMenu
									{...menuState("layout")}
									icon={<Grid2x2 className="w-4 h-4" />}
									label={t("layout.menu.title")}
									panelTitle={t("layout.menu.controls")}
									panelClassName="w-[380px] max-w-[90vw] max-h-[70vh] overflow-y-auto overflow-x-hidden"
								>
									<LayoutControls
										settings={data.settings}
										selectedColor={data.color ?? "blue"}
										onColorChange={onColorChange}
										onSettingsChange={onSettingsChange}
										onResetSectionOrder={onResetSectionOrder}
									/>
								</PopoverMenu>

								<PopoverMenu
									{...menuState("pdf")}
									variant="primary"
									disabled={!hasAnyContent}
									icon={<FileText className="w-5 h-5" />}
									label={t("generate.ats.resume")}
									panelTitle={t("select.language.label")}
								>
									<PdfLanguageMenu
										data={data}
										onGeneratePDF={onGeneratePDF}
										onShowSuccessMessage={onShowSuccessMessage}
										onPdfGenerated={onPdfGenerated}
										onDone={close}
									/>
								</PopoverMenu>

								<Divider />

								<PopoverMenu
									{...menuState("data")}
									icon={<Database className="w-4 h-4" />}
									label={t("data.xml.title")}
								>
									<XmlDataMenu
										onExportXml={onExportXml}
										onImportXml={onImportXml}
										onDone={close}
									/>
								</PopoverMenu>
							</div>
						</div>
					</div>
				</div>
			</div>

			{dialogs}
		</>
	);
}

function Divider() {
	return (
		<span
			aria-hidden="true"
			className="mx-1.5 h-6 w-px bg-gray-300/50 dark:bg-zinc-600/50 rounded-full"
		/>
	);
}
