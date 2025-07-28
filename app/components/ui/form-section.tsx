'use client';

import { ReactNode } from 'react';

/**
 * Props interface for the FormSection component
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
 * FormSection component provides a consistent layout for form sections with title, icon, and optional action button
 * @param title - The title text for the section
 * @param icon - The icon element to display
 * @param children - The form elements to render inside the section
 * @param actionButton - Optional action button to display in the header
 * @returns JSX element representing a form section with header and content
 */
export function FormSection({ title, icon, children, actionButton }: FormSectionProps) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Section header with gray background */}
      <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 rounded-t-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-800">
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