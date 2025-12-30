"use client";

import { Github, Heart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";

/**
 * Footer component for the EasyPeasyCV application
 * Displays copyright information and links
 * @returns JSX element representing the application footer
 */
export function Footer() {
	const { t, locale } = useLanguage();

	return (
		<footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 py-6 transition-colors duration-300">
			<div className="w-full px-4 sm:px-6">
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
					{/* Copyright section - Left */}
					<div className="text-center sm:text-left">
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							© 2025 EasyPeasyCV.
						</p>
					</div>

					{/* Support and GitHub links - Center */}
					<div className="flex items-center gap-4">
						<a
							href="https://ko-fi.com/easypeasycv"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-300 text-sm"
						>
							<Heart className="w-5 h-5" fill="currentColor" />
							<span>{t("landing.opensource.support.button")}</span>
						</a>
						<a
							href="https://github.com/goncalojbsousa/cv-builder"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300 text-sm"
						>
							<Github className="w-5 h-5" fill="currentColor" />
							<span>{t("landing.view.github.button")}</span>
						</a>
					</div>

					{/* Privacy and Terms links - Right */}
					<div className="flex items-center gap-4">
						<Link
							href={`/${locale}/privacy`}
							className="text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-300 text-sm"
						>
							{t("footer.privacy")}
						</Link>
						<Link
							href={`/${locale}/terms`}
							className="text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-300 text-sm"
						>
							{t("footer.terms")}
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
