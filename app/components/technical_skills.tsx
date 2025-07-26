'use client';

import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { Icons } from './ui/icons';

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
 * TechnicalSkills component manages the technical skills section of the CV form
 * @param skills - Technical skills text content
 * @param onSkillsChange - Function to handle skills text updates
 * @returns JSX element representing the technical skills form section
 */
export function TechnicalSkills({
  skills,
  onSkillsChange
}: TechnicalSkillsProps) {
  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection title="Habilidades Técnicas" icon={Icons.technicalSkills}>
        <FormField label="Habilidades" helperText="separado por vírgula">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all"
            placeholder="Ex: JavaScript, React, Node.js, SQL"
            value={skills}
            onChange={e => onSkillsChange(e.target.value)}
          />
        </FormField>
      </FormSection>
    </form>
  );
} 