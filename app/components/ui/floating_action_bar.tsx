"use client";

import { Download, Eye, FileText, Grid2x2, Menu, X } from "lucide-react";
import { type JSX, useMemo, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type {
	Certification,
	CustomSection,
	CvColor,
	CvRenderSettings,
	CvTemplate,
	Education,
	Experience,
	Language,
	Link,
	PersonalInfo,
	Project,
	SectionKey,
	Volunteer,
} from "../../types/cv";
import PdfDownloadButton from "../pdf/pdf_download_button";
import { CompactCVTypeSelector } from "./compact_cv_type_selector";
import { LayoutControls } from "./layout_controls";
import { TemplateSelectorModal } from "./modals/template_selector_modal";
import { ThankYouModal } from "./modals/thank_you_modal";
import { SelectMenu, type SelectOption } from "./select_menu";

interface FloatingActionBarProps {
	personalInfo: PersonalInfo;
	links: Link[];
	resume: string;
	experiences: Experience[];
	education: Education[];
	skills: string;
	languages: Language[];
	certifications: Certification[];
	projects: Project[];
	volunteers: Volunteer[];
	customSections: CustomSection[];
	template: CvTemplate;
	color: CvColor;
	selectedColor: CvColor;
	onColorChange: (color: CvColor) => void;
	onTemplateChange?: (template: CvTemplate) => void;
	onShowPdfPreview: () => void;
	onGeneratePDF: () => boolean;
	onShowSuccessMessage: () => void;
	sectionOrder?: SectionKey[];
	settings?: CvRenderSettings;
	onSettingsChange?: (settings: CvRenderSettings) => void;
	onResetSectionOrder?: () => void;
	hasAnyContent?: boolean;
}

type LanguageCode = "en" | "pt" | "br" | "es";

export function FloatingActionBar({
	personalInfo,
	links,
	resume,
	experiences,
	education,
	skills,
	languages,
	certifications,
	projects,
	volunteers,
	customSections,
	template,
	color,
	selectedColor,
	onColorChange,
	onTemplateChange,
	onShowPdfPreview,
	onGeneratePDF,
	onShowSuccessMessage,
	sectionOrder,
	settings,
	onSettingsChange,
	onResetSectionOrder,
	hasAnyContent = false,
}: FloatingActionBarProps) {
	const { t, language } = useLanguage();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showTemplateModal, setShowTemplateModal] = useState(false);
	const [showLayoutModal, setShowLayoutModal] = useState(false);
	const [showThankYouModal, setShowThankYouModal] = useState(false);
	const [selectedLang, setSelectedLang] = useState<LanguageCode>(
		(language as LanguageCode) || "en",
	);
	const pdfButtonRefs = useRef<Record<string, { generatePdf: () => Promise<void> } | null>>({});
	const activeColor = selectedColor ?? color;

	const languageOptions: SelectOption<LanguageCode>[] = useMemo(
		() => [
			{
				value: "en",
				label: t("language.english"),
				searchText: "english inglês",
			},
			{
				value: "pt",
				label: t("language.portuguese"),
				searchText: "portuguese português",
			},
			{
				value: "br",
				label: t("language.brazilianPortuguese"),
				searchText: "brazilian português brasil",
			},
			{
				value: "es",
				label: t("language.spanish"),
				searchText: "spanish español espanhol",
			},
		],
		[t],
	);

	const handleSelectLanguage = async (lang: LanguageCode) => {
		if (!onGeneratePDF()) return;
		setSelectedLang(lang);
		// Chama diretamente o método generatePdf exposto pelo PdfDownloadButton
		if (pdfButtonRefs.current[lang] && typeof pdfButtonRefs.current[lang]?.generatePdf === 'function') {
			await pdfButtonRefs.current[lang]!.generatePdf();
		}
	};

	const flagIcons: Record<string, JSX.Element> = {
		en: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 32 32"
				className="w-5 h-5"
			>
				<title>English</title>
				<rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65" />
				<path
					d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z"
					fill="#fff"
				/>
				<path
					d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z"
					fill="#b92932"
				/>
				<path
					d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z"
					fill="#b92932"
				/>
				<path
					d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z"
					fill="#fff"
				/>
				<rect x="13" y="4" width="6" height="24" fill="#fff" />
				<rect x="1" y="13" width="30" height="6" fill="#fff" />
				<rect x="14" y="4" width="4" height="24" fill="#b92932" />
				<rect
					x="14"
					y="1"
					width="4"
					height="30"
					transform="translate(32) rotate(90)"
					fill="#b92932"
				/>
				<path
					d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z"
					fill="#b92932"
				/>
				<path
					d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z"
					fill="#b92932"
				/>
			</svg>
		),
		pt: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 32 32"
				className="w-5 h-5"
			>
				<title>Portuguese</title>
				<path
					d="M5,4H13V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
					fill="#2b6519"
				/>
				<path
					d="M16,4h15V28h-15c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
					transform="rotate(180 21.5 16)"
					fill="#ea3323"
				/>
				<path
					d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
					opacity=".15"
				/>
				<path
					d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
					fill="#fff"
					opacity=".2"
				/>
				<circle cx="12" cy="16" r="5" fill="#ff5" />
				<path
					d="M14.562,13.529l-5.125-.006v3.431h0c.004,.672,.271,1.307,.753,1.787,.491,.489,1.132,.759,1.805,.759,.684,0,1.328-.267,1.813-.75,.485-.484,.753-1.126,.753-1.808v-3.413Z"
					fill="#ea3323"
				/>
			</svg>
		),
		br: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 32 32"
				className="w-5 h-5"
			>
				<title>Brazilian Portuguese</title>
				<rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#459a45" />
				<path
					d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
					opacity=".15"
				/>
				<path
					d="M3.472,16l12.528,8,12.528-8-12.528-8L3.472,16Z"
					fill="#fedf00"
				/>
				<circle cx="16" cy="16" r="5" fill="#0a2172" />
				<path
					d="M14,14.5c-.997,0-1.958,.149-2.873,.409-.078,.35-.126,.71-.127,1.083,.944-.315,1.951-.493,2.999-.493,2.524,0,4.816,.996,6.519,2.608,.152-.326,.276-.666,.356-1.026-1.844-1.604-4.245-2.583-6.875-2.583Z"
					fill="#fff"
				/>
				<path
					d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
					fill="#fff"
					opacity=".2"
				/>
			</svg>
		),
		es: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 32 32"
				className="w-5 h-5"
			>
				<title>Spanish</title>
				<path fill="#f1c142" d="M1 10H31V22H1z" />
				<path
					d="M5,4H27c2.208,0,4,1.792,4,4v3H1v-3c0-2.208,1.792-4,4-4Z"
					fill="#a0251e"
				/>
				<path
					d="M5,21H27c2.208,0,4,1.792,4,4v3H1v-3c0-2.208,1.792-4,4-4Z"
					transform="rotate(180 16 24.5)"
					fill="#a0251e"
				/>
				<path
					d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
					opacity=".15"
				/>
				<path
					d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
					fill="#fff"
					opacity=".2"
				/>
			</svg>
		),
	};

	return (
		<>
			<div className="lg:hidden fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
				{isMenuOpen && (
					<div className="flex flex-col gap-2 mb-2">
						<SelectMenu
							options={languageOptions}
							value={selectedLang}
							placeholder={t("select.language.label")}
							onSelect={handleSelectLanguage}
							buttonClassName="bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 shadow-lg h-12 w-12 min-w-[48px] flex items-center justify-center transition-all !rounded-full !p-0"
							dropdownClassName="bottom-full mb-2 right-0"
							showChevron={false}
							renderOption={(option) => flagIcons[option.value]}
							renderTriggerLabel={() => <Download className="w-5 h-5" />}
						/>

						<div style={{ display: 'none' }}>
							{languageOptions.map((lang) => (
								<PdfDownloadButton
									key={lang.value}
									ref={(ref) => {
										if (ref) pdfButtonRefs.current[lang.value] = ref;
									}}
									personalInfo={personalInfo}
									links={links}
									resume={resume}
									experiences={experiences}
									education={education}
									skills={skills}
									languages={languages}
									certifications={certifications}
									projects={projects}
									volunteers={volunteers}
									customSections={customSections}
									lang={lang.value}
									template={template}
									color={activeColor}
									settings={settings}
									sectionOrder={sectionOrder}
									onPdfGenerated={() => {
										setShowThankYouModal(true);
										onShowSuccessMessage();
									}}
								/>
							))}
						</div>

						<button
							type="button"
							onClick={onShowPdfPreview}
							disabled={!hasAnyContent}
							className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-zinc-700 shadow-lg p-3 rounded-full h-12 w-12 flex items-center justify-center transition-all hover:shadow-xl"
							title={t("preview.cv")}
						>
							<Eye className="w-5 h-5" />
						</button>

						<button
							type="button"
							onClick={() => {
								setShowLayoutModal(true);
								setIsMenuOpen(false);
							}}
							className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 shadow-lg p-3 rounded-full h-12 w-12 flex items-center justify-center transition-all hover:shadow-xl"
							title={t("layout.menu.title")}
						>
							<Grid2x2 className="w-5 h-5" />
						</button>

						<button
							type="button"
							onClick={() => {
								setShowTemplateModal(true);
								setIsMenuOpen(false);
							}}
							className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 shadow-lg p-3 rounded-full h-12 w-12 flex items-center justify-center transition-all hover:shadow-xl"
							title={t("template.selector")}
						>
							<FileText className="w-5 h-5" />
						</button>

						<div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-lg p-2 rounded-full h-auto w-auto">
							<CompactCVTypeSelector />
						</div>
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

			{showTemplateModal && onTemplateChange && (
				<TemplateSelectorModal
					show={true}
					selectedTemplate={template}
					onSelect={(newTemplate: CvTemplate) => {
						onTemplateChange(newTemplate);
						setShowTemplateModal(false);
					}}
					onClose={() => setShowTemplateModal(false)}
				/>
			)}

			{showLayoutModal && settings && onSettingsChange && (
				<div
					className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-4"
					role="dialog"
					aria-modal="true"
					onClick={() => setShowLayoutModal(false)}
					tabIndex={-1}
					onKeyDown={(event) => {
						if (
							event.key === "Escape" ||
							event.key === "Enter" ||
							event.key === " "
						) {
							event.preventDefault();
							setShowLayoutModal(false);
						}
					}}
				>
					<div
						className="bg-white dark:bg-zinc-800 rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
						role="document"
						tabIndex={-1}
						onClick={(event) => event.stopPropagation()}
						onKeyDown={(event) => {
							event.stopPropagation();
							if (event.key === "Escape") setShowLayoutModal(false);
						}}
					>
						<div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								{t("layout.menu.controls")}
							</h2>
							<button
								type="button"
								onClick={() => setShowLayoutModal(false)}
								className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<LayoutControls
							t={t}
							settings={settings}
							selectedColor={activeColor}
							onColorChange={onColorChange}
							onSettingsChange={onSettingsChange}
							onResetSectionOrder={onResetSectionOrder}
						/>
					</div>
				</div>
			)}

			<ThankYouModal
				show={showThankYouModal}
				onClose={() => setShowThankYouModal(false)}
				personalInfo={personalInfo}
				experiences={experiences}
				education={education}
			/>
		</>
	);
}
