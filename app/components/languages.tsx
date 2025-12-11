'use client';

import { Language } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useMemo } from 'react';
import { SelectMenu } from './ui/select-menu';

/**
 * Props interface for the Languages component
 */
interface LanguagesProps {
  /** Array of language entries */
  languages: Language[];
  /** Handler for updating language fields */
  onLanguageChange: (idx: number, field: string, value: string) => void;
  /** Handler for adding new language */
  onAddLanguage: () => void;
  /** Handler for removing language */
  onRemoveLanguage: (idx: number) => void;
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
 * Available language levels for dropdown selection
 * Using CEFR (Common European Framework of Reference for Languages) + Native
 */
const LANGUAGE_LEVELS = [
  'language.level.a1',
  'language.level.a2', 
  'language.level.b1',
  'language.level.b2',
  'language.level.c1',
  'language.level.c2',
  'language.level.native'
];

/**
 * Languages component manages the languages section of the CV form
 * @param languages - Array of language entries
 * @param onLanguageChange - Function to handle language field updates
 * @param onAddLanguage - Function to add new language entry
 * @param onRemoveLanguage - Function to remove language entry
 * @returns JSX element representing the languages form section
 */
/**
 * Languages component
 * Manages language proficiency entries
 * @param props - Component props including language data and handlers
 * @returns JSX element representing the languages form section
 */
export function Languages({
  languages,
  onLanguageChange,
  onAddLanguage,
  onRemoveLanguage,
  canReorder = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: LanguagesProps) {
  const { t } = useLanguage();
  const levelOptions = useMemo(
    () => LANGUAGE_LEVELS.map((level) => ({ value: level, label: t(level) })),
    [t]
  );

  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title={t('section.languages')} 
        icon={Icons.languages}
        canReorder={canReorder}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      >
        {/* Display empty state when no languages exist */}
        {languages.length === 0 && (
          <EmptyState message={t('empty.language')} />
        )}
        
        {/* Render each language entry */}
        {languages.map((lang, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm p-4 relative mb-6 transition-colors duration-300">
            {/* Remove button positioned at top right */}
            <IconButton 
              onClick={() => onRemoveLanguage(idx)} 
              variant="danger" 
              size="sm"
              className="absolute top-2 right-4"
              ariaLabel="Remove language"
            >
              {Icons.remove}
            </IconButton>
            
            {/* Language name and proficiency level fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField label={t('field.language')}>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                  placeholder={t('placeholder.language')}
                  value={lang.name}
                  onChange={e => onLanguageChange(idx, 'name', e.target.value)}
                />
              </FormField>
              <FormField label={t('field.level')}>
                <SelectMenu
                  options={levelOptions}
                  value={lang.level}
                  placeholder={t('select.language.level')}
                  onSelect={(level) => onLanguageChange(idx, 'level', level)}
                  renderTriggerLabel={(option) => option?.label || t('select.language.level')}
                />
              </FormField>
            </div>
          </div>
        ))}
        
        {/* Add language button at bottom */}
        <div className="flex justify-start mt-4">
          <IconButton onClick={onAddLanguage}>
            {Icons.add}
            {t('add.language')}
          </IconButton>
        </div>
      </FormSection>
    </form>
  );
}