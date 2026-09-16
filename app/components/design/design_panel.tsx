"use client";

import {
	FileText,
	Heading,
	LayoutList,
	RotateCcw,
	Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { CvColor, CvRenderSettings, CvTemplate } from "../../types/cv";
import { HeaderTab } from "./tab_header";
import { PageTab } from "./tab_page";
import { PresetsTab } from "./tab_presets";
import { SectionsTab } from "./tab_sections";
import { useDesignSettings } from "./use_design_settings";

type TabId = "presets" | "page" | "header" | "sections";

/** What the panel needs to know about a custom section to style it. */
export interface CustomSectionSummary {
	id: string;
	title: string;
}

const TABS: { id: TabId; labelKey: string; icon: ReactNode }[] = [
	{
		id: "presets",
		labelKey: "design.tab.presets",
		icon: <Sparkles className="w-3.5 h-3.5" />,
	},
	{
		id: "page",
		labelKey: "design.tab.page",
		icon: <FileText className="w-3.5 h-3.5" />,
	},
	{
		id: "header",
		labelKey: "design.tab.header",
		icon: <Heading className="w-3.5 h-3.5" />,
	},
	{
		id: "sections",
		labelKey: "design.tab.sections",
		icon: <LayoutList className="w-3.5 h-3.5" />,
	},
];

interface DesignPanelProps {
	settings?: CvRenderSettings;
	onSettingsChange: (settings: CvRenderSettings) => void;
	selectedColor: CvColor;
	onColorChange: (color: CvColor) => void;
	onResetSectionOrder?: () => void;
	/** Legacy theme of a CV saved before the modular system */
	legacyTemplate?: CvTemplate;
	/** The CV's custom sections, each of which can be styled individually */
	customSections?: CustomSectionSummary[];
	/** Opens this tab first, e.g. when entered from a section's own shortcut */
	initialTab?: TabId;
}

/**
 * The single place the CV's appearance is customised.
 *
 * Replaces the old template gallery plus the flat list of layout controls: the
 * options are grouped into four tabs so only one concern is on screen at a
 * time, and every structural choice is picked from illustrated variants rather
 * than a named dropdown.
 */
export function DesignPanel({
	settings,
	onSettingsChange,
	selectedColor,
	onColorChange,
	onResetSectionOrder,
	legacyTemplate,
	customSections,
	initialTab = "presets",
}: DesignPanelProps) {
	const { t } = useLanguage();
	const [tab, setTab] = useState<TabId>(initialTab);
	const design = useDesignSettings(
		settings,
		onSettingsChange,
		selectedColor,
		onColorChange,
		legacyTemplate,
	);

	return (
		<div className="flex flex-col">
			{/* Tabs */}
			<div
				role="tablist"
				aria-label={t("design.title")}
				className="flex gap-1 px-3 pt-1 pb-2 border-b border-gray-200 dark:border-zinc-700"
			>
				{TABS.map((item) => {
					const active = tab === item.id;
					return (
						<button
							key={item.id}
							type="button"
							role="tab"
							aria-selected={active}
							onClick={() => setTab(item.id)}
							className={`flex-1 inline-flex flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[10px] font-medium transition-colors ${
								active
									? "bg-sky-50 dark:bg-sky-900/25 text-sky-700 dark:text-sky-300"
									: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
							}`}
						>
							{item.icon}
							<span>{t(item.labelKey)}</span>
						</button>
					);
				})}
			</div>

			{/* Panel body */}
			<div className="px-4 py-3">
				{tab === "presets" && <PresetsTab design={design} />}
				{tab === "page" && <PageTab design={design} />}
				{tab === "header" && <HeaderTab design={design} />}
				{tab === "sections" && (
					<SectionsTab design={design} customSections={customSections} />
				)}
			</div>

			{/* Footer actions */}
			<div className="flex gap-2 px-4 pt-3 pb-1 border-t border-gray-200 dark:border-zinc-700">
				<button
					type="button"
					onClick={design.resetAll}
					className="flex-1 h-9 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-xs text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm inline-flex items-center justify-center gap-2"
				>
					<RotateCcw className="w-3.5 h-3.5" />
					<span className="font-medium">{t("layout.controls.reset")}</span>
				</button>
				{onResetSectionOrder && (
					<button
						type="button"
						onClick={onResetSectionOrder}
						title={t("section.order.reset")}
						className="flex-1 h-9 px-3 rounded-md border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-xs text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700 shadow-sm inline-flex items-center justify-center gap-2"
					>
						<RotateCcw className="w-3.5 h-3.5" />
						<span className="font-medium">{t("section.order.reset")}</span>
					</button>
				)}
			</div>
		</div>
	);
}
