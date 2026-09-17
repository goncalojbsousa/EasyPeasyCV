"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";

interface ProfileDeleteModalProps {
	show: boolean;
	profileName: string;
	onClose: () => void;
	onConfirm: () => void;
}

/**
 * Confirmation before deleting a CV profile.
 *
 * Styled like the app's other sheets (same surface, radius and buttons) and
 * kept to one question and two answers. Focus starts on "Cancel", so a stray
 * Enter never deletes anything.
 */
export function ProfileDeleteModal({
	show,
	profileName,
	onClose,
	onConfirm,
}: ProfileDeleteModalProps) {
	const { t } = useLanguage();
	const cancelRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!show) return;

		const previousFocus = document.activeElement as HTMLElement | null;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		cancelRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = previousOverflow;
			previousFocus?.focus?.();
		};
	}, [show, onClose]);

	if (!show) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
			<button
				type="button"
				tabIndex={-1}
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
				aria-label={t("profile.delete.cancel")}
			/>
			<div
				className="relative z-10 w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="profile-delete-title"
				aria-describedby="profile-delete-description"
			>
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30">
					<Trash2
						aria-hidden="true"
						className="h-5 w-5 text-red-600 dark:text-red-400"
					/>
				</div>
				<h2
					id="profile-delete-title"
					className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100 break-words"
				>
					{t("profile.delete.title").replace("{name}", profileName)}
				</h2>
				<p
					id="profile-delete-description"
					className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300"
				>
					{t("profile.delete.confirm")}
				</p>

				<div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<button
						ref={cancelRef}
						type="button"
						onClick={onClose}
						className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 ring-1 ring-gray-200 dark:ring-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
					>
						{t("profile.delete.cancel")}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
					>
						{t("profile.delete")}
					</button>
				</div>
			</div>
		</div>
	);
}
