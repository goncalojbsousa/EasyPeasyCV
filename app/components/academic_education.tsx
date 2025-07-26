'use client';

import { Education } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';

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
}

/**
 * Available education types for dropdown selection
 */
const EDUCATION_TYPES = [
  'Ensino Secundário',
  'Técnico',
  'Licenciatura',
  'Pós-graduação',
  'Mestrado',
  'Doutoramento'
];

/**
 * Available education status options for dropdown selection
 */
const EDUCATION_STATUS = [
  'Completo',
  'Em andamento',
  'Interrompido'
];

/**
 * Array of month abbreviations for date selection
 */
const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

/**
 * AcademicEducation component manages the education section of the CV form
 * @param education - Array of education entries
 * @param onEducationChange - Function to handle education field updates
 * @param onAddEducation - Function to add new education entry
 * @param onRemoveEducation - Function to remove education entry
 * @returns JSX element representing the academic education form section
 */
export function AcademicEducation({
  education,
  onEducationChange,
  onAddEducation,
  onRemoveEducation
}: AcademicEducationProps) {
  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title="Formação Académica" 
        icon={Icons.academicEducation}
        actionButton={
          <IconButton onClick={onAddEducation}>
            {Icons.add}
            Adicionar Formação
          </IconButton>
        }
      >
        {/* Display empty state when no education entries exist */}
        {education.length === 0 && (
          <EmptyState message="Nenhuma formação adicionada" />
        )}
        
        {/* Render each education entry */}
        {education.map((ed, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 relative mb-6">
            {/* Remove button positioned at top right */}
            <IconButton 
              onClick={() => onRemoveEducation(idx)} 
              variant="danger" 
              size="sm"
              className="absolute top-2 right-4"
            >
              {Icons.remove}
            </IconButton>
            
            {/* Education type and status fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField label="Tipo de Formação">
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={ed.type}
                  onChange={e => onEducationChange(idx, 'type', e.target.value)}
                >
                  <option value="">Selecione</option>
                  {EDUCATION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Estado">
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={ed.status}
                  onChange={e => onEducationChange(idx, 'status', e.target.value)}
                >
                  <option value="">Selecione</option>
                  {EDUCATION_STATUS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </FormField>
            </div>
            
            {/* Course and institution fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField label="Curso">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Licenciatura em Engenharia Informática"
                  value={ed.course}
                  onChange={e => onEducationChange(idx, 'course', e.target.value)}
                />
              </FormField>
              <FormField label="Instituição">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Universidade do Porto"
                  value={ed.institution}
                  onChange={e => onEducationChange(idx, 'institution', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Start date fields */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
              <FormField label="Mês Início">
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={ed.startMonth}
                  onChange={e => onEducationChange(idx, 'startMonth', e.target.value)}
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
                  value={ed.startYear}
                  onChange={e => onEducationChange(idx, 'startYear', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Description field */}
            <FormField label="Descrição">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                placeholder="Ex: Tese sobre inteligência artificial, disciplinas relevantes, projetos académicos..."
                value={ed.description}
                onChange={e => onEducationChange(idx, 'description', e.target.value)}
              />
            </FormField>
          </div>
        ))}
      </FormSection>
    </form>
  );
} 