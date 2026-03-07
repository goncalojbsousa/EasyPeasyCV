"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type ScrollRevealProps = {
	children: ReactNode;
	className?: string;
	/** Delay before animating (ms). Use with stagger children. */
	delay?: number;
	/** Amount of vertical offset when hidden (Tailwind translate value, e.g. 4 = 1rem) */
	offset?: 4 | 6 | 8 | 12;
	/** Fraction of element that must be visible to trigger (0–1) */
	threshold?: number;
};

const offsetToClass = {
	4: "translate-y-4",
	6: "translate-y-6",
	8: "translate-y-8",
	12: "translate-y-12",
};

export function ScrollReveal({
	children,
	className = "",
	delay = 0,
	offset = 6,
	threshold = 0.1,
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);
	const translateClass = offsetToClass[offset];

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (!entry?.isIntersecting) return;
				observer.disconnect();
				if (delay > 0) {
					timeoutId = setTimeout(() => setVisible(true), delay);
				} else {
					setVisible(true);
				}
			},
			{ threshold, rootMargin: "0px 0px -40px 0px" },
		);

		observer.observe(el);
		return () => {
			observer.disconnect();
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [threshold, delay]);

	return (
		<div
			ref={ref}
			className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : `opacity-0 ${translateClass}`} ${className}`}
		>
			{children}
		</div>
	);
}
