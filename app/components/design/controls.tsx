"use client";

import type { ReactNode } from "react";
import { type THUMBNAILS, Thumbnail } from "./thumbnails";

/** A labelled group of related controls. */
export function Group({
	title,
	help,
	children,
}: {
	title: string;
	help?: string;
	children: ReactNode;
}) {
	return (
		<section className="space-y-2">
			<div>
				<h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
					{title}
				</h3>
				{help && (
					<p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
						{help}
					</p>
				)}
			</div>
			{children}
		</section>
	);
}

/** A labelled row wrapping one control. */
export function Field({
	label,
	hint,
	children,
}: {
	label: string;
	hint?: string;
	children: ReactNode;
}) {
	return (
		<div>
			<div className="block text-xs font-medium mb-1 text-gray-800 dark:text-gray-200">
				{label}
			</div>
			{children}
			{hint && (
				<p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
					{hint}
				</p>
			)}
		</div>
	);
}

export interface OptionChoice<T extends string> {
	value: T;
	label: string;
}

/**
 * The primary control of the design panel: a grid of illustrated choices.
 *
 * Showing the outcome instead of naming it is what makes a modular system
 * discoverable — the user recognises the layout they want rather than
 * decoding an option name.
 */
export function OptionGrid<T extends string>({
	label,
	hint,
	group,
	choices,
	value,
	onChange,
	columns = 3,
}: {
	label: string;
	hint?: string;
	group: keyof typeof THUMBNAILS;
	choices: OptionChoice<T>[];
	value: T;
	onChange: (value: T) => void;
	columns?: 2 | 3;
}) {
	return (
		<Field label={label} hint={hint}>
			<div
				className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-3"}`}
			>
				{choices.map((choice) => {
					const selected = choice.value === value;
					return (
						<button
							key={choice.value}
							type="button"
							onClick={() => onChange(choice.value)}
							aria-pressed={selected}
							className={`group rounded-lg border p-1.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
								selected
									? "border-sky-500 ring-1 ring-sky-400/60 bg-sky-50/70 dark:bg-sky-900/20"
									: "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900/40"
							}`}
						>
							<div className="rounded bg-gray-50 dark:bg-zinc-800 p-1">
								<Thumbnail group={group} variant={choice.value} />
							</div>
							<span
								className={`mt-1 block text-center text-[10px] leading-tight ${
									selected
										? "font-semibold text-sky-700 dark:text-sky-300"
										: "text-gray-600 dark:text-gray-400"
								}`}
							>
								{choice.label}
							</span>
						</button>
					);
				})}
			</div>
		</Field>
	);
}

/** Compact text-only segmented control, for options that need no illustration. */
export function Segmented<T extends string | number>({
	label,
	hint,
	choices,
	value,
	onChange,
}: {
	label: string;
	hint?: string;
	choices: { value: T; label: string }[];
	value: T;
	onChange: (value: T) => void;
}) {
	return (
		<Field label={label} hint={hint}>
			<div className="inline-flex w-full rounded-md border border-gray-300 dark:border-zinc-600 overflow-hidden">
				{choices.map((choice) => (
					<button
						key={String(choice.value)}
						type="button"
						onClick={() => onChange(choice.value)}
						aria-pressed={choice.value === value}
						className={`flex-1 px-2 py-1.5 text-xs transition-colors ${
							choice.value === value
								? "bg-sky-600 text-white font-semibold"
								: "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
						}`}
					>
						{choice.label}
					</button>
				))}
			</div>
		</Field>
	);
}

/** Labelled range input showing its current value. */
export function Slider({
	label,
	value,
	min,
	max,
	step = 1,
	suffix = "",
	onChange,
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	step?: number;
	suffix?: string;
	onChange: (value: number) => void;
}) {
	const id = `slider-${label.replace(/\s+/g, "-").toLowerCase()}`;
	return (
		<div>
			<label
				htmlFor={id}
				className="flex items-baseline justify-between text-xs font-medium mb-1 text-gray-800 dark:text-gray-200"
			>
				<span>{label}</span>
				<span className="text-[10px] text-gray-500 dark:text-gray-400 tabular-nums">
					{value}
					{suffix}
				</span>
			</label>
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="w-full accent-sky-600"
			/>
		</div>
	);
}

/** Checkbox with a label and optional help text. */
export function Toggle({
	label,
	hint,
	checked,
	onChange,
}: {
	label: string;
	hint?: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<div>
			<label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-gray-800 dark:text-gray-200">
				<input
					type="checkbox"
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
					className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
				/>
				{label}
			</label>
			{hint && (
				<p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 ml-5">
					{hint}
				</p>
			)}
		</div>
	);
}

/** Native color input with a label. */
export function ColorField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	const id = `color-${label.replace(/\s+/g, "-").toLowerCase()}`;
	return (
		<div>
			<label
				htmlFor={id}
				className="block text-xs font-medium mb-1 text-gray-800 dark:text-gray-200"
			>
				{label}
			</label>
			<input
				id={id}
				type="color"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full h-8 p-0 rounded cursor-pointer bg-transparent"
			/>
		</div>
	);
}
