"use client";

import {
	ArrowDown,
	ArrowUp,
	ChevronDown,
	ChevronRight,
	MoreHorizontal,
	Palette,
	Trash2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { SectionControlProps } from "../../types/cv";
import { useDismissable } from "../../utils/useDismissable";

interface FormSectionProps extends SectionControlProps {
	/** Title text for the section */
	title: string;
	/** Icon element to display next to the title */
	icon: ReactNode;
	/** Child elements to render inside the section */
	children: ReactNode;
}

interface MenuAction {
	key: string;
	label: string;
	icon: ReactNode;
	onSelect: () => void;
	disabled?: boolean;
	danger?: boolean;
}

/**
 * Secondary section actions (style, reorder, remove) behind one "⋯" button.
 *
 * The header used to grow a new icon button per capability; a menu keeps the
 * header calm and leaves room for future actions without crowding it.
 */
function SectionMenu({ actions }: { actions: MenuAction[] }) {
	const { t } = useLanguage();
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	useDismissable(containerRef, open, () => setOpen(false));

	return (
		<div className="relative" ref={containerRef}>
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				aria-haspopup="menu"
				aria-expanded={open}
				aria-label={t("section.menu")}
				title={t("section.menu")}
				className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
			>
				<MoreHorizontal className="h-5 w-5" />
			</button>

			{open && (
				<div
					role="menu"
					className="absolute right-0 top-full mt-1 z-40 min-w-[210px] rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-xl py-1"
				>
					{actions.map((action) => (
						<button
							key={action.key}
							type="button"
							role="menuitem"
							disabled={action.disabled}
							onClick={() => {
								setOpen(false);
								action.onSelect();
							}}
							className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
								action.danger
									? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
									: "text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-900/20"
							}`}
						>
							{action.icon}
							{action.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

/**
 * FormSection provides the shared chrome of every builder form section: a
 * collapsible header with the section's secondary actions, and the body.
 */
export function FormSection({
	title,
	icon,
	children,
	canReorder = false,
	onMoveUp,
	onMoveDown,
	canMoveUp = true,
	canMoveDown = true,
	onOpenStyle,
	onRemove,
	collapsed: controlledCollapsed,
	onToggleCollapsed,
}: FormSectionProps) {
	const { t } = useLanguage();
	const [localCollapsed, setLocalCollapsed] = useState(false);
	const collapsed = controlledCollapsed ?? localCollapsed;
	const toggleCollapsed =
		onToggleCollapsed ?? (() => setLocalCollapsed((value) => !value));

	const actions: MenuAction[] = [];
	if (onOpenStyle) {
		actions.push({
			key: "style",
			label: t("design.section.customise"),
			icon: <Palette className="h-4 w-4" />,
			onSelect: onOpenStyle,
		});
	}
	if (canReorder) {
		actions.push(
			{
				key: "up",
				label: t("section.move.up"),
				icon: <ArrowUp className="h-4 w-4" />,
				onSelect: () => onMoveUp?.(),
				disabled: !canMoveUp,
			},
			{
				key: "down",
				label: t("section.move.down"),
				icon: <ArrowDown className="h-4 w-4" />,
				onSelect: () => onMoveDown?.(),
				disabled: !canMoveDown,
			},
		);
	}
	if (onRemove) {
		actions.push({
			key: "remove",
			label: t("custom.section.remove"),
			icon: <Trash2 className="h-4 w-4" />,
			onSelect: onRemove,
			danger: true,
		});
	}

	return (
		<div
			className={`w-full bg-white dark:bg-zinc-800 border border-gray-200/80 dark:border-zinc-700/60 shadow-sm transition-colors duration-300 ${
				collapsed ? "rounded-t-xl" : "rounded-xl"
			}`}
		>
			<div
				className={`bg-gray-50 dark:bg-zinc-900 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200/80 dark:border-zinc-700/60 transition-colors duration-300 ${
					collapsed ? "rounded-xl" : "rounded-t-xl"
				}`}
			>
				<div className="flex justify-between items-center gap-3">
					<div className="flex items-center gap-2 min-w-0">
						<button
							type="button"
							onClick={toggleCollapsed}
							aria-expanded={!collapsed}
							aria-label={
								collapsed ? t("section.expand") : t("section.collapse")
							}
							title={collapsed ? t("section.expand") : t("section.collapse")}
							className="mr-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
						>
							{collapsed ? (
								<ChevronRight className="h-5 w-5" />
							) : (
								<ChevronDown className="h-5 w-5" />
							)}
						</button>
						<h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200 min-w-0">
							<span className="text-sky-600 shrink-0">{icon}</span>
							<span className="truncate">{title}</span>
						</h2>
					</div>

					{actions.length > 0 && <SectionMenu actions={actions} />}
				</div>
			</div>

			{!collapsed && <div className="p-4 sm:p-6">{children}</div>}
		</div>
	);
}
