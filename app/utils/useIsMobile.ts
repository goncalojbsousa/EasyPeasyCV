"use client";

import { useEffect, useState } from "react";

/** Tailwind breakpoints used by the app, so callers never hardcode pixel values. */
export const BREAKPOINTS = { md: 768, lg: 1024 } as const;

/**
 * Tracks whether the viewport is narrower than `breakpoint`.
 * Returns `false` during SSR and on the first client render, matching the
 * previous per-component implementations.
 */
export function useIsMobile(breakpoint: number = BREAKPOINTS.md): boolean {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < breakpoint);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, [breakpoint]);

	return isMobile;
}
