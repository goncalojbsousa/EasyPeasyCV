"use client";

import { CheckCircle2, RotateCcw, X } from "lucide-react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useLanguage } from "../../contexts/LanguageContext";

const UNDO_WINDOW_MS = 6000;
const NOTICE_MS = 4000;

interface Toast {
	id: number;
	message: string;
	/** Present for a reversible action: the toast offers "Undo" */
	undo?: () => void;
}

/**
 * The builder's single transient message: a confirmation ("Data loaded") or a
 * reversible action ("Removed · Undo").
 *
 * It floats above the page instead of sitting in the layout, so it never
 * pushes the form around, and it stays in view wherever the user has scrolled.
 * Removing an entry is a single click, so it is made reversible here instead
 * of being guarded by a confirmation dialog.
 */
export function useToast() {
	const { t } = useLanguage();
	const [current, setCurrent] = useState<Toast | null>(null);
	const counter = useRef(0);

	useEffect(() => {
		if (!current) return;
		const timer = window.setTimeout(
			() => setCurrent(null),
			current.undo ? UNDO_WINDOW_MS : NOTICE_MS,
		);
		return () => window.clearTimeout(timer);
	}, [current]);

	const show = useCallback((message: string, undo?: () => void) => {
		counter.current += 1;
		setCurrent({ id: counter.current, message, undo });
	}, []);

	const showUndo = useCallback(
		(message: string, undo: () => void) => show(message, undo),
		[show],
	);
	const showNotice = useCallback((message: string) => show(message), [show]);

	const toast: ReactNode = (
		<output
			aria-live="polite"
			className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-start px-4 sm:justify-center"
		>
			{current && (
				<div
					key={current.id}
					// Dark in both themes on purpose: the toast often floats over the
					// white paper of the live preview, where a light surface vanishes.
					// In dark mode it is lifted a step above the cards and outlined so
					// it also stands out over the form.
					className="pointer-events-auto flex items-center gap-3 rounded-lg bg-gray-900 dark:bg-zinc-700 text-white ring-1 ring-black/10 dark:ring-white/25 shadow-[0_10px_40px_rgba(0,0,0,0.45)] pl-4 pr-2 py-2 text-sm max-w-[calc(100vw-6rem)]"
				>
					{!current.undo && (
						<CheckCircle2
							aria-hidden="true"
							className="w-4 h-4 shrink-0 text-emerald-400"
						/>
					)}
					<span className="line-clamp-2">{current.message}</span>
					{current.undo && (
						<button
							type="button"
							onClick={() => {
								current.undo?.();
								setCurrent(null);
							}}
							className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold text-sky-300 hover:bg-white/10 transition-colors"
						>
							<RotateCcw className="w-4 h-4" />
							{t("undo.action")}
						</button>
					)}
					<button
						type="button"
						onClick={() => setCurrent(null)}
						aria-label={t("close")}
						className="rounded-md p-1 text-gray-300 hover:bg-white/10 transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			)}
		</output>
	);

	return { showUndo, showNotice, toast };
}
