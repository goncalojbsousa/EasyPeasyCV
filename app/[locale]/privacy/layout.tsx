import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import {
	type LocalizedCopy,
	localizedPageMetadata,
} from "../../utils/page-metadata";

const COPY: LocalizedCopy = {
	en: {
		title: "Privacy Policy",
		description:
			"Privacy Policy for EasyPeasyCV. Your data stays in your browser. We do not collect or store personal data.",
	},
	pt: {
		title: "Política de Privacidade",
		description:
			"Política de Privacidade do EasyPeasyCV. Os seus dados ficam no seu browser. Não recolhemos nem armazenamos dados pessoais.",
	},
	br: {
		title: "Política de Privacidade",
		description:
			"Política de Privacidade do EasyPeasyCV. Seus dados ficam no seu navegador. Não coletamos nem armazenamos dados pessoais.",
	},
	es: {
		title: "Política de Privacidad",
		description:
			"Política de Privacidad de EasyPeasyCV. Tus datos permanecen en tu navegador. No recopilamos ni almacenamos datos personales.",
	},
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return localizedPageMetadata(locale, "privacy", COPY);
}

export default async function PrivacyLayout({
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
