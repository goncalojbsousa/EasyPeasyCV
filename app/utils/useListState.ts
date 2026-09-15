"use client";

import { useCallback, useMemo, useState } from "react";

/** Move an item inside an array, returning a new array. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
	const next = [...items];
	const [moved] = next.splice(from, 1);
	next.splice(to, 0, moved);
	return next;
}

export interface ListState<T> {
	items: T[];
	/** Replace the whole list (used when loading a profile) */
	set: (items: T[]) => void;
	/** Append a blank entry produced by `createEmpty` */
	add: () => void;
	remove: (index: number) => void;
	/** Patch one field of one entry */
	update: (index: number, field: string, value: string | boolean) => void;
	reorder: (from: number, to: number) => void;
}

/**
 * State container for one of the CV's repeated list sections.
 * Every list section (experiences, education, languages, certifications,
 * projects, volunteering, links) needs the same add/remove/update/reorder
 * behaviour, so it is defined once here instead of per section in the builder.
 */
export function useListState<T>(createEmpty: () => T): ListState<T> {
	const [items, setItems] = useState<T[]>([]);

	const add = useCallback(
		() => setItems((prev) => [...prev, createEmpty()]),
		[createEmpty],
	);

	const remove = useCallback(
		(index: number) => setItems((prev) => prev.filter((_, i) => i !== index)),
		[],
	);

	const update = useCallback(
		(index: number, field: string, value: string | boolean) =>
			setItems((prev) =>
				prev.map((item, i) =>
					i === index ? { ...item, [field]: value } : item,
				),
			),
		[],
	);

	const reorder = useCallback(
		(from: number, to: number) => setItems((prev) => moveItem(prev, from, to)),
		[],
	);

	return useMemo(
		() => ({ items, set: setItems, add, remove, update, reorder }),
		[items, add, remove, update, reorder],
	);
}
