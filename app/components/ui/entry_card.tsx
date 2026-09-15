"use client";

import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";
import { DragHandle } from "../dnd/sortable_list";
import { IconButton } from "./icon_button";
import { Icons } from "./icons";

interface EntryCardProps {
	/** Title shown in the card header */
	title: string;
	/** Card body */
	children: ReactNode;
	/** Remove handler; the remove button is hidden when omitted */
	onRemove?: () => void;
	/** Show the drag handle (typically only when the list has more than one item) */
	draggable?: boolean;
	/** Accessible noun used for the drag/remove labels, e.g. "experience" */
	entityLabel: string;
	/** Extra controls rendered to the left of the remove button */
	headerActions?: ReactNode;
}

/**
 * One entry inside a list section (an experience, a project, a language…).
 * Owns the card chrome — border, header, drag handle and remove button — that
 * every list section previously duplicated.
 */
export function EntryCard({
	title,
	children,
	onRemove,
	draggable = false,
	entityLabel,
	headerActions,
}: EntryCardProps) {
	return (
		<div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm relative mb-6 transition-all duration-300">
			<div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 border-b border-gray-200 dark:border-zinc-700 rounded-t-lg transition-colors duration-300">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						{draggable && (
							<DragHandle
								ariaLabel={`Reorder ${entityLabel}`}
								className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors duration-300"
							>
								<GripVertical className="w-4 h-4" />
							</DragHandle>
						)}
						<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
							{title}
						</h3>
					</div>
					<div className="flex items-center gap-2">
						{headerActions}
						{onRemove && (
							<IconButton
								onClick={onRemove}
								variant="danger"
								size="sm"
								ariaLabel={`Remove ${entityLabel}`}
							>
								{Icons.remove}
							</IconButton>
						)}
					</div>
				</div>
			</div>

			<div className="p-4">{children}</div>
		</div>
	);
}
