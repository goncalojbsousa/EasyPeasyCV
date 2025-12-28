"use client";

import {
	BarChart3,
	BookOpen,
	Building,
	ChevronDown,
	Code,
	Database,
	DollarSign,
	Download,
	FileText,
	Grid2x2,
	Heart,
	Package,
	Palette,
	TrendingUp,
	Upload,
	Users,
} from "lucide-react";
import type { JSX, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CVType } from "../../contexts/LanguageContext";
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
	Volunteer,
} from "../../types/cv";
import { useAnchorPosition } from "../../utils/useAnchorPosition";
import PdfDownloadButton from "../pdf/pdf_download_button";
import { LayoutControls } from "./layout_controls";
import { TemplateSelectorModal } from "./modals/template_selector_modal";
import { ThankYouModal } from "./modals/thank_you_modal";

interface BottomActionBarProps {
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
	selectedTemplate: CvTemplate;
	selectedColor: CvColor;
	onTemplateChange: (template: CvTemplate) => void;
	onColorChange: (color: CvColor) => void;
	onGeneratePDF: () => boolean;
	onShowSuccessMessage: () => void;
	onExportXml: () => void;
	onImportXml: (xml: string) => void;
	settings?: CvRenderSettings;
	onSettingsChange?: (s: CvRenderSettings) => void;
	onResetSectionOrder?: () => void;
	sectionOrder?: import("../../types/cv").SectionKey[];
	hasAnyContent?: boolean;
}

