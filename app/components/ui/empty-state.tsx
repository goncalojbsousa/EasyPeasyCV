'use client';

/**
 * Props interface for the EmptyState component
 */
interface EmptyStateProps {
  /** Message to display in the empty state */
  message: string;
}

/**
 * EmptyState component displays a placeholder when there's no content to show
 * @param message - The message to display in the empty state
 * @returns JSX element representing an empty state with an icon and message
 */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-8 text-gray-400 mb-4">
      {/* Plus icon SVG */}
      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-10 h-10 mb-2'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
      </svg>
      {message}
    </div>
  );
} 