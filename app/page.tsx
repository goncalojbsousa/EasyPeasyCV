'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PersonalInformation } from './components/personal_information';
import { ProfessionalSummary } from './components/professional_summary';
import { ProfessionalExperience } from './components/professional_experience';
import { AcademicEducation } from './components/academic_education';
import { TechnicalSkills } from './components/technical_skills';
import { Languages } from './components/languages';
import { Certifications } from './components/certifications';
import { Projects } from './components/projects';
import { VolunteerWork } from './components/volunteer';
import { CVTips } from './components/cv_tips';
import { JobAnalysis } from './components/job_analysis';
import { AtsExplanation } from './components/ats_explanation';
import { LanguageSelector } from './components/ui/language-selector';
import { Footer } from './components/footer';
import { PdfPreview } from './components/pdf_preview';
import { FloatingActionBar } from './components/ui/floating-action-bar';
import { DesktopActionsCard } from './components/ui/desktop-actions-card';
import { CvTypeSelector } from './components/ui/cv-type-selector';
import { ColorSelector } from './components/ui/color-selector';
import { useLanguage } from './contexts/LanguageContext';
import { Experience, Education, Language, Certification, Project, Volunteer, CvColor } from './types/cv';
import { ThemeToggle } from './components/theme-toggle';

/**
 * Main OpenCVLab application component
 * Manages all form state and provides a complete CV creation interface
 * @returns JSX element representing the main OpenCVLab application
 */
export default function Home() {
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
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'creative'>('classic');
  const [selectedColor, setSelectedColor] = useState<CvColor>('blue');



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
        setSelectedTemplate(data.template || 'classic');
        setSelectedColor(data.color || 'blue');
        setDataLoaded(true);
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
        await import('./components/pdf_download_button');
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
    if (!personalInfo.desiredRole.trim()) errors.desiredRole = true;

    setValidationErrors(errors);

    // Hide errors if all fields are filled
    if (Object.keys(errors).length === 0) {
      setShowValidationErrors(false);
    }
  }, [personalInfo.name, personalInfo.email, personalInfo.desiredRole]);

  /**
   * Function to save data to localStorage
   * Stores all form data
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
      template: selectedTemplate,
      color: selectedColor
    };
    localStorage.setItem('cv-builder-data', JSON.stringify(data));
  }, [personalInfo, links, resume, experiences, education, skills, languages, certifications, projects, selectedTemplate, selectedColor]);

  // Auto-save data when any field changes
  useEffect(() => {
    // Only save if initial data has been loaded (avoid overwriting saved data)
    if (personalInfo.name !== '' || resume !== '' || experiences.length > 0 || education.length > 0) {
      saveToLocalStorage();
    }
  }, [saveToLocalStorage, personalInfo.name, resume, experiences.length, education.length]);





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
      type: '', status: '', course: '', institution: '', startMonth: '', startYear: '', endMonth: '', endYear: '', description: ''
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
      { name: '', description: '', link: '', tech: '', year: '' }
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

  /**
   * Function to update personal information fields
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
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
        const { CvDocument } = await import('./components/cv_document');

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
            lang={language}
            template={selectedTemplate}
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
      },
      {
        name: 'Task Management App',
        description: 'Simple React application for managing daily tasks and deadlines.',
        tech: 'React, Redux, LocalStorage',
        link: 'github.com/johndoe/task-manager',
        year: '2023',
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
      {/* Header with title and PDF generation dropdown */}
      <header className="bg-white dark:bg-zinc-800 shadow fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.webp" 
              alt="OpenCVLab Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">{t('app.title')}</h1>
              <p className="text-xs sm:text-sm">{t('app.subtitle')}</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2 sm:w-auto">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto pt-28 pb-24 px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
          {/* Form content */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Data loaded notification */}
            {dataLoaded && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-sm transition-colors duration-300">
                <p className="text-green-700 dark:text-green-400 text-sm">{t('data.loaded')}</p>
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
                  {validationErrors.desiredRole && <li>{t('validation.role')}</li>}
                  {validationErrors.resume && <li>{t('validation.resume')}</li>}
                </ul>
              </div>
            )}

            {/* Personal Information section */}
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

            {/* Professional Summary section */}
            <ProfessionalSummary
              resume={resume}
              onResumeChange={handleResumeChange}
            />

            {/* Professional Experience section */}
            <ProfessionalExperience
              experiences={experiences}
              onExperienceChange={handleExperienceChange}
              onAddExperience={handleAddExperience}
              onRemoveExperience={handleRemoveExperience}
              onReorderExperiences={handleReorderExperiences}
            />

            {/* Academic Education section */}
            <AcademicEducation
              education={education}
              onEducationChange={handleEducationChange}
              onAddEducation={handleAddEducation}
              onRemoveEducation={handleRemoveEducation}
              onReorderEducation={handleReorderEducation}
            />

            {/* Technical Skills section */}
            <TechnicalSkills
              skills={skills}
              onSkillsChange={setSkills}
            />

            {/* Languages section */}
            <Languages
              languages={languages}
              onLanguageChange={handleLanguageChange}
              onAddLanguage={handleAddLanguage}
              onRemoveLanguage={handleRemoveLanguage}
            />

            {/* Certifications section */}
            <Certifications
              certifications={certifications}
              onCertificationChange={handleCertificationChange}
              onAddCertification={handleAddCertification}
              onRemoveCertification={handleRemoveCertification}
              onReorderCertifications={handleReorderCertifications}
            />

            {/* Projects section */}
            <Projects
              projects={projects}
              onProjectChange={handleProjectChange}
              onAddProject={handleAddProject}
              onRemoveProject={handleRemoveProject}
              onReorderProjects={handleReorderProjects}
            />

            {/* Volunteer Work section */}
            <VolunteerWork
              volunteers={volunteers}
              onVolunteerChange={handleVolunteerChange}
              onAddVolunteer={handleAddVolunteer}
              onRemoveVolunteer={handleRemoveVolunteer}
              onReorderVolunteers={handleReorderVolunteers}
            />

            {/* Example data button */}
            <div className="max-w-6xl mx-auto mt-8 mb-8 flex justify-center">
              <button
                onClick={fillWithExampleData}
                className="bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg text-sm sm:text-base w-full sm:w-auto"
                type="button"
              >
                {t('fill.example')}
              </button>
            </div>

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

          {/* Desktop Actions Card */}
          <DesktopActionsCard
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
            template={selectedTemplate}
            color={selectedColor}
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
          />
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
        show={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        lang={language}
        template={selectedTemplate}
        color={selectedColor}
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
        template={selectedTemplate}
        color={selectedColor}
        onShowPdfPreview={handleShowPdfPreview}
        onGeneratePDF={handleGeneratePDF}
        onShowSuccessMessage={() => setShowSuccessMessage(true)}
        onScrollToJobAnalysis={scrollToJobAnalysis}
        onScrollToCVTips={scrollToCVTips}
        onScrollToAtsExplanation={scrollToAtsExplanation}
        onTemplateChange={setSelectedTemplate}
      />
    </div>
  );
}
