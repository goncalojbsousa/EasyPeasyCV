import dynamic from 'next/dynamic';

/**
 * Dynamically imported PDF download button component
 * This prevents SSR issues with PDF generation libraries
 */
const PdfDownloadButton = dynamic(() => import('./pdf_download_button'), {
  ssr: false,
  loading: () => <div className="flex items-center gap-3 px-4 py-3 text-gray-500 cursor-not-allowed">
    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    <span>Carregando...</span>
  </div>,
});
 
export default PdfDownloadButton; 