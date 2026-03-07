import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "pt", "br", "es"];

export default getRequestConfig(async ({ requestLocale }) => {
	// This typically corresponds to the `[locale]` segment
	let locale = await requestLocale;

	// Ensure that a valid locale is used
	if (!locale || !locales.includes(locale)) {
		locale = "en"; // Default or handle notFound()
	}

	// Removed unused type alias MessagesModule

	const rawMessages = (await import(`@/app/translations/${locale}.ts`)).default;

	return {
		locale,
		messages: unflattenMessages(rawMessages),
	};
});

function unflattenMessages(
	nestedMessages: Record<string, string>,
): Record<string, Record<string, unknown>> {
	const result: Record<string, Record<string, unknown>> = {};
	for (const key in nestedMessages) {
		const value = nestedMessages[key];
		const keys = key.split(".");
		let current: Record<string, unknown> = result;
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			if (i === keys.length - 1) {
				current[k] = value;
			} else {
				// Se current[k] já existe e é string, converte para objeto
				if (typeof current[k] === "string") {
					current[k] = { _value: current[k] };
				} else if (!current[k]) {
					current[k] = {};
				}
				current = current[k] as Record<string, unknown>;
			}
		}
	}
	return result;
}
