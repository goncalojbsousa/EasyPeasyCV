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
import { CVTips } from './components/cv_tips';
import { LanguageSelector } from './components/ui/language-selector';
import { Footer } from './components/footer';
import { PdfPreview } from './components/pdf_preview';
import { FloatingActionBar } from './components/ui/floating-action-bar';
import { DesktopActionsCard } from './components/ui/desktop-actions-card';
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
  const [links, setLinks] = useState<{type: string, value: string}[]>([]);
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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: boolean}>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);



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
            <LanguageSelector />
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="max-w-7xl mx-auto pt-36 sm:pt-28 pb-24 px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
          {/* Form content */}
          <div className="flex flex-col gap-6 sm:gap-8">
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
            onShowPdfPreview={() => setShowPdfPreview(true)}
            onGeneratePDF={handleGeneratePDF}
            onShowSuccessMessage={() => setShowSuccessMessage(true)}
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
        show={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        lang={language}
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
        onShowPdfPreview={() => setShowPdfPreview(true)}
        onGeneratePDF={handleGeneratePDF}
        onShowSuccessMessage={() => setShowSuccessMessage(true)}
      />
    </div>
  );
}
