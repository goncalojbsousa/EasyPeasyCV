'use client';

import { useState, useRef, useEffect } from 'react';
import { SortableList, DragHandle } from './dnd/sortable-list';
import { Volunteer } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { MONTHS_EN as MONTHS, toEN, getTranslatedMonthWithT } from '../utils/months';

/**
 * Props interface for the Volunteer component
 */
interface VolunteerProps {
  /** Array of volunteer entries */
  volunteers: Volunteer[];
  /** Handler for updating volunteer fields */
  onVolunteerChange: (idx: number, field: string, value: string | boolean) => void;
  /** Handler for adding new volunteer entry */
  onAddVolunteer: () => void;
  /** Handler for removing volunteer entry */
  onRemoveVolunteer: (idx: number) => void;
  /** Handler for reordering volunteer entries */
  onReorderVolunteers?: (fromIndex: number, toIndex: number) => void;
}

/**
 * Volunteer component
 * Manages volunteer work entries with drag-and-drop reordering
 * @param volunteers - Array of volunteer entries
 * @param onVolunteerChange - Function to handle volunteer field updates
 * @param onAddVolunteer - Function to add new volunteer entry
 * @param onRemoveVolunteer - Function to remove volunteer entry
 * @param onReorderVolunteers - Function to reorder volunteer entries
 * @returns JSX element representing the volunteer form section
 */
export function VolunteerWork({
  volunteers,
  onVolunteerChange,
  onAddVolunteer,
  onRemoveVolunteer,
  onReorderVolunteers
}: VolunteerProps) {
  const { t } = useLanguage();
  
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Month helpers provided by shared util

  // Closes all dropdowns when clicking outside any dropdown element
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isDropdown = Object.values(dropdownRefs.current).some(ref => ref?.contains(target));
      if (!isDropdown) {
        setOpenDropdowns({});
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggles the open/close state of a dropdown by key
  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  // Generates a display title for each volunteer card based on available data
  const getVolunteerTitle = (vol: Volunteer, idx: number) => {
    if (vol.role && vol.organization) return `${vol.role} | ${vol.organization}`;
    if (vol.role) return vol.role;
    if (vol.organization) return vol.organization;
    return `${t('volunteer.title')} ${idx + 1}`;
  };

  // Drag & drop is managed by SortableList

  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title={t('section.volunteer')} 
        icon={Icons.volunteer}
      >
        {/* Display empty state when no volunteers exist */}
        {volunteers.length === 0 && (
          <EmptyState message={t('empty.volunteer')} />
        )}
        
        {/* Render each volunteer entry via SortableList */}
        <SortableList
          length={volunteers.length}
          onReorder={(from, to) => onReorderVolunteers && onReorderVolunteers(from, to)}
          renderItem={(idx) => {
            const vol = volunteers[idx];
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm relative mb-6 transition-all duration-300"
              >
                {/* Card header with title */}
                <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 border-b border-gray-200 dark:border-zinc-700 rounded-t-lg transition-colors duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {volunteers.length > 1 && (
                        <DragHandle
                          ariaLabel="Reorder volunteer"
                          className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors duration-300"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                          </svg>
                        </DragHandle>
                      )}
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {getVolunteerTitle(vol, idx)}
                      </h3>
                    </div>
                    <IconButton 
                      onClick={() => onRemoveVolunteer(idx)} 
                      variant="danger" 
                      size="sm"
                      ariaLabel="Remove volunteer experience"
                    >
                      {Icons.remove}
                    </IconButton>
                  </div>
                </div>
                
                {/* Card content */}
                <div className="p-4">
                
                {/* Organization and role fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <FormField label={t('field.organization')}>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.organization')}
                      value={vol.organization}
                      onChange={e => onVolunteerChange(idx, 'organization', e.target.value)}
                    />
                  </FormField>
                  <FormField label={t('field.role')}>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.role')}
                      value={vol.role}
                      onChange={e => onVolunteerChange(idx, 'role', e.target.value)}
                    />
                  </FormField>
                </div>
                
                {/* Date range fields */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4">
                  <FormField label={t('field.start.month')}>
                    <div ref={el => { dropdownRefs.current[`startMonth-${idx}`] = el; }} className="relative">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left text-sm text-gray-900 dark:text-gray-100"
                        onClick={() => toggleDropdown(`startMonth-${idx}`)}
                        tabIndex={0}
                      >
                        <span>{vol.startMonth ? getTranslatedMonthWithT(t, vol.startMonth) : t('select.month')}</span>
                        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`startMonth-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                      {openDropdowns[`startMonth-${idx}`] && (
                        <div className="absolute left-0 mt-2 w-full bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-1 z-50">
                          {MONTHS.map(month => (
                            <button
                              key={month}
                              type="button"
                              className={`w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 ${toEN(vol.startMonth) === month ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-400' : ''}`}
                              onClick={() => {
                                onVolunteerChange(idx, 'startMonth', month);
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
                      value={vol.startYear}
                      onChange={e => onVolunteerChange(idx, 'startYear', e.target.value)}
                    />
                  </FormField>
                  {/* End date fields (hidden when current is selected) */}
                  {!vol.current && (
                    <>
                      <FormField label={t('field.end.month')}>
                        <div ref={el => { dropdownRefs.current[`endMonth-${idx}`] = el; }} className="relative">
                          <button
                            type="button"
                            className="w-full flex items-center justify-between p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left text-sm text-gray-900 dark:text-gray-100"
                            onClick={() => toggleDropdown(`endMonth-${idx}`)}
                            tabIndex={0}
                          >
                            <span>{vol.endMonth ? getTranslatedMonthWithT(t, vol.endMonth) : t('select.month')}</span>
                            <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`endMonth-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                          </button>
                          {openDropdowns[`endMonth-${idx}`] && (
                            <div className="absolute left-0 mt-2 w-full bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-1 z-50">
                              {MONTHS.map(month => (
                                <button
                                  key={month}
                                  type="button"
                                  className={`w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 ${toEN(vol.endMonth) === month ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-400' : ''}`}
                                  onClick={() => {
                                    onVolunteerChange(idx, 'endMonth', month);
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
                          value={vol.endYear}
                          onChange={e => onVolunteerChange(idx, 'endYear', e.target.value)}
                        />
                      </FormField>
                    </>
                  )}
                </div>

                {/* Current toggle */}
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={vol.current}
                    onChange={e => onVolunteerChange(idx, 'current', e.target.checked)}
                    id={`volunteer-current-${idx}`}
                    className="mr-2"
                  />
                  <label htmlFor={`volunteer-current-${idx}`} className="text-sm text-gray-900 dark:text-gray-100">{t('field.current')}</label>
                </div>
                
                {/* Description field */}
                <FormField label={t('field.description')}>
                  <textarea
                    className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                    placeholder={t('placeholder.volunteer.description')}
                    value={vol.description}
                    onChange={e => onVolunteerChange(idx, 'description', e.target.value)}
                  />
                </FormField>
                
                {/* Impact field */}
                <FormField label={t('field.impact')}>
                  <textarea
                    className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                    placeholder={t('placeholder.volunteer.impact')}
                    value={vol.impact}
                    onChange={e => onVolunteerChange(idx, 'impact', e.target.value)}
                  />
                </FormField>
                </div>
              </div>
            );
          }}
        />
        
        {/* Add volunteer button at bottom */}
        <div className="flex justify-start mt-4">
          <IconButton onClick={onAddVolunteer}>
            {Icons.add}
            {t('add.volunteer')}
          </IconButton>
        </div>
      </FormSection>
    </form>
  );
} 