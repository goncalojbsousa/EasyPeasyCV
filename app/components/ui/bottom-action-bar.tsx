'use client';

import React, { useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import PdfDownloadButton from '../pdf_download_button';
import { ThankYouModal } from '../thank_you_modal';
import { ColorSelector } from './color-selector';
import { TemplateSelectorModal } from '../template_selector_modal';
import type { PersonalInfo, Link } from '../../types/cv';
import type { Experience, Education, Language, Certification, Project, Volunteer, CvColor, CvTemplate, CvRenderSettings, CustomSection } from '../../types/cv';

interface BottomActionBarProps {
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
  selectedTemplate: 'renewed';
  selectedColor: CvColor;
  onTemplateChange: (template: 'renewed') => void;
  onColorChange: (color: CvColor) => void;
  onShowPdfPreview: () => void;
  onGeneratePDF: () => boolean;
  onShowSuccessMessage: () => void;
  onScrollToJobAnalysis: () => void;
  onScrollToCVTips: () => void;
  onScrollToAtsExplanation: () => void;
  onExportXml: () => void;
  onImportXml: (xml: string) => void;
  settings?: CvRenderSettings;
  onSettingsChange?: (s: CvRenderSettings) => void;
  onResetSectionOrder?: () => void;
  sectionOrder?: import('../../types/cv').SectionKey[];
}

export function BottomActionBar({
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
  customSections,
  sectionOrder,
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
  onImportXml,
  settings,
  onSettingsChange,
  onResetSectionOrder,
}: BottomActionBarProps) {
  const { t, cvType, setCVType } = useLanguage();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCVTypeOpen, setIsCVTypeOpen] = useState(false);
  const [isDataOpen, setIsDataOpen] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const cvTypeRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);
  const cvTypeBtnRef = useRef<HTMLButtonElement>(null);
  const langBtnRef = useRef<HTMLButtonElement>(null);
  const dataBtnRef = useRef<HTMLButtonElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const layoutBtnRef = useRef<HTMLButtonElement>(null);
  const layoutPortalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (isLangOpen && langRef.current && !langRef.current.contains(target)) setIsLangOpen(false);
      if (isCVTypeOpen && cvTypeRef.current && !cvTypeRef.current.contains(target)) setIsCVTypeOpen(false);
      if (isDataOpen) {
        const insideTrigger = dataRef.current?.contains(target);
        if (!insideTrigger) setIsDataOpen(false);
      }
      if (isLayoutOpen) {
        const insideTrigger = layoutBtnRef.current?.contains(target);
        const insidePortal = layoutPortalRef.current?.contains(target);
        if (!insideTrigger && !insidePortal) setIsLayoutOpen(false);
      }
    };
    if (isLangOpen || isCVTypeOpen || isDataOpen || isLayoutOpen) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [isLangOpen, isCVTypeOpen, isDataOpen, isLayoutOpen]);

  // Hide bar when footer is visible to avoid overlapping it
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const footerEl = document.querySelector('footer');
    if (!footerEl) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        setIsFooterVisible(entry.isIntersecting);
      }
    }, { root: null, threshold: 0 });
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  const useAnchorPosition = (anchor: { current: HTMLElement | null }, open: boolean) => {
    const [pos, setPos] = useState<{ left: number; top: number; width: number } | null>(null);
    useEffect(() => {
      const update = () => {
        if (!anchor.current) return;
        const r = anchor.current.getBoundingClientRect();
        setPos({ left: r.left, top: r.top, width: r.width });
      };
      if (open) {
        update();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
      }
      return () => {
        window.removeEventListener('resize', update);
        window.removeEventListener('scroll', update, true);
      };
    }, [anchor, open]);
    return pos;
  };

  const cvTypePos = useAnchorPosition(cvTypeBtnRef, isCVTypeOpen);
  const langPos = useAnchorPosition(langBtnRef, isLangOpen);
  const dataPos = useAnchorPosition(dataBtnRef, isDataOpen);
  const layoutPos = useAnchorPosition(layoutBtnRef, isLayoutOpen);

  const getCVTypeIcon = useMemo(() => (type: string) => {
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
      ),
    };
    return (icons[type as keyof typeof icons] || icons.other);
  }, []);

  const PdfDownloadButtonWithValidation = ({ lang, children }: { lang: string; children: React.ReactNode }) => {
    const handleClick = (e: React.MouseEvent) => {
      if (!onGeneratePDF()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        setTimeout(() => {
          setIsLangOpen(false);
          onShowSuccessMessage();
        }, 100);
      }
    };
    const handlePdfGenerated = () => setShowThankYouModal(true);
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
          template={selectedTemplate}
          color={selectedColor}
          settings={settings}
          sectionOrder={sectionOrder}
          onPdfGenerated={handlePdfGenerated}
        >
          {children}
        </PdfDownloadButton>
      </div>
    );
  };

  return (
    <>
      <div className={`hidden lg:flex fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all ${isFooterVisible ? 'opacity-0 pointer-events-none translate-y-2' : 'opacity-100'}`}>
        <div className="inline-flex max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200/80 dark:border-zinc-700/60 shadow-xl ring-1 ring-black/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-zinc-900/50">
          <div className="px-2.5 py-2">
            <div className="overflow-x-auto overflow-y-visible no-scrollbar">
              <div className="inline-flex items-center gap-1.5 whitespace-nowrap min-w-max">
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="flex h-9 items-center gap-2 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shrink-0 shadow-sm"
                  title={t('template.selector')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625A3.375 3.375 0 0016.125 8.25h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H8.25"/></svg>
                  <span className="font-medium">{t(`template.${selectedTemplate}.name`)}</span>
                </button>

            {selectedTemplate !== 'classic' && (
              <div className="shrink-0 h-9 flex items-center">
                <ColorSelector selectedColor={selectedColor} onColorChange={onColorChange} show={true} />
              </div>
            )}

            <div className="relative shrink-0 overflow-visible" ref={cvTypeRef}>
              <button
                ref={cvTypeBtnRef}
                onClick={() => setIsCVTypeOpen((v) => { const next = !v; if (next) { setIsLayoutOpen(false); setIsLangOpen(false); setIsDataOpen(false); } return next; })}
                className="flex h-9 items-center gap-2 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
                title={t('cv.type.selector')}
              >
                {getCVTypeIcon(cvType)}
                <span className="font-medium">{t(`cv.type.${cvType}`)}</span>
                <svg className={`w-4 h-4 transition-transform ${isCVTypeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
              </button>
              {isCVTypeOpen && cvTypePos && createPortal(
                <div className="z-[70] w-[260px] max-h-[60vh] overflow-auto bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2"
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{ position: 'fixed', left: cvTypePos.left, top: cvTypePos.top - 8, transform: 'translateY(-100%)' }}>
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">{t('cv.type.selector')}</div>
                  <div className="py-1">
                    {['development','marketing','sales','hr','finance','design','health','education','admin','other'].map((type) => (
                      <button
                        key={type}
                        onClick={() => { setCVType(type as any); setIsCVTypeOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 ${cvType === type ? 'bg-sky-50 dark:bg-sky-900/20 font-semibold text-sky-700 dark:text-sky-400' : ''}`}
                      >
                        {getCVTypeIcon(type)}
                        <span className="font-medium text-sm">{t(`cv.type.${type}`)}</span>
                      </button>
                    ))}
                  </div>
                </div>,
                document.body
              )}
            </div>


            <span aria-hidden="true" className="mx-1.5 h-6 w-px bg-gray-300/50 dark:bg-zinc-600/50 rounded-full" />

            <div className="relative shrink-0 overflow-visible">
              <button
                ref={layoutBtnRef}
                onClick={(e) => { e.stopPropagation(); setIsLayoutOpen((v) => { const next = !v; if (next) { setIsCVTypeOpen(false); setIsLangOpen(false); setIsDataOpen(false); } return next; }); }}
                className="flex h-9 items-center gap-2 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
                title={t('layout.menu.title')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h7v7H3V4zm0 9h7v7H3v-7zm9-9h9v7h-9V4zm0 9h9v7h-9v-7z"/></svg>
                <span className="font-medium">{t('layout.menu.title')}</span>
                <svg className={`w-4 h-4 transition-transform ${isLayoutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
              </button>
              {isLayoutOpen && layoutPos && createPortal(
                <div ref={layoutPortalRef} className="z-[90] w-[380px] max-w-[90vw] max-h-[70vh] overflow-y-auto overflow-x-hidden bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  style={{ position: 'fixed', left: layoutPos.left, top: layoutPos.top - 8, transform: 'translateY(-100%)' }}>
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">{t('layout.menu.controls')}</div>
                  <div className="px-4 py-3 space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">{t('layout.controls.font')}</label>
                      <select
                        className="w-full text-sm p-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
                        value={settings?.layout.fontFamily || 'Helvetica'}
                        onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, layout: { ...settings.layout, fontFamily: e.target.value as any } })}
                      >
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times-Roman">Times New Roman</option>
                        <option value="Arial">Arial</option>
                        <option value="Custom">{t('layout.controls.font.custom')}</option>
                      </select>
                      {settings?.layout.fontFamily === 'Custom' && (
                        <div className="mt-2">
                          <input type="file" accept=".ttf,.otf" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file || !onSettingsChange || !settings) return;
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
                      <label className="block text-xs font-medium mb-1">{`${t('layout.controls.textScale.label')} (${Math.round(((settings?.layout.textScale||1)*100))}%)`}</label>
                      <input type="range" min={0.8} max={1.2} step={0.05} value={settings?.layout.textScale || 1} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, layout: { ...settings.layout, textScale: parseFloat(e.target.value) } })} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">{`${t('layout.controls.margins.title')} (cm)`}</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs">{`${t('layout.controls.margins.top')}: ${settings?.layout.marginsCm.top}`}</span>
                          <input type="range" min={0.5} max={3} step={0.1} value={settings?.layout.marginsCm.top || 1.5} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, layout: { ...settings.layout, marginsCm: { ...settings.layout.marginsCm, top: parseFloat(e.target.value) } } })} />
                        </div>
                        <div>
                          <span className="text-xs">{`${t('layout.controls.margins.bottom')}: ${settings?.layout.marginsCm.bottom}`}</span>
                          <input type="range" min={0.5} max={3} step={0.1} value={settings?.layout.marginsCm.bottom || 1.5} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, layout: { ...settings.layout, marginsCm: { ...settings.layout.marginsCm, bottom: parseFloat(e.target.value) } } })} />
                        </div>
                        <div>
                          <span className="text-xs">{`${t('layout.controls.margins.left')}: ${settings?.layout.marginsCm.left}`}</span>
                          <input type="range" min={0.5} max={3} step={0.1} value={settings?.layout.marginsCm.left || 1.5} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, layout: { ...settings.layout, marginsCm: { ...settings.layout.marginsCm, left: parseFloat(e.target.value) } } })} />
                        </div>
                        <div>
                          <span className="text-xs">{`${t('layout.controls.margins.right')}: ${settings?.layout.marginsCm.right}`}</span>
                          <input type="range" min={0.5} max={3} step={0.1} value={settings?.layout.marginsCm.right || 1.5} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, layout: { ...settings.layout, marginsCm: { ...settings.layout.marginsCm, right: parseFloat(e.target.value) } } })} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">{`${t('layout.controls.lineSpacing.label')} (${settings?.layout.lineSpacing})`}</label>
                      <input type="range" min={1.0} max={2.0} step={0.1} value={settings?.layout.lineSpacing || 1.4} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, layout: { ...settings.layout, lineSpacing: parseFloat(e.target.value) } })} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">{`${t('layout.controls.sectionSpacing.label')} (${settings?.layout.sectionSpacingPx}px)`}</label>
                      <input type="range" min={10} max={30} step={2} value={settings?.layout.sectionSpacingPx || 12} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, layout: { ...settings.layout, sectionSpacingPx: parseInt(e.target.value) } })} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">{t('layout.controls.columns.label')}</label>
                      <select className="w-full text-sm p-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800" value={settings?.layout.columns || 1} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, layout: { ...settings.layout, columns: parseInt(e.target.value) as any } })}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
                      <div className="text-xs font-semibold mb-2">{t('layout.controls.header.title')}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs">{`${t('layout.controls.header.nameSize')} (${settings?.header.nameFontSize})`}</label>
                          <input type="range" min={16} max={28} step={1} value={settings?.header.nameFontSize || 22} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, nameFontSize: parseInt(e.target.value) } })} />
                        </div>
                        <div>
                          <label className="block text-xs">{t('layout.controls.header.weight.label')}</label>
                          <select className="w-full text-sm p-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800" value={settings?.header.nameFontWeight || 'bold'} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, nameFontWeight: e.target.value as any } })}>
                            <option value="normal">{t('layout.controls.header.weight.normal')}</option>
                            <option value="bold">{t('layout.controls.header.weight.bold')}</option>
                            <option value="heavy">{t('layout.controls.header.weight.heavy')}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs">{t('layout.controls.header.iconSize')}</label>
                          <input type="range" min={16} max={24} step={2} value={settings?.header.iconSizePx || 18} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, iconSizePx: parseInt(e.target.value) as any } })} />
                        </div>
                        <div>
                          <label className="block text-xs">{t('layout.controls.header.color')}</label>
                          <input type="color" value={settings?.header.nameColor || '#000000'} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, nameColor: e.target.value } })} className="w-full h-8 p-0" />
                        </div>
                        <div>
                          <label className="block text-xs">{t('layout.controls.header.titleStyle.label')}</label>
                          <select className="w-full text-sm p-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800" value={settings?.header.titleStyle || 'normal'} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, titleStyle: e.target.value as any } })}>
                            <option value="normal">{t('layout.controls.header.titleStyle.normal')}</option>
                            <option value="italic">{t('layout.controls.header.titleStyle.italic')}</option>
                            <option value="uppercase">{t('layout.controls.header.titleStyle.uppercase')}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs">{t('layout.controls.header.titlePosition.label')}</label>
                          <select className="w-full text-sm p-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800" value={settings?.header.titlePosition || 'below'} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, titlePosition: e.target.value as any } })}>
                            <option value="above">{t('layout.controls.header.titlePosition.above')}</option>
                            <option value="below">{t('layout.controls.header.titlePosition.below')}</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs">{t('layout.controls.header.divider.title')}</label>
                          <div className="grid grid-cols-2 gap-2">
                            <select className="w-full min-w-0 text-sm p-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800" value={settings?.header.dividerThickness || 1} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, dividerThickness: parseInt(e.target.value) as any } })}>
                              <option value={1}>1px</option>
                              <option value={2}>2px</option>
                              <option value={3}>3px</option>
                            </select>
                            <select className="w-full min-w-0 text-sm p-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800" value={settings?.header.dividerStyle || 'solid'} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, dividerStyle: e.target.value as any } })}>
                              <option value="solid">{t('layout.controls.header.divider.style.solid')}</option>
                              <option value="dashed">{t('layout.controls.header.divider.style.dashed')}</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs">{t('layout.controls.header.iconSpacing')}</label>
                          <input type="range" min={5} max={15} step={2} value={settings?.header.iconSpacingPx || 9} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, iconSpacingPx: parseInt(e.target.value) as any } })} />
                        </div>
                        <div>
                          <label className="block text-xs">{t('layout.controls.header.alignment')}</label>
                          <select className="w-full text-sm p-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800" value={settings?.header.iconAlignment || 'left'} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, iconAlignment: e.target.value as any } })}>
                            <option value="left">{t('layout.controls.header.alignment.left')}</option>
                            <option value="center">{t('layout.controls.header.alignment.center')}</option>
                            <option value="right">{t('layout.controls.header.alignment.right')}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
                      <div className="text-xs font-semibold mb-2">{t('layout.controls.photo.title')}</div>
                      <label className="flex items-center gap-2 text-xs font-medium">
                        <input type="checkbox" checked={settings?.photo.enabled || false} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, photo: { ...settings.photo, enabled: e.target.checked } })} />
                        {t('layout.controls.photo.enable')}
                      </label>
                      {settings?.photo.enabled && (
                        <div className="mt-2 space-y-2">
                          <select className="w-full text-sm p-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800" value={settings?.photo.aspectRatio || '1:1'} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, photo: { ...settings.photo, aspectRatio: e.target.value as any } })}>
                            <option value="1:1">1:1</option>
                            <option value="3:4">3:4</option>
                            <option value="4:3">4:3</option>
                          </select>
                          <input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file || !onSettingsChange || !settings) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              const dataUrl = typeof reader.result === 'string' ? reader.result : '';
                              onSettingsChange({ ...settings, photo: { ...settings.photo, dataUrl } });
                            };
                            reader.readAsDataURL(file);
                          }} className="w-full text-sm" />
                          <div className="text-[11px] text-gray-500 dark:text-gray-400">{t('layout.controls.photo.help')}</div>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
                      <button
                        type="button"
                        className="w-full h-9 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
                        onClick={() => {
                          if (!onSettingsChange || !settings) return;
                          const layoutDefaults = {
                            fontFamily: 'Helvetica' as const,
                            customFont: null,
                            textScale: 1.0,
                            marginsCm: { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 },
                            lineSpacing: 1.4,
                            sectionSpacingPx: 12,
                            columns: 1 as const,
                            atsSafe: false,
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
                          onSettingsChange({ ...settings, layout: layoutDefaults, header: headerDefaults, photo: photoDefaults });
                        }}
                      >
                        {t('layout.controls.reset')}
                      </button>
                    </div>

                    {onResetSectionOrder && (
                      <div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
                        <button
                          type="button"
                          onClick={onResetSectionOrder}
                          className="w-full h-9 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
                          title={t('section.order.reset')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.6m15.4 2A8 8 0 004.6 9M4.6 9H9m11 11v-5h-.6m0 0a8 8 0 01-15.4-2m15.4 2H15" /></svg>
                          <span className="font-medium">{t('section.order.reset')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>,
                document.body
              )}
            </div>

            <div className="relative shrink-0 overflow-visible" ref={langRef}>
              <button
                ref={langBtnRef}
                onClick={() => setIsLangOpen((v) => { const next = !v; if (next) { setIsCVTypeOpen(false); setIsLayoutOpen(false); setIsDataOpen(false); } return next; })}
                className="h-9 bg-sky-600 text-white px-3 rounded-md font-semibold hover:bg-sky-700 active:bg-sky-800 transition-colors duration-200 flex items-center gap-2 shadow-sm ring-1 ring-sky-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                {t('generate.ats.resume')}
                <svg className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
              </button>
              {isLangOpen && langPos && createPortal(
                <div className="z-[70] w-[280px] bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2"
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{ position: 'fixed', left: langPos.left, top: langPos.top - 8, transform: 'translateY(-100%)' }}>
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">{t('select.language')}</div>
                  <div className="py-1">
                    <PdfDownloadButtonWithValidation lang="en">
                      <div className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-6 h-6"><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect><path d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z" fill="#fff"></path><path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path><path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path><path d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z" fill="#fff"></path><rect x="13" y="4" width="6" height="24" fill="#fff"></rect><rect x="1" y="13" width="30" height="6" fill="#fff"></rect><rect x="14" y="4" width="4" height="24" fill="#b92932"></rect><rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect><path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path><path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>
                        <span className="font-medium text-sm">{t('language.english')}</span>
                      </div>
                    </PdfDownloadButtonWithValidation>
                    <PdfDownloadButtonWithValidation lang="pt">
                      <div className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-6 h-6"><path d="M5,4H13V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#2b6519"></path><path d="M16,4h15V28h-15c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" transform="rotate(180 21.5 16)" fill="#ea3323"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path><circle cx="12" cy="16" r="5" fill="#ff5"></circle><path d="M14.562,13.529l-5.125-.006v3.431h0c.004,.672,.271,1.307,.753,1.787,.491,.489,1.132,.759,1.805,.759,.684,0,1.328-.267,1.813-.75,.485-.484,.753-1.126,.753-1.808v-3.413Z" fill="#ea3323"></path></svg>
                        <span className="font-medium text-sm">{t('language.portuguese')}</span>
                      </div>
                    </PdfDownloadButtonWithValidation>
                    <PdfDownloadButtonWithValidation lang="br">
                      <div className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-6 h-6"><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#459a45"></rect><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M3.472,16l12.528,8,12.528-8-12.528-8L3.472,16Z" fill="#fedf00"></path><circle cx="16" cy="16" r="5" fill="#0a2172"></circle><path d="M14,14.5c-.997,0-1.958,.149-2.873,.409-.078,.35-.126,.71-.127,1.083,.944-.315,1.951-.493,2.999-.493,2.524,0,4.816,.996,6.519,2.608,.152-.326,.276-.666,.356-1.026-1.844-1.604-4.245-2.583-6.875-2.583Z" fill="#fff"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>
                        <span className="font-medium text-sm">{t('language.brazilianPortuguese')}</span>
                      </div>
                    </PdfDownloadButtonWithValidation>
                    <PdfDownloadButtonWithValidation lang="es">
                      <div className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-6 h-6"><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#c60b1e"></rect><rect x="1" y="10" width="30" height="12" fill="#ffc400"></rect><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="none" stroke="#000" opacity=".1"></rect></svg>
                        <span className="font-medium text-sm">{t('language.spanish')}</span>
                      </div>
                    </PdfDownloadButtonWithValidation>
                  </div>
                </div>,
                document.body
              )}
            </div>

            <span aria-hidden="true" className="mx-1.5 h-6 w-px bg-gray-300/50 dark:bg-zinc-600/50 rounded-full" />

            <div className="relative shrink-0 overflow-visible" ref={dataRef}>
              <button
                ref={dataBtnRef}
                onClick={() => setIsDataOpen((v) => { const next = !v; if (next) { setIsCVTypeOpen(false); setIsLayoutOpen(false); setIsLangOpen(false); } return next; })}
                className="h-9 px-3 rounded-md font-semibold transition-colors duration-200 flex items-center gap-2 shadow-sm border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700"
                title={t('data.xml.title')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3H4V5Zm16 5H4v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9Z"/></svg>
                <span>{t('data.xml.title')}</span>
                <svg className={`w-4 h-4 transition-transform ${isDataOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
              </button>
              {isDataOpen && dataPos && createPortal(
                <div className="z-[70] w-[260px] bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2"
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{ position: 'fixed', left: dataPos.left, top: dataPos.top - 8, transform: 'translateY(-100%)' }}>
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">{t('data.xml.title')}</div>
                  <button type="button" className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 flex items-center gap-2" onClick={() => { setIsDataOpen(false); onExportXml(); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 16a1 1 0 0 1-.707-.293l-3-3 1.414-1.414L11 12.586V4h2v8.586l1.293-1.293 1.414 1.414-3 3A1 1 0 0 1 12 16Z"/><path d="M5 20h14a1 1 0 1 0 0-2H5a1 1 0 1 0 0 2Z"/></svg>
                    <span>{t('data.xml.export')}</span>
                  </button>
                  <input ref={importInputRef} type="file" accept=".xml,application/xml,text/xml" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const text = typeof reader.result === 'string' ? reader.result : '';
                      if (text) onImportXml(text);
                      if (importInputRef.current) importInputRef.current.value = '';
                      setIsDataOpen(false);
                    };
                    reader.readAsText(file);
                  }} />
                  <button type="button" className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 flex items-center gap-2" onClick={() => importInputRef.current?.click()}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 8a1 1 0 0 1 .707.293l3 3-1.414 1.414L13 11.414V20h-2v-8.586l-1.293 1.293-1.414-1.414 3-3A1 1 0 0 1 12 8Z"/><path d="M5 4h14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2Z"/></svg>
                    <span>{t('data.xml.import')}</span>
                  </button>
                </div>,
                document.body
              )}
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TemplateSelectorModal
        show={showTemplateModal}
        selectedTemplate={selectedTemplate}
        onSelect={(tpl) => {
          onTemplateChange(tpl);
          setShowTemplateModal(false);
        }}
        onClose={() => setShowTemplateModal(false)}
      />

      <ThankYouModal show={showThankYouModal} onClose={() => setShowThankYouModal(false)} />
    </>
  );
}
