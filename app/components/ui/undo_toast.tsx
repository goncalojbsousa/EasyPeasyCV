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
					className="pointer-events-auto flex items-center gap-3 rounded-lg bg-gray-900 dark:bg-zinc-100 text-white dark:text-gray-900 shadow-2xl pl-4 pr-2 py-2 text-sm max-w-[calc(100vw-6rem)]"
				>
					<span className="truncate">{pending.message}</span>
					<button
						type="button"
						onClick={() => {
							pending.undo();
							setPending(null);
						}}
						className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold text-sky-300 dark:text-sky-700 hover:bg-white/10 dark:hover:bg-black/5 transition-colors"
					>
						<RotateCcw className="w-4 h-4" />
						{t("undo.action")}
					</button>
					<button
						type="button"
						onClick={() => setPending(null)}
						aria-label={t("close")}
						className="rounded-md p-1 text-gray-400 dark:text-gray-500 hover:bg-white/10 dark:hover:bg-black/5 transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			)}
		</output>
	);

	return { showUndo, toast };
}
