'use client';

import { ReactNode } from 'react';

/**
 * Props interface for the IconButton component
 */
interface IconButtonProps {
  /** Click handler function */
  onClick: () => void;
  /** Child elements (usually icons) to render inside the button */
  children: ReactNode;
  /** Visual variant of the button */
  variant?: 'primary' | 'danger';
  /** Size variant of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * IconButton component provides a consistent button with icon support and multiple variants
 * @param onClick - Function to call when button is clicked
 * @param children - Child elements (usually icons) to render
 * @param variant - Visual variant (defaults to 'primary')
 * @param size - Size variant (defaults to 'md')
 * @param className - Additional CSS classes
 * @returns JSX element representing a styled button with icon support
 */
export function IconButton({ 
  onClick, 
  children, 
  variant = 'primary', 
  size = 'md',
  className = ''
}: IconButtonProps) {
  // Base CSS classes for all button variants
  const baseClasses = "font-semibold flex items-center gap-2 transition-colors duration-200";
  
  // CSS classes for different visual variants
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "text-gray-400 hover:text-red-500"
  };
  
  // CSS classes for different size variants
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} rounded-lg ${className}`}
    >
      {children}
    </button>
  );
} 