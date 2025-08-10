'use client';

import { Education } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { SortableList, DragHandle } from './dnd/sortable-list';
import { MONTHS_EN as MONTHS, toEN, getTranslatedMonthWithT } from '../utils/months';

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
  'education.type.secondary',
  'education.type.technical',
  'education.type.bachelor',
  'education.type.postgraduate',
  'education.type.master',
  'education.type.phd'
];

/**
 * Available education status options for dropdown selection
 */
const EDUCATION_STATUS = [
  'education.status.completed',
  'education.status.in.progress',
  'education.status.interrupted'
];

/**
 * Academic Education component
 * Manages educational background entries with drag-and-drop reordering
 * @param education - Array of education entries
 * @param onEducationChange - Function to handle education field updates
 * @param onAddEducation - Function to add new education entry
 * @param onRemoveEducation - Function to remove education entry
 * @param onReorderEducation - Function to reorder education entries
 * @returns JSX element representing the academic education form section
 */
export function AcademicEducation({
  education,
  onEducationChange,
  onAddEducation,
  onRemoveEducation,
  onReorderEducation
}: AcademicEducationProps) {
  const { t } = useLanguage();
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  // Drag & drop handled by SortableList

  // Month helpers provided by shared util

  // Generates a display title for each education card based on available data
  const getEducationTitle = (ed: Education, idx: number) => {
    if (ed.course && ed.type) return `${ed.course} | ${t(ed.type)}`;
    if (ed.course) return ed.course;
    if (ed.type) return t(ed.type);
    return `${t('education.title')} ${idx + 1}`;
  };

  // Closes all dropdowns when clicking outside any dropdown element
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
        title={t('section.academic.education')} 
        icon={Icons.academicEducation}
      >
        {/* Display empty state when no education entries exist */}
        {education.length === 0 && (
          <EmptyState message={t('empty.education')} />
        )}
        
        {/* Render each education entry via SortableList */}
        <SortableList
          length={education.length}
          onReorder={(from, to) => onReorderEducation && onReorderEducation(from, to)}
          renderItem={(idx) => {
            const ed = education[idx];
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm relative mb-6 transition-all duration-300"
              >
                {/* Card header with title */}
                <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 border-b border-gray-200 dark:border-zinc-700 rounded-t-lg transition-colors duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {education.length > 1 && (
                        <DragHandle
                          ariaLabel="Reorder education"
                          className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors duration-300"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                          </svg>
                        </DragHandle>
                      )}
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {getEducationTitle(ed, idx)}
                      </h3>
                    </div>
                    <IconButton 
                      onClick={() => onRemoveEducation(idx)} 
                      variant="danger" 
                      size="sm"
                      ariaLabel="Remove education"
                    >
                      {Icons.remove}
                    </IconButton>
                  </div>
                </div>
                
                {/* Card content */}
                <div className="p-4">
                
                {/* Education type and status fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <FormField label={t('field.education.type')}>
                    <div ref={el => { dropdownRefs.current[`type-${idx}`] = el; }} className="relative">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left text-gray-900 dark:text-gray-100"
                        onClick={() => toggleDropdown(`type-${idx}`)}
                        tabIndex={0}
                      >
                        <span>{ed.type ? t(ed.type) : t('select.education.type')}</span>
                        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`type-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                      {openDropdowns[`type-${idx}`] && (
                        <div className="absolute left-0 mt-2 w-full bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-1 z-50">
                          {EDUCATION_TYPES.map(type => (
                            <button
                              key={type}
                              type="button"
                              className={`w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 ${ed.type === type ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-400' : ''}`}
                              onClick={() => {
                                onEducationChange(idx, 'type', type);
                                setOpenDropdowns(prev => ({ ...prev, [`type-${idx}`]: false }));
                              }}
                            >
                              {t(type)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormField>
                  <FormField label={t('field.education.status')}>
                    <div ref={el => { dropdownRefs.current[`status-${idx}`] = el; }} className="relative">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left text-gray-900 dark:text-gray-100"
                        onClick={() => toggleDropdown(`status-${idx}`)}
                        tabIndex={0}
                      >
                        <span>{ed.status ? t(ed.status) : t('select.education.status')}</span>
                        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`status-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                      {openDropdowns[`status-${idx}`] && (
                        <div className="absolute left-0 mt-2 w-full bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-1 z-50">
                          {EDUCATION_STATUS.map(status => (
                            <button
                              key={status}
                              type="button"
                              className={`w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 ${ed.status === status ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-400' : ''}`}
                              onClick={() => {
                                onEducationChange(idx, 'status', status);
                                setOpenDropdowns(prev => ({ ...prev, [`status-${idx}`]: false }));
                              }}
                            >
                              {t(status)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormField>
                </div>
                
                {/* Course and institution fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <FormField label={t('field.course')}>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.course')}
                      value={ed.course}
                      onChange={e => onEducationChange(idx, 'course', e.target.value)}
                    />
                  </FormField>
                  <FormField label={t('field.institution')}>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.institution')}
                      value={ed.institution}
                      onChange={e => onEducationChange(idx, 'institution', e.target.value)}
                    />
                  </FormField>
                </div>
                
                {/* Date fields - Start and End dates in parallel */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4">
                  <FormField label={t('field.start.month')}>
                    <div ref={el => { dropdownRefs.current[`startMonth-${idx}`] = el; }} className="relative">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left text-sm text-gray-900 dark:text-gray-100"
                        onClick={() => toggleDropdown(`startMonth-${idx}`)}
                        tabIndex={0}
                      >
                        <span>{ed.startMonth ? getTranslatedMonthWithT(t, ed.startMonth) : t('select.month')}</span>
                        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`startMonth-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                      {openDropdowns[`startMonth-${idx}`] && (
                        <div className="absolute left-0 mt-2 w-full bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-1 z-50">
                          {MONTHS.map(month => (
                            <button
                              key={month}
                              type="button"
                              className={`w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 ${toEN(ed.startMonth) === month ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-400' : ''}`}
                              onClick={() => {
                                onEducationChange(idx, 'startMonth', month);
                                setOpenDropdowns(prev => ({ ...prev, [`startMonth-${idx}`]: false }));
                              }}
                            >
                              {getTranslatedMonthWithT(t, month)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormField>
                  <FormField label={t('field.start.year')}>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.year')}
                      value={ed.startYear}
                      onChange={e => onEducationChange(idx, 'startYear', e.target.value)}
                    />
                  </FormField>
                  
                  {/* End date fields - only show if status is "Completo" */}
                  {(ed.status === 'education.status.completed') && (
                    <>
                      <FormField label={t('field.end.month')}>
                        <div ref={el => { dropdownRefs.current[`endMonth-${idx}`] = el; }} className="relative">
                          <button
                            type="button"
                            className="w-full flex items-center justify-between p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left text-sm text-gray-900 dark:text-gray-100"
                            onClick={() => toggleDropdown(`endMonth-${idx}`)}
                            tabIndex={0}
                          >
                            <span>{ed.endMonth ? getTranslatedMonthWithT(t, ed.endMonth) : t('select.month')}</span>
                            <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`endMonth-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                          </button>
                          {openDropdowns[`endMonth-${idx}`] && (
                            <div className="absolute left-0 mt-2 w-full bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-1 z-50">
                              {MONTHS.map(month => (
                                <button
                                  key={month}
                                  type="button"
                                  className={`w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 ${toEN(ed.endMonth) === month ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-400' : ''}`}
                                  onClick={() => {
                                    onEducationChange(idx, 'endMonth', month);
                                    setOpenDropdowns(prev => ({ ...prev, [`endMonth-${idx}`]: false }));
                                  }}
                                >
                                  {getTranslatedMonthWithT(t, month)}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormField>
                      <FormField label={t('field.end.year')}>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                          placeholder={t('placeholder.year')}
                          value={ed.endYear}
                          onChange={e => onEducationChange(idx, 'endYear', e.target.value)}
                        />
                      </FormField>
                    </>
                  )}
                </div>
                
                {/* Description field */}
                <FormField label={t('field.description')}>
                                  <textarea
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.education.description')}
                      value={ed.description}
                      onChange={e => onEducationChange(idx, 'description', e.target.value)}
                    />
                </FormField>
                </div>
              </div>
            );
          }}
        />
        
        {/* Add education button at bottom */}
        <div className="flex justify-start mt-4">
          <IconButton onClick={onAddEducation}>
            {Icons.add}
            {t('add.education')}
          </IconButton>
        </div>
      </FormSection>
    </form>
  );
} 