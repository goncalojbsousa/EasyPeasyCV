"use client";

import type { InputHTMLAttributes } from "react";

/**
 * The single definition of the app's form control appearance.
 * Exported so the few controls that cannot be a `<TextInput>` (selects,
 * textareas, date pickers) can still share the exact same look.
 */
export const FIELD_CLASS =
	"w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100";

/**
 * Standard single-line form input. Replaces the copies of `FIELD_CLASS` that
 * were previously pasted into every form section.
 */
export function TextInput({
	className = "",
	type = "text",
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			type={type}
			className={className ? `${FIELD_CLASS} ${className}` : FIELD_CLASS}
			{...props}
		/>
	);
}
