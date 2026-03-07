"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";

interface ProfileDeleteModalProps {
	show: boolean;
	profileName: string;
	onClose: () => void;
	onConfirm: () => void;
}

export function ProfileDeleteModal({
	show,
	profileName,
	onClose,
	onConfirm,
}: ProfileDeleteModalProps) {
	const { t } = useLanguage();

	useEffect(() => {
		if (!show) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [show, onClose]);

	if (!show) return null;

	const description = t("profile.delete.confirm").replace(
		"{name}",
		profileName,
	);

	return (
		<div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-black/55"
				onClick={onClose}
				aria-label={t("profile.delete.cancel")}
			/>
			<div
				className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
				role="dialog"
				aria-modal="true"
				aria-labelledby="profile-delete-modal-title"
			>
				<div className="flex items-start gap-4 p-6">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
						<AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
					</div>
					<div className="min-w-0 flex-1">
						<h2
							id="profile-delete-modal-title"
							className="text-lg font-semibold text-gray-900 dark:text-gray-100"
						>
							{t("profile.delete.title")}
						</h2>
						<p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
							{description}
						</p>
						<p className="mt-3 text-sm font-medium text-red-700 dark:text-red-400">
							{t("profile.delete.warning")}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-md p-1 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
						aria-label={t("profile.delete.cancel")}
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900/60">
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
					>
						{t("profile.delete.cancel")}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
					>
						{t("profile.delete")}
					</button>
				</div>
			</div>
		</div>
	);
}
