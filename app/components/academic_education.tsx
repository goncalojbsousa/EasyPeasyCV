'use client';

import { Education } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';
import { useState, useEffect, useRef } from 'react';

/**
 * Props interface for the AcademicEducation component
 */
interface AcademicEducationProps {
  /** Array of education entries */
  education: Education[];
  /** Handler for updating education fields */
  onEducationChange: (idx: number, field: string, value: string) => void;
  /** Handler for adding new education entry */
  onAddEducation: () => void;
  /** Handler for removing education entry */
  onRemoveEducation: (idx: number) => void;
}

/**
 * Available education types for dropdown selection
 */
const EDUCATION_TYPES = [
  'Ensino Secundário',
  'Técnico',
  'Licenciatura',
  'Pós-graduação',
  'Mestrado',
  'Doutoramento'
];

/**
 * Available education status options for dropdown selection
 */
const EDUCATION_STATUS = [
  'Completo',
  'Em andamento',
  'Interrompido'
];

/**
 * Array of month abbreviations for date selection
 */
const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

/**
 * AcademicEducation component manages the education section of the CV form
 * @param education - Array of education entries
 * @param onEducationChange - Function to handle education field updates
 * @param onAddEducation - Function to add new education entry
 * @param onRemoveEducation - Function to remove education entry
 * @returns JSX element representing the academic education form section
 */
export function AcademicEducation({
  education,
  onEducationChange,
  onAddEducation,
  onRemoveEducation
}: AcademicEducationProps) {
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
        title="Formação Académica" 
        icon={Icons.academicEducation}
        actionButton={
          <IconButton onClick={onAddEducation}>
            {Icons.add}
            Adicionar Formação
          </IconButton>
        }
      >
        {/* Display empty state when no education entries exist */}
        {education.length === 0 && (
          <EmptyState message="Nenhuma formação adicionada" />
        )}
        
        {/* Render each education entry */}
        {education.map((ed, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 relative mb-6">
            {/* Remove button positioned at top right */}
            <IconButton 
              onClick={() => onRemoveEducation(idx)} 
              variant="danger" 
              size="sm"
              className="absolute top-2 right-4"
            >
              {Icons.remove}
            </IconButton>
            
            {/* Education type and status fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField label="Tipo de Formação">
                <div ref={el => { dropdownRefs.current[`type-${idx}`] = el; }} className="relative">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left"
                    onClick={() => toggleDropdown(`type-${idx}`)}
                    tabIndex={0}
                  >
                    <span>{ed.type || 'Selecione'}</span>
                    <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`type-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  {openDropdowns[`type-${idx}`] && (
                    <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                      {EDUCATION_TYPES.map(type => (
                        <button
                          key={type}
                          type="button"
                          className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-150 ${ed.type === type ? 'bg-blue-50 font-semibold text-blue-700' : ''}`}
                          onClick={() => {
                            onEducationChange(idx, 'type', type);
                            setOpenDropdowns(prev => ({ ...prev, [`type-${idx}`]: false }));
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </FormField>
              <FormField label="Estado">
                <div ref={el => { dropdownRefs.current[`status-${idx}`] = el; }} className="relative">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left"
                    onClick={() => toggleDropdown(`status-${idx}`)}
                    tabIndex={0}
                  >
                    <span>{ed.status || 'Selecione'}</span>
                    <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`status-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  {openDropdowns[`status-${idx}`] && (
                    <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                      {EDUCATION_STATUS.map(status => (
                        <button
                          key={status}
                          type="button"
                          className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-150 ${ed.status === status ? 'bg-blue-50 font-semibold text-blue-700' : ''}`}
                          onClick={() => {
                            onEducationChange(idx, 'status', status);
                            setOpenDropdowns(prev => ({ ...prev, [`status-${idx}`]: false }));
                          }}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </FormField>
            </div>
            
            {/* Course and institution fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField label="Curso">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="Ex: Licenciatura em Engenharia Informática"
                  value={ed.course}
                  onChange={e => onEducationChange(idx, 'course', e.target.value)}
                />
              </FormField>
              <FormField label="Instituição">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="Ex: Universidade do Porto"
                  value={ed.institution}
                  onChange={e => onEducationChange(idx, 'institution', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Start date fields */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
              <FormField label="Mês Início">
                <div ref={el => { dropdownRefs.current[`startMonth-${idx}`] = el; }} className="relative">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left"
                    onClick={() => toggleDropdown(`startMonth-${idx}`)}
                    tabIndex={0}
                  >
                    <span>{ed.startMonth || 'Selecione'}</span>
                    <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`startMonth-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  {openDropdowns[`startMonth-${idx}`] && (
                    <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                      {MONTHS.map(month => (
                        <button
                          key={month}
                          type="button"
                          className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-150 ${ed.startMonth === month ? 'bg-blue-50 font-semibold text-blue-700' : ''}`}
                          onClick={() => {
                            onEducationChange(idx, 'startMonth', month);
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
                  value={ed.startYear}
                  onChange={e => onEducationChange(idx, 'startYear', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Description field */}
            <FormField label="Descrição">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all"
                placeholder="Ex: Tese sobre inteligência artificial, disciplinas relevantes, projetos académicos..."
                value={ed.description}
                onChange={e => onEducationChange(idx, 'description', e.target.value)}
              />
            </FormField>
          </div>
        ))}
      </FormSection>
    </form>
  );
} 