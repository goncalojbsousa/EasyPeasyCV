"use client";

import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	BuilderToolbar,
	type NavigatorSection,
	SECTION_TITLE_KEYS,
} from "../../components/builder/builder_toolbar";
import {
	SectionStyleSheet,
	type StyleTarget,
} from "../../components/design/section_style_sheet";
import { AcademicEducation } from "../../components/features/academic_education";
import { Certifications } from "../../components/features/certifications";
import { CustomSectionCard } from "../../components/features/custom_sections";
import { Languages } from "../../components/features/languages";
import { PersonalInformation } from "../../components/features/personal_information";
import { ProfessionalExperience } from "../../components/features/professional_experience";
import { ProfessionalSummary } from "../../components/features/professional_summary";
import { Projects } from "../../components/features/projects";
import { TechnicalSkills } from "../../components/features/technical_skills";
import { VolunteerWork } from "../../components/features/volunteer";
import { Footer } from "../../components/layout/footer";
import { Navbar } from "../../components/layout/navbar";
import { LivePdfPane } from "../../components/live_pdf_pane";
import { PdfPreview } from "../../components/pdf/pdf_preview";
import { BottomActionBar } from "../../components/ui/bottom_action_bar";
import { FloatingActionBar } from "../../components/ui/floating_action_bar";
import { useToast } from "../../components/ui/toast";
import { useLanguage } from "../../contexts/LanguageContext";
import type {
	Certification,
	CustomField,
	CustomSection,
	CVType,
	CvColor,
	CvData,
	CvRenderSettings,
	CvTemplate,
	Education,
	Experience,
	Language,
	Link,
	Project,
	SectionControlProps,
	SectionKey,
	Volunteer,
} from "../../types/cv";
import {
	getRecommendedFields,
	isSectionFilled,
	type NavigableSectionKey,
	PERSONAL_INFO_KEY,
	type RecommendedField,
} from "../../utils/cv-completeness";
import {
	createEmptyCertification,
	createEmptyCustomField,
	createEmptyCustomSection,
	createEmptyEducation,
	createEmptyExperience,
	createEmptyLanguage,
	createEmptyProject,
	createEmptyVolunteer,
	customSectionKey,
	DEFAULT_COLOR,
	DEFAULT_PREDEFINED_SECTION_ORDER,
	DEFAULT_RENDER_SETTINGS,
	EMPTY_PERSONAL_INFO,
	hasCvContent,
	shouldAutoSaveCvData,
} from "../../utils/cv-data";
import { useCvProfiles } from "../../utils/useCvProfiles";
import { useIsMobile } from "../../utils/useIsMobile";
import {
	type ListState,
	moveItem,
	useListState,
} from "../../utils/useListState";
import { cvDataToXml, xmlToCvData } from "../../utils/xml";
import { EXAMPLE_CV } from "./example-data";

/**
 * Offset applied when scrolling a section into view: clears the fixed navbar
 * plus the sticky builder toolbar pinned beneath it.
 */
const HEADER_OFFSET_PX = 140;

function scrollToElement(element: HTMLElement | null) {
	if (!element) return;
	window.scrollTo({
		top: element.offsetTop - HEADER_OFFSET_PX,
		behavior: "smooth",
	});
}

/**
 * CV Builder page component
 * Owns the CV being edited and wires it to the form sections, the live
 * preview and the action bars.
 */
