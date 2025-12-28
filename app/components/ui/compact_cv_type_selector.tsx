"use client";

import {
	BarChart3,
	BookOpen,
	Building,
	Code,
	DollarSign,
	Heart,
	Package,
	Palette,
	TrendingUp,
	Users,
} from "lucide-react";
import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CVType } from "../../contexts/LanguageContext";
import { useLanguage } from "../../contexts/LanguageContext";

/**
 * Compact CV Type Selector component
 * A compact version of the CV type selector for use in the floating action bar.
 * Handles dropdown for CV type selection and displays icons for each type.
 */
export function CompactCVTypeSelector() {
	const { cvType, setCVType, t } = useLanguage();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Effect to close dropdown when clicking outside of it
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const getCVTypeIcon = useMemo(
		() => (type: string) => {
			const icons: Record<string, JSX.Element> = {
				development: <Code className="w-4 h-4" />,
				marketing: <BarChart3 className="w-4 h-4" />,
				sales: <TrendingUp className="w-4 h-4" />,
				hr: <Users className="w-4 h-4" />,
				finance: <DollarSign className="w-4 h-4" />,
				design: <Palette className="w-4 h-4" />,
				health: <Heart className="w-4 h-4" />,
				education: <BookOpen className="w-4 h-4" />,
				admin: <Building className="w-4 h-4" />,
				other: <Package className="w-4 h-4" />,
			};
			return icons[type as keyof typeof icons] || icons.other;
		},
		[],
	);

	const cvTypes: CVType[] = [
		"development",
		"marketing",
		"sales",
		"hr",
		"finance",
		"design",
		"health",
		"education",
		"admin",
		"other",
	];

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-2 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
				title={t("cv.type.selector")}
				aria-expanded={isOpen}
			>
				{getCVTypeIcon(cvType)}
			</button>

			{isOpen && (
				<div className="absolute bottom-full mb-2 right-0 w-56 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-1 z-50">
					{cvTypes.map((type) => (
						<button
							key={type}
							type="button"
							onClick={() => {
								setCVType(type);
								setIsOpen(false);
							}}
							className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors ${
								cvType === type
									? "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 font-semibold"
									: "text-gray-700 dark:text-gray-300"
							}`}
						>
							<span className="flex-shrink-0">{getCVTypeIcon(type)}</span>
							<span className="whitespace-nowrap">{t(`cv.type.${type}`)}</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
