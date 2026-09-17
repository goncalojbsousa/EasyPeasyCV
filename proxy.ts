import createMiddleware from "next-intl/middleware";
import { routing } from "./navigation";

export default createMiddleware(routing);

export const config = {
	// Match only internationalized pathnames.
	// Next.js requires `matcher` to be static literals, so this list cannot be
	// derived from `routing.locales` — keep the two in sync when adding a locale.
	matcher: ["/", "/(en|pt|br|es)/:path*"],
};
