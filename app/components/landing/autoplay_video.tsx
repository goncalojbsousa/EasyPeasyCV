"use client";

import { useEffect, useRef } from "react";

/**
 * A silent, looping demo video that only plays while it is on screen, and not
 * at all for visitors who asked the system to reduce motion (they see its
 * first frame instead).
 */
export function AutoplayVideo({
	src,
	poster,
	label,
}: {
	src: string;
	poster?: string;
	label: string;
}) {
	const ref = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = ref.current;
		if (!video) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					video.play().catch(() => {
						// Autoplay refused (e.g. data saver): the first frame stays visible
					});
				} else {
					video.pause();
				}
			},
			{ threshold: 0.25 },
		);
		observer.observe(video);
		return () => observer.disconnect();
	}, []);

	return (
		<video
			ref={ref}
			className="h-full w-full object-cover object-top"
			src={src}
			poster={poster}
			muted
			loop
			playsInline
			preload="metadata"
			aria-label={label}
		/>
	);
}
