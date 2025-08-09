import React from 'react';
import { CvData, CvColor } from '../types/cv';
import { ClassicTemplate } from './cv_templates/classic_template';
import { ModernTemplate } from './cv_templates/modern_template';
import { CreativeTemplate } from './cv_templates/creative_template';
import { MinimalTemplate } from './cv_templates/minimal_template';
import { TimelineTemplate } from './cv_templates/timeline_template';
import { ProfessionalTemplate } from './cv_templates/professional_template';

/**
 * Props interface for the CvDocument component
 */
interface CvDocumentProps extends CvData {
  /** Language for the document (pt or en) */
  lang?: string;
  /** Color theme for the template */
  color?: CvColor;
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
  template = 'classic',
  color = 'blue',
}: CvDocumentProps) {

  // Select the appropriate template based on the template prop
  switch (template) {
    case 'professional':
      return (
        <ProfessionalTemplate
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
          lang={lang}
          color={color}
        />
      );
    case 'minimal':
      return (
        <MinimalTemplate
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
          lang={lang}
          color={color}
        />
      );

    case 'timeline':
      return (
        <TimelineTemplate
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
          lang={lang}
          color={color}
        />
      );
    case 'modern':
      return (
        <ModernTemplate
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
          lang={lang}
          color={color}
        />
      );

    case 'creative':
      return (
        <CreativeTemplate
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
          lang={lang}
          color={color}
        />
      );



    case 'classic':
    default:
      return (
        <ClassicTemplate
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
          lang={lang}
        />
      );
  }
}
