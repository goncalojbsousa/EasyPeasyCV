'use client';

import { useLanguage } from './contexts/LanguageContext';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import Link from 'next/link';

/**
 * 404 Not Found page component
 * Displays a user-friendly error page when a route is not found
 * @returns JSX element representing the 404 error page
 */
export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      {/* Header */}
      <Navbar />

      {/* Main content */}
      <div className="flex-1 max-w-7xl mx-auto pt-40 pb-24 px-4 sm:px-6">
        <div className="text-center">
          {/* 404 Number */}
          <div className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-8">
            404
          </div>
          
          {/* Error Message */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('error.404.title')}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('error.404.description')}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t('error.404.home.button')}
            </Link>
            
            <Link
              href="/builder"
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-300 text-lg"
            >
              {t('error.404.builder.button')}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
} 