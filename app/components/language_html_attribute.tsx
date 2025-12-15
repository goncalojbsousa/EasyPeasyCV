'use client';

import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Component that dynamically sets the HTML lang attribute based on the selected language
 */
/**
 * Language HTML Attribute component
 * Dynamically sets the HTML lang attribute based on the current language
 * @returns JSX element that sets the document language attribute
 */
export function LanguageHtmlAttribute() {
  const { language } = useLanguage();

  useEffect(() => {
    // Dynamically set the HTML lang attribute based on the current language selection
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  return null; // This component doesn't render anything
} 