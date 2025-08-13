'use client';
import type { JSX } from 'react';
import type { CVType } from '../../contexts/LanguageContext';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { FormSection } from './form-section';
import { Icons } from './icons';
import PdfDownloadButton from '../pdf_download_button';
import { ThankYouModal } from '../thank_you_modal';
import { Experience, Education, Language, Certification, Project, Volunteer, CvColor, CvTemplate } from '../../types/cv';
import { ColorSelector } from './color-selector';
import { TemplateSelectorModal } from '../template_selector_modal';

import { PersonalInfo, Link } from '../../types/cv';
interface DesktopActionsCardProps {
  personalInfo: PersonalInfo;
  links: Link[];
  resume: string;
  experiences: Experience[];
  education: Education[];
  skills: string;
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  volunteers: Volunteer[];
  template?: CvTemplate;
  color?: CvColor;
  selectedTemplate: CvTemplate;
  selectedColor: CvColor;
  onTemplateChange: (template: CvTemplate) => void;
  onColorChange: (color: CvColor) => void;
  onShowPdfPreview: () => void;
  onGeneratePDF: () => boolean;
  onShowSuccessMessage: () => void;
  onScrollToJobAnalysis: () => void;
  onScrollToCVTips: () => void;
  onScrollToAtsExplanation: () => void;
  onExportXml: () => void;
  onImportXml: (xml: string) => void;
}

/**
 * Desktop Actions Card component
 * Fixed card on the right side of the screen for desktop view.
 * Contains the main action buttons for CV generation, preview, template/color selection, and extra features.
 * Handles dropdowns for CV type and language selection, and manages PDF generation and preview actions.
 */
