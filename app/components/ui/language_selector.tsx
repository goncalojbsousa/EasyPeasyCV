"use client";

import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useDismissable } from "../../utils/useDismissable";
import { FlagIcon, LANGUAGE_OPTIONS } from "./flags";

/**
 * Language Selector component
 * Switches the UI language. The list of languages and their flags come from
 * the shared `flags` module, so this menu stays in sync with the PDF language
 * menus in the action bars.
 */
export function LanguageSelector() {
	const { language, setLanguage, t } = useLanguage();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useDismissable(dropdownRef, isOpen, () => setIsOpen(false));

	const current =
		LANGUAGE_OPTIONS.find((option) => option.code === language) ??
		LANGUAGE_OPTIONS[0];

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-300"
				title={t("select.language.label")}
			>
				<FlagIcon code={current.code} className="w-5 h-5 sm:w-6 sm:h-6" />
				<span className="hidden sm:inline text-sm font-medium">
					{t(current.labelKey)}
				</span>
				<ChevronDown
					className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-2 z-50">
					<div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-700">
						{t("select.language.label")}
					</div>
					<div className="py-1">
						{LANGUAGE_OPTIONS.map((option) => (
							<button
								key={option.code}
								type="button"
								onClick={() => {
									setLanguage(option.code);
									setIsOpen(false);
								}}
								className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-300 ${
									language === option.code
										? "bg-sky-50 dark:bg-sky-900/20 font-semibold text-sky-700 dark:text-sky-400"
										: ""
								}`}
							>
								<FlagIcon
									code={option.code}
									className="w-5 h-5 sm:w-6 sm:h-6"
								/>
								<span className="font-medium text-sm sm:text-base">
									{t(option.labelKey)}
								</span>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
