'use client';

import React, { useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { 
  Code,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Palette,
  Heart,
  BookOpen,
  Building,
  Package,
  FileText,
  ChevronDown,
  Grid2x2,
  RotateCcw,
  Database,
  Download,
  Upload,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import PdfDownloadButton from '../pdf_download_button';
import { ThankYouModal } from '../thank_you_modal';
import { ColorSelector } from './color-selector';
import { SelectMenu, type SelectOption } from './select-menu';
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
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const pdfButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const fontOptions: SelectOption<string>[] = useMemo(() => ([
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times-Roman', label: 'Times New Roman' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Custom', label: t('layout.controls.font.custom') },
  ]), [t]);

  const columnOptions: SelectOption<number>[] = useMemo(() => ([
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
  ]), []);

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

  const titlePositionOptions: SelectOption<string>[] = useMemo(() => ([
    { value: 'above', label: t('layout.controls.header.titlePosition.above') },
    { value: 'below', label: t('layout.controls.header.titlePosition.below') },
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

  const alignmentOptions: SelectOption<string>[] = useMemo(() => ([
    { value: 'left', label: t('layout.controls.header.alignment.left') },
    { value: 'center', label: t('layout.controls.header.alignment.center') },
    { value: 'right', label: t('layout.controls.header.alignment.right') },
  ]), [t]);

  const aspectRatioOptions: SelectOption<string>[] = useMemo(() => ([
    { value: '1:1', label: '1:1' },
    { value: '3:4', label: '3:4' },
    { value: '4:3', label: '4:3' },
  ]), []);

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
      development: <Code className="w-4 h-4" />,
      marketing: <BarChart3 className="w-4 h-4" />,
      sales: <TrendingUp className="w-4 h-4" />,
      hr: <Users className="w-4 h-4" />,
      finance: <DollarSign className="w-4 h-4" />,
      design: <Palette className="w-4 h-4" />,
      health: <Heart className="w-4 h-4" />,
      education: <BookOpen className="w-4 h-4" />,
      admin: <Building className="w-4 h-4" />,
      other: <Package className="w-4 h-4" />,
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
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">{t(`template.${selectedTemplate}.name`)}</span>
                </button>

            {selectedTemplate !== 'renewed' && (
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
                <ChevronDown className={`w-4 h-4 transition-transform ${isCVTypeOpen ? 'rotate-180' : ''}`} />
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
                <Grid2x2 className="w-4 h-4" />
                <span className="font-medium">{t('layout.menu.title')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLayoutOpen ? 'rotate-180' : ''}`} />
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
                      <SelectMenu
                        className="w-full"
                        options={fontOptions}
                        value={settings?.layout.fontFamily || 'Helvetica'}
                        placeholder={t('layout.controls.font')}
                        onSelect={(value) => onSettingsChange && settings && onSettingsChange({ ...settings, layout: { ...settings.layout, fontFamily: value as any } })}
                      />
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
                      <SelectMenu
                        className="w-full"
                        options={columnOptions}
                        value={settings?.layout.columns || 1}
                        placeholder={t('layout.controls.columns.label')}
                        onSelect={(value) => onSettingsChange && settings && onSettingsChange({ ...settings, layout: { ...settings.layout, columns: value as any } })}
                      />
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
                          <SelectMenu
                            className="w-full"
                            options={headerWeightOptions}
                            value={settings?.header.nameFontWeight || 'bold'}
                            placeholder={t('layout.controls.header.weight.label')}
                            onSelect={(value) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, nameFontWeight: value as any } })}
                          />
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
                          <SelectMenu
                            className="w-full"
                            options={titleStyleOptions}
                            value={settings?.header.titleStyle || 'normal'}
                            placeholder={t('layout.controls.header.titleStyle.label')}
                            onSelect={(value) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, titleStyle: value as any } })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs">{t('layout.controls.header.titlePosition.label')}</label>
                          <SelectMenu
                            className="w-full"
                            options={titlePositionOptions}
                            value={settings?.header.titlePosition || 'below'}
                            placeholder={t('layout.controls.header.titlePosition.label')}
                            onSelect={(value) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, titlePosition: value as any } })}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs">{t('layout.controls.header.divider.title')}</label>
                          <div className="grid grid-cols-2 gap-2">
                            <SelectMenu
                              className="w-full min-w-0"
                              options={dividerThicknessOptions}
                              value={settings?.header.dividerThickness || 1}
                              placeholder={t('layout.controls.header.divider.title')}
                              onSelect={(value) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, dividerThickness: value as any } })}
                            />
                            <SelectMenu
                              className="w-full min-w-0"
                              options={dividerStyleOptions}
                              value={settings?.header.dividerStyle || 'solid'}
                              placeholder={t('layout.controls.header.divider.title')}
                              onSelect={(value) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, dividerStyle: value as any } })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs">{t('layout.controls.header.iconSpacing')}</label>
                          <input type="range" min={5} max={15} step={2} value={settings?.header.iconSpacingPx || 9} onChange={(e) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, iconSpacingPx: parseInt(e.target.value) as any } })} />
                        </div>
                        <div>
                          <label className="block text-xs">{t('layout.controls.header.alignment')}</label>
                          <SelectMenu
                            className="w-full"
                            options={alignmentOptions}
                            value={settings?.header.iconAlignment || 'left'}
                            placeholder={t('layout.controls.header.alignment')}
                            onSelect={(value) => onSettingsChange && settings && onSettingsChange({ ...settings, header: { ...settings.header, iconAlignment: value as any } })}
                          />
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
                          <SelectMenu
                            className="w-full"
                            options={aspectRatioOptions}
                            value={settings?.photo.aspectRatio || '1:1'}
                            placeholder={t('layout.controls.photo.title')}
                            onSelect={(value) => onSettingsChange && settings && onSettingsChange({ ...settings, photo: { ...settings.photo, aspectRatio: value as any } })}
                          />
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
                        <RotateCcw className="w-4 h-4" />
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
                className="h-9 bg-sky-600 text-white px-3 rounded-md text-[15px] font-semibold hover:bg-sky-700 active:bg-sky-800 transition-colors duration-200 flex items-center gap-2 shadow-sm ring-1 ring-sky-500/20"
                title={t('generate.ats.resume')}
              >
                <FileText className="w-5 h-5" />
                {t('generate.ats.resume')}
                <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangOpen && langPos && createPortal(
                <div className="z-[70] w-[260px] max-h-[60vh] overflow-auto bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2"
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{ position: 'fixed', left: langPos.left, top: langPos.top - 8, transform: 'translateY(-100%)' }}>
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">{t('select.language')}</div>
                  <div className="py-1">
                    <PdfDownloadButtonWithValidation lang="en">
                      <div className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-6 h-6"><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect><path d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z" fill="#fff"></path><path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path><path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path><path d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z" fill="#fff"></path><rect x="13" y="4" width="6" height="24" fill="#fff"></rect><rect x="1" y="13" width="30" height="6" fill="#fff"></rect><rect x="14" y="4" width="4" height="24" fill="#b92932"></rect><rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect><path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path><path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>
                        <span className="font-medium text-sm">{t('language.english')}</span>
                      </div>
                    </PdfDownloadButtonWithValidation>
                    <PdfDownloadButtonWithValidation lang="pt">
                      <div className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-6 h-6"><path d="M5,4H13V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#2b6519"></path><path d="M16,4h15V28h-15c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" transform="rotate(180 21.5 16)" fill="#ea3323"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path><circle cx="12" cy="16" r="5" fill="#ff5"></circle><path d="M14.562,13.529l-5.125-.006v3.431h0c.004,.672,.271,1.307,.753,1.787,.491,.489,1.132,.759,1.805,.759,.684,0,1.328-.267,1.813-.75,.485-.484,.753-1.126,.753-1.808v-3.413Z" fill="#ea3323"></path></svg>
                        <span className="font-medium text-sm">{t('language.portuguese')}</span>
                      </div>
                    </PdfDownloadButtonWithValidation>
                    <PdfDownloadButtonWithValidation lang="br">
                      <div className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" className="w-6 h-6"><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#459a45"></rect><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M3.472,16l12.528,8,12.528-8-12.528-8L3.472,16Z" fill="#fedf00"></path><circle cx="16" cy="16" r="5" fill="#0a2172"></circle><path d="M14,14.5c-.997,0-1.958,.149-2.873,.409-.078,.35-.126,.71-.127,1.083,.944-.315,1.951-.493,2.999-.493,2.524,0,4.816,.996,6.519,2.608,.152-.326,.276-.666,.356-1.026-1.844-1.604-4.245-2.583-6.875-2.583Z" fill="#fff"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>
                        <span className="font-medium text-sm">{t('language.brazilianPortuguese')}</span>
                      </div>
                    </PdfDownloadButtonWithValidation>
                    <PdfDownloadButtonWithValidation lang="es">
                      <div className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 cursor-pointer">
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
              {/* Input FORA do portal */}
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
                    if (text) {
                      onImportXml(text);
                      if (importInputRef.current) importInputRef.current.value = '';
                      setIsDataOpen(false);
                    }
                  };
                  
                  reader.readAsText(file, 'UTF-8');
                }} 
              />
              
              <button
                ref={dataBtnRef}
                onClick={() => setIsDataOpen((v) => { const next = !v; if (next) { setIsCVTypeOpen(false); setIsLayoutOpen(false); setIsLangOpen(false); } return next; })}
                className="flex h-9 items-center gap-2 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm"
                title={t('data.xml.title')}
              >
                <Database className="w-4 h-4" />
                <span className="font-medium">{t('data.xml.title')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDataOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDataOpen && dataPos && createPortal(
                <div className="z-[70] w-[260px] max-h-[60vh] overflow-auto bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2"
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{ position: 'fixed', left: dataPos.left, top: dataPos.top - 8, transform: 'translateY(-100%)' }}>
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">{t('data.xml.title')}</div>
                  <button type="button" className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 flex items-center gap-2" onClick={() => { setIsDataOpen(false); onExportXml(); }}>
                    <Download className="w-4 h-4" />
                    <span>{t('data.xml.export')}</span>
                  </button>
                  <button 
                    type="button" 
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 flex items-center gap-2" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      importInputRef.current?.click();
                    }}
                  >
                    <Upload className="w-4 h-4" />
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
