"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface BottomSheetProps {
	show: boolean;
	title: string;
	onClose: () => void;
	children: ReactNode;
	/** Tailwind max-width for the panel */
	maxWidthClassName?: string;
}

/**
 * Mobile modal that slides up from the bottom of the screen (centred from `sm`
 * upwards). Used to present the same menus the desktop bar shows in popovers.
 */
export function BottomSheet({
	show,
	title,
	onClose,
	children,
	maxWidthClassName = "max-w-2xl",
}: BottomSheetProps) {
	useEffect(() => {
		if (!show) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [show, onClose]);

	if (!show) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
				aria-label={title}
			/>
			<div
				className={`relative z-10 bg-white dark:bg-zinc-800 rounded-t-2xl sm:rounded-2xl w-full ${maxWidthClassName} max-h-[90vh] overflow-y-auto shadow-2xl`}
				role="dialog"
				aria-modal="true"
			>
				<div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						{title}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
						aria-label={title}
					>
						<X className="w-5 h-5" />
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}
