'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Sparkles, Eye, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CompactCVTypeSelector } from './compact-cv-type-selector';
import PdfDownloadButton from '../pdf_download_button';
import { ThankYouModal } from '../thank_you_modal';
import { SelectMenu, type SelectOption } from './select-menu';
import { Experience, Education, Language, Certification, Project, Volunteer, CvColor, CvTemplate, CustomSection, PersonalInfo, Link } from '../../types/cv';
interface FloatingActionBarProps {
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
  customSections: CustomSection[];
  template?: CvTemplate;
  color?: CvColor;
  onShowPdfPreview: () => void;
  onGeneratePDF: () => boolean;
  onShowSuccessMessage: () => void;
  onScrollToJobAnalysis: () => void;
  onScrollToCVTips: () => void;
  onScrollToAtsExplanation: () => void;
  onTemplateChange?: (template: CvTemplate) => void;
  sectionOrder?: import('../../types/cv').SectionKey[];
}

/**
 * Floating Action Bar component
 * Contains the main action buttons for CV generation and preview.
 * This bar is positioned in the bottom-right corner of the screen and is visible on mobile devices.
 * Handles dropdowns for template and language selection, and manages PDF generation and preview actions.
 */
export function FloatingActionBar({
  personalInfo,
  links,
  resume,
  experiences,
  education,
  skills,
  languages,
  certifications,
  projects,
  template = 'renewed',
  color = 'blue',
  sectionOrder,
  onShowPdfPreview,
  onGeneratePDF,
  onShowSuccessMessage,
  onScrollToJobAnalysis,
  onScrollToCVTips,
  onScrollToAtsExplanation,
  volunteers,
  customSections,
  onTemplateChange
}: FloatingActionBarProps) {
  const { t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const pdfButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const languageOptions: SelectOption<string>[] = useMemo(() => [
    { value: 'en', label: t('language.english'), searchText: 'english inglês' },
    { value: 'pt', label: t('language.portuguese'), searchText: 'portuguese português' },
    { value: 'br', label: t('language.brazilianPortuguese'), searchText: 'brazilian português brasil' },
    { value: 'es', label: t('language.spanish'), searchText: 'spanish español espanhol' },
  ], [t]);

  // Effect to close dropdowns when clicking outside of them
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(event.target as Node)) {
        setIsTemplateDropdownOpen(false);
      }
    }

    if (isDropdownOpen || isTemplateDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isTemplateDropdownOpen]);

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
          customSections={customSections}
          lang={lang}
          template={template}
          color={color}
          sectionOrder={sectionOrder}
          onPdfGenerated={handlePdfGenerated}
        >
          {children}
        </PdfDownloadButton>
      </div>
    );
  };

  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* CV Type Selector */}
      <div className="bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-gray-200 dark:border-zinc-700 p-2">
        <CompactCVTypeSelector />
      </div>

      {/* Não há mais seleção de template, apenas renewed está disponível */}

      {/* Job Analysis Button */}
      <button
        onClick={onScrollToJobAnalysis}
        className="hidden md:flex bg-sky-600 text-white p-4 rounded-full shadow-lg hover:bg-sky-700 transition-colors duration-300 items-center justify-center"
        title={t('job.analysis.action.description')}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* ATS Explanation Button */}
      <button
        onClick={onScrollToAtsExplanation}
        className="hidden md:flex bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 items-center justify-center"
        title={t('ats.explanation.action.description')}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* CV Tips Button */}
      <button
        onClick={onScrollToCVTips}
        className="hidden md:flex bg-sky-600 text-white p-4 rounded-full shadow-lg hover:bg-sky-700 transition-colors duration-300 items-center justify-center"
        title={t('cv.tips.action.description')}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Preview Button */}
      <button
        onClick={onShowPdfPreview}
        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
        title={t('preview.cv')}
      >
        <Eye className="w-6 h-6" />
      </button>

      {/* Generate PDF Button with Language Selector */}
      <div className="relative">
        <SelectMenu
          options={languageOptions}
          value={selectedLang}
          placeholder={t('select.language')}
          onSelect={(lang) => {
            if (!onGeneratePDF()) return;
            setSelectedLang(lang);
            // Click the hidden PDF button for this language
            setTimeout(() => {
              pdfButtonRefs.current[lang]?.click();
            }, 50);
          }}
          buttonClassName="bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 border-0 shadow-lg p-4 rounded-full"
          dropdownClassName="bottom-full mb-2"
          renderOption={(option) => {
            const flagSvgs: Record<string, JSX.Element> = {
              en: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-5 h-5">
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
              ),
              pt: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-5 h-5">
                  <path d="M5,4H13V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#2b6519"></path>
                  <path d="M16,4h15V28h-15c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" transform="rotate(180 21.5 16)" fill="#ea3323"></path>
                  <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                  <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                  <circle cx="12" cy="16" r="5" fill="#ff5"></circle>
                  <path d="M14.562,13.529l-5.125-.006v3.431h0c.004,.672,.271,1.307,.753,1.787,.491,.489,1.132,.759,1.805,.759,.684,0,1.328-.267,1.813-.75,.485-.484,.753-1.126,.753-1.808v-3.413Z" fill="#ea3323"></path>
                </svg>
              ),
              br: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-5 h-5">
                  <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#459a45"></rect>
                  <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                  <path d="M3.472,16l12.528,8,12.528-8-12.528-8L3.472,16Z" fill="#fedf00"></path>
                  <circle cx="16" cy="16" r="5" fill="#0a2172"></circle>
                  <path d="M14,14.5c-.997,0-1.958,.149-2.873,.409-.078,.35-.126,.71-.127,1.083,.944-.315,1.951-.493,2.999-.493,2.524,0,4.816,.996,6.519,2.608,.152-.326,.276-.666,.356-1.026-1.844-1.604-4.245-2.583-6.875-2.583Z" fill="#fff"></path>
                  <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                </svg>
              ),
              es: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-5 h-5">
                  <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#c60b1e"></rect>
                  <rect x="1" y="10" width="30" height="12" fill="#ffc400"></rect>
                  <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="none" stroke="#000" opacity=".1"></rect>
                </svg>
              ),
            };
            return (
              <div className="flex items-center gap-2">
                {flagSvgs[option.value]}
                <span>{option.label}</span>
              </div>
            );
          }}
          renderTriggerLabel={() => (
            <FileText className="w-6 h-6" />
          )}
        />
        
        {/* Hidden PDF download buttons */}
        <div className="hidden">
          {languageOptions.map((lang) => (
            <div key={lang.value} ref={(el) => {
              if (el) {
                const btn = el.querySelector('button');
                if (btn) pdfButtonRefs.current[lang.value] = btn;
              }
            }}>
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
                customSections={customSections}
                lang={lang.value}
                template={template}
                color={color}
                sectionOrder={sectionOrder}
                onPdfGenerated={() => {
                  setShowThankYouModal(true);
                  onShowSuccessMessage();
                }}
              >
                Generate
              </PdfDownloadButton>
            </div>
          ))}
        </div>
      </div>

      {/* Thank You Modal */}
      <ThankYouModal
        show={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
      />
    </div>
  );
} 