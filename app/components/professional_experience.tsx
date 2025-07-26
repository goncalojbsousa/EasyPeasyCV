'use client';

import { Experience } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';
import { useState, useEffect, useRef } from 'react';

/**
 * Props interface for the ProfessionalExperience component
 */
interface ProfessionalExperienceProps {
  /** Array of professional experience entries */
  experiences: Experience[];
  /** Handler for updating experience fields */
  onExperienceChange: (idx: number, field: string, value: string | boolean) => void;
  /** Handler for adding new experience entry */
  onAddExperience: () => void;
  /** Handler for removing experience entry */
  onRemoveExperience: (idx: number) => void;
}

/**
 * Array of month abbreviations for date selection
 */
const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

/**
 * ProfessionalExperience component manages the professional experience section of the CV form
 * @param experiences - Array of professional experience entries
 * @param onExperienceChange - Function to handle experience field updates
 * @param onAddExperience - Function to add new experience entry
 * @param onRemoveExperience - Function to remove experience entry
 * @returns JSX element representing the professional experience form section
 */
export function ProfessionalExperience({
  experiences,
  onExperienceChange,
  onAddExperience,
  onRemoveExperience
}: ProfessionalExperienceProps) {
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Fecha dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      Object.keys(openDropdowns).forEach(key => {
        if (openDropdowns[key] && dropdownRefs.current[key]) {
          if (!dropdownRefs.current[key]?.contains(event.target as Node)) {
            setOpenDropdowns(prev => ({ ...prev, [key]: false }));
          }
        }
      });
    }
    
    if (Object.values(openDropdowns).some(Boolean)) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdowns]);

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title="Experiência Profissional" 
        icon={Icons.professionalExperience}
        actionButton={
          <IconButton onClick={onAddExperience}>
            {Icons.add}
            Adicionar Experiência
          </IconButton>
        }
      >
        {/* Display empty state when no experiences exist */}
        {experiences.length === 0 && (
          <EmptyState message="Nenhuma experiência adicionada" />
        )}
        
        {/* Render each experience entry */}
        {experiences.map((exp, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 relative mb-6">
            {/* Remove button positioned at top right */}
            <IconButton 
              onClick={() => onRemoveExperience(idx)} 
              variant="danger" 
              size="sm"
              className="absolute top-2 right-4"
            >
              {Icons.remove}
            </IconButton>
            
            {/* Job title and company fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField label="Cargo">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="Ex: Desenvolvedor Full Stack"
                  value={exp.role}
                  onChange={e => onExperienceChange(idx, 'role', e.target.value)}
                />
              </FormField>
              <FormField label="Empresa">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="Ex: Amazon"
                  value={exp.company}
                  onChange={e => onExperienceChange(idx, 'company', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Date range fields */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
              <FormField label="Mês Início">
                <div ref={el => { dropdownRefs.current[`startMonth-${idx}`] = el; }} className="relative">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left"
                    onClick={() => toggleDropdown(`startMonth-${idx}`)}
                    tabIndex={0}
                  >
                    <span>{exp.startMonth || 'Selecione'}</span>
                    <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`startMonth-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  {openDropdowns[`startMonth-${idx}`] && (
                    <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                      {MONTHS.map(month => (
                        <button
                          key={month}
                          type="button"
                          className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-150 ${exp.startMonth === month ? 'bg-blue-50 font-semibold text-blue-700' : ''}`}
                          onClick={() => {
                            onExperienceChange(idx, 'startMonth', month);
                            setOpenDropdowns(prev => ({ ...prev, [`startMonth-${idx}`]: false }));
                          }}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </FormField>
              <FormField label="Ano Início">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="Ano"
                  value={exp.startYear}
                  onChange={e => onExperienceChange(idx, 'startYear', e.target.value)}
                />
              </FormField>
              {/* End date fields (hidden when current job is selected) */}
              {!exp.current && (
                <>
                  <FormField label="Mês Fim">
                    <div ref={el => { dropdownRefs.current[`endMonth-${idx}`] = el; }} className="relative">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left"
                        onClick={() => toggleDropdown(`endMonth-${idx}`)}
                        tabIndex={0}
                      >
                        <span>{exp.endMonth || 'Selecione'}</span>
                        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`endMonth-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                      {openDropdowns[`endMonth-${idx}`] && (
                        <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                          {MONTHS.map(month => (
                            <button
                              key={month}
                              type="button"
                              className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-150 ${exp.endMonth === month ? 'bg-blue-50 font-semibold text-blue-700' : ''}`}
                              onClick={() => {
                                onExperienceChange(idx, 'endMonth', month);
                                setOpenDropdowns(prev => ({ ...prev, [`endMonth-${idx}`]: false }));
                              }}
                            >
                              {month}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormField>
                  <FormField label="Ano Fim">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      placeholder="Ano"
                      value={exp.endYear}
                      onChange={e => onExperienceChange(idx, 'endYear', e.target.value)}
                    />
                  </FormField>
                </>
              )}
            </div>
            
            {/* Current job checkbox */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={e => onExperienceChange(idx, 'current', e.target.checked)}
                id={`current-${idx}`}
                className="mr-2"
              />
              <label htmlFor={`current-${idx}`} className="text-sm">Atual</label>
            </div>
            
            {/* Technologies used field */}
            <div className="mb-4">
              <FormField label="Tecnologias Utilizadas">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="Ex: TypeScript, Next.js, Tailwind CSS"
                  value={exp.tech}
                  onChange={e => onExperienceChange(idx, 'tech', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Activities and responsibilities field */}
            <div className="mb-4">
              <FormField label="Atividades Desenvolvidas">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="Descreva suas responsabilidades (um item por linha)"
                  value={exp.activities}
                  onChange={e => onExperienceChange(idx, 'activities', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Achievements and results field */}
            <FormField label="Conquistas" helperText="com métricas">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all"
                placeholder="Ex: Reestruturei a arquitetura da aplicação usando Next.js com SSR, o que melhorou o SEO e aumentou a retenção de usuários em 25%."
                value={exp.results}
                onChange={e => onExperienceChange(idx, 'results', e.target.value)}
              />
            </FormField>
          </div>
        ))}
      </FormSection>
    </form>
  );
} 