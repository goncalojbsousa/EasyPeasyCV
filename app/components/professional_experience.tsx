'use client';

import { Experience } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';

/**
 * Props interface for the ProfessionalExperience component
 */
interface ProfessionalExperienceProps {
  /** Array of professional experience entries */
  experiences: Experience[];
  /** Handler for updating experience fields */
  onExperienceChange: (idx: number, field: string, value: string | boolean) => void;
  /** Handler for adding new experience entry */
  onAddExperience: () => void;
  /** Handler for removing experience entry */
  onRemoveExperience: (idx: number) => void;
}

/**
 * Array of month abbreviations for date selection
 */
const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

/**
 * ProfessionalExperience component manages the professional experience section of the CV form
 * @param experiences - Array of professional experience entries
 * @param onExperienceChange - Function to handle experience field updates
 * @param onAddExperience - Function to add new experience entry
 * @param onRemoveExperience - Function to remove experience entry
 * @returns JSX element representing the professional experience form section
 */
export function ProfessionalExperience({
  experiences,
  onExperienceChange,
  onAddExperience,
  onRemoveExperience
}: ProfessionalExperienceProps) {
  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title="Experiência Profissional" 
        icon={Icons.professionalExperience}
        actionButton={
          <IconButton onClick={onAddExperience}>
            {Icons.add}
            Adicionar Experiência
          </IconButton>
        }
      >
        {/* Display empty state when no experiences exist */}
        {experiences.length === 0 && (
          <EmptyState message="Nenhuma experiência adicionada" />
        )}
        
        {/* Render each experience entry */}
        {experiences.map((exp, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 relative mb-6">
            {/* Remove button positioned at top right */}
            <IconButton 
              onClick={() => onRemoveExperience(idx)} 
              variant="danger" 
              size="sm"
              className="absolute top-2 right-4"
            >
              {Icons.remove}
            </IconButton>
            
            {/* Job title and company fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField label="Cargo">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Desenvolvedor Full Stack"
                  value={exp.role}
                  onChange={e => onExperienceChange(idx, 'role', e.target.value)}
                />
              </FormField>
              <FormField label="Empresa">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Amazon"
                  value={exp.company}
                  onChange={e => onExperienceChange(idx, 'company', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Date range fields */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
              <FormField label="Mês Início">
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={exp.startMonth}
                  onChange={e => onExperienceChange(idx, 'startMonth', e.target.value)}
                >
                  <option value="">Selecione</option>
                  {MONTHS.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Ano Início">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ano"
                  value={exp.startYear}
                  onChange={e => onExperienceChange(idx, 'startYear', e.target.value)}
                />
              </FormField>
              {/* End date fields (hidden when current job is selected) */}
              {!exp.current && (
                <>
                  <FormField label="Mês Fim">
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      value={exp.endMonth}
                      onChange={e => onExperienceChange(idx, 'endMonth', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {MONTHS.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Ano Fim">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      placeholder="Ano"
                      value={exp.endYear}
                      onChange={e => onExperienceChange(idx, 'endYear', e.target.value)}
                    />
                  </FormField>
                </>
              )}
            </div>
            
            {/* Current job checkbox */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={e => onExperienceChange(idx, 'current', e.target.checked)}
                id={`current-${idx}`}
                className="mr-2"
              />
              <label htmlFor={`current-${idx}`} className="text-sm">Atual</label>
            </div>
            
            {/* Technologies used field */}
            <div className="mb-4">
              <FormField label="Tecnologias Utilizadas">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: TypeScript, Next.js, Tailwind CSS"
                  value={exp.tech}
                  onChange={e => onExperienceChange(idx, 'tech', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Activities and responsibilities field */}
            <div className="mb-4">
              <FormField label="Atividades Desenvolvidas">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Descreva suas responsabilidades (um item por linha)"
                  value={exp.activities}
                  onChange={e => onExperienceChange(idx, 'activities', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Achievements and results field */}
            <FormField label="Conquistas" helperText="com métricas">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                placeholder="Ex: Reestruturei a arquitetura da aplicação usando Next.js com SSR, o que melhorou o SEO e aumentou a retenção de usuários em 25%."
                value={exp.results}
                onChange={e => onExperienceChange(idx, 'results', e.target.value)}
              />
            </FormField>
          </div>
        ))}
      </FormSection>
    </form>
  );
} 