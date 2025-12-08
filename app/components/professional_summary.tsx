'use client';

import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { Icons } from './ui/icons';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Props interface for the ProfessionalSummary component
 */
interface ProfessionalSummaryProps {
  /** Professional summary text content */
  resume: string;
  /** Handler for updating resume text */
  onResumeChange: (resume: string) => void;
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
 * Professional Summary component
 * Manages the professional summary/resume text content for the CV
 * @param resume - Professional summary text content
 * @param onResumeChange - Function to handle resume text updates
 * @returns JSX element representing the professional summary form section
 */
export function ProfessionalSummary({
  resume,
  onResumeChange,
  canReorder = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: ProfessionalSummaryProps) {
  const { t } = useLanguage();
  return (
    <form className="space-y-8 flex flex-col items-center w-full">
      <FormSection 
        title={t('section.professional.summary')} 
        icon={Icons.professionalSummary}
        canReorder={canReorder}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      >
        <FormField label={t('field.professional.summary')}>
          <textarea
            className="w-full p-3 sm:p-4 border rounded-lg bg-white dark:bg-zinc-800 min-h-[120px] shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-600"
            placeholder={t(`cvType.placeholder.professional.summary`)}
            value={resume}
            onChange={e => onResumeChange(e.target.value)}
          />
        </FormField>
      </FormSection>
    </form>
  );
} 