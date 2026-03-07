"use client";
import {
	BarChart2,
	BookOpen,
	Briefcase,
	Building,
	ChevronDown,
	ChevronRight,
	Code,
	Database,
	DollarSign,
	Download,
	Eye,
	FileText,
	Heart,
	Palette,
	Sparkles,
	TrendingUp,
	Upload,
	Users,
} from "lucide-react";
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CVType } from "../../contexts/LanguageContext";
import { useLanguage } from "../../contexts/LanguageContext";
import type {
	Certification,
	CvColor,
	CvRenderSettings,
	CvTemplate,
	Education,
	Experience,
	Language,
	Link,
	PersonalInfo,
	Project,
	Volunteer,
} from "../../types/cv";
import PdfDownloadButton from "../pdf/pdf_download_button";
import { ColorSelector } from "./color_selector";
import { FormSection } from "./form_section";
import { Icons } from "./icons";
import { TemplateSelectorModal } from "./modals/template_selector_modal";
import { ThankYouModal } from "./modals/thank_you_modal";

interface DesktopActionsCardProps {
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
	template?: CvTemplate;
	color?: CvColor;
	selectedTemplate: CvTemplate;
	selectedColor: CvColor;
	onTemplateChange: (template: CvTemplate) => void;
	onColorChange: (color: CvColor) => void;
	onShowPdfPreview: () => void;
	onGeneratePDF: () => boolean;
	onShowSuccessMessage: () => void;

	onScrollToCVTips: () => void;
	onScrollToAtsExplanation: () => void;
	onExportXml: () => void;
	onImportXml: (xml: string) => void;
	settings?: CvRenderSettings;
}

/**
 * Desktop Actions Card component
 * Fixed card on the right side of the screen for desktop view.
 * Contains the main action buttons for CV generation, preview, template/color selection, and extra features.
 * Handles dropdowns for CV type and language selection, and manages PDF generation and preview actions.
 */
