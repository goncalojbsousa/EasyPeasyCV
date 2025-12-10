'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus } from 'lucide-react';
import { PersonalInformation } from '../components/personal_information';
import { ProfessionalSummary } from '../components/professional_summary';
import { ProfessionalExperience } from '../components/professional_experience';
import { AcademicEducation } from '../components/academic_education';
import { TechnicalSkills } from '../components/technical_skills';
import { Languages } from '../components/languages';
import { Certifications } from '../components/certifications';
import { Projects } from '../components/projects';
import { VolunteerWork } from '../components/volunteer';
import { CVTips } from '../components/cv_tips';
import { JobAnalysis } from '../components/job_analysis';
import { AtsExplanation } from '../components/ats_explanation';
import { CustomSectionCard } from '../components/custom_sections';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';
import { PdfPreview } from '../components/pdf_preview';
import { LivePdfPane } from '../components/live_pdf_pane';
import { FloatingActionBar } from '../components/ui/floating-action-bar';
import { BottomActionBar } from '../components/ui/bottom-action-bar';
import { useLanguage } from '../contexts/LanguageContext';
import { Experience, Education, Language, Certification, Project, Volunteer, CvColor, CvTemplate, CvRenderSettings, CustomSection, SectionKey } from '../types/cv';
import { cvDataToXml, xmlToCvData } from '../utils/xml';

/**
 * CV Builder page component
 * Contains the complete CV creation interface
 * @returns JSX element representing the CV builder page
 */
export default function Builder() {
  const { t, language } = useLanguage();

  // State management for all form sections
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    desiredRole: '',
    city: '',
    postalCode: '',
    email: '',
    countryCode: 'Portugal (+351)',
    phone: '',
  });
  const [links, setLinks] = useState<{ type: string, value: string }[]>([]);
  const [resume, setResume] = useState('');
  // Tracks the source of loaded data for the top notification
  const [dataLoadedSource, setDataLoadedSource] = useState<'local' | 'xml' | null>(null);

  // Custom setResume function for handling resume text changes
  const handleResumeChange = (value: string) => {
    setResume(value);
  };
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CvTemplate>('renewed');
  const [selectedColor, setSelectedColor] = useState<CvColor>('blue');
  const [renderSettings, setRenderSettings] = useState<CvRenderSettings>({
    layout: {
      fontFamily: 'Helvetica',
      customFont: null,
      textScale: 1.0,
      marginsCm: { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 },
      lineSpacing: 1.4,
      sectionSpacingPx: 12,
      columns: 1,
      atsSafe: false,
    },
    header: {
      nameFontSize: 22,
      nameFontWeight: 'bold',
      nameColor: '#000000',
      titleStyle: 'normal',
      titlePosition: 'below',
      dividerThickness: 1,
      dividerStyle: 'solid',
      iconSizePx: 18,
      iconSpacingPx: 9,
      iconAlignment: 'left',
    },
    photo: {
      enabled: false,
      aspectRatio: '1:1',
      crop: null,
      dataUrl: null,
    },
  });

  const defaultPredefinedOrder: SectionKey[] = [
    'professional_summary',
    'professional_experience',
    'academic_education',
    'technical_skills',
    'languages',
    'certifications',
    'projects',
    'volunteer',
  ];

  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(defaultPredefinedOrder);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);

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

  const generateId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
  };

  const createCustomField = () => ({ id: generateId(), label: '', subtitle: '', value: '', bullet: true, current: false });
  const createCustomSection = (): CustomSection => ({ id: generateId(), title: '', fields: [createCustomField()] });

  // Export current CV data to XML and trigger download
  const handleExportXml = () => {
    try {
      const data = {
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
      };
      const xml = cvDataToXml(data);
      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv-data.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('XML export failed', e);
    }
  };

  // Import CV data from XML string and populate state
