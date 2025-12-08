'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SectionHeaderProps {
  /** Title of the section */
  title: string;
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
 * Section Header component with optional reordering arrows
 * Used in all form sections to provide consistent styling and reordering functionality
 */
export function SectionHeader({
  title,
  canReorder = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: SectionHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
        {title}
      </h2>
      
      {canReorder && (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className={`p-2 rounded-md transition-colors duration-200 ${
              canMoveUp
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600'
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
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600'
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
    </div>
  );
}
