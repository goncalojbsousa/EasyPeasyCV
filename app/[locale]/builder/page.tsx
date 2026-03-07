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
	Volunteer,
} from "../../types/cv";
import { cvDataToXml, xmlToCvData } from "../../utils/xml";

type CvDataWithSettings = CvData & { settings?: CvRenderSettings };

type CvProfileMeta = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
};

type CvProfilesStorage = {
	currentProfileId: string | null;
	profiles: Record<string, CvDataWithSettings>;
	meta: Record<string, CvProfileMeta>;
};

const PROFILES_STORAGE_KEY = "cv-builder-profiles-v1";
const LEGACY_STORAGE_KEY = "cv-builder-data";

const DEFAULT_COUNTRY_CODE = "Portugal (+351)";

const DEFAULT_RENDER_SETTINGS: CvRenderSettings = {
	layout: {
		fontFamily: "Helvetica",
		customFont: null,
		textScale: 1.0,
		marginsCm: { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 },
		lineSpacing: 1.4,
		sectionSpacingPx: 12,
		columns: 1,
		atsSafe: false,
		density: "normal",
		textAlignment: "justify",
		singlePageMode: false,
	},
	header: {
		nameFontSize: 22,
		nameFontWeight: "bold",
		nameColor: "#000000",
		titleStyle: "normal",
		titlePosition: "below",
		dividerThickness: 1,
		dividerStyle: "solid",
		iconSizePx: 18,
		iconSpacingPx: 9,
		iconAlignment: "left",
	},
	photo: {
		enabled: false,
		aspectRatio: "1:1",
		crop: null,
		dataUrl: null,
	},
	sections: {
		titleColor: "#000000",
		titleFontSize: 12,
		dateFormat: "medium",
		useThemeColorForLinks: false,
	},
};

const EMPTY_PERSONAL_INFO = {
	name: "",
	desiredRole: "",
	city: "",
	postalCode: "",
	email: "",
	countryCode: DEFAULT_COUNTRY_CODE,
	phone: "",
};

