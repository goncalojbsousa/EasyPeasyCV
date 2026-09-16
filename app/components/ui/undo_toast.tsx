"use client";

import { RotateCcw, X } from "lucide-react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useLanguage } from "../../contexts/LanguageContext";

const UNDO_WINDOW_MS = 6000;

interface PendingUndo {
	id: number;
	message: string;
	undo: () => void;
}

/**
 * A transient "Removed · Undo" toast.
 *
 * Removing an entry is a single click, so it is made reversible instead of
 * being guarded by a confirmation dialog: the common case stays fast and a
 * mistake costs one more click to fix.
 */
export function useUndoToast() {
	const { t } = useLanguage();
	const [pending, setPending] = useState<PendingUndo | null>(null);
	const counter = useRef(0);

	useEffect(() => {
		if (!pending) return;
		const timer = window.setTimeout(() => setPending(null), UNDO_WINDOW_MS);
		return () => window.clearTimeout(timer);
	}, [pending]);

	const showUndo = useCallback((message: string, undo: () => void) => {
		counter.current += 1;
		setPending({ id: counter.current, message, undo });
	}, []);

	const toast: ReactNode = (
		<output
			aria-live="polite"
			className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-start px-4 sm:justify-center"
		>
			{pending && (
				<div
					key={pending.id}
					// Dark in both themes on purpose: the toast often floats over the
					// white paper of the live preview, where a light surface vanishes.
					// In dark mode it is lifted a step above the cards and outlined so
					// it also stands out over the form.
					className="pointer-events-auto flex items-center gap-3 rounded-lg bg-gray-900 dark:bg-zinc-700 text-white ring-1 ring-black/10 dark:ring-white/25 shadow-[0_10px_40px_rgba(0,0,0,0.45)] pl-4 pr-2 py-2 text-sm max-w-[calc(100vw-6rem)]"
				>
					<span className="truncate">{pending.message}</span>
					<button
						type="button"
						onClick={() => {
							pending.undo();
							setPending(null);
						}}
						className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold text-sky-300 hover:bg-white/10 transition-colors"
					>
						<RotateCcw className="w-4 h-4" />
						{t("undo.action")}
					</button>
					<button
						type="button"
						onClick={() => setPending(null)}
						aria-label={t("close")}
						className="rounded-md p-1 text-gray-300 hover:bg-white/10 transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			)}
		</output>
	);

	return { showUndo, toast };
}
