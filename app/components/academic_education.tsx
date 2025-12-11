'use client';

import { Education } from '../types/cv';
import { GripVertical } from 'lucide-react';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useMemo } from 'react';
import { SortableList, DragHandle } from './dnd/sortable-list';
import { MONTHS_EN as MONTHS, toEN, getTranslatedMonthWithT } from '../utils/months';
import { AutoResizeTextarea } from './ui/auto-resize-textarea';
import { SelectMenu } from './ui/select-menu';

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
  /** Whether this section can be reordered */
  canReorder?: boolean;
  /** Callback when user clicks move up button */
  onMoveUp?: () => void;
  /** Callback when user clicks move down button */
  onMoveDown?: () => void;
  /** Whether move up button should be disabled */
  canMoveUp?: boolean;
  /** Whether move down button should be disabled */
  canMoveDown?: boolean;
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
  onReorderEducation,
  canReorder = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: AcademicEducationProps) {
  const { t } = useLanguage();
  const educationTypeOptions = useMemo(
    () => EDUCATION_TYPES.map((type) => ({ value: type, label: t(type) })),
    [t]
  );
  const educationStatusOptions = useMemo(
    () => EDUCATION_STATUS.map((status) => ({ value: status, label: t(status) })),
    [t]
  );
  const monthOptions = useMemo(
    () => MONTHS.map((month) => ({ value: month, label: getTranslatedMonthWithT(t, month) })),
    [t]
  );
  // Drag & drop handled by SortableList

  // Generates a display title for each education card based on available data
  const getEducationTitle = (ed: Education, idx: number) => {
    if (ed.course && ed.type) return `${ed.course} | ${t(ed.type)}`;
    if (ed.course) return ed.course;
    if (ed.type) return t(ed.type);
    return `${t('education.title')} ${idx + 1}`;
  };

  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title={t('section.academic.education')} 
        icon={Icons.academicEducation}
        canReorder={canReorder}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
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
                          <GripVertical className="w-4 h-4" />
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
                    <SelectMenu
                      options={educationTypeOptions}
                      value={ed.type}
                      placeholder={t('select.education.type')}
                      onSelect={(type) => onEducationChange(idx, 'type', type)}
                      renderTriggerLabel={(option) => option?.label || t('select.education.type')}
                    />
                  </FormField>
                  <FormField label={t('field.education.status')}>
                    <SelectMenu
                      options={educationStatusOptions}
                      value={ed.status}
                      placeholder={t('select.education.status')}
                      onSelect={(status) => onEducationChange(idx, 'status', status)}
                      renderTriggerLabel={(option) => option?.label || t('select.education.status')}
                    />
                  </FormField>
                </div>
                
                {/* Course and institution fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <FormField label={t('field.course')}>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.course')}
                      value={ed.course}
                      onChange={e => onEducationChange(idx, 'course', e.target.value)}
                    />
                  </FormField>
                  <FormField label={t('field.institution')}>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.institution')}
                      value={ed.institution}
                      onChange={e => onEducationChange(idx, 'institution', e.target.value)}
                    />
                  </FormField>
                </div>
                
                {/* Date fields - Start and End dates in parallel */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4">
                  <FormField label={t('field.start.month')}>
                    <SelectMenu
                      options={monthOptions}
                      value={toEN(ed.startMonth) as string | undefined}
                      placeholder={t('select.month')}
                      onSelect={(month) => onEducationChange(idx, 'startMonth', month)}
                      renderTriggerLabel={(option) => option?.label || t('select.month')}
                    />
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
                        <SelectMenu
                          options={monthOptions}
                          value={toEN(ed.endMonth) as string | undefined}
                          placeholder={t('select.month')}
                          onSelect={(month) => onEducationChange(idx, 'endMonth', month)}
                          renderTriggerLabel={(option) => option?.label || t('select.month')}
                        />
                      </FormField>
                      <FormField label={t('field.end.year')}>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                          placeholder={t('placeholder.year')}
                          value={ed.endYear}
                          onChange={e => onEducationChange(idx, 'endYear', e.target.value)}
                        />
                      </FormField>
                    </>
                  )}
                </div>
                
                {/* Description field */}
                <div className="mb-4">
                  <FormField label={t('field.description')}>
                    <AutoResizeTextarea
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.education.description')}
                      value={ed.description}
                      onChange={e => onEducationChange(idx, 'description', e.target.value)}
                      minHeight={80}
                    />
                  </FormField>
                </div>

                {/* Achievements field */}
                <FormField label={t('field.achievements')} helperText={t('field.achievements.helper')}>
                  <AutoResizeTextarea
                    className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                    placeholder={t('placeholder.education.achievements')}
                    value={ed.achievements}
                    onChange={e => onEducationChange(idx, 'achievements', e.target.value)}
                    minHeight={80}
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