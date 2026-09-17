import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import {
	type LocalizedCopy,
	localizedPageMetadata,
} from "../../utils/page-metadata";

const COPY: LocalizedCopy = {
	en: {
		title: "Help and FAQ",
		description:
			"Answers about EasyPeasyCV: where your data is stored, how to move or back up your CV, design, PDF languages, and how to report a bug or suggest an idea.",
	},
	pt: {
		title: "Ajuda e perguntas frequentes",
		description:
			"Respostas sobre o EasyPeasyCV: onde ficam os seus dados, como guardar ou mudar o CV de computador, design, línguas do PDF e como reportar um erro ou sugerir uma ideia.",
	},
	br: {
		title: "Ajuda e perguntas frequentes",
		description:
			"Respostas sobre o EasyPeasyCV: onde ficam seus dados, como fazer backup ou passar o currículo para outro computador, design, idiomas do PDF e como relatar um erro ou sugerir uma ideia.",
	},
	es: {
		title: "Ayuda y preguntas frecuentes",
		description:
			"Respuestas sobre EasyPeasyCV: dónde se guardan tus datos, cómo hacer una copia o pasar tu currículum a otro ordenador, diseño, idiomas del PDF y cómo informar de un error o sugerir una idea.",
	},
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return localizedPageMetadata(locale, "faq", COPY);
}

export default async function FaqLayout({
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
