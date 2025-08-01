import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { CvData, CvColor } from '../../types/cv';
import { getColorTheme } from '../../utils/color-themes';

/**
 * Props interface for the CreativeTemplate component
 */
interface CreativeTemplateProps extends CvData {
  /** Language for the document (pt or en) */
  lang?: string;
  /** Color theme for the template */
  color?: CvColor;
}

/**
 * Creative template styles with innovative and expressive design
 */
const styles = StyleSheet.create({
  page: { 
    padding: 0, 
    fontSize: 10, 
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: { 
    backgroundColor: '#ec4899',
    padding: 30,
    color: '#ffffff'
  },
  name: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 8,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  desiredRole: { 
    fontSize: 16, 
    color: '#fdf2f8', 
    fontWeight: 'bold', 
    marginBottom: 15,
    fontStyle: 'italic'
  },
  contactRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    marginBottom: 4,
    flexWrap: 'wrap'
  },
  contactItem: { 
    fontSize: 10, 
    color: '#fdf2f8', 
    marginRight: 15 
  },
  separator: { 
    fontSize: 10, 
    color: '#fbcfe8', 
    marginHorizontal: 8 
  },
  linksRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginTop: 10 
  },
  linkItem: { 
    fontSize: 10, 
    color: '#ffffff', 
    textDecoration: 'underline', 
    marginRight: 20, 
    marginBottom: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 4,
    borderRadius: 3
  },
  content: {
    padding: 30
  },
  section: { 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#ec4899',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#ec4899',
    borderBottomStyle: 'solid',
    paddingBottom: 6
  },
  summary: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: 20,
    backgroundColor: '#fdf2f8',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ec4899',
    borderLeftStyle: 'solid'
  },
  expBlock: { 
    marginBottom: 15, 
    paddingBottom: 12,
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ec4899',
    borderLeftStyle: 'solid'
  },
  roleAndDate: { 
    fontSize: 10, 
    color: '#6b7280', 
    marginBottom: 4, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  roleAndCompany: { 
    fontSize: 11, 
    color: '#1f2937', 
    flexDirection: 'row' 
  },
  jobRole: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#ec4899' 
  },
  companyName: { 
    fontSize: 11, 
    color: '#6b7280' 
  },
  companySeparator: { 
    fontSize: 11, 
    color: '#6b7280' 
  },
  dateRange: { 
    fontSize: 10, 
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: 3,
    borderRadius: 3
  },
  tech: { 
    fontSize: 10, 
    color: '#ec4899', 
    marginBottom: 6,
    fontWeight: 'bold',
    backgroundColor: '#fdf2f8',
    padding: 4,
    borderRadius: 3
  },
  activities: { 
    fontSize: 10, 
    marginBottom: 4, 
    marginLeft: 0,
    color: '#374151'
  },
  results: { 
    fontSize: 10, 
    fontStyle: 'italic', 
    marginLeft: 0, 
    marginBottom: 4,
    color: '#059669',
    backgroundColor: '#f0fdf4',
    padding: 4,
    borderRadius: 3
  },
  eduBlock: { 
    marginBottom: 15, 
    paddingBottom: 12,
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    borderLeftStyle: 'solid'
  },
  eduTitle: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#10b981' 
  },
  eduInst: { 
    fontSize: 10, 
    color: '#6b7280', 
    marginBottom: 4 
  },
  eduDesc: { 
    fontSize: 10, 
    marginLeft: 0, 
    marginBottom: 4,
    color: '#374151'
  },
  skillsLangRow: { 
    flexDirection: 'row', 
    gap: 25, 
    marginBottom: 20 
  },
  skillsCol: { 
    flex: 1, 
    marginRight: 15 
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3
  },
  langCol: { 
    flex: 1 
  },
  skillText: { 
    fontSize: 9, 
    color: '#1f2937', 
    marginBottom: 3,
    marginRight: 6,
    backgroundColor: '#f3f4f6',
    padding: 4,
    borderRadius: 12,
    textAlign: 'center'
  },
  langRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 6 
  },
  langItem: { 
    fontSize: 10, 
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    padding: 6,
    borderRadius: 15,
    textAlign: 'center'
  },
  certBlock: { 
    marginBottom: 15, 
    paddingBottom: 12,
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    borderLeftStyle: 'solid'
  },
  certName: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#f59e0b', 
    marginBottom: 4 
  },
  certDate: { 
    fontSize: 10, 
    fontStyle: 'italic', 
    color: '#6b7280', 
    marginLeft: 0 
  },
  certIssuer: { 
    fontSize: 10, 
    color: '#6b7280', 
    marginBottom: 4 
  },
  certLink: { 
    fontSize: 10, 
    color: '#ec4899', 
    textDecoration: 'underline', 
    marginBottom: 4 
  },
  certDesc: { 
    fontSize: 10, 
    marginLeft: 0, 
    marginBottom: 4,
    color: '#374151'
  },
  projBlock: { 
    marginBottom: 15, 
    paddingBottom: 12,
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
    borderLeftStyle: 'solid'
  },
  projName: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#8b5cf6', 
    marginBottom: 4 
  },
  projYear: { 
    fontSize: 10, 
    color: '#6b7280', 
    marginLeft: 0 
  },
  projTech: { 
    fontSize: 10, 
    color: '#ec4899', 
    marginBottom: 6,
    fontWeight: 'bold',
    backgroundColor: '#fdf2f8',
    padding: 4,
    borderRadius: 3
  },
  projDesc: { 
    fontSize: 10, 
    marginLeft: 0, 
    marginBottom: 4,
    color: '#374151'
  },
  projLink: { 
    fontSize: 10, 
    color: '#ec4899', 
    textDecoration: 'underline', 
    marginLeft: 0 
  }
});

