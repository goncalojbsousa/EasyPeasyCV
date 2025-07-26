'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { CvDocument } from './cv_document';
import { CvData } from '../types/cv';

/**
 * Props interface for the PdfDownloadButton component
 */
interface PdfDownloadButtonProps extends CvData {
  /** Language for the PDF document (pt or en) */
  lang?: string;
  /** Custom children to render inside the button */
  children?: React.ReactNode;
}

/**
 * PdfDownloadButton component provides a download link for CV PDF generation
 * @param children - Custom content to display in the button
 * @param pdfProps - All CV data properties for PDF generation
 * @returns PDF download link component
 */
export default function PdfDownloadButton(props: PdfDownloadButtonProps) {
  const { children, ...pdfProps } = props;
  return (
    <PDFDownloadLink
      document={<CvDocument {...pdfProps} />}
      fileName="curriculo.pdf"
    >
      {({ loading }) =>
        children || (loading ? 'Gerando PDF...' : 'Gerar Currículo em PDF')
      }
    </PDFDownloadLink>
  );
} 