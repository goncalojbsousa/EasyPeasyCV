import type { Metadata } from "next";
import type { ReactNode } from "react";

const segment = "terms";
const baseUrl = "https://www.easypeasycv.com";

type Locale = "en" | "pt" | "br" | "es";

const titles: Record<Locale, string> = {
	en: "Terms of Service",
	pt: "Termos de Serviço",
	br: "Termos de Serviço",
	es: "Términos de Servicio",
};

const descriptions: Record<Locale, string> = {
	en: "Terms of Service for EasyPeasyCV. Read how you can use our free CV builder.",
	pt: "Termos de Serviço do EasyPeasyCV. Saiba como pode usar o nosso criador de currículos gratuito.",
	br: "Termos de Serviço do EasyPeasyCV. Saiba como você pode usar nosso criador de currículos gratuito.",
	es: "Términos de Servicio de EasyPeasyCV. Conoce cómo puedes usar nuestro creador de currículums gratuito.",
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const l = (locale as Locale) || "en";
	const path = `/${locale}/${segment}`;

	return {
		title: titles[l] ?? titles.en,
		description: descriptions[l] ?? descriptions.en,
		openGraph: {
			url: `${baseUrl}${path}`,
		},
		alternates: {
			canonical: path,
			languages: {
				en: `/en/${segment}`,
				pt: `/pt/${segment}`,
				"pt-BR": `/br/${segment}`,
				es: `/es/${segment}`,
			},
		},
	};
}

export default function TermsLayout({ children }: { children: ReactNode }) {
	return children;
}
