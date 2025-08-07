
// Import the CvColor type for color theme keys
import { CvColor } from '../types/cv';

/**
 * Color theme definitions for each available CV color.
 * Each theme includes primary, secondary, accent, light, and dark color values.
 */
export const colorThemes: Record<CvColor, {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  dark: string;
}> = {
  blue: {
    primary: '#3b82f6',
    secondary: '#1e40af',
    accent: '#dbeafe',
    light: '#60a5fa',
    dark: '#1e3a8a'
  },
  green: {
    primary: '#10b981',
    secondary: '#059669',
    accent: '#d1fae5',
    light: '#34d399',
    dark: '#065f46'
  },
  purple: {
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#ede9fe',
    light: '#a78bfa',
    dark: '#5b21b6'
  },
  orange: {
    primary: '#f59e0b',
    secondary: '#d97706',
    accent: '#fed7aa',
    light: '#fbbf24',
    dark: '#92400e'
  },
  red: {
    primary: '#ef4444',
    secondary: '#dc2626',
    accent: '#fecaca',
    light: '#f87171',
    dark: '#991b1b'
  },
  teal: {
    primary: '#14b8a6',
    secondary: '#0d9488',
    accent: '#ccfbf1',
    light: '#2dd4bf',
    dark: '#134e4a'
  },
  indigo: {
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#e0e7ff',
    light: '#818cf8',
    dark: '#3730a3'
  },
  pink: {
    primary: '#ec4899',
    secondary: '#db2777',
    accent: '#fce7f3',
    light: '#f472b6',
    dark: '#9d174d'
  }
};

/**
 * Utility function to get the color theme object for a given CvColor.
 * Defaults to the 'blue' theme if no color is provided.
 */
export function getColorTheme(color: CvColor = 'blue') {
  return colorThemes[color];
}