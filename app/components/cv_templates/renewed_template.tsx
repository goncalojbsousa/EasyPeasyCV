import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Image } from '@react-pdf/renderer';
import { CvData, CvRenderSettings, CvColor } from '../../types/cv';
import { getSocialUrl } from '../../utils/template-helpers';
import { computeMetrics, buildCommonStyles, getPhotoSize, PdfTextAlign } from '../../utils/template-styles';
import {
  getSectionOrder,
  renderSummarySection,
  renderExperienceSection,
  renderEducationSection,
  renderSkillsSection,
  renderLanguagesSection,
  renderCertificationsSection,
  renderProjectsSection,
  renderVolunteerSection,
  renderCustomSection,
} from '../../utils/section-renderers';

interface RenewedTemplateProps extends CvData {
  lang?: string;
  settings?: CvRenderSettings;
  color?: CvColor;
}

const buildStyles = (settings?: CvRenderSettings, color: CvColor = 'blue') => {
  const metrics = computeMetrics(settings, color);
  const commonStyles = buildCommonStyles(metrics, settings);
  const photoSize = getPhotoSize(settings?.photo?.aspectRatio);
  
  const specificStyles = StyleSheet.create({
    header: { flexDirection: 'column', marginBottom: 8 * metrics.singlePageMult },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    contactRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', color: '#000000', fontSize: 9 * metrics.finalScale, marginBottom: 6 * metrics.singlePageMult },
    contactItem: { marginHorizontal: 6 },
    headerLeft: { flex: 1, alignItems: 'center' },
    sectionTitle: { ...commonStyles.sectionTitle, textAlign: 'center', textTransform: 'uppercase' },
    eduItem: { marginBottom: 8 * metrics.singlePageMult },
    educationMeta: { fontSize: 9 * metrics.finalScale, color: '#000000', marginTop: 2 },
    skills: { textAlign: 'center', color: '#000000', fontSize: 10 * metrics.finalScale },
    photo: { width: photoSize.width, height: photoSize.height, borderRadius: 4, marginLeft: 10 },
    photoImage: { width: photoSize.width, height: photoSize.height, objectFit: 'cover', borderRadius: 4 },
  });

  return {
    ...commonStyles,
    ...specificStyles,
    _finalScale: metrics.finalScale,
    _singlePageMult: metrics.singlePageMult,
  };
};

export function RenewedTemplate({ personalInfo, links, resume, experiences, education, skills, languages, certifications, projects, volunteers, customSections, lang, settings, color, sectionOrder }: RenewedTemplateProps) {
  const l = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  const styles = buildStyles(settings, color || 'blue');
  const order = getSectionOrder(sectionOrder, customSections);
  const contactItems = [personalInfo?.city, personalInfo?.postalCode, personalInfo?.email, personalInfo?.countryCode && personalInfo?.phone ? `${personalInfo.countryCode.match(/\(([^)]+)\)/)?.[1] || personalInfo.countryCode} ${personalInfo.phone}` : personalInfo?.phone].filter(Boolean);
  
  const SectionTitle = ({ label }: { label: string }) => (
    <Text style={styles.sectionTitle}>{label}</Text>
  );
  
  const renderProps = { styles, lang: l, settings };
  
  const renderSection = (sectionKey: import('../../types/cv').SectionKey) => {
    switch (sectionKey) {
      case 'professional_summary':
        return renderSummarySection(resume, renderProps, SectionTitle);
      case 'professional_experience':
        return renderExperienceSection(experiences, renderProps, SectionTitle);
      case 'academic_education':
        return renderEducationSection(education, renderProps, SectionTitle);
      case 'technical_skills':
        return renderSkillsSection(skills, renderProps, SectionTitle, styles.skills);
      case 'languages':
        return renderLanguagesSection(languages, renderProps, SectionTitle);
      case 'certifications':
        return renderCertificationsSection(certifications, renderProps, SectionTitle);
      case 'projects':
        return renderProjectsSection(projects, renderProps, SectionTitle);
      case 'volunteer':
        return renderVolunteerSection(volunteers, renderProps, SectionTitle);
      default:
        if (sectionKey.startsWith('custom_')) {
          const customId = sectionKey.replace('custom_', '');
          const section = (customSections || []).find((cs) => cs.id === customId);
          if (section) return renderCustomSection(section, renderProps, SectionTitle);
        }
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.name}>{personalInfo?.name || 'YOUR NAME'}</Text>
              {personalInfo?.desiredRole && <Text style={styles.title}>{personalInfo.desiredRole}</Text>}
              <View style={styles.contactRow}>
                {contactItems.map((c, i) => (
                  <React.Fragment key={i}>
                    <Text style={styles.contactItem}>{c}</Text>
                    {i < contactItems.length - 1 && <Text style={{ color: '#e5e7eb' }}> | </Text>}
                  </React.Fragment>
                ))}
              </View>
              {/* Social Links */}
              {links && links.length > 0 && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 2 }}>
                  {links.map((lnk, i) => (
                    <Link key={i} src={getSocialUrl(lnk.type, lnk.value)} style={{ fontSize: 9, color: '#2563eb', marginHorizontal: 6 }}>
                      {lnk.hideLinkLabel ? lnk.value : `${lnk.customName || lnk.type}: ${lnk.value}`}
                    </Link>
                  ))}
                </View>
              )}
            </View>
            {settings?.photo?.enabled && settings?.photo?.dataUrl ? (
              <View style={styles.photo}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={settings.photo.dataUrl} style={styles.photoImage} />
              </View>
            ) : null}
          </View>
          <View style={styles.divider} />
        </View>

        {/* Render sections dynamically based on sectionOrder */}
        {order.map(sectionKey => renderSection(sectionKey))}

      </Page>
    </Document>
  );
}
