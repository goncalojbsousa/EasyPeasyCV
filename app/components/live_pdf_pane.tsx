"use client";

import { pdf } from "@react-pdf/renderer";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { BREAKPOINTS, useIsMobile } from "../utils/useIsMobile";
import { CvDocument, type CvRenderProps } from "./cv_document";
import { PdfCanvasViewer } from "./pdf/pdf_canvas_viewer";

/**
 * Live PDF preview rendered next to the form on desktop. Regenerates the PDF
 * shortly after the CV stops changing.
 */
export function LivePdfPane({ data, lang }: CvRenderProps) {
	const { t } = useLanguage();
	const isMobile = useIsMobile(BREAKPOINTS.lg);
	const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const doc = useMemo(
		() => <CvDocument data={data} lang={lang} />,
		[data, lang],
	);

	// Generate a PDF blob whenever debounced data changes
	useEffect(() => {
		if (isMobile) {
			return;
		}

		let canceled = false;
		const timeoutId = window.setTimeout(() => {
			const generate = async () => {
				setLoading(true);
				setError(null);
				try {
					const blob = await pdf(doc).toBlob();
					if (canceled) return;
					setPdfBlob(blob);
				} catch (e) {
					console.error("PDF preview generation error:", e);
					if (!canceled) {
						const msg = e instanceof Error ? e.message : JSON.stringify(e);
						setError(`"PDF preview generation error: ${msg}`);
					}
				} finally {
					if (!canceled) setLoading(false);
				}
			};

			generate();
		}, 500);

		return () => {
			canceled = true;
			window.clearTimeout(timeoutId);
		};
	}, [doc, isMobile]);

	if (isMobile) {
		return (
			<div className="w-full h-full flex items-center justify-center rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
				<div className="text-center p-4">
					<p className="text-sm text-gray-600 dark:text-gray-300">
						{t("live.preview.desktop.only")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col">
			<div className="flex-1 min-h-0">
				{!pdfBlob && loading ? (
					<div className="w-full h-full flex items-center justify-center">
						<div className="text-center">
							<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600 mx-auto mb-3" />
							<p className="text-sm text-gray-600 dark:text-gray-300">
								{t("live.preview.loading")}
							</p>
						</div>
					</div>
				) : !pdfBlob && error ? (
					<div className="w-full h-full flex items-center justify-center">
						<p className="text-sm text-red-600">{error}</p>
					</div>
				) : pdfBlob ? (
					<div className="w-full h-full overflow-hidden bg-transparent">
						<PdfCanvasViewer blob={pdfBlob} scale={1.0} />
					</div>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<p className="text-sm text-gray-600 dark:text-gray-300">
							{t("live.preview.empty")}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
