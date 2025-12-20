'use client';

import Link from 'next/link';
import { ArrowLeft, Lock, Shield, ScrollText } from 'lucide-react';
import { Footer } from '../components/layout/footer';
import { Navbar } from '../components/layout/navbar';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Privacy Policy page component
 * Styled to match the main product visuals while keeping a formal tone.
 */
export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-900 transition-colors overflow-x-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800" />
        <div className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-sky-200/40 dark:bg-sky-900/20 blur-3xl" />
        <div className="absolute bottom-0 -left-10 h-80 w-80 rounded-full bg-blue-200/40 dark:bg-blue-900/10 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative max-w-6xl mx-auto pt-32 pb-20 px-4 sm:px-6">
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-sky-700 dark:text-sky-300">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-sky-100/70 dark:border-sky-900/40 bg-white/70 dark:bg-zinc-900/70 px-4 py-2 font-semibold text-sky-700 dark:text-sky-200 shadow-sm backdrop-blur hover:border-sky-300 dark:hover:border-sky-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('privacy.back.home')}
            </Link>
            <span className="h-4 w-px bg-sky-200 dark:bg-sky-800" />
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 dark:bg-sky-900/40 px-3 py-1 font-medium text-sky-800 dark:text-sky-200">
              <Lock className="h-4 w-4" />
              {t('privacy.title')}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t('privacy.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              {t('privacy.introduction.description')}
            </p>
            <div className="inline-flex items-center gap-2 w-fit rounded-full bg-white/90 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 shadow-sm">
              <span className="font-semibold text-gray-900 dark:text-white">{t('privacy.last.updated')}</span>
              <span className="text-gray-500 dark:text-gray-400">06/08/2025</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
          <article className="rounded-2xl border border-white/70 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/70 shadow-2xl backdrop-blur divide-y divide-gray-100 dark:divide-zinc-800">
            <section id="introduction" className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-200 flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {t('privacy.introduction.title')}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.introduction.description')}
              </p>
            </section>

            <section id="collection" className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 flex items-center justify-center">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {t('privacy.no.collection.title')}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {t('privacy.no.collection.description')}
              </p>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100 shadow-sm">
                {t('privacy.no.collection.highlight')}
              </div>
            </section>

            <section id="local-storage" className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-200 flex items-center justify-center">
                  <ScrollText className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {t('privacy.local.storage.title')}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {t('privacy.local.storage.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>{t('privacy.local.storage.browser')}</li>
                <li>{t('privacy.local.storage.no.server')}</li>
                <li>{t('privacy.local.storage.control')}</li>
              </ul>
            </section>

            <section id="cookies" className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 flex items-center justify-center">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {t('privacy.cookies.title')}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                {t('privacy.cookies.description')}
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.cookies.essential')}
              </p>
            </section>

            <section id="third-parties" className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {t('privacy.third.party.title')}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {t('privacy.third.party.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>{t('privacy.third.party.github')}</li>
                <li>{t('privacy.third.party.ko.fi')}</li>
              </ul>
            </section>

            <section id="changes" className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 flex items-center justify-center">
                  <ScrollText className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {t('privacy.changes.title')}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.changes.description')}
              </p>
            </section>

            <section id="contact" className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 flex items-center justify-center">
                  <ArrowLeft className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {t('privacy.contact.title')}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {t('privacy.contact.description')}
              </p>
              <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/80 dark:bg-zinc-800/70 px-4 py-4 text-sm text-gray-700 dark:text-gray-200">
                <p>
                  <strong>GitHub:</strong>{' '}
                  <a
                    href="https://github.com/goncalojbsousa/cv-builder/issues"
                    className="text-sky-700 dark:text-sky-300 hover:underline"
                  >
                    github.com/goncalojbsousa/cv-builder/issues
                  </a>
                </p>
              </div>
            </section>
          </article>

          <aside className="lg:sticky lg:top-28 space-y-4">
            <div className="rounded-2xl border border-sky-100/70 dark:border-sky-900/40 bg-white/80 dark:bg-zinc-900/70 shadow-xl backdrop-blur p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-200 mb-3">
                <Shield className="h-4 w-4" />
                {t('privacy.title')}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.no.collection.description')}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 shadow-xl backdrop-blur p-6 space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.local.storage.description')}
              </p>
              <Link
                href="/terms"
                className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300 hover:underline"
              >
                {t('terms.title')}
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}