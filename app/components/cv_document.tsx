import React from 'react';
import { CvData, CvColor, CvRenderSettings, CvTemplate } from '../types/cv';
import { Font } from '@react-pdf/renderer';
import { RenewedTemplate } from './cv_templates/renewed_template';

/**
 * Props interface for the CvDocument component
 */
interface CvDocumentProps extends CvData {
  /** Language for the document (pt or en) */
  lang?: string;
  /** Color theme for the template */
  color?: CvColor;
  /** Render settings for layout/header/photo */
  settings?: CvRenderSettings;
  /** Template selection */
  template?: CvTemplate;
}

/**
 * Main CV Document component
 * Selects and renders the appropriate template based on the template prop
 * @param props - Component props including all CV data, language, and template selection
 * @returns JSX element representing the selected CV template
 */
export function CvDocument({
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
  lang,
  color = 'blue',
  settings,
  template = 'renewed',
}: CvDocumentProps) {

  const registerCustomFont = () => {
    if (settings?.layout.fontFamily === 'Custom' && settings.layout.customFont?.dataUrl && settings.layout.customFont?.name) {
      try {
        Font.register({ family: settings.layout.customFont.name, src: settings.layout.customFont.dataUrl, fontStyle: 'normal', fontWeight: 'normal' });
      } catch {}
    }
  };
  registerCustomFont();

  const commonProps = {
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
    color,
    settings,
    lang,
  };

  // For PDF generation we must return a @react-pdf/renderer Document
  switch (template) {
    case 'renewed':
      return <RenewedTemplate {...commonProps} />;
  }
}
