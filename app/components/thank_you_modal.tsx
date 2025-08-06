'use client';

import { useLanguage } from '../contexts/LanguageContext';

/**
 * Props interface for the ThankYouModal component
 */
interface ThankYouModalProps {
  /** Whether the modal is visible */
  show: boolean;
  /** Function to close the modal */
  onClose: () => void;
}

/**
 * ThankYouModal component
 * Displays a thank you message and donation option after PDF generation
 * @param show - Whether the modal is visible
 * @param onClose - Function to close the modal
 * @returns JSX element representing the thank you modal
 */
export function ThankYouModal({ show, onClose }: ThankYouModalProps) {
  const { t } = useLanguage();

  if (!show) return null;

  const handleDonationClick = () => {
    window.open('https://ko-fi.com/opencvlab', '_blank');
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Success icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {t('thank.you.title')}
          </h3>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
            {t('thank.you.message')}
          </p>

          {/* Donation section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                {t('donation.title')}
              </span>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-xs mb-4">
              {t('donation.message')}
            </p>
            <button
              onClick={handleDonationClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('donation.button')}
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="w-full bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            {t('thank.you.close')}
          </button>
        </div>
      </div>
    </div>
  );
} 