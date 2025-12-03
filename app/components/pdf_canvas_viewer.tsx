"use client";

import React, { useEffect, useRef } from "react";

interface PdfCanvasViewerProps {
  blob: Blob | null;
  scale?: number;
}

export function PdfCanvasViewer({ blob, scale = 1 }: PdfCanvasViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let canceled = false;

    async function render() {
      if (!blob || !containerRef.current) return;

      const container = containerRef.current;
      container.innerHTML = "";

      const pdfjsLib: any = await import("pdfjs-dist/build/pdf.mjs");

      if (typeof window !== "undefined") {
        if (!pdfjsLib.GlobalWorkerOptions.workerPort) {
          try {
            const worker = new Worker(
              new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
              { type: "module" }
            );
            pdfjsLib.GlobalWorkerOptions.workerPort = worker;
          } catch {
            pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
              "pdfjs-dist/build/pdf.worker.min.mjs",
              import.meta.url
            ).toString();
          }
        }
      }

      const data = await blob.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data });
      const pdf = await loadingTask.promise;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        if (canceled) return;
        const page = await pdf.getPage(pageNum);
        const baseViewport = page.getViewport({ scale: 1 });
        const width = container.clientWidth || baseViewport.width;
        const fitScale = width / baseViewport.width;
        const viewport = page.getViewport({ scale: Math.max(0.1, scale * fitScale) });

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
        const renderTask = page.render({ canvasContext: ctx, viewport });
        await renderTask.promise;
        if (canceled) return;

        container.appendChild(canvas);
      }
    }

    render();

    return () => {
      canceled = true;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [blob, scale]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto bg-gray-50 dark:bg-zinc-900 p-2"
      style={{ contain: "content" }}
    />
  );
}
