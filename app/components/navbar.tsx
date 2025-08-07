'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from './ui/language-selector';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';

/**
 * Navbar component
 * Reusable navigation bar with logo, language selector, and theme toggle
 * Handles navigation and theme/language switching for the app
 * @returns JSX element representing the navigation bar
 */
export function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="bg-white dark:bg-zinc-800 shadow-sm fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/logo.webp" 
              alt="EasyPeasyCV Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-blue-600">{t('app.title')}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('app.subtitle')}
              </p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 