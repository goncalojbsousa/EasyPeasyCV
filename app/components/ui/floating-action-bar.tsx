'use client';

import { useState, useRef, useEffect, useMemo, type JSX } from 'react';
import { Eye, Download, Grid2x2, Menu, X, FileText, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CompactCVTypeSelector } from './compact-cv-type-selector';
import PdfDownloadButton from '../pdf_download_button';
import { ThankYouModal } from '../thank_you_modal';
import { SelectMenu, type SelectOption } from './select-menu';
import { TemplateSelectorModal } from '../template_selector_modal';
import { Experience, Education, Language, Certification, Project, Volunteer, CvColor, CvTemplate, CustomSection, PersonalInfo, Link, CvRenderSettings, SectionKey } from '../../types/cv';
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
  onTemplateChange?: (template: CvTemplate) => void;
  sectionOrder?: SectionKey[];
  settings?: CvRenderSettings;
  onSettingsChange?: (s: CvRenderSettings) => void;
  onResetSectionOrder?: () => void;
}

/**
 * Floating Action Bar component
 * Modern mobile-first design with comprehensive features
 * This bar is positioned in the bottom-right corner of the screen and is visible on mobile devices.
 * Includes main action buttons, template/color selection, and advanced settings in collapsible menu.
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
  volunteers,
  customSections,
  onTemplateChange,
  settings,
  onSettingsChange,
  onResetSectionOrder,
}: FloatingActionBarProps) {
  const { t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const pdfButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const languageOptions: SelectOption<string>[] = useMemo(() => [
    { value: 'en', label: t('language.english'), searchText: 'english inglês' },
    { value: 'pt', label: t('language.portuguese'), searchText: 'portuguese português' },
    { value: 'br', label: t('language.brazilianPortuguese'), searchText: 'brazilian português brasil' },
    { value: 'es', label: t('language.spanish'), searchText: 'spanish español espanhol' },
  ], [t]);

  const fontOptions: SelectOption<string>[] = useMemo(() => ([
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times-Roman', label: 'Times New Roman' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Custom', label: t('layout.controls.font.custom') },
  ]), [t]);

  const headerWeightOptions: SelectOption<string>[] = useMemo(() => ([
    { value: 'normal', label: t('layout.controls.header.weight.normal') },
    { value: 'bold', label: t('layout.controls.header.weight.bold') },
    { value: 'heavy', label: t('layout.controls.header.weight.heavy') },
  ]), [t]);

  const titleStyleOptions: SelectOption<string>[] = useMemo(() => ([
    { value: 'normal', label: t('layout.controls.header.titleStyle.normal') },
    { value: 'italic', label: t('layout.controls.header.titleStyle.italic') },
    { value: 'uppercase', label: t('layout.controls.header.titleStyle.uppercase') },
  ]), [t]);

  const dividerThicknessOptions: SelectOption<number>[] = useMemo(() => ([
    { value: 1, label: '1px' },
    { value: 2, label: '2px' },
    { value: 3, label: '3px' },
  ]), []);

  const dividerStyleOptions: SelectOption<string>[] = useMemo(() => ([
    { value: 'solid', label: t('layout.controls.header.divider.style.solid') },
    { value: 'dashed', label: t('layout.controls.header.divider.style.dashed') },
  ]), [t]);

  const aspectRatioOptions: SelectOption<string>[] = useMemo(() => ([
    { value: '1:1', label: '1:1' },
    { value: '3:4', label: '3:4' },
    { value: '4:3', label: '4:3' },
  ]), []);

  const densityOptions: SelectOption<string>[] = useMemo(() => ([
    { value: 'compact', label: t('layout.controls.density.compact') },
    { value: 'normal', label: t('layout.controls.density.normal') },
    { value: 'spacious', label: t('layout.controls.density.spacious') },
  ]), [t]);

  const dateFormatOptions: SelectOption<string>[] = useMemo(() => ([
    { value: 'short', label: t('layout.controls.dateFormat.short') },
    { value: 'medium', label: t('layout.controls.dateFormat.medium') },
    { value: 'long', label: t('layout.controls.dateFormat.long') },
  ]), [t]);

  const textAlignmentOptions: SelectOption<string>[] = useMemo(() => ([
    { value: 'left', label: t('layout.controls.textAlignment.left') },
    { value: 'justify', label: t('layout.controls.textAlignment.justify') },
  ]), [t]);

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

  return (
    <>
      {/* Mobile Floating Action Bar - Minimalista com ícones apenas */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
        
        {/* Menu Expandível - Botões com ícones apenas */}
        {isMenuOpen && (
          <div className="flex flex-col gap-2 mb-2">
            {/* Download PDF */}
            <SelectMenu
              options={languageOptions}
              value={selectedLang}
              placeholder={t('select.language')}
              onSelect={(lang) => {
                if (!onGeneratePDF()) return;
                setSelectedLang(lang);
                setTimeout(() => {
                  pdfButtonRefs.current[lang]?.click();
                }, 50);
              }}
              buttonClassName="bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 shadow-lg h-12 w-12 min-w-[48px] flex items-center justify-center transition-all !rounded-full !p-0"
              dropdownClassName="bottom-full mb-2 right-0"
              showChevron={false}
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
                      <path fill="#f1c142" d="M1 10H31V22H1z"></path>
                      <path d="M5,4H27c2.208,0,4,1.792,4,4v3H1v-3c0-2.208,1.792-4,4-4Z" fill="#a0251e"></path>
                      <path d="M5,21H27c2.208,0,4,1.792,4,4v3H1v-3c0-2.208,1.792-4,4-4Z" transform="rotate(180 16 24.5)" fill="#a0251e"></path>
                      <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                      <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                      <path d="M12.614,13.091c.066-.031,.055-.14-.016-.157,.057-.047,.02-.15-.055-.148,.04-.057-.012-.144-.082-.13,.021-.062-.042-.127-.104-.105,.01-.068-.071-.119-.127-.081,.004-.068-.081-.112-.134-.069-.01-.071-.11-.095-.15-.035-.014-.068-.111-.087-.149-.028-.027-.055-.114-.057-.144-.004-.03-.047-.107-.045-.136,.002-.018-.028-.057-.044-.09-.034,.009-.065-.066-.115-.122-.082,.002-.07-.087-.111-.138-.064-.013-.064-.103-.087-.144-.036-.02-.063-.114-.075-.148-.017-.036-.056-.129-.042-.147,.022-.041-.055-.135-.031-.146,.036-.011-.008-.023-.014-.037-.016,.006-.008,.01-.016,.015-.025h.002c.058-.107,.004-.256-.106-.298v-.098h.099v-.154h-.099v-.101h-.151v.101h-.099v.154h.099v.096c-.113,.04-.169,.191-.11,.299h.002c.004,.008,.009,.017,.014,.024-.015,.002-.029,.008-.04,.017-.011-.067-.106-.091-.146-.036-.018-.064-.111-.078-.147-.022-.034-.057-.128-.046-.148,.017-.041-.052-.131-.028-.144,.036-.051-.047-.139-.006-.138,.064-.056-.033-.131,.017-.122,.082-.034-.01-.072,.006-.091,.034-.029-.047-.106-.049-.136-.002-.03-.054-.117-.051-.143,.004-.037-.059-.135-.04-.149,.028-.039-.06-.14-.037-.15,.035-.053-.043-.138,0-.134,.069-.056-.038-.137,.013-.127,.081-.062-.021-.125,.044-.104,.105-.05-.009-.096,.033-.096,.084h0c0,.017,.005,.033,.014,.047-.075-.002-.111,.101-.055,.148-.071,.017-.082,.125-.016,.157-.061,.035-.047,.138,.022,.154-.013,.015-.021,.034-.021,.055h0c0,.042,.03,.077,.069,.084-.023,.048,.009,.11,.06,.118-.013,.03-.012,.073-.012,.106,.09-.019,.2,.006,.239,.11-.015,.068,.065,.156,.138,.146,.06,.085,.133,.165,.251,.197-.021,.093,.064,.093,.123,.118-.013,.016-.043,.063-.055,.081,.024,.013,.087,.041,.113,.051,.005,.019,.004,.028,.004,.031,.091,.501,2.534,.502,2.616-.001v-.002s.004,.003,.004,.004c0-.003-.001-.011,.004-.031l.118-.042-.062-.09c.056-.028,.145-.025,.123-.119,.119-.032,.193-.112,.253-.198,.073,.01,.153-.078,.138-.146,.039-.104,.15-.129,.239-.11,0-.035,.002-.078-.013-.109,.044-.014,.07-.071,.049-.115,.062-.009,.091-.093,.048-.139,.069-.016,.083-.12,.022-.154Zm-.296-.114c0,.049-.012,.098-.034,.141-.198-.137-.477-.238-.694-.214-.002-.009-.006-.017-.011-.024,0,0,0-.001,0-.002,.064-.021,.074-.12,.015-.153,0,0,0,0,0,0,.048-.032,.045-.113-.005-.141,.328-.039,.728,.09,.728,.393Zm-.956-.275c0,.063-.02,.124-.054,.175-.274-.059-.412-.169-.717-.185-.007-.082-.005-.171-.011-.254,.246-.19,.81-.062,.783,.264Zm-1.191-.164c-.002,.05-.003,.102-.007,.151-.302,.013-.449,.122-.719,.185-.26-.406,.415-.676,.73-.436-.002,.033-.005,.067-.004,.101Zm-1.046,.117c0,.028,.014,.053,.034,.069,0,0,0,0,0,0-.058,.033-.049,.132,.015,.152,0,0,0,.001,0,.002-.005,.007-.008,.015-.011,.024-.219-.024-.495,.067-.698,.206-.155-.377,.323-.576,.698-.525-.023,.015-.039,.041-.039,.072Zm3.065-.115s0,0,0,0c0,0,0,0,0,0,0,0,0,0,0,0Zm-3.113,1.798v.002s-.002,0-.003,.002c0-.001,.002-.003,.003-.003Z" fill="#9b8028"></path>
                      <path d="M14.133,16.856c.275-.65,.201-.508-.319-.787v-.873c.149-.099-.094-.121,.05-.235h.072v-.339h-.99v.339h.075c.136,.102-.091,.146,.05,.235v.76c-.524-.007-.771,.066-.679,.576h.039s0,0,0,0l.016,.036c.14-.063,.372-.107,.624-.119v.224c-.384,.029-.42,.608,0,.8v1.291c-.053,.017-.069,.089-.024,.123,.007,.065-.058,.092-.113,.083,0,.026,0,.237,0,.269-.044,.024-.113,.03-.17,.028v.108s0,0,0,0v.107s0,0,0,0v.107s0,0,0,0v.108s0,0,0,0v.186c.459-.068,.895-.068,1.353,0v-.616c-.057,.002-.124-.004-.17-.028,0-.033,0-.241,0-.268-.054,.008-.118-.017-.113-.081,.048-.033,.034-.108-.021-.126v-.932c.038,.017,.073,.035,.105,.053-.105,.119-.092,.326,.031,.429l.057-.053c.222-.329,.396-.743-.193-.896v-.35c.177-.019,.289-.074,.319-.158Z" fill="#9b8028"></path>
                      <path d="M8.36,16.058c-.153-.062-.39-.098-.653-.102v-.76c.094-.041,.034-.115-.013-.159,.02-.038,.092-.057,.056-.115h.043v-.261h-.912v.261h.039c-.037,.059,.039,.078,.057,.115-.047,.042-.108,.118-.014,.159v.873c-.644,.133-.611,.748,0,.945v.35c-.59,.154-.415,.567-.193,.896l.057,.053c.123-.103,.136-.31,.031-.429,.032-.018,.067-.036,.105-.053v.932c-.055,.018-.069,.093-.021,.126,.005,.064-.059,.089-.113,.081,0,.026,0,.236,0,.268-.045,.024-.113,.031-.17,.028v.401h0v.215c.459-.068,.895-.068,1.352,0v-.186s0,0,0,0v-.108s0,0,0,0v-.107s0,0,0,0v-.107s0,0,0,0v-.108c-.056,.002-.124-.004-.169-.028,0-.033,0-.241,0-.269-.055,.008-.119-.018-.113-.083,.045-.034,.03-.107-.024-.124v-1.29c.421-.192,.383-.772,0-.8v-.224c.575,.035,.796,.314,.653-.392Z" fill="#9b8028"></path>
                      <path d="M12.531,14.533h-4.28l.003,2.572v1.485c0,.432,.226,.822,.591,1.019,.473,.252,1.024,.391,1.552,.391s1.064-.135,1.544-.391c.364-.197,.591-.587,.591-1.019v-4.057Z" fill="#a0251e"></path>
                    </svg>
                  ),
                };
                return flagSvgs[option.value];
              }}
              renderTriggerLabel={() => <Download className="w-5 h-5" />}
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

            {/* Preview */}
            <button
              onClick={onShowPdfPreview}
              className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 shadow-lg p-3 rounded-full h-12 w-12 flex items-center justify-center transition-all hover:shadow-xl"
              title={t('preview.cv')}
            >
              <Eye className="w-5 h-5" />
            </button>

            {/* Layout Settings */}
            <button
              onClick={() => {
                setShowLayoutModal(true);
                setIsMenuOpen(false);
              }}
              className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 shadow-lg p-3 rounded-full h-12 w-12 flex items-center justify-center transition-all hover:shadow-xl"
              title={t('layout.menu.title')}
            >
              <Grid2x2 className="w-5 h-5" />
            </button>

            {/* Template Selector */}
            <button
              onClick={() => {
                setShowTemplateModal(true);
                setIsMenuOpen(false);
              }}
              className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 shadow-lg p-3 rounded-full h-12 w-12 flex items-center justify-center transition-all hover:shadow-xl"
              title={t('template.selector')}
            >
              <FileText className="w-5 h-5" />
            </button>

            {/* CV Type Selector */}
            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-lg p-2 rounded-full h-auto w-auto">
              <CompactCVTypeSelector />
            </div>
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-sky-600 hover:bg-sky-700 text-white shadow-xl hover:shadow-2xl p-3 rounded-full h-14 w-14 flex items-center justify-center transition-all active:scale-95"
          title={isMenuOpen ? t('close') : 'Menu'}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Template Selector Modal */}
      {showTemplateModal && onTemplateChange && (
        <TemplateSelectorModal
          show={true}
          selectedTemplate={template}
          onSelect={(newTemplate: CvTemplate) => {
            onTemplateChange(newTemplate);
            setShowTemplateModal(false);
          }}
          onClose={() => setShowTemplateModal(false)}
        />
      )}

      {/* Layout Settings Modal */}
      {showLayoutModal && settings && onSettingsChange && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={() => setShowLayoutModal(false)}>
          <div className="bg-white dark:bg-zinc-800 rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('layout.menu.controls')}</h2>
              <button
                onClick={() => setShowLayoutModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-4 py-3 space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">{t('layout.controls.font')}</label>
                <SelectMenu
                  className="w-full"
                  options={fontOptions}
                  value={settings.layout.fontFamily}
                  placeholder={t('layout.controls.font')}
                  onSelect={(value) => onSettingsChange({ ...settings, layout: { ...settings.layout, fontFamily: value as any } })}
                />
                {settings.layout.fontFamily === 'Custom' && (
                  <div className="mt-2">
                    <input type="file" accept=".ttf,.otf" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        const dataUrl = typeof reader.result === 'string' ? reader.result : '';
                        onSettingsChange({ ...settings, layout: { ...settings.layout, customFont: { name: 'CustomFont', dataUrl, style: 'normal' } } });
                      };
                      reader.readAsDataURL(file);
                    }} className="w-full text-sm" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">{`${t('layout.controls.textScale.label')} (${Math.round((settings.layout.textScale*100))}%)`}</label>
                <input type="range" min={0.8} max={1.2} step={0.05} value={settings.layout.textScale} onChange={(e) => onSettingsChange({ ...settings, layout: { ...settings.layout, textScale: parseFloat(e.target.value) } })} className="w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">{`${t('layout.controls.margins.title')} (cm)`}</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs">{`${t('layout.controls.margins.top')}: ${settings.layout.marginsCm.top}`}</span>
                    <input type="range" min={0.5} max={3} step={0.1} value={settings.layout.marginsCm.top} onChange={(e) => onSettingsChange({ ...settings, layout: { ...settings.layout, marginsCm: { ...settings.layout.marginsCm, top: parseFloat(e.target.value) } } })} />
                  </div>
                  <div>
                    <span className="text-xs">{`${t('layout.controls.margins.bottom')}: ${settings.layout.marginsCm.bottom}`}</span>
                    <input type="range" min={0.5} max={3} step={0.1} value={settings.layout.marginsCm.bottom} onChange={(e) => onSettingsChange({ ...settings, layout: { ...settings.layout, marginsCm: { ...settings.layout.marginsCm, bottom: parseFloat(e.target.value) } } })} />
                  </div>
                  <div>
                    <span className="text-xs">{`${t('layout.controls.margins.left')}: ${settings.layout.marginsCm.left}`}</span>
                    <input type="range" min={0.5} max={3} step={0.1} value={settings.layout.marginsCm.left} onChange={(e) => onSettingsChange({ ...settings, layout: { ...settings.layout, marginsCm: { ...settings.layout.marginsCm, left: parseFloat(e.target.value) } } })} />
                  </div>
                  <div>
                    <span className="text-xs">{`${t('layout.controls.margins.right')}: ${settings.layout.marginsCm.right}`}</span>
                    <input type="range" min={0.5} max={3} step={0.1} value={settings.layout.marginsCm.right} onChange={(e) => onSettingsChange({ ...settings, layout: { ...settings.layout, marginsCm: { ...settings.layout.marginsCm, right: parseFloat(e.target.value) } } })} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">{`${t('layout.controls.lineSpacing.label')} (${settings.layout.lineSpacing})`}</label>
                <input type="range" min={1.0} max={2.0} step={0.1} value={settings.layout.lineSpacing} onChange={(e) => onSettingsChange({ ...settings, layout: { ...settings.layout, lineSpacing: parseFloat(e.target.value) } })} className="w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">{`${t('layout.controls.sectionSpacing.label')} (${settings.layout.sectionSpacingPx}px)`}</label>
                <input type="range" min={10} max={30} step={2} value={settings.layout.sectionSpacingPx} onChange={(e) => onSettingsChange({ ...settings, layout: { ...settings.layout, sectionSpacingPx: parseInt(e.target.value) } })} className="w-full" />
              </div>
              
              <div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
                <div className="text-[11px] font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">{t('layout.controls.quickSettings')}</div>
                
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">{t('layout.controls.density.label')}</label>
                  <SelectMenu
                    className="w-full"
                    options={densityOptions}
                    value={settings.layout.density}
                    placeholder={t('layout.controls.density.label')}
                    onSelect={(value) => onSettingsChange({ ...settings, layout: { ...settings.layout, density: value as any } })}
                  />
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{t('layout.controls.density.help')}</div>
                </div>
                
                <div className="mb-3">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.layout.singlePageMode} 
                      onChange={(e) => onSettingsChange({ ...settings, layout: { ...settings.layout, singlePageMode: e.target.checked } })}
                      className="rounded"
                    />
                    {t('layout.controls.singlePageMode')}
                  </label>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 ml-5">{t('layout.controls.singlePageMode.help')}</div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">{t('layout.controls.textAlignment.label')}</label>
                  <SelectMenu
                    className="w-full"
                    options={textAlignmentOptions}
                    value={settings.layout.textAlignment}
                    placeholder={t('layout.controls.textAlignment.label')}
                    onSelect={(value) => onSettingsChange({ ...settings, layout: { ...settings.layout, textAlignment: value as any } })}
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
                <div className="text-xs font-semibold mb-3 text-gray-700 dark:text-gray-300">{t('layout.controls.header.title')}</div>
                
                <div className="space-y-2 mb-3">
                  <div className="text-[11px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{t('layout.controls.header.nameSection')}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs mb-1">{`${t('layout.controls.header.nameSize')} (${settings.header.nameFontSize})`}</label>
                      <input type="range" min={16} max={28} step={1} value={settings.header.nameFontSize} onChange={(e) => onSettingsChange({ ...settings, header: { ...settings.header, nameFontSize: parseInt(e.target.value) } })} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">{t('layout.controls.header.weight.label')}</label>
                      <SelectMenu
                        className="w-full"
                        options={headerWeightOptions}
                        value={settings.header.nameFontWeight}
                        placeholder={t('layout.controls.header.weight.label')}
                        onSelect={(value) => onSettingsChange({ ...settings, header: { ...settings.header, nameFontWeight: value as any } })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">{t('layout.controls.header.color')}</label>
                      <input type="color" value={settings.header.nameColor} onChange={(e) => onSettingsChange({ ...settings, header: { ...settings.header, nameColor: e.target.value } })} className="w-full h-8 p-0 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">{t('layout.controls.header.titleStyle.label')}</label>
                      <SelectMenu
                        className="w-full"
                        options={titleStyleOptions}
                        value={settings.header.titleStyle}
                        placeholder={t('layout.controls.header.titleStyle.label')}
                        onSelect={(value) => onSettingsChange({ ...settings, header: { ...settings.header, titleStyle: value as any } })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="text-[11px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{t('layout.controls.header.divider.title')}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <SelectMenu
                      className="w-full min-w-0"
                      options={dividerThicknessOptions}
                      value={settings.header.dividerThickness}
                      placeholder={t('layout.controls.header.divider.thickness')}
                      onSelect={(value) => onSettingsChange({ ...settings, header: { ...settings.header, dividerThickness: value as any } })}
                    />
                    <SelectMenu
                      className="w-full min-w-0"
                      options={dividerStyleOptions}
                      value={settings.header.dividerStyle}
                      placeholder={t('layout.controls.header.divider.style')}
                      onSelect={(value) => onSettingsChange({ ...settings, header: { ...settings.header, dividerStyle: value as any } })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-[11px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{t('layout.controls.header.icons')}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs mb-1">{`${t('layout.controls.header.iconSize')} (${settings.header.iconSizePx}px)`}</label>
                      <input type="range" min={16} max={24} step={2} value={settings.header.iconSizePx} onChange={(e) => onSettingsChange({ ...settings, header: { ...settings.header, iconSizePx: parseInt(e.target.value) as any } })} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">{`${t('layout.controls.header.iconSpacing')} (${settings.header.iconSpacingPx}px)`}</label>
                      <input type="range" min={5} max={15} step={2} value={settings.header.iconSpacingPx} onChange={(e) => onSettingsChange({ ...settings, header: { ...settings.header, iconSpacingPx: parseInt(e.target.value) as any } })} className="w-full" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
                <div className="text-xs font-semibold mb-2">{t('layout.controls.photo.title')}</div>
                <label className="flex items-center gap-2 text-xs font-medium">
                  <input type="checkbox" checked={settings.photo.enabled} onChange={(e) => onSettingsChange({ ...settings, photo: { ...settings.photo, enabled: e.target.checked } })} />
                  {t('layout.controls.photo.enable')}
                </label>
                {settings.photo.enabled && (
                  <div className="mt-2 space-y-2">
                    <SelectMenu
                      className="w-full"
                      options={aspectRatioOptions}
                      value={settings.photo.aspectRatio}
                      placeholder={t('layout.controls.photo.title')}
                      onSelect={(value) => onSettingsChange({ ...settings, photo: { ...settings.photo, aspectRatio: value as any } })}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        id="photo-upload-mobile"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            const dataUrl = typeof reader.result === 'string' ? reader.result : '';
                            onSettingsChange({ ...settings, photo: { ...settings.photo, dataUrl } });
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('photo-upload-mobile')?.click()}
                        className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"/><path d="M7 9l5-5 5 5"/><path d="M12 4v12"/></svg>
                        <span>{t('layout.controls.photo.choose')}</span>
                      </button>
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">{t('layout.controls.photo.help')}</div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md p-2">
                      {t('layout.controls.photo.atsWarning')}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
                <div className="text-xs font-semibold mb-3 text-gray-700 dark:text-gray-300">{t('layout.controls.sections.title')}</div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">{t('layout.controls.sections.titleColor')}</label>
                    <input 
                      type="color" 
                      value={settings.sections?.titleColor || '#000000'} 
                      onChange={(e) => onSettingsChange({ 
                        ...settings, 
                        sections: { ...settings.sections, titleColor: e.target.value, titleFontSize: settings.sections?.titleFontSize || 12, dateFormat: settings.sections?.dateFormat || 'medium' } 
                      })} 
                      className="w-full h-8 p-0 rounded" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">{`${t('layout.controls.sections.titleSize')} (${settings.sections?.titleFontSize || 12})`}</label>
                    <input 
                      type="range" 
                      min={10} 
                      max={16} 
                      step={1} 
                      value={settings.sections?.titleFontSize || 12} 
                      onChange={(e) => onSettingsChange({ 
                        ...settings, 
                        sections: { ...settings.sections, titleFontSize: parseInt(e.target.value), titleColor: settings.sections?.titleColor || '#000000', dateFormat: settings.sections?.dateFormat || 'medium' } 
                      })} 
                      className="w-full" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">{t('layout.controls.sections.dateFormat')}</label>
                    <SelectMenu
                      className="w-full"
                      options={dateFormatOptions}
                      value={settings.sections?.dateFormat || 'medium'}
                      placeholder={t('layout.controls.sections.dateFormat')}
                      onSelect={(value) => onSettingsChange({ 
                        ...settings, 
                        sections: { ...settings.sections, dateFormat: value as any, titleColor: settings.sections?.titleColor || '#000000', titleFontSize: settings.sections?.titleFontSize || 12 } 
                      })}
                    />
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{t('layout.controls.sections.dateFormat.help')}</div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
                <button
                  type="button"
                  className="w-full h-9 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
                  onClick={() => {
                    const layoutDefaults = {
                      fontFamily: 'Helvetica' as const,
                      customFont: null,
                      textScale: 1.0,
                      marginsCm: { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 },
                      lineSpacing: 1.4,
                      sectionSpacingPx: 12,
                      columns: 1 as const,
                      atsSafe: false,
                      density: 'normal' as const,
                      textAlignment: 'left' as const,
                      singlePageMode: false,
                    };
                    const headerDefaults = {
                      nameFontSize: 22,
                      nameFontWeight: 'bold' as const,
                      nameColor: '#000000',
                      titleStyle: 'normal' as const,
                      titlePosition: 'below' as const,
                      dividerThickness: 1 as const,
                      dividerStyle: 'solid' as const,
                      iconSizePx: 18 as const,
                      iconSpacingPx: 9 as const,
                      iconAlignment: 'left' as const,
                    };
                    const photoDefaults = {
                      enabled: false,
                      aspectRatio: '1:1' as const,
                      crop: null,
                      dataUrl: null,
                    };
                    const sectionsDefaults = {
                      titleColor: '#000000',
                      titleFontSize: 12,
                      dateFormat: 'medium' as const,
                    };
                    onSettingsChange({ ...settings, layout: layoutDefaults, header: headerDefaults, photo: photoDefaults, sections: sectionsDefaults });
                  }}
                >
                  {t('layout.controls.reset')}
                </button>
              </div>

              {onResetSectionOrder && (
                <div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
                  <button
                    type="button"
                    className="w-full h-9 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm flex items-center justify-center gap-2"
                    onClick={() => {
                      onResetSectionOrder();
                      setShowLayoutModal(false);
                    }}
                    title={t('section.order.reset')}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="font-medium">{t('section.order.reset')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      <ThankYouModal
        show={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
      />
    </>
  );
} 