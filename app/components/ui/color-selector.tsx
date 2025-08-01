import { useState, useRef, useEffect } from 'react';
import { CvColor } from '../../types/cv';
import { useLanguage } from '../../contexts/LanguageContext';

interface ColorSelectorProps {
  selectedColor: CvColor;
  onColorChange: (color: CvColor) => void;
  show?: boolean; // New prop to control visibility
}

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

export function ColorSelector({ selectedColor, onColorChange, show = true }: ColorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  const toggleDropdown = () => setIsOpen(!isOpen);

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
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-zinc-800"
      >
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full border border-gray-300 dark:border-zinc-500"
            style={{ backgroundColor: colors[selectedColor].primary }}
          />
          <span>{language === 'en' ? colors[selectedColor].nameEn : colors[selectedColor].name}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-md shadow-lg">
          <div className="py-1">
            {Object.entries(colors).map(([colorKey, colorData]) => (
              <button
                key={colorKey}
                onClick={() => handleColorSelect(colorKey as CvColor)}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-zinc-700"
              >
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-zinc-500 mr-2"
                  style={{ backgroundColor: colorData.primary }}
                />
                <span>{language === 'en' ? colorData.nameEn : colorData.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 