export function DesktopActionsCard({
  personalInfo,
  links,
  resume,
  experiences,
  education,
  skills,
  languages,
  certifications,
  projects,
  volunteers,
  template = 'classic',
  color = 'blue',
  selectedTemplate,
  selectedColor,
  onTemplateChange,
  onColorChange,
  onShowPdfPreview,
  onGeneratePDF,
  onShowSuccessMessage,
  onScrollToJobAnalysis,
  onScrollToCVTips,
  onScrollToAtsExplanation,
  onExportXml,
  onImportXml
}: DesktopActionsCardProps) {
  const { t, cvType, setCVType } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCVTypeDropdownOpen, setIsCVTypeDropdownOpen] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cvTypeDropdownRef = useRef<HTMLDivElement>(null);
  const [languageDropdownRect, setLanguageDropdownRect] = useState<DOMRect | null>(null);
  const [cvTypeDropdownRect, setCvTypeDropdownRect] = useState<DOMRect | null>(null);
  const languagePortalRef = useRef<HTMLDivElement>(null);
  const cvTypePortalRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const dataDropdownRef = useRef<HTMLDivElement>(null);
  const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);
  const dataPortalRef = useRef<HTMLDivElement>(null);
  const [dataDropdownRect, setDataDropdownRect] = useState<DOMRect | null>(null);

  // Effect to close dropdowns when clicking outside of them
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      // Language dropdown (Generate PDF)
      if (isDropdownOpen) {
        const insideTrigger = dropdownRef.current?.contains(target);
        const insidePortal = languagePortalRef.current?.contains(target);
        if (!insideTrigger && !insidePortal) {
          setIsDropdownOpen(false);
        }
      }
      // CV Type dropdown
      if (isCVTypeDropdownOpen) {
        const insideTrigger = cvTypeDropdownRef.current?.contains(target);
        const insidePortal = cvTypePortalRef.current?.contains(target);
        if (!insideTrigger && !insidePortal) {
          setIsCVTypeDropdownOpen(false);
        }
      }
      // Data (Import/Export) dropdown
      if (isDataDropdownOpen) {
        const insideTrigger = dataDropdownRef.current?.contains(target);
        const insidePortal = dataPortalRef.current?.contains(target as Node);
        if (!insideTrigger && !insidePortal) {
          setIsDataDropdownOpen(false);
        }
      }
    }

    if (isDropdownOpen || isCVTypeDropdownOpen || isDataDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen, isCVTypeDropdownOpen, isDataDropdownOpen]);

  // Keep portal positions synced with trigger rects while open
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setLanguageDropdownRect(rect);
    }
    if (isCVTypeDropdownOpen && cvTypeDropdownRef.current) {
      const rect = cvTypeDropdownRef.current.getBoundingClientRect();
      setCvTypeDropdownRect(rect);
    }
    if (isDataDropdownOpen && dataDropdownRef.current) {
      const rect = dataDropdownRef.current.getBoundingClientRect();
      setDataDropdownRect(rect);
    }
  }, [isDropdownOpen, isCVTypeDropdownOpen, isDataDropdownOpen]);

  // Reposition on resize/scroll while open
  useEffect(() => {
    if (!isDataDropdownOpen) return;
    const update = () => {
      if (dataDropdownRef.current) {
        setDataDropdownRect(dataDropdownRef.current.getBoundingClientRect());
      }
    };
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [isDataDropdownOpen]);

  /**
   * Returns the appropriate icon for each CV type.
   * @param type - CV type string
   */
  const getCVTypeIcon = (type: string) => {
  const icons: Record<string, JSX.Element> = {
      development: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      marketing: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      sales: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      hr: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      finance: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      design: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      health: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      education: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      admin: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      other: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
        </svg>
      )
    };
    return icons[type as keyof typeof icons] || icons.other;
  };

  /**
   * PDF download button component with validation logic.
   * Prevents download if form validation fails, and shows a thank you modal after successful generation.
   * @param lang - Language for the PDF (pt, en or es)
   * @param children - Content to display in the button
   */
  const PdfDownloadButtonWithValidation = ({ lang, children }: { lang: string; children: React.ReactNode }) => {
    const handleClick = (e: React.MouseEvent) => {
      if (!onGeneratePDF()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        // Close dropdown after a short delay to allow PDF generation to start
        setTimeout(() => {
          setIsDropdownOpen(false);
          // Show success message
          onShowSuccessMessage();
        }, 100);
      }
    };

    const handlePdfGenerated = () => {
      // Show thank you modal after PDF generation
      setShowThankYouModal(true);
    };

    return (
      <div onClickCapture={handleClick}>
        <PdfDownloadButton
          personalInfo={personalInfo}
          links={links}
          resume={resume}
          experiences={experiences}
          education={education}
          skills={skills}
          languages={languages}
          certifications={certifications}
          projects={projects}
          volunteers={volunteers}
          lang={lang}
          template={template}
          color={color}
          onPdfGenerated={handlePdfGenerated}
        >
          {children}
        </PdfDownloadButton>
      </div>
    );
  };

  return (
    <div className="hidden lg:block w-80">
      <div className="sticky top-28 max-h-[calc(100vh-7rem)] overflow-y-auto">
        <div className="space-y-6 pr-2">
          {/* CV Actions Card */}
          <FormSection title={t('cv.actions')} icon={Icons.actions}>
            <div className="space-y-4">
              {/* Template Selector (Button opens modal) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('template.selector')}
                </label>
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left text-sm text-gray-900 dark:text-gray-100"
                >
                  <span className="font-medium">
                    {t(`template.${selectedTemplate}.name`)}
                  </span>
                  <svg className="w-4 h-4 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              {/* Color Selector - Only show for non-classic templates */}
              {selectedTemplate !== 'classic' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('color.selector')}
                  </label>
                  <ColorSelector
                    selectedColor={selectedColor}
                    onColorChange={onColorChange}
                    show={true}
                  />
                </div>
              )}

              {/* CV Type Selector */}
              <div className="relative" ref={cvTypeDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('cv.type.selector')}
                </label>
                <button
                  onClick={() => setIsCVTypeDropdownOpen(!isCVTypeDropdownOpen)}
                  className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left text-sm text-gray-900 dark:text-gray-100"
                >
                  <div className="flex items-center gap-2">
                    {getCVTypeIcon(cvType)}
                    <span className="font-medium">{t(`cv.type.${cvType}`)}</span>
                  </div>
                  <svg className={`w-4 h-4 text-gray-400 dark:text-zinc-500 transition-transform duration-200 ${isCVTypeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* CV Type Dropdown */}
                {isCVTypeDropdownOpen && typeof document !== 'undefined' && cvTypeDropdownRect && createPortal(
                  (
                    <div
                      ref={cvTypePortalRef}
                      className="fixed bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-2 z-[1000]"
                      style={{
                        top: cvTypeDropdownRect.bottom + 8,
                        left: cvTypeDropdownRect.left,
                        width: cvTypeDropdownRect.width,
                      }}
                    >
                      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">
                        {t('cv.type.selector')}
                      </div>
                      <div className="py-1 max-h-[60vh] overflow-auto">
                        {['development', 'marketing', 'sales', 'hr', 'finance', 'design', 'health', 'education', 'admin', 'other'].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setCVType(type as CVType);
                              setIsCVTypeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 ${cvType === type ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-400' : ''}`}
                          >
                            {getCVTypeIcon(type)}
                            <span className="font-medium text-sm">{t(`cv.type.${type}`)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ),
                  document.body
                )}
              </div>

              {/* Preview Button */}
              <button
                onClick={onShowPdfPreview}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {t('preview.cv')}
              </button>

              {/* Generate PDF Button with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  {t('generate.ats.resume')}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Language selection dropdown */}
                {isDropdownOpen && typeof document !== 'undefined' && languageDropdownRect && createPortal(
                  (
                    <div
                      ref={languagePortalRef}
                      className="fixed bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-2 z-[1000]"
                      style={{
                        top: languageDropdownRect.bottom + 8,
                        left: languageDropdownRect.left,
                        width: languageDropdownRect.width,
                      }}
                    >
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">
                        {t('select.language')}
                      </div>
                      <div className="py-1">
                        <PdfDownloadButtonWithValidation lang="en">
                          <div className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-6 h-6">
                            <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect>
                            <path d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z" fill="#fff"></path>
                            <path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path>
                            <path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path>
                            <path d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z" fill="#fff"></path>
                            <rect x="13" y="4" width="6" height="24" fill="#fff"></rect>
                            <rect x="1" y="13" width="30" height="6" fill="#fff"></rect>
                            <rect x="14" y="4" width="4" height="24" fill="#b92932"></rect>
                            <rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect>
                            <path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path>
                            <path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path>
                            <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                            <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                          </svg>
                          <span className="font-medium text-sm">{t('language.english')}</span>
                          </div>
                        </PdfDownloadButtonWithValidation>
                        <PdfDownloadButtonWithValidation lang="pt">
                          <div className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-6 h-6">
                            <path d="M5,4H13V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#2b6519"></path>
                            <path d="M16,4h15V28h-15c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" transform="rotate(180 21.5 16)" fill="#ea3323"></path>
                            <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                            <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                            <circle cx="12" cy="16" r="5" fill="#ff5"></circle>
                            <path d="M14.562,13.529l-5.125-.006v3.431h0c.004,.672,.271,1.307,.753,1.787,.491,.489,1.132,.759,1.805,.759,.684,0,1.328-.267,1.813-.75,.485-.484,.753-1.126,.753-1.808v-3.413Z" fill="#ea3323"></path>
                          </svg>
                          <span className="font-medium text-sm">{t('language.portuguese')}</span>
                          </div>
                        </PdfDownloadButtonWithValidation>
                        <PdfDownloadButtonWithValidation lang="es">
                          <div className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-6 h-6">
                            <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#c60b1e"></rect>
                            <rect x="1" y="10" width="30" height="12" fill="#ffc400"></rect>
                            <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="none" stroke="#000" opacity=".1"></rect>
                          </svg>
                          <span className="font-medium text-sm">{t('language.spanish')}</span>
                          </div>
                        </PdfDownloadButtonWithValidation>
                      </div>
                    </div>
                  ),
                  document.body
                )}
              </div>
            </div>
          {/* Separator between CV options and extra actions */}
          <div className="my-4 border-t border-gray-200 dark:border-zinc-700" />

          {/* Extra actions moved here from the removed Extra Features Card */}
          <div className="space-y-4">
            {/* Job Analysis Button */}
            <button
              onClick={onScrollToJobAnalysis}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
              title={t('job.analysis.action.description')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
              {t('job.analysis.action.button')}
            </button>

            {/* ATS Explanation Button */}
            <button
              onClick={onScrollToAtsExplanation}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
              title={t('ats.explanation.action.description')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
              {t('ats.explanation.action.button')}
            </button>

            {/* CV Tips Button */}
            <button
              onClick={onScrollToCVTips}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
              title={t('cv.tips.action.description')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
              {t('cv.tips.action.button')}
            </button>
            
            {/* Data: Import/Export dropdown */}
            <div className="relative mt-2" ref={dataDropdownRef}>
              <button
                onClick={() => setIsDataDropdownOpen((v) => !v)}
                className="w-full bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-gray-100 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
                title={t('data.xml.title')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3H4V5Zm16 5H4v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9Z"/></svg>
                {t('data.xml.title')}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-4 h-4 transition-transform duration-200 ${isDataDropdownOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {isDataDropdownOpen && dataDropdownRect && createPortal(
                <div
                  ref={dataPortalRef}
                  className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-1 z-[9999] animate-fade-in"
                  style={{
                    position: 'fixed',
                    top: dataDropdownRect.bottom + 8,
                    left: dataDropdownRect.left,
                    width: dataDropdownRect.width,
                  }}
                >
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 flex items-center gap-2"
                    onClick={() => { setIsDataDropdownOpen(false); onExportXml(); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 16a1 1 0 0 1-.707-.293l-3-3 1.414-1.414L11 12.586V4h2v8.586l1.293-1.293 1.414 1.414-3 3A1 1 0 0 1 12 16Z"/><path d="M5 20h14a1 1 0 1 0 0-2H5a1 1 0 1 0 0 2Z"/></svg>
                    <span>{t('data.xml.export')}</span>
                  </button>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept=".xml,application/xml,text/xml"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        const text = typeof reader.result === 'string' ? reader.result : '';
                        if (text) onImportXml(text);
                        if (importInputRef.current) importInputRef.current.value = '';
                        setIsDataDropdownOpen(false);
                      };
                      reader.readAsText(file);
                    }}
                  />
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 flex items-center gap-2"
                    onClick={() => { importInputRef.current?.click(); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 8a1 1 0 0 1 .707.293l3 3-1.414 1.414L13 11.414V20h-2v-8.586l-1.293 1.293-1.414-1.414 3-3A1 1 0 0 1 12 8Z"/><path d="M5 4h14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2Z"/></svg>
                    <span>{t('data.xml.import')}</span>
                  </button>
                </div>, document.body)
              }
            </div>
          </div>
          </FormSection>

          
        </div>
      </div>

      {/* Template Selector Modal */}
      <TemplateSelectorModal
        show={showTemplateModal}
        selectedTemplate={selectedTemplate}
        onSelect={(tpl) => {
          onTemplateChange(tpl);
        }}
        onClose={() => setShowTemplateModal(false)}
      />

      {/* Thank You Modal */}
      <ThankYouModal
        show={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
      />
    </div>
  );
} 