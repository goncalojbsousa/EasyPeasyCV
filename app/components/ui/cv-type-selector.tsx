'use client';

import React, { useState } from 'react';
import { CvTemplate } from '../../types/cv';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Props interface for the CvTypeSelector component
 */
interface CvTypeSelectorProps {
  /** Currently selected template */
  selectedTemplate: CvTemplate;
  /** Callback function when template changes */
  onTemplateChange: (template: CvTemplate) => void;
}

/**
 * Template configuration with metadata
 */
const templates: Record<CvTemplate, {
  nameKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  color: string;
}> = {
  classic: {
    nameKey: 'template.classic.name',
    descriptionKey: 'template.classic.description',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="7" y="8" width="10" height="1" fill="currentColor"/>
        <rect x="7" y="11" width="10" height="1" fill="currentColor"/>
        <rect x="7" y="14" width="6" height="1" fill="currentColor"/>
      </svg>
    ),
    color: 'bg-blue-500'
  },
  modern: {
    nameKey: 'template.modern.name',
    descriptionKey: 'template.modern.description',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 12L11 15L16 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: 'bg-purple-500'
  },
  creative: {
    nameKey: 'template.creative.name',
    descriptionKey: 'template.creative.description',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="8" cy="8" r="2" fill="currentColor"/>
        <circle cx="16" cy="8" r="2" fill="currentColor"/>
        <circle cx="8" cy="16" r="2" fill="currentColor"/>
        <circle cx="16" cy="16" r="2" fill="currentColor"/>
      </svg>
    ),
    color: 'bg-pink-500'
  },
};

/**
 * CvTypeSelector component allows users to choose between different CV templates
 * @param selectedTemplate - Currently selected template
 * @param onTemplateChange - Callback function when template changes
 * @returns JSX element representing the template selector
 */
export function CvTypeSelector({ selectedTemplate, onTemplateChange }: CvTypeSelectorProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const selectedTemplateConfig = templates[selectedTemplate];

  return (
    <div className="relative">
      {/* Template selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                             <div className={`w-10 h-10 rounded-lg ${selectedTemplateConfig.color} flex items-center justify-center text-white`} style={{ minWidth: '40px', minHeight: '40px', maxWidth: '40px', maxHeight: '40px' }}>
                 {selectedTemplateConfig.icon}
               </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t(selectedTemplateConfig.nameKey)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t(selectedTemplateConfig.descriptionKey)}
              </p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Template options dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {Object.entries(templates).map(([key, template]) => (
              <button
                key={key}
                onClick={() => {
                  onTemplateChange(key as CvTemplate);
                  setIsOpen(false);
                }}
                className={`w-full p-3 rounded-lg transition-all duration-200 text-left hover:bg-gray-50 dark:hover:bg-zinc-700 ${
                  selectedTemplate === key ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                                       <div className={`w-8 h-8 rounded-lg ${template.color} flex items-center justify-center text-white`} style={{ minWidth: '32px', minHeight: '32px', maxWidth: '32px', maxHeight: '32px' }}>
                       {template.icon}
                     </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t(template.nameKey)}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t(template.descriptionKey)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 