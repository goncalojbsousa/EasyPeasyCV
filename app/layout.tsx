import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from './contexts/LanguageContext';


/**
 * Metadata configuration for the CV Builder application
 */
export const metadata: Metadata = {
  title: "CV Builder",
  description: "Crie um currículo profissional em minutos",
};

/**
 * Root layout component for the CV Builder application
 * Provides the base HTML structure and metadata
 * @param children - Child components to render
 * @returns JSX element representing the root layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
