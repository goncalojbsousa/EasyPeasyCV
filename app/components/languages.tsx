'use client';

import { Language } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';

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
 * Available language levels for dropdown selection
 */
const LANGUAGE_LEVELS = [
  'Básico',
  'Intermediário',
  'Avançado',
  'Fluente',
  'Nativo'
];

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
  const { t } = useLanguage();
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Fecha dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      Object.keys(openDropdowns).forEach(key => {
        if (openDropdowns[key] && dropdownRefs.current[key]) {
          if (!dropdownRefs.current[key]?.contains(event.target as Node)) {
            setOpenDropdowns(prev => ({ ...prev, [key]: false }));
          }
        }
      });
    }
    
    if (Object.values(openDropdowns).some(Boolean)) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdowns]);

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title={t('section.languages')} 
        icon={Icons.languages}
      >
        {/* Display empty state when no languages exist */}
        {languages.length === 0 && (
          <EmptyState message={t('empty.language')} />
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
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm"
                  placeholder="Ex: Inglês"
                  value={lang.name}
                  onChange={e => onLanguageChange(idx, 'name', e.target.value)}
                />
              </FormField>
              <FormField label="Nível">
                <div ref={el => { dropdownRefs.current[`level-${idx}`] = el; }} className="relative">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left"
                    onClick={() => toggleDropdown(`level-${idx}`)}
                    tabIndex={0}
                  >
                    <span>{lang.level || 'Selecione'}</span>
                    <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdowns[`level-${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  {openDropdowns[`level-${idx}`] && (
                    <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                      {LANGUAGE_LEVELS.map(level => (
                        <button
                          key={level}
                          type="button"
                          className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-150 ${lang.level === level ? 'bg-blue-50 font-semibold text-blue-700' : ''}`}
                          onClick={() => {
                            onLanguageChange(idx, 'level', level);
                            setOpenDropdowns(prev => ({ ...prev, [`level-${idx}`]: false }));
                          }}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </FormField>
            </div>
          </div>
        ))}
        
        {/* Add language button at bottom */}
        <div className="flex justify-start mt-4">
          <IconButton onClick={onAddLanguage}>
            {Icons.add}
            Adicionar Idioma
          </IconButton>
        </div>
      </FormSection>
    </form>
  );
} 