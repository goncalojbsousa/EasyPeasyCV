'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';
import Link from 'next/link';

/**
 * Privacy Policy page component
 * Displays the privacy policy information for the EasyPeasyCV application
 * @returns JSX element representing the privacy policy page
 */
export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      {/* Header */}
      <Navbar />

      {/* Main content */}
      <div className="max-w-4xl mx-auto pt-40 pb-24 px-4 sm:px-6">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('privacy.title')}
            </h1>
                         <p className="text-lg text-gray-600 dark:text-gray-300">
               {t('privacy.last.updated')}: 06/08/2025
             </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.introduction.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('privacy.introduction.description')}
              </p>
            </section>

            {/* No Data Collection */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.no.collection.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('privacy.no.collection.description')}
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 text-sm">
                  {t('privacy.no.collection.highlight')}
                </p>
              </div>
            </section>

            {/* Local Storage */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.local.storage.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('privacy.local.storage.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>{t('privacy.local.storage.browser')}</li>
                <li>{t('privacy.local.storage.no.server')}</li>
                <li>{t('privacy.local.storage.control')}</li>
              </ul>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.cookies.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('privacy.cookies.description')}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {t('privacy.cookies.essential')}
              </p>
            </section>

            {/* Third-party Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.third.party.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('privacy.third.party.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>{t('privacy.third.party.github')}</li>
                <li>{t('privacy.third.party.ko.fi')}</li>
              </ul>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.changes.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('privacy.changes.description')}
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.contact.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('privacy.contact.description')}
              </p>
              <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>GitHub:</strong> <a href="https://github.com/goncalojbsousa/cv-builder/issues" className="text-blue-600 dark:text-blue-400 hover:underline">github.com/goncalojbsousa/cv-builder/issues</a>
                </p>
              </div>
            </section>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              {t('privacy.back.home')}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
} 