'use client';

import { ReactNode } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Props for the FormSection component.
 */
interface FormSectionProps {
  /** Title text for the section */
  title: string;
  /** Icon element to display next to the title */
  icon: ReactNode;
  /** Child elements to render inside the section */
  children: ReactNode;
  /** Optional action button to display in the header */
  actionButton?: ReactNode;
  /** Whether this section can be reordered (false for Personal Information) */
  canReorder?: boolean;
  /** Callback when user clicks move up button */
  onMoveUp?: () => void;
  /** Callback when user clicks move down button */
  onMoveDown?: () => void;
  /** Whether move up button should be disabled */
  canMoveUp?: boolean;
  /** Whether move down button should be disabled */
  canMoveDown?: boolean;
}

/**
 * FormSection component provides a consistent layout for form sections with title, icon, and optional action button.
 * Renders a header and content area for grouping related form fields.
 */
export function FormSection({ 
  title, 
  icon, 
  children, 
  actionButton,
  canReorder = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: FormSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-white dark:bg-zinc-800 border border-gray-200/80 dark:border-zinc-700/60 rounded-xl shadow-sm transition-colors duration-300">
      {/* Section header with gray background */}
      <div className="bg-gray-50 dark:bg-zinc-900 px-6 py-4 border-b border-gray-200/80 dark:border-zinc-700/60 rounded-t-xl transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-2 flex-1">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <span className="text-sky-600">
                {icon}
              </span>
              {title}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {canReorder && (
              <div className="flex gap-1 mr-2">
                <button
                  type="button"
                  onClick={onMoveUp}
                  disabled={!canMoveUp}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    canMoveUp
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600'
                      : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  }`}
                  aria-label={t('section.move.up')}
                  title={t('section.move.up')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={onMoveDown}
                  disabled={!canMoveDown}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    canMoveDown
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600'
                      : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  }`}
                  aria-label={t('section.move.down')}
                  title={t('section.move.down')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
            {actionButton}
          </div>
        </div>
      </div>
      {/* Section content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}