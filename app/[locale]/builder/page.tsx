"use client";

import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AtsExplanation } from "../../components/ats_explanation";
import { CVTips } from "../../components/cv_tips";
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
import { useLanguage } from "../../contexts/LanguageContext";
import type {
	Certification,
	CustomField,
	CustomSection,
	CvColor,
	CvData,
	CvRenderSettings,
	CvTemplate,
	Education,
	Experience,
	Language,
	Link,
	Project,
	SectionKey,
	SectionReorderProps,
	Volunteer,
} from "../../types/cv";
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
	DEFAULT_TEMPLATE,
	EMPTY_PERSONAL_INFO,
	hasCvContent,
	shouldAutoSaveCvData,
} from "../../utils/cv-data";
import { useCvProfiles } from "../../utils/useCvProfiles";
import { useIsMobile } from "../../utils/useIsMobile";
import { moveItem, useListState } from "../../utils/useListState";
import { cvDataToXml, xmlToCvData } from "../../utils/xml";
import { EXAMPLE_CV } from "./example-data";

/** Offset applied when scrolling a section into view, to clear the sticky header. */
const HEADER_OFFSET_PX = 115;

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
	const { t, language } = useLanguage();
	const isMobile = useIsMobile();

	// ---------------------------------------------------------------- CV state
	const [personalInfo, setPersonalInfo] = useState(EMPTY_PERSONAL_INFO);
	const [resume, setResume] = useState("");
	const [skills, setSkills] = useState("");
	const [selectedTemplate, setSelectedTemplate] =
		useState<CvTemplate>(DEFAULT_TEMPLATE);
	const [selectedColor, setSelectedColor] = useState<CvColor>(DEFAULT_COLOR);
	const [renderSettings, setRenderSettings] = useState<CvRenderSettings>(
		DEFAULT_RENDER_SETTINGS,
	);
	const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(
		DEFAULT_PREDEFINED_SECTION_ORDER,
	);
	const [customSections, setCustomSections] = useState<CustomSection[]>([]);

	const links = useListState<Link>(() => ({ type: "LinkedIn", value: "" }));
	const experiences = useListState<Experience>(createEmptyExperience);
	const education = useListState<Education>(createEmptyEducation);
	const languages = useListState<Language>(createEmptyLanguage);
	const certifications = useListState<Certification>(createEmptyCertification);
	const projects = useListState<Project>(createEmptyProject);
	const volunteers = useListState<Volunteer>(createEmptyVolunteer);

	// ------------------------------------------------------------- Page notices
	const [dataLoadedSource, setDataLoadedSource] = useState<
		"local" | "xml" | null
	>(null);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [showPdfPreview, setShowPdfPreview] = useState(false);

	// Refs for section elements to enable auto-scroll
	const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
			template: selectedTemplate,
			color: selectedColor,
			sectionOrder,
			settings: renderSettings,
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
			selectedTemplate,
			selectedColor,
			sectionOrder,
			renderSettings,
		],
	);

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
			setSelectedTemplate(data.template || DEFAULT_TEMPLATE);
			setSelectedColor(data.color || DEFAULT_COLOR);
			setRenderSettings(data.settings || DEFAULT_RENDER_SETTINGS);

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
		onLoaded: useCallback(() => {
			setDataLoaded(true);
			setDataLoadedSource("local");
		}, []),
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
			setDataLoaded(true);
			setDataLoadedSource("xml");
		} catch (e) {
			console.error("XML import failed:", e);
			alert(t("data.import.error"));
		}
	};

	// ------------------------------------------------------------------- Notices
	useEffect(() => {
		if (!dataLoaded) return;
		const timer = setTimeout(() => setDataLoaded(false), 5000);
		return () => clearTimeout(timer);
	}, [dataLoaded]);

	useEffect(() => {
		if (!showSuccessMessage) return;
		const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
		return () => clearTimeout(timer);
	}, [showSuccessMessage]);

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
		setCustomSections((prev) => prev.filter((s) => s.id !== sectionId));
		setSectionOrder((prev) => prev.filter((k) => k !== key));
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

	const handleRemoveCustomField = (sectionId: string, fieldId: string) =>
		patchCustomSection(sectionId, (section) => ({
			...section,
			fields: section.fields.filter((field) => field.id !== fieldId),
		}));

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
		const reorder: SectionReorderProps = {
			canReorder: true,
			onMoveUp: () => moveSection(sectionKey, -1),
			onMoveDown: () => moveSection(sectionKey, 1),
			canMoveUp: index > 0,
			canMoveDown: index < sectionOrder.length - 1,
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
						onRemoveExperience={experiences.remove}
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
						onRemoveEducation={education.remove}
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
						onRemoveLanguage={languages.remove}
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
						onRemoveCertification={certifications.remove}
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
						onRemoveProject={projects.remove}
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
						onRemoveVolunteer={volunteers.remove}
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
						onRemoveSection={() => handleRemoveCustomSection(sectionId)}
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
						{dataLoaded && (
							<Notice
								message={
									dataLoadedSource === "xml"
										? t("data.loaded.xml")
										: t("data.loaded.from.browser")
								}
							/>
						)}
						{showSuccessMessage && <Notice message={t("cv.generated")} />}

						{/* Personal Information is always first and cannot be reordered */}
						<PersonalInformation
							links={links.items}
							personalInfo={personalInfo}
							onAddLink={handleAddLink}
							onRemoveLink={links.remove}
							onPersonalInfoChange={handlePersonalInfoChange}
							onReorderLinks={links.reorder}
							onToggleLinkLabel={handleToggleLinkLabel}
						/>

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

						{/* Add custom section button */}
						<div className="flex justify-start">
							<button
								onClick={handleAddCustomSection}
								className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors duration-300 shadow-sm"
								type="button"
							>
								<Plus className="w-5 h-5" />
								{t("custom.section.add")}
							</button>
						</div>

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

						<div className="w-full">
							<AtsExplanation />
						</div>

						<div className="w-full">
							<CVTips />
						</div>
					</div>

					{/* Live PDF Preview (desktop only) */}
					<div className="hidden lg:block lg:col-span-6">
						<div className="sticky top-24 h-[calc(100vh-7rem)]">
							<LivePdfPane data={cvData} lang={language} />
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
			/>

			{/* Desktop action bar */}
			<BottomActionBar
				data={cvData}
				onTemplateChange={setSelectedTemplate}
				onColorChange={setSelectedColor}
				onSettingsChange={setRenderSettings}
				onResetSectionOrder={handleResetSectionOrder}
				onGeneratePDF={handleGeneratePDF}
				onShowSuccessMessage={() => setShowSuccessMessage(true)}
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
				onTemplateChange={setSelectedTemplate}
				onColorChange={setSelectedColor}
				onSettingsChange={setRenderSettings}
				onResetSectionOrder={handleResetSectionOrder}
				onShowPdfPreview={handleShowPdfPreview}
				onGeneratePDF={handleGeneratePDF}
				onShowSuccessMessage={() => setShowSuccessMessage(true)}
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

/** Transient green banner above the form. */
function Notice({ message }: { message: string }) {
	return (
		<div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-sm transition-colors duration-300">
			<p className="text-green-700 dark:text-green-400 text-sm">{message}</p>
		</div>
	);
}
