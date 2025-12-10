'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch between server and client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Render a placeholder button during server-side rendering to avoid UI flicker
    if (!mounted) {
        return (
            <button
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-300"
                aria-label="Toggle theme"
            >
                <Sun className="size-6" />
            </button>
        );
    }
    
    return (
        <button
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-300"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
            {resolvedTheme === 'dark' ? (
                // Sun icon: shown in dark mode, click to switch to light mode
                <Sun className="size-6" />
            ) : (
                // Moon icon: shown in light mode, click to switch to dark mode
                <Moon className="size-6" />
            )}
        </button>
    );
}   