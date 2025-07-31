'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Job Analysis component
 * Allows users to input job posting text and receive personalized advice
 * @returns JSX element representing the job analysis interface
 */
export function JobAnalysis() {
  const { t } = useLanguage();
  const [jobText, setJobText] = useState('');
  const [analysis, setAnalysis] = useState('');
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
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate analysis based on job text content
      const analysisResult = generateJobAnalysis(jobText);
      setAnalysis(analysisResult);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Error analyzing job posting:', error);
      setAnalysis(t('job.analysis.error'));
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
    let analysis = '';

    // Analyze required skills
    const skills = [];
    if (lowerText.includes('react') || lowerText.includes('javascript')) skills.push('React/JavaScript');
    if (lowerText.includes('node') || lowerText.includes('express')) skills.push('Node.js/Express');
    if (lowerText.includes('python')) skills.push('Python');
    if (lowerText.includes('java')) skills.push('Java');
    if (lowerText.includes('sql') || lowerText.includes('database')) skills.push('SQL/Databases');
    if (lowerText.includes('aws') || lowerText.includes('cloud')) skills.push('Cloud Computing');
    if (lowerText.includes('docker') || lowerText.includes('kubernetes')) skills.push('Containerization');
    if (lowerText.includes('git')) skills.push('Version Control');
    if (lowerText.includes('agile') || lowerText.includes('scrum')) skills.push('Agile Methodologies');

    // Analyze experience level
    let experienceLevel = 'entry';
    if (lowerText.includes('senior') || lowerText.includes('lead') || lowerText.includes('principal')) {
      experienceLevel = 'senior';
    } else if (lowerText.includes('mid') || lowerText.includes('intermediate') || lowerText.includes('3+') || lowerText.includes('5+')) {
      experienceLevel = 'mid';
    }

    // Analyze job type
    let jobType = 'full-time';
    if (lowerText.includes('remote') || lowerText.includes('teletrabalho')) jobType = 'remote';
    if (lowerText.includes('part-time') || lowerText.includes('parte')) jobType = 'part-time';

    // Generate analysis
    analysis += `## ${t('job.analysis.skills.title')}\n\n`;
    if (skills.length > 0) {
      analysis += `${t('job.analysis.skills.found')}:\n`;
      skills.forEach(skill => {
        analysis += `• ${skill}\n`;
      });
      analysis += `\n${t('job.analysis.skills.advice')}\n\n`;
    } else {
      analysis += `${t('job.analysis.skills.notFound')}\n\n`;
    }

    analysis += `## ${t('job.analysis.experience.title')}\n\n`;
    if (experienceLevel === 'senior') {
      analysis += `${t('job.analysis.experience.senior')}\n\n`;
    } else if (experienceLevel === 'mid') {
      analysis += `${t('job.analysis.experience.mid')}\n\n`;
    } else {
      analysis += `${t('job.analysis.experience.entry')}\n\n`;
    }

    analysis += `## ${t('job.analysis.type.title')}\n\n`;
    if (jobType === 'remote') {
      analysis += `${t('job.analysis.type.remote')}\n\n`;
    } else if (jobType === 'part-time') {
      analysis += `${t('job.analysis.type.partTime')}\n\n`;
    } else {
      analysis += `${t('job.analysis.type.fullTime')}\n\n`;
    }

    analysis += `## ${t('job.analysis.general.title')}\n\n`;
    analysis += `${t('job.analysis.general.advice')}\n\n`;

    return analysis;
  };

  /**
   * Clears the job analysis form
   */
  const clearAnalysis = () => {
    setJobText('');
    setAnalysis('');
    setShowAnalysis(false);
  };

     return (
     <div id="job-analysis-section" className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{t('job.analysis.title')}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('job.analysis.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Job posting input */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-purple-100 dark:border-purple-900 shadow-sm">
          <label htmlFor="jobText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('job.analysis.input.label')}
          </label>
                     <textarea
             id="jobText"
             value={jobText}
             onChange={(e) => setJobText(e.target.value)}
             placeholder={t('job.analysis.input.placeholder')}
             className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-800 dark:text-gray-100 text-sm resize-y min-h-32 max-h-96"
             disabled={isAnalyzing}
           />
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <button
              onClick={analyzeJobPosting}
              disabled={!jobText.trim() || isAnalyzing}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('job.analysis.analyzing')}
                </div>
              ) : (
                t('job.analysis.analyze')
              )}
            </button>
            {jobText && (
              <button
                onClick={clearAnalysis}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 text-sm"
              >
                {t('job.analysis.clear')}
              </button>
            )}
          </div>
        </div>

        {/* Analysis results */}
        {showAnalysis && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-purple-100 dark:border-purple-900 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-purple-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
              {t('job.analysis.results')}
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans bg-gray-50 dark:bg-zinc-800 p-3 rounded border">
                {analysis}
              </pre>
            </div>
          </div>
        )}

        {/* Tips section */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mt-0.5 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <div>
              <p className="text-xs sm:text-sm text-purple-800 dark:text-purple-300 font-medium">{t('job.analysis.tips.title')}</p>
              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-400 mt-1">
                {t('job.analysis.tips.content')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 