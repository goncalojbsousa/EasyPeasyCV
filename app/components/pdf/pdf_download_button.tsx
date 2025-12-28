"use client";

import { pdf } from "@react-pdf/renderer";
import type React from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import type {
	CvColor,
	CvData,
	CvRenderSettings,
	CvTemplate,
} from "../../types/cv";
import { CvDocument } from "../cv_document";

/**
 * Props interface for the PdfDownloadButton component
 */
interface PdfDownloadButtonProps extends CvData {
	/** Language for the PDF document (pt or en) */
	lang?: string;
	/** Selected CV template */
	template?: CvTemplate;
	/** Selected color theme */
	color?: CvColor;
	/** Custom children to render inside the button */
	children?: React.ReactNode;
	/** Callback function to show thank you modal after PDF generation */
	onPdfGenerated?: () => void;
	settings?: CvRenderSettings;
}

/**
 * Public methods that can be called via ref
 */
export interface PdfDownloadButtonHandle {
	generatePdf: () => Promise<void>;
}

/**
 * PDF Download Button component using direct blob generation
 * Generates and downloads a PDF version of the CV
 * Fixes the "Portable Document" issue by handling blob download directly
 */
const PdfDownloadButton = forwardRef<
	PdfDownloadButtonHandle,
	PdfDownloadButtonProps
>((props, ref) => {
	const { children, onPdfGenerated, ...pdfProps } = props;
	const [isLoading, setIsLoading] = useState(false);

	const handleGenerateAndDownload = async () => {
		setIsLoading(true);
		try {
			const pdfDoc = (
				<CvDocument
					personalInfo={pdfProps.personalInfo}
					links={pdfProps.links}
					resume={pdfProps.resume}
					experiences={pdfProps.experiences}
					education={pdfProps.education}
					skills={pdfProps.skills}
					languages={pdfProps.languages}
					certifications={pdfProps.certifications}
					projects={pdfProps.projects}
					volunteers={pdfProps.volunteers}
					customSections={pdfProps.customSections}
					lang={pdfProps.lang}
					template={pdfProps.template}
					color={pdfProps.color}
					settings={pdfProps.settings}
					sectionOrder={pdfProps.sectionOrder}
				/>
			);

			const blob = await pdf(pdfDoc).toBlob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "ats_cv.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			// Call the callback after a short delay
			if (onPdfGenerated) {
				setTimeout(() => {
					onPdfGenerated();
				}, 500);
			}
		} catch (error) {
			console.error("Error generating PDF:", error);
			alert("Erro ao gerar PDF. Por favor, tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	// Expose generatePdf method via ref
	useImperativeHandle(ref, () => ({
		generatePdf: handleGenerateAndDownload,
	}));

	// When children are provided, render them as-is (for dropdown items)
	// The parent component will handle the button wrapper and onClick
	// Otherwise, render as a button with default styling
	if (children) {
		return <>{children}</>;
	}

	return (
		<button
			type="button"
			onClick={handleGenerateAndDownload}
			disabled={isLoading}
			className="inline-flex items-center justify-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{isLoading ? "Gerando PDF..." : "Gerar Currículo em PDF"}
		</button>
	);
});

PdfDownloadButton.displayName = "PdfDownloadButton";

export default PdfDownloadButton;
