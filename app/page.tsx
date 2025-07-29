'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PersonalInformation } from './components/personal_information';
import { ProfessionalSummary } from './components/professional_summary';
import { ProfessionalExperience } from './components/professional_experience';
import { AcademicEducation } from './components/academic_education';
import { TechnicalSkills } from './components/technical_skills';
import { Languages } from './components/languages';
import { Certifications } from './components/certifications';
import PdfDownloadButton from './components/pdf_download_button';
import { Projects } from './components/projects';
import { CVTips } from './components/cv_tips';
import { LanguageSelector } from './components/ui/language-selector';
import { CVTypeSelector } from './components/ui/cv-type-selector';
import { Footer } from './components/footer';
import { PdfPreview } from './components/pdf_preview';
import { useLanguage } from './contexts/LanguageContext';
import { Experience, Education, Language, Certification, Project } from './types/cv';

/**
 * Main CV Builder application component
 * Manages all form state and provides a complete CV creation interface
 * @returns JSX element representing the main CV builder application
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
  const [links, setLinks] = useState([]);
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: boolean}>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);



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
    const errors: {[key: string]: boolean} = {};
    
    if (!personalInfo.name.trim()) errors.name = true;
    if (!personalInfo.email.trim()) errors.email = true;
    if (!personalInfo.desiredRole.trim()) errors.desiredRole = true;
    if (!resume.trim()) errors.resume = true;
    
    setValidationErrors(errors);
    
    // Hide errors if all fields are filled
    if (Object.keys(errors).length === 0) {
      setShowValidationErrors(false);
    }
  }, [personalInfo.name, personalInfo.email, personalInfo.desiredRole, resume]);

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
      projects
    };
    localStorage.setItem('cv-builder-data', JSON.stringify(data));
  }, [personalInfo, links, resume, experiences, education, skills, languages, certifications, projects]);

  // Auto-save data when any field changes
  useEffect(() => {
    // Only save if initial data has been loaded (avoid overwriting saved data)
    if (personalInfo.name !== '' || resume !== '' || experiences.length > 0 || education.length > 0) {
      saveToLocalStorage();
    }
  }, [saveToLocalStorage, personalInfo.name, resume, experiences.length, education.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);



  /**
   * Add a new social media link
   */
  const handleAddLink = (type: string = 'LinkedIn', value: string = '') => {
    setLinks([...links, { type, value }]);
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
   * Add a new education entry
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
      // Scroll to first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false; // Return false to prevent PDF generation
    }
    
    return true; // Return true to allow PDF generation
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
  };

  /**
   * PDF download button component with validation
   * Wraps the PDF download button with form validation logic
   * @param lang - Language for the PDF (pt or en)
   * @param children - Content to display in the button
   * @returns JSX element with validation logic
   */
  const PdfDownloadButtonWithValidation = ({ lang, children }: { lang: string; children: React.ReactNode }) => {
    const handleClick = (e: React.MouseEvent) => {
      if (!handleGeneratePDF()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        // Close dropdown after a short delay to allow PDF generation to start
        setTimeout(() => {
          setIsDropdownOpen(false);
          // Show success message
          setShowSuccessMessage(true);
        }, 100);
      }
    };

    return (
      <div onClick={handleClick}>
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
          lang={lang}
        >
          {children}
        </PdfDownloadButton>
      </div>
    );
  };

  return (
          <div className="min-h-screen bg-gray-100">
      {/* Header with title and PDF generation dropdown */}
      <header className="bg-white px-4 sm:px-6 py-3 sm:py-4 shadow fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">{t('app.title')}</h1>
            <p className="text-xs sm:text-sm">{t('app.subtitle')}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-end gap-2 w-full sm:w-auto">
            <CVTypeSelector />
            <LanguageSelector />
            <button
              onClick={() => setShowPdfPreview(true)}
              className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:inline">{t('preview.cv')}</span>
              <span className="sm:hidden">{t('preview')}</span>
            </button>
            <div className="relative w-full sm:w-auto" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto text-sm sm:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span className="hidden sm:inline">{t('generate.resume')}</span>
                <span className="sm:hidden">{t('generate.cv')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Language selection dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-full sm:w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    {t('select.language')}
                  </div>
                  <div className="py-1">
                    <PdfDownloadButtonWithValidation lang="pt">
                      <div className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="sm:w-6 sm:h-6">
                          <path d="M5,4H13V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#2b6519"></path>
                          <path d="M16,4h15V28h-15c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" transform="rotate(180 21.5 16)" fill="#ea3323"></path>
                          <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                          <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                          <circle cx="12" cy="16" r="5" fill="#ff5"></circle>
                          <path d="M14.562,13.529l-5.125-.006v3.431h0c.004,.672,.271,1.307,.753,1.787,.491,.489,1.132,.759,1.805,.759,.684,0,1.328-.267,1.813-.75,.485-.484,.753-1.126,.753-1.808v-3.413Z" fill="#ea3323"></path>
                        </svg>
                        <span className="font-medium text-sm sm:text-base">{t('language.portuguese')}</span>
                      </div>
                    </PdfDownloadButtonWithValidation>
                    <PdfDownloadButtonWithValidation lang="en">
                      <div className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="sm:w-6 sm:h-6">
                          <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect>
                          <path d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z" fill="#fff"></path>
                          <path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path>
                          <path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path>
                          <path d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z" fill="#fff"></path>
                          <rect x="13" y="4" width="6" height="24" fill="#fff"></rect>
                          <rect x="1" y="13" width="30" height="6" fill="#fff"></rect>
                          <rect x="14" y="4" width="4" height="24" fill="#b92932"></rect>
                          <rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect>
                          <path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path>
                          <path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path>
                          <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                          <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                        </svg>
                        <span className="font-medium text-sm sm:text-base">{t('language.english')}</span>
                      </div>
                    </PdfDownloadButtonWithValidation>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="max-w-6xl mx-auto pt-36 sm:pt-28 pb-8 px-4 sm:px-6 flex flex-col gap-6 sm:gap-8">
        {/* Data loaded notification */}
        {dataLoaded && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm">
            <p className="text-green-700 text-sm">{t('data.loaded')}</p>
          </div>
        )}
        
        {/* Success message notification */}
        {showSuccessMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm">
            <p className="text-green-700 text-sm">{t('cv.generated')}</p>
          </div>
        )}
        
        {/* Validation errors notification */}
        {showValidationErrors && Object.keys(validationErrors).length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
            <p className="text-red-700 text-sm font-medium">{t('validation.required')}</p>
            <ul className="text-red-600 text-xs mt-1 list-disc list-inside">
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
          validationErrors={validationErrors}
          showValidationErrors={showValidationErrors}
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
        
        {/* Example data button */}
        <div className="max-w-6xl mx-auto mt-8 mb-8 flex justify-center">
                      <button
              onClick={fillWithExampleData}
              className="bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg text-sm sm:text-base w-full sm:w-auto"
              type="button"
            >
                            {t('fill.example')}
          </button>
        </div>
        
        {/* CV Tips section */}
        <div className="max-w-6xl mx-auto w-full">
          <CVTips />
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
        show={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        lang={language}
      />
    </div>
  );
}
