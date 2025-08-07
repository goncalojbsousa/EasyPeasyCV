'use client';

import { ReactNode } from 'react';

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
}

/**
 * FormSection component provides a consistent layout for form sections with title, icon, and optional action button.
 * Renders a header and content area for grouping related form fields.
 */
export function FormSection({ title, icon, children, actionButton }: FormSectionProps) {
  return (
    <div className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm transition-colors duration-300">
      {/* Section header with gray background */}
      <div className="bg-gray-50 dark:bg-zinc-900 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-zinc-700 rounded-t-lg transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <span className="text-blue-600">
              {icon}
            </span>
            {title}
          </h2>
          {actionButton}
        </div>
      </div>
      {/* Section content */}
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
} 