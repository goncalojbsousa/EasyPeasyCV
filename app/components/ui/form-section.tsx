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
    <div className="w-full">
      {/* Section header with title, icon, and optional action button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <span className="text-blue-600">
            {icon}
          </span>
          {title}
        </h2>
        {actionButton}
      </div>
      {children}
    </div>
  );
} 