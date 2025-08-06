'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { CvDocument } from './cv_document';
import { CvData, CvColor } from '../types/cv';

/**
 * Props interface for the PdfDownloadButton component
 */
interface PdfDownloadButtonProps extends CvData {
  /** Language for the PDF document (pt or en) */
  lang?: string;
  /** Selected CV template */
  template?: 'classic' | 'modern' | 'creative';
  /** Selected color theme */
  color?: CvColor;
  /** Custom children to render inside the button */
  children?: React.ReactNode;
  /** Callback function to show thank you modal after PDF generation */
  onPdfGenerated?: () => void;
}

/**
 * PdfDownloadButton component provides a download link for CV PDF generation
 * @param children - Custom content to display in the button
 * @param pdfProps - All CV data properties for PDF generation
 * @returns PDF download link component
 */
/**
 * PDF Download Button component
 * Generates and downloads a PDF version of the CV
 * @param props - Component props including CV data and language
 * @returns JSX element representing a button that triggers PDF download
 */
export default function PdfDownloadButton(props: PdfDownloadButtonProps) {
  const { children, onPdfGenerated, ...pdfProps } = props;
  
  const handleDownload = () => {
    // Call the callback after a short delay to ensure PDF generation has started
    if (onPdfGenerated) {
      setTimeout(() => {
        onPdfGenerated();
      }, 500);
    }
  };

  return (
    <PDFDownloadLink
      document={<CvDocument {...pdfProps} />}
      fileName="curriculo.pdf"
      onClick={handleDownload}
    >
      {({ loading }) =>
        children || (loading ? 'Gerando PDF...' : 'Gerar Currículo em PDF')
      }
    </PDFDownloadLink>
  );
} 