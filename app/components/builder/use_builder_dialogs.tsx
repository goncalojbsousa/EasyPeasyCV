"use client";

import { type ReactNode, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { CvTemplate } from "../../types/cv";
import { ProfileDeleteModal } from "../ui/modals/profile_delete_modal";
import { TemplateSelectorModal } from "../ui/modals/template_selector_modal";
import { ThankYouModal } from "../ui/modals/thank_you_modal";
import type { BuilderActions } from "./builder_actions";

/**
 * The dialogs both action bars need: template picker, profile delete
 * confirmation and the post-download thank-you modal.
 *
 * Returns the openers plus a single node to render, so each bar wires them
 * with three lines instead of duplicating the modal markup and state.
 */
export function useBuilderDialogs({
	data,
	onTemplateChange,
	onDeleteProfile,
}: Pick<BuilderActions, "data" | "onTemplateChange" | "onDeleteProfile">) {
	const { t } = useLanguage();
	const [showTemplatePicker, setShowTemplatePicker] = useState(false);
	const [showThankYou, setShowThankYou] = useState(false);
	const [pendingDeletion, setPendingDeletion] = useState<{
		id: string;
		name: string;
	} | null>(null);

	const dialogs: ReactNode = (
		<>
			<TemplateSelectorModal
				show={showTemplatePicker}
				selectedTemplate={data.template ?? "professional"}
				onSelect={(template: CvTemplate) => {
					onTemplateChange(template);
					setShowTemplatePicker(false);
				}}
				onClose={() => setShowTemplatePicker(false)}
			/>

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
				personalInfo={data.personalInfo}
				experiences={data.experiences}
				education={data.education}
			/>
		</>
	);

	return {
		dialogs,
		openTemplatePicker: () => setShowTemplatePicker(true),
		requestProfileDeletion: setPendingDeletion,
		onPdfGenerated: () => setShowThankYou(true),
	};
}
