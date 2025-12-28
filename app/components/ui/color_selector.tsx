import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { CvColor } from "../../types/cv";

/**
 * Props for the ColorSelector component.
 */
interface ColorSelectorProps {
	id?: string;
	selectedColor: CvColor;
	onColorChange: (color: CvColor) => void;
	show?: boolean; // Controls visibility of the selector
}

/**
 * Color configuration for each available color option.
 * Includes both Portuguese and English names for translation.
 */
const colors: Record<
	CvColor,
	{
		name: string;
		nameEn: string;
		primary: string;
		secondary: string;
		accent: string;
	}
> = {
	blue: {
		name: "Azul",
		nameEn: "Blue",
		primary: "#3b82f6",
		secondary: "#1e40af",
		accent: "#dbeafe",
	},
	green: {
		name: "Verde",
		nameEn: "Green",
		primary: "#10b981",
		secondary: "#059669",
		accent: "#d1fae5",
	},
	purple: {
		name: "Roxo",
		nameEn: "Purple",
		primary: "#8b5cf6",
		secondary: "#7c3aed",
		accent: "#ede9fe",
	},
	orange: {
		name: "Laranja",
		nameEn: "Orange",
		primary: "#f59e0b",
		secondary: "#d97706",
		accent: "#fed7aa",
	},
	red: {
		name: "Vermelho",
		nameEn: "Red",
		primary: "#ef4444",
		secondary: "#dc2626",
		accent: "#fecaca",
	},
	teal: {
		name: "Verde-azulado",
		nameEn: "Teal",
		primary: "#14b8a6",
		secondary: "#0d9488",
		accent: "#ccfbf1",
	},
	indigo: {
		name: "Índigo",
		nameEn: "Indigo",
		primary: "#6366f1",
		secondary: "#4f46e5",
		accent: "#e0e7ff",
	},
	pink: {
		name: "Rosa",
		nameEn: "Pink",
		primary: "#ec4899",
		secondary: "#db2777",
		accent: "#fce7f3",
	},
};

/**
 * ColorSelector component allows users to select a color theme for the CV.
 * Handles dropdown for color selection and displays color options with translated names.
 * Closes dropdown when clicking outside.
 */
export function ColorSelector({
	id,
	selectedColor,
	onColorChange,
	show = true,
}: ColorSelectorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { language } = useLanguage();
	const containerRef = useRef<HTMLDivElement>(null);

	// Effect to close dropdown when clicking outside
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (containerRef.current && !containerRef.current.contains(target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside, true);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside, true);
		};
	}, [isOpen]);

	// Handles color selection and closes the dropdown
	const handleColorSelect = (color: CvColor) => {
		onColorChange(color);
		setIsOpen(false);
	};

	// Don't render if show is false
	if (!show) {
		return null;
	}

	return (
		<div id={id} className="relative w-full" ref={containerRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all text-left text-sm text-gray-900 dark:text-gray-100"
			>
				<div className="flex items-center gap-2">
					<div
						className="w-3 h-3 rounded-full border border-gray-300 dark:border-zinc-500"
						style={{ backgroundColor: colors[selectedColor].primary }}
					/>
					<span>
						{language === "en"
							? colors[selectedColor].nameEn
							: colors[selectedColor].name}
					</span>
				</div>
				<ChevronDown
					className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute left-0 mt-2 w-full bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 z-50">
					<div className="max-h-64 overflow-y-auto py-1">
						{Object.entries(colors).map(([colorKey, colorData]) => (
							<button
								key={colorKey}
								type="button"
								onClick={() => handleColorSelect(colorKey as CvColor)}
								className={`w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 flex items-center gap-2 ${
									selectedColor === colorKey
										? "bg-sky-50 dark:bg-sky-900/20 font-semibold text-sky-700 dark:text-sky-400"
										: ""
								}`}
							>
								<div
									className="w-3 h-3 rounded-full border border-gray-300 dark:border-zinc-500"
									style={{ backgroundColor: colorData.primary }}
								/>
								<span className="text-sm">
									{language === "en" ? colorData.nameEn : colorData.name}
								</span>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
