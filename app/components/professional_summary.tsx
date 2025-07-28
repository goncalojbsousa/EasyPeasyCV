'use client';

import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { Icons } from './ui/icons';

/**
 * Props interface for the ProfessionalSummary component
 */
interface ProfessionalSummaryProps {
  /** Professional summary text content */
  resume: string;
  /** Handler for updating resume text */
  onResumeChange: (resume: string) => void;
  /** Validation error states for form fields */
  validationErrors?: {[key: string]: boolean};
  /** Whether to show validation errors */
  showValidationErrors?: boolean;
}

/**
 * ProfessionalSummary component manages the professional summary section of the CV form
 * @param resume - Professional summary text content
 * @param onResumeChange - Function to handle resume text updates
 * @param validationErrors - Object containing validation error states
 * @param showValidationErrors - Whether to display validation errors
 * @returns JSX element representing the professional summary form section
 */
export function ProfessionalSummary({
  resume,
  onResumeChange,
  validationErrors = {},
  showValidationErrors = true
}: ProfessionalSummaryProps) {
  return (
    <form className="space-y-8 flex flex-col items-center w-full">
      <FormSection title="Resumo Profissional" icon={Icons.professionalSummary}>
        <FormField label="Resumo Profissional" required>
          <textarea
            className={`w-full p-3 sm:p-4 border rounded-lg bg-white min-h-[120px] shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm ${showValidationErrors && validationErrors.resume ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Desenvolvedor Fullstack com experiência no desenvolvimento de aplicações web escaláveis, responsivas e centradas no utilizador. Trabalho com TypeScript, React, Next.js, Node.js, PostgreSQL e Prisma, com forte atenção à performance, usabilidade e qualidade do código..."
            value={resume}
            onChange={e => onResumeChange(e.target.value)}
            data-error={showValidationErrors && validationErrors.resume ? "true" : "false"}
          />
        </FormField>
      </FormSection>
    </form>
  );
} 