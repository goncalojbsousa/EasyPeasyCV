'use client';

import { ChevronDown, FileText } from 'lucide-react';
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
const templates = {
  professional: {
    nameKey: 'template.professional.name',
    descriptionKey: 'template.professional.description',
    icon: (
      <FileText className="w-5 h-5" />
    ),
    color: 'bg-slate-500'
  },
};

/**
 * CvTypeSelector component allows users to choose between different CV templates.
 * Handles dropdown for template selection and displays template metadata.
 */
export function CvTypeSelector({ selectedTemplate, onTemplateChange }: CvTypeSelectorProps) {
  const { t } = useLanguage();
  const selectedTemplateConfig = templates[selectedTemplate];

  return (
    <div className="relative">
      <button
        onClick={() => onTemplateChange(selectedTemplate)}
        className="w-full p-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </button>
      {/* Only one template, so no dropdown needed */}
    </div>
  );
} 