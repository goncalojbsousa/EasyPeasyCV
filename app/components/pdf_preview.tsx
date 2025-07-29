'use client';

import React, { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { CvDocument } from './cv_document';
import { CvData } from '../types/cv';

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
  show = false,
  onClose,
  lang = 'pt',
}: PdfPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate PDF when component mounts or data changes
  useEffect(() => {
    if (show) {
      generatePdf();
    }
  }, [show, personalInfo, links, resume, experiences, education, skills, languages, certifications, projects, lang]);

  // Block body scroll when modal is open
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
      // Create PDF document
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
          lang={lang}
        />
      );

      // Generate PDF blob
      const blob = await pdf(pdfDoc).toBlob();
      
      // Create URL from blob
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup URL when component unmounts
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
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full h-[98vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Preview do PDF
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-hidden p-2 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">A gerar PDF...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={generatePdf}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          ) : pdfUrl ? (
            <div className="h-full w-full">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0 rounded-lg shadow-lg"
                title="PDF Preview"
                style={{ minHeight: '600px' }}
              />
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