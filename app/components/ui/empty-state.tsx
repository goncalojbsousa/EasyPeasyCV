'use client';

import { Plus } from 'lucide-react';

/**
 * Props for the EmptyState component.
 */
interface EmptyStateProps {
  /** Message to display in the empty state */
  message: string;
}

/**
 * EmptyState component displays a placeholder when there is no content to show.
 * Shows a plus icon and a message.
 */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-zinc-600 rounded-lg p-4 sm:p-8 text-gray-400 dark:text-zinc-500 mb-4 text-center">
      {/* Plus icon */}
      <Plus className='w-8 h-8 sm:w-10 sm:h-10 mb-2' strokeWidth={1.5} />
      <span className="text-sm sm:text-base">{message}</span>
    </div>
  );
} 