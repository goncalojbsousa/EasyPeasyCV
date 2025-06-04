'use client';

import { useState } from 'react';
import { PersonalInformation } from './components/personal_information';
import { ProfessionalSummary } from './components/professional_summary';
import { ProfessionalExperience } from './components/professional_experience';
import { AcademicEducation } from './components/academic_education';
import { TechnicalSkills } from './components/technical_skills';
import { Languages } from './components/languages';
import { Certifications } from './components/certifications';

export default function Home() {
  // State management for all form sections
  const [step, setStep] = useState(1);
  const [links, setLinks] = useState([
    { type: 'LinkedIn', value: '' },
  ]);
  const [resume, setResume] = useState('');
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);

  // Define the steps for the CV builder process
  const STEPS = [
    'Informações Pessoais',
    'Resumo Profissional',
    'Experiência Profissional',
    'Formação Académica',
    'Habilidades Técnicas',
    'Idiomas',
    'Certificações/Cursos',
  ];

  // Handle social media link type changes
  const handleLinkTypeChange = (idx: number, newType: string) => {
    setLinks(links =>
      links.map((link, i) =>
        i === idx ? { ...link, type: newType, value: '' } : link
      )
    );
  };

  // Handle social media link value changes
  const handleLinkValueChange = (idx: number, newValue: string) => {
    setLinks(links =>
      links.map((link, i) =>
        i === idx ? { ...link, value: newValue } : link
      )
    );
  };

  // Add a new social media link
  const handleAddLink = () => {
    setLinks([...links, { type: 'LinkedIn', value: '' }]);
  };

  // Remove a social media link
  const handleRemoveLink = (idx: number) => {
    setLinks(links => links.filter((_, i) => i !== idx));
  };

  // Professional Experience handlers
  const handleAddExperience = () => {
    setExperiences([...experiences, {
      role: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, tech: '', activities: '', results: ''
    }]);
  };
  const handleRemoveExperience = (idx: number) => {
    setExperiences(experiences.filter((_, i) => i !== idx));
  };
  const handleExperienceChange = (idx: number, field: string, value: any) => {
    setExperiences(experiences.map((exp, i) => i === idx ? { ...exp, [field]: value } : exp));
  };

  // Academic Education handlers
  const handleAddEducation = () => {
    setEducation([...education, {
      type: '', status: '', course: '', institution: '', startMonth: '', startYear: '', description: ''
    }]);
  };
  const handleRemoveEducation = (idx: number) => {
    setEducation(education.filter((_, i) => i !== idx));
  };
  const handleEducationChange = (idx: number, field: string, value: any) => {
    setEducation(education.map((ed, i) => i === idx ? { ...ed, [field]: value } : ed));
  };

  // Languages handlers
  const handleAddLanguage = () => {
    setLanguages([...languages, { name: '', level: '' }]);
  };
  const handleRemoveLanguage = (idx: number) => {
    setLanguages(languages.filter((_, i) => i !== idx));
  };
  const handleLanguageChange = (idx: number, field: string, value: any) => {
    setLanguages(languages.map((lang, i) => i === idx ? { ...lang, [field]: value } : lang));
  };

  // Certifications/Courses handlers
  const handleAddCertification = () => {
    setCertifications([...certifications, {
      name: '', issuer: '', completionDate: '', hours: '', validationLink: '', description: ''
    }]);
  };
  const handleRemoveCertification = (idx: number) => {
    setCertifications(certifications.filter((_, i) => i !== idx));
  };
  const handleCertificationChange = (idx: number, field: string, value: any) => {
    setCertifications(certifications.map((cert, i) => i === idx ? { ...cert, [field]: value } : cert));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white px-6 py-10 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">CV Builder</h1>
            <p className="text-sm">Crie um currículo profissional em minutos</p>
          </div>
          <button className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            Gerar Currículo em PDF
          </button>
        </div>
      </header>

      <nav className="bg-white shadow px-6">
        <div className="max-w-6xl mx-auto flex gap-6 overflow-x-auto">
          {STEPS.map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i + 1)}
              className={`p-2 border-b-2 text-sm ${step === i + 1 ? 'text-blue-600' : 'border-transparent text-gray-600'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto pt-6">
        {step === 1 && (
          <PersonalInformation
            links={links}
            step={step}
            STEPS={STEPS}
            onLinkTypeChange={handleLinkTypeChange}
            onLinkValueChange={handleLinkValueChange}
            onAddLink={handleAddLink}
            onRemoveLink={handleRemoveLink}
            onStepChange={setStep}
          />
        )}
        {step === 2 && (
          <ProfessionalSummary
            resume={resume}
            step={step}
            STEPS={STEPS}
            onResumeChange={setResume}
            onStepChange={setStep}
          />
        )}
        {step === 3 && (
          <ProfessionalExperience
            experiences={experiences}
            step={step}
            STEPS={STEPS}
            onExperienceChange={handleExperienceChange}
            onAddExperience={handleAddExperience}
            onRemoveExperience={handleRemoveExperience}
            onStepChange={setStep}
          />
        )}
        {step === 4 && (
          <AcademicEducation
            education={education}
            step={step}
            STEPS={STEPS}
            onEducationChange={handleEducationChange}
            onAddEducation={handleAddEducation}
            onRemoveEducation={handleRemoveEducation}
            onStepChange={setStep}
          />
        )}
        {step === 5 && (
          <TechnicalSkills
            skills={skills}
            step={step}
            STEPS={STEPS}
            onSkillsChange={setSkills}
            onStepChange={setStep}
          />
        )}
        {step === 6 && (
          <Languages
            languages={languages}
            step={step}
            STEPS={STEPS}
            onLanguageChange={handleLanguageChange}
            onAddLanguage={handleAddLanguage}
            onRemoveLanguage={handleRemoveLanguage}
            onStepChange={setStep}
          />
        )}
        {step === 7 && (
          <Certifications
            certifications={certifications}
            step={step}
            STEPS={STEPS}
            onCertificationChange={handleCertificationChange}
            onAddCertification={handleAddCertification}
            onRemoveCertification={handleRemoveCertification}
            onStepChange={setStep}
          />
        )}
      </div>
    </div>
  );
}
