"use client";

import { type RefObject, useEffect } from "react";

/**
 * Closes a dropdown when the user clicks outside `ref` or presses Escape.
 * Only active while `open` is true.
 *
 * Every dropdown in the app needs this, so the listener registration lives
 * here rather than being re-implemented (slightly differently) in each one.
 */
export function useDismissable(
	ref: RefObject<HTMLElement | null>,
	open: boolean,
	onDismiss: () => void,
) {
	useEffect(() => {
		if (!open) return;

		const handlePointerDown = (event: MouseEvent) => {
			if (!ref.current?.contains(event.target as Node)) onDismiss();
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onDismiss();
		};

		// Capture phase, so the dropdown closes before other handlers run.
		document.addEventListener("mousedown", handlePointerDown, true);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("mousedown", handlePointerDown, true);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [ref, open, onDismiss]);
}
