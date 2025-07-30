'use client';

import { ReactNode } from 'react';

/**
 * Props interface for the FormField component
 */
interface FormFieldProps {
  /** Label text for the form field */
  label: string;
  /** Child elements to render inside the form field */
  children: ReactNode;
  /** Whether the field is required (shows red asterisk) */
  required?: boolean;
  /** Helper text to display next to the label */
  helperText?: string;
}

/**
 * FormField component provides a consistent layout for form inputs with labels
 * @param label - The label text for the form field
 * @param children - The form input elements to render
 * @param required - Whether the field is required (defaults to false)
 * @param helperText - Optional helper text to display
 * @returns JSX element representing a form field with label and input
 */
export function FormField({ label, children, required = false, helperText }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
        {label}
        {/* Required field indicator */}
        {required && <span className="text-red-500">*</span>}
        {/* Helper text display */}
        {helperText && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({helperText})</span>}
      </label>
      {children}
    </div>
  );
} 