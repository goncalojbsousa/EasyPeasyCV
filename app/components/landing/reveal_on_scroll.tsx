"use client";

import { useEffect } from "react";

/** Gap between elements that come into view together, e.g. a grid row. */
const STAGGER_MS = 80;

/**
 * Plays the `.reveal` entrance of each element once, when it scrolls into view.
 *
 * The page renders fully visible: elements are only hidden after this runs
 * (by the `reveal-ready` class on <html>), so content never depends on
 * JavaScript. Anything already above the viewport — e.g. after the browser
 * restores a scroll position — is shown at once instead of staying hidden.
 * Visitors who reduce motion get no animation at all (see globals.css).
 *
 * A reload also starts the page from the top: the entrances read as a
 * sequence, and landing mid-page on refresh felt like a glitch.
 */
export function RevealOnScroll() {
	useEffect(() => {
		const root = document.documentElement;
		const previousRestoration = history.scrollRestoration;
		history.scrollRestoration = "manual";
		const navigation = performance.getEntriesByType("navigation")[0] as
			| PerformanceNavigationTiming
			| undefined;
		const toTop = () => window.scrollTo({ top: 0, behavior: "instant" });
		const isReload = navigation?.type === "reload";
		if (isReload) {
			toTop();
			// The browser may still restore the old position once loading ends
			if (document.readyState !== "complete") {
				window.addEventListener("load", toTop, { once: true });
			}
		}

		const reveal = (element: Element, delay: number) => {
			(element as HTMLElement).style.transitionDelay = `${delay}ms`;
			element.classList.add("is-visible");
		};

		const observer = new IntersectionObserver(
			(entries) => {
				let staggered = 0;
				for (const entry of entries) {
					const above = entry.boundingClientRect.bottom < 0;
					if (!entry.isIntersecting && !above) continue;
					observer.unobserve(entry.target);
					reveal(entry.target, above ? 0 : staggered++ * STAGGER_MS);
				}
			},
			{ rootMargin: "0px 0px -10% 0px" },
		);

		for (const element of document.querySelectorAll(".reveal")) {
			observer.observe(element);
		}
		root.classList.add("reveal-ready");

		return () => {
			observer.disconnect();
			window.removeEventListener("load", toTop);
			root.classList.remove("reveal-ready");
			history.scrollRestoration = previousRestoration;
		};
	}, []);

	return null;
}
