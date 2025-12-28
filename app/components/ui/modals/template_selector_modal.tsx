"use client";

import { Eye, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { CvTemplate } from "../../../types/cv";
import { Icons } from "../icons";

interface TemplateSelectorModalProps {
	show: boolean;
	selectedTemplate: CvTemplate;
	onSelect: (template: CvTemplate) => void;
	onClose: () => void;
}

const templatePreviews: Record<
	CvTemplate,
	{
		img: string;
		nameKey: string;
		descriptionKey: string;
		icon: React.ReactNode;
	}
> = {
	professional: {
		img: "/professional_preview.webp",
		nameKey: "template.professional.name",
		descriptionKey: "template.professional.description",
		icon: Icons.professionalExperience,
	},
	timeline: {
		img: "/timeline_preview.webp",
		nameKey: "template.timeline.name",
		descriptionKey: "template.timeline.description",
		icon: Icons.projects,
	},
	classic: {
		img: "/classic_preview.webp",
		nameKey: "template.classic.name",
		descriptionKey: "template.classic.description",
		icon: Icons.academicEducation,
	},
};

export function TemplateSelectorModal({
	show,
	selectedTemplate,
	onSelect,
	onClose,
}: TemplateSelectorModalProps) {
	const { t } = useLanguage();
	const [preview, setPreview] = useState<CvTemplate | null>(null);

	if (!show) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center z-50 p-4 overflow-y-auto">
			<div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl w-full max-w-5xl relative overflow-hidden flex flex-col max-h-[90vh]">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
					<h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
						{t("template.selector")}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
						aria-label="Close"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Content */}
				<div className="p-4 bg-gray-50 dark:bg-zinc-800 flex-1 overflow-y-auto">
					{/* Grid of templates */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{Object.entries(templatePreviews).map(([key, data]) => {
							const templateKey = key as CvTemplate;
							const isSelected = selectedTemplate === templateKey;
							return (
								<div key={templateKey} className="relative group">
									<button
										type="button"
										onClick={() => {
											onSelect(templateKey);
											onClose();
										}}
										className={`w-full text-left rounded-2xl overflow-hidden border-2 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-zinc-900 hover:shadow-lg ${isSelected ? "border-sky-500 ring-2 ring-sky-200 dark:ring-sky-900/30 scale-[1.025]" : "border-gray-200 dark:border-zinc-700"}`}
										aria-pressed={isSelected}
										style={{ minHeight: 260 }}
									>
										<div className="relative w-full h-44">
											<Image
												src={data.img}
												alt={`${t(data.nameKey)} preview`}
												fill
												className="object-cover transition-transform duration-300 group-hover:scale-[1.03] rounded-t-2xl"
												sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											/>
										</div>
										<div className="px-4 pt-4">
											<h4 className="font-semibold text-base text-gray-900 dark:text-white">
												{t(data.nameKey)}
											</h4>
										</div>
										<p className="px-4 pb-4 pt-2 text-sm text-gray-600 dark:text-gray-400 min-h-[40px]">
											{t(data.descriptionKey)}
										</p>
										{isSelected && (
											<div className="absolute top-3 left-3 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
												{t("template.selected") || "Selecionado"}
											</div>
										)}
									</button>
									<button
										type="button"
										aria-label={`Preview ${t(data.nameKey)}`}
										onClick={(e) => {
											e.stopPropagation();
											setPreview(templateKey);
										}}
										className="absolute top-3 right-3 z-10 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-md border border-gray-200 dark:border-zinc-700 hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors"
										style={{ pointerEvents: "auto" }}
									>
										<Eye className="w-5 h-5 text-sky-600 dark:text-sky-400" />
									</button>
								</div>
							);
						})}
					</div>
				</div>

				{/* Fullscreen preview modal */}
				{preview && (
					<div
						className="fixed inset-0 z-[60] flex items-center justify-center p-0"
						role="dialog"
						aria-modal="true"
					>
						<button
							type="button"
							onClick={() => setPreview(null)}
							className="absolute inset-0 bg-black/70"
							aria-label="Close preview"
						/>
						<div className="relative bg-white dark:bg-zinc-900 shadow-2xl w-screen h-screen overflow-hidden z-[61]">
							<button
								type="button"
								onClick={() => setPreview(null)}
								className="absolute top-3 right-3 z-[62] text-white/90 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-1.5"
								aria-label="Close preview"
							>
								<X className="w-5 h-5" />
							</button>
							<div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-800 relative">
								<Image
									src={templatePreviews[preview].img}
									alt={`${t(templatePreviews[preview].nameKey)} full preview`}
									fill
									className="object-contain"
									sizes="100vw"
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
