'use client';

import React, { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { CvDocument } from './cv_document';
import { CvData, CvColor } from '../types/cv';

/**
 * Props interface for the PdfPreview component
 */
interface PdfPreviewProps extends CvData {
  /** Whether to show the preview */
  show?: boolean;
  /** Function to close the preview */
  onClose?: () => void;
  /** Language for the document (pt or en) */
  lang?: string;
  /** Selected CV template */
  template?: 'classic' | 'modern' | 'creative';
  /** Selected color theme */
  color?: CvColor;
}

/**
 * PdfPreview component renders the actual PDF using iframe
 * Shows the exact PDF that will be generated
 */
/**
 * PDF Preview component
 * Displays a real-time preview of the CV as a PDF in a modal
 * @param props - Component props including CV data, modal controls, and language
 * @returns JSX element representing a modal with PDF preview
 */
export function PdfPreview({
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
  show = false,
  onClose,
  lang = 'pt',
  template = 'classic',
  color = 'blue',
}: PdfPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [pdfSize, setPdfSize] = useState<number>(0);

  // Detect if the device is mobile to adjust PDF preview behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate PDF whenever the modal is shown or any relevant data changes
  useEffect(() => {
    if (show) {
      generatePdf();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, personalInfo, links, resume, experiences, education, skills, languages, certifications, projects, volunteers, lang, template, color]);

  // Prevent body scroll when the modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  const generatePdf = async () => {
    setLoading(true);
    setError(null);
    try {
  // Create the PDF document component with all CV data
      const pdfDoc = (
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
          lang={lang}
          template={template}
          color={color}
        />
      );

  // Generate a PDF blob from the document
      const blob = await pdf(pdfDoc).toBlob();
      setPdfSize(blob.size);
      
  // Create a URL from the PDF blob for preview
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      setError(`Erro ao gerar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup the PDF URL when the component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl max-w-7xl w-full h-[98vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Preview do PDF
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-hidden p-2 bg-gray-50 dark:bg-zinc-800">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">A gerar PDF...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={generatePdf}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          ) : pdfUrl ? (
            <div className="h-full w-full">
              {isMobile ? (
                // Mobile: Show download and open options instead of iframe
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="max-w-md">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      PDF Gerado com Sucesso!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      A visualização direta do PDF pode não funcionar no telemóvel.
                    </p>
                    <div className="space-y-3">
                      <a
                        href={pdfUrl}
                        download="curriculo.pdf"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Baixar PDF
                      </a>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Abrir PDF numa nova aba
                      </a>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                      Tamanho: {(pdfSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                // Desktop: Show iframe
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0 rounded-lg shadow-lg"
                  title="PDF Preview"
                  style={{ minHeight: '600px' }}
                  onLoad={() => console.log('PDF iframe loaded successfully')}
                  onError={() => {
                    setError('Erro ao carregar PDF no iframe');
                  }}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600">Erro ao carregar PDF</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 