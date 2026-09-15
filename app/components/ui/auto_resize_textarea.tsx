"use client";

import type { TextareaHTMLAttributes } from "react";
import { useAutoResize } from "../../utils/useAutoResize";
import { FIELD_CLASS } from "./text_input";

interface AutoResizeTextareaProps
	extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	minHeight?: number;
	maxHeight?: number;
}

/**
 * Textarea component that automatically resizes based on content.
 * Carries the shared form control appearance, so callers only pass a
 * `className` when they need something on top of it.
 */
export function AutoResizeTextarea({
	value,
	onChange,
	minHeight = 80,
	maxHeight,
	className = "",
	...props
}: AutoResizeTextareaProps) {
	const { textareaRef, adjustHeight } = useAutoResize(minHeight, maxHeight);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e);
		adjustHeight();
	};

	return (
		<textarea
			ref={textareaRef}
			value={value}
			onChange={handleChange}
			className={`${FIELD_CLASS} ${className} resize-none overflow-hidden`}
			{...props}
		/>
	);
}
