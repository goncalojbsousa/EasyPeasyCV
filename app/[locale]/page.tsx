import {
	Archive,
	ArrowRight,
	Check,
	Copy,
	Heart,
	Languages,
	Save,
	ScanText,
	Smartphone,
	X,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
	LANDING_MEDIA,
	LandingMedia,
} from "../components/landing/landing_media";
import { StyleSwitcher } from "../components/landing/style_switcher";
import { Footer } from "../components/layout/footer";
import { Navbar, PAGE_CTA_ID } from "../components/layout/navbar";
import { getTranslations } from "../translations";

const GITHUB_URL = "https://github.com/goncalojbsousa/EasyPeasyCV";
const KOFI_URL = "https://ko-fi.com/easypeasycv";

/** Rows of the "why it's different" comparison: others vs. us. */
const COMPARISON = ["account", "data", "download", "subscription"];

const DETAILS = [
	{ key: "mobile", icon: Smartphone },
	{ key: "versions", icon: Copy },
	{ key: "autosave", icon: Save },
	{ key: "backup", icon: Archive },
	{ key: "languages", icon: Languages },
	{ key: "ats", icon: ScanText },
];

const FAQ_PREVIEW = ["account", "where", "free"];

/** The one call to action, repeated only at the top and bottom of the page. */
function PrimaryCta({ href, children }: { href: string; children: ReactNode }) {
	return (
		<Link
			href={href}
			className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 transition-colors"
		>
			{children}
			<ArrowRight aria-hidden="true" className="h-4 w-4" />
		</Link>
	);
}

function SectionHeading({
	title,
	subtitle,
}: {
	title: string;
	subtitle?: string;
}) {
	return (
		<div className="max-w-2xl">
			<h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
				{title}
			</h2>
			{subtitle && (
				<p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
					{subtitle}
				</p>
			)}
		</div>
	);
}

/**
 * Home page, written for the person making a CV rather than for developers:
 * it shows the app and the result, and explains privacy by what the visitor
 * does not have to do (sign up, pay, hand over data) instead of by jargon.
 */