export function BottomActionBar({
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
	sectionOrder,
	selectedTemplate,
	selectedColor,
	onTemplateChange,
	onColorChange,
	onGeneratePDF,
	onShowSuccessMessage,
	onExportXml,
	onImportXml,
	settings,
	onSettingsChange,
	onResetSectionOrder,
	hasAnyContent = false,
}: BottomActionBarProps) {
	const { t, cvType, setCVType } = useLanguage();

	const [openMenu, setOpenMenu] = useState<
		null | "lang" | "cvType" | "data" | "layout"
	>(null);
	const [showThankYouModal, setShowThankYouModal] = useState(false);
	const [showTemplateModal, setShowTemplateModal] = useState(false);
	const [isFooterVisible, setIsFooterVisible] = useState(false);

	const langRef = useRef<HTMLDivElement>(null);
	const cvTypeRef = useRef<HTMLDivElement>(null);
	const dataRef = useRef<HTMLDivElement>(null);
	const cvTypeBtnRef = useRef<HTMLButtonElement>(null);
	const langBtnRef = useRef<HTMLButtonElement>(null);
	const dataBtnRef = useRef<HTMLButtonElement>(null);
	const importInputRef = useRef<HTMLInputElement>(null);
	const layoutBtnRef = useRef<HTMLButtonElement>(null);
	const layoutPortalRef = useRef<HTMLDivElement>(null);
	const cvTypePortalRef = useRef<HTMLDivElement>(null);
	const langPortalRef = useRef<HTMLDivElement>(null);
	const dataPortalRef = useRef<HTMLDivElement>(null);
	const cvTypes: CVType[] = [
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
	];

	useEffect(() => {
		const onDocClick = (e: Event) => {
			if (!openMenu) return;
			const mouseEvent = e as unknown as MouseEvent;
			const target = mouseEvent.target as Node;
			const targetEl = target instanceof Element ? target : null;
			const inCvType = !!(
				cvTypeBtnRef.current?.contains(target) ||
				cvTypePortalRef.current?.contains(target)
			);
			const inLang = !!(
				langBtnRef.current?.contains(target) ||
				langPortalRef.current?.contains(target)
			);
			const inData = !!(
				dataBtnRef.current?.contains(target) ||
				dataPortalRef.current?.contains(target)
			);
			const inLayout = !!(
				layoutBtnRef.current?.contains(target) ||
				layoutPortalRef.current?.contains(target)
			);
			const inColorSelector = targetEl?.closest(
				'[data-color-selector-portal="true"]',
			);
			const insideAny =
				inCvType || inLang || inData || inLayout || !!inColorSelector;
			if (!insideAny) setOpenMenu(null);
		};
		document.addEventListener("click", onDocClick);
		return () => document.removeEventListener("click", onDocClick);
	}, [openMenu]);

	// Hide bar when footer is visible to avoid overlapping it
	useEffect(() => {
		if (typeof IntersectionObserver === "undefined") return;
		const footerEl = document.querySelector("footer");
		if (!footerEl) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					setIsFooterVisible(entry.isIntersecting);
				}
			},
			{ root: null, threshold: 0 },
		);
		observer.observe(footerEl);
		return () => observer.disconnect();
	}, []);

	const cvTypePos = useAnchorPosition(cvTypeBtnRef, openMenu === "cvType");
	const langPos = useAnchorPosition(langBtnRef, openMenu === "lang");
	const dataPos = useAnchorPosition(dataBtnRef, openMenu === "data");
	const layoutPos = useAnchorPosition(layoutBtnRef, openMenu === "layout");

	const getCVTypeIcon = useMemo(
		() => (type: string) => {
			const icons: Record<string, JSX.Element> = {
				development: <Code className="w-4 h-4" />,
				marketing: <BarChart3 className="w-4 h-4" />,
				sales: <TrendingUp className="w-4 h-4" />,
				hr: <Users className="w-4 h-4" />,
				finance: <DollarSign className="w-4 h-4" />,
				design: <Palette className="w-4 h-4" />,
				health: <Heart className="w-4 h-4" />,
				education: <BookOpen className="w-4 h-4" />,
				admin: <Building className="w-4 h-4" />,
				other: <Package className="w-4 h-4" />,
			};
			return icons[type as keyof typeof icons] || icons.other;
		},
		[],
	);

	const PdfDownloadButtonWithValidation = ({
		lang,
		children,
	}: {
		lang: string;
		children: ReactNode;
	}) => {
		const pdfButtonRef = useRef<{ generatePdf: () => Promise<void> }>(null);

		const handleClick = async (e: MouseEvent | KeyboardEvent) => {
			if (!onGeneratePDF()) {
				e.preventDefault();
				e.stopPropagation();
			} else {
				// Call the PDF generation method
				if (pdfButtonRef.current) {
					await pdfButtonRef.current.generatePdf();
				}
				setTimeout(() => {
					setOpenMenu(null);
					onShowSuccessMessage();
				}, 100);
			}
		};
		const handlePdfGenerated = () => setShowThankYouModal(true);
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				handleClick(e);
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				handleClick(e);
			}
		};

		return (
			<button
				type="button"
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				onKeyUp={handleKeyUp}
				className="text-left"
			>
				<PdfDownloadButton
					ref={pdfButtonRef}
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
					lang={lang}
					template={selectedTemplate}
					color={selectedColor}
					settings={settings}
					sectionOrder={sectionOrder}
					onPdfGenerated={handlePdfGenerated}
				>
					{children}
				</PdfDownloadButton>
			</button>
		);
	};

	const languageOptions = useMemo(
		() => [
			{
				code: "en",
				labelKey: "language.english",
				icon: (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 32 32"
						className="w-6 h-6"
					>
						<title>English</title>
						<rect
							x="1"
							y="4"
							width="30"
							height="24"
							rx="4"
							ry="4"
							fill="#071b65"
						/>
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
			},
			{
				code: "pt",
				labelKey: "language.portuguese",
				icon: (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 32 32"
						className="w-6 h-6"
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
			},
			{
				code: "br",
				labelKey: "language.brazilianPortuguese",
				icon: (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 32 32"
						className="w-6 h-6"
					>
						<title>Brazilian Portuguese</title>
						<rect
							x="1"
							y="4"
							width="30"
							height="24"
							rx="4"
							ry="4"
							fill="#459a45"
						/>
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
			},
			{
				code: "es",
				labelKey: "language.spanish",
				icon: (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 32 32"
						className="w-6 h-6"
					>
						<title>Spanish</title>
						<rect
							x="1"
							y="4"
							width="30"
							height="24"
							rx="4"
							ry="4"
							fill="#c60b1e"
						/>
						<rect x="1" y="10" width="30" height="12" fill="#ffc400" />
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
						/>
					</svg>
				),
			},
		],
		[],
	);

	return (
		<>
			<div
				className={`hidden lg:flex fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all ${isFooterVisible ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100"}`}
			>
				<div className="inline-flex max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200/80 dark:border-zinc-700/60 shadow-xl ring-1 ring-black/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-zinc-900/50">
					<div className="px-2.5 py-2">
						<div className="overflow-x-auto overflow-y-visible no-scrollbar">
							<div className="inline-flex items-center gap-1.5 whitespace-nowrap min-w-max">
								<button
									type="button"
									onClick={() => setShowTemplateModal(true)}
									className="flex h-9 items-center gap-2 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shrink-0 shadow-sm"
									title={t("template.selector")}
								>
									<FileText className="w-4 h-4" />
									<span className="font-medium">
										{t(`template.${selectedTemplate}.name`)}
									</span>
								</button>

								<div
									className="relative shrink-0 overflow-visible"
									ref={cvTypeRef}
								>
									<button
										type="button"
										ref={cvTypeBtnRef}
										onClick={() =>
											setOpenMenu((prev) =>
												prev === "cvType" ? null : "cvType",
											)
										}
										className="flex h-9 items-center gap-2 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
										title={t("cv.type.selector")}
									>
										{getCVTypeIcon(cvType)}
										<span className="font-medium">
											{t(`cv.type.${cvType}`)}
										</span>
										<ChevronDown
											className={`w-4 h-4 transition-transform ${openMenu === "cvType" ? "rotate-180" : ""}`}
										/>
									</button>
									{openMenu === "cvType" &&
										cvTypePos &&
										createPortal(
											// biome-ignore lint/a11y/noStaticElementInteractions: Portal container needs to prevent event propagation
											<div
												ref={cvTypePortalRef}
												role="presentation"
												className="z-[70] w-[260px] max-h-[60vh] overflow-auto bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2"
												onMouseDown={(e) => e.stopPropagation()}
												style={{
													position: "fixed",
													left: cvTypePos.left,
													top: cvTypePos.top - 8,
													transform: "translateY(-100%)",
												}}
											>
												<div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">
													{t("cv.type.selector")}
												</div>
												<div className="py-1">
													{cvTypes.map((type) => (
														<button
															type="button"
															key={type}
															onClick={() => {
																setCVType(type);
																setOpenMenu(null);
															}}
															className={`w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 ${cvType === type ? "bg-sky-50 dark:bg-sky-900/20 font-semibold text-sky-700 dark:text-sky-400" : ""}`}
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

								<span
									aria-hidden="true"
									className="mx-1.5 h-6 w-px bg-gray-300/50 dark:bg-zinc-600/50 rounded-full"
								/>

								<div className="relative shrink-0 overflow-visible">
									<button
										type="button"
										ref={layoutBtnRef}
										onClick={(e) => {
											e.stopPropagation();
											setOpenMenu((prev) =>
												prev === "layout" ? null : "layout",
											);
										}}
										className="flex h-9 items-center gap-2 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
										title={t("layout.menu.title")}
									>
										<Grid2x2 className="w-4 h-4" />
										<span className="font-medium">
											{t("layout.menu.title")}
										</span>
										<ChevronDown
											className={`w-4 h-4 transition-transform ${openMenu === "layout" ? "rotate-180" : ""}`}
										/>
									</button>
									{openMenu === "layout" &&
										layoutPos &&
										createPortal(
											// biome-ignore lint/a11y/noStaticElementInteractions: Portal container needs to prevent event propagation
											<div
												ref={layoutPortalRef}
												role="presentation"
												className="z-[90] w-[380px] max-w-[90vw] max-h-[70vh] overflow-y-auto overflow-x-hidden bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2"
												onMouseDown={(e) => e.stopPropagation()}
												onClick={(e) => e.stopPropagation()}
												style={{
													position: "fixed",
													left: layoutPos.left,
													top: layoutPos.top - 8,
													transform: "translateY(-100%)",
												}}
											>
												<div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">
													{t("layout.menu.controls")}
												</div>
												<LayoutControls
													t={t}
													settings={settings}
													selectedColor={selectedColor}
													onColorChange={onColorChange}
													onSettingsChange={onSettingsChange}
													onResetSectionOrder={onResetSectionOrder}
												/>
											</div>,
											document.body,
										)}
								</div>

								<div
									className="relative shrink-0 overflow-visible"
									ref={langRef}
								>
									<button
										type="button"
										ref={langBtnRef}
										onClick={() =>
											setOpenMenu((prev) => (prev === "lang" ? null : "lang"))
										}
										disabled={!hasAnyContent}
										className="h-9 bg-sky-600 text-white px-3 rounded-md text-[15px] font-semibold hover:bg-sky-700 active:bg-sky-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 shadow-sm ring-1 ring-sky-500/20"
										title={t("generate.ats.resume")}
									>
										<FileText className="w-5 h-5" />
										{t("generate.ats.resume")}
										<ChevronDown
											className={`w-4 h-4 transition-transform ${openMenu === "lang" ? "rotate-180" : ""}`}
										/>
									</button>
									{openMenu === "lang" &&
										langPos &&
										createPortal(
											// biome-ignore lint/a11y/noStaticElementInteractions: Portal container needs to prevent event propagation
											<div
												ref={langPortalRef}
												role="presentation"
												className="z-[70] w-[260px] max-h-[60vh] overflow-auto bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2"
												onMouseDown={(e) => e.stopPropagation()}
												style={{
													position: "fixed",
													left: langPos.left,
													top: langPos.top - 8,
													transform: "translateY(-100%)",
												}}
											>
												<div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">
													{t("select.language")}
												</div>
												<div className="py-1">
													{languageOptions.map((opt) => (
														<PdfDownloadButtonWithValidation
															key={opt.code}
															lang={opt.code}
														>
															<div className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer text-left">
																{opt.icon}
																<span className="font-medium text-sm">
																	{t(opt.labelKey)}
																</span>
															</div>
														</PdfDownloadButtonWithValidation>
													))}
												</div>
											</div>,
											document.body,
										)}
								</div>

								<span
									aria-hidden="true"
									className="mx-1.5 h-6 w-px bg-gray-300/50 dark:bg-zinc-600/50 rounded-full"
								/>

								<div
									className="relative shrink-0 overflow-visible"
									ref={dataRef}
								>
									{/* Input FORA do portal */}
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
												if (text) {
													onImportXml(text);
													if (importInputRef.current)
														importInputRef.current.value = "";
													setOpenMenu(null);
												}
											};

											reader.readAsText(file, "UTF-8");
										}}
									/>

									<button
										type="button"
										ref={dataBtnRef}
										onClick={() =>
											setOpenMenu((prev) => (prev === "data" ? null : "data"))
										}
										className="flex h-9 items-center gap-2 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
										title={t("data.xml.title")}
									>
										<Database className="w-4 h-4" />
										<span className="font-medium">{t("data.xml.title")}</span>
										<ChevronDown
											className={`w-4 h-4 transition-transform ${openMenu === "data" ? "rotate-180" : ""}`}
										/>
									</button>
									{openMenu === "data" &&
										dataPos &&
										createPortal(
											// biome-ignore lint/a11y/noStaticElementInteractions: Portal container needs to prevent event propagation
											<div
												ref={dataPortalRef}
												role="presentation"
												className="z-[70] w-[260px] max-h-[60vh] overflow-auto bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2"
												onMouseDown={(e) => e.stopPropagation()}
												style={{
													position: "fixed",
													left: dataPos.left,
													top: dataPos.top - 8,
													transform: "translateY(-100%)",
												}}
											>
												<div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">
													{t("data.xml.title")}
												</div>
												<button
													type="button"
													className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 flex items-center gap-2"
													onClick={() => {
														setOpenMenu(null);
														onExportXml();
													}}
												>
													<Download className="w-4 h-4" />
													<span>{t("data.xml.export")}</span>
												</button>
												<button
													type="button"
													className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 flex items-center gap-2"
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
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
						</div>
					</div>
				</div>
			</div>

			<TemplateSelectorModal
				show={showTemplateModal}
				selectedTemplate={selectedTemplate}
				onSelect={(tpl) => {
					onTemplateChange(tpl);
					setShowTemplateModal(false);
				}}
				onClose={() => setShowTemplateModal(false)}
			/>

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
