"use client";

import { pdf } from "@react-pdf/renderer";
import type React from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { CvDocument, type CvRenderProps } from "../cv_document";

/**
 * Props interface for the PdfDownloadButton component
 */
interface PdfDownloadButtonProps extends CvRenderProps {
	/** Custom children to render inside the button */
	children?: React.ReactNode;
	/** Callback function to show thank you modal after PDF generation */
	onPdfGenerated?: () => void;
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
	const { children, onPdfGenerated, data, lang } = props;
	const { t } = useLanguage();
	const [isLoading, setIsLoading] = useState(false);

	const handleGenerateAndDownload = async () => {
		setIsLoading(true);
		try {
			const blob = await pdf(<CvDocument data={data} lang={lang} />).toBlob();
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
			alert(t("pdf.download.error"));
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
			{isLoading ? t("pdf.preview.loading") : t("pdf.preview.download")}
		</button>
	);
});

PdfDownloadButton.displayName = "PdfDownloadButton";

export default PdfDownloadButton;
