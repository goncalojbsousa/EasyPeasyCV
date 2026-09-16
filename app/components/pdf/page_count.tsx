"use client";

import { FileText, Minimize2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface PageCountProps {
	pageCount: number | null;
	/** Whether single-page mode is already on */
	singlePageMode?: boolean;
	/** Turns single-page mode on; the action is hidden when omitted */
	onFitToOnePage?: () => void;
}

/**
 * How many pages the CV takes, plus a one-click fix when it spills over.
 *
 * "Does it fit on one page?" is the question people ask of a CV, so the answer
 * sits right above the preview instead of having to be counted by scrolling.
 */
export function PageCount({
	pageCount,
	singlePageMode = false,
	onFitToOnePage,
}: PageCountProps) {
	const { t } = useLanguage();
	if (pageCount === null) return null;

	const overflowing = pageCount > 1;
	const label =
		pageCount === 1
			? t("preview.pages.one")
			: t("preview.pages.many").replace("{n}", String(pageCount));

	return (
		<div className="flex flex-wrap items-center gap-2 text-xs">
			<span
				className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium ${
					overflowing
						? "bg-amber-50 text-amber-800 dark:bg-amber-900/25 dark:text-amber-300"
						: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-300"
				}`}
				aria-live="polite"
			>
				<FileText className="w-3.5 h-3.5" />
				{label}
			</span>

			{overflowing && !singlePageMode && onFitToOnePage && (
				<button
					type="button"
					onClick={onFitToOnePage}
					className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/25 transition-colors"
				>
					<Minimize2 className="w-3.5 h-3.5" />
					{t("preview.fitOnePage")}
				</button>
			)}

			{overflowing && singlePageMode && (
				<span className="text-gray-500 dark:text-gray-400">
					{t("preview.singlePageActive")}
				</span>
			)}
		</div>
	);
}
