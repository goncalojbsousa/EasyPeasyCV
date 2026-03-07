"use client";

import { pdf } from "@react-pdf/renderer";
import {
	Download,
	ExternalLink,
	Eye,
	FileText,
	RefreshCw,
	X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type {
	CvColor,
	CvData,
	CvRenderSettings,
	CvTemplate,
} from "../../types/cv";
import { CvDocument } from "../cv_document";
import { PdfCanvasViewer } from "./pdf_canvas_viewer";

/**
 * Props interface for the PdfPreview component
 */
interface PdfPreviewProps extends CvData {
	/** Whether to show the preview */
	show?: boolean;
	/** Function to close the preview */
	onClose?: () => void;
	/** Language for the document (pt or en) */
	lang?: string;
	/** Selected CV template */
	template?: CvTemplate;
	/** Selected color theme */
	color?: CvColor;
	settings?: CvRenderSettings;
}

/**
 * PdfPreview component renders the actual PDF using iframe
 * Shows the exact PDF that will be generated
 */
/**
 * PDF Preview component
 * Displays a real-time preview of the CV as a PDF in a modal
 * @param props - Component props including CV data, modal controls, and language
 * @returns JSX element representing a modal with PDF preview
 */
export function PdfPreview({
	personalInfo,
	links,
	resume,
	experiences,
	education,
	skills,
	languages,
	certifications,
	projects,
	volunteers,
	customSections,
	show = false,
	onClose,
	lang = "pt",
	template = "professional",
	color = "blue",
	settings,
	sectionOrder,
}: PdfPreviewProps) {
	const { t } = useLanguage();
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [pdfSize, setPdfSize] = useState<number>(0);

	const generatePdf = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			// Create the PDF document component with all CV data
			const pdfDoc = (
				<CvDocument
					personalInfo={personalInfo}
					links={links}
					resume={resume}
					experiences={experiences}
					education={education}
					skills={skills}
					languages={languages}
					certifications={certifications}
					projects={projects}
					volunteers={volunteers}
					customSections={customSections}
					lang={lang}
					template={template}
					color={color}
					settings={settings}
					sectionOrder={sectionOrder}
				/>
			);

			// Generate a PDF blob from the document
			const blob = await pdf(pdfDoc).toBlob();
			setPdfSize(blob.size);
			setPdfBlob(blob);

			// Create a URL from the PDF blob for preview
			const url = URL.createObjectURL(blob);
			setPdfUrl(url);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : t("pdf.preview.error.unknown");
			setError(`${t("pdf.preview.error.generate")}: ${errorMessage}`);
		} finally {
			setLoading(false);
		}
	}, [
		personalInfo,
		links,
		resume,
		experiences,
		education,
		skills,
		languages,
		certifications,
		projects,
		volunteers,
		customSections,
		lang,
		template,
		color,
		settings,
		sectionOrder,
		t,
	]);

	// Detect if the device is mobile to adjust PDF preview behavior
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Generate PDF whenever the modal is shown or any relevant data changes
	useEffect(() => {
		if (show) {
			generatePdf();
		}
	}, [show, generatePdf]);

	// Prevent body scroll when the modal is open
	useEffect(() => {
		if (show) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [show]);

	// Cleanup the PDF URL when the component unmounts or URL changes
	useEffect(() => {
		return () => {
			if (pdfUrl) {
				URL.revokeObjectURL(pdfUrl);
			}
		};
	}, [pdfUrl]);

	if (!show) return null;

	return (
		<div
			className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2"
			role="dialog"
			aria-modal="true"
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose?.();
				if (e.key === "Enter" || e.key === " ") onClose?.();
			}}
		>
			<div
				className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl max-w-[min(95vw,1600px)] w-full h-[98vh] overflow-hidden flex flex-col"
				role="document"
				tabIndex={-1}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="bg-gray-50 dark:bg-zinc-900 px-6 py-4 border-b border-gray-200/80 dark:border-zinc-700/60 rounded-t-lg transition-colors duration-300 flex items-center justify-between">
					<h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
						<span className="text-sky-600">
							<Eye className="w-5 h-5" />
						</span>
						{t("pdf.preview.title")}
					</h2>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={generatePdf}
							disabled={loading}
							className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
							title={t("pdf.preview.refresh") || "Atualizar preview"}
						>
							<RefreshCw
								className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
							/>
						</button>
						<button
							type="button"
							onClick={onClose}
							className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
						>
							<X className="w-6 h-6" />
						</button>
					</div>
				</div>

				{/* PDF Content */}
				<div className="flex-1 overflow-hidden p-2 bg-gray-50 dark:bg-zinc-800">
					{loading ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
								<p className="text-gray-600 dark:text-gray-400">
									{t("pdf.preview.loading")}
								</p>
							</div>
						</div>
					) : error ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<p className="text-red-600 mb-4">{error}</p>
								<button
									type="button"
									onClick={generatePdf}
									className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-300"
								>
									{t("pdf.preview.retry")}
								</button>
							</div>
						</div>
					) : pdfUrl ? (
						<div className="h-full w-full">
							{isMobile ? (
								// Mobile: Show download and open options instead of iframe
								<div className="flex flex-col items-center justify-center h-full p-6 text-center">
									<div className="max-w-md">
										<div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
											<FileText className="w-8 h-8 text-sky-600" />
										</div>
										<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
											{t("pdf.preview.mobile.success")}
										</h3>
										<p className="text-gray-600 dark:text-gray-400 mb-6">
											{t("pdf.preview.mobile.info")}
										</p>
										<div className="space-y-3">
											<a
												href={pdfUrl}
												download="curriculo.pdf"
												className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors duration-300"
											>
												<Download className="w-5 h-5" />
												{t("pdf.preview.download")}
											</a>
											<a
												href={pdfUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors duration-300"
											>
												<ExternalLink className="w-5 h-5" />
												{t("pdf.preview.open.new.tab")}
											</a>
										</div>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
											{t("pdf.preview.size")}: {(pdfSize / 1024).toFixed(1)} KB
										</p>
									</div>
								</div>
							) : (
								<div className="w-full h-full overflow-hidden bg-transparent">
									<PdfCanvasViewer blob={pdfBlob} scale={1.0} />
								</div>
							)}
						</div>
					) : (
						<div className="flex items-center justify-center h-full">
							<p className="text-gray-600">{t("pdf.preview.error.loading")}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
