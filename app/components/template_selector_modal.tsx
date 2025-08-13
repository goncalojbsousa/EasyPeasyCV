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

const templatePreviews: Record<CvTemplate, { img: string; nameKey: string; descriptionKey: string }> = {
  classic: {
    img: '/classic_preview.webp',
    nameKey: 'template.classic.name',
    descriptionKey: 'template.classic.description',
  },
  professional: {
    img: '/professional_preview.webp',
    nameKey: 'template.professional.name',
    descriptionKey: 'template.professional.description',
  },
  timeline: {
    img: '/timeline_preview.webp',
    nameKey: 'template.timeline.name',
    descriptionKey: 'template.timeline.description',
  },
  modern: {
    img: '/modern_preview.webp',
    nameKey: 'template.modern.name',
    descriptionKey: 'template.modern.description',
  },
  minimal: {
    img: '/minimal_preview.webp',
    nameKey: 'template.minimal.name',
    descriptionKey: 'template.minimal.description',
  },
  creative: {
    img: '/creative_preview.webp',
    nameKey: 'template.creative.name',
    descriptionKey: 'template.creative.description',
  },
};

export function TemplateSelectorModal({ show, selectedTemplate, onSelect, onClose }: TemplateSelectorModalProps) {
  const { t } = useLanguage();
  const [preview, setPreview] = useState<CvTemplate | null>(null);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-5xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t('template.selector')}
        </h3>

        {/* Grid of templates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(templatePreviews).map(([key, meta]) => {
            const k = key as CvTemplate;
            const isSelected = selectedTemplate === k;
            return (
              <div
                key={key}
                role="button"
                tabIndex={0}
                onClick={() => {
                  onSelect(k);
                  onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(k);
                    onClose();
                  }
                }}
                className={`group text-left rounded-xl overflow-hidden border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/30' : 'border-gray-200 dark:border-zinc-700'
                }`}
              >
                <div className="relative h-56 bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={meta.img}
                    alt={`${t(meta.nameKey)} preview`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] cursor-zoom-in"
                    loading="lazy"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(k);
                    }}
                  />
                  {/* Hover overlay with Preview button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview(k);
                      }}
                      className="inline-flex items-center gap-2 bg-white/90 dark:bg-zinc-900/80 text-gray-900 dark:text-gray-100 text-xs font-medium px-3 py-1.5 rounded-md shadow-sm hover:bg-white dark:hover:bg-zinc-900 border border-gray-200 dark:border-zinc-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {t('preview.cv')}
                    </button>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 ring-2 ring-offset-2 ring-blue-500 ring-offset-white dark:ring-offset-zinc-800 pointer-events-none" />
                  )}
                </div>
                <div className="p-4 bg-white dark:bg-zinc-800">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t(meta.nameKey)}
                    </h4>
                    {k === 'classic' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">ATS</span>
                    )}
                    {(k === 'minimal' || k === 'creative') && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">BETA</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t(meta.descriptionKey)}
                  </p>
                </div>
              </div>
            );
          })}
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