export default function Builder() {
	const { t, language, cvType, setCVType } = useLanguage();
	const isMobile = useIsMobile();

	// ---------------------------------------------------------------- CV state
	const [personalInfo, setPersonalInfo] = useState(EMPTY_PERSONAL_INFO);
	const [resume, setResume] = useState("");
	const [skills, setSkills] = useState("");
	const [selectedColor, setSelectedColor] = useState<CvColor>(DEFAULT_COLOR);
	/**
	 * Legacy theme of a loaded CV. Never set from the UI — it exists so a CV
	 * saved before the modular style system keeps rendering the same way and
	 * survives an XML round-trip.
	 */
	const [legacyTemplate, setLegacyTemplate] = useState<CvTemplate | undefined>(
		undefined,
	);
	const [renderSettings, setRenderSettings] = useState<CvRenderSettings>(
		DEFAULT_RENDER_SETTINGS,
	);
	const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(
		DEFAULT_PREDEFINED_SECTION_ORDER,
	);
	const [customSections, setCustomSections] = useState<CustomSection[]>([]);
	/** Area whose examples the form shows; stored with the profile. */
	const [examplesType, setExamplesType] = useState<CVType | undefined>();

	const links = useListState<Link>(() => ({ type: "LinkedIn", value: "" }));
	const experiences = useListState<Experience>(createEmptyExperience);
	const education = useListState<Education>(createEmptyEducation);
	const languages = useListState<Language>(createEmptyLanguage);
	const certifications = useListState<Certification>(createEmptyCertification);
	const projects = useListState<Project>(createEmptyProject);
	const volunteers = useListState<Volunteer>(createEmptyVolunteer);

	const [showPdfPreview, setShowPdfPreview] = useState(false);
	/** The section whose style shortcut is open, if any */
	const [styleTarget, setStyleTarget] = useState<StyleTarget | null>(null);

	// Refs for section elements to enable auto-scroll
	const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

	/**
	 * Collapsed sections, owned here (not by each section) so the navigator can
	 * show which ones are collapsed and expand a section when jumping to it.
	 */
	const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
		() => new Set(),
	);
	const setSectionCollapsed = (key: string, collapsed: boolean) =>
		setCollapsedSections((prev) => {
			if (prev.has(key) === collapsed) return prev;
			const next = new Set(prev);
			if (collapsed) next.add(key);
			else next.delete(key);
			return next;
		});

	const { showUndo, showNotice, toast } = useToast();

	/** The complete CV: the single value passed to preview, export and storage. */
	const cvData = useMemo<CvData>(
		() => ({
			personalInfo,
			links: links.items,
			resume,
			experiences: experiences.items,
			education: education.items,
			skills,
			languages: languages.items,
			certifications: certifications.items,
			projects: projects.items,
			volunteers: volunteers.items,
			customSections,
			template: legacyTemplate,
			color: selectedColor,
			sectionOrder,
			settings: renderSettings,
			cvType: examplesType,
		}),
		[
			personalInfo,
			links.items,
			resume,
			experiences.items,
			education.items,
			skills,
			languages.items,
			certifications.items,
			projects.items,
			volunteers.items,
			customSections,
			legacyTemplate,
			selectedColor,
			sectionOrder,
			renderSettings,
			examplesType,
		],
	);

	// The form's placeholders and labels follow the profile being edited.
	useEffect(() => setCVType(examplesType), [examplesType, setCVType]);

	const hasAnyContent = useMemo(() => hasCvContent(cvData), [cvData]);

	/** Load a stored/imported CV into the form state. */
	const applyCvData = useCallback(
		(data: CvData) => {
			setPersonalInfo({ ...EMPTY_PERSONAL_INFO, ...(data.personalInfo || {}) });
			links.set(data.links || []);
			setResume(data.resume || "");
			experiences.set(data.experiences || []);
			education.set(data.education || []);
			setSkills(data.skills || "");
			languages.set(data.languages || []);
			certifications.set(data.certifications || []);
			projects.set(data.projects || []);
			volunteers.set(data.volunteers || []);
			setLegacyTemplate(data.template);
			setSelectedColor(data.color || DEFAULT_COLOR);
			setRenderSettings(data.settings || DEFAULT_RENDER_SETTINGS);
			setExamplesType(data.cvType);

			const loadedCustomSections = data.customSections || [];
			setCustomSections(loadedCustomSections);

			// Custom sections always need an entry in the order, even for CVs saved
			// before they existed.
			const customKeys = loadedCustomSections.map((cs) =>
				customSectionKey(cs.id),
			);
			const storedOrder = data.sectionOrder?.length
				? data.sectionOrder
				: DEFAULT_PREDEFINED_SECTION_ORDER;
			setSectionOrder([
				...storedOrder,
				...customKeys.filter((key) => !storedOrder.includes(key)),
			]);
		},
		// The list setters are stable; listing them keeps the linter happy without
		// making this callback change on every keystroke.
		[
			links.set,
			experiences.set,
			education.set,
			languages.set,
			certifications.set,
			projects.set,
			volunteers.set,
		],
	);

	// ------------------------------------------------------------------ Profiles
	const profiles = useCvProfiles({
		data: cvData,
		applyData: applyCvData,
		onLoaded: useCallback(
			() => showNotice(t("data.loaded.from.browser")),
			[showNotice, t],
		),
		newProfileLabel: t("profile.new"),
		unnamedLabel: t("profile.unnamed"),
		copyLabel: useCallback(
			(sourceName: string) =>
				t("profile.copy.name").replace(
					"{name}",
					sourceName.trim() || t("profile.unnamed"),
				),
			[t],
		),
		shouldSave: shouldAutoSaveCvData,
	});

	// --------------------------------------------------------------- XML import
	const handleExportXml = () => {
		try {
			const blob = new Blob([cvDataToXml(cvData)], {
				type: "application/xml;charset=utf-8",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "cv-data.xml";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (e) {
			console.error("XML export failed", e);
		}
	};

	const handleImportXml = (xml: string) => {
		try {
			applyCvData(xmlToCvData(xml));
			showNotice(t("data.loaded.xml"));
		} catch (e) {
			console.error("XML import failed:", e);
			alert(t("data.import.error"));
		}
	};

	// Preload the PDF renderer so the first download is not delayed
	useEffect(() => {
		import("../../components/pdf/pdf_download_button").catch(() => {});
	}, []);

	// --------------------------------------------------------- Link-only handlers
	const handleAddLink = (
		type = "LinkedIn",
		value = "",
		customName?: string,
	) => {
		links.set([
			...links.items,
			{ type, value, ...(customName && { customName }) },
		]);
	};

	const handleToggleLinkLabel = (idx: number) =>
		links.update(idx, "hideLinkLabel", !links.items[idx]?.hideLinkLabel);

	// ------------------------------------------------------- Custom section CRUD
	const handleAddCustomSection = () => {
		const newSection = createEmptyCustomSection();
		const newKey = customSectionKey(newSection.id);
		setCustomSections((prev) => [...prev, newSection]);
		setSectionOrder((prev) => [...prev, newKey]);
		setTimeout(() => scrollToElement(sectionRefs.current[newKey]), 0);
	};

	const handleRemoveCustomSection = (sectionId: string) => {
		const key = customSectionKey(sectionId);
		const sectionIndex = customSections.findIndex((s) => s.id === sectionId);
		const removed = customSections[sectionIndex];
		const orderIndex = sectionOrder.indexOf(key);
		if (!removed) return;

		setCustomSections((prev) => prev.filter((s) => s.id !== sectionId));
		setSectionOrder((prev) => prev.filter((k) => k !== key));

		showUndo(t("undo.sectionRemoved"), () => {
			setCustomSections((prev) => {
				const next = [...prev];
				next.splice(Math.min(sectionIndex, next.length), 0, removed);
				return next;
			});
			setSectionOrder((prev) => {
				const next = [...prev];
				next.splice(Math.min(orderIndex, next.length), 0, key);
				return next;
			});
		});
	};

	/** Removes an entry from a list section, offering to put it back. */
	const removeWithUndo =
		<T,>(list: ListState<T>) =>
		(index: number) => {
			const removed = list.items[index];
			if (removed === undefined) return;
			list.remove(index);
			showUndo(t("undo.removed"), () => list.insert(index, removed));
		};

	/** Apply `patch` to one custom section, leaving the others untouched. */
	const patchCustomSection = (
		sectionId: string,
		patch: (section: CustomSection) => CustomSection,
	) =>
		setCustomSections((prev) =>
			prev.map((section) =>
				section.id === sectionId ? patch(section) : section,
			),
		);

	const handleUpdateCustomSectionTitle = (sectionId: string, value: string) =>
		patchCustomSection(sectionId, (section) => ({ ...section, title: value }));

	const handleAddCustomField = (sectionId: string) =>
		patchCustomSection(sectionId, (section) => ({
			...section,
			fields: [...section.fields, createEmptyCustomField()],
		}));

	const handleUpdateCustomField = (
		sectionId: string,
		fieldId: string,
		key: keyof Omit<CustomField, "id">,
		value: string | boolean,
	) =>
		patchCustomSection(sectionId, (section) => ({
			...section,
			fields: section.fields.map((field) =>
				field.id === fieldId ? { ...field, [key]: value } : field,
			),
		}));

	const handleRemoveCustomField = (sectionId: string, fieldId: string) => {
		const section = customSections.find((s) => s.id === sectionId);
		const fieldIndex = section?.fields.findIndex((f) => f.id === fieldId) ?? -1;
		const removed = section?.fields[fieldIndex];
		if (!removed) return;

		patchCustomSection(sectionId, (current) => ({
			...current,
			fields: current.fields.filter((field) => field.id !== fieldId),
		}));

		showUndo(t("undo.removed"), () =>
			patchCustomSection(sectionId, (current) => {
				const fields = [...current.fields];
				fields.splice(Math.min(fieldIndex, fields.length), 0, removed);
				return { ...current, fields };
			}),
		);
	};

	const handleReorderCustomFields = (
		sectionId: string,
		from: number,
		to: number,
	) =>
		patchCustomSection(sectionId, (section) => ({
			...section,
			fields: moveItem(section.fields, from, to),
		}));

	const handlePersonalInfoChange = (field: string, value: string) =>
		setPersonalInfo((prev) => ({ ...prev, [field]: value }));

	// ------------------------------------------------------------ Section order
	/** Swap a section with its neighbour and scroll to follow it. */
	const moveSection = (sectionKey: SectionKey, offset: -1 | 1) => {
		const index = sectionOrder.indexOf(sectionKey);
		const target = index + offset;
		if (index < 0 || target < 0 || target >= sectionOrder.length) return;

		setSectionOrder(moveItem(sectionOrder, index, target));
		// Wait for the DOM to reflect the new order before scrolling.
		setTimeout(() => scrollToElement(sectionRefs.current[sectionKey]), 0);
	};

	const handleResetSectionOrder = () =>
		setSectionOrder([
			...DEFAULT_PREDEFINED_SECTION_ORDER,
			...customSections.map((cs) => customSectionKey(cs.id)),
		]);

	// --------------------------------------------------------------- Navigation
	/** Scrolls to a section, expanding it first if it is collapsed. */
	const jumpToSection = (key: NavigableSectionKey) => {
		setSectionCollapsed(key, false);
		// Wait for the expanded content to be laid out before measuring.
		setTimeout(() => scrollToElement(sectionRefs.current[key]), 0);
	};

	/** Takes the user to a missing recommended field, focusing it when possible. */
	const jumpToField = (field: RecommendedField) => {
		jumpToSection(field.section);
		if (!field.inputId) return;
		const inputId = field.inputId;
		// Focus after the smooth scroll, so the browser does not jump abruptly.
		setTimeout(
			() => document.getElementById(inputId)?.focus({ preventScroll: true }),
			450,
		);
	};

	const sectionLabel = (key: NavigableSectionKey) => {
		if (key.startsWith("custom_")) {
			const section = customSections.find(
				(cs) => customSectionKey(cs.id) === key,
			);
			return section?.title || t("custom.section.default");
		}
		return t(SECTION_TITLE_KEYS[key] ?? key);
	};

	const toNavigatorSection = (key: NavigableSectionKey): NavigatorSection => ({
		key,
		label: sectionLabel(key),
		filled: isSectionFilled(key, cvData),
		collapsed: collapsedSections.has(key),
	});

	const recommendedFields = useMemo(
		() => getRecommendedFields(cvData),
		[cvData],
	);

	const enableCompactMode = () =>
		setRenderSettings((prev) => ({
			...prev,
			layout: { ...prev.layout, singlePageMode: true },
		}));

	// ------------------------------------------------------------------ PDF gate
	/** Guard shared by the download and preview actions. */
	const requireContent = (messageKey: string) => {
		if (hasAnyContent) return true;
		alert(t(messageKey));
		return false;
	};

	const handleGeneratePDF = () => requireContent("content.required.pdf");

	const handleShowPdfPreview = async () => {
		if (!requireContent("content.required.preview")) return;

		if (!isMobile) {
			setShowPdfPreview(true);
			return;
		}

		// Mobile browsers handle a real PDF tab better than an in-page viewer.
		try {
			const { pdf } = await import("@react-pdf/renderer");
			const { CvDocument } = await import("../../components/cv_document");
			const blob = await pdf(
				<CvDocument data={cvData} lang={language} />,
			).toBlob();
			const url = URL.createObjectURL(blob);
			window.open(url, "_blank");
			setTimeout(() => URL.revokeObjectURL(url), 1000);
		} catch (error) {
			console.error("Error generating PDF for mobile:", error);
			setShowPdfPreview(true);
		}
	};

	// ------------------------------------------------------------------ Sections
	/** Renders the section identified by `sectionKey` at its current position. */
	const renderSection = (sectionKey: SectionKey, index: number) => {
		const isCustom = sectionKey.startsWith("custom_");
		const reorder: SectionControlProps = {
			canReorder: true,
			onMoveUp: () => moveSection(sectionKey, -1),
			onMoveDown: () => moveSection(sectionKey, 1),
			canMoveUp: index > 0,
			canMoveDown: index < sectionOrder.length - 1,
			collapsed: collapsedSections.has(sectionKey),
			onToggleCollapsed: () =>
				setSectionCollapsed(sectionKey, !collapsedSections.has(sectionKey)),
			// Sections that have style variants get a shortcut to them; the
			// summary has none.
			...(sectionKey === "professional_summary"
				? {}
				: {
						// A custom section is targeted by its own key, so each one is
						// styled individually.
						onOpenStyle: () => setStyleTarget(sectionKey as StyleTarget),
					}),
			...(isCustom
				? {
						onRemove: () =>
							handleRemoveCustomSection(sectionKey.replace("custom_", "")),
					}
				: {}),
		};

		switch (sectionKey) {
			case "professional_summary":
				return (
					<ProfessionalSummary
						{...reorder}
						resume={resume}
						onResumeChange={setResume}
					/>
				);
			case "professional_experience":
				return (
					<ProfessionalExperience
						{...reorder}
						experiences={experiences.items}
						onExperienceChange={experiences.update}
						onAddExperience={experiences.add}
						onRemoveExperience={removeWithUndo(experiences)}
						onReorderExperiences={experiences.reorder}
					/>
				);
			case "academic_education":
				return (
					<AcademicEducation
						{...reorder}
						education={education.items}
						onEducationChange={education.update}
						onAddEducation={education.add}
						onRemoveEducation={removeWithUndo(education)}
						onReorderEducation={education.reorder}
					/>
				);
			case "technical_skills":
				return (
					<TechnicalSkills
						{...reorder}
						skills={skills}
						onSkillsChange={setSkills}
					/>
				);
			case "languages":
				return (
					<Languages
						{...reorder}
						languages={languages.items}
						onLanguageChange={languages.update}
						onAddLanguage={languages.add}
						onRemoveLanguage={removeWithUndo(languages)}
						onReorderLanguages={languages.reorder}
					/>
				);
			case "certifications":
				return (
					<Certifications
						{...reorder}
						certifications={certifications.items}
						onCertificationChange={certifications.update}
						onAddCertification={certifications.add}
						onRemoveCertification={removeWithUndo(certifications)}
						onReorderCertifications={certifications.reorder}
					/>
				);
			case "projects":
				return (
					<Projects
						{...reorder}
						projects={projects.items}
						onProjectChange={projects.update}
						onAddProject={projects.add}
						onRemoveProject={removeWithUndo(projects)}
						onReorderProjects={projects.reorder}
					/>
				);
			case "volunteer":
				return (
					<VolunteerWork
						{...reorder}
						volunteers={volunteers.items}
						onVolunteerChange={volunteers.update}
						onAddVolunteer={volunteers.add}
						onRemoveVolunteer={removeWithUndo(volunteers)}
						onReorderVolunteers={volunteers.reorder}
					/>
				);
			default: {
				const sectionId = sectionKey.replace("custom_", "");
				const section = customSections.find((cs) => cs.id === sectionId);
				if (!section) return null;
				return (
					<CustomSectionCard
						{...reorder}
						section={section}
						onTitleChange={(value) =>
							handleUpdateCustomSectionTitle(sectionId, value)
						}
						onAddField={() => handleAddCustomField(sectionId)}
						onFieldChange={(fieldId, key, value) =>
							handleUpdateCustomField(sectionId, fieldId, key, value)
						}
						onRemoveField={(fieldId) =>
							handleRemoveCustomField(sectionId, fieldId)
						}
						onReorderFields={(from, to) =>
							handleReorderCustomFields(sectionId, from, to)
						}
					/>
				);
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-zinc-900 transition-colors duration-300">
			<Navbar />

			<main
				id="main-content"
				className="w-full max-w-[1600px] 2xl:max-w-[1800px] mx-auto pt-24 pb-24 px-4 sm:px-6"
			>
				{/* Form + Live preview grid */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
					<div className="lg:col-span-6 flex flex-col gap-6 sm:gap-8">
						<BuilderToolbar
							fixedSection={toNavigatorSection(PERSONAL_INFO_KEY)}
							sections={sectionOrder.map(toNavigatorSection)}
							onJump={jumpToSection}
							onReorder={(from, to) =>
								setSectionOrder((prev) => moveItem(prev, from, to))
							}
							recommended={recommendedFields}
							onJumpToField={jumpToField}
							lastSavedAt={profiles.lastSavedAt}
							saveError={profiles.saveError}
							examplesType={cvType}
							onExamplesTypeChange={setExamplesType}
						/>

						{/* Personal Information is always first and cannot be reordered */}
						<div
							ref={(el) => {
								sectionRefs.current[PERSONAL_INFO_KEY] = el;
							}}
						>
							<PersonalInformation
								links={links.items}
								personalInfo={personalInfo}
								onAddLink={handleAddLink}
								onRemoveLink={removeWithUndo(links)}
								onPersonalInfoChange={handlePersonalInfoChange}
								onReorderLinks={links.reorder}
								onToggleLinkLabel={handleToggleLinkLabel}
								collapsed={collapsedSections.has(PERSONAL_INFO_KEY)}
								onToggleCollapsed={() =>
									setSectionCollapsed(
										PERSONAL_INFO_KEY,
										!collapsedSections.has(PERSONAL_INFO_KEY),
									)
								}
							/>
						</div>

						{sectionOrder.map((sectionKey, index) => (
							<div
								key={sectionKey}
								ref={(el) => {
									sectionRefs.current[sectionKey] = el;
								}}
							>
								{renderSection(sectionKey, index)}
							</div>
						))}

						{/* Add a custom section: another block at the end of the list */}
						<button
							onClick={handleAddCustomSection}
							className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 px-4 py-4 font-semibold text-gray-600 dark:text-gray-300 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 dark:hover:border-sky-600 dark:hover:bg-sky-900/10 dark:hover:text-sky-300 transition-colors"
							type="button"
						>
							<Plus className="w-5 h-5" />
							{t("custom.section.add")}
						</button>

						{/* Example data button (hidden in production) */}
						{process.env.NODE_ENV !== "production" && (
							<div className="w-full mt-8 mb-8 flex justify-center">
								<button
									onClick={() => applyCvData({ ...cvData, ...EXAMPLE_CV })}
									className="bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg text-sm sm:text-base w-full sm:w-auto"
									type="button"
								>
									{t("fill.example")}
								</button>
							</div>
						)}
					</div>

					{/* Live PDF Preview (desktop; smaller screens use the preview modal) */}
					<div className="hidden lg:block lg:col-span-6">
						{/* Stops above the floating action bar so the page is never covered */}
						<div className="sticky top-24 h-[calc(100vh-11rem)]">
							<LivePdfPane
								data={cvData}
								lang={language}
								onEnableCompactMode={enableCompactMode}
							/>
						</div>
					</div>
				</div>
			</main>

			<Footer />

			<PdfPreview
				data={cvData}
				show={showPdfPreview}
				onClose={() => setShowPdfPreview(false)}
				lang={language}
				onEnableCompactMode={enableCompactMode}
			/>

			{toast}

			{/* Style options for one section, opened from its own header */}
			<SectionStyleSheet
				target={styleTarget}
				customSectionTitle={
					styleTarget?.startsWith("custom_")
						? sectionLabel(styleTarget)
						: undefined
				}
				settings={renderSettings}
				onSettingsChange={setRenderSettings}
				color={selectedColor}
				onColorChange={setSelectedColor}
				legacyTemplate={legacyTemplate}
				onClose={() => setStyleTarget(null)}
			/>

			{/* Desktop action bar */}
			<BottomActionBar
				data={cvData}
				onColorChange={setSelectedColor}
				onSettingsChange={setRenderSettings}
				onResetSectionOrder={handleResetSectionOrder}
				onGeneratePDF={handleGeneratePDF}
				onShowSuccessMessage={() => showNotice(t("cv.generated"))}
				onExportXml={handleExportXml}
				onImportXml={handleImportXml}
				hasAnyContent={hasAnyContent}
				profiles={profiles.profiles}
				currentProfileId={profiles.currentProfileId}
				onCreateProfile={profiles.create}
				onDuplicateProfile={profiles.duplicate}
				onSwitchProfile={profiles.switchTo}
				onRenameProfile={profiles.rename}
				onDeleteProfile={profiles.remove}
			/>

			{/* Mobile/tablet action bar */}
			<FloatingActionBar
				data={cvData}
				onColorChange={setSelectedColor}
				onSettingsChange={setRenderSettings}
				onResetSectionOrder={handleResetSectionOrder}
				onShowPdfPreview={handleShowPdfPreview}
				onGeneratePDF={handleGeneratePDF}
				onShowSuccessMessage={() => showNotice(t("cv.generated"))}
				onExportXml={handleExportXml}
				onImportXml={handleImportXml}
				hasAnyContent={hasAnyContent}
				profiles={profiles.profiles}
				currentProfileId={profiles.currentProfileId}
				onCreateProfile={profiles.create}
				onDuplicateProfile={profiles.duplicate}
				onSwitchProfile={profiles.switchTo}
				onRenameProfile={profiles.rename}
				onDeleteProfile={profiles.remove}
			/>
		</div>
	);
}
