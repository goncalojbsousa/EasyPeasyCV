import type { Metadata } from 'next';
import './globals.css';


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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
