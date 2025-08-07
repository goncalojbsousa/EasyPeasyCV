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

  const templates = [
    {
      name: t('landing.templates.classic.name'),
      description: t('landing.templates.classic.description'),
      color: "bg-blue-500",
      features: t('landing.templates.classic.features').split(',')
    },
    {
      name: t('landing.templates.modern.name'),
      description: t('landing.templates.modern.description'),
      color: "bg-green-500",
      features: t('landing.templates.modern.features').split(',')
    },
    {
      name: t('landing.templates.creative.name'),
      description: t('landing.templates.creative.description'),
      color: "bg-purple-500",
      features: t('landing.templates.creative.features').split(',')
    }
  ];

  const stats = [
    {
      number: "3",
      label: t('landing.stats.templates')
    },
    {
      number: "100%",
      label: t('landing.stats.free')
    },
    {
      number: "∞",
      label: t('landing.stats.unlimited')
    },
    {
      number: "2",
      label: t('landing.stats.languages')
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/builder"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t('landing.create.cv.button')}
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg border border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-all duration-300 bg-white dark:bg-zinc-800 group"
              >
                <div className={`w-16 h-16 ${template.color} rounded-lg mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300`}>
                  {template.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {template.description}
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 mb-6 space-y-1">
                  {template.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>• {feature}</li>
                  ))}
                </ul>
                <Link
                  href="/builder"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 text-sm"
                >
                  {t('landing.templates.use.button')}
                </Link>
              </div>
            ))}
          </div>
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

      {/* CTA Section */}
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