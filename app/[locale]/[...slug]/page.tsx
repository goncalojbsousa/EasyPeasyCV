import { notFound } from "next/navigation";

/**
 * Catch-all route for unknown paths within a locale.
 * Ensures the custom not-found.tsx is shown instead of Next.js default 404.
 */
export default function CatchAllPage() {
	notFound();
}
