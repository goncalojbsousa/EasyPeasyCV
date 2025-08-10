import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { CvData, CvColor } from '../../types/cv';
import { getColorTheme } from '../../utils/color-themes';

/**
 * Props interface for the ModernTemplate component
 */
interface ModernTemplateProps extends CvData {
  /** Language for the document (pt or en) */
  lang?: string;
  /** Color theme for the template */
  color?: CvColor;
}

/**
 * Modern template styles with clean and minimalist design
 */
const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontSize: 10, 
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: { 
    marginBottom: 20, 
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    borderBottomStyle: 'solid'
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 4,
    color: '#1f2937'
  },
  desiredRole: { 
    fontSize: 14, 
    color: '#3b82f6', 
    fontWeight: 'bold', 
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  contactRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    marginBottom: 3,
    flexWrap: 'wrap'
  },
  contactItem: { 
    fontSize: 9, 
    color: '#6b7280', 
    marginRight: 15 
  },
  separator: { 
    fontSize: 9, 
    color: '#d1d5db', 
    marginHorizontal: 8 
  },
  linksRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginTop: 8 
  },
  linkItem: { 
    fontSize: 9, 
    color: '#3b82f6', 
    textDecoration: 'underline', 
    marginRight: 20, 
    marginBottom: 3 
  },
  section: { 
    marginBottom: 15 
  },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#1f2937',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    paddingBottom: 4
  },
  expBlock: { 
    marginBottom: 12, 
    paddingBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
    borderLeftStyle: 'solid',
    paddingLeft: 12
  },
  roleAndDate: { 
    fontSize: 9, 
    color: '#6b7280', 
    marginBottom: 3, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  roleAndCompany: { 
    fontSize: 10, 
    color: '#1f2937', 
    flexDirection: 'row',
    alignItems: 'center'
  },
  jobRole: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#1f2937' 
  },
  companyName: { 
    fontSize: 10, 
    color: '#6b7280' 
  },
  companySeparator: { 
    fontSize: 10, 
    color: '#6b7280',
    marginLeft: 6,
    marginRight: 2
  },
  dateRange: { 
    fontSize: 9, 
    color: '#6b7280' 
  },
  tech: { 
    fontSize: 9, 
    color: '#3b82f6', 
    marginBottom: 4,
    fontWeight: 'bold'
  },
  activities: { 
    fontSize: 9, 
    marginBottom: 3, 
    marginLeft: 0,
    color: '#374151'
  },
  results: { 
    fontSize: 9, 
    fontStyle: 'italic', 
    marginLeft: 0, 
    marginBottom: 3,
    color: '#059669'
  },
  eduBlock: { 
    marginBottom: 12, 
    paddingBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    borderLeftStyle: 'solid',
    paddingLeft: 12
  },
  eduTitle: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#1f2937' 
  },
  eduInst: { 
    fontSize: 9, 
    color: '#6b7280', 
    marginBottom: 3 
  },
  eduDesc: { 
    fontSize: 9, 
    marginLeft: 0, 
    marginBottom: 3,
    color: '#374151'
  },
  skillsLangRow: { 
    flexDirection: 'row', 
    gap: 30, 
    marginBottom: 15 
  },
  skillsCol: { 
    flex: 1, 
    marginRight: 20 
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4
  },
  langCol: { 
    flex: 1 
  },
  skillText: { 
    fontSize: 9, 
    color: '#1f2937', 
    marginBottom: 2,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    padding: 3,
    borderRadius: 3
  },
  langRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8 
  },
  langItem: { 
    fontSize: 9, 
    marginRight: 10,
    backgroundColor: '#f3f4f6',
    padding: 4,
    borderRadius: 3
  },
  certBlock: { 
    marginBottom: 12, 
    paddingBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
    borderLeftStyle: 'solid',
    paddingLeft: 12
  },
  certName: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#1f2937', 
    marginBottom: 3 
  },
  certDate: { 
    fontSize: 9, 
    fontStyle: 'italic', 
    color: '#6b7280', 
    marginLeft: 0 
  },
  certIssuer: { 
    fontSize: 9, 
    color: '#6b7280', 
    marginBottom: 3 
  },
  certLink: { 
    fontSize: 9, 
    color: '#3b82f6', 
    textDecoration: 'underline', 
    marginBottom: 3 
  },
  certDesc: { 
    fontSize: 9, 
    marginLeft: 0, 
    marginBottom: 3,
    color: '#374151'
  },
  projBlock: { 
    marginBottom: 12, 
    paddingBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
    borderLeftStyle: 'solid',
    paddingLeft: 12
  },
  projName: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#1f2937', 
    marginBottom: 3 
  },
  projYear: { 
    fontSize: 9, 
    color: '#6b7280', 
    marginLeft: 0 
  },
  projTech: { 
    fontSize: 9, 
    color: '#3b82f6', 
    marginBottom: 4,
    fontWeight: 'bold'
  },
  projDesc: { 
    fontSize: 9, 
    marginLeft: 0, 
    marginBottom: 3,
    color: '#374151'
  },
  projLink: { 
    fontSize: 9, 
    color: '#3b82f6', 
    textDecoration: 'underline', 
    marginLeft: 0 
  },
  volBlock: { 
    marginBottom: 12, 
    paddingBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
    borderLeftStyle: 'solid',
    paddingLeft: 12
  },
  volRole: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#1f2937', 
    marginBottom: 3 
  },
  volOrg: { 
    fontSize: 9, 
    color: '#6b7280', 
    marginBottom: 3 
  },
  volDesc: { 
    fontSize: 9, 
    marginLeft: 0, 
    marginBottom: 3,
    color: '#374151'
  },
  volImpact: { 
    fontSize: 9, 
    fontStyle: 'italic', 
    marginLeft: 0, 
    marginBottom: 3,
    color: '#059669'
  },
  summary: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 15
  }
});

