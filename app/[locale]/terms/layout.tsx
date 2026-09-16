import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
	type LocalizedCopy,
	localizedPageMetadata,
} from "../../utils/page-metadata";

const COPY: LocalizedCopy = {
	en: {
		title: "Terms of Service",
		description:
			"Terms of Service for EasyPeasyCV. Read how you can use our free CV builder.",
	},
	pt: {
		title: "Termos de Serviço",
		description:
			"Termos de Serviço do EasyPeasyCV. Saiba como pode usar o nosso criador de currículos gratuito.",
	},
	br: {
		title: "Termos de Serviço",
		description:
			"Termos de Serviço do EasyPeasyCV. Saiba como você pode usar nosso criador de currículos gratuito.",
	},
	es: {
		title: "Términos de Servicio",
		description:
			"Términos de Servicio de EasyPeasyCV. Conoce cómo puedes usar nuestro creador de currículums gratuito.",
	},
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return localizedPageMetadata(locale, "terms", COPY);
}

export default function TermsLayout({ children }: { children: ReactNode }) {
	return children;
}
