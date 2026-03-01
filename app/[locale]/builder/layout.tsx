import type { Metadata } from "next";
import type { ReactNode } from "react";

const segment = "builder";
const baseUrl = "https://www.easypeasycv.com";

type Locale = "en" | "pt" | "br" | "es";

const titles: Record<Locale, string> = {
	en: "CV Builder",
	pt: "Criar currículo",
	br: "Criar currículo",
	es: "Crear currículum",
};

const descriptions: Record<Locale, string> = {
	en: "Create and edit your professional CV with our free online builder. ATS-optimized templates, export to PDF.",
	pt: "Crie e edite o seu currículo profissional com o nosso criador online gratuito. Modelos otimizados para ATS, exporte em PDF.",
	br: "Crie e edite seu currículo profissional com nosso criador online gratuito. Modelos otimizados para ATS, exporte em PDF.",
	es: "Crea y edita tu currículum profesional con nuestro creador online gratuito. Plantillas optimizadas para ATS, exporta a PDF.",
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

export default function BuilderLayout({ children }: { children: ReactNode }) {
	return children;
}
