"use client";

import { type ReactNode, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { ProfileDeleteModal } from "../ui/modals/profile_delete_modal";
import { ThankYouModal } from "../ui/modals/thank_you_modal";
import type { BuilderActions } from "./builder_actions";

/**
 * The dialogs both action bars need: the profile delete confirmation and the
 * post-download thank-you modal.
 *
 * Returns the openers plus a single node to render, so each bar wires them
 * with a couple of lines instead of duplicating the modal markup and state.
 */
export function useBuilderDialogs({
	data,
	onDeleteProfile,
}: Pick<BuilderActions, "data" | "onDeleteProfile">) {
	const { t } = useLanguage();
	const [showThankYou, setShowThankYou] = useState(false);
	const [pendingDeletion, setPendingDeletion] = useState<{
		id: string;
		name: string;
	} | null>(null);

	const dialogs: ReactNode = (
		<>
			<ProfileDeleteModal
				show={pendingDeletion !== null}
				profileName={pendingDeletion?.name || t("profile.unnamed")}
				onClose={() => setPendingDeletion(null)}
				onConfirm={() => {
					if (pendingDeletion) onDeleteProfile(pendingDeletion.id);
					setPendingDeletion(null);
				}}
			/>

			<ThankYouModal
				show={showThankYou}
				onClose={() => setShowThankYou(false)}
				data={data}
			/>
		</>
	);

	return {
		dialogs,
		requestProfileDeletion: setPendingDeletion,
		onPdfGenerated: () => setShowThankYou(true),
	};
}
