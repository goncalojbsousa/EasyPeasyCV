"use client";

import { Info, Loader, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { AutoResizeTextarea } from "./ui/auto_resize_textarea";

/**
 * Job Analysis component
 * Allows users to input job posting text and receive personalized advice
 * @returns JSX element representing the job analysis interface
 */
export function JobAnalysis() {
	const { t } = useLanguage();
	const [jobText, setJobText] = useState("");
	const [analysis, setAnalysis] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [showAnalysis, setShowAnalysis] = useState(false);

	/**
	 * Analyzes the job posting text and generates personalized advice
	 */
	const analyzeJobPosting = async () => {
		if (!jobText.trim()) return;

		setIsAnalyzing(true);
		setShowAnalysis(false);

		try {
			// Simulate analysis delay for better UX
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Generate analysis based on job text content
			const analysisResult = generateJobAnalysis(jobText);
			setAnalysis(analysisResult);
			setShowAnalysis(true);
		} catch (error) {
			console.error("Error analyzing job posting:", error);
			setAnalysis(t("job.analysis.error"));
			setShowAnalysis(true);
		} finally {
			setIsAnalyzing(false);
		}
	};

	/**
	 * Generates personalized job analysis based on job posting text
	 * @param text - The job posting text to analyze
	 * @returns Analysis result as string
	 */
	const generateJobAnalysis = (text: string): string => {
		const lowerText = text.toLowerCase();
		let out = "";

		// Helper: count occurrences of any synonym in text
		const countAny = (syns: string[]) =>
			syns.reduce(
				(acc, s) =>
					acc +
					(lowerText.match(
						new RegExp(
							`\\b${s.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`,
							"g",
						),
					)?.length || 0),
				0,
			);

		// Canonical skills with synonyms
		const skillsCatalog: { label: string; synonyms: string[] }[] = [
			{ label: "React", synonyms: ["react", "next.js", "nextjs"] },
			{
				label: "TypeScript/JavaScript",
				synonyms: ["typescript", "javascript", "js", "ts"],
			},
			{ label: "Node.js/Express", synonyms: ["node", "node.js", "express"] },
			{ label: "Python", synonyms: ["python", "django", "flask"] },
			{ label: "Java", synonyms: ["java", "spring", "spring boot"] },
			{
				label: "SQL/Databases",
				synonyms: [
					"sql",
					"postgres",
					"mysql",
					"database",
					"databases",
					"mongodb",
					"nosql",
				],
			},
			{
				label: "Cloud (AWS/Azure/GCP)",
				synonyms: ["aws", "azure", "gcp", "cloud"],
			},
			{
				label: "Docker/Kubernetes",
				synonyms: ["docker", "kubernetes", "k8s", "containers"],
			},
			{
				label: "CI/CD",
				synonyms: ["ci/cd", "pipeline", "github actions", "gitlab ci"],
			},
			{
				label: "Testing",
				synonyms: [
					"testing",
					"jest",
					"cypress",
					"playwright",
					"unit test",
					"integration test",
				],
			},
			{
				label: "Version Control (Git)",
				synonyms: ["git", "github", "gitlab", "bitbucket"],
			},
			{ label: "Agile/Scrum", synonyms: ["agile", "scrum", "kanban"] },
		];

		// Compute matches and suggestions
		const matchedSkills: { label: string; hits: number }[] = [];
		skillsCatalog.forEach((s) => {
			const hits = countAny(s.synonyms);
			if (hits > 0) matchedSkills.push({ label: s.label, hits });
		});

		// Experience level + years extraction
		let experienceLevel: "entry" | "mid" | "senior" = "entry";
		if (/\b(senior|lead|principal|staff)\b/.test(lowerText))
			experienceLevel = "senior";
		else if (/\b(mid|intermediate|pleno|3\+|5\+)\b/.test(lowerText))
			experienceLevel = "mid";

		// Years of experience (supports EN/PT/ES with accents)
		const yearsMatch = lowerText.match(
			/\b\d{1,2}\s*\+?\s*(?:years?|anos|años|yrs?)\b/u,
		);
		const yearsText = yearsMatch ? yearsMatch[0] : "";

		// Job type detection
		const isRemote = /\b(remote|teletrabalho|remoto)\b/u.test(lowerText);
		const isHybrid = /\b(hybrid|híbrido|hibrido)\b/u.test(lowerText);
		const isOnsite = /\b(onsite|on-site|presencial)\b/u.test(lowerText);
		const isPartTime =
			/\b(part[-\s]?time|meio\s*período|meio\s*periodo|media\s*jornada)\b/u.test(
				lowerText,
			);
		const isContract =
			/\b(contract|contrato|freelance|temporário|temporario)\b/u.test(
				lowerText,
			);

		// Education / languages / salary
		const requiresDegree = /\b(bachelor|licenciatura|degree)\b/u.test(
			lowerText,
		);
		const requiresMasters = /\b(master|mestrado)\b/u.test(lowerText);
		const langs: string[] = [];
		if (/\b(?:english|inglês|ingles)\b/u.test(lowerText)) langs.push("English");
		if (/\b(?:portuguese|português|portugues)\b/u.test(lowerText))
			langs.push("Portuguese");
		if (/\b(?:spanish|español|espanhol)\b/u.test(lowerText))
			langs.push("Spanish");

		// Build analysis
		out += `## ${t("job.analysis.skills.title")}\n\n`;
		if (matchedSkills.length) {
			out += `${t("job.analysis.skills.found")}:\n`;
			const sortedSkills = matchedSkills.sort((a, b) => b.hits - a.hits);
			for (const s of sortedSkills) {
				out += `• ${s.label} (${s.hits})\n`;
			}
			out += `\n${t("job.analysis.skills.advice")}\n\n`;
		} else {
			out += `${t("job.analysis.skills.notFound")}\n\n`;
		}

		out += `## ${t("job.analysis.experience.title")}\n\n`;
		if (experienceLevel === "senior")
			out += `${t("job.analysis.experience.senior")}\n`;
		else if (experienceLevel === "mid")
			out += `${t("job.analysis.experience.mid")}\n`;
		else out += `${t("job.analysis.experience.entry")}\n`;
		if (yearsText) out += `• Mentioned experience: ${yearsText}\n\n`;
		else
			out += `• Consider adding explicit years of experience if you have them.\n\n`;

		out += `## ${t("job.analysis.type.title")}\n\n`;
		if (isRemote) out += `${t("job.analysis.type.remote")}\n`;
		else if (isHybrid) out += `Hybrid work model indicated.\n`;
		else if (isOnsite) out += `On-site role indicated.\n`;
		else out += `${t("job.analysis.type.fullTime")}\n`;
		if (isPartTime) out += `• Part-time possibility.\n`;
		if (isContract) out += `• Contract-based engagement.\n`;
		out += `\n`;

		out += `## Additional Signals\n\n`;
		if (langs.length) out += `• Languages: ${langs.join(", ")}\n`;
		if (requiresMasters || requiresDegree) {
			out += `• Education: ${requiresMasters ? "Masters" : "Bachelors"} preferred/required\n`;
		}
		if (!langs.length && !requiresDegree)
			out += `• No explicit language/education requirements detected.\n`;
		out += `\n`;

		out += `## ${t("job.analysis.general.title")}\n\n`;
		out += `${t("job.analysis.general.advice")}\n`;
		out += `\n• Tip: Mirror the exact keywords above in your CV (skills, seniority, tools).`;

		return out;
	};

	/**
	 * Clears the job analysis form
	 */
	const clearAnalysis = () => {
		setJobText("");
		setAnalysis("");
		setShowAnalysis(false);
	};

	return (
		<div
			id="job-analysis-section"
			className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg shadow-sm p-4 sm:p-6"
		>
			<div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
				<div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
					<Sparkles className="w-6 h-6 text-white" />
				</div>
				<div>
					<h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
						{t("job.analysis.title")}
					</h2>
					<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
						{t("job.analysis.subtitle")}
					</p>
				</div>
			</div>

			<div className="space-y-4">
				{/* Job posting input area */}
				<div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-purple-100 dark:border-purple-900 shadow-sm">
					<label
						htmlFor="jobText"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						{t("job.analysis.input.label")}
					</label>
					<AutoResizeTextarea
						id="jobText"
						value={jobText}
						onChange={(e) => setJobText(e.target.value)}
						placeholder={t("job.analysis.input.placeholder")}
						className="w-full min-h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-800 dark:text-gray-100 text-sm"
						disabled={isAnalyzing}
						minHeight={120}
					/>
					<div className="flex flex-col sm:flex-row gap-2 mt-3">
						<button
							type="button"
							onClick={analyzeJobPosting}
							disabled={!jobText.trim() || isAnalyzing}
							className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
						>
							{isAnalyzing ? (
								<div className="flex items-center justify-center gap-2">
									<Loader className="animate-spin h-4 w-4" />
									{t("job.analysis.analyzing")}
								</div>
							) : (
								t("job.analysis.analyze")
							)}
						</button>
						{jobText && (
							<button
								type="button"
								onClick={clearAnalysis}
								className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 text-sm"
							>
								{t("job.analysis.clear")}
							</button>
						)}
					</div>
				</div>

				{showAnalysis && (
					<div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-purple-100 dark:border-purple-900 shadow-sm">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-purple-600" />
							{t("job.analysis.results")}
						</h3>
						<div className="prose prose-sm dark:prose-invert max-w-none">
							<pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans bg-gray-50 dark:bg-zinc-800 p-3 rounded border">
								{analysis}
							</pre>
						</div>
					</div>
				)}

				<div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
					<div className="flex items-start gap-3">
						<Info className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mt-0.5 flex-shrink-0" />
						<div>
							<p className="text-xs sm:text-sm text-purple-800 dark:text-purple-300 font-medium">
								{t("job.analysis.tips.title")}
							</p>
							<p className="text-xs sm:text-sm text-purple-700 dark:text-purple-400 mt-1">
								{t("job.analysis.tips.content")}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
