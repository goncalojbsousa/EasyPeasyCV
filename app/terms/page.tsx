'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';
import Link from 'next/link';

/**
 * Terms of Service page component
 * Displays the terms of service information for the EasyPeasyCV application
 * @returns JSX element representing the terms of service page
 */
export default function TermsOfService() {
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
              {t('terms.title')}
            </h1>
                         <p className="text-lg text-gray-600 dark:text-gray-300">
               {t('terms.last.updated')}: 06/08/2025
             </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.introduction.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('terms.introduction.description')}
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.acceptance.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('terms.acceptance.description')}
              </p>
            </section>

            {/* Service Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.service.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('terms.service.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>{t('terms.service.features.cv')}</li>
                <li>{t('terms.service.features.templates')}</li>
                <li>{t('terms.service.features.pdf')}</li>
                <li>{t('terms.service.features.local')}</li>
              </ul>
            </section>

            {/* User Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.responsibilities.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('terms.responsibilities.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>{t('terms.responsibilities.accurate')}</li>
                <li>{t('terms.responsibilities.legal')}</li>
                <li>{t('terms.responsibilities.compliance')}</li>
              </ul>
            </section>

            {/* Prohibited Uses */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.prohibited.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('terms.prohibited.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>{t('terms.prohibited.illegal')}</li>
                <li>{t('terms.prohibited.harmful')}</li>
                <li>{t('terms.prohibited.copyright')}</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.intellectual.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('terms.intellectual.description')}
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  {t('terms.intellectual.user.content')}
                </p>
              </div>
            </section>

            {/* Privacy and Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.privacy.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('terms.privacy.description')}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {t('terms.privacy.policy')} <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">{t('terms.privacy.link')}</Link>
              </p>
            </section>

            {/* Service Availability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.availability.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('terms.availability.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>{t('terms.availability.maintenance')}</li>
                <li>{t('terms.availability.updates')}</li>
                <li>{t('terms.availability.force')}</li>
              </ul>
            </section>

            {/* Disclaimers */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.disclaimers.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('terms.disclaimers.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>{t('terms.disclaimers.warranty')}</li>
                <li>{t('terms.disclaimers.accuracy')}</li>
                <li>{t('terms.disclaimers.employment')}</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.law.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('terms.law.description')}
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.changes.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('terms.changes.description')}
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.contact.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('terms.contact.description')}
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
              {t('terms.back.home')}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
} 