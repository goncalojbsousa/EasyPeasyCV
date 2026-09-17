import { getRequestConfig } from "next-intl/server";
import { getTranslations, isLocale } from "@/app/translations";
import { routing } from "@/navigation";

export default getRequestConfig(async ({ requestLocale }) => {
	// This typically corresponds to the `[locale]` segment
	const requested = await requestLocale;
	const locale = isLocale(requested) ? requested : routing.defaultLocale;

	return {
		locale,
		messages: unflattenMessages(getTranslations(locale)),
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
