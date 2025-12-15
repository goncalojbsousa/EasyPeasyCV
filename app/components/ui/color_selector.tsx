import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

import { CvColor } from '../../types/cv';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Props for the ColorSelector component.
 */
interface ColorSelectorProps {
  selectedColor: CvColor;
  onColorChange: (color: CvColor) => void;
  show?: boolean; // Controls visibility of the selector
}

/**
 * Color configuration for each available color option.
 * Includes both Portuguese and English names for translation.
 */
const colors: Record<CvColor, {
  name: string;
  nameEn: string;
  primary: string;
  secondary: string;
  accent: string;
}> = {
  blue: {
    name: 'Azul',
    nameEn: 'Blue',
    primary: '#3b82f6',
    secondary: '#1e40af',
    accent: '#dbeafe'
  },
  green: {
    name: 'Verde',
    nameEn: 'Green',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#d1fae5'
  },
  purple: {
    name: 'Roxo',
    nameEn: 'Purple',
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#ede9fe'
  },
  orange: {
    name: 'Laranja',
    nameEn: 'Orange',
    primary: '#f59e0b',
    secondary: '#d97706',
    accent: '#fed7aa'
  },
  red: {
    name: 'Vermelho',
    nameEn: 'Red',
    primary: '#ef4444',
    secondary: '#dc2626',
    accent: '#fecaca'
  },
  teal: {
    name: 'Verde-azulado',
    nameEn: 'Teal',
    primary: '#14b8a6',
    secondary: '#0d9488',
    accent: '#ccfbf1'
  },
  indigo: {
    name: 'Índigo',
    nameEn: 'Indigo',
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#e0e7ff'
  },
  pink: {
    name: 'Rosa',
    nameEn: 'Pink',
    primary: '#ec4899',
    secondary: '#db2777',
    accent: '#fce7f3'
  }
};

/**
 * ColorSelector component allows users to select a color theme for the CV.
 * Handles dropdown for color selection and displays color options with translated names.
 * Closes dropdown when clicking outside.
 */
export function ColorSelector({ selectedColor, onColorChange, show = true }: ColorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [portalPos, setPortalPos] = useState<{ left: number; top: number; width: number } | null>(null);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function updatePosition() {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      // Position above the button (open upwards)
      setPortalPos({ left: rect.left, top: rect.top - 8, width: rect.width });
    }

    if (isOpen) {
      updatePosition();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  // Toggles the dropdown open/close state
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handles color selection and closes the dropdown
  const handleColorSelect = (color: CvColor) => {
    onColorChange(color);
    setIsOpen(false);
  };

  // Don't render if show is false
  if (!show) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex h-9 items-center justify-between w-auto px-3 rounded-md border border-gray-300/70 dark:border-zinc-600/70 bg-white/90 dark:bg-zinc-800/90 text-[13px] font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-zinc-700 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
      >
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full border border-gray-300 dark:border-zinc-500"
            style={{ backgroundColor: colors[selectedColor].primary }}
          />
          <span>{language === 'en' ? colors[selectedColor].nameEn : colors[selectedColor].name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && portalPos && createPortal(
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="z-[70] bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 max-h-[60vh] overflow-auto"
          style={{ position: 'fixed', left: portalPos.left, top: portalPos.top, width: portalPos.width, transform: 'translateY(-100%)' }}
        >
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">
            {t('color.selector')}
          </div>
          <div className="py-1">
            {Object.entries(colors).map(([colorKey, colorData]) => (
              <button
                key={colorKey}
                onClick={() => handleColorSelect(colorKey as CvColor)}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200"
              >
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-zinc-500 mr-2"
                  style={{ backgroundColor: colorData.primary }}
                />
                <span>{language === 'en' ? colorData.nameEn : colorData.name}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}