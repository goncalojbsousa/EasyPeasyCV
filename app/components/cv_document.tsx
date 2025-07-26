import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { CvData } from '../types/cv';

/**
 * Props interface for the CvDocument component
 */
interface CvDocumentProps extends CvData {
  /** Language for the document (pt or en) */
  lang?: string;
}

/**
 * PDF styles for the CV document
 */
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 11, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#d1d5db', borderBottomStyle: 'solid' },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  role: { fontSize: 13, color: '#2563eb', fontWeight: 'bold', marginBottom: 8 },
  contactRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 2 },
  contactItem: { fontSize: 10, color: '#374151', marginRight: 8 },
  separator: { fontSize: 12, color: '#d1d5db', marginHorizontal: 8 },
  linksRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2, marginBottom: 2 },
  linkItem: { fontSize: 10, color: '#2563eb', textDecoration: 'underline', marginRight: 16 },
  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#1e293b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid', paddingBottom: 2 },
  expBlock: { marginBottom: 14, paddingBottom: 6, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid' },
  company: { fontSize: 11, fontWeight: 'bold', color: '#0f172a', marginBottom: 1 },
  roleAndDate: { fontSize: 10, color: '#64748b', marginBottom: 2 },
  tech: { fontSize: 10, color: '#2563eb', marginBottom: 2 },
  activities: { fontSize: 10, marginBottom: 1, marginLeft: 8 },
  results: { fontSize: 10, fontStyle: 'italic', marginLeft: 8 },
  eduBlock: { marginBottom: 12, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid' },
  eduTitle: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  eduInst: { fontSize: 10, color: '#64748b', marginBottom: 1 },
  eduDesc: { fontSize: 10, marginLeft: 8 },
  skillsLangRow: { flexDirection: 'row', gap: 32, marginBottom: 18 },
  skillsCol: { flex: 1, marginRight: 16 },
  langCol: { flex: 1 },
  skillText: { fontSize: 10, color: '#0f172a' },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  langItem: { fontSize: 10, marginRight: 12 },
  certBlock: { marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid' },
  certName: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  certDate: { fontSize: 10, fontStyle: 'italic', color: '#64748b', marginLeft: 4 },
  certIssuer: { fontSize: 10, color: '#64748b' },
  certLink: { fontSize: 10, color: '#2563eb', textDecoration: 'underline' },
  certDesc: { fontSize: 10, marginLeft: 8 },
});

/**
 * CvDocument component generates a PDF document from CV data
 * @param personalInfo - Personal information data
 * @param links - Social media and portfolio links
 * @param resume - Professional summary text
 * @param experiences - Professional experience entries
 * @param education - Education entries
 * @param skills - Technical skills text
 * @param languages - Language proficiency entries
 * @param certifications - Certification entries
 * @param projects - Project entries
 * @param lang - Language for the document (pt or en)
 * @returns PDF document component
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
  lang,
}: CvDocumentProps) {
  // Helper to separate contacts with separators
  const contactItems = [
    personalInfo?.city,
    personalInfo?.postalCode,
    personalInfo?.email,
    personalInfo?.phone
  ].filter(Boolean);

  // Helper to generate complete URLs for social media
  const getSocialUrl = (type: string, value: string) => {
    if (!value) return '';
    if (type === 'LinkedIn') return value.startsWith('http') ? value : `https://linkedin.com/in/${value}`;
    if (type === 'GitHub') return value.startsWith('http') ? value : `https://github.com/${value}`;
    if (type === 'Portfolio') return value.startsWith('http') ? value : `https://${value}`;
    return value;
  };

  // Filter out empty experiences, education, certifications, and languages
  const filteredExperiences = experiences?.filter(
    (exp: any) =>
      exp.role ||
      exp.company ||
      exp.startMonth ||
      exp.startYear ||
      exp.endMonth ||
      exp.endYear ||
      exp.tech ||
      exp.activities ||
      exp.results
  );
  const filteredEducation = education?.filter(
    (ed: any) =>
      ed.type ||
      ed.status ||
      ed.course ||
      ed.institution ||
      ed.startMonth ||
      ed.startYear ||
      ed.description
  );
  const filteredCertifications = certifications?.filter(
    (cert: any) =>
      cert.name ||
      cert.issuer ||
      cert.completionDate ||
      cert.hours ||
      cert.validationLink ||
      cert.description
  );
  const filteredLanguages = languages?.filter(
    (lang: any) => lang.name || lang.level
  );
  const filteredProjects = projects?.filter(
    (proj: any) =>
      proj.name || proj.description || proj.link || proj.tech || proj.year
  );

  // Section titles in both languages
  const sectionTitles = {
    pt: {
      summary: 'Resumo Profissional',
      experience: 'Experiência Profissional',
      education: 'Formação Académica',
      skills: 'Habilidades Técnicas',
      languages: 'Idiomas',
      certifications: 'Certificações/Cursos',
      projects: 'Projetos',
    },
    en: {
      summary: 'Professional Summary',
      experience: 'Professional Experience',
      education: 'Academic Education',
      skills: 'Technical Skills',
      languages: 'Languages',
      certifications: 'Certifications/Courses',
      projects: 'Projects',
    },
  };
  // Get current language (pt or en)
  const currentLang = (typeof lang === 'string' && lang === 'en') ? 'en' : 'pt';

  return (
    <Document>
      <Page style={styles.page}>
        {/* Organized header section */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.name || (currentLang === 'pt' ? 'Nome' : 'Name')}</Text>
          <Text style={styles.role}>{personalInfo?.desiredRole}</Text>
          <View style={styles.contactRow}>
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <Text style={styles.contactItem}>{item}</Text>
                {idx < contactItems.length - 1 && <Text style={styles.separator}>|</Text>}
              </React.Fragment>
            ))}
          </View>
          {links?.length > 0 && (
            <View style={styles.linksRow}>
              {links.map((l: any, i: number) => (
                l.value ? (
                  <Link key={i} src={getSocialUrl(l.type, l.value)} style={styles.linkItem}>
                    {l.type}: {l.value}
                  </Link>
                ) : null
              ))}
            </View>
          )}
        </View>

        {/* Professional Summary section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{sectionTitles[currentLang].summary}</Text>
          <Text>{resume}</Text>
        </View>

        {/* Professional Experience section */}
        {filteredExperiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{sectionTitles[currentLang].experience}</Text>
            {filteredExperiences.map((exp: any, i: number) => {
              const hasMainInfo = exp.company || exp.role;
              const hasDates = exp.startMonth || exp.startYear || exp.endMonth || exp.endYear || exp.current;
              const hasTech = exp.tech;
              const hasActivities = exp.activities;
              const hasResults = exp.results;
              if (!hasMainInfo && !hasDates && !hasTech && !hasActivities && !hasResults) {
                return null;
              }
              const showSeparator = filteredExperiences.length > 1 && i < filteredExperiences.length - 1;
              return (
                <View
                  key={i}
                  style={{
                    ...styles.expBlock,
                    borderBottomWidth: showSeparator ? styles.expBlock.borderBottomWidth : 0,
                    borderBottomColor: showSeparator ? styles.expBlock.borderBottomColor : undefined,
                    borderBottomStyle: showSeparator ? styles.expBlock.borderBottomStyle : undefined,
                  }}
                >
                  {exp.company && <Text style={styles.company}>{exp.company}</Text>}
                  {(exp.role || hasDates) && (
                    <Text style={styles.roleAndDate}>
                      {exp.role}
                      {(exp.role && hasDates) ? ' | ' : ''}
                      {hasDates
                        ? `${exp.startMonth || ''}${exp.startMonth && exp.startYear ? '/' : ''}${exp.startYear || ''} – ${exp.current ? 'Atual' : ((exp.endMonth || '') + (exp.endMonth && exp.endYear ? '/' : '') + (exp.endYear || ''))}`
                        : ''}
                    </Text>
                  )}
                  {exp.tech && <Text style={styles.tech}>{exp.tech}</Text>}
                  {exp.activities && <Text style={styles.activities}>• {exp.activities}</Text>}
                  {exp.results && <Text style={styles.results}>• {exp.results}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* Academic Education section */}
        {filteredEducation?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{sectionTitles[currentLang].education}</Text>
            {filteredEducation.map((ed: any, i: number) => {
              const hasMainInfo = ed.type || ed.course;
              const hasStatus = ed.status;
              const hasInst = ed.institution;
              const hasDates = ed.startMonth || ed.startYear;
              const hasDesc = ed.description;
              if (!hasMainInfo && !hasStatus && !hasInst && !hasDates && !hasDesc) {
                return null;
              }
              const showSeparator = filteredEducation.length > 1 && i < filteredEducation.length - 1;
              return (
                <View
                  key={i}
                  style={{
                    ...styles.eduBlock,
                    borderBottomWidth: showSeparator ? styles.eduBlock.borderBottomWidth : 0,
                    borderBottomColor: showSeparator ? styles.eduBlock.borderBottomColor : undefined,
                    borderBottomStyle: showSeparator ? styles.eduBlock.borderBottomStyle : undefined,
                  }}
                >
                  {(ed.type || ed.course || ed.status) && (
                    <Text style={styles.eduTitle}>
                      {ed.type}{ed.type && ed.course ? ' - ' : ''}{ed.course}
                      {ed.status && <Text style={styles.certDate}> ({ed.status})</Text>}
                    </Text>
                  )}
                  {(ed.institution || hasDates) && (
                    <Text style={styles.eduInst}>
                      {ed.institution}
                      {ed.institution && hasDates ? ' | ' : ''}
                      {hasDates ? `${ed.startMonth || ''}${ed.startMonth && ed.startYear ? '/' : ''}${ed.startYear || ''}` : ''}
                    </Text>
                  )}
                  {ed.description && <Text style={styles.eduDesc}>{ed.description}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* Skills and Languages in columns */}
        {(skills || filteredLanguages?.length > 0) && (
          <View style={styles.skillsLangRow}>
            <View style={styles.skillsCol}>
              <Text style={styles.sectionTitle}>{sectionTitles[currentLang].skills}</Text>
              <Text style={styles.skillText}>{skills}</Text>
            </View>
            <View style={styles.langCol}>
              <Text style={styles.sectionTitle}>{sectionTitles[currentLang].languages}</Text>
              <View style={styles.langRow}>
                {filteredLanguages.map((lang: any, i: number) => {
                  if (!lang.name && !lang.level) return null;
                  return <Text key={i} style={styles.langItem}>{lang.name}{lang.name && lang.level ? ' - ' : ''}{lang.level}</Text>;
                })}
              </View>
            </View>
          </View>
        )}

        {/* Certifications/Courses section */}
        {filteredCertifications?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{sectionTitles[currentLang].certifications}</Text>
            {filteredCertifications.map((cert: any, i: number) => {
              const hasMainInfo = cert.name;
              const hasDate = cert.completionDate;
              const hasIssuer = cert.issuer;
              const hasLink = cert.validationLink;
              const hasHours = cert.hours;
              const hasDesc = cert.description;
              if (!hasMainInfo && !hasDate && !hasIssuer && !hasLink && !hasHours && !hasDesc) {
                return null;
              }
              const showSeparator = filteredCertifications.length > 1 && i < filteredCertifications.length - 1;
              return (
                <View
                  key={i}
                  style={{
                    ...styles.certBlock,
                    borderBottomWidth: showSeparator ? styles.certBlock.borderBottomWidth : 0,
                    borderBottomColor: showSeparator ? styles.certBlock.borderBottomColor : undefined,
                    borderBottomStyle: showSeparator ? styles.certBlock.borderBottomStyle : undefined,
                  }}
                >
                  {(cert.name || cert.completionDate) && (
                    <Text style={styles.certName}>
                      {cert.name}
                      {cert.completionDate && <Text style={styles.certDate}> ({cert.completionDate})</Text>}
                    </Text>
                  )}
                  {cert.issuer && <Text style={styles.certIssuer}>{cert.issuer}</Text>}
                  {cert.validationLink && (
                    <Link src={cert.validationLink} style={styles.certLink}>{cert.validationLink}</Link>
                  )}
                  {cert.hours && <Text style={styles.certIssuer}>Carga horária: {cert.hours}h</Text>}
                  {cert.description && <Text style={styles.certDesc}>{cert.description}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* Projects section */}
        {filteredProjects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{sectionTitles[currentLang].projects}</Text>
            {filteredProjects.map((proj: any, i: number) => {
              const hasMainInfo = proj.name;
              const hasDesc = proj.description;
              const hasLink = proj.link;
              const hasTech = proj.tech;
              const hasYear = proj.year;
              if (!hasMainInfo && !hasDesc && !hasLink && !hasTech && !hasYear) {
                return null;
              }
              const showSeparator = filteredProjects.length > 1 && i < filteredProjects.length - 1;
              return (
                <View
                  key={i}
                  style={{
                    marginBottom: 10,
                    borderBottomWidth: showSeparator ? 0.5 : 0,
                    borderBottomColor: showSeparator ? '#e5e7eb' : undefined,
                    borderBottomStyle: showSeparator ? 'solid' : undefined,
                    paddingBottom: 6,
                  }}
                >
                  {proj.name && (
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a' }}>{proj.name}{proj.year && <Text style={{ fontSize: 10, color: '#64748b', marginLeft: 4 }}> ({proj.year})</Text>}</Text>
                  )}
                  {proj.description && (
                    <Text style={{ fontSize: 10, marginLeft: 8, marginBottom: 2 }}>{proj.description}</Text>
                  )}
                  {proj.tech && (
                    <Text style={{ fontSize: 10, color: '#2563eb', marginLeft: 8, marginBottom: 2 }}>{proj.tech}</Text>
                  )}
                  {proj.link && (
                    <Link src={proj.link} style={{ fontSize: 10, color: '#2563eb', textDecoration: 'underline', marginLeft: 8 }}>{proj.link}</Link>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </Page>
    </Document>
  );
}
