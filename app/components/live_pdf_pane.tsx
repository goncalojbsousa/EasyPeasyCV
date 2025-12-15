"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { pdf } from "@react-pdf/renderer";
import { CvDocument } from "./cv_document";
import { CvColor, CvTemplate, CvData, CvRenderSettings } from "../types/cv";
import { PdfCanvasViewer } from "./pdf/pdf_canvas_viewer";

interface LivePdfPaneProps extends CvData {
  lang?: string;
  template?: CvTemplate;
  color?: CvColor;
  settings?: CvRenderSettings;
}

export function LivePdfPane({
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
  lang = "pt",
  template = "renewed",
  color = "blue",
  settings,
  sectionOrder,
}: LivePdfPaneProps) {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [debouncedTick, setDebouncedTick] = useState(0);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    
    check();
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTick((v) => v + 1), 500);
    return () => clearTimeout(t);
  }, [personalInfo, links, resume, experiences, education, skills, languages, certifications, projects, volunteers, customSections, lang, template, color, settings, sectionOrder]);

  const doc = useMemo(() => (
    <CvDocument
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
      settings={settings}
      sectionOrder={sectionOrder}
    />
  ), [personalInfo, links, resume, experiences, education, skills, languages, certifications, projects, volunteers, customSections, lang, template, color, settings, sectionOrder]);

  // Generate a PDF blob whenever debounced data changes
  useEffect(() => {
    let canceled = false;
    const generate = async () => {
      if (isMobile) return;
      setLoading(true);
      setError(null);
      try {
        const blob = await pdf(doc).toBlob();
        if (canceled) return;
        setPdfBlob(blob);
      } catch (e) {
        console.error('PDF preview generation error:', e);
        if (!canceled) {
          const msg = e instanceof Error ? e.message : JSON.stringify(e);
          setError(`Erro ao gerar preview do PDF: ${msg}`);
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };
    generate();
    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTick]);

  if (isMobile) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="text-center p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('live.preview.desktop.only')}</p>
        </div>
      </div>
    );
  }

  const refreshPreview = () => setDebouncedTick((v) => v + 1);

  return (
    <div className="w-full h-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-zinc-800">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('live.preview.title')}</div>
        <button
          onClick={refreshPreview}
          className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
          type="button"
        >
          {t('live.preview.refresh')}
        </button>
      </div>
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('live.preview.loading')}</p>
            </div>
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : pdfBlob ? (
          <div className="w-full h-full overflow-hidden bg-transparent">
            <PdfCanvasViewer 
              blob={pdfBlob} 
              scale={1.0} 
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('live.preview.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
