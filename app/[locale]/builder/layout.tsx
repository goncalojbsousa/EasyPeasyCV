import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import {
	type LocalizedCopy,
	localizedPageMetadata,
} from "../../utils/page-metadata";

const COPY: LocalizedCopy = {
	en: {
		title: "CV Builder",
		description:
			"Create and edit your professional CV with our free online builder. ATS-optimized templates, export to PDF.",
	},
	pt: {
		title: "Criar currículo",
		description:
			"Crie e edite o seu currículo profissional com o nosso criador online gratuito. Modelos otimizados para ATS, exporte em PDF.",
	},
	br: {
		title: "Criar currículo",
		description:
			"Crie e edite seu currículo profissional com nosso criador online gratuito. Modelos otimizados para ATS, exporte em PDF.",
	},
	es: {
		title: "Crear currículum",
		description:
			"Crea y edita tu currículum profesional con nuestro creador online gratuito. Plantillas optimizadas para ATS, exporta a PDF.",
	},
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return localizedPageMetadata(locale, "builder", COPY);
}

export default async function BuilderLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	// Opts this route into static rendering (next-intl)
	setRequestLocale(locale);
	return children;
}
