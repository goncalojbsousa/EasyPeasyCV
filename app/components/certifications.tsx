'use client';

import { Certification } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';

/**
 * Props interface for the Certifications component
 */
interface CertificationsProps {
  /** Array of certification entries */
  certifications: Certification[];
  /** Handler for updating certification fields */
  onCertificationChange: (idx: number, field: string, value: string) => void;
  /** Handler for adding new certification entry */
  onAddCertification: () => void;
  /** Handler for removing certification entry */
  onRemoveCertification: (idx: number) => void;
}

/**
 * Certifications component manages the certifications and courses section of the CV form
 * @param certifications - Array of certification entries
 * @param onCertificationChange - Function to handle certification field updates
 * @param onAddCertification - Function to add new certification entry
 * @param onRemoveCertification - Function to remove certification entry
 * @returns JSX element representing the certifications form section
 */
export function Certifications({
  certifications,
  onCertificationChange,
  onAddCertification,
  onRemoveCertification
}: CertificationsProps) {
  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title="Certificações/Cursos" 
        icon={Icons.certifications}
        actionButton={
          <IconButton onClick={onAddCertification}>
            {Icons.add}
            Adicionar Certificação/Curso
          </IconButton>
        }
      >
        {/* Display empty state when no certifications exist */}
        {certifications.length === 0 && (
          <EmptyState message="Nenhuma certificação adicionada" />
        )}
        
        {/* Render each certification entry */}
        {certifications.map((cert, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 relative mb-6">
            {/* Remove button positioned at top right */}
            <IconButton 
              onClick={() => onRemoveCertification(idx)} 
              variant="danger" 
              size="sm"
              className="absolute top-2 right-4"
            >
              {Icons.remove}
            </IconButton>
            
            {/* Certification name and issuer fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField label="Certificação">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Certificação AWS Cloud Practitioner"
                  value={cert.name}
                  onChange={e => onCertificationChange(idx, 'name', e.target.value)}
                />
              </FormField>
              <FormField label="Emissor/Instituição">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Udemy, Alura, AWS"
                  value={cert.issuer}
                  onChange={e => onCertificationChange(idx, 'issuer', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Completion date, hours, and validation link fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <FormField label="Data de Conclusão">
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={cert.completionDate}
                  onChange={e => onCertificationChange(idx, 'completionDate', e.target.value)}
                />
              </FormField>
              <FormField label="Carga Horária">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: 40 horas"
                  value={cert.hours}
                  onChange={e => onCertificationChange(idx, 'hours', e.target.value)}
                />
              </FormField>
              <FormField label="Link de Validação">
                <input
                  type="url"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: https://certificado.instituicao.com/123456"
                  value={cert.validationLink}
                  onChange={e => onCertificationChange(idx, 'validationLink', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Description field */}
            <FormField label="Descrição">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                placeholder="Ex: Curso focado em desenvolvimento de APIs REST com Node.js..."
                value={cert.description}
                onChange={e => onCertificationChange(idx, 'description', e.target.value)}
              />
            </FormField>
          </div>
        ))}
      </FormSection>
    </form>
  );
} 