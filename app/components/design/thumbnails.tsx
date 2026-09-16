"use client";

import type { ReactNode } from "react";

/**
 * Miniature diagrams of each style variant.
 *
 * A picture of the outcome is far cheaper to read than a label like
 * "inlineRule", so every variant picker in the design panel is illustrated.
 * All shapes are plain SVG rects sharing one 64x40 canvas, which keeps them
 * consistent and theme-aware (they inherit `currentColor`).
 */

const W = 64;
const H = 40;

/** A block of body text. */
function Bar({
	x,
	y,
	w,
	h = 2.5,
	strong = false,
	accent = false,
}: {
	x: number;
	y: number;
	w: number;
	h?: number;
	strong?: boolean;
	accent?: boolean;
}) {
	return (
		<rect
			x={x}
			y={y}
			width={w}
			height={h}
			rx={1}
			className={
				accent
					? "fill-sky-500"
					: strong
						? "fill-current opacity-70"
						: "fill-current opacity-25"
			}
		/>
	);
}

/** A hairline rule. */
function Rule({ x, y, w }: { x: number; y: number; w: number }) {
	return (
		<rect
			x={x}
			y={y}
			width={w}
			height={0.8}
			className="fill-current opacity-30"
		/>
	);
}

function Dot({ cx, cy, r = 1.6 }: { cx: number; cy: number; r?: number }) {
	return <circle cx={cx} cy={cy} r={r} className="fill-sky-500" />;
}

function Canvas({ children }: { children: ReactNode }) {
	return (
		<svg
			viewBox={`0 0 ${W} ${H}`}
			className="w-full h-auto text-gray-900 dark:text-gray-100"
			aria-hidden="true"
		>
			{children}
		</svg>
	);
}

/* ----------------------------------------------------------- section titles */

const TITLE_THUMBS = {
	plain: (
		<>
			<Bar x={6} y={7} w={26} h={3.5} strong />
			<Bar x={6} y={16} w={52} />
			<Bar x={6} y={22} w={52} />
			<Bar x={6} y={28} w={38} />
		</>
	),
	ruled: (
		<>
			<Bar x={6} y={7} w={26} h={3.5} strong />
			<Rule x={6} y={13} w={52} />
			<Bar x={6} y={18} w={52} />
			<Bar x={6} y={24} w={52} />
			<Bar x={6} y={30} w={38} />
		</>
	),
	inlineRule: (
		<>
			<Bar x={6} y={7} w={22} h={3.5} strong />
			<Rule x={31} y={8.5} w={27} />
			<Bar x={6} y={17} w={52} />
			<Bar x={6} y={23} w={52} />
			<Bar x={6} y={29} w={38} />
		</>
	),
	block: (
		<>
			<rect
				x={6}
				y={5}
				width={52}
				height={8}
				rx={1.5}
				className="fill-sky-500 opacity-20"
			/>
			<Bar x={9} y={7.5} w={22} h={3} strong />
			<Bar x={6} y={19} w={52} />
			<Bar x={6} y={25} w={52} />
			<Bar x={6} y={31} w={38} />
		</>
	),
} as const;

/* ------------------------------------------------------------------ aligns */

const ALIGN_THUMBS = {
	left: (
		<>
			<Bar x={6} y={9} w={30} h={4} strong />
			<Bar x={6} y={18} w={20} />
			<Bar x={6} y={25} w={40} />
		</>
	),
	center: (
		<>
			<Bar x={17} y={9} w={30} h={4} strong />
			<Bar x={22} y={18} w={20} />
			<Bar x={12} y={25} w={40} />
		</>
	),
} as const;

/* ----------------------------------------------------------------- contact */

const CONTACT_THUMBS = {
	inline: (
		<>
			<Bar x={6} y={10} w={34} h={4} strong />
			<Bar x={6} y={22} w={14} />
			<Bar x={23} y={22} w={14} />
			<Bar x={40} y={22} w={14} />
		</>
	),
	separated: (
		<>
			<Bar x={6} y={10} w={34} h={4} strong />
			<Bar x={6} y={22} w={13} />
			<Bar x={21} y={20} w={0.8} h={6} strong />
			<Bar x={24} y={22} w={13} />
			<Bar x={39} y={20} w={0.8} h={6} strong />
			<Bar x={42} y={22} w={13} />
		</>
	),
	stacked: (
		<>
			<Bar x={6} y={7} w={34} h={4} strong />
			<Bar x={6} y={17} w={22} />
			<Bar x={6} y={23} w={26} />
			<Bar x={6} y={29} w={18} />
		</>
	),
} as const;

/* ----------------------------------------------------------------- entries */

const ENTRY_THUMBS = {
	plain: (
		<>
			<Bar x={6} y={7} w={28} h={3} strong />
			<Bar x={46} y={7} w={12} />
			<Bar x={6} y={13} w={40} />
			<Bar x={6} y={24} w={28} h={3} strong />
			<Bar x={46} y={24} w={12} />
			<Bar x={6} y={30} w={40} />
		</>
	),
	card: (
		<>
			<rect x={6} y={5} width={1.8} height={12} className="fill-sky-500" />
			<Bar x={12} y={6} w={24} h={3} strong />
			<Bar x={12} y={12} w={36} />
			<rect x={6} y={22} width={1.8} height={12} className="fill-sky-500" />
			<Bar x={12} y={23} w={24} h={3} strong />
			<Bar x={12} y={29} w={36} />
		</>
	),
	timeline: (
		<>
			<rect
				x={10}
				y={4}
				width={0.8}
				height={32}
				className="fill-current opacity-30"
			/>
			<Dot cx={10.4} cy={8} />
			<Bar x={18} y={6} w={22} h={3} strong />
			<Bar x={18} y={12} w={32} />
			<Dot cx={10.4} cy={24} />
			<Bar x={18} y={22} w={22} h={3} strong />
			<Bar x={18} y={28} w={32} />
		</>
	),
} as const;

