'use client';

import { CheckCircle, AlertTriangle, Info, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * ATS Explanation component
 * Explains what ATS is and why it's important for CV optimization
 * @returns JSX element representing the ATS explanation section
 */
export function AtsExplanation() {
  const { t } = useLanguage();

  const atsInfo = [
    {
      title: t('ats.explanation.what.title'),
      description: t('ats.explanation.what.description'),
      icon: (
        <CheckCircle className="w-5 h-5" />
      )
    },
    {
      title: t('ats.explanation.why.title'),
      description: t('ats.explanation.why.description'),
      warning: t('ats.explanation.why.warning'),
      icon: (
        <AlertTriangle className="w-5 h-5" />
      )
    }
  ];

  return (
         <div id="ats-explanation-section" className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-sm p-4 sm:p-6">
       <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
         <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{t('ats.explanation.title')}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('ats.explanation.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {atsInfo.map((info, index) => (
                     <div key={index} className="bg-white dark:bg-zinc-900 rounded-lg p-3 sm:p-4 border border-emerald-100 dark:border-emerald-900 shadow-sm">
             <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-start gap-2">
               <span className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="text-sm sm:text-base">{info.title}</span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm ml-7 sm:ml-8 mb-3">{info.description}</p>
            
            {/* Warning message for the 'why' section */}
            {info.warning && (
              <div className="ml-7 sm:ml-8 mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-medium">{info.warning}</p>
                </div>
              </div>
            )}


          </div>
        ))}

                 {/* Extra information section about ATS */}
         <div className="mt-6 p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
           <div className="flex items-start gap-3">
             <Info className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
             <div>
               <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-medium">{t('ats.explanation.extra.title')}</p>
               <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                {t('ats.explanation.extra.content')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 