import type { Metadata } from "next";
import type { ReactNode } from "react";

const segment = "privacy";
const baseUrl = "https://www.easypeasycv.com";

type Locale = "en" | "pt" | "br" | "es";

const titles: Record<Locale, string> = {
	en: "Privacy Policy",
	pt: "Política de Privacidade",
	br: "Política de Privacidade",
	es: "Política de Privacidad",
};

const descriptions: Record<Locale, string> = {
	en: "Privacy Policy for EasyPeasyCV. Your data stays in your browser. We do not collect or store personal data.",
	pt: "Política de Privacidade do EasyPeasyCV. Os seus dados ficam no seu browser. Não recolhemos nem armazenamos dados pessoais.",
	br: "Política de Privacidade do EasyPeasyCV. Seus dados ficam no seu navegador. Não coletamos nem armazenamos dados pessoais.",
	es: "Política de Privacidad de EasyPeasyCV. Tus datos permanecen en tu navegador. No recopilamos ni almacenamos datos personales.",
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

export default function PrivacyLayout({ children }: { children: ReactNode }) {
	return children;
}
