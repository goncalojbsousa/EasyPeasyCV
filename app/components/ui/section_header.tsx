'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChevronUp, ChevronDown } from 'lucide-react';

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
            <ChevronUp className="h-5 w-5" />
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
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