/**
 * Creative CV Template component
 * Features an innovative design with colorful accents and expressive layout
 * @param props - Component props including all CV data and language
 * @returns JSX element representing the creative CV template
 */
export function CreativeTemplate({
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
  color = 'pink',
}: CreativeTemplateProps) {
  
  const colorTheme = getColorTheme(color);
  
  // Create dynamic styles based on selected color
  const dynamicStyles = StyleSheet.create({
    header: { 
      backgroundColor: colorTheme.primary,
      padding: 30,
      color: '#ffffff'
    },
    sectionTitle: { 
      fontSize: 14, 
      fontWeight: 'bold', 
      color: colorTheme.primary,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 1,
      borderBottomWidth: 2,
      borderBottomColor: colorTheme.primary,
      borderBottomStyle: 'solid',
      paddingBottom: 6
    },
    summary: {
      fontSize: 11,
      color: '#374151',
      lineHeight: 1.5,
      marginBottom: 20,
      backgroundColor: colorTheme.accent,
      padding: 15,
      borderRadius: 8
    },
    linkItem: { 
      fontSize: 10, 
      color: '#ffffff', 
      textDecoration: 'underline', 
      marginRight: 20, 
      marginBottom: 4,
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: 4,
      borderRadius: 3
    },
    tech: { 
      fontSize: 9, 
      color: colorTheme.primary, 
      marginBottom: 4,
      fontWeight: 'bold'
    },
    projTech: { 
      fontSize: 9, 
      color: colorTheme.primary, 
      marginBottom: 4,
      fontWeight: 'bold'
    },
    certLink: { 
      fontSize: 9, 
      color: colorTheme.primary, 
      textDecoration: 'underline', 
      marginBottom: 3 
    },
    projLink: { 
      fontSize: 9, 
      color: colorTheme.primary, 
      textDecoration: 'underline', 
      marginLeft: 0 
    }
  });
  
  const contactItems = [
    personalInfo?.city,
    personalInfo?.postalCode,
    personalInfo?.email,
    personalInfo?.countryCode && personalInfo?.phone ? `${personalInfo.countryCode.match(/\(([^)]+)\)/)?.[1] || personalInfo.countryCode} ${personalInfo.phone}` : personalInfo?.phone
  ].filter(Boolean);

  // Helper to generate complete URLs for social media
  const getSocialUrl = (type: string, value: string) => {
    if (!value) return '';
    if (type === 'LinkedIn') return value.startsWith('http') ? value : `https://linkedin.com/in/${value}`;
    if (type === 'GitHub') return value.startsWith('http') ? value : `https://github.com/${value}`;
    if (type === 'GitLab') return value.startsWith('http') ? value : `https://gitlab.com/${value}`;
    if (type === 'Portfolio') return value.startsWith('http') ? value : `https://${value}`;
    if (type === 'Outro') return value.startsWith('http') ? value : `https://${value}`;
    return value;
  };

  // Helper to translate link types
  const translateLinkType = (type: string, lang: string) => {
    if (lang === 'en') {
      switch (type) {
        case 'LinkedIn': return 'LinkedIn';
        case 'GitHub': return 'GitHub';
        case 'GitLab': return 'GitLab';
        case 'Portfolio': return 'Portfolio';
        case 'Outro': return 'Other';
        default: return type;
      }
    } else {
      switch (type) {
        case 'LinkedIn': return 'LinkedIn';
        case 'GitHub': return 'GitHub';
        case 'GitLab': return 'GitLab';
        case 'Portfolio': return 'Portfolio';
        case 'Outro': return 'Outro';
        default: return type;
      }
    }
  };

  // Helper to translate months
  const translateMonth = (month: string, lang: string) => {
    if (lang === 'en') {
      switch (month) {
        case 'Jan': return 'Jan';
        case 'Fev': return 'Feb';
        case 'Mar': return 'Mar';
        case 'Abr': return 'Apr';
        case 'Mai': return 'May';
        case 'Jun': return 'Jun';
        case 'Jul': return 'Jul';
        case 'Ago': return 'Aug';
        case 'Set': return 'Sep';
        case 'Out': return 'Oct';
        case 'Nov': return 'Nov';
        case 'Dez': return 'Dec';
        default: return month;
      }
    } else {
      switch (month) {
        case 'Jan': return 'Jan';
        case 'Feb': return 'Fev';
        case 'Mar': return 'Mar';
        case 'Apr': return 'Abr';
        case 'May': return 'Mai';
        case 'Jun': return 'Jun';
        case 'Jul': return 'Jul';
        case 'Aug': return 'Ago';
        case 'Sep': return 'Set';
        case 'Oct': return 'Out';
        case 'Nov': return 'Nov';
        case 'Dec': return 'Dez';
        default: return month;
      }
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section with colorful background */}
        <View style={dynamicStyles.header}>
          <Text style={styles.name}>{personalInfo?.name}</Text>
          <Text style={styles.desiredRole}>{personalInfo?.desiredRole}</Text>
          
          {/* Contact Information */}
          <View style={styles.contactRow}>
            {contactItems.map((item, index) => (
              <React.Fragment key={index}>
                <Text style={styles.contactItem}>{item}</Text>
                {index < contactItems.length - 1 && <Text style={styles.separator}>•</Text>}
              </React.Fragment>
            ))}
          </View>

          {/* Social Links */}
          {links.length > 0 && (
            <View style={styles.linksRow}>
              {links.map((link, index) => (
                <Link key={index} src={getSocialUrl(link.type, link.value)} style={dynamicStyles.linkItem}>
                  {translateLinkType(link.type, lang || 'pt')}: {link.value}
                </Link>
              ))}
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Professional Summary */}
          {resume && (
            <View style={styles.section}>
              <Text style={dynamicStyles.sectionTitle}>
                {lang === 'en' ? 'Professional Summary' : 'Resumo Profissional'}
              </Text>
              <Text style={dynamicStyles.summary}>{resume}</Text>
            </View>
          )}

          {/* Professional Experience */}
          {experiences.length > 0 && (
            <View style={styles.section}>
              <Text style={dynamicStyles.sectionTitle}>
                {lang === 'en' ? 'Professional Experience' : 'Experiência Profissional'}
              </Text>
              {experiences.map((exp, index) => (
                <View key={index} style={styles.expBlock}>
                  <View style={styles.roleAndDate}>
                    <View style={styles.roleAndCompany}>
                      <Text style={styles.jobRole}>{exp.role}</Text>
                      <Text style={styles.companySeparator}> • </Text>
                      <Text style={styles.companyName}>{exp.company}</Text>
                    </View>
                    <Text style={styles.dateRange}>
                      {translateMonth(exp.startMonth, lang || 'pt')} {exp.startYear} - {exp.current ? (lang === 'en' ? 'Present' : 'Atual') : `${translateMonth(exp.endMonth, lang || 'pt')} ${exp.endYear}`}
                    </Text>
                  </View>
                  {exp.tech && <Text style={dynamicStyles.tech}>{exp.tech}</Text>}
                  {exp.activities && <Text style={styles.activities}>{exp.activities}</Text>}
                  {exp.results && <Text style={styles.results}>{exp.results}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View style={styles.section}>
              <Text style={dynamicStyles.sectionTitle}>
                {lang === 'en' ? 'Education' : 'Formação Académica'}
              </Text>
              {education.map((edu, index) => (
                <View key={index} style={styles.eduBlock}>
                  <View style={styles.roleAndDate}>
                    <Text style={styles.eduTitle}>{edu.course}</Text>
                    <Text style={styles.dateRange}>
                      {translateMonth(edu.startMonth, lang || 'pt')} {edu.startYear} - {translateMonth(edu.endMonth, lang || 'pt')} {edu.endYear}
                    </Text>
                  </View>
                  <Text style={styles.eduInst}>{edu.institution}</Text>
                  {edu.description && <Text style={styles.eduDesc}>{edu.description}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Skills and Languages */}
          {(skills || languages.length > 0) && (
            <View style={styles.section}>
              <View style={styles.skillsLangRow}>
                {skills && (
                  <View style={styles.skillsCol}>
                    <Text style={dynamicStyles.sectionTitle}>
                      {lang === 'en' ? 'Technical Skills' : 'Competências Técnicas'}
                    </Text>
                    <View style={styles.skillsGrid}>
                      {skills.split(',').map((skill, index) => (
                        <Text key={index} style={styles.skillText}>
                          {skill.trim()}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
                
                {languages.length > 0 && (
                  <View style={styles.langCol}>
                                      <Text style={dynamicStyles.sectionTitle}>
                    {lang === 'en' ? 'Languages' : 'Idiomas'}
                  </Text>
                    <View style={styles.langRow}>
                      {languages.map((lang, index) => (
                        <Text key={index} style={styles.langItem}>
                          {lang.name} ({lang.level})
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={dynamicStyles.sectionTitle}>
                {lang === 'en' ? 'Certifications' : 'Certificações'}
              </Text>
              {certifications.map((cert, index) => (
                <View key={index} style={styles.certBlock}>
                  <View style={styles.roleAndDate}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    <Text style={styles.certDate}>{cert.completionDate}</Text>
                  </View>
                  <Text style={styles.certIssuer}>{cert.issuer}</Text>
                                  {cert.validationLink && (
                  <Link src={cert.validationLink} style={dynamicStyles.certLink}>
                    {lang === 'en' ? 'View Certificate' : 'Ver Certificado'}
                  </Link>
                )}
                  {cert.description && <Text style={styles.certDesc}>{cert.description}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View style={styles.section}>
              <Text style={dynamicStyles.sectionTitle}>
                {lang === 'en' ? 'Projects' : 'Projetos'}
              </Text>
              {projects.map((proj, index) => (
                <View key={index} style={styles.projBlock}>
                  <View style={styles.roleAndDate}>
                    <Text style={styles.projName}>{proj.name}</Text>
                    <Text style={styles.projYear}>{proj.year}</Text>
                  </View>
                  {proj.tech && <Text style={dynamicStyles.projTech}>{proj.tech}</Text>}
                  {proj.description && <Text style={styles.projDesc}>{proj.description}</Text>}
                                  {proj.link && (
                  <Link src={proj.link} style={dynamicStyles.projLink}>
                    {lang === 'en' ? 'View Project' : 'Ver Projeto'}
                  </Link>
                )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
} 