"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
import { ThemeToggle } from "../theme-toggle";
import { LanguageSelector } from "../ui/language_selector";
import { Github, Heart } from "lucide-react";

/**
 * Navbar component
 * Reusable navigation bar with logo, language selector, and theme toggle
 * Handles navigation and theme/language switching for the app
 * @returns JSX element representing the navigation bar
 */
export function Navbar() {
	const { t } = useLanguage();

	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/80 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-zinc-900/50 transition-colors">
			<div className="w-full px-4 sm:px-6 py-3 flex justify-between items-center">
				<div className="flex items-center gap-3">
					<Link href="/" className="flex items-center gap-3">
						<Image
							src="/logo.svg"
							alt="EasyPeasyCV Logo"
							width={40}
							height={40}
							className="w-10 h-10 object-contain"
							priority
						/>
						<div className="hidden md:block">
							<h1 className="text-2xl font-bold text-sky-600">
								{t("app.title")}
							</h1>
						</div>
					</Link>
				</div>
				<div className="flex items-center gap-3">
					<LanguageSelector />
					<a
						href="https://ko-fi.com/easypeasycv"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
						title="Support on Ko-fi"
					>
						<Heart className="w-5 h-5" fill="currentColor" />
					</a>
					<a
						href="https://github.com/goncalojbsousa/cv-builder"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
						title="GitHub Repository"
					>
						<Github className="w-5 h-5" fill="currentColor" />
					</a>
					<div className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900">
						<ThemeToggle />
					</div>
				</div>
			</div>
		</header>
	);
}
