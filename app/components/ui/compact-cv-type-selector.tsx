
'use client';
import type { CVType } from '../../contexts/LanguageContext';

import { useLanguage } from '../../contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';

/**
 * Compact CV Type Selector component
 * A compact version of the CV type selector for use in the floating action bar.
 * Handles dropdown for CV type selection and displays icons for each type.
 */
export function CompactCVTypeSelector() {
  const { cvType, setCVType, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  // Não exibe mais nada relacionado a template
  return null;
} 