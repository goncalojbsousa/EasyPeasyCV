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
  /** Handler for reordering education entries */
  onReorderEducation?: (fromIndex: number, toIndex: number) => void;
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
  onRemoveEducation,
  onReorderEducation
}: AcademicEducationProps) {
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Helper function to generate smart titles for education cards
  const getEducationTitle = (ed: Education, idx: number) => {
    if (ed.course && ed.type) return `${ed.course} | ${ed.type}`;
    if (ed.course) return ed.course;
    if (ed.type) return ed.type;
    return `Formação ${idx + 1}`;
  };

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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Enhanced auto-scroll with variable speed based on distance from edge
    const scrollThreshold = 150; // pixels from top/bottom
    const maxScrollSpeed = 15;
    
    if (e.clientY < scrollThreshold) {
      // Scroll up with variable speed
      const distanceFromEdge = scrollThreshold - e.clientY;
      const scrollSpeed = Math.min(maxScrollSpeed, Math.max(5, distanceFromEdge / 10));
      window.scrollBy(0, -scrollSpeed);
    } else if (e.clientY > window.innerHeight - scrollThreshold) {
      // Scroll down with variable speed
      const distanceFromEdge = e.clientY - (window.innerHeight - scrollThreshold);
      const scrollSpeed = Math.min(maxScrollSpeed, Math.max(5, distanceFromEdge / 10));
      window.scrollBy(0, scrollSpeed);
    }
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorderEducation) {
      onReorderEducation(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title="Formação Académica" 
        icon={Icons.academicEducation}
      >
        {/* Display empty state when no education entries exist */}
        {education.length === 0 && (
          <EmptyState message="Nenhuma formação adicionada" />
        )}
        
        {/* Render each education entry */}
        {education.map((ed, idx) => (
          <div 
            key={idx} 
            className={`bg-white border border-gray-200 rounded-lg shadow-sm relative mb-6 transition-all ${
              draggedIndex === idx ? 'opacity-50 scale-95' : ''
            }`}
            onDragOver={education.length > 1 ? handleDragOver : undefined}
            onDragEnter={education.length > 1 ? () => handleDragEnter(idx) : undefined}
            onDrop={education.length > 1 ? (e) => handleDrop(e, idx) : undefined}
          >
            {/* Drop indicator - shows between items */}
            {dragOverIndex === idx && draggedIndex !== idx && (
              <div className="absolute left-0 -top-3 w-full h-0.5 bg-blue-500 rounded-full z-10"></div>
            )}
            {/* Card header with title */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {education.length > 1 && (
                    <div 
                      className="text-gray-400 cursor-move hover:text-gray-600 transition-colors"
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={handleDragOver}
                      onDragEnter={() => handleDragEnter(idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                      </svg>
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-gray-700">
                    {getEducationTitle(ed, idx)}
                  </h3>
                </div>
                <IconButton 
                  onClick={() => onRemoveEducation(idx)} 
                  variant="danger" 
                  size="sm"
                >
                  {Icons.remove}
                </IconButton>
              </div>
            </div>
            
            {/* Card content */}
            <div className="p-4">
            
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
              <FormField label="Curso">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm"
                  placeholder="Ex: Licenciatura em Engenharia Informática"
                  value={ed.course}
                  onChange={e => onEducationChange(idx, 'course', e.target.value)}
                />
              </FormField>
              <FormField label="Instituição">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm"
                  placeholder="Ex: Universidade do Porto"
                  value={ed.institution}
                  onChange={e => onEducationChange(idx, 'institution', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Date fields - Start and End dates in parallel */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4">
              <FormField label="Mês Início">
                <div ref={el => { dropdownRefs.current[`startMonth-${idx}`] = el; }} className="relative">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left text-sm"
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
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm"
                  placeholder="Ano"
                  value={ed.startYear}
                  onChange={e => onEducationChange(idx, 'startYear', e.target.value)}
                />
              </FormField>
              
              {/* End date fields - only show if status is "Completo" */}
              {(ed.status === 'Completo' || ed.status === 'Completed') && (
                <>
                  <FormField label="Mês Fim">
                    <div ref={el => { dropdownRefs.current[`endMonth-${idx}`] = el; }} className="relative">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left text-sm"
                        onClick={() => toggleDropdown(`endMonth-${idx}`)}
                        tabIndex={0}
                      >
                        <span>{ed.endMonth || 'Selecione'}</span>
                        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`endMonth-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                      {openDropdowns[`endMonth-${idx}`] && (
                        <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                          {MONTHS.map(month => (
                            <button
                              key={month}
                              type="button"
                              className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-150 ${ed.endMonth === month ? 'bg-blue-50 font-semibold text-blue-700' : ''}`}
                              onClick={() => {
                                onEducationChange(idx, 'endMonth', month);
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
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm"
                      placeholder="Ano"
                      value={ed.endYear}
                      onChange={e => onEducationChange(idx, 'endYear', e.target.value)}
                    />
                  </FormField>
                </>
              )}
            </div>
            
            {/* Description field */}
            <FormField label="Descrição">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm"
                placeholder="Ex: Tese sobre inteligência artificial, disciplinas relevantes, projetos académicos..."
                value={ed.description}
                onChange={e => onEducationChange(idx, 'description', e.target.value)}
              />
            </FormField>
            </div>
          </div>
        ))}
        
        {/* Add education button at bottom */}
        <div className="flex justify-start mt-4">
          <IconButton onClick={onAddEducation}>
            {Icons.add}
            Adicionar Formação
          </IconButton>
        </div>
      </FormSection>
    </form>
  );
} 