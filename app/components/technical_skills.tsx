'use client';

import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { Icons } from './ui/icons';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Props interface for the TechnicalSkills component
 */
interface TechnicalSkillsProps {
  /** Technical skills text content */
  skills: string;
  /** Handler for updating skills text */
  onSkillsChange: (value: string) => void;
}

/**
 * Technical Skills component
 * Manages technical skills and competencies text content for the CV
 * @param skills - Technical skills text content
 * @param onSkillsChange - Function to handle skills text updates
 * @returns JSX element representing the technical skills form section
 */
export function TechnicalSkills({
  skills,
  onSkillsChange
}: TechnicalSkillsProps) {
  const { t } = useLanguage();
  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection title={t('section.technical.skills')} icon={Icons.technicalSkills}>
        <FormField label={t(`cvType.field.technical.skills`)} helperText={t('field.technical.skills.helper')}>
                    <input
            type="text"
            className="w-full p-3 sm:p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
            placeholder={t(`cvType.placeholder.technical.skills`)}
            value={skills}
            onChange={e => onSkillsChange(e.target.value)}
          />
        </FormField>
      </FormSection>
    </form>
  );
} 