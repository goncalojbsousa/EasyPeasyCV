"use client";

import { Info, Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * CV Tips component
 * Displays helpful tips for creating a professional CV
 * @returns JSX element representing CV tips and advice
 */
export function CVTips() {
	const { t } = useLanguage();
	const tips = [
		{
			id: "format-simple",
			title: t("tip.format.simple.title"),
			description: t("tip.format.simple.desc"),
		},
		{
			id: "keywords",
			title: t("tip.keywords.title"),
			description: t("tip.keywords.desc"),
		},
		{
			id: "headers",
			title: t("tip.headers.title"),
			description: t("tip.headers.desc"),
		},
		{
			id: "format-file",
			title: t("tip.format.file.title"),
			description: t("tip.format.file.desc"),
		},
		{
			id: "acronyms",
			title: t("tip.acronyms.title"),
			description: t("tip.acronyms.desc"),
		},
		{
			id: "chronological",
			title: t("tip.chronological.title"),
			description: t("tip.chronological.desc"),
		},
		{
			id: "job-titles",
			title: t("tip.job.titles.title"),
			description: t("tip.job.titles.desc"),
		},
		{
			id: "spelling",
			title: t("tip.spelling.title"),
			description: t("tip.spelling.desc"),
		},
		{
			id: "technical-skills",
			title: t("tip.technical.skills.title"),
			description: t("tip.technical.skills.desc"),
		},
	];

	return (
		<div
			id="cv-tips-section"
			className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg shadow-sm p-4 sm:p-6"
		>
			<div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
				<div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center flex-shrink-0">
					<Sparkles className="w-6 h-6 text-white" />
				</div>
				<div>
					<h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
						{t("tips.title")}
					</h2>
					<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
						{t("tips.subtitle")}
					</p>
				</div>
			</div>
			{/* List of CV tips and advice */}
			<div className="space-y-3 sm:space-y-4">
				{tips.map((tip, index) => (
					<div
						key={tip.id}
						className="bg-white dark:bg-zinc-900 rounded-lg p-3 sm:p-4 border border-sky-100 dark:border-sky-900/30 shadow-sm"
					>
						<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-start gap-2">
							<span className="w-5 h-5 sm:w-6 sm:h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
								{index + 1}
							</span>
							<span className="text-sm sm:text-base">{tip.title}</span>
						</h3>
						<p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm ml-7 sm:ml-8">
							{tip.description}
						</p>
					</div>
				))}

				{/* Extra tips and information section */}
				<div className="mt-6 p-3 sm:p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-800">
					<div className="flex items-start gap-3">
						<Info className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 mt-0.5 flex-shrink-0" />
						<div>
							<p className="text-xs sm:text-sm text-sky-800 dark:text-sky-300 font-medium">
								{t("tips.extra.title")}
							</p>
							<p className="text-xs sm:text-sm text-sky-700 dark:text-sky-400 mt-1">
								{t("tips.extra.content")}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