export function DesktopActionsCard({
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
	template = "professional",
	color = "blue",
	selectedTemplate,
	selectedColor,
	onTemplateChange,
	onColorChange,
	onShowPdfPreview,
	onGeneratePDF,
	onShowSuccessMessage,

	onScrollToCVTips,
	onScrollToAtsExplanation,
	onExportXml,
	onImportXml,
	settings,
}: DesktopActionsCardProps) {
	const { t, cvType, setCVType } = useLanguage();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isCVTypeDropdownOpen, setIsCVTypeDropdownOpen] = useState(false);
	const [showThankYouModal, setShowThankYouModal] = useState(false);
	const [showTemplateModal, setShowTemplateModal] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const cvTypeDropdownRef = useRef<HTMLDivElement>(null);
	const [languageDropdownRect, setLanguageDropdownRect] =
		useState<DOMRect | null>(null);
	const [cvTypeDropdownRect, setCvTypeDropdownRect] = useState<DOMRect | null>(
		null,
	);
	const languagePortalRef = useRef<HTMLDivElement>(null);
	const cvTypePortalRef = useRef<HTMLDivElement>(null);
	const importInputRef = useRef<HTMLInputElement>(null);
	const dataDropdownRef = useRef<HTMLDivElement>(null);
	const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);
	const dataPortalRef = useRef<HTMLDivElement>(null);
	const [dataDropdownRect, setDataDropdownRect] = useState<DOMRect | null>(
		null,
	);

	// Effect to close dropdowns when clicking outside of them
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as Node;
			// Language dropdown (Generate PDF)
			if (isDropdownOpen) {
				const insideTrigger = dropdownRef.current?.contains(target);
				const insidePortal = languagePortalRef.current?.contains(target);
				if (!insideTrigger && !insidePortal) {
					setIsDropdownOpen(false);
				}
			}
			// CV Type dropdown
			if (isCVTypeDropdownOpen) {
				const insideTrigger = cvTypeDropdownRef.current?.contains(target);
				const insidePortal = cvTypePortalRef.current?.contains(target);
				if (!insideTrigger && !insidePortal) {
					setIsCVTypeDropdownOpen(false);
				}
			}
			// Data (Import/Export) dropdown
			if (isDataDropdownOpen) {
				const insideTrigger = dataDropdownRef.current?.contains(target);
				const insidePortal = dataPortalRef.current?.contains(target as Node);
				if (!insideTrigger && !insidePortal) {
					setIsDataDropdownOpen(false);
				}
			}
		}

		if (isDropdownOpen || isCVTypeDropdownOpen || isDataDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isDropdownOpen, isCVTypeDropdownOpen, isDataDropdownOpen]);

	// Keep portal positions synced with trigger rects while open
	useEffect(() => {
		if (isDropdownOpen && dropdownRef.current) {
			const rect = dropdownRef.current.getBoundingClientRect();
			setLanguageDropdownRect(rect);
		}
		if (isCVTypeDropdownOpen && cvTypeDropdownRef.current) {
			const rect = cvTypeDropdownRef.current.getBoundingClientRect();
			setCvTypeDropdownRect(rect);
		}
		if (isDataDropdownOpen && dataDropdownRef.current) {
			const rect = dataDropdownRef.current.getBoundingClientRect();
			setDataDropdownRect(rect);
		}
	}, [isDropdownOpen, isCVTypeDropdownOpen, isDataDropdownOpen]);

	// Reposition on resize/scroll while open
	useEffect(() => {
		if (!isDataDropdownOpen) return;
		const update = () => {
			if (dataDropdownRef.current) {
				setDataDropdownRect(dataDropdownRef.current.getBoundingClientRect());
			}
		};
		window.addEventListener("resize", update);
		window.addEventListener("scroll", update, true);
		return () => {
			window.removeEventListener("resize", update);
			window.removeEventListener("scroll", update, true);
		};
	}, [isDataDropdownOpen]);

	/**
	 * Returns the appropriate icon for each CV type.
	 * @param type - CV type string
	 */
	const getCVTypeIcon = (type: string) => {
		const icons: Record<string, JSX.Element> = {
			development: <Code className="w-4 h-4" />,
			marketing: <BarChart2 className="w-4 h-4" />,
			sales: <TrendingUp className="w-4 h-4" />,
			hr: <Users className="w-4 h-4" />,
			finance: <DollarSign className="w-4 h-4" />,
			design: <Palette className="w-4 h-4" />,
			health: <Heart className="w-4 h-4" />,
			education: <BookOpen className="w-4 h-4" />,
			admin: <Building className="w-4 h-4" />,
			other: <Briefcase className="w-4 h-4" />,
		};
		return icons[type as keyof typeof icons] || icons.other;
	};

	return (
		<div className="hidden lg:block w-80">
			<div className="sticky top-28 max-h-[calc(100vh-7rem)] overflow-y-auto">
				<div className="space-y-6 pr-2">
					{/* CV Actions Card */}
					<FormSection title={t("cv.actions")} icon={Icons.actions}>
						<div className="space-y-4">
							{/* Template Selector (Button opens modal) */}
							<div>
								<label
									htmlFor="templateSelectorBtn"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									{t("template.selector")}
								</label>
								<button
									type="button"
									id="templateSelectorBtn"
									onClick={() => setShowTemplateModal(true)}
									className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all text-left text-sm text-gray-900 dark:text-gray-100"
								>
									<span className="font-medium">
										{t(`template.${selectedTemplate}.name`)}
									</span>
									<ChevronRight className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
								</button>
							</div>

							<div>
								<label
									htmlFor="colorSelector"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									{t("color.selector")}
								</label>
								<ColorSelector
									selectedColor={selectedColor}
									onColorChange={onColorChange}
									show={true}
								/>
							</div>

							{/* CV Type Selector */}
							<div className="relative" ref={cvTypeDropdownRef}>
								<label
									htmlFor="cvTypeSelector"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									{t("cv.type.selector")}
								</label>
								<button
									type="button"
									id="cvTypeSelector"
									onClick={() => setIsCVTypeDropdownOpen(!isCVTypeDropdownOpen)}
									className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all text-left text-sm text-gray-900 dark:text-gray-100"
								>
									<div className="flex items-center gap-2">
										{getCVTypeIcon(cvType)}
										<span className="font-medium">
											{t(`cv.type.${cvType}`)}
										</span>
									</div>
									<ChevronDown
										className={`w-4 h-4 text-gray-400 dark:text-zinc-500 transition-transform duration-200 ${isCVTypeDropdownOpen ? "rotate-180" : ""}`}
									/>
								</button>

								{/* CV Type Dropdown */}
								{isCVTypeDropdownOpen &&
									typeof document !== "undefined" &&
									cvTypeDropdownRect &&
									createPortal(
										<div
											ref={cvTypePortalRef}
											className="fixed bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200/80 dark:border-zinc-700/60 py-2 z-[1000]"
											style={{
												top: cvTypeDropdownRect.bottom + 8,
												left: cvTypeDropdownRect.left,
												width: cvTypeDropdownRect.width,
											}}
										>
											<div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">
												{t("cv.type.selector")}
											</div>
											<div className="py-1 max-h-[60vh] overflow-auto">
												{[
													"development",
													"marketing",
													"sales",
													"hr",
													"finance",
													"design",
													"health",
													"education",
													"admin",
													"other",
												].map((type) => (
													<button
														type="button"
														key={type}
														onClick={() => {
															setCVType(type as CVType);
															setIsCVTypeDropdownOpen(false);
														}}
														className={`w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-300 ${cvType === type ? "bg-sky-50 dark:bg-sky-900/20 font-semibold text-sky-700 dark:text-sky-400" : ""}`}
													>
														{getCVTypeIcon(type)}
														<span className="font-medium text-sm">
															{t(`cv.type.${type}`)}
														</span>
													</button>
												))}
											</div>
										</div>,
										document.body,
									)}
							</div>

							{/* Preview Button */}
							<button
								type="button"
								onClick={onShowPdfPreview}
								className="w-full bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-700 active:bg-green-800 transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
							>
								<Eye className="w-5 h-5" />
								{t("preview.cv")}
							</button>

							{/* Generate PDF Button with Dropdown */}
							<div className="relative" ref={dropdownRef}>
								<button
									type="button"
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									className="w-full bg-sky-600 text-white px-4 py-3 rounded-xl text-[15px] font-semibold hover:bg-sky-700 active:bg-sky-800 transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
								>
									<FileText className="w-5 h-5" />
									{t("generate.ats.resume")}
									<ChevronDown
										className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
									/>
								</button>

								{isDropdownOpen &&
									typeof document !== "undefined" &&
									languageDropdownRect &&
									createPortal(
										<div
											ref={languagePortalRef}
											className="fixed bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2 z-[1000] max-h-[60vh] overflow-auto"
											style={{
												top: languageDropdownRect.bottom + 8,
												left: languageDropdownRect.left,
												minWidth: languageDropdownRect.width,
											}}
										>
											<div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">
												{t("select.language.label")}
											</div>
											<div className="py-1 flex flex-col">
												<PdfDownloadButton
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
													lang="en"
													template={template}
													color={color}
													settings={settings}
													onPdfGenerated={() => setShowThankYouModal(true)}
												>
													<button
														type="button"
														className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer w-full"
														onClick={(e) => {
															if (!onGeneratePDF()) {
																e.preventDefault();
																e.stopPropagation();
															} else {
																setTimeout(() => {
																	setIsDropdownOpen(false);
																	onShowSuccessMessage();
																}, 100);
															}
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															viewBox="0 0 32 32"
															className="w-6 h-6 shrink-0"
														>
															<title>Brazil Flag</title>
															<rect
																x="1"
																y="4"
																width="30"
																height="24"
																rx="4"
																ry="4"
																fill="#071b65"
															></rect>
															<path
																d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L2.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z"
																fill="#fff"
															></path>
															<path
																d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z"
																fill="#b92932"
															></path>
															<path
																d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z"
																fill="#b92932"
															></path>
															<path
																d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z"
																fill="#fff"
															></path>
															<rect
																x="13"
																y="4"
																width="6"
																height="24"
																fill="#fff"
															></rect>
															<rect
																x="1"
																y="13"
																width="30"
																height="6"
																fill="#fff"
															></rect>
															<rect
																x="14"
																y="4"
																width="4"
																height="24"
																fill="#b92932"
															></rect>
															<rect
																x="14"
																y="1"
																width="4"
																height="30"
																transform="translate(32) rotate(90)"
																fill="#b92932"
															></rect>
															<path
																d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z"
																fill="#b92932"
															></path>
															<path
																d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z"
																fill="#b92932"
															></path>
															<path
																d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
																opacity=".15"
															></path>
															<path
																d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
																fill="#fff"
																opacity=".2"
															></path>
														</svg>
														<span className="font-medium text-sm whitespace-nowrap">
															{t("language.english")}
														</span>
													</button>
												</PdfDownloadButton>
												<PdfDownloadButton
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
													lang="pt"
													template={template}
													color={color}
													settings={settings}
													onPdfGenerated={() => setShowThankYouModal(true)}
												>
													<button
														type="button"
														className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer w-full"
														onClick={(e) => {
															if (!onGeneratePDF()) {
																e.preventDefault();
																e.stopPropagation();
															} else {
																setTimeout(() => {
																	setIsDropdownOpen(false);
																	onShowSuccessMessage();
																}, 100);
															}
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															viewBox="0 0 32 32"
															className="w-6 h-6 shrink-0"
														>
															<title>Portuguese CV Download</title>
															<title>Portuguese flag</title>
															<path
																d="M5,4H13V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
																fill="#2b6519"
															></path>
															<path
																d="M16,4h15V28h-15c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
																transform="rotate(180 21.5 16)"
																fill="#ea3323"
															></path>
															<path
																d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
																opacity=".15"
															></path>
															<path
																d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
																fill="#fff"
																opacity=".2"
															></path>
															<circle
																cx="12"
																cy="16"
																r="5"
																fill="#ff5"
															></circle>
															<path
																d="M14.562,13.529l-5.125-.006v3.431h0c.004,.672,.271,1.307,.753,1.787,.491,.489,1.132,.759,1.805,.759,.684,0,1.328-.267,1.813-.75,.485-.484,.753-1.126,.753-1.808v-3.413Z"
																fill="#ea3323"
															></path>
														</svg>
														<span className="font-medium text-sm whitespace-nowrap">
															{t("language.portuguese")}
														</span>
													</button>
												</PdfDownloadButton>
												<PdfDownloadButton
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
													lang="br"
													template={template}
													color={color}
													settings={settings}
													onPdfGenerated={() => setShowThankYouModal(true)}
												>
													<button
														type="button"
														className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer w-full"
														onClick={(e) => {
															if (!onGeneratePDF()) {
																e.preventDefault();
																e.stopPropagation();
															} else {
																setTimeout(() => {
																	setIsDropdownOpen(false);
																	onShowSuccessMessage();
																}, 100);
															}
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															viewBox="0 0 32 32"
															className="w-6 h-6 shrink-0"
														>
															<title>Brazilian Portuguese CV Download</title>
															<title>Brazilian flag</title>
															<rect
																x="1"
																y="4"
																width="30"
																height="24"
																rx="4"
																ry="4"
																fill="#459a45"
															></rect>
															<path
																d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
																opacity=".15"
															></path>
															<path
																d="M3.472,16l12.528,8,12.528-8-12.528-8L3.472,16Z"
																fill="#fedf00"
															></path>
															<circle
																cx="16"
																cy="16"
																r="5"
																fill="#0a2172"
															></circle>
															<path
																d="M14,14.5c-.997,0-1.958,.149-2.873,.409-.078,.35-.126,.71-.127,1.083,.944-.315,1.951-.493,2.999-.493,2.583,0,4.816,.996,6.519,2.608,.152-.326,.276-.666,.356-1.026-1.844-1.604-4.245-2.583-6.875-2.583Z"
																fill="#fff"
															></path>
															<path
																d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
																fill="#fff"
																opacity=".2"
															></path>
														</svg>
														<span className="font-medium text-sm whitespace-nowrap">
															{t("language.brazilianPortuguese")}
														</span>
													</button>
												</PdfDownloadButton>
												<PdfDownloadButton
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
													lang="es"
													template={template}
													color={color}
													settings={settings}
													onPdfGenerated={() => setShowThankYouModal(true)}
												>
													<button
														type="button"
														className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer w-full"
														onClick={(e) => {
															if (!onGeneratePDF()) {
																e.preventDefault();
																e.stopPropagation();
															} else {
																setTimeout(() => {
																	setIsDropdownOpen(false);
																	onShowSuccessMessage();
																}, 100);
															}
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															viewBox="0 0 32 32"
															className="w-6 h-6 shrink-0"
														>
															<title>Spanish CV Download</title>
															<title>Spanish flag</title>
															<rect
																x="1"
																y="4"
																width="30"
																height="24"
																rx="4"
																ry="4"
																fill="#c60b1e"
															></rect>
															<rect
																x="1"
																y="10"
																width="30"
																height="12"
																fill="#ffc400"
															></rect>
															<rect
																x="1"
																y="4"
																width="30"
																height="24"
																rx="4"
																ry="4"
																fill="none"
																stroke="#000"
																opacity=".1"
															></rect>
														</svg>
														<span className="font-medium text-sm whitespace-nowrap">
															{t("language.spanish")}
														</span>
													</button>
												</PdfDownloadButton>
											</div>
										</div>,
										document.body,
									)}
							</div>
						</div>
						{/* Separator between CV options and extra actions */}
						<div className="my-4 border-t border-gray-200 dark:border-zinc-700" />

						{/* Extra actions moved here from the removed Extra Features Card */}
						<div className="space-y-4">
							{/* Job Analysis Button */}
							<button
								type="button"
								className="w-full bg-sky-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-sky-700 active:bg-sky-800 transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
								title={t("job.analysis.action.description")}
							>
								<Sparkles className="w-5 h-5" />
								{t("job.analysis.action.button")}
							</button>

							{/* ATS Explanation Button */}
							<button
								type="button"
								onClick={onScrollToAtsExplanation}
								className="w-full bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-700 active:bg-green-800 transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
								title={t("ats.explanation.action.description")}
							>
								<Sparkles className="w-5 h-5" />
								{t("ats.explanation.action.button")}
							</button>

							{/* CV Tips Button */}
							<button
								type="button"
								onClick={onScrollToCVTips}
								className="w-full bg-sky-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-sky-700 active:bg-sky-800 transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
								title={t("cv.tips.action.description")}
							>
								<Sparkles className="w-5 h-5" />
								{t("cv.tips.action.button")}
							</button>

							{/* Data: Import/Export dropdown */}
							<div className="relative mt-2" ref={dataDropdownRef}>
								<button
									type="button"
									onClick={() => setIsDataDropdownOpen((v) => !v)}
									className="w-full bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-gray-100 px-4 py-3 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-zinc-600 active:bg-gray-400/70 dark:active:bg-zinc-500 transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
									title={t("data.xml.title")}
								>
									<Database className="w-5 h-5" />
									{t("data.xml.title")}
									<ChevronDown
										className={`w-4 h-4 transition-transform duration-200 ${isDataDropdownOpen ? "rotate-180" : ""}`}
									/>
								</button>
								{isDataDropdownOpen &&
									dataDropdownRect &&
									createPortal(
										<div
											ref={dataPortalRef}
											className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2 z-[9999] animate-fade-in"
											style={{
												position: "fixed",
												top: dataDropdownRect.bottom + 8,
												left: dataDropdownRect.left,
												width: dataDropdownRect.width,
											}}
										>
											<div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">
												{t("data.xml.title")}
											</div>
											<button
												type="button"
												className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 flex items-center gap-2"
												onClick={() => {
													setIsDataDropdownOpen(false);
													onExportXml();
												}}
											>
												<Download className="w-4 h-4" />
												<span>{t("data.xml.export")}</span>
											</button>
											<input
												ref={importInputRef}
												type="file"
												accept=".xml,application/xml,text/xml"
												className="hidden"
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (!file) return;
													const reader = new FileReader();
													reader.onload = () => {
														const text =
															typeof reader.result === "string"
																? reader.result
																: "";
														if (text) onImportXml(text);
														if (importInputRef.current)
															importInputRef.current.value = "";
														setIsDataDropdownOpen(false);
													};
													reader.readAsText(file);
												}}
											/>
											<button
												type="button"
												className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-300 flex items-center gap-2"
												onClick={() => {
													importInputRef.current?.click();
												}}
											>
												<Upload className="w-4 h-4" />
												<span>{t("data.xml.import")}</span>
											</button>
										</div>,
										document.body,
									)}
							</div>
						</div>
					</FormSection>
				</div>
			</div>

			{/* Template Selector Modal */}
			<TemplateSelectorModal
				show={showTemplateModal}
				selectedTemplate={selectedTemplate}
				onSelect={(tpl) => {
					onTemplateChange(tpl);
				}}
				onClose={() => setShowTemplateModal(false)}
			/>

			{/* Thank You Modal */}
			<ThankYouModal
				show={showThankYouModal}
				onClose={() => setShowThankYouModal(false)}
				personalInfo={personalInfo}
				experiences={experiences}
				education={education}
			/>
		</div>
	);
}
