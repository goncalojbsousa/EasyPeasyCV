"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAnchorPosition } from "../../utils/useAnchorPosition";

const TRIGGER_BASE =
	"flex h-9 items-center gap-2 px-3 rounded-md shrink-0 shadow-sm";

const TRIGGER_VARIANTS = {
	plain:
		"border border-gray-300/60 dark:border-zinc-600/60 bg-white/80 dark:bg-zinc-800/80 text-[13px] text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-zinc-700",
	primary:
		"bg-sky-600 text-white px-3 text-[15px] font-semibold hover:bg-sky-700 active:bg-sky-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ring-1 ring-sky-500/20",
} as const;

interface PopoverMenuProps {
	/** Whether this menu's panel is showing */
	open: boolean;
	/** Called with the next open state when the trigger or the outside is clicked */
	onOpenChange: (open: boolean) => void;
	/** Icon shown inside the trigger */
	icon: ReactNode;
	/** Trigger text, also used as its tooltip */
	label: string;
	/** Heading shown at the top of the panel; defaults to `label` */
	panelTitle?: string;
	/** Tailwind width/height classes for the panel */
	panelClassName?: string;
	variant?: keyof typeof TRIGGER_VARIANTS;
	disabled?: boolean;
	/** Explains why the trigger is disabled, shown as its tooltip */
	disabledReason?: string;
	children: ReactNode;
}

/**
 * Trigger button plus a panel anchored above it, portalled to `document.body`
 * so it escapes the action bar's overflow clipping.
 *
 * Every menu in the desktop action bar is one of these, which is why the
 * anchoring, outside-click handling and panel chrome live here rather than
 * being repeated per menu.
 */
export function PopoverMenu({
	open,
	onOpenChange,
	icon,
	label,
	panelTitle,
	panelClassName = "w-[260px] max-h-[60vh] overflow-auto",
	variant = "plain",
	disabled = false,
	disabledReason,
	children,
}: PopoverMenuProps) {
	const triggerRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const position = useAnchorPosition(triggerRef, open);

	useEffect(() => {
		if (!open) return;

		const onPointerDown = (event: Event) => {
			const target = event.target as Node | null;
			if (!target) return;
			const path =
				typeof event.composedPath === "function" ? event.composedPath() : [];
			const contains = (node: Node | null) =>
				!!node && (path.includes(node) || node.contains(target));

			// The color picker also portals to the body, so clicks inside it must
			// not be treated as outside clicks.
			const inColorPicker =
				target instanceof Element &&
				target.closest('[data-color-selector-portal="true"]');

			if (
				!contains(triggerRef.current) &&
				!contains(panelRef.current) &&
				!inColorPicker
			) {
				onOpenChange(false);
			}
		};

		document.addEventListener("pointerdown", onPointerDown, true);
		return () =>
			document.removeEventListener("pointerdown", onPointerDown, true);
	}, [open, onOpenChange]);

	return (
		<div
			className="relative shrink-0 overflow-visible"
			// Disabled buttons do not reliably show their own tooltip, so the reason
			// sits on the wrapper.
			title={disabled ? disabledReason : undefined}
		>
			<button
				type="button"
				ref={triggerRef}
				disabled={disabled}
				onClick={(e) => {
					e.stopPropagation();
					onOpenChange(!open);
				}}
				className={`${TRIGGER_BASE} ${TRIGGER_VARIANTS[variant]}`}
				title={disabled ? undefined : label}
			>
				{icon}
				<span className="font-medium">{label}</span>
				<ChevronDown
					className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>

			{open &&
				position &&
				createPortal(
					// biome-ignore lint/a11y/noStaticElementInteractions: Portal container needs to prevent event propagation
					<div
						ref={panelRef}
						role="presentation"
						className={`z-[90] bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2 ${panelClassName}`}
						onMouseDown={(e) => e.stopPropagation()}
						onClick={(e) => e.stopPropagation()}
						style={{
							position: "fixed",
							left: position.left,
							top: position.top - 8,
							transform: "translateY(-100%)",
						}}
					>
						<div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">
							{panelTitle ?? label}
						</div>
						{children}
					</div>,
					document.body,
				)}
		</div>
	);
}

/** A row inside a popover/sheet menu. */
export function MenuItem({
	icon,
	children,
	onClick,
	selected = false,
}: {
	icon?: ReactNode;
	children: ReactNode;
	onClick: () => void;
	selected?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors duration-200 hover:bg-sky-50 dark:hover:bg-sky-900/20 ${
				selected
					? "bg-sky-50 dark:bg-sky-900/20 font-semibold text-sky-700 dark:text-sky-400"
					: "text-gray-700 dark:text-gray-300"
			}`}
		>
			{icon}
			<span className="font-medium text-sm">{children}</span>
		</button>
	);
}
