"use client";

import { useEffect, useRef, useState } from "react";

interface PdfCanvasViewerProps {
	blob: Blob | null;
	scale?: number;
}

export function PdfCanvasViewer({ blob, scale = 1 }: PdfCanvasViewerProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const newContainerRef = useRef<HTMLDivElement | null>(null);
	const [containerWidth, setContainerWidth] = useState<number>(0);

	// Para preservar a posição do scroll
	const scrollPosition = useRef<{ top: number; left: number }>({
		top: 0,
		left: 0,
	});

	// Observe actual changes in container size.
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const observer = new window.ResizeObserver((entries) => {
			for (const entry of entries) {
				const width = entry.contentRect.width;
				setContainerWidth(width);
			}
		});
		observer.observe(container);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		let canceled = false;

		async function render() {
			if (!blob || !containerRef.current || !newContainerRef.current) return;
			const newContainer = newContainerRef.current;
			newContainer.innerHTML = "";

			// Save scroll position before updating
			const container = containerRef.current;
			if (container) {
				scrollPosition.current.top = container.scrollTop;
				scrollPosition.current.left = container.scrollLeft;
			}

			const pdfjsLib = (await import(
				"pdfjs-dist/build/pdf.mjs"
			)) as typeof import("pdfjs-dist");

			if (typeof window !== "undefined") {
				if (!pdfjsLib.GlobalWorkerOptions.workerPort) {
					try {
						const worker = new Worker(
							new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
							{ type: "module" },
						);
						pdfjsLib.GlobalWorkerOptions.workerPort = worker;
					} catch {
						pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
							"pdfjs-dist/build/pdf.worker.min.mjs",
							import.meta.url,
						).toString();
					}
				}
			}

			const data = await blob.arrayBuffer();
			const loadingTask = pdfjsLib.getDocument({ data });
			const pdf = await loadingTask.promise;

			// Use observed container width
			const width = containerWidth || container?.clientWidth || 800;

			for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
				if (canceled) return;
				const page = await pdf.getPage(pageNum);
				const baseViewport = page.getViewport({ scale: 1 });
				const fitScale = width / baseViewport.width;
				const viewport = page.getViewport({
					scale: Math.max(0.1, scale * fitScale),
				});

				const canvas = document.createElement("canvas");
				const dpr = Math.max(window.devicePixelRatio || 1, 1);
				canvas.style.width = "100%";
				canvas.style.height = `${Math.ceil(viewport.height)}px`;
				canvas.width = Math.ceil(viewport.width * dpr);
				canvas.height = Math.ceil(viewport.height * dpr);
				canvas.style.display = "block";
				canvas.style.margin = "0 auto 12px auto";
				const ctx = canvas.getContext("2d");
				if (!ctx) continue;
				ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
				const renderTask = page.render({
					canvas: null,
					canvasContext: ctx,
					viewport,
				});
				await renderTask.promise;
				if (canceled) return;

				newContainer.appendChild(canvas);
			}

			// Swap containers
			if (!canceled && container) {
				container.innerHTML = "";
				container.append(...Array.from(newContainer.children));
				// Restaura a posição do scroll
				container.scrollTop = scrollPosition.current.top;
				container.scrollLeft = scrollPosition.current.left;
			}
		}

		render();

		return () => {
			canceled = true;
		};
	}, [blob, scale, containerWidth]);

	return (
		<div className="relative w-full h-full flex flex-col">
			{/* Hidden container for rendering new PDF */}
			<div
				ref={newContainerRef}
				className="absolute invisible"
				style={{ pointerEvents: "none" }}
			/>

			{/* Visible container */}
			<div
				ref={containerRef}
				className="w-full h-full overflow-auto bg-white dark:bg-zinc-800 p-2 flex flex-col items-center border border-gray-200 dark:border-zinc-700 rounded-lg"
				style={{ contain: "content", minWidth: 0 }}
			/>
		</div>
	);
}
