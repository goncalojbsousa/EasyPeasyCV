'use client';

import { useLanguage } from './contexts/LanguageContext';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import Link from 'next/link';

/**
 * Landing page component for EasyPeasyCV
 * Introduces the project and guides users to the CV builder
 * @returns JSX element representing the landing page
 */
export default function Home() {
  const { t } = useLanguage();

  // Features displayed on the landing page
  const features = [
    {
      icon: "📄",
      title: t('landing.features.templates.title'),
      description: t('landing.features.templates.description')
    },
    {
      icon: "🎨",
      title: t('landing.features.customization.title'),
      description: t('landing.features.customization.description')
    },
    {
      icon: "📱",
      title: t('landing.features.responsive.title'),
      description: t('landing.features.responsive.description')
    },
    {
      icon: "💾",
      title: t('landing.features.autosave.title'),
      description: t('landing.features.autosave.description')
    },
    {
      icon: "🌍",
      title: t('landing.features.multilang.title'),
      description: t('landing.features.multilang.description')
    },
    {
      icon: "🔒",
      title: t('landing.features.privacy.title'),
      description: t('landing.features.privacy.description')
    }
  ];

  // Mirror template previews used in the selector
  const previewTemplates: { key: string; img: string; nameKey: string; descriptionKey: string }[] = [
    { key: 'classic',      img: '/classic_preview.webp',      nameKey: 'template.classic.name',      descriptionKey: 'template.classic.description' },
    { key: 'professional', img: '/professional_preview.webp', nameKey: 'template.professional.name', descriptionKey: 'template.professional.description' },
    { key: 'timeline',     img: '/timeline_preview.webp',     nameKey: 'template.timeline.name',     descriptionKey: 'template.timeline.description' },
    { key: 'modern',       img: '/modern_preview.webp',       nameKey: 'template.modern.name',       descriptionKey: 'template.modern.description' },
    { key: 'minimal',      img: '/minimal_preview.webp',      nameKey: 'template.minimal.name',      descriptionKey: 'template.minimal.description' },
    { key: 'creative',     img: '/creative_preview.webp',     nameKey: 'template.creative.name',     descriptionKey: 'template.creative.description' },
  ];


  // Key statistics to highlight on the landing page
  const stats = [
    {
      number: "100%",
      label: t('landing.stats.free')
    },
    {
      number: "∞",
      label: t('landing.stats.unlimited')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
  {/* Header */}
      <Navbar />

  {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">

          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t('landing.hero.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('landing.hero.subtitle')}
          </p>
          

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

  {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 bg-white dark:bg-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-all duration-300 bg-gray-50 dark:bg-zinc-900 group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

  {/* Templates Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.templates.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('landing.templates.subtitle')}
            </p>
          </div>
          {previewTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-10 bg-white dark:bg-zinc-800">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('template.selector')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                {t('landing.templates.subtitle')}
              </p>
              
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {previewTemplates.map((tpl) => (
                <div key={tpl.key} className="rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:shadow-lg transition-all duration-200">
                  <div className="relative h-48 bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tpl.img}
                      alt={`${t(tpl.nameKey)} preview`}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t(tpl.nameKey)}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t(tpl.descriptionKey)}
                    </p>
                    
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

  {/* How it works Section */}
      <section className="py-16 px-4 sm:px-6 bg-white dark:bg-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.how.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('landing.how.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('landing.how.step1.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('landing.how.step1.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('landing.how.step2.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('landing.how.step2.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('landing.how.step3.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('landing.how.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

  {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.benefits.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('landing.benefits.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-gray-200 dark:border-zinc-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{t('landing.benefits.privacy.title')}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('landing.benefits.privacy.subtitle')}</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {t('landing.benefits.privacy.description')}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-gray-200 dark:border-zinc-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{t('landing.benefits.ats.title')}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('landing.benefits.ats.subtitle')}</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {t('landing.benefits.ats.description')}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-gray-200 dark:border-zinc-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{t('landing.benefits.performance.title')}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('landing.benefits.performance.subtitle')}</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {t('landing.benefits.performance.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

  {/* Open Source Section */}
      <section className="py-16 px-4 sm:px-6 bg-white dark:bg-zinc-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('landing.opensource.title')}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {t('landing.opensource.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('landing.opensource.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/goncalojbsousa/cv-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300 text-lg"
            >
              {t('landing.opensource.contribute.button')}
            </a>
            <a
              href="https://ko-fi.com/easypeasycv"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-300 text-lg"
            >
              {t('landing.opensource.support.button')}
            </a>
          </div>
        </div>
      </section>

  {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('landing.cta.subtitle')}
          </p>
          <Link
            href="/builder"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
          >
            {t('landing.cta.button')}
          </Link>
        </div>
      </section>

  {/* Footer */}
      <Footer />
    </div>
  );
}