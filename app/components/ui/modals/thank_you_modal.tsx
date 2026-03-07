"use client";

import { AlertCircle, CheckCircle, Heart, Plus, X } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { Education, Experience, PersonalInfo } from "../../../types/cv";

/**
 * Props interface for the ThankYouModal component
 */
interface ThankYouModalProps {
	/** Whether the modal is visible */
	show: boolean;
	/** Function to close the modal */
	onClose: () => void;
	/** Personal information to check for empty fields */
	personalInfo?: PersonalInfo;
	/** Professional experiences to check if empty */
	experiences?: Experience[];
	/** Education entries to check if empty */
	education?: Education[];
}

/**
 * ThankYouModal component
 * Displays a thank you message, warnings for empty fields, and donation option after PDF generation
 * @param show - Whether the modal is visible
 * @param onClose - Function to close the modal
 * @param personalInfo - Personal information to check for empty fields
 * @param experiences - Professional experiences to check if empty
 * @param education - Education entries to check if empty
 * @returns JSX element representing the thank you modal
 */
export function ThankYouModal({
	show,
	onClose,
	personalInfo,
	experiences,
	education,
}: ThankYouModalProps) {
	const { t, language } = useLanguage();

	if (!show) return null;

	// Determine which recommended fields are empty
	const emptyFields: string[] = [];

	if (personalInfo) {
		if (!personalInfo.name.trim()) {
			const fieldName =
				language === "pt"
					? "Nome Completo"
					: language === "es"
						? "Nombre Completo"
						: "Full Name";
			emptyFields.push(fieldName);
		}
		if (!personalInfo.email.trim()) {
			const fieldName =
				language === "pt"
					? "Email"
					: language === "es"
						? "Correo Electrónico"
						: "Email";
			emptyFields.push(fieldName);
		}
		if (!personalInfo.phone.trim()) {
			const fieldName =
				language === "pt"
					? "Telefone"
					: language === "es"
						? "Teléfono"
						: "Phone";
			emptyFields.push(fieldName);
		}
		if (!personalInfo.desiredRole.trim()) {
			const fieldName =
				language === "pt"
					? "Cargo Desejado"
					: language === "es"
						? "Puesto Deseado"
						: "Desired Role";
			emptyFields.push(fieldName);
		}
	}

	if (!experiences || experiences.length === 0) {
		const fieldName =
			language === "pt"
				? "Experiência Profissional"
				: language === "es"
					? "Experiencia Profesional"
					: "Professional Experience";
		emptyFields.push(fieldName);
	}

	if (!education || education.length === 0) {
		const fieldName =
			language === "pt"
				? "Educação"
				: language === "es"
					? "Educación"
					: "Education";
		emptyFields.push(fieldName);
	}

	const handleDonationClick = () => {
		window.open("https://ko-fi.com/easypeasycv", "_blank");
		onClose();
	};

	const handleClose = () => {
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
				{/* Close button for modal */}
				<button
					type="button"
					onClick={handleClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
				>
					<X className="w-6 h-6" />
				</button>

				{/* Modal content */}
				<div className="text-center">
					{/* Success icon for visual feedback */}
					<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
						<CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
					</div>

					{/* Thank you title */}
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						{t("thank.you.title")}
					</h3>

					{/* Thank you message */}
					<p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
						{t("thank.you.message")}
					</p>

					{/* Warning section for empty recommended fields */}
					{emptyFields.length > 0 && (
						<div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
							<div className="flex items-start gap-3">
								<AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
								<div className="text-left">
									<h4 className="text-amber-900 dark:text-amber-200 font-medium text-sm mb-2">
										{language === "pt"
											? "Atenção: Campos Recomendados"
											: language === "es"
												? "Atención: Campos Recomendados"
												: "Attention: Recommended Fields"}
									</h4>
									<p className="text-amber-800 dark:text-amber-300 text-xs mb-3">
										{language === "pt"
											? "Recomendamos preencher os seguintes campos para um CV mais completo:"
											: language === "es"
												? "Recomendamos rellenar los siguientes campos para un CV más completo:"
												: "We recommend filling in the following fields for a more complete CV:"}
									</p>
									<ul className="text-amber-800 dark:text-amber-300 text-xs space-y-1">
										{emptyFields.map((field) => (
											<li key={field} className="flex items-center gap-2">
												<span className="w-1.5 h-1.5 bg-amber-600 dark:bg-amber-500 rounded-full"></span>
												{field}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					)}

					{/* Donation section with Ko-fi link */}
					<div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-4 mb-6">
						<div className="flex items-center justify-center mb-3">
							<Heart className="w-8 h-8 text-sky-600 dark:text-sky-400 mr-2" />
							<span className="text-sky-600 dark:text-sky-400 font-medium text-sm">
								{t("donation.title")}
							</span>
						</div>
						<p className="text-sky-700 dark:text-sky-300 text-xs mb-4">
							{t("donation.message")}
						</p>
						<button
							type="button"
							onClick={handleDonationClick}
							className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center gap-2"
						>
							<Plus className="w-4 h-4" />
							{t("donation.button")}
						</button>
					</div>

					{/* Button to close the modal */}
					<button
						type="button"
						onClick={handleClose}
						className="w-full bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
					>
						{t("thank.you.close")}
					</button>
				</div>
			</div>
		</div>
	);
}