const handleImportXml = (xml: string) => {
  try {
    const data = xmlToCvData(xml);
    
    setPersonalInfo({
      ...personalInfo,
      ...data.personalInfo
    });
    
    setLinks(data.links || []);
    setResume(data.resume || '');
    setExperiences(data.experiences || []);
    setEducation(data.education || []);
    setSkills(data.skills || '');
    setLanguages(data.languages || []);
    setCertifications(data.certifications || []);
    setProjects(data.projects || []);
    setVolunteers(data.volunteers || []);
    setCustomSections(data.customSections || []);
    setSelectedTemplate(data.template || 'renewed');
    setSelectedColor(data.color || 'blue');
    
    const importedCustomKeys = (data.customSections || []).map((cs: CustomSection) => `custom_${cs.id}` as SectionKey);
    if (data.sectionOrder && Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0) {
      const stored = data.sectionOrder as SectionKey[];
      setSectionOrder([...stored, ...importedCustomKeys.filter((k: SectionKey) => !stored.includes(k))]);
    } else {
      setSectionOrder([...defaultPredefinedOrder, ...importedCustomKeys]);
    }
    
    setDataLoaded(true);
    setDataLoadedSource('xml');
  } catch (e) {
    console.error('XML import failed:', e);
    alert('Erro ao importar XML: ' + (e instanceof Error ? e.message : String(e)));
  }
};

  /**
   * Function to load data from localStorage
   * Retrieves saved data and checks if it's fresh (less than 7 days old)
   */
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('cv-builder-data');
      if (saved) {
        const data = JSON.parse(saved);

        setPersonalInfo(data.personalInfo || {
          name: '',
          desiredRole: '',
          city: '',
          postalCode: '',
          email: '',
          countryCode: 'Portugal (+351)',
          phone: '',
        });
        setLinks(data.links || []);
        setResume(data.resume || '');
        setExperiences(data.experiences || []);
        setEducation(data.education || []);
        setSkills(data.skills || '');
        setLanguages(data.languages || []);
        setCertifications(data.certifications || []);
        setProjects(data.projects || []);
        setVolunteers(data.volunteers || []);
        const loadedCustomSections = data.customSections || [];
        setCustomSections(loadedCustomSections);
        setSelectedTemplate(data.template || 'renewed');
        setSelectedColor(data.color || 'blue');
        
        const customKeys = loadedCustomSections.map((cs: CustomSection) => `custom_${cs.id}` as SectionKey);
        // Load section order if exists
        if (data.sectionOrder && Array.isArray(data.sectionOrder)) {
          const storedOrder = data.sectionOrder as SectionKey[];
          const mergedOrder = [...storedOrder, ...customKeys.filter((k: SectionKey) => !storedOrder.includes(k))];
          setSectionOrder(mergedOrder);
        } else {
          setSectionOrder([...defaultPredefinedOrder, ...customKeys]);
        }
        
        setDataLoaded(true);
        setDataLoadedSource('local');
      }
    } catch {
      // Silently handle error loading saved data
    }
  };

  // Load saved data when page loads
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
        await import('../components/pdf_download_button');
      } catch {
        // Silently handle PDF component preload failure
      }
    };
    preloadPDF();
  }, []);

  // Continuously validate required fields (without showing errors)
  useEffect(() => {
    const errors: { [key: string]: boolean } = {};

    if (!personalInfo.name.trim()) errors.name = true;
    if (!personalInfo.email.trim()) errors.email = true;
    // Removed desiredRole validation - field is now optional

    setValidationErrors(errors);

    // Hide errors if all fields are filled
    if (Object.keys(errors).length === 0) {
      setShowValidationErrors(false);
    }
  }, [personalInfo.name, personalInfo.email]);

  /**
   * Function to save data to localStorage
   * Stores all form data including section order
   */
  const saveToLocalStorage = useCallback(() => {
    const data = {
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
    };
    localStorage.setItem('cv-builder-data', JSON.stringify(data));
  }, [personalInfo, links, resume, experiences, education, skills, languages, certifications, projects, volunteers, customSections, selectedTemplate, selectedColor, sectionOrder]);

  // Auto-save data when any field changes
  useEffect(() => {
    // Only save if initial data has been loaded (avoid overwriting saved data)
    if (personalInfo.name !== '' || resume !== '' || experiences.length > 0 || education.length > 0) {
      saveToLocalStorage();
    }
  }, [saveToLocalStorage, personalInfo.name, resume, experiences.length, education.length, customSections.length]);

  /**
   * Add a new social media link
   * @param type - Type of social media link (LinkedIn, GitHub, etc.)
   * @param value - URL value for the link
   * @param customName - Custom name for the platform (when type is "Other")
   */
  const handleAddLink = (type: string = 'LinkedIn', value: string = '', customName?: string) => {
    setLinks([...links, { type, value, ...(customName && { customName }) }]);
  };

  /**
   * Remove a social media link
   * @param idx - Index of the link to remove
   */
  const handleRemoveLink = (idx: number) => {
    setLinks(links => links.filter((_, i) => i !== idx));
  };

  // Professional Experience handlers
  /**
   * Add a new professional experience entry
   */
  const handleAddExperience = () => {
    setExperiences([...experiences, {
      role: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, tech: '', activities: '', results: ''
    }]);
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
  const handleExperienceChange = (idx: number, field: string, value: string | boolean) => {
    setExperiences(experiences.map((exp, i) => i === idx ? { ...exp, [field]: value } : exp));
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
    setEducation([...education, {
      type: '', status: '', course: '', institution: '', startMonth: '', startYear: '', endMonth: '', endYear: '', description: '', achievements: ''
    }]);
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
    setEducation(education.map((ed, i) => i === idx ? { ...ed, [field]: value } : ed));
  };

  // Languages handlers
  /**
   * Add a new language entry
   */
  const handleAddLanguage = () => {
    setLanguages([...languages, { name: '', level: '' }]);
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
    setLanguages(languages.map((lang, i) => i === idx ? { ...lang, [field]: value } : lang));
  };

  // Certifications/Courses handlers
  /**
   * Add a new certification entry
   */
  const handleAddCertification = () => {
    setCertifications([...certifications, {
      name: '', issuer: '', completionDate: '', hours: '', validationLink: '', description: ''
    }]);
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
  const handleCertificationChange = (idx: number, field: string, value: string) => {
    setCertifications(certifications.map((cert, i) => i === idx ? { ...cert, [field]: value } : cert));
  };

  // Projects handlers
  /**
   * Add a new project entry
   */
  const handleAddProject = () => {
    setProjects([
      ...projects,
      { name: '', description: '', link: '', sourceCode: '', tech: '', year: '', impact: '' }
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
    setProjects(projects.map((proj, i) => i === idx ? { ...proj, [field]: value } : proj));
  };

  // Volunteer handlers
  /**
   * Add a new volunteer entry
   */
  const handleAddVolunteer = () => {
    setVolunteers([...volunteers, {
      organization: '', role: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '', impact: ''
    }]);
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
  const handleVolunteerChange = (idx: number, field: string, value: string | boolean) => {
    setVolunteers(volunteers.map((vol, i) => i === idx ? { ...vol, [field]: value } : vol));
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
        window.scrollTo({ top: elementPosition, behavior: 'smooth' });
      }
    }, 0);
  };

  const handleRemoveCustomSection = (sectionId: string) => {
    const key = `custom_${sectionId}` as SectionKey;
    setCustomSections((prev) => prev.filter((section) => section.id !== sectionId));
    setSectionOrder((prev) => prev.filter((k) => k !== key));
  };

  const handleUpdateCustomSectionTitle = (sectionId: string, value: string) => {
    setCustomSections((prev) => prev.map((section) => section.id === sectionId ? { ...section, title: value } : section));
  };

  const handleAddCustomField = (sectionId: string) => {
    setCustomSections((prev) => prev.map((section) => section.id === sectionId ? { ...section, fields: [...section.fields, createCustomField()] } : section));
  };

  const handleUpdateCustomField = (
    sectionId: string,
    fieldId: string,
    key: 'label' | 'subtitle' | 'value' | 'startMonth' | 'startYear' | 'endMonth' | 'endYear' | 'bullets' | 'current',
    value: string | boolean,
  ) => {
    setCustomSections((prev) => prev.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        fields: section.fields.map((field) => field.id === fieldId ? { ...field, [key]: value } : field),
      };
    }));
  };

  const handleRemoveCustomField = (sectionId: string, fieldId: string) => {
    setCustomSections((prev) => prev.map((section) => section.id === sectionId ? { ...section, fields: section.fields.filter((field) => field.id !== fieldId) } : section));
  };

  const handleReorderCustomFields = (sectionId: string, fromIndex: number, toIndex: number) => {
    setCustomSections((prev) => prev.map((section) => {
      if (section.id !== sectionId) return section;
      const newFields = [...section.fields];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);
      return { ...section, fields: newFields };
    }));
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
      [newOrder[currentIndex - 1], newOrder[currentIndex]] = [newOrder[currentIndex], newOrder[currentIndex - 1]];
      setSectionOrder(newOrder);
      
      // Scroll to the section after it moves up - use setTimeout to ensure DOM has updated
      setTimeout(() => {
        const sectionElement = sectionRefs.current[sectionKey];
        if (sectionElement) {
          const headerHeight = 115; // Approximate header height in pixels
          const elementPosition = sectionElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
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
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      setSectionOrder(newOrder);
      
      // Scroll to the section after it moves down - use setTimeout to ensure DOM has updated
      setTimeout(() => {
        const sectionElement = sectionRefs.current[sectionKey];
        if (sectionElement) {
          const headerHeight = 115; // Approximate header height in pixels
          const elementPosition = sectionElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 0);
    }
  };

  /**
   * Reset section order to default
   */
  const handleResetSectionOrder = () => {
    const customKeys = customSections.map((cs) => `custom_${cs.id}` as SectionKey);
    setSectionOrder([...defaultPredefinedOrder, ...customKeys]);
  };

  /**
   * Function to validate required fields
   * @returns True if all required fields are filled, false otherwise
   */
  const validateForm = () => {
    return Object.keys(validationErrors).length === 0;
  };

  /**
   * Handle PDF generation with validation
   * @param lang - Language for the PDF (pt or en)
   * @returns True if validation passes, false otherwise
   */
  const handleGeneratePDF = () => {
    if (!validateForm()) {
      // Show validation errors
      setShowValidationErrors(true);
      // Scroll to top of page to show validation errors
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return false; // Return false to prevent PDF generation
    }

    return true; // Return true to allow PDF generation
  };

  const handleShowPdfPreview = async () => {
    if (!validateForm()) {
      setShowValidationErrors(true);
      // Scroll to top of page to show validation errors
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    if (isMobile) {
      // Mobile: Generate PDF and open directly
      try {
        const { pdf } = await import('@react-pdf/renderer');
        const { CvDocument } = await import('../components/cv_document');

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
            sectionOrder={sectionOrder}
          />
        );

        const blob = await pdf(pdfDoc).toBlob();
        const url = URL.createObjectURL(blob);

        // Open PDF in new tab
        window.open(url, '_blank');

        // Cleanup URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (error) {
        console.error('Error generating PDF for mobile:', error);
        // Fallback: show modal
        setShowPdfPreview(true);
      }
    } else {
      // Desktop: Show modal
      setShowPdfPreview(true);
    }
  };

  /**
   * Scrolls smoothly to the job analysis section
   */
  const scrollToJobAnalysis = () => {
    const element = document.getElementById('job-analysis-section');
    if (element) {
      const headerHeight = 115; // Approximate header height in pixels
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  /**
   * Scrolls smoothly to the CV tips section
   */
  const scrollToCVTips = () => {
    const element = document.getElementById('cv-tips-section');
    if (element) {
      const headerHeight = 115; // Approximate header height in pixels
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  /**
   * Scrolls smoothly to the ATS explanation section
   */
  const scrollToAtsExplanation = () => {
    const element = document.getElementById('ats-explanation-section');
    if (element) {
      const headerHeight = 115; // Approximate header height in pixels
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  /**
   * Fill form with example data for demonstration purposes
   */
  const fillWithExampleData = () => {
    setPersonalInfo({
      name: 'John Doe',
      desiredRole: 'Software Engineer',
      city: 'Lisbon',
      postalCode: '1000-001',
      email: 'john.doe@example.com',
      countryCode: 'Portugal (+351)',
      phone: '912345678',
    });
    setLinks([
      { type: 'LinkedIn', value: 'linkedin.com/in/johndoe' },
      { type: 'GitHub', value: 'github.com/johndoe' },
      { type: 'GitLab', value: 'gitlab.com/johndoe' },
      { type: 'Portfolio', value: 'johndoe.dev' },
    ]);
    setResume('Experienced software engineer with a passion for building scalable and maintainable applications. Proficient in React, Node.js, and modern web technologies. Strong problem-solving skills and a commitment to delivering high-quality code.');
    setExperiences([
      {
        role: 'Senior Software Engineer',
        company: 'Tech Solutions Inc.',
        startMonth: 'Jan',
        startYear: '2020',
        endMonth: 'Jun',
        endYear: '2023',
        current: false,
        tech: 'React, Node.js, TypeScript, MongoDB',
        activities: 'Led a team of 5 developers, managed project timelines, and delivered multiple high-traffic features.',
        results: 'Achieved 98% uptime for critical applications, reduced page load time by 40% for key pages.',
      },
      {
        role: 'Software Engineer',
        company: 'Innovative Corp.',
        startMonth: 'Jul',
        startYear: '2018',
        endMonth: 'Dez',
        endYear: '2019',
        current: false,
        tech: 'React, Redux, PostgreSQL',
        activities: 'Developed user authentication and authorization system, optimized database queries.',
        results: 'Successfully launched new user registration flow, reduced login time by 50%.',
      },
    ]);
    setEducation([
      {
        type: 'Licenciatura',
        status: 'Completo',
        course: 'Computer Science',
        institution: 'University of Lisbon',
        startMonth: 'Set',
        startYear: '2014',
        endMonth: 'Jun',
        endYear: '2018',
        description: 'Relevant coursework: Data Structures, Algorithms, Operating Systems, Computer Networks.',
        achievements: 'Graduated with honors, top 10% of class. Published research paper on distributed systems.',
      },
    ]);
    setSkills('React, Node.js, TypeScript, MongoDB, PostgreSQL, Redux, Git, Docker, AWS, Linux');
    setLanguages([
      { name: 'English', level: 'Avançado' },
      { name: 'Portuguese', level: 'Nativo' },
    ]);
    setCertifications([
      {
        name: 'AWS Certified Solutions Architect - Associate',
        issuer: 'Amazon Web Services',
        completionDate: '2023-01-15',
        hours: '20',
        validationLink: 'https://www.aws.com/certification/solutions-architect-associate',
        description: 'Foco em sistemas escaláveis e tolerantes a falhas.',
      },
    ]);
    setProjects([
      {
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce application built with React, Node.js, and PostgreSQL.',
        tech: 'React, Node.js, PostgreSQL, Redux, Stripe, JWT',
        link: 'github.com/johndoe/ecommerce-platform',
        year: '2022',
        impact: 'Successfully processed over 1000 orders in the first month, generated $50K in revenue.',
      },
      {
        name: 'Task Management App',
        description: 'Simple React application for managing daily tasks and deadlines.',
        tech: 'React, Redux, LocalStorage',
        link: 'github.com/johndoe/task-manager',
        year: '2023',
        impact: 'Used by 500+ users daily, improved productivity by 40% according to user feedback.',
      },
    ]);
    setVolunteers([
      {
        organization: 'Cruz Vermelha Portuguesa',
        role: 'Voluntário de Apoio Social',
        startMonth: 'Jan',
        startYear: '2022',
        endMonth: 'Dez',
        endYear: '2023',
        current: false,
        description: 'Prestação de apoio social a famílias carenciadas, distribuição de alimentos e roupas.',
        impact: 'Ajudou mais de 50 famílias durante a pandemia, organizou campanhas de recolha de donativos.',
      },
      {
        organization: 'Associação de Proteção Animal',
        role: 'Coordenador de Adoções',
        startMonth: 'Mar',
        startYear: '2023',
        endMonth: '',
        endYear: '',
        current: true,
        description: 'Coordenação do processo de adoção de animais, gestão de voluntários e eventos.',
        impact: 'Facilitou a adoção de mais de 100 animais, aumentou a taxa de adoção em 30%.',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 transition-colors duration-300">
      {/* Header */}
      <Navbar />

      {/* Main content area */}
      <div className="w-full max-w-[1600px] 2xl:max-w-[1800px] mx-auto pt-28 pb-24 px-4 sm:px-6">
        {/* Form + Live preview grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-6 flex flex-col gap-6 sm:gap-8">
            {/* Data loaded/imported notification */}
            {dataLoaded && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-sm transition-colors duration-300">
                <p className="text-green-700 dark:text-green-400 text-sm">
                  {dataLoadedSource === 'xml' ? t('data.loaded.xml') : t('data.loaded.local')}
                </p>
              </div>
            )}

            {/* Success message notification */}
            {showSuccessMessage && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-sm transition-colors duration-300">
                <p className="text-green-700 dark:text-green-400 text-sm">{t('cv.generated')}</p>
              </div>
            )}

            {/* Validation errors notification */}
            {showValidationErrors && Object.keys(validationErrors).length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-sm transition-colors duration-300">
                <p className="text-red-700 dark:text-red-400 text-sm font-medium">{t('validation.required')}</p>
                <ul className="text-red-600 dark:text-red-400 text-xs mt-1 list-disc list-inside">
                  {validationErrors.name && <li>{t('validation.name')}</li>}
                  {validationErrors.email && <li>{t('validation.email')}</li>}
                  {validationErrors.resume && <li>{t('validation.resume')}</li>}
                </ul>
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
              validationErrors={validationErrors}
              showValidationErrors={showValidationErrors}
            />

            {/* Render sections dynamically based on sectionOrder */}
            {sectionOrder.map((sectionKey, index) => {
              const canMoveUp = index > 0;
              const canMoveDown = index < sectionOrder.length - 1;
              
              const sectionElement = (() => {
                switch (sectionKey) {
                  case 'professional_summary':
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
                    
                  case 'professional_experience':
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
                    
                  case 'academic_education':
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
                    
                  case 'technical_skills':
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
                    
                  case 'languages':
                    return (
                      <Languages
                        languages={languages}
                        onLanguageChange={handleLanguageChange}
                        onAddLanguage={handleAddLanguage}
                        onRemoveLanguage={handleRemoveLanguage}
                        canReorder={true}
                        onMoveUp={() => handleMoveSectionUp(sectionKey)}
                        onMoveDown={() => handleMoveSectionDown(sectionKey)}
                        canMoveUp={canMoveUp}
                        canMoveDown={canMoveDown}
                      />
                    );
                    
                  case 'certifications':
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
                    
                  case 'projects':
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
                    
                  case 'volunteer':
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
                    if (sectionKey.startsWith('custom_')) {
                      const sectionId = sectionKey.replace('custom_', '');
                      const section = customSections.find((cs) => cs.id === sectionId);
                      if (!section) return null;

                      return (
                        <CustomSectionCard
                          section={section}
                          onTitleChange={(value) => handleUpdateCustomSectionTitle(sectionId, value)}
                          onAddField={() => handleAddCustomField(sectionId)}
                          onFieldChange={(fieldId, key, value) => handleUpdateCustomField(sectionId, fieldId, key, value)}
                          onRemoveField={(fieldId) => handleRemoveCustomField(sectionId, fieldId)}
                          onRemoveSection={() => handleRemoveCustomSection(sectionId)}
                          onReorderFields={(from, to) => handleReorderCustomFields(sectionId, from, to)}
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
                {t('custom.section.add')}
              </button>
            </div>

            {/* Example data button (hidden in production) */}
            {process.env.NODE_ENV !== 'production' && (
              <div className="w-full mt-8 mb-8 flex justify-center">
                <button
                  onClick={fillWithExampleData}
                  className="bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg text-sm sm:text-base w-full sm:w-auto"
                  type="button"
                >
                  {t('fill.example')}
                </button>
              </div>
            )}

            {/* Job Analysis section */}
            <div className="w-full">
              <JobAnalysis />
            </div>

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
            <div className="sticky top-28 h-[calc(100vh-7rem)]">
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
      </div>

      {/* Footer */}
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
        onShowPdfPreview={handleShowPdfPreview}
        onGeneratePDF={handleGeneratePDF}
        onShowSuccessMessage={() => setShowSuccessMessage(true)}
        onScrollToJobAnalysis={scrollToJobAnalysis}
        onScrollToCVTips={scrollToCVTips}
        onScrollToAtsExplanation={scrollToAtsExplanation}
        onExportXml={handleExportXml}
        onImportXml={handleImportXml}
        settings={renderSettings}
        onSettingsChange={setRenderSettings}
        onResetSectionOrder={handleResetSectionOrder}
        sectionOrder={sectionOrder}
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
        onScrollToJobAnalysis={scrollToJobAnalysis}
        onScrollToCVTips={scrollToCVTips}
        onScrollToAtsExplanation={scrollToAtsExplanation}
        onTemplateChange={setSelectedTemplate}
        sectionOrder={sectionOrder}
      />
    </div>
  );
}