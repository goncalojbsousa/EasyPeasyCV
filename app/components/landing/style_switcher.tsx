"use client";

import { useState } from "react";
import { type LandingAsset, LandingMedia, Sheet } from "./landing_media";

/**
 * One large, readable CV page with a row of style names to switch between.
 *
 * Replaces a grid of thumbnails: at thumbnail size neither the text nor the
 * difference between styles could be seen. The pages are stacked and
 * cross-faded, so switching compares two styles in place instead of flashing.
 */
export function StyleSwitcher({
	label,
	styles,
	alt,
}: {
	/** Accessible name of the style choice */
	label: string;
	styles: { asset: LandingAsset; label: string }[];
	alt: string;
}) {
	const [selected, setSelected] = useState(0);

	return (
		<div className="mx-auto w-full max-w-[480px]">
			<fieldset className="mb-5 flex flex-wrap justify-center gap-2">
				<legend className="sr-only">{label}</legend>
				{styles.map((style, index) => (
					<button
						key={style.asset.src}
						type="button"
						aria-pressed={index === selected}
						onClick={() => setSelected(index)}
						className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
							index === selected
								? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
								: "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-200 dark:ring-zinc-700 dark:hover:bg-zinc-700"
						}`}
					>
						{style.label}
					</button>
				))}
			</fieldset>
			<Sheet>
				{styles.map((style, index) => (
					<div
						key={style.asset.src}
						aria-hidden={index !== selected}
						className={`absolute inset-0 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
							index === selected ? "opacity-100" : "opacity-0"
						}`}
					>
						<LandingMedia
							asset={style.asset}
							alt={`${alt}: ${style.label}`}
							sizes="480px"
						/>
					</div>
				))}
			</Sheet>
		</div>
	);
}
