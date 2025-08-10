"use client";

import React, { PropsWithChildren, createContext, useContext, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type DragHandleValue = {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
  setActivatorNodeRef: ReturnType<typeof useSortable>["setActivatorNodeRef"];
};

const DragHandleContext = createContext<DragHandleValue | null>(null);

export function useDragHandle() {
  const ctx = useContext(DragHandleContext);
  if (!ctx) {
    const noop = () => {};
    return {
      attributes: {} as ReturnType<typeof useSortable>["attributes"],
      listeners: {} as ReturnType<typeof useSortable>["listeners"],
      setActivatorNodeRef: noop as ReturnType<typeof useSortable>["setActivatorNodeRef"],
    };
  }
  return ctx;
}

type DragHandleProps = React.PropsWithChildren<{
  className?: string;
  ariaLabel?: string;
}>;

// DragHandle component to be used inside item headers
export function DragHandle({ className = "", ariaLabel = "Drag item", children }: DragHandleProps) {
  const { attributes, listeners, setActivatorNodeRef } = useDragHandle();
  const setButtonActivatorRef = (el: HTMLButtonElement | null) => setActivatorNodeRef(el);
  return (
    <button
      type="button"
      ref={setButtonActivatorRef}
      {...attributes}
      {...listeners}
      aria-label={ariaLabel}
      className={`cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: 'none' }}
    >
      {children}
    </button>
  );
}

// Generic SortableItem that wraps each list row
function SortableItem({ id, children }: PropsWithChildren<{ id: number }>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Do not show grab cursor on the whole card; only on the handle
    cursor: "default",
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <DragHandleContext.Provider value={{ attributes, listeners, setActivatorNodeRef }}>
        {children}
      </DragHandleContext.Provider>
    </div>
  );
}

export interface SortableListProps {
  // Number of items in the list; items are identified by their current indices [0..length-1]
  length: number;
  // Render a row by index
  renderItem: (idx: number) => React.ReactNode;
  // Callback when an item is moved
  onReorder: (from: number, to: number) => void;
  // Disable sorting (e.g., when length <= 1)
  disabled?: boolean;
}

/**
 * SortableList (dnd-kit)
 * - Uses indices as stable item ids for simplicity.
 * - Emits onReorder(fromIndex, toIndex) on drag end.
 */
export function SortableList({ length, renderItem, onReorder, disabled }: SortableListProps) {
  const items = useMemo(() => Array.from({ length }, (_, i) => i), [length]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const from = Number(active.id);
    const to = Number(over.id);
    if (Number.isNaN(from) || Number.isNaN(to) || from === to) return;

    onReorder(from, to);
  };

  if (disabled || length <= 1) {
    return <>{items.map((idx) => <React.Fragment key={idx}>{renderItem(idx)}</React.Fragment>)}</>;
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {items.map((idx) => (
          <SortableItem id={idx} key={idx}>
            {renderItem(idx)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}

export default SortableList;
