import { useCallback, useEffect, useRef } from "react";

/**
 * Hook personalizado para auto-redimensionar textareas conforme o conteúdo
 * @param minHeight - Altura mínima em pixels (padrão: 120)
 * @param maxHeight - Altura máxima em pixels (opcional)
 * @returns objeto com ref e função de resize
 */
export function useAutoResize(minHeight = 120, maxHeight?: number) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const adjustHeight = useCallback(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		// Reset height to auto to get the correct scrollHeight
		textarea.style.height = "auto";

		// Calculate new height
		let newHeight = Math.max(textarea.scrollHeight, minHeight);

		// Apply max height if specified
		if (maxHeight) {
			newHeight = Math.min(newHeight, maxHeight);
		}

		// Set the new height
		textarea.style.height = `${newHeight}px`;
	}, [minHeight, maxHeight]);

	useEffect(() => {
		adjustHeight();
	}, [adjustHeight]);

	return { textareaRef, adjustHeight };
}
