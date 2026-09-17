import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "../translations";

/**
 * The preview card shown when a link to the site is shared, rendered per
 * locale so a link to /pt previews in Portuguese and one to /es in Spanish.
 *
 * Built at build time by the `opengraph-image` and `twitter-image` routes;
 * its text lives here because it is marketing copy for one image, not UI.
 */

const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };

const COPY: Record<
	Locale,
	{ headline: string; subline: string; privacy: string }
> = {
	en: {
		headline: "Build your professional CV",
		subline: "Free, no sign-up and ATS-friendly.",
		privacy: "Your data stays in your browser",
	},
	pt: {
		headline: "Crie o seu currículo profissional",
		subline: "Grátis, sem registo e otimizado para ATS.",
		privacy: "Os seus dados ficam no seu browser",
	},
	br: {
		headline: "Crie seu currículo profissional",
		subline: "Grátis, sem cadastro e otimizado para ATS.",
		privacy: "Seus dados ficam no seu navegador",
	},
	es: {
		headline: "Crea tu currículum profesional",
		subline: "Gratis, sin registro y optimizado para ATS.",
		privacy: "Tus datos se quedan en tu navegador",
	},
};

const SKY_600 = "#0284c7";
const SLATE_900 = "#0f172a";
const SLATE_500 = "#64748b";

function loadFont(file: string) {
	return readFile(join(process.cwd(), "assets/fonts", file));
}

/** The document glyph of the logo, drawn inline so no image has to load. */
function LogoMark({ size }: { size: number }) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: size,
				height: size,
				borderRadius: size * 0.24,
				background: `linear-gradient(135deg, ${SKY_600}, #1d4ed8)`,
			}}
		>
			<svg
				width={size * 0.56}
				height={size * 0.56}
				viewBox="0 0 24 24"
				fill="none"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
				<path d="M14 2v4a2 2 0 0 0 2 2h4" />
			</svg>
		</div>
	);
}

/** A stylised CV page: gives the card a recognisable subject at a glance. */
function CvSketch() {
	const line = (width: string, color = "#e2e8f0", height = 10) => (
		<div style={{ width, height, borderRadius: 999, background: color }} />
	);
	const section = (title: string) => (
		<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
			{line(title, SKY_600, 12)}
			{line("100%")}
			{line("92%")}
			{line("70%")}
		</div>
	);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 30,
				width: 360,
				height: 470,
				padding: "40px 36px",
				borderRadius: 18,
				background: "white",
				border: "1px solid #e2e8f0",
				boxShadow: "0 30px 60px -20px rgba(15, 23, 42, 0.25)",
				transform: "rotate(3deg)",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 12,
				}}
			>
				{line("58%", SLATE_900, 18)}
				{line("40%", "#cbd5e1")}
			</div>
			{section("34%")}
			{section("42%")}
			{section("28%")}
		</div>
	);
}

export async function renderSocialImage(locale: string) {
	const copy = COPY[locale as Locale] ?? COPY.en;
	const [regular, bold] = await Promise.all([
		loadFont("LiberationSans-Regular.ttf"),
		loadFont("LiberationSans-Bold.ttf"),
	]);

	return new ImageResponse(
		<div
			style={{
				display: "flex",
				width: "100%",
				height: "100%",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "0 90px",
				fontFamily: "Liberation Sans",
				background:
					"linear-gradient(135deg, #f0f9ff 0%, #ffffff 55%, #ecfdf5 100%)",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: 640,
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 18 }}>
					<LogoMark size={64} />
					<div
						style={{
							fontSize: 40,
							fontWeight: 700,
							color: SKY_600,
						}}
					>
						EasyPeasyCV
					</div>
				</div>

				<div
					style={{
						marginTop: 48,
						fontSize: 64,
						fontWeight: 700,
						lineHeight: 1.08,
						letterSpacing: -1.5,
						color: SLATE_900,
					}}
				>
					{copy.headline}
				</div>
				<div style={{ marginTop: 22, fontSize: 30, color: SLATE_500 }}>
					{copy.subline}
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 12,
						marginTop: 44,
						alignSelf: "flex-start",
						padding: "12px 22px",
						borderRadius: 999,
						background: "#dcfce7",
						color: "#166534",
						fontSize: 24,
						fontWeight: 700,
					}}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#166534"
						strokeWidth="2.4"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
						<path d="M7 11V7a5 5 0 0 1 10 0v4" />
					</svg>
					{copy.privacy}
				</div>
			</div>

			<CvSketch />
		</div>,
		{
			...SOCIAL_IMAGE_SIZE,
			fonts: [
				{ name: "Liberation Sans", data: regular, weight: 400 },
				{ name: "Liberation Sans", data: bold, weight: 700 },
			],
		},
	);
}
