import {
	ArrowLeft,
	ArrowUpRight,
	Bug,
	ChevronDown,
	LifeBuoy,
	Lightbulb,
	type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "../../components/layout/footer";
import { Navbar } from "../../components/layout/navbar";
import { getTranslations } from "../../translations";

const ISSUES_URL = "https://github.com/goncalojbsousa/EasyPeasyCV/issues/new";

/** Questions by group, in reading order: data first, it is the main worry. */
const FAQ_GROUPS: { titleKey: string; questions: string[] }[] = [
	{
		titleKey: "faq.group.data",
		questions: ["account", "where", "lose", "move"],
	},
	{
		titleKey: "faq.group.building",
		questions: ["profiles", "design", "pages", "language", "examples"],
	},
	{
		titleKey: "faq.group.project",
		questions: ["free", "ats"],
	},
];

const CONTACT_LINKS: {
	key: string;
	href: string;
	icon: LucideIcon;
	iconClass: string;
}[] = [
	{
		key: "bug",
		href: `${ISSUES_URL}?labels=bug`,
		icon: Bug,
		iconClass:
			"bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200",
	},
	{
		key: "idea",
		href: `${ISSUES_URL}?labels=enhancement`,
		icon: Lightbulb,
		iconClass:
			"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
	},
];

/**
 * FAQ and feedback page.
 *
 * Rendered on the server: the answers are plain text, the accordions are
 * native <details> (no JavaScript needed) and the same content feeds the
 * FAQPage structured data for search engines.
 */
export default async function FaqPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const translations = getTranslations(locale);
	const t = (key: string) => translations[key] ?? key;

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: FAQ_GROUPS.flatMap((group) => group.questions).map((id) => ({
			"@type": "Question",
			name: t(`faq.${id}.q`),
			acceptedAnswer: { "@type": "Answer", text: t(`faq.${id}.a`) },
		})),
	};

	return (
		<div className="relative min-h-screen bg-white dark:bg-zinc-900 transition-colors overflow-x-hidden">
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from our own translations
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800" />
				<div className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-sky-200/40 dark:bg-sky-900/20 blur-3xl" />
			</div>

			<Navbar />

			<main
				id="main-content"
				className="relative max-w-3xl mx-auto pt-24 pb-20 px-4 sm:px-6"
			>
				<div className="flex flex-col gap-4 mb-10">
					<div className="flex flex-wrap items-center gap-3 text-sm">
						<Link
							href={`/${locale}`}
							className="inline-flex items-center gap-2 rounded-full border border-sky-100/70 dark:border-sky-900/40 bg-white/70 dark:bg-zinc-900/70 px-4 py-2 font-semibold text-sky-700 dark:text-sky-200 shadow-sm backdrop-blur hover:border-sky-300 dark:hover:border-sky-700 transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							{t("privacy.back.home")}
						</Link>
						<span className="inline-flex items-center gap-2 rounded-full bg-sky-100 dark:bg-sky-900/40 px-3 py-1 font-medium text-sky-800 dark:text-sky-200">
							<LifeBuoy className="h-4 w-4" />
							{t("faq.badge")}
						</span>
					</div>
					<h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
						{t("faq.title")}
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300">
						{t("faq.subtitle")}
					</p>
				</div>

				<div className="flex flex-col gap-10">
					{FAQ_GROUPS.map((group) => (
						<section key={group.titleKey}>
							<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
								{t(group.titleKey)}
							</h2>
							<div className="divide-y divide-gray-100 dark:divide-zinc-800 overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/70 shadow-sm">
								{group.questions.map((id) => (
									<details key={id} id={id} className="group">
										<summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-zinc-800/60 focus-visible:outline-2 focus-visible:outline-sky-500 [&::-webkit-details-marker]:hidden">
											{t(`faq.${id}.q`)}
											<ChevronDown
												aria-hidden="true"
												className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
											/>
										</summary>
										<p className="px-5 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed">
											{t(`faq.${id}.a`)}
										</p>
									</details>
								))}
							</div>
						</section>
					))}

					<section
						id="contact"
						className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/70 p-6 sm:p-8 shadow-sm"
					>
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
							{t("faq.contact.title")}
						</h2>
						<p className="mt-2 text-gray-600 dark:text-gray-300">
							{t("faq.contact.description")}
						</p>

						<div className="mt-6 grid gap-3 sm:grid-cols-2">
							{CONTACT_LINKS.map(({ key, href, icon: Icon, iconClass }) => (
								<a
									key={key}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex items-start gap-3 rounded-xl border border-gray-200 dark:border-zinc-700 p-4 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-colors"
								>
									<span
										className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
									>
										<Icon className="h-5 w-5" />
									</span>
									<span className="min-w-0 flex-1">
										<span className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
											{t(`faq.contact.${key}.title`)}
											<ArrowUpRight
												aria-hidden="true"
												className="h-4 w-4 text-gray-400 group-hover:text-sky-600 transition-colors"
											/>
											<span className="sr-only">
												{t("faq.contact.opensInNewTab")}
											</span>
										</span>
										<span className="mt-0.5 block text-sm text-gray-600 dark:text-gray-400">
											{t(`faq.contact.${key}.description`)}
										</span>
									</span>
								</a>
							))}
						</div>

						<p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
							{t("faq.contact.note")}
						</p>
					</section>
				</div>
			</main>

			<Footer />
		</div>
	);
}
