import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { routing } from "../../navigation";
import { LanguageProvider } from "../contexts/LanguageContext";
import type { Locale } from "../translations";
import { OG_LOCALES, SITE_URL } from "../utils/page-metadata";
import "../globals.css";
import type { Metadata } from "next";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

// Generate static params for all supported locales
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

const metaByLang: Record<Locale, { title: string; description: string }> = {
	en: {
		title: "EasyPeasyCV | Build your professional CV online",
		description:
			"Create a professional, modern, and ATS-optimized CV in minutes. 100% free and secure. No registration required.",
	},
	pt: {
		title: "EasyPeasyCV | Crie o seu currículo profissional online",
		description:
			"Crie um currículo profissional, moderno e otimizado para ATS em minutos. 100% grátis e seguro. Não é necessário registo.",
	},
	br: {
		title: "EasyPeasyCV | Crie seu currículo profissional online",
		description:
			"Crie um currículo profissional, moderno e otimizado para ATS em minutos. 100% grátis e seguro. Não é necessário cadastro.",
	},
	es: {
		title: "EasyPeasyCV | Crea tu currículum profesional en línea",
		description:
			"Crea un currículum profesional, moderno y optimizado para ATS en minutos. 100% gratis y seguro. No se requiere registro.",
	},
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const meta = metaByLang[locale as Locale] || metaByLang.en;

	return {
		metadataBase: new URL(SITE_URL),
		title: {
			default: meta.title,
			template: "%s | EasyPeasyCV",
		},
		description: meta.description,
		keywords: [
			"EasyPeasyCV",
			"Easy Peasy CV",
			"easy peasy cv",
			"cv builder",
			"resume builder",
			"curriculo",
			"curriculum vitae",
			"nextjs",
			"react",
			"typescript",
			"pdf-generation",
			"open-source",
		],
		openGraph: {
			title: meta.title,
			description: meta.description,
			url: `${SITE_URL}/${locale}`,
			siteName: "EasyPeasyCV",
			// The image comes from ./opengraph-image.tsx, rendered per locale.
			locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES.en,
			alternateLocale: Object.entries(OG_LOCALES)
				.filter(([code]) => code !== locale)
				.map(([, tag]) => tag),
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			site: "@easypeasycv",
			title: meta.title,
			description: meta.description,
		},
		alternates: {
			canonical: `/${locale}`,
			languages: {
				en: "/en",
				pt: "/pt",
				"pt-BR": "/br",
				es: "/es",
			},
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-image-preview": "large",
				"max-video-preview": -1,
				"max-snippet": -1,
			},
		},
	};
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const messages = await getMessages();
	const meta = metaByLang[locale as Locale] || metaByLang.en;

	return (
		<html suppressHydrationWarning lang={locale} className={inter.className}>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="theme-color" content="#0284c7" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<link
					rel="preconnect"
					href="https://www.easypeasycv.com"
					crossOrigin=""
				/>
				<link rel="dns-prefetch" href="https://www.easypeasycv.com" />
				<Script
					id="org-ld-json"
					type="application/ld+json"
					strategy="afterInteractive"
				>
					{JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: "EasyPeasyCV",
						url: "https://www.easypeasycv.com",
						applicationCategory: "DesignApplication",
						operatingSystem: "Web",
						offers: {
							"@type": "Offer",
							price: "0",
							priceCurrency: "USD",
						},
						description: meta.description,
						logo: "https://www.easypeasycv.com/logo.webp",
					})}
				</Script>
			</head>
			<body className="antialiased">
				<NextIntlClientProvider messages={messages}>
					<LanguageProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem={true}
							disableTransitionOnChange={false}
							value={{ dark: "dark", light: "light" }}
						>
							{children}
						</ThemeProvider>
					</LanguageProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
