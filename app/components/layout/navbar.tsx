"use client";

import { ArrowRight, Github, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { ThemeToggle } from "../theme-toggle";
import { LanguageSelector } from "../ui/language_selector";

/** Id of the page's own call to action, which the navbar's button stands in for. */
export const PAGE_CTA_ID = "page-cta";

/**
 * True once the element with `PAGE_CTA_ID` has scrolled out of view, so the
 * navbar only offers the call to action when the page's own one is not on
 * screen. Without such an element the button is always shown.
 */
function usePageCtaHidden(enabled: boolean): boolean {
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		if (!enabled) return;
		const target = document.getElementById(PAGE_CTA_ID);
		if (!target) {
			setHidden(true);
			return;
		}
		const observer = new IntersectionObserver(([entry]) =>
			setHidden(!entry.isIntersecting),
		);
		observer.observe(target);
		return () => observer.disconnect();
	}, [enabled]);

	return hidden;
}

/**
 * Navigation bar with logo, language selector and theme toggle.
 *
 * `builderCta` adds a "create my CV" button, used on marketing pages; it
 * appears once the page's own button has scrolled away.
 */
export function Navbar({ builderCta = false }: { builderCta?: boolean }) {
	const { t, language } = useLanguage();
	const showCta = usePageCtaHidden(builderCta) && builderCta;
	// On phones the button needs the room of the support and GitHub links, which
	// the page repeats further down.
	const secondaryLink = builderCta ? "hidden sm:inline-flex" : "inline-flex";

	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/80 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-zinc-900/50 transition-colors">
			{/* First focusable element, so keyboard users can bypass the navbar */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
			>
				{t("a11y.skipToContent")}
			</a>
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
					{builderCta && (
						<Link
							href={`/${language}/builder`}
							inert={!showCta}
							aria-hidden={!showCta}
							className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-sky-600 px-3 sm:px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 transition-[opacity,translate,background-color] duration-200 motion-reduce:transition-none ${
								showCta
									? "opacity-100 translate-y-0"
									: "pointer-events-none opacity-0 -translate-y-1"
							}`}
						>
							{t("home.cta")}
							<ArrowRight aria-hidden="true" className="h-4 w-4" />
						</Link>
					)}
					<LanguageSelector />
					<a
						href="https://ko-fi.com/easypeasycv"
						target="_blank"
						rel="noopener noreferrer"
						className={`${secondaryLink} h-10 w-10 items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900`}
						title="Support on Ko-fi"
					>
						<Heart className="w-5 h-5" fill="currentColor" />
					</a>
					<a
						href="https://github.com/goncalojbsousa/EasyPeasyCV"
						target="_blank"
						rel="noopener noreferrer"
						className={`${secondaryLink} h-10 w-10 items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900`}
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