export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const translations = getTranslations(locale);
	const t = (key: string) => translations[key] ?? key;
	const builderHref = `/${locale}/builder`;

	return (
		<div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors">
			<Navbar builderCta />

			<main id="main-content">
				{/* ------------------------------------------------------------ Hero */}
				<section className="px-4 sm:px-6 pt-28 pb-16 sm:pt-32 sm:pb-24">
					<div className="mx-auto max-w-6xl">
						<div className="mx-auto max-w-3xl text-center">
							<p className="text-sm font-medium text-sky-700 dark:text-sky-400">
								{t("home.hero.eyebrow")}
							</p>
							<h1 className="mt-3 text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
								{t("home.hero.title")}
							</h1>
							<p className="mt-5 text-lg sm:text-xl text-gray-600 dark:text-gray-300">
								{t("home.hero.subtitle")}
							</p>
							<div className="mt-8 flex flex-col items-center gap-3">
								<div id={PAGE_CTA_ID}>
									<PrimaryCta href={builderHref}>{t("home.cta")}</PrimaryCta>
								</div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{t("home.hero.note")}
								</p>
							</div>
						</div>

						<div className="relative mx-auto mt-14 aspect-video max-w-5xl overflow-hidden rounded-xl bg-white dark:bg-zinc-800 ring-1 ring-gray-200 dark:ring-zinc-700 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
							<LandingMedia
								asset={LANDING_MEDIA.hero}
								alt={t("home.hero.media.alt")}
								sizes="(min-width: 1024px) 1024px, 100vw"
								priority
							/>
						</div>
					</div>
				</section>

				{/* -------------------------------------------------- Result & styles */}
				<section className="px-4 sm:px-6 py-16 sm:py-24 bg-gray-50 dark:bg-zinc-800/40 border-y border-gray-100 dark:border-zinc-800">
					<div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_480px]">
						<div>
							<SectionHeading
								title={t("home.result.title")}
								subtitle={t("home.result.subtitle")}
							/>
							<ul className="mt-8 space-y-4">
								{[
									"home.result.watermark",
									"home.styles.subtitle",
									"home.result.ats",
									"home.result.language",
								].map((point) => (
									<li key={point} className="flex gap-3">
										<Check
											aria-hidden="true"
											className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
										/>
										<span className="text-gray-700 dark:text-gray-300">
											{t(point)}
										</span>
									</li>
								))}
							</ul>
							<Link
								href={builderHref}
								className="mt-8 inline-flex items-center gap-1.5 font-semibold text-sky-700 dark:text-sky-400 hover:underline"
							>
								{t("home.styles.link")}
								<ArrowRight aria-hidden="true" className="h-4 w-4" />
							</Link>
						</div>
						<StyleSwitcher
							label={t("home.styles.title")}
							styles={LANDING_MEDIA.styles.map((asset) => ({
								asset,
								label: t(asset.labelKey),
							}))}
							alt={t("home.styles.media.alt")}
						/>
					</div>
				</section>

				{/* ------------------------------------------------------ Comparison */}
				<section className="px-4 sm:px-6 py-16 sm:py-24">
					<div className="mx-auto max-w-4xl">
						<SectionHeading
							title={t("home.compare.title")}
							subtitle={t("home.compare.subtitle")}
						/>

						<div className="mt-10 overflow-hidden rounded-xl ring-1 ring-gray-200 dark:ring-zinc-700">
							<div className="grid grid-cols-2 bg-gray-50 dark:bg-zinc-800 text-sm font-semibold">
								<div className="px-4 sm:px-6 py-3 text-gray-500 dark:text-gray-400">
									{t("home.compare.others")}
								</div>
								<div className="px-4 sm:px-6 py-3 text-sky-700 dark:text-sky-400">
									EasyPeasyCV
								</div>
							</div>
							{COMPARISON.map((row) => (
								<div
									key={row}
									className="grid grid-cols-2 border-t border-gray-200 dark:border-zinc-700"
								>
									<div className="flex gap-3 px-4 sm:px-6 py-4 text-gray-600 dark:text-gray-400">
										<X
											aria-hidden="true"
											className="mt-0.5 h-5 w-5 shrink-0 text-gray-400 dark:text-zinc-500"
										/>
										<span>{t(`home.compare.${row}.others`)}</span>
									</div>
									<div className="flex gap-3 px-4 sm:px-6 py-4 font-medium text-gray-900 dark:text-white">
										<Check
											aria-hidden="true"
											className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
										/>
										<span>{t(`home.compare.${row}.us`)}</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* --------------------------------------------------------- Details */}
				<section className="px-4 sm:px-6 py-16 sm:py-24 bg-gray-50 dark:bg-zinc-800/40 border-y border-gray-100 dark:border-zinc-800">
					<div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_320px]">
						<div>
							<SectionHeading title={t("home.details.title")} />
							<dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
								{DETAILS.map(({ key, icon: Icon }) => (
									<div key={key} className="flex gap-4">
										<Icon
											aria-hidden="true"
											className="mt-0.5 h-6 w-6 shrink-0 text-sky-600 dark:text-sky-400"
										/>
										<div>
											<dt className="font-semibold text-gray-900 dark:text-white">
												{t(`home.details.${key}.title`)}
											</dt>
											<dd className="mt-1 text-gray-600 dark:text-gray-400">
												{t(`home.details.${key}.description`)}
											</dd>
										</div>
									</div>
								))}
							</dl>
						</div>
						<div className="relative mx-auto aspect-[390/844] w-full max-w-[280px] overflow-hidden rounded-[2rem] bg-white dark:bg-zinc-800 ring-8 ring-gray-900 dark:ring-zinc-700 shadow-xl">
							<LandingMedia
								asset={LANDING_MEDIA.mobile}
								alt={t("home.details.mobile.media.alt")}
								sizes="280px"
							/>
						</div>
					</div>
				</section>

				{/* ----------------------------------------------------------- About */}
				<section className="px-4 sm:px-6 py-16 sm:py-24">
					<div className="mx-auto max-w-3xl">
						<div className="flex flex-col gap-8 sm:flex-row sm:items-start">
							<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
								<LandingMedia
									asset={LANDING_MEDIA.author}
									alt={t("home.about.media.alt")}
									sizes="96px"
								/>
							</div>
							<div>
								<h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
									{t("home.about.title")}
								</h2>
								<div className="mt-4 space-y-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
									<p>{t("home.about.p1")}</p>
									<p>{t("home.about.p2")}</p>
								</div>
								<div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
									<a
										href={GITHUB_URL}
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-900 dark:text-white hover:underline"
									>
										{t("home.about.github")}
									</a>
									<a
										href={KOFI_URL}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 text-gray-900 dark:text-white hover:underline"
									>
										<Heart
											aria-hidden="true"
											className="h-4 w-4 text-rose-500"
										/>
										{t("home.about.support")}
									</a>
									<Link
										href={`/${locale}/faq#contact`}
										className="text-gray-900 dark:text-white hover:underline"
									>
										{t("home.about.feedback")}
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* ------------------------------------------------------------- FAQ */}
				<section className="px-4 sm:px-6 py-16 sm:py-24 bg-gray-50 dark:bg-zinc-800/40 border-y border-gray-100 dark:border-zinc-800">
					<div className="mx-auto max-w-3xl">
						<SectionHeading title={t("home.faq.title")} />
						<div className="mt-8 divide-y divide-gray-200 dark:divide-zinc-700 border-y border-gray-200 dark:border-zinc-700">
							{FAQ_PREVIEW.map((id) => (
								<div key={id} className="py-5">
									<h3 className="font-semibold text-gray-900 dark:text-white">
										{t(`faq.${id}.q`)}
									</h3>
									<p className="mt-2 text-gray-600 dark:text-gray-400">
										{t(`faq.${id}.a`)}
									</p>
								</div>
							))}
						</div>
						<Link
							href={`/${locale}/faq`}
							className="mt-6 inline-flex items-center gap-1.5 font-semibold text-sky-700 dark:text-sky-400 hover:underline"
						>
							{t("home.faq.link")}
							<ArrowRight aria-hidden="true" className="h-4 w-4" />
						</Link>
					</div>
				</section>

				{/* ------------------------------------------------------- Final CTA */}
				<section className="px-4 sm:px-6 py-16 sm:py-24">
					<div className="mx-auto max-w-4xl rounded-2xl bg-sky-600 dark:bg-sky-700 px-6 py-14 text-center">
						<h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
							{t("home.final.title")}
						</h2>
						<p className="mt-3 text-lg text-sky-100">
							{t("home.final.subtitle")}
						</p>
						<Link
							href={builderHref}
							className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-base font-semibold text-sky-700 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-600 transition-colors"
						>
							{t("home.cta")}
							<ArrowRight aria-hidden="true" className="h-4 w-4" />
						</Link>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
