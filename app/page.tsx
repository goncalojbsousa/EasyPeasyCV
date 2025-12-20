'use client';

import { useLanguage } from './contexts/LanguageContext';
import { useRef, useState, useEffect } from 'react';
import { Eye, CheckCircle, Zap, Lock, Sparkles, Award, Clock, Download, Shield, Paintbrush, Globe, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from './components/layout/navbar';
import { Footer } from './components/layout/footer';
import Link from 'next/link';

export default function Home() {
  const { t } = useLanguage();

  const previewRef = useRef<HTMLDivElement>(null);
  const [tiltTransform, setTiltTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [currentTplIndex, setCurrentTplIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isProgressPaused, setIsProgressPaused] = useState(false);

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = previewRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateY = ((x - midX) / rect.width) * 16;
    const rotateX = -((y - midY) / rect.height) * 16;
    setTiltTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`);
    const xPct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    const yPct = Math.min(100, Math.max(0, (y / rect.height) * 100));
    setGlare({ x: xPct, y: yPct, opacity: 0.5 });
  };

  const handleTiltLeave = () => {
    setTiltTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
    setGlare((g) => ({ ...g, opacity: 0 }));
    setIsHovered(false);
    setIsProgressPaused(false);
  };

  const handleTiltEnter = () => {
    setGlare((g) => ({ ...g, opacity: 0.4 }));
    setIsHovered(true);
    setIsProgressPaused(true);
  };

  // Mirror template previews used in the selector
  const previewTemplates: { key: string; img: string; nameKey: string; descriptionKey: string }[] = [
    { key: 'classic', img: '/classic_preview.webp', nameKey: 'template.classic.name', descriptionKey: 'template.classic.description' },
    { key: 'timeline', img: '/timeline_preview.webp', nameKey: 'template.timeline.name', descriptionKey: 'template.timeline.description' },
    { key: 'professional', img: '/professional_preview.webp', nameKey: 'template.professional.name', descriptionKey: 'template.professional.description' },
  ];

  useEffect(() => {
    if (previewTemplates.length === 0 || isProgressPaused) return;
    const id = setInterval(() => {
      setCurrentTplIndex((i) => (i + 1) % previewTemplates.length);
    }, 5000);
    return () => clearInterval(id);
  }, [previewTemplates.length, isProgressPaused]);

  // Add CSS animation dynamically
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
                          @keyframes progressFill {
                            from { width: 0%; }
                            to { width: 100%; }
                          }
                          .progress-bar-animate {
                            animation: progressFill 5s linear forwards;
                          }
                          .progress-bar-paused {
                            animation: none !important;
                            width: 0% !important;
                          }
                        `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors">
      {/* Header */}
      <Navbar />

      {/* Hero Section - Impactful and conversion-focused */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-white dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 -z-10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-sky-200/30 dark:bg-sky-900/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                {t('landing.hero.badge')}
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                {t('landing.hero.title')}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                {t('landing.hero.subtitle')}
              </p>

              {/* Value Props - Quick bullets */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">{t('landing.hero.noaccount')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">{t('landing.hero.free')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">{t('landing.hero.privacy')}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/builder"
                  className="inline-flex items-center justify-center bg-sky-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-sky-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 transition-all transform hover:scale-105"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  {t('landing.hero.cta.primary')}
                </Link>
                <a
                  href="https://github.com/goncalojbsousa/cv-builder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 transition-colors"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  {t('landing.hero.cta.secondary')}
                </a>
              </div>

              {/* Trust indicators */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                {t('landing.hero.trust')}
              </p>
            </div>

            {/* Hero Image/Visual - Real template preview */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-sky-400 to-purple-400 rounded-2xl opacity-20 blur-2xl" />
                <div
                  ref={previewRef}
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                  onMouseEnter={handleTiltEnter}
                  className="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden will-change-transform"
                  style={{ transform: tiltTransform, transition: 'transform 150ms ease-out', transformStyle: 'preserve-3d' }}
                >
                  {/* Progress bar */}
                  <div className={`absolute top-0 left-0 h-1 bg-gradient-to-r from-sky-400 to-sky-600 rounded-tl-2xl ${isProgressPaused ? 'progress-bar-paused' : 'progress-bar-animate'}`} key={`progress-${currentTplIndex}`} />

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewTemplates[currentTplIndex]?.img}
                    alt={`${t(previewTemplates[currentTplIndex]?.nameKey || 'landing.templates.title')} preview`}
                    className="w-full h-full object-cover object-top"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 20%, transparent 60%)`,
                      opacity: glare.opacity,
                      transition: 'opacity 150ms ease-out',
                    }}
                  />

                  {/* Controls - Hidden by default, visible on hover */}
                  <button
                    type="button"
                    onClick={() => setCurrentTplIndex((i) => (i - 1 + previewTemplates.length) % previewTemplates.length)}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-sm border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    aria-label="Previous template"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTplIndex((i) => (i + 1) % previewTemplates.length)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-sm border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    aria-label="Next template"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Dots - Hidden by default, visible on hover */}
                  <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200 dark:border-zinc-700 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {previewTemplates.map((tpl, idx) => (
                      <button
                        key={tpl.key}
                        type="button"
                        onClick={() => setCurrentTplIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full ${idx === currentTplIndex ? 'bg-sky-600 dark:bg-sky-400' : 'bg-gray-300 dark:bg-zinc-600'} hover:bg-sky-500 dark:hover:bg-sky-500`}
                        aria-label={`Show ${t(tpl.nameKey)} template`}
                        title={t(tpl.nameKey)}
                      />
                    ))}
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 px-4 py-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">{t('landing.hero.atsready')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Key Features - Benefits focused */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-100 dark:bg-zinc-900 p-8 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-sky-300 dark:hover:border-sky-700 transition-colors">
              <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('landing.features.privacy.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('landing.features.privacy.description')}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-400">
                <Lock className="w-4 h-4" />
                {t('landing.features.privacy.badge')}
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-zinc-900 p-8 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-sky-300 dark:hover:border-sky-700 transition-colors">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('landing.features.instant.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('landing.features.instant.description')}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <Zap className="w-4 h-4" />
                {t('landing.features.instant.badge')}
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-zinc-900 p-8 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-sky-300 dark:hover:border-sky-700 transition-colors">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                <Paintbrush className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('landing.features.templates.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('landing.features.templates.description')}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                <Sparkles className="w-4 h-4" />
                {t('landing.features.templates.badge')}
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-zinc-900 p-8 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-sky-300 dark:hover:border-sky-700 transition-colors">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('landing.features.ats.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('landing.features.ats.description')}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                <CheckCircle className="w-4 h-4" />
                {t('landing.features.ats.badge')}
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-zinc-900 p-8 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-sky-300 dark:hover:border-sky-700 transition-colors">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                <Download className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('landing.features.pdf.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('landing.features.pdf.description')}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                <FileText className="w-4 h-4" />
                {t('landing.features.pdf.badge')}
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-zinc-900 p-8 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-sky-300 dark:hover:border-sky-700 transition-colors">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('landing.features.multilang.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('landing.features.multilang.description')}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-pink-600 dark:text-pink-400">
                <Globe className="w-4 h-4" />
                {t('landing.features.multilang.badge')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {t('landing.templates.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('landing.templates.subtitle')}
            </p>
          </div>

          {previewTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-10 bg-white dark:bg-zinc-900">
              <Eye className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('template.selector')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                {t('landing.templates.subtitle')}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {previewTemplates.map((tpl) => (
                  <div
                    key={tpl.key}
                    className="group rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-sky-300 dark:hover:border-sky-700 transition-all hover:shadow-xl"
                  >
                    <div className="relative h-64 bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tpl.img}
                        alt={`${t(tpl.nameKey)} preview`}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-5">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {t(tpl.nameKey)}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t(tpl.descriptionKey)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-zinc-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200 dark:bg-sky-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {t('landing.how.title')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('landing.how.subtitle')}
            </p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12">
              {/* Step 1 */}
              <div className="group">
                <div className="flex flex-col items-center text-center bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl font-bold text-white">1</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Eye className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {t('landing.how.step1.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('landing.how.step1.description')}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group">
                <div className="flex flex-col items-center text-center bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl font-bold text-white">2</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Paintbrush className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {t('landing.how.step2.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('landing.how.step2.description')}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group">
                <div className="flex flex-col items-center text-center bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl font-bold text-white">3</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {t('landing.how.step3.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('landing.how.step3.description')}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Time estimate */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              Tempo médio: <span className="text-sky-600 dark:text-sky-400 font-bold">5-10 minutos</span>
            </span>
          </div>

          <div className="text-center">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center bg-sky-600 text-white px-12 py-5 rounded-xl font-bold text-lg shadow-xl hover:bg-sky-700 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 transition-all transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {t('landing.how.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Section */}
      <section className="py-20 px-4 sm:px-6 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              {t('landing.trust.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('landing.trust.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group relative bg-gradient-to-br from-sky-50 to-blue-50 dark:from-zinc-800/50 dark:to-sky-900/20 p-8 rounded-2xl border border-sky-200 dark:border-sky-900/50 hover:border-sky-400 dark:hover:border-sky-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-20 h-20 bg-sky-200/30 dark:bg-sky-900/30 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-300" />

              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>

              <div className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">100%</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('landing.trust.stat1.title')}</div>
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('landing.trust.stat1.description')}</div>
            </div>

            <div className="group relative bg-gradient-to-br from-sky-50 to-blue-50 dark:from-zinc-800/50 dark:to-sky-900/20 p-8 rounded-2xl border border-sky-200 dark:border-sky-900/50 hover:border-sky-400 dark:hover:border-sky-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-20 h-20 bg-sky-200/30 dark:bg-sky-900/30 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-300" />

              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>

              <div className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">∞</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('landing.trust.stat2.title')}</div>
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('landing.trust.stat2.description')}</div>
            </div>

            <div className="group relative bg-gradient-to-br from-sky-50 to-blue-50 dark:from-zinc-800/50 dark:to-sky-900/20 p-8 rounded-2xl border border-sky-200 dark:border-sky-900/50 hover:border-sky-400 dark:hover:border-sky-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-20 h-20 bg-sky-200/30 dark:bg-sky-900/30 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-300" />

              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-8 h-8 text-white" />
              </div>

              <div className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">0</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('landing.trust.stat3.title')}</div>
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('landing.trust.stat3.description')}</div>
            </div>
          </div>

          {/* Open Source Badge */}
          <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-zinc-800/50 dark:to-green-900/20 rounded-2xl p-12 text-center border border-green-200 dark:border-green-900/50 overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-200/30 dark:bg-green-900/30 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-200/30 dark:bg-emerald-900/30 rounded-full blur-3xl -z-10" />

            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
              <CheckCircle className="w-5 h-5" />
              {t('landing.opensource.badge')}
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-4">
              {t('landing.opensource.title')}
            </h3>

            <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('landing.opensource.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/goncalojbsousa/cv-builder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 transition-all transform"
              >
                {t('landing.opensource.contribute.button')}
              </a>
              <a
                href="https://ko-fi.com/easypeasycv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border-2 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-100 dark:hover:bg-green-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 transition-all"
              >
                {t('landing.opensource.support.button')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 bg-gray-100 dark:bg-zinc-800 relative overflow-hidden border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            {t('landing.cta.subtitle')}
          </p>

          <Link
            href="/builder"
            className="inline-flex items-center justify-center bg-sky-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <Zap className="w-6 h-6 mr-2" />
            {t('landing.cta.button')}
          </Link>

          <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm">
            {t('landing.cta.note')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}