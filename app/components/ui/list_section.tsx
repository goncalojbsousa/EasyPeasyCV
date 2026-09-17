"use client";

import type { ReactNode } from "react";
import type { SectionControlProps } from "../../types/cv";
import { SortableList } from "../dnd/sortable_list";
import { EmptyState } from "./empty_state";
import { FormSection } from "./form_section";
import { IconButton } from "./icon_button";
import { Icons } from "./icons";

interface ListSectionProps<T> extends SectionControlProps {
	/** Section title */
	title: string;
	/** Section icon */
	icon: ReactNode;
	/** Entries rendered by this section */
	items: T[];
	/** Message shown when there are no entries */
	emptyMessage: string;
	/** Label of the "add entry" button */
	addLabel: string;
	onAdd: () => void;
	onReorder?: (fromIndex: number, toIndex: number) => void;
	/**
	 * Renders one entry. `draggable` is true when reordering is meaningful
	 * (more than one entry), so the caller can pass it straight to `EntryCard`.
	 */
	renderItem: (item: T, index: number, draggable: boolean) => ReactNode;
}

/**
 * Shell for every list-shaped CV form section (experience, education,
 * certifications, languages, projects, volunteering, custom sections).
 * Owns the form wrapper, the collapsible section header, the empty state, the
 * drag-and-drop list and the add button, which each section used to repeat.
 */
export function ListSection<T>({
	title,
	icon,
	items,
	emptyMessage,
	addLabel,
	onAdd,
	onReorder,
	renderItem,
	...controls
}: ListSectionProps<T>) {
	const draggable = items.length > 1;

	return (
		<form className="space-y-8 flex flex-col items-center">
			<FormSection title={title} icon={icon} {...controls}>
				{items.length === 0 && <EmptyState message={emptyMessage} />}

				<SortableList
					length={items.length}
					onReorder={(from, to) => onReorder?.(from, to)}
					renderItem={(idx) => renderItem(items[idx], idx, draggable)}
				/>

				<div className="flex justify-start mt-4">
					<IconButton onClick={onAdd}>
						{Icons.add}
						{addLabel}
					</IconButton>
				</div>
			</FormSection>
		</form>
	);
}
