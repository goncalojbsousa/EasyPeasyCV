"use client";

import { FileText, Minimize2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface PageCountProps {
	pageCount: number | null;
	/** Whether the Super Compact layout is already on */
	compactMode?: boolean;
	/** Turns the Super Compact layout on; the action is hidden when omitted */
	onEnableCompactMode?: () => void;
}

/**
 * How many pages the CV takes, plus a shortcut to tighten the layout when it
 * spills over.
 *
 * The shortcut toggles the same "Super Compact" option as the Design panel and
 * uses its name: it reduces spacing and text size, which often — but not
 * always — saves a page, so it must not promise a single page.
 */
export function PageCount({
	pageCount,
	compactMode = false,
	onEnableCompactMode,
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

			{overflowing && !compactMode && onEnableCompactMode && (
				<button
					type="button"
					onClick={onEnableCompactMode}
					title={t("layout.controls.singlePageMode.help")}
					className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/25 transition-colors"
				>
					<Minimize2 className="w-3.5 h-3.5" />
					{t("preview.compact.try")}
				</button>
			)}

			{overflowing && compactMode && (
				<span className="text-gray-500 dark:text-gray-400">
					{t("preview.compact.active")}
				</span>
			)}
		</div>
	);
}