/**
 * Modern CV Template component
 * Features a clean, minimalist design with colored left borders for sections
 * @param props - Component props including all CV data and language
 * @returns JSX element representing the modern CV template
 */
export function ModernTemplate({
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
}: ModernTemplateProps) {
  
  const colorTheme = getColorTheme(color);
  
  // Create dynamic styles based on selected color
  const dynamicStyles = StyleSheet.create({
    header: { 
      marginBottom: 20, 
      paddingBottom: 15,
      borderBottomWidth: 2,
      borderBottomColor: colorTheme.primary,
      borderBottomStyle: 'solid'
    },
    desiredRole: { 
      fontSize: 14, 
      color: colorTheme.primary, 
      fontWeight: 'bold', 
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 1
    },
    sectionTitle: { 
      fontSize: 12, 
      fontWeight: 'bold', 
      color: '#1f2937',
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      borderBottomStyle: 'solid',
      paddingBottom: 4
    },
    expBlock: { 
      marginBottom: 12, 
      paddingBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: colorTheme.primary,
      borderLeftStyle: 'solid',
      paddingLeft: 12
    },
    tech: { 
      fontSize: 9, 
      color: colorTheme.primary, 
      marginBottom: 4,
      fontWeight: 'bold'
    },
    eduBlock: { 
      marginBottom: 12, 
      paddingBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: colorTheme.secondary,
      borderLeftStyle: 'solid',
      paddingLeft: 12
    },
    certBlock: { 
      marginBottom: 12, 
      paddingBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: colorTheme.light,
      borderLeftStyle: 'solid',
      paddingLeft: 12
    },
    projBlock: { 
      marginBottom: 12, 
      paddingBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: colorTheme.dark,
      borderLeftStyle: 'solid',
      paddingLeft: 12
    },
    volBlock: { 
      marginBottom: 12, 
      paddingBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: '#ef4444',
      borderLeftStyle: 'solid',
      paddingLeft: 12
    },
    projTech: { 
      fontSize: 9, 
      color: colorTheme.primary, 
      marginBottom: 4,
      fontWeight: 'bold'
    },
    linkItem: { 
      fontSize: 9, 
      color: colorTheme.primary, 
      textDecoration: 'underline', 
      marginRight: 20, 
      marginBottom: 3 
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
    const val = value.trim();
    const hasProtocol = /^https?:\/\//i.test(val);
    const lower = type.toLowerCase();

    if (lower === 'email') return `mailto:${val}`;
    if (lower === 'phone') return `tel:${val}`;

    // If value contains a known domain but lacks protocol, prefix https
    if (!hasProtocol) {
      if (/linkedin\.com/i.test(val)) return `https://${val}`;
      if (/github\.com/i.test(val)) return `https://${val}`;
      if (/gitlab\.com/i.test(val)) return `https://${val}`;
    }

    if (!hasProtocol) {
      if (lower === 'linkedin') return `https://www.linkedin.com/in/${val}`;
      if (lower === 'github') return `https://github.com/${val}`;
      if (lower === 'gitlab') return `https://gitlab.com/${val}`;
      return `https://${val}`; // portfolio/other
    }
    return val;
  };

  // Helper to translate link types
  const translateLinkType = (type: string, lang: string, customName?: string) => {
    // If it's "Other" type and has a custom name, return the custom name
    if (type === 'Other' && customName) {
      return customName;
    }
    
    if (lang === 'en') {
      switch (type) {
        case 'LinkedIn': return 'LinkedIn';
        case 'GitHub': return 'GitHub';
        case 'GitLab': return 'GitLab';
        case 'Portfolio': return 'Portfolio';
        case 'Other': return 'Other';
        default: return type;
      }
    } else {
      switch (type) {
        case 'LinkedIn': return 'LinkedIn';
        case 'GitHub': return 'GitHub';
        case 'GitLab': return 'GitLab';
        case 'Portfolio': return 'Portfolio';
        case 'Other': return 'Outro';
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

  // Helper to translate language levels
  const translateLanguageLevel = (level: string, lang: string) => {
    if (!level) return '';
    
    const levelMap = {
      // CEFR levels
      'language.level.a1': { pt: 'A1', en: 'A1' },
      'language.level.a2': { pt: 'A2', en: 'A2' },
      'language.level.b1': { pt: 'B1', en: 'B1' },
      'language.level.b2': { pt: 'B2', en: 'B2' },
      'language.level.c1': { pt: 'C1', en: 'C1' },
      'language.level.c2': { pt: 'C2', en: 'C2' },
    };
    
    return levelMap[level as keyof typeof levelMap]?.[lang as keyof typeof levelMap[keyof typeof levelMap]] || level;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={dynamicStyles.header}>
          <Text style={styles.name}>{personalInfo?.name}</Text>
          <Text style={dynamicStyles.desiredRole}>{personalInfo?.desiredRole}</Text>
          
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
                   {translateLinkType(link.type, lang || 'pt', link.customName)}: {link.value}
                 </Link>
               ))}
            </View>
          )}
        </View>

        {/* Professional Summary */}
        {resume && (
          <View style={styles.section}>
            <Text style={dynamicStyles.sectionTitle}>
              {lang === 'en' ? 'Professional Summary' : lang === 'es' ? 'Resumen Profesional' : 'Resumo Profissional'}
            </Text>
            <Text style={styles.summary}>{resume}</Text>
          </View>
        )}

        {/* Professional Experience */}
        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={dynamicStyles.sectionTitle}>
              {lang === 'en' ? 'Professional Experience' : lang === 'es' ? 'Experiencia Profesional' : 'Experiência Profissional'}
            </Text>
            {experiences.map((exp, index) => (
              <View key={index} style={dynamicStyles.expBlock}>
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
              {lang === 'en' ? 'Education' : lang === 'es' ? 'Educación' : 'Formação Académica'}
            </Text>
            {education.map((edu, index) => (
              <View key={index} style={dynamicStyles.eduBlock}>
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
              {lang === 'en' ? 'Technical Skills' : lang === 'es' ? 'Competencias Técnicas' : 'Competências Técnicas'}
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
                    {languages.map((language, index) => (
                      <Text key={index} style={styles.langItem}>
                        {language.name} ({translateLanguageLevel(language.level, lang || 'pt')})
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
            {certifications.map((cert, index) => {
              const isLast = index === certifications.length - 1;
              return (
                <View key={index} style={{
                  ...dynamicStyles.certBlock,
                  marginBottom: isLast ? 0 : dynamicStyles.certBlock.marginBottom,
                  paddingBottom: isLast ? 0 : dynamicStyles.certBlock.paddingBottom,
                }}>
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
            );
            })}
          </View>
        )}

        {/* Volunteer Work */}
                      {volunteers && volunteers.length > 0 && (
                <View style={styles.section}>
                  <Text style={dynamicStyles.sectionTitle}>
                    {lang === 'en' ? 'Volunteer Work' : 'Voluntariado'}
                  </Text>
                  {volunteers.map((vol, index) => {
                    const isLast = index === volunteers.length - 1;
              return (
                <View key={index} style={{
                  ...dynamicStyles.volBlock,
                  marginBottom: isLast ? 0 : dynamicStyles.volBlock.marginBottom,
                  paddingBottom: isLast ? 0 : dynamicStyles.volBlock.paddingBottom,
                }}>
                <View style={styles.roleAndDate}>
                  <Text style={styles.volRole}>{vol.role}</Text>
                  <Text style={styles.dateRange}>
                    {vol.startMonth && vol.startYear ? `${translateMonth(vol.startMonth, lang || 'pt')} ${vol.startYear}` : ''}
                    {vol.startMonth && vol.startYear && (vol.endMonth || vol.endYear || vol.current) ? ' - ' : ''}
                    {vol.current ? (lang === 'en' ? 'Present' : 'Atual') : vol.endMonth && vol.endYear ? `${translateMonth(vol.endMonth, lang || 'pt')} ${vol.endYear}` : ''}
                  </Text>
                </View>
                <Text style={styles.volOrg}>{vol.organization}</Text>
                {vol.description && <Text style={styles.volDesc}>{vol.description}</Text>}
                {vol.impact && <Text style={styles.volImpact}>{vol.impact}</Text>}
              </View>
            );
            })}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={{ ...styles.section, marginBottom: 0 }}>
            <Text style={dynamicStyles.sectionTitle}>
              {lang === 'en' ? 'Projects' : lang === 'es' ? 'Proyectos' : 'Projetos'}
            </Text>
            {projects.map((proj, index) => {
              const isLast = index === projects.length - 1;
              return (
                <View key={index} style={{
                  ...dynamicStyles.projBlock,
                  marginBottom: isLast ? 0 : dynamicStyles.projBlock.marginBottom,
                  paddingBottom: isLast ? 0 : dynamicStyles.projBlock.paddingBottom,
                }}>
                <View style={styles.roleAndDate}>
                  <Text style={styles.projName}>{proj.name}</Text>
                  <Text style={styles.projYear}>{proj.year}</Text>
                </View>
                {proj.tech && <Text style={dynamicStyles.projTech}>{proj.tech}</Text>}
                {proj.description && <Text style={styles.projDesc}>{proj.description}</Text>}
                {proj.link && (
                  <Link src={proj.link} style={dynamicStyles.projLink}>
                    {lang === 'en' ? 'View Project' : lang === 'es' ? 'Ver Proyecto' : 'Ver Projeto'}
                  </Link>
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