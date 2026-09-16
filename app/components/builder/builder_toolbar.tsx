"use client";

import {
	AlertTriangle,
	Check,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	Circle,
	CloudCheck,
	GripVertical,
	ListTree,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { CVType } from "../../types/cv";
import type {
	NavigableSectionKey,
	RecommendedField,
} from "../../utils/cv-completeness";
import { useDismissable } from "../../utils/useDismissable";
import { DragHandle, SortableList } from "../dnd/sortable_list";
import { CvTypeIcon } from "../ui/cv_type_icon";
import { FLOATING_SURFACE } from "../ui/floating_surface";
import { CvTypeMenu } from "./action_menus";

/** Translation keys for the predefined sections' titles. */
export const SECTION_TITLE_KEYS: Record<string, string> = {
	personal_info: "section.personal.info",
	professional_summary: "section.professional.summary",
	professional_experience: "section.professional.experience",
	academic_education: "section.academic.education",
	technical_skills: "section.technical.skills",
	languages: "section.languages",
	certifications: "section.certifications",
	projects: "section.projects",
	volunteer: "section.volunteer",
};

export interface NavigatorSection {
	key: NavigableSectionKey;
	label: string;
	filled: boolean;
	collapsed: boolean;
}

interface BuilderToolbarProps {
	/** Personal information, always first and not reorderable */
	fixedSection: NavigatorSection;
	/** The reorderable sections, in CV order */
	sections: NavigatorSection[];
	onJump: (key: NavigableSectionKey) => void;
	onReorder: (from: number, to: number) => void;
	recommended: RecommendedField[];
	onJumpToField: (field: RecommendedField) => void;
	lastSavedAt: string | null;
	saveError: boolean;
	/** Area whose examples the form shows */
	examplesType: CVType;
	onExamplesTypeChange: (type: CVType) => void;
}

const LOCALE_TAGS: Record<string, string> = {
	pt: "pt-PT",
	br: "pt-BR",
	en: "en-GB",
	es: "es-ES",
};

/** A dropdown anchored under its trigger, closed by outside click or Escape. */
function useDropdown() {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	useDismissable(ref, open, () => setOpen(false));
	return { open, setOpen, ref };
}

const TRIGGER =
	"inline-flex items-center gap-1.5 h-8 rounded-md px-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors";

const PANEL_BASE =
	"absolute top-full mt-2 z-40 w-[min(320px,calc(100vw-2rem))] rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-xl";
/** Panel opening under a trigger at the toolbar's left end */
const PANEL = `${PANEL_BASE} left-0`;
/** Panel opening under a trigger at the toolbar's right end */
const PANEL_END = `${PANEL_BASE} right-0`;

/* -------------------------------------------------------------------------- */

function SectionRow({
	section,
	draggable,
	onJump,
}: {
	section: NavigatorSection;
	draggable: boolean;
	onJump: () => void;
}) {
	const { t } = useLanguage();
	return (
		<div className="flex items-center gap-1 rounded-md px-1 hover:bg-gray-50 dark:hover:bg-zinc-700/60 bg-white dark:bg-zinc-800">
			{draggable ? (
				<DragHandle
					ariaLabel={t("navigator.reorder")}
					className="p-1 text-gray-400 dark:text-zinc-500"
				>
					<GripVertical className="w-4 h-4" />
				</DragHandle>
			) : (
				<span className="w-6" aria-hidden="true" />
			)}
			<button
				type="button"
				onClick={onJump}
				className="flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200"
			>
				{section.filled ? (
					<CheckCircle2
						className="w-4 h-4 shrink-0 text-emerald-500"
						aria-label={t("navigator.filled")}
					/>
				) : (
					<Circle
						className="w-4 h-4 shrink-0 text-gray-300 dark:text-zinc-600"
						aria-label={t("navigator.empty")}
					/>
				)}
				<span className="truncate">{section.label}</span>
				{section.collapsed && (
					<ChevronRight
						className="ml-auto w-3.5 h-3.5 shrink-0 text-gray-400"
						aria-label={t("section.expand")}
					/>
				)}
			</button>
		</div>
	);
}

function SectionNavigator({
	fixedSection,
	sections,
	onJump,
	onReorder,
}: Pick<
	BuilderToolbarProps,
	"fixedSection" | "sections" | "onJump" | "onReorder"
>) {
	const { t } = useLanguage();
	const { open, setOpen, ref } = useDropdown();

	const jump = (key: NavigableSectionKey) => {
		setOpen(false);
		onJump(key);
	};

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				aria-expanded={open}
				className={TRIGGER}
			>
				<ListTree className="w-4 h-4" />
				{t("navigator.title")}
				<ChevronDown
					className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>

			{open && (
				<div className={PANEL}>
					<p className="px-3 pt-3 pb-2 text-[11px] text-gray-500 dark:text-gray-400">
						{t("navigator.help")}
					</p>
					<div className="max-h-[60vh] overflow-y-auto px-2 pb-2 space-y-0.5">
						<SectionRow
							section={fixedSection}
							draggable={false}
							onJump={() => jump(fixedSection.key)}
						/>
						<SortableList
							length={sections.length}
							onReorder={onReorder}
							renderItem={(idx) => (
								<SectionRow
									section={sections[idx]}
									draggable={sections.length > 1}
									onJump={() => jump(sections[idx].key)}
								/>
							)}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

function CompletenessIndicator({
	recommended,
	onJumpToField,
}: Pick<BuilderToolbarProps, "recommended" | "onJumpToField">) {
	const { t } = useLanguage();
	const { open, setOpen, ref } = useDropdown();
	const done = recommended.filter((field) => field.done).length;
	const total = recommended.length;
	const complete = done === total;

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				aria-expanded={open}
				className={TRIGGER}
			>
				<span
					className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold tabular-nums ${
						complete
							? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
							: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
					}`}
				>
					{done}/{total}
				</span>
				<span className="hidden sm:inline">{t("completeness.title")}</span>
			</button>

			{open && (
				<div className={PANEL}>
					<div className="px-3 pt-3 pb-2">
						<p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
							{complete ? t("completeness.complete") : t("completeness.title")}
						</p>
						<p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
							{t("completeness.help")}
						</p>
					</div>
					<ul className="px-2 pb-2 space-y-0.5">
						{recommended.map((field) => (
							<li key={field.key}>
								{field.done ? (
									<div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-400 dark:text-zinc-500">
										<Check className="w-4 h-4 text-emerald-500" />
										<span className="line-through">{t(field.labelKey)}</span>
									</div>
								) : (
									<button
										type="button"
										onClick={() => {
											setOpen(false);
											onJumpToField(field);
										}}
										className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-900/20"
									>
										<Circle className="w-4 h-4 text-amber-500" />
										<span className="flex-1">{t(field.labelKey)}</span>
										<ChevronRight className="w-3.5 h-3.5 text-gray-400" />
									</button>
								)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

/**
 * Picks the professional area of the form's examples. It sits with the form
 * tools rather than the CV actions, and says so in its panel, because it only
 * changes placeholders and labels — never the CV itself.
 */
function ExamplesPicker({
	examplesType,
	onExamplesTypeChange,
}: Pick<BuilderToolbarProps, "examplesType" | "onExamplesTypeChange">) {
	const { t } = useLanguage();
	const { open, setOpen, ref } = useDropdown();
	const area = t(`cv.type.${examplesType}`);

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				aria-expanded={open}
				aria-label={t("examples.current").replace("{area}", area)}
				title={t("examples.current").replace("{area}", area)}
				className={TRIGGER}
			>
				<CvTypeIcon type={examplesType} />
				<span className="hidden sm:inline">{t("examples.title")}</span>
				<ChevronDown
					className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>

			{open && (
				<div className={PANEL_END}>
					<div className="px-3 pt-3 pb-1">
						<p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
							{t("examples.selector")}
						</p>
						<p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
							{t("examples.help")}
						</p>
					</div>
					<div className="max-h-[60vh] overflow-y-auto px-1 pb-1">
						<CvTypeMenu
							value={examplesType}
							onSelect={(type) => {
								onExamplesTypeChange(type);
								setOpen(false);
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

/** "Saved at 14:32", refreshed every 30s, or a warning when saving failed. */
function SaveStatus({
	lastSavedAt,
	saveError,
}: Pick<BuilderToolbarProps, "lastSavedAt" | "saveError">) {
	const { t, language } = useLanguage();
	const [, setTick] = useState(0);

	useEffect(() => {
		const timer = window.setInterval(() => setTick((n) => n + 1), 30_000);
		return () => window.clearInterval(timer);
	}, []);

	if (saveError) {
		return (
			<span
				role="alert"
				title={t("save.status.error.help")}
				className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
			>
				<AlertTriangle className="w-4 h-4" />
				<span className="hidden sm:inline">{t("save.status.error")}</span>
			</span>
		);
	}

	if (!lastSavedAt) return null;

	const saved = new Date(lastSavedAt);
	const recent = Date.now() - saved.getTime() < 60_000;
	const label = recent
		? t("save.status.saved")
		: t("save.status.savedAt").replace(
				"{time}",
				saved.toLocaleTimeString(LOCALE_TAGS[language] ?? undefined, {
					hour: "2-digit",
					minute: "2-digit",
				}),
			);

	return (
		<span
			aria-live="polite"
			title={t("save.status.help")}
			className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
		>
			<CloudCheck className="w-4 h-4 text-emerald-500" />
			<span className="hidden sm:inline">{label}</span>
		</span>
	);
}

/**
 * The strip pinned above the form: where am I, what's missing, which examples
 * am I seeing, is it saved.
 *
 * These three answers used to be absent (saving was silent, completeness was
 * only reported after download, and a long CV had no overview), so they share
 * one compact, always-visible place instead of being scattered.
 */
export function BuilderToolbar(props: BuilderToolbarProps) {
	return (
		<div
			className={`sticky top-[4.5rem] z-30 -mx-1 flex items-center justify-between gap-2 px-2 py-1.5 ${FLOATING_SURFACE}`}
		>
			<div className="flex items-center gap-1">
				<SectionNavigator
					fixedSection={props.fixedSection}
					sections={props.sections}
					onJump={props.onJump}
					onReorder={props.onReorder}
				/>
				<CompletenessIndicator
					recommended={props.recommended}
					onJumpToField={props.onJumpToField}
				/>
			</div>
			<div className="flex items-center gap-2 pr-1.5">
				<ExamplesPicker
					examplesType={props.examplesType}
					onExamplesTypeChange={props.onExamplesTypeChange}
				/>
				<SaveStatus
					lastSavedAt={props.lastSavedAt}
					saveError={props.saveError}
				/>
			</div>
		</div>
	);
}