/* ------------------------------------------------------------------- dates */

const DATE_THUMBS = {
	right: (
		<>
			<Bar x={6} y={9} w={26} h={3} strong />
			<Bar x={44} y={9} w={14} accent />
			<Bar x={6} y={15} w={20} />
			<Bar x={6} y={24} w={52} />
			<Bar x={6} y={30} w={40} />
		</>
	),
	below: (
		<>
			<Bar x={6} y={8} w={26} h={3} strong />
			<Bar x={6} y={14} w={20} />
			<Bar x={6} y={20} w={14} accent />
			<Bar x={6} y={28} w={52} />
			<Bar x={6} y={34} w={40} />
		</>
	),
} as const;

/* ----------------------------------------------------------------- bullets */

const BULLET_THUMBS = {
	dot: (
		<>
			<Dot cx={8} cy={11} r={1.3} />
			<Bar x={13} y={10} w={45} />
			<Dot cx={8} cy={21} r={1.3} />
			<Bar x={13} y={20} w={38} />
			<Dot cx={8} cy={31} r={1.3} />
			<Bar x={13} y={30} w={42} />
		</>
	),
	dash: (
		<>
			<Bar x={6} y={10.5} w={4} h={1.2} strong />
			<Bar x={13} y={10} w={45} />
			<Bar x={6} y={20.5} w={4} h={1.2} strong />
			<Bar x={13} y={20} w={38} />
			<Bar x={6} y={30.5} w={4} h={1.2} strong />
			<Bar x={13} y={30} w={42} />
		</>
	),
	none: (
		<>
			<Bar x={6} y={10} w={52} />
			<Bar x={6} y={20} w={45} />
			<Bar x={6} y={30} w={48} />
		</>
	),
} as const;

/* --------------------------------------------------------------- languages */

const LANGUAGES_THUMBS = {
	inline: (
		<>
			<Bar x={6} y={13} w={15} />
			<Bar x={25} y={13} w={15} />
			<Bar x={44} y={13} w={14} />
			<Bar x={6} y={23} w={15} />
			<Bar x={25} y={23} w={15} />
		</>
	),
	rows: (
		<>
			<Bar x={6} y={8} w={20} h={3} strong />
			<Bar x={44} y={8} w={14} />
			<Rule x={6} y={14} w={52} />
			<Bar x={6} y={19} w={24} h={3} strong />
			<Bar x={44} y={19} w={14} />
			<Rule x={6} y={25} w={52} />
			<Bar x={6} y={30} w={18} h={3} strong />
			<Bar x={44} y={30} w={14} />
		</>
	),
	leaders: (
		<>
			<Bar x={6} y={9} w={18} h={3} strong />
			<Rule x={27} y={10} w={18} />
			<Bar x={47} y={9} w={11} />
			<Bar x={6} y={20} w={22} h={3} strong />
			<Rule x={31} y={21} w={14} />
			<Bar x={47} y={20} w={11} />
			<Bar x={6} y={31} w={16} h={3} strong />
			<Rule x={25} y={32} w={20} />
			<Bar x={47} y={31} w={11} />
		</>
	),
} as const;

/* ------------------------------------------------------------------ skills */

const SKILLS_THUMBS = {
	paragraph: (
		<>
			<Bar x={6} y={12} w={52} />
			<Bar x={6} y={19} w={52} />
			<Bar x={6} y={26} w={34} />
		</>
	),
	centered: (
		<>
			<Bar x={6} y={12} w={52} />
			<Bar x={9} y={19} w={46} />
			<Bar x={18} y={26} w={28} />
		</>
	),
	bulleted: (
		<>
			<Dot cx={8} cy={11} r={1.3} />
			<Bar x={13} y={10} w={30} />
			<Dot cx={8} cy={21} r={1.3} />
			<Bar x={13} y={20} w={38} />
			<Dot cx={8} cy={31} r={1.3} />
			<Bar x={13} y={30} w={24} />
		</>
	),
} as const;

/** Every thumbnail, grouped by the option it illustrates. */
export const THUMBNAILS = {
	sectionTitle: TITLE_THUMBS,
	align: ALIGN_THUMBS,
	contact: CONTACT_THUMBS,
	entries: ENTRY_THUMBS,
	datePlacement: DATE_THUMBS,
	bullets: BULLET_THUMBS,
	languages: LANGUAGES_THUMBS,
	skills: SKILLS_THUMBS,
} as const;

/** Renders one thumbnail by group and variant. */
export function Thumbnail({
	group,
	variant,
}: {
	group: keyof typeof THUMBNAILS;
	variant: string;
}) {
	const shapes = (THUMBNAILS[group] as Record<string, ReactNode>)[variant];
	return <Canvas>{shapes}</Canvas>;
}
