"use client";

import { Loader } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Props for the IconButton component.
 */
interface IconButtonProps {
	/** Click handler function */
	onClick: () => void;
	/** Child elements (usually icons) to render inside the button */
	children: ReactNode;
	/** Visual variant of the button */
	variant?: "primary" | "secondary" | "tertiary" | "danger";
	/** Size variant of the button */
	size?: "sm" | "md" | "lg";
	/** Additional CSS classes to apply */
	className?: string;
	/** Accessible label for icon-only buttons */
	ariaLabel?: string;
	/** Disabled state */
	disabled?: boolean;
	/** Loading state (disables button and shows reduced opacity) */
	loading?: boolean;
}

/**
 * IconButton component provides a consistent button with icon support and multiple variants.
 * Supports primary and danger visual styles, and different sizes.
 */
export function IconButton({
	onClick,
	children,
	variant = "primary",
	size = "md",
	className = "",
	ariaLabel,
	disabled = false,
	loading = false,
}: IconButtonProps) {
	// Base CSS classes for all button variants
	const baseClasses =
		"relative font-semibold flex items-center justify-center select-none motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed";

	// CSS classes for different visual variants
	const variantClasses = {
		primary: "bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800",
		secondary:
			"bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 active:bg-gray-700 dark:active:bg-gray-200",
		tertiary:
			"border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 active:bg-gray-100 dark:active:bg-gray-700",
		danger:
			"text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400",
	} as const;

	// CSS classes for different size variants
	const sizeClasses = {
		sm: "px-2 sm:px-3 py-1.5 text-xs sm:text-sm",
		md: "px-3 sm:px-4 py-2 text-sm",
		lg: "px-4 sm:px-6 py-3 text-base sm:text-lg",
	};

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={ariaLabel}
			disabled={disabled || loading}
			className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} rounded-xl shadow-sm ${className}`}
		>
			<span
				className={`inline-flex items-center gap-2 ${loading ? "opacity-0" : ""}`}
			>
				{children}
			</span>
			{loading && (
				<Loader
					className="absolute inset-0 m-auto h-5 w-5 animate-spin text-current"
					aria-hidden="true"
				/>
			)}
		</button>
	);
}
