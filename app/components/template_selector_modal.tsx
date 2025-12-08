'use client';

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CvTemplate } from '../types/cv';

interface TemplateSelectorModalProps {
  show: boolean;
  selectedTemplate: CvTemplate;
  onSelect: (template: CvTemplate) => void;
  onClose: () => void;
}

const templatePreviews = {
  renewed: {
    img: '/renewed_preview.webp',
    nameKey: 'template.renewed.name',
    descriptionKey: 'template.renewed.description',
  },
};

export function TemplateSelectorModal({ show, selectedTemplate, onSelect, onClose }: TemplateSelectorModalProps) {
  const { t } = useLanguage();
  const [preview, setPreview] = useState<CvTemplate | null>(null);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl w-full max-w-5xl relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t('template.selector')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-800">
          {/* Grid of templates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            key="renewed"
            role="button"
            tabIndex={0}
            onClick={() => {
              onSelect('renewed');
              onClose();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect('renewed');
                onClose();
              }
            }}
            className={`group text-left rounded-xl overflow-hidden border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 border-sky-500 ring-2 ring-sky-200 dark:ring-sky-900/30`}
          >
            <div className="relative h-56 bg-gray-100 dark:bg-zinc-700 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={templatePreviews.renewed.img}
                alt={`${t(templatePreviews.renewed.nameKey)} preview`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] cursor-zoom-in"
                loading="lazy"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview('renewed');
                }}
              />
            </div>
            <div className="p-4 bg-white dark:bg-zinc-800">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {t(templatePreviews.renewed.nameKey)}
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t(templatePreviews.renewed.descriptionKey)}
              </p>
            </div>
          </div>
          </div>
        </div>

        {/* Fullscreen preview modal */}
        {preview && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/70" onClick={() => setPreview(null)} />
            <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden z-[61]">
              <button
                onClick={() => setPreview(null)}
                className="absolute top-3 right-3 z-[62] text-white/90 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-1.5"
                aria-label="Close preview"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={templatePreviews[preview].img}
                  alt={`${t(templatePreviews[preview].nameKey)} full preview`}
                  className="max-w-[95vw] max-h-[95vh] object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