const generateId = () => {
	if (
		typeof crypto !== "undefined" &&
		"randomUUID" in crypto &&
		typeof crypto.randomUUID === "function"
	) {
		return crypto.randomUUID();
	}
	return `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
};

const cloneCvData = (data: CvDataWithSettings): CvDataWithSettings => {
	if (typeof structuredClone === "function") {
		return structuredClone(data);
	}

	return JSON.parse(JSON.stringify(data)) as CvDataWithSettings;
};

const parseProfilesStorage = (raw: string | null): CvProfilesStorage => {
	if (!raw) {
		return {
			currentProfileId: null,
			profiles: {},
			meta: {},
		};
	}

	try {
		const parsed = JSON.parse(raw) as Partial<CvProfilesStorage>;
		return {
			currentProfileId: parsed.currentProfileId ?? null,
			profiles: parsed.profiles || {},
			meta: parsed.meta || {},
		};
	} catch {
		return {
			currentProfileId: null,
			profiles: {},
			meta: {},
		};
	}
};

const getUniqueProfileName = (
	baseName: string,
	existingNames: Iterable<string>,
) => {
	const normalizedBaseName = baseName.trim() || "Profile";
	const existingNameSet = new Set(
		Array.from(existingNames)
			.map((name) => name.trim())
			.filter((name) => name !== ""),
	);

	if (!existingNameSet.has(normalizedBaseName)) {
		return normalizedBaseName;
	}

	let counter = 2;
	let nextName = `${normalizedBaseName} ${counter}`;
	while (existingNameSet.has(nextName)) {
		counter += 1;
		nextName = `${normalizedBaseName} ${counter}`;
	}

	return nextName;
};

/**
 * CV Builder page component
 * Contains the complete CV creation interface
 * @returns JSX element representing the CV builder page
 */
export default function Builder() {
	const { t, language } = useLanguage();
	const initialNewProfileLabelRef = useRef(t("profile.new"));

	// State management for all form sections
	const [personalInfo, setPersonalInfo] = useState(EMPTY_PERSONAL_INFO);
	const [links, setLinks] = useState<Link[]>([]);
	const [resume, setResume] = useState("");
	// Tracks the source of loaded data for the top notification
	const [dataLoadedSource, setDataLoadedSource] = useState<
		"local" | "xml" | null
	>(null);

	// Custom setResume function for handling resume text changes
	const handleResumeChange = (value: string) => {
		setResume(value);
	};
	const [experiences, setExperiences] = useState<Experience[]>([]);
	const [education, setEducation] = useState<Education[]>([]);
	const [skills, setSkills] = useState("");
	const [languages, setLanguages] = useState<Language[]>([]);
	const [certifications, setCertifications] = useState<Certification[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [showPdfPreview, setShowPdfPreview] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [selectedTemplate, setSelectedTemplate] =
		useState<CvTemplate>("professional");
	const [selectedColor, setSelectedColor] = useState<CvColor>("blue");
	const [renderSettings, setRenderSettings] = useState<CvRenderSettings>(
		DEFAULT_RENDER_SETTINGS,
	);

	const defaultPredefinedOrder = useMemo(
		() =>
			[
				"professional_summary",
				"professional_experience",
				"academic_education",
				"technical_skills",
				"languages",
				"certifications",
				"projects",
				"volunteer",
			] as SectionKey[],
		[],
	);

	const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(
		defaultPredefinedOrder,
	);
	const [customSections, setCustomSections] = useState<CustomSection[]>([]);
	const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
	const [profilesMeta, setProfilesMeta] = useState<CvProfileMeta[]>([]);

	// Determine if the user has added any content anywhere in the CV
	const hasAnyContent = useMemo(() => {
		const personalInfoHasContent =
			personalInfo.name.trim() !== "" ||
			personalInfo.desiredRole.trim() !== "" ||
			personalInfo.city.trim() !== "" ||
			personalInfo.postalCode.trim() !== "" ||
			personalInfo.email.trim() !== "" ||
			personalInfo.phone.trim() !== "" ||
			(personalInfo.countryCode &&
				personalInfo.countryCode !== DEFAULT_COUNTRY_CODE);

		const customSectionsHaveContent = customSections.some((section) => {
			if (section.title.trim()) return true;
			return section.fields.some(
				(field) =>
					field.label.trim() !== "" ||
					(field.subtitle && field.subtitle.trim() !== "") ||
					field.value.trim() !== "",
			);
		});

		return (
			personalInfoHasContent ||
			resume.trim() !== "" ||
			links.length > 0 ||
			experiences.length > 0 ||
			education.length > 0 ||
			skills.trim() !== "" ||
			languages.length > 0 ||
			certifications.length > 0 ||
			projects.length > 0 ||
			volunteers.length > 0 ||
			customSectionsHaveContent
		);
	}, [
		personalInfo,
		resume,
		links.length,
		experiences.length,
		education.length,
		skills,
		languages.length,
		certifications.length,
		projects.length,
		volunteers.length,
		customSections,
	]);

	// Refs for section elements to enable auto-scroll
	const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({
		personal_info: null,
		professional_summary: null,
		professional_experience: null,
		academic_education: null,
		technical_skills: null,
		languages: null,
		certifications: null,
		projects: null,
		volunteer: null,
	});

	const createCustomField = () => ({
		id: generateId(),
		label: "",
		subtitle: "",
		value: "",
		bullet: true,
		current: false,
	});
	const createCustomSection = (): CustomSection => ({
		id: generateId(),
		title: "",
		fields: [createCustomField()],
	});

	const _resetCvStateToEmpty = () => {
		setPersonalInfo(EMPTY_PERSONAL_INFO);
		setLinks([]);
		setResume("");
		setExperiences([]);
		setEducation([]);
		setSkills("");
		setLanguages([]);
		setCertifications([]);
		setProjects([]);
		setVolunteers([]);
		setCustomSections([]);
		setSelectedTemplate("professional");
		setSelectedColor("blue");
		setRenderSettings(DEFAULT_RENDER_SETTINGS);
		setSectionOrder(defaultPredefinedOrder);
	};

	const createNewProfileName = useCallback(
		(existingNames: Iterable<string>) =>
			getUniqueProfileName(t("profile.new"), existingNames),
		[t],
	);

	const createCopiedProfileName = useCallback(
		(sourceName: string, existingNames: Iterable<string>) =>
			getUniqueProfileName(
				t("profile.copy.name").replace(
					"{name}",
					sourceName.trim() || t("profile.unnamed"),
				),
				existingNames,
			),
		[t],
	);

	const applyCvDataToState = useCallback(
		(data: CvDataWithSettings) => {
			setPersonalInfo((prev) => ({
				...prev,
				...(data.personalInfo || EMPTY_PERSONAL_INFO),
			}));

			setLinks(data.links || []);
			setResume(data.resume || "");
			setExperiences(data.experiences || []);
			setEducation(data.education || []);
			setSkills(data.skills || "");
			setLanguages(data.languages || []);
			setCertifications(data.certifications || []);
			setProjects(data.projects || []);
			setVolunteers(data.volunteers || []);

			const loadedCustomSections = data.customSections || [];
			setCustomSections(loadedCustomSections);

			setSelectedTemplate(data.template || "professional");
			setSelectedColor(data.color || "blue");
			if (data.settings) {
				setRenderSettings(data.settings);
			} else {
				setRenderSettings(DEFAULT_RENDER_SETTINGS);
			}

			const customKeys = loadedCustomSections.map(
				(cs: CustomSection) => `custom_${cs.id}` as SectionKey,
			);

			if (
				data.sectionOrder &&
				Array.isArray(data.sectionOrder) &&
				data.sectionOrder.length > 0
			) {
				const storedOrder = data.sectionOrder as SectionKey[];
				const mergedOrder = [
					...storedOrder,
					...customKeys.filter((k: SectionKey) => !storedOrder.includes(k)),
				];
				setSectionOrder(mergedOrder);
			} else {
				setSectionOrder([...defaultPredefinedOrder, ...customKeys]);
			}
		},
		[defaultPredefinedOrder],
	);

	const buildCvDataFromState = useCallback(
		(): CvDataWithSettings => ({
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
			template: selectedTemplate,
			color: selectedColor,
			sectionOrder,
			settings: renderSettings,
		}),
		[
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
			selectedTemplate,
			selectedColor,
			sectionOrder,
			renderSettings,
		],
	);

	// Export current CV data to XML and trigger download
	const handleExportXml = () => {
		try {
			const data = buildCvDataFromState();
			const xml = cvDataToXml(data);
			const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
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

	// Import CV data from XML string and populate state
	const handleImportXml = (xml: string) => {
		try {
			const data = xmlToCvData(xml) as CvDataWithSettings;

			applyCvDataToState(data);
			setDataLoaded(true);
			setDataLoadedSource("xml");
		} catch (e) {
			console.error("XML import failed:", e);
			alert(t("data.import.error"));
		}
	};

	/**
	 * Function to load data from localStorage
	 * Supports multiple CV profiles with migration from legacy single-profile storage
	 */
	const loadFromLocalStorage = useCallback(() => {
		try {
			const storage = parseProfilesStorage(
				localStorage.getItem(PROFILES_STORAGE_KEY),
			);
			const profileIds = Object.keys(storage.profiles);
			if (profileIds.length > 0) {
				const currentId =
					storage.currentProfileId && storage.profiles[storage.currentProfileId]
						? storage.currentProfileId
						: profileIds[0] || null;

				setCurrentProfileId(currentId);
				setProfilesMeta(Object.values(storage.meta));

				if (currentId && storage.profiles[currentId]) {
					applyCvDataToState(storage.profiles[currentId]);
					setDataLoaded(true);
					setDataLoadedSource("local");
				}
				return;
			}

			// Migration from legacy single-profile storage
			const legacySaved = localStorage.getItem(LEGACY_STORAGE_KEY);
			if (legacySaved) {
				const legacyData = JSON.parse(legacySaved) as CvDataWithSettings;
				const id = generateId();
				const now = new Date().toISOString();
				const name =
					legacyData.personalInfo?.name?.trim() ||
					legacyData.personalInfo?.desiredRole?.trim() ||
					initialNewProfileLabelRef.current;

				const storage: CvProfilesStorage = {
					currentProfileId: id,
					profiles: { [id]: legacyData },
					meta: {
						[id]: {
							id,
							name,
							createdAt: now,
							updatedAt: now,
						},
					},
				};

				localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(storage));

				setCurrentProfileId(id);
				setProfilesMeta(Object.values(storage.meta));
				applyCvDataToState(legacyData);
				setDataLoaded(true);
				setDataLoadedSource("local");
				return;
			}
		} catch {
			// Silently handle error loading saved data
		}
	}, [applyCvDataToState]);

	// Load saved data when page loads
	useEffect(() => {
		loadFromLocalStorage();
	}, [loadFromLocalStorage]);

	// Detect mobile device
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Hide data loaded notification after 5 seconds
	useEffect(() => {
		if (dataLoaded) {
			const timer = setTimeout(() => {
				setDataLoaded(false);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [dataLoaded]);

	// Hide success message after 3 seconds
	useEffect(() => {
		if (showSuccessMessage) {
			const timer = setTimeout(() => {
				setShowSuccessMessage(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [showSuccessMessage]);

	// Preload PDF component to avoid delay
	useEffect(() => {
		const preloadPDF = async () => {
			try {
				await import("../../components/pdf/pdf_download_button");
			} catch {
				// Silently handle PDF component preload failure
			}
		};
		preloadPDF();
	}, []);

	/**
	 * Function to save data to localStorage
	 * Stores all form data for the current profile, supporting multiple profiles
	 */
	const saveToLocalStorage = useCallback(() => {
		try {
			const currentData = buildCvDataFromState();
			const storage = parseProfilesStorage(
				localStorage.getItem(PROFILES_STORAGE_KEY),
			);

			let profileId = currentProfileId;
			const now = new Date().toISOString();

			if (!profileId) {
				profileId = generateId();
				const name =
					currentData.personalInfo?.name?.trim() ||
					currentData.personalInfo?.desiredRole?.trim() ||
					createNewProfileName(
						Object.values(storage.meta).map((meta) => meta.name),
					);

				storage.meta[profileId] = {
					id: profileId,
					name,
					createdAt: now,
					updatedAt: now,
				};
				storage.currentProfileId = profileId;
				setCurrentProfileId(profileId);
			} else {
				const existingMeta = storage.meta[profileId];
				const name =
					existingMeta?.name ||
					currentData.personalInfo?.name?.trim() ||
					currentData.personalInfo?.desiredRole?.trim() ||
					createNewProfileName(
						Object.values(storage.meta)
							.filter((meta) => meta.id !== profileId)
							.map((meta) => meta.name),
					);

				storage.meta[profileId] = {
					id: profileId,
					name,
					createdAt: existingMeta?.createdAt || now,
					updatedAt: now,
				};
				storage.currentProfileId = profileId;
			}

			storage.profiles[profileId] = currentData;
			localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(storage));
			setProfilesMeta(Object.values(storage.meta));
		} catch {
			// Silently ignore storage errors
		}
	}, [buildCvDataFromState, createNewProfileName, currentProfileId]);

	// Auto-save data when any field changes
	useEffect(() => {
		// Only save if initial data has been loaded (avoid overwriting saved data)
		if (
			personalInfo.name !== "" ||
			resume !== "" ||
			experiences.length > 0 ||
			education.length > 0
		) {
			saveToLocalStorage();
		}
	}, [
		saveToLocalStorage,
		personalInfo.name,
		resume,
		experiences.length,
		education.length,
	]);

	/**
	 * Add a new social media link
	 * @param type - Type of social media link (LinkedIn, GitHub, etc.)
	 * @param value - URL value for the link
	 * @param customName - Custom name for the platform (when type is "Other")
	 */
	const handleAddLink = (
		type: string = "LinkedIn",
		value: string = "",
		customName?: string,
	) => {
		setLinks([...links, { type, value, ...(customName && { customName }) }]);
	};

	/**
	 * Remove a social media link
	 * @param idx - Index of the link to remove
	 */
	const handleRemoveLink = (idx: number) => {
		setLinks((links) => links.filter((_, i) => i !== idx));
	};

	/**
	 * Toggle the hideLinkLabel property for a link
	 * @param idx - Index of the link to update
	 */
	const handleToggleLinkLabel = (idx: number) => {
		setLinks((links) =>
			links.map((link, i) =>
				i === idx ? { ...link, hideLinkLabel: !link.hideLinkLabel } : link,
			),
		);
	};

	// Professional Experience handlers
	/**
	 * Add a new professional experience entry
	 */
	const handleAddExperience = () => {
		setExperiences([
			...experiences,
			{
				role: "",
				company: "",
				startMonth: "",
				startYear: "",
				endMonth: "",
				endYear: "",
				current: false,
				tech: "",
				activities: "",
				results: "",
			},
		]);
	};
	/**
	 * Remove a professional experience entry
	 * @param idx - Index of the experience to remove
	 */
	const handleRemoveExperience = (idx: number) => {
		setExperiences(experiences.filter((_, i) => i !== idx));
	};
	/**
	 * Update a professional experience field
	 * @param idx - Index of the experience to update
	 * @param field - Field name to update
	 * @param value - New value for the field
	 */
	const handleExperienceChange = (
		idx: number,
		field: string,
		value: string | boolean,
	) => {
		setExperiences(
			experiences.map((exp, i) =>
				i === idx ? { ...exp, [field]: value } : exp,
			),
		);
	};

	/**
	 * Reorder professional experiences
	 * @param fromIndex - Index of the experience to move
	 * @param toIndex - Index where to move the experience
	 */
	const handleReorderExperiences = (fromIndex: number, toIndex: number) => {
		const newExperiences = [...experiences];
		const [movedExperience] = newExperiences.splice(fromIndex, 1);
		newExperiences.splice(toIndex, 0, movedExperience);
		setExperiences(newExperiences);
	};

	/**
	 * Reorder education entries
	 * @param fromIndex - Index of the education to move
	 * @param toIndex - Index where to move the education
	 */
	const handleReorderEducation = (fromIndex: number, toIndex: number) => {
		const newEducation = [...education];
		const [movedEducation] = newEducation.splice(fromIndex, 1);
		newEducation.splice(toIndex, 0, movedEducation);
		setEducation(newEducation);
	};

	/**
	 * Reorder certification entries
	 * @param fromIndex - Index of the certification to move
	 * @param toIndex - Index where to move the certification
	 */
	const handleReorderCertifications = (fromIndex: number, toIndex: number) => {
		const newCertifications = [...certifications];
		const [movedCertification] = newCertifications.splice(fromIndex, 1);
		newCertifications.splice(toIndex, 0, movedCertification);
		setCertifications(newCertifications);
	};

	/**
	 * Reorder project entries
	 * @param fromIndex - Index of the project to move
	 * @param toIndex - Index where to move the project
	 */
	const handleReorderProjects = (fromIndex: number, toIndex: number) => {
		const newProjects = [...projects];
		const [movedProject] = newProjects.splice(fromIndex, 1);
		newProjects.splice(toIndex, 0, movedProject);
		setProjects(newProjects);
	};

	/**
	 * Reorder link entries
	 * @param fromIndex - Index of the link to move
	 * @param toIndex - Index where to move the link
	 */
	const handleReorderLinks = (fromIndex: number, toIndex: number) => {
		const newLinks = [...links];
		const [movedLink] = newLinks.splice(fromIndex, 1);
		newLinks.splice(toIndex, 0, movedLink);
		setLinks(newLinks);
	};

	// Academic Education handlers
	/**
	 * Add a new education entry with empty fields
	 */
	const handleAddEducation = () => {
		setEducation([
			...education,
			{
				type: "",
				status: "",
				course: "",
				institution: "",
				startMonth: "",
				startYear: "",
				endMonth: "",
				endYear: "",
				description: "",
				achievements: "",
			},
		]);
	};
	/**
	 * Remove an education entry
	 * @param idx - Index of the education to remove
	 */
	const handleRemoveEducation = (idx: number) => {
		setEducation(education.filter((_, i) => i !== idx));
	};
	/**
	 * Update an education field
	 * @param idx - Index of the education to update
	 * @param field - Field name to update
	 * @param value - New value for the field
	 */
	const handleEducationChange = (idx: number, field: string, value: string) => {
		setEducation(
			education.map((ed, i) => (i === idx ? { ...ed, [field]: value } : ed)),
		);
	};

	// Languages handlers
	/**
	 * Add a new language entry
	 */
	const handleAddLanguage = () => {
		setLanguages([...languages, { name: "", level: "" }]);
	};
	/**
	 * Remove a language entry
	 * @param idx - Index of the language to remove
	 */
	const handleRemoveLanguage = (idx: number) => {
		setLanguages(languages.filter((_, i) => i !== idx));
	};
	/**
	 * Update a language field
	 * @param idx - Index of the language to update
	 * @param field - Field name to update
	 * @param value - New value for the field
	 */
	const handleLanguageChange = (idx: number, field: string, value: string) => {
		setLanguages(
			languages.map((lang, i) =>
				i === idx ? { ...lang, [field]: value } : lang,
			),
		);
	};

	/**
	 * Reorder language entries
	 * @param fromIndex - Index of the language to move
	 * @param toIndex - Index where to move the language
	 */
	const handleReorderLanguages = (fromIndex: number, toIndex: number) => {
		const newLanguages = [...languages];
		const [movedLanguage] = newLanguages.splice(fromIndex, 1);
		newLanguages.splice(toIndex, 0, movedLanguage);
		setLanguages(newLanguages);
	};

	// Certifications/Courses handlers
	/**
	 * Add a new certification entry
	 */
	const handleAddCertification = () => {
		setCertifications([
			...certifications,
			{
				name: "",
				issuer: "",
				completionDate: "",
				hours: "",
				validationLink: "",
				description: "",
			},
		]);
	};
	/**
	 * Remove a certification entry
	 * @param idx - Index of the certification to remove
	 */
	const handleRemoveCertification = (idx: number) => {
		setCertifications(certifications.filter((_, i) => i !== idx));
	};
	/**
	 * Update a certification field
	 * @param idx - Index of the certification to update
	 * @param field - Field name to update
	 * @param value - New value for the field
	 */
	const handleCertificationChange = (
		idx: number,
		field: string,
		value: string,
	) => {
		setCertifications(
			certifications.map((cert, i) =>
				i === idx ? { ...cert, [field]: value } : cert,
			),
		);
	};

	// Projects handlers
	/**
	 * Add a new project entry
	 */
	const handleAddProject = () => {
		setProjects([
			...projects,
			{
				name: "",
				description: "",
				link: "",
				sourceCode: "",
				tech: "",
				year: "",
				impact: "",
			},
		]);
	};
	/**
	 * Remove a project entry
	 * @param idx - Index of the project to remove
	 */
	const handleRemoveProject = (idx: number) => {
		setProjects(projects.filter((_, i) => i !== idx));
	};
	/**
	 * Update a project field
	 * @param idx - Index of the project to update
	 * @param field - Field name to update
	 * @param value - New value for the field
	 */
	const handleProjectChange = (idx: number, field: string, value: string) => {
		setProjects(
			projects.map((proj, i) =>
				i === idx ? { ...proj, [field]: value } : proj,
			),
		);
	};

	// Volunteer handlers
	/**
	 * Add a new volunteer entry
	 */
	const handleAddVolunteer = () => {
		setVolunteers([
			...volunteers,
			{
				organization: "",
				role: "",
				startMonth: "",
				startYear: "",
				endMonth: "",
				endYear: "",
				current: false,
				description: "",
				impact: "",
			},
		]);
	};
	/**
	 * Remove a volunteer entry
	 * @param idx - Index of the volunteer to remove
	 */
	const handleRemoveVolunteer = (idx: number) => {
		setVolunteers(volunteers.filter((_, i) => i !== idx));
	};
	/**
	 * Update a volunteer field
	 * @param idx - Index of the volunteer to update
	 * @param field - Field name to update
	 * @param value - New value for the field
	 */
	const handleVolunteerChange = (
		idx: number,
		field: string,
		value: string | boolean,
	) => {
		setVolunteers(
			volunteers.map((vol, i) =>
				i === idx ? { ...vol, [field]: value } : vol,
			),
		);
	};
	/**
	 * Reorder volunteer entries
	 * @param fromIndex - Index of the volunteer to move
	 * @param toIndex - Index where to move the volunteer
	 */
	const handleReorderVolunteers = (fromIndex: number, toIndex: number) => {
		const newVolunteers = [...volunteers];
		const [movedVolunteer] = newVolunteers.splice(fromIndex, 1);
		newVolunteers.splice(toIndex, 0, movedVolunteer);
		setVolunteers(newVolunteers);
	};

	// Custom sections handlers
	const handleAddCustomSection = () => {
		const newSection = createCustomSection();
		setCustomSections((prev) => [...prev, newSection]);
		const newKey = `custom_${newSection.id}` as SectionKey;
		setSectionOrder((prev) => [...prev, newKey]);

		setTimeout(() => {
			const sectionElement = sectionRefs.current[newKey];
			if (sectionElement) {
				const headerHeight = 115;
				const elementPosition = sectionElement.offsetTop - headerHeight;
				window.scrollTo({ top: elementPosition, behavior: "smooth" });
			}
		}, 0);
	};

	const handleRemoveCustomSection = (sectionId: string) => {
		const key = `custom_${sectionId}` as SectionKey;
		setCustomSections((prev) =>
			prev.filter((section) => section.id !== sectionId),
		);
		setSectionOrder((prev) => prev.filter((k) => k !== key));
	};

	const handleUpdateCustomSectionTitle = (sectionId: string, value: string) => {
		setCustomSections((prev) =>
			prev.map((section) =>
				section.id === sectionId ? { ...section, title: value } : section,
			),
		);
	};

	const handleAddCustomField = (sectionId: string) => {
		setCustomSections((prev) =>
			prev.map((section) =>
				section.id === sectionId
					? { ...section, fields: [...section.fields, createCustomField()] }
					: section,
			),
		);
	};

	const handleUpdateCustomField = (
		sectionId: string,
		fieldId: string,
		key:
			| "label"
			| "subtitle"
			| "value"
			| "startMonth"
			| "startYear"
			| "endMonth"
			| "endYear"
			| "bullets"
			| "current"
			| "centerValue",
		value: string | boolean,
	) => {
		setCustomSections((prev) =>
			prev.map((section) => {
				if (section.id !== sectionId) return section;
				return {
					...section,
					fields: section.fields.map((field) =>
						field.id === fieldId ? { ...field, [key]: value } : field,
					),
				};
			}),
		);
	};

	const handleRemoveCustomField = (sectionId: string, fieldId: string) => {
		setCustomSections((prev) =>
			prev.map((section) =>
				section.id === sectionId
					? {
							...section,
							fields: section.fields.filter((field) => field.id !== fieldId),
						}
					: section,
			),
		);
	};

	const handleReorderCustomFields = (
		sectionId: string,
		fromIndex: number,
		toIndex: number,
	) => {
		setCustomSections((prev) =>
			prev.map((section) => {
				if (section.id !== sectionId) return section;
				const newFields = [...section.fields];
				const [movedField] = newFields.splice(fromIndex, 1);
				newFields.splice(toIndex, 0, movedField);
				return { ...section, fields: newFields };
			}),
		);
	};

	/**
	 * Function to update personal information fields
	 * @param field - Field name to update
	 * @param value - New value for the field
	 */
	const handlePersonalInfoChange = (field: string, value: string) => {
		setPersonalInfo((prev) => ({ ...prev, [field]: value }));
	};

	/**
	 * Move a section up in the order
	 * @param sectionKey - The key of the section to move
	 */
	const handleMoveSectionUp = (sectionKey: SectionKey) => {
		const currentIndex = sectionOrder.indexOf(sectionKey);
		if (currentIndex > 0) {
			const newOrder = [...sectionOrder];
			[newOrder[currentIndex - 1], newOrder[currentIndex]] = [
				newOrder[currentIndex],
				newOrder[currentIndex - 1],
			];
			setSectionOrder(newOrder);

			// Scroll to the section after it moves up - use setTimeout to ensure DOM has updated
			setTimeout(() => {
				const sectionElement = sectionRefs.current[sectionKey];
				if (sectionElement) {
					const headerHeight = 115; // Approximate header height in pixels
					const elementPosition = sectionElement.offsetTop - headerHeight;

					window.scrollTo({
						top: elementPosition,
						behavior: "smooth",
					});
				}
			}, 0);
		}
	};

	/**
	 * Move a section down in the order
	 * @param sectionKey - The key of the section to move
	 */
	const handleMoveSectionDown = (sectionKey: SectionKey) => {
		const currentIndex = sectionOrder.indexOf(sectionKey);
		if (currentIndex < sectionOrder.length - 1) {
			const newOrder = [...sectionOrder];
			[newOrder[currentIndex], newOrder[currentIndex + 1]] = [
				newOrder[currentIndex + 1],
				newOrder[currentIndex],
			];
			setSectionOrder(newOrder);

			// Scroll to the section after it moves down - use setTimeout to ensure DOM has updated
			setTimeout(() => {
				const sectionElement = sectionRefs.current[sectionKey];
				if (sectionElement) {
					const headerHeight = 115; // Approximate header height in pixels
					const elementPosition = sectionElement.offsetTop - headerHeight;

					window.scrollTo({
						top: elementPosition,
						behavior: "smooth",
					});
				}
			}, 0);
		}
	};

	/**
	 * Reset section order to default
	 */
	const handleResetSectionOrder = () => {
		const customKeys = customSections.map(
			(cs) => `custom_${cs.id}` as SectionKey,
		);
		setSectionOrder([...defaultPredefinedOrder, ...customKeys]);
	};

	const handleCreateProfile = () => {
		try {
			const now = new Date().toISOString();
			const storage = parseProfilesStorage(
				localStorage.getItem(PROFILES_STORAGE_KEY),
			);

			const id = generateId();
			const name = createNewProfileName(
				Object.values(storage.meta).map((meta) => meta.name),
			);

			const emptyData: CvDataWithSettings = {
				personalInfo: EMPTY_PERSONAL_INFO,
				links: [],
				resume: "",
				experiences: [],
				education: [],
				skills: "",
				languages: [],
				certifications: [],
				projects: [],
				volunteers: [],
				customSections: [],
				template: "professional",
				color: "blue",
				sectionOrder: defaultPredefinedOrder,
				settings: DEFAULT_RENDER_SETTINGS,
			};

			storage.profiles[id] = emptyData;
			storage.meta[id] = {
				id,
				name,
				createdAt: now,
				updatedAt: now,
			};
			storage.currentProfileId = id;

			localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(storage));

			setCurrentProfileId(id);
			setProfilesMeta(Object.values(storage.meta));
			applyCvDataToState(emptyData);
		} catch {
			// Ignore errors when creating profiles
		}
	};

	const handleDuplicateProfile = (profileId: string) => {
		if (!profileId) return;

		try {
			saveToLocalStorage();
			const storage = parseProfilesStorage(
				localStorage.getItem(PROFILES_STORAGE_KEY),
			);
			const sourceProfile = storage.profiles[profileId];
			if (!sourceProfile) return;

			const sourceMeta = storage.meta[profileId];
			const sourceName =
				sourceMeta?.name ||
				sourceProfile.personalInfo?.name?.trim() ||
				sourceProfile.personalInfo?.desiredRole?.trim() ||
				t("profile.unnamed");
			const id = generateId();
			const now = new Date().toISOString();
			const duplicatedData = cloneCvData(sourceProfile);
			const name = createCopiedProfileName(
				sourceName,
				Object.values(storage.meta).map((meta) => meta.name),
			);

			storage.profiles[id] = duplicatedData;
			storage.meta[id] = {
				id,
				name,
				createdAt: now,
				updatedAt: now,
			};
			storage.currentProfileId = id;

			localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(storage));
			setCurrentProfileId(id);
			setProfilesMeta(Object.values(storage.meta));
			applyCvDataToState(duplicatedData);
		} catch {
			// Ignore errors during profile duplication
		}
	};

	const handleSwitchProfile = (profileId: string) => {
		if (!profileId || profileId === currentProfileId) return;

		try {
			// Save current profile first
			saveToLocalStorage();

			const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
			if (!raw) return;

			const parsed = JSON.parse(raw) as Partial<CvProfilesStorage>;
			const profiles = parsed.profiles || {};
			const meta = parsed.meta || {};

			const nextProfile = profiles[profileId];
			if (!nextProfile) return;

			const storage: CvProfilesStorage = {
				currentProfileId: profileId,
				profiles,
				meta,
			};

			localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(storage));

			setCurrentProfileId(profileId);
			setProfilesMeta(Object.values(meta));
			applyCvDataToState(nextProfile);
		} catch {
			// Ignore errors during profile switching
		}
	};

	const handleRenameProfile = (profileId: string, nextName: string) => {
		const trimmedName = nextName.trim();
		if (!profileId || !trimmedName) return;

		try {
			const storage = parseProfilesStorage(
				localStorage.getItem(PROFILES_STORAGE_KEY),
			);
			const profiles = storage.profiles;
			const meta = storage.meta;
			const existingMeta = meta[profileId];

			if (!profiles[profileId] || !existingMeta) return;

			const now = new Date().toISOString();
			const nextMeta = {
				...meta,
				[profileId]: {
					...existingMeta,
					name: trimmedName,
					updatedAt: now,
				},
			};

			const activeProfileId =
				storage.currentProfileId && profiles[storage.currentProfileId]
					? storage.currentProfileId
					: Object.keys(profiles)[0] || null;

			const updatedStorage: CvProfilesStorage = {
				currentProfileId: activeProfileId,
				profiles,
				meta: nextMeta,
			};

			localStorage.setItem(
				PROFILES_STORAGE_KEY,
				JSON.stringify(updatedStorage),
			);
			setProfilesMeta(Object.values(nextMeta));
		} catch {
			// Ignore errors during profile rename
		}
	};

	const handleDeleteProfile = (profileId: string) => {
		if (!profileId) return;

		try {
			const storage = parseProfilesStorage(
				localStorage.getItem(PROFILES_STORAGE_KEY),
			);
			const profiles = { ...storage.profiles };
			const meta = { ...storage.meta };

			if (!profiles[profileId]) return;

			// Keep at least one profile to avoid entering an empty/broken state.
			if (Object.keys(profiles).length <= 1) return;

			delete profiles[profileId];
			delete meta[profileId];

			const remainingProfileIds = Object.keys(profiles);
			const activeProfileId =
				storage.currentProfileId && profiles[storage.currentProfileId]
					? storage.currentProfileId
					: remainingProfileIds[0] || null;

			const updatedStorage: CvProfilesStorage = {
				currentProfileId: activeProfileId,
				profiles,
				meta,
			};

			localStorage.setItem(
				PROFILES_STORAGE_KEY,
				JSON.stringify(updatedStorage),
			);
			setProfilesMeta(Object.values(meta));
			setCurrentProfileId(activeProfileId);

			if (profileId === currentProfileId && activeProfileId) {
				applyCvDataToState(profiles[activeProfileId]);
			}
		} catch {
			// Ignore errors during profile deletion
		}
	};

	/**
	 * Allow PDF/preview only when the user has added at least some content
	 */
	const validateForm = () => {
		return hasAnyContent;
	};

	/**
	 * Handle PDF generation with validation
	 * @param lang - Language for the PDF (pt or en)
	 * @returns True if validation passes, false otherwise
	 */
	const handleGeneratePDF = () => {
		if (!validateForm()) {
			const message =
				language === "pt"
					? "Adicione algum conteúdo antes de gerar o PDF."
					: language === "br"
						? "Adicione algum conteúdo antes de gerar o PDF."
						: language === "es"
							? "Agrega algún contenido antes de generar el PDF."
							: "Add some content before generating the PDF.";
			alert(message);
			return false; // Return false to prevent PDF generation
		}

		return true; // Return true to allow PDF generation
	};

	const handleShowPdfPreview = async () => {
		if (!validateForm()) {
			const message =
				language === "pt"
					? "Adicione algum conteúdo antes de visualizar o PDF."
					: language === "br"
						? "Adicione algum conteúdo antes de visualizar o PDF."
						: language === "es"
							? "Agrega algún contenido antes de previsualizar el PDF."
							: "Add some content before previewing the PDF.";
			alert(message);
			return;
		}

		if (isMobile) {
			// Mobile: Generate PDF and open directly
			try {
				const { pdf } = await import("@react-pdf/renderer");
				const { CvDocument } = await import("../../components/cv_document");

				const pdfDoc = (
					<CvDocument
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
						lang={language}
						template={selectedTemplate}
						color={selectedColor}
						settings={renderSettings}
						sectionOrder={sectionOrder}
					/>
				);

				const blob = await pdf(pdfDoc).toBlob();
				const url = URL.createObjectURL(blob);

				// Open PDF in new tab
				window.open(url, "_blank");

				// Cleanup URL after a delay
				setTimeout(() => URL.revokeObjectURL(url), 1000);
			} catch (error) {
				console.error("Error generating PDF for mobile:", error);
				// Fallback: show modal
				setShowPdfPreview(true);
			}
		} else {
			// Desktop: Show modal
			setShowPdfPreview(true);
		}
	};

	/**
	 * Fill form with example data for demonstration purposes
	 */
	const fillWithExampleData = () => {
		setPersonalInfo({
			name: "John Doe",
			desiredRole: "Senior Full Stack Developer",
			city: "Lisbon",
			postalCode: "1000-001",
			email: "john.doe@example.com",
			countryCode: "Portugal (+351)",
			phone: "912345678",
		});
		setLinks([
			{
				type: "LinkedIn",
				value: "linkedin.com/in/johndoe",
				hideLinkLabel: false,
			},
			{ type: "GitHub", value: "github.com/johndoe", hideLinkLabel: false },
			{ type: "Portfolio", value: "johndoe.example.com", hideLinkLabel: false },
			{
				type: "Other",
				value: "dev.to/johndoe",
				customName: "Blog",
				hideLinkLabel: false,
			},
		]);
		setResume(
			"Accomplished Full Stack Developer with 8+ years of experience building scalable web applications and leading cross-functional teams. Expertise in modern JavaScript frameworks, cloud architecture, and agile methodologies. Proven track record of delivering high-impact solutions that drive business growth and enhance user experience. Passionate about clean code, performance optimization, and mentoring junior developers.",
		);
		setExperiences([
			{
				role: "Senior Full Stack Developer",
				company: "Red Hat",
				startMonth: "Mar",
				startYear: "2021",
				endMonth: "",
				endYear: "",
				current: true,
				tech: "React, Next.js, TypeScript, Node.js, PostgreSQL, AWS, Docker, Kubernetes",
				activities:
					"Lead development of enterprise SaaS platform serving 10,000+ users. Architect microservices infrastructure and mentor team of 6 developers. Conduct code reviews and establish best practices. Collaborate with product managers to define technical requirements and roadmap.",
				results:
					"Reduced application load time by 60% through optimization. Increased system reliability to 99.9% uptime. Successfully migrated monolithic application to microservices architecture, improving deployment frequency by 400%.",
			},
			{
				role: "Full Stack Developer",
				company: "Canonical",
				startMonth: "Jun",
				startYear: "2018",
				endMonth: "Feb",
				endYear: "2021",
				current: false,
				tech: "React, Redux, Node.js, Express, MongoDB, GraphQL, Jest",
				activities:
					"Developed and maintained multiple client-facing web applications. Implemented RESTful and GraphQL APIs. Integrated third-party services and payment gateways. Participated in agile sprint planning and daily standups.",
				results:
					"Delivered 15+ features that increased user engagement by 35%. Reduced API response time by 45% through database optimization. Achieved 90%+ test coverage across all projects.",
			},
			{
				role: "Frontend Developer",
				company: "Mozilla",
				startMonth: "Jan",
				startYear: "2016",
				endMonth: "May",
				endYear: "2018",
				current: false,
				tech: "React, JavaScript, HTML5, CSS3, Webpack, Git",
				activities:
					"Built responsive user interfaces for mobile and web applications. Collaborated with UX designers to implement pixel-perfect designs. Integrated frontend with backend APIs. Maintained component library and documentation.",
				results:
					"Improved mobile conversion rate by 28% through responsive design improvements. Reduced bundle size by 40% using code splitting and lazy loading.",
			},
		]);
		setEducation([
			{
				type: "education.type.bachelor",
				status: "education.status.completed",
				course: "Computer Science",
				institution: "University of California, Berkeley",
				startMonth: "Sep",
				startYear: "2012",
				endMonth: "Jun",
				endYear: "2016",
				current: false,
				description:
					"Relevant coursework: Data Structures & Algorithms, Software Engineering, Database Systems, Web Development, Computer Networks, Operating Systems, Artificial Intelligence.",
				achievements:
					"Graduated Magna Cum Laude with 3.8 GPA. Dean's List all semesters. Led university programming club with 50+ members. Completed senior capstone project on machine learning recommendation systems.",
			},
		]);
		setSkills(
			"React, Next.js, TypeScript, Node.js, Express, PostgreSQL, MongoDB, GraphQL, REST APIs, Docker, Kubernetes, AWS, CI/CD, Git, Jest, React Testing Library, Agile/Scrum, System Design",
		);
		setLanguages([
			{ name: "English", level: "language.level.native" },
			{ name: "Spanish", level: "language.level.c1" },
			{ name: "French", level: "language.level.b2" },
		]);
		setCertifications([
			{
				name: "AWS Certified Solutions Architect - Professional",
				issuer: "Amazon Web Services",
				completionDate: "2023-08-15",
				hours: "40",
				validationLink:
					"https://aws.amazon.com/certification/certified-solutions-architect-professional/",
				description:
					"Advanced certification covering design of distributed systems, migration planning, cost optimization, and security best practices on AWS platform.",
			},
			{
				name: "Professional Scrum Master I (PSM I)",
				issuer: "Scrum.org",
				completionDate: "2022-03-20",
				hours: "16",
				validationLink:
					"https://www.scrum.org/professional-scrum-master-i-certification",
				description:
					"Demonstrates fundamental understanding of Scrum framework, including roles, events, and artifacts. Focus on servant leadership and team facilitation.",
			},
		]);
		setProjects([
			{
				name: "Real-Time Collaboration Platform",
				description:
					"Built a real-time collaboration tool similar to Notion with live editing, comments, and team workspaces. Features WebSocket connections for instant updates and rich text editing capabilities.",
				tech: "Next.js, TypeScript, Socket.io, PostgreSQL, Redis, Tailwind CSS",
				link: "demo-collab-platform.example.com",
				sourceCode: "github.com/johndoe/collab-platform-demo",
				year: "2023",
				impact:
					"Gained 2,500+ active users within 3 months of launch. Achieved 99.5% uptime with average response time under 200ms. Featured on Product Hunt with 400+ upvotes.",
			},
			{
				name: "E-Commerce Analytics Dashboard",
				description:
					"Comprehensive analytics dashboard for e-commerce businesses with real-time sales tracking, customer insights, and inventory management. Includes data visualization and export capabilities.",
				tech: "React, D3.js, Node.js, Express, MongoDB, Chart.js",
				link: "analytics-demo.example.com",
				sourceCode: "github.com/johndoe/ecommerce-analytics",
				year: "2022",
				impact:
					"Helped businesses increase revenue by 25% through actionable insights. Processes over 100,000 transactions daily. Used by 150+ small to medium businesses.",
			},
			{
				name: "Open Source Component Library",
				description:
					"Accessible React component library with 50+ components following WAI-ARIA guidelines. Full TypeScript support, comprehensive documentation, and extensive test coverage.",
				tech: "React, TypeScript, Storybook, Jest, Rollup",
				link: "npm.com/package/example-ui-components",
				sourceCode: "github.com/johndoe/example-ui-components",
				year: "2024",
				impact:
					"Downloaded 10,000+ times monthly on NPM. Adopted by 200+ projects. 500+ GitHub stars and active community contributions.",
			},
		]);
		setVolunteers([
			{
				organization: "Code.org",
				role: "Technical Mentor",
				startMonth: "Jan",
				startYear: "2022",
				endMonth: "",
				endYear: "",
				current: true,
				description:
					"Mentor aspiring developers from underrepresented backgrounds in web development fundamentals. Conduct weekly coding sessions, code reviews, and career guidance workshops. Help students build portfolio projects and prepare for technical interviews.",
				impact:
					"Mentored 30+ students with 80% securing their first tech role within 6 months. Organized 5 hackathons with 200+ participants. Contributed to curriculum development used by 500+ students.",
			},
			{
				organization: "freeCodeCamp",
				role: "Workshop Instructor",
				startMonth: "Sep",
				startYear: "2020",
				endMonth: "Dec",
				endYear: "2021",
				current: false,
				description:
					"Taught free programming workshops to high school students focusing on HTML, CSS, JavaScript, and web development basics. Created hands-on projects and learning materials. Coordinated with schools to expand program reach.",
				impact:
					"Taught 200+ students across 15 workshops. 60% of participants continued pursuing computer science education. Program expanded to 8 additional schools in the district.",
			},
		]);
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
						{/* Data loaded/imported notification */}
						{dataLoaded && (
							<div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-sm transition-colors duration-300">
								<p className="text-green-700 dark:text-green-400 text-sm">
									{dataLoadedSource === "xml"
										? t("data.loaded.xml")
										: t("data.loaded.from.browser")}
								</p>
							</div>
						)}

						{/* Success message notification */}
						{showSuccessMessage && (
							<div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-sm transition-colors duration-300">
								<p className="text-green-700 dark:text-green-400 text-sm">
									{t("cv.generated")}
								</p>
							</div>
						)}

						{/* Personal Information section - Always first and cannot be reordered */}
						<PersonalInformation
							links={links}
							personalInfo={personalInfo}
							onAddLink={handleAddLink}
							onRemoveLink={handleRemoveLink}
							onPersonalInfoChange={handlePersonalInfoChange}
							onReorderLinks={handleReorderLinks}
							onToggleLinkLabel={handleToggleLinkLabel}
						/>

						{/* Render sections dynamically based on sectionOrder */}
						{sectionOrder.map((sectionKey, index) => {
							const canMoveUp = index > 0;
							const canMoveDown = index < sectionOrder.length - 1;

							const sectionElement = (() => {
								switch (sectionKey) {
									case "professional_summary":
										return (
											<ProfessionalSummary
												resume={resume}
												onResumeChange={handleResumeChange}
												canReorder={true}
												onMoveUp={() => handleMoveSectionUp(sectionKey)}
												onMoveDown={() => handleMoveSectionDown(sectionKey)}
												canMoveUp={canMoveUp}
												canMoveDown={canMoveDown}
											/>
										);

									case "professional_experience":
										return (
											<ProfessionalExperience
												experiences={experiences}
												onExperienceChange={handleExperienceChange}
												onAddExperience={handleAddExperience}
												onRemoveExperience={handleRemoveExperience}
												onReorderExperiences={handleReorderExperiences}
												canReorder={true}
												onMoveUp={() => handleMoveSectionUp(sectionKey)}
												onMoveDown={() => handleMoveSectionDown(sectionKey)}
												canMoveUp={canMoveUp}
												canMoveDown={canMoveDown}
											/>
										);

									case "academic_education":
										return (
											<AcademicEducation
												education={education}
												onEducationChange={handleEducationChange}
												onAddEducation={handleAddEducation}
												onRemoveEducation={handleRemoveEducation}
												onReorderEducation={handleReorderEducation}
												canReorder={true}
												onMoveUp={() => handleMoveSectionUp(sectionKey)}
												onMoveDown={() => handleMoveSectionDown(sectionKey)}
												canMoveUp={canMoveUp}
												canMoveDown={canMoveDown}
											/>
										);

									case "technical_skills":
										return (
											<TechnicalSkills
												skills={skills}
												onSkillsChange={setSkills}
												canReorder={true}
												onMoveUp={() => handleMoveSectionUp(sectionKey)}
												onMoveDown={() => handleMoveSectionDown(sectionKey)}
												canMoveUp={canMoveUp}
												canMoveDown={canMoveDown}
											/>
										);

									case "languages":
										return (
											<Languages
												languages={languages}
												onLanguageChange={handleLanguageChange}
												onAddLanguage={handleAddLanguage}
												onRemoveLanguage={handleRemoveLanguage}
												onReorderLanguages={handleReorderLanguages}
												canReorder={true}
												onMoveUp={() => handleMoveSectionUp(sectionKey)}
												onMoveDown={() => handleMoveSectionDown(sectionKey)}
												canMoveUp={canMoveUp}
												canMoveDown={canMoveDown}
											/>
										);

									case "certifications":
										return (
											<Certifications
												certifications={certifications}
												onCertificationChange={handleCertificationChange}
												onAddCertification={handleAddCertification}
												onRemoveCertification={handleRemoveCertification}
												onReorderCertifications={handleReorderCertifications}
												canReorder={true}
												onMoveUp={() => handleMoveSectionUp(sectionKey)}
												onMoveDown={() => handleMoveSectionDown(sectionKey)}
												canMoveUp={canMoveUp}
												canMoveDown={canMoveDown}
											/>
										);

									case "projects":
										return (
											<Projects
												projects={projects}
												onProjectChange={handleProjectChange}
												onAddProject={handleAddProject}
												onRemoveProject={handleRemoveProject}
												onReorderProjects={handleReorderProjects}
												canReorder={true}
												onMoveUp={() => handleMoveSectionUp(sectionKey)}
												onMoveDown={() => handleMoveSectionDown(sectionKey)}
												canMoveUp={canMoveUp}
												canMoveDown={canMoveDown}
											/>
										);

									case "volunteer":
										return (
											<VolunteerWork
												volunteers={volunteers}
												onVolunteerChange={handleVolunteerChange}
												onAddVolunteer={handleAddVolunteer}
												onRemoveVolunteer={handleRemoveVolunteer}
												onReorderVolunteers={handleReorderVolunteers}
												canReorder={true}
												onMoveUp={() => handleMoveSectionUp(sectionKey)}
												onMoveDown={() => handleMoveSectionDown(sectionKey)}
												canMoveUp={canMoveUp}
												canMoveDown={canMoveDown}
											/>
										);

									default:
										if (sectionKey.startsWith("custom_")) {
											const sectionId = sectionKey.replace("custom_", "");
											const section = customSections.find(
												(cs) => cs.id === sectionId,
											);
											if (!section) return null;

											return (
												<CustomSectionCard
													section={section}
													onTitleChange={(value) =>
														handleUpdateCustomSectionTitle(sectionId, value)
													}
													onAddField={() => handleAddCustomField(sectionId)}
													onFieldChange={(fieldId, key, value) =>
														handleUpdateCustomField(
															sectionId,
															fieldId,
															key,
															value,
														)
													}
													onRemoveField={(fieldId) =>
														handleRemoveCustomField(sectionId, fieldId)
													}
													onRemoveSection={() =>
														handleRemoveCustomSection(sectionId)
													}
													onReorderFields={(from, to) =>
														handleReorderCustomFields(sectionId, from, to)
													}
													canReorder={true}
													onMoveUp={() => handleMoveSectionUp(sectionKey)}
													onMoveDown={() => handleMoveSectionDown(sectionKey)}
													canMoveUp={canMoveUp}
													canMoveDown={canMoveDown}
												/>
											);
										}
										return null;
								}
							})();

							return (
								<div
									key={sectionKey}
									ref={(el) => {
										if (el) sectionRefs.current[sectionKey] = el;
									}}
								>
									{sectionElement}
								</div>
							);
						})}

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
									onClick={fillWithExampleData}
									className="bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg text-sm sm:text-base w-full sm:w-auto"
									type="button"
								>
									{t("fill.example")}
								</button>
							</div>
						)}

						{/* Ats Explanation section */}
						<div className="w-full">
							<AtsExplanation />
						</div>

						{/* CV Tips section */}
						<div className="w-full">
							<CVTips />
						</div>
					</div>

					{/* Live PDF Preview (desktop only) */}
					<div className="hidden lg:block lg:col-span-6">
						<div className="sticky top-24 h-[calc(100vh-7rem)]">
							<LivePdfPane
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
								lang={language}
								template={selectedTemplate}
								color={selectedColor}
								settings={renderSettings}
								sectionOrder={sectionOrder}
							/>
						</div>
					</div>
				</div>
			</main>

			<Footer />

			{/* PDF Preview Modal */}
			<PdfPreview
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
				show={showPdfPreview}
				onClose={() => setShowPdfPreview(false)}
				lang={language}
				template={selectedTemplate}
				color={selectedColor}
				settings={renderSettings}
				sectionOrder={sectionOrder}
			/>

			{/* Bottom Action Bar (Desktop) */}
			<BottomActionBar
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
				selectedTemplate={selectedTemplate}
				selectedColor={selectedColor}
				onTemplateChange={setSelectedTemplate}
				onColorChange={setSelectedColor}
				onGeneratePDF={handleGeneratePDF}
				onShowSuccessMessage={() => setShowSuccessMessage(true)}
				onExportXml={handleExportXml}
				onImportXml={handleImportXml}
				settings={renderSettings}
				onSettingsChange={setRenderSettings}
				onResetSectionOrder={handleResetSectionOrder}
				sectionOrder={sectionOrder}
				hasAnyContent={hasAnyContent}
				profiles={profilesMeta}
				currentProfileId={currentProfileId}
				onCreateProfile={handleCreateProfile}
				onDuplicateProfile={handleDuplicateProfile}
				onSwitchProfile={handleSwitchProfile}
				onRenameProfile={handleRenameProfile}
				onDeleteProfile={handleDeleteProfile}
			/>

			{/* Floating Action Bar (Mobile/Tablet) */}
			<FloatingActionBar
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
				template={selectedTemplate}
				color={selectedColor}
				onShowPdfPreview={handleShowPdfPreview}
				onGeneratePDF={handleGeneratePDF}
				onShowSuccessMessage={() => setShowSuccessMessage(true)}
				onTemplateChange={setSelectedTemplate}
				sectionOrder={sectionOrder}
				settings={renderSettings}
				onSettingsChange={setRenderSettings}
				onResetSectionOrder={handleResetSectionOrder}
				hasAnyContent={hasAnyContent}
				selectedColor={selectedColor}
				onColorChange={setSelectedColor}
			/>
		</div>
	);
}
