import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageHtmlAttribute } from './components/language-html-attribute';
import { ThemeProvider } from 'next-themes';

/**
 * Metadata configuration for the CV Builder application
 */
export const metadata: Metadata = {
  title: "CV Builder",
  description: "Crie um currículo profissional em minutos",
};

/**
 * Root Layout component
 * Main layout wrapper for the Next.js application with language context
 * Provides the base HTML structure and metadata
 * @param children - Child components to render
 * @returns JSX element representing the root layout structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className="">

      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <LanguageProvider>
          <LanguageHtmlAttribute />
          <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
