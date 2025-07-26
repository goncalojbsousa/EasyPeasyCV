'use client';

import { Language } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';

/**
 * Props interface for the Languages component
 */
interface LanguagesProps {
  /** Array of language entries */
  languages: Language[];
  /** Handler for updating language fields */
  onLanguageChange: (idx: number, field: string, value: string) => void;
  /** Handler for adding new language entry */
  onAddLanguage: () => void;
  /** Handler for removing language entry */
  onRemoveLanguage: (idx: number) => void;
}

/**
 * Languages component manages the languages section of the CV form
 * @param languages - Array of language entries
 * @param onLanguageChange - Function to handle language field updates
 * @param onAddLanguage - Function to add new language entry
 * @param onRemoveLanguage - Function to remove language entry
 * @returns JSX element representing the languages form section
 */
export function Languages({
  languages,
  onLanguageChange,
  onAddLanguage,
  onRemoveLanguage
}: LanguagesProps) {
  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title="Idiomas" 
        icon={Icons.languages}
        actionButton={
          <IconButton onClick={onAddLanguage}>
            {Icons.add}
            Adicionar Idioma
          </IconButton>
        }
      >
        {/* Display empty state when no languages exist */}
        {languages.length === 0 && (
          <EmptyState message="Nenhum idioma adicionado" />
        )}
        
        {/* Render each language entry */}
        {languages.map((lang, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 relative mb-6">
            {/* Remove button positioned at top right */}
            <IconButton 
              onClick={() => onRemoveLanguage(idx)} 
              variant="danger" 
              size="sm"
              className="absolute top-2 right-4"
            >
              {Icons.remove}
            </IconButton>
            
            {/* Language name and proficiency level fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField label="Idioma">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Inglês"
                  value={lang.name}
                  onChange={e => onLanguageChange(idx, 'name', e.target.value)}
                />
              </FormField>
              <FormField label="Nível">
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={lang.level}
                  onChange={e => onLanguageChange(idx, 'level', e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                  <option value="Fluente">Fluente</option>
                  <option value="Nativo">Nativo</option>
                </select>
              </FormField>
            </div>
          </div>
        ))}
      </FormSection>
    </form>
  );
} 