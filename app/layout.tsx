import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Builder",
  description: "Crie um currículo profissional em minutos",
};

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
