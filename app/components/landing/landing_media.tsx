import Image from "next/image";
import type { ReactNode } from "react";
import { AutoplayVideo } from "./autoplay_video";

/** Media shown on the landing page, declared once so each file has one path. */

export interface LandingAsset {
	/** Path under /public */
	src: string;
	kind: "image" | "video";
	/** Poster shown before a video plays */
	poster?: string;
}

/** A CV page in the style switcher, named by the style it shows. */
export interface StyleAsset extends LandingAsset {
	labelKey: string;
}

export const LANDING_MEDIA = {
	hero: {
		src: "/landing/hero.mp4",
		poster: "/landing/hero-poster.webp",
		kind: "video",
	},
	/** The downloadable result, one page per style; the first is shown first. */
	styles: [
		{
			src: "/classic_preview.webp",
			kind: "image",
			labelKey: "template.classic.name",
		},
		{
			src: "/professional_preview.webp",
			kind: "image",
			labelKey: "template.professional.name",
		},
		{
			src: "/timeline_preview.webp",
			kind: "image",
			labelKey: "template.timeline.name",
		},
		{
			src: "/custom_preview.webp",
			kind: "image",
			labelKey: "home.styles.custom",
		},
	] satisfies StyleAsset[],
	mobile: { src: "/landing/mobile.webp", kind: "image" },
	author: { src: "/landing/photo.webp", kind: "image" },
} satisfies Record<string, LandingAsset | StyleAsset[]>;

/** An A4 page resting on the section, so a CV image reads as paper. */
export function Sheet({ children }: { children: ReactNode }) {
	return (
		<div className="relative aspect-[210/297] w-full overflow-hidden rounded-sm bg-white ring-1 ring-gray-200 dark:ring-zinc-700 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]">
			{children}
		</div>
	);
}

/** Fills its (sized) parent with the asset. */
export function LandingMedia({
	asset,
	alt,
	sizes,
	priority = false,
}: {
	asset: LandingAsset;
	alt: string;
	sizes: string;
	priority?: boolean;
}) {
	if (asset.kind === "video") {
		return <AutoplayVideo src={asset.src} poster={asset.poster} label={alt} />;
	}

	return (
		<Image
			src={asset.src}
			alt={alt}
			fill
			sizes={sizes}
			priority={priority}
			className="object-cover object-top"
		/>
	);
}
