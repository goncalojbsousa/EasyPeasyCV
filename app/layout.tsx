
import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider, Language } from './contexts/LanguageContext';
import { LanguageHtmlAttribute } from './components/language-html-attribute';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.easypeasycv.com'),
  title: {
    default: 'EasyPeasyCV | Build your professional CV online',
    template: '%s | EasyPeasyCV',
  },
  description: 'Create a professional, modern, and ATS-optimized CV in minutes. 100% free and secure. No registration required.',
  keywords: [
    'EasyPeasyCV',
    'Easy Peasy CV',
    'easy peasy cv',
    'cv builder',
    'resume builder',
    'curriculo',
    'curriculum vitae',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'EasyPeasyCV | Build your professional CV online',
    description: 'Create a professional, modern, and ATS-optimized CV in minutes. 100% free and secure. No registration required.',
    url: 'https://www.easypeasycv.com',
    siteName: 'EasyPeasyCV',
    images: [
      {
        url: 'https://www.easypeasycv.com/socialmedia.webp',
        width: 1200,
        height: 630,
        alt: 'EasyPeasyCV - Free, Secure CV Builder',
      },
    ],
    locale: 'en_US',
    alternateLocale: ['pt_PT', 'es_ES'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@easypeasycv',
    title: 'EasyPeasyCV | Build your professional CV online',
    description: 'Create a professional, modern, and ATS-optimized CV in minutes. 100% free and secure. No registration required.',
    images: ['https://www.easypeasycv.com/socialmedia.webp'],
  },
};

const metaByLang: Record<Language, { title: string; description: string }> = {
  en: {
    title: 'EasyPeasyCV | Build your professional CV online',
    description: 'Create a professional, modern, and ATS-optimized CV in minutes. 100% free and secure. No registration required.',
  },
  pt: {
    title: 'EasyPeasyCV | Crie o seu currículo profissional online',
    description: 'Crie um currículo profissional, moderno e otimizado para ATS em minutos. 100% grátis e seguro. Não é necessário registo.',
  },
  es: {
    title: 'EasyPeasyCV | Crea tu currículum profesional en línea',
    description: 'Crea un currículum profesional, moderno y optimizado para ATS en minutos. 100% gratis y seguro. No se requiere registro.',
  },
};

function SEOHead() {
  // SSR fallback: default to English
  let lang: Language = 'en';
  if (typeof window !== 'undefined') {
    lang = (localStorage.getItem('cv-builder-language') as Language) || 'en';
  }
  const meta = metaByLang[lang] || metaByLang.en;
  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta
        name="keywords"
        content="EasyPeasyCV, Easy Peasy CV, easy peasy cv, cv builder, resume builder, curriculo, curriculum vitae"
      />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content="https://www.easypeasycv.com/socialmedia.webp" />
      <meta property="og:url" content="https://www.easypeasycv.com" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content="https://www.easypeasycv.com/socialmedia.webp" />
      <link rel="canonical" href="https://www.easypeasycv.com" />
      {/* Organization structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'EasyPeasyCV',
            url: 'https://www.easypeasycv.com',
            logo: 'https://www.easypeasycv.com/logo.webp',
            description: meta.description,
          }),
        }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://www.easypeasycv.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.easypeasycv.com" />
        <SEOHead />
      </head>
      <body>
        <LanguageProvider>
          <LanguageHtmlAttribute />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
