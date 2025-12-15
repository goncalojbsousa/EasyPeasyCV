'use client';

import { useMemo } from 'react';
import { GripVertical } from 'lucide-react';
import { SortableList, DragHandle } from '../dnd/sortable_list';
import { Volunteer } from '../../types/cv';
import { FormSection } from '../ui/form_section';
import { FormField } from '../ui/form_field';
import { IconButton } from '../ui/icon_button';
import { EmptyState } from '../ui/empty_state';
import { Icons } from '../ui/icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { MONTHS_EN as MONTHS, toEN, getTranslatedMonthWithT } from '../../utils/months';
import { AutoResizeTextarea } from '../ui/auto_resize_textarea';
import { SelectMenu } from '../ui/select_menu';

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
  onReorderVolunteers,
  canReorder = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: VolunteerProps) {
  const { t } = useLanguage();
  const monthOptions = useMemo(
    () => MONTHS.map((month) => ({ value: month, label: getTranslatedMonthWithT(t, month) })),
    [t]
  );
  
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
        canReorder={canReorder}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
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
                          <GripVertical className="w-4 h-4" />
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
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.organization')}
                      value={vol.organization}
                      onChange={e => onVolunteerChange(idx, 'organization', e.target.value)}
                    />
                  </FormField>
                  <FormField label={t('field.role')}>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.role')}
                      value={vol.role}
                      onChange={e => onVolunteerChange(idx, 'role', e.target.value)}
                    />
                  </FormField>
                </div>
                
                {/* Date range fields */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4">
                  <FormField label={t('field.start.month')}>
                    <SelectMenu
                      options={monthOptions}
                      value={toEN(vol.startMonth) as string | undefined}
                      placeholder={t('select.month')}
                      onSelect={(month) => onVolunteerChange(idx, 'startMonth', month)}
                      renderTriggerLabel={(option) => option?.label || t('select.month')}
                    />
                  </FormField>
                  <FormField label={t('field.start.year')}>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.year')}
                      value={vol.startYear}
                      onChange={e => onVolunteerChange(idx, 'startYear', e.target.value)}
                    />
                  </FormField>
                  {/* End date fields (hidden when current is selected) */}
                  {!vol.current && (
                    <>
                      <FormField label={t('field.end.month')}>
                        <SelectMenu
                          options={monthOptions}
                          value={toEN(vol.endMonth) as string | undefined}
                          placeholder={t('select.month')}
                          onSelect={(month) => onVolunteerChange(idx, 'endMonth', month)}
                          renderTriggerLabel={(option) => option?.label || t('select.month')}
                        />
                      </FormField>
                      <FormField label={t('field.end.year')}>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
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
                <div className="mb-4">
                  <FormField label={t('field.description')}>
                    <AutoResizeTextarea
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.volunteer.description')}
                      value={vol.description}
                      onChange={e => onVolunteerChange(idx, 'description', e.target.value)}
                      minHeight={80}
                    />
                  </FormField>
                </div>
                
                {/* Impact field */}
                <FormField label={t('field.impact')} helperText={t('field.achievements.helper')}>
                  <AutoResizeTextarea
                    className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                    placeholder={t('placeholder.volunteer.impact')}
                    value={vol.impact}
                    onChange={e => onVolunteerChange(idx, 'impact', e.target.value)}
                    minHeight={80}
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