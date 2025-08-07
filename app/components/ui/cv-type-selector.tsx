'use client';

import React, { useState } from 'react';
import { CvTemplate } from '../../types/cv';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Props for the CvTypeSelector component.
 */
interface CvTypeSelectorProps {
  /** Currently selected template */
  selectedTemplate: CvTemplate;
  /** Callback function when template changes */
  onTemplateChange: (template: CvTemplate) => void;
}

/**
 * Template configuration with metadata for each template type.
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
 * CvTypeSelector component allows users to choose between different CV templates.
 * Handles dropdown for template selection and displays template metadata.
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
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {t(selectedTemplateConfig.nameKey)}
                </h3>
                {selectedTemplate === 'classic' && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    ATS
                  </span>
                )}
                {selectedTemplate === 'creative' && (
                  <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    BETA
                  </span>
                )}
              </div>
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
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {t(template.nameKey)}
                      </h4>
                      {key === 'classic' && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          ATS
                        </span>
                      )}
                      {key === 'creative' && (
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          BETA
                        </span>
                      )}
                    </div>
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