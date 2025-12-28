"use client";

import { ArrowLeft, CheckCircle2, ScrollText, Shield } from "lucide-react";
import Link from "next/link";
import { Footer } from "../components/layout/footer";
import { Navbar } from "../components/layout/navbar";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * Terms of Service page component
 * Styled to align with the main product look while remaining formal.
 */
export default function TermsOfService() {
	const { t } = useLanguage();

	return (
		<div className="relative min-h-screen bg-white dark:bg-zinc-900 transition-colors overflow-x-hidden">
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800" />
				<div className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-sky-200/40 dark:bg-sky-900/20 blur-3xl" />
				<div className="absolute bottom-0 -left-10 h-80 w-80 rounded-full bg-blue-200/40 dark:bg-blue-900/10 blur-3xl" />
			</div>

			<Navbar />

			<main className="relative max-w-6xl mx-auto pt-32 pb-20 px-4 sm:px-6">
				<div className="flex flex-col gap-4 mb-10">
					<div className="flex flex-wrap items-center gap-3 text-sm text-sky-700 dark:text-sky-300">
						<Link
							href="/"
							className="inline-flex items-center gap-2 rounded-full border border-sky-100/70 dark:border-sky-900/40 bg-white/70 dark:bg-zinc-900/70 px-4 py-2 font-semibold text-sky-700 dark:text-sky-200 shadow-sm backdrop-blur hover:border-sky-300 dark:hover:border-sky-700 transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							{t("terms.back.home")}
						</Link>
						<span className="h-4 w-px bg-sky-200 dark:bg-sky-800" />
						<span className="inline-flex items-center gap-2 rounded-full bg-sky-100 dark:bg-sky-900/40 px-3 py-1 font-medium text-sky-800 dark:text-sky-200">
							<Shield className="h-4 w-4" />
							{t("terms.title")}
						</span>
					</div>

					<div className="flex flex-col gap-3">
						<h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
							{t("terms.title")}
						</h1>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
							{t("terms.introduction.description")}
						</p>
						<div className="inline-flex items-center gap-2 w-fit rounded-full bg-white/90 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 shadow-sm">
							<span className="font-semibold text-gray-900 dark:text-white">
								{t("terms.last.updated")}
							</span>
							<span className="text-gray-500 dark:text-gray-400">
								06/08/2025
							</span>
						</div>
					</div>
				</div>

				<div className="grid lg:grid-cols-[2fr,1fr] gap-8">
					<article className="rounded-2xl border border-white/70 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/70 shadow-2xl backdrop-blur divide-y divide-gray-100 dark:divide-zinc-800">
						<section id="introduction" className="p-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-200 flex items-center justify-center">
									<Shield className="h-5 w-5" />
								</div>
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
									{t("terms.introduction.title")}
								</h2>
							</div>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
								{t("terms.introduction.description")}
							</p>
						</section>

						<section id="acceptance" className="p-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 flex items-center justify-center">
									<CheckCircle2 className="h-5 w-5" />
								</div>
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
									{t("terms.acceptance.title")}
								</h2>
							</div>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
								{t("terms.acceptance.description")}
							</p>
						</section>

						<section id="service" className="p-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 flex items-center justify-center">
									<ScrollText className="h-5 w-5" />
								</div>
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
									{t("terms.service.title")}
								</h2>
							</div>
							<p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
								{t("terms.service.description")}
							</p>
							<ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
								<li>{t("terms.service.features.cv")}</li>
								<li>{t("terms.service.features.templates")}</li>
								<li>{t("terms.service.features.pdf")}</li>
								<li>{t("terms.service.features.local")}</li>
							</ul>
						</section>

						<section id="responsibilities" className="p-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 flex items-center justify-center">
									<Shield className="h-5 w-5" />
								</div>
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
									{t("terms.responsibilities.title")}
								</h2>
							</div>
							<p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
								{t("terms.responsibilities.description")}
							</p>
							<ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
								<li>{t("terms.responsibilities.accurate")}</li>
								<li>{t("terms.responsibilities.legal")}</li>
								<li>{t("terms.responsibilities.compliance")}</li>
							</ul>
						</section>

						<section id="prohibited" className="p-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-200 flex items-center justify-center">
									<Shield className="h-5 w-5" />
								</div>
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
									{t("terms.prohibited.title")}
								</h2>
							</div>
							<p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
								{t("terms.prohibited.description")}
							</p>
							<ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
								<li>{t("terms.prohibited.illegal")}</li>
								<li>{t("terms.prohibited.harmful")}</li>
								<li>{t("terms.prohibited.copyright")}</li>
							</ul>
						</section>

						<section id="intellectual" className="p-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200 flex items-center justify-center">
									<ScrollText className="h-5 w-5" />
								</div>
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
									{t("terms.intellectual.title")}
								</h2>
							</div>
							<p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
								{t("terms.intellectual.description")}
							</p>
							<div className="rounded-xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3 text-sm text-yellow-900 dark:text-yellow-100 shadow-sm">
								{t("terms.intellectual.user.content")}
							</div>
						</section>

						<section id="privacy" className="p-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-200 flex items-center justify-center">
									<Shield className="h-5 w-5" />
								</div>
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
									{t("terms.privacy.title")}
								</h2>
							</div>
							<p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
								{t("terms.privacy.description")}
							</p>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
								{t("terms.privacy.policy")}{" "}
								<Link
									href="/privacy"
									className="text-sky-700 dark:text-sky-300 hover:underline"
								>
									{t("terms.privacy.link")}
								</Link>
							</p>
						</section>

						<section id="availability" className="p-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 flex items-center justify-center">
									<ScrollText className="h-5 w-5" />
								</div>
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
									{t("terms.availability.title")}
								</h2>
							</div>
							<p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
								{t("terms.availability.description")}
							</p>
							<ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
								<li>{t("terms.availability.maintenance")}</li>
								<li>{t("terms.availability.updates")}</li>
								<li>{t("terms.availability.force")}</li>
							</ul>
						</section>

						<section id="disclaimers" className="p-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 flex items-center justify-center">
									<Shield className="h-5 w-5" />
								</div>
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
									{t("terms.disclaimers.title")}
								</h2>
							</div>
							<p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
								{t("terms.disclaimers.description")}
							</p>
							<ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
								<li>{t("terms.disclaimers.warranty")}</li>
								<li>{t("terms.disclaimers.accuracy")}</li>
								<li>{t("terms.disclaimers.employment")}</li>
							</ul>
						</section>

						<section id="law" className="p-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 flex items-center justify-center">
									<ScrollText className="h-5 w-5" />
								</div>
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
									{t("terms.law.title")}
								</h2>
							</div>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
								{t("terms.law.description")}
							</p>
						</section>

						<section id="changes" className="p-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-200 flex items-center justify-center">
									<ScrollText className="h-5 w-5" />
								</div>
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
									{t("terms.changes.title")}
								</h2>
							</div>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
								{t("terms.changes.description")}
							</p>
						</section>

						<section id="contact" className="p-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 flex items-center justify-center">
									<ArrowLeft className="h-5 w-5" />
								</div>
								<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
									{t("terms.contact.title")}
								</h2>
							</div>
							<p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
								{t("terms.contact.description")}
							</p>
							<div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/80 dark:bg-zinc-800/70 px-4 py-4 text-sm text-gray-700 dark:text-gray-200">
								<p>
									<strong>GitHub:</strong>{" "}
									<a
										href="https://github.com/goncalojbsousa/cv-builder/issues"
										className="text-sky-700 dark:text-sky-300 hover:underline"
									>
										github.com/goncalojbsousa/cv-builder/issues
									</a>
								</p>
							</div>
						</section>
					</article>

					<aside className="lg:sticky lg:top-28 space-y-4">
						<div className="rounded-2xl border border-sky-100/70 dark:border-sky-900/40 bg-white/80 dark:bg-zinc-900/70 shadow-xl backdrop-blur p-6">
							<div className="flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-200 mb-3">
								<Shield className="h-4 w-4" />
								{t("terms.title")}
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
								{t("terms.disclaimers.description")}
							</p>
						</div>
						<div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 shadow-xl backdrop-blur p-6 space-y-3">
							<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
								{t("terms.privacy.description")}
							</p>
							<Link
								href="/privacy"
								className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300 hover:underline"
							>
								{t("terms.privacy.link")}
								<ArrowLeft className="h-4 w-4 rotate-180" />
							</Link>
						</div>
					</aside>
				</div>
			</main>

			<Footer />
		</div>
	);
}
