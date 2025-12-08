'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  renewed: {
    nameKey: 'template.renewed.name',
    descriptionKey: 'template.renewed.description',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M7 9h10M7 12h6M7 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
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
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuRect, setMenuRect] = useState<DOMRect | null>(null);

  // Sync portal position with trigger rect
  useEffect(() => {
    const updateRect = () => {
      if (isOpen && triggerRef.current) {
        setMenuRect(triggerRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    if (isOpen) {
      window.addEventListener('scroll', updateRect, true);
      window.addEventListener('resize', updateRect);
    }
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [isOpen]);

  const selectedTemplateConfig = templates.renewed;

  return (
    <div className="relative" ref={triggerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
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
      {/* Only one template, so no dropdown needed */}
    </div>
  );
} 