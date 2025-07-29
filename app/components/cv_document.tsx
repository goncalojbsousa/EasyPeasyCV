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
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  header: { marginBottom: 13, paddingBottom: 8 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  desiredRole: { fontSize: 13, color: '#2563eb', fontWeight: 'bold', marginBottom: 8 },
  contactRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 2 },
  contactItem: { fontSize: 10, color: '#374151', marginRight: 12 },
  separator: { fontSize: 12, color: '#d1d5db', marginHorizontal: 8 },
  linksRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2, marginBottom: 2 },
  linkItem: { fontSize: 10, color: '#2563eb', textDecoration: 'underline', marginRight: 20, marginBottom: 2 },
  section: { marginBottom: 13 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#1e293b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid', paddingBottom: 4 },
  expBlock: { marginBottom: 12, paddingBottom: 6, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid' },
  roleAndDate: { fontSize: 10, color: '#64748b', marginBottom: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roleAndCompany: { fontSize: 11, color: '#0f172a', flexDirection: 'row' },
  jobRole: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  companyName: { fontSize: 11, color: '#64748b' },
  companySeparator: { fontSize: 11, color: '#64748b' },
  dateRange: { fontSize: 10, color: '#64748b' },
  tech: { fontSize: 10, color: '#2563eb', marginBottom: 2 },
  activities: { fontSize: 10, marginBottom: 2, marginLeft: 8 },
  results: { fontSize: 10, fontStyle: 'italic', marginLeft: 8, marginBottom: 2 },
  eduBlock: { marginBottom: 12, paddingBottom: 6, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid' },
  eduTitle: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  eduInst: { fontSize: 10, color: '#64748b', marginBottom: 2 },
  eduDesc: { fontSize: 10, marginLeft: 8, marginBottom: 2 },
  skillsLangRow: { flexDirection: 'row', gap: 32, marginBottom: 13 },
  skillsCol: { flex: 1, marginRight: 16 },
  langCol: { flex: 1 },
  skillText: { fontSize: 10, color: '#0f172a', marginBottom: 2 },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  langItem: { fontSize: 10, marginRight: 12 },
  certBlock: { marginBottom: 12, paddingBottom: 6, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid' },
  certName: { fontSize: 11, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 },
  certDate: { fontSize: 10, fontStyle: 'italic', color: '#64748b', marginLeft: 4 },
  certIssuer: { fontSize: 10, color: '#64748b', marginBottom: 2 },
  certLink: { fontSize: 10, color: '#2563eb', textDecoration: 'underline', marginBottom: 2 },
  certDesc: { fontSize: 10, marginLeft: 8, marginBottom: 2 },
  projBlock: { marginBottom: 12, paddingBottom: 6, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid' },
  projName: { fontSize: 11, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 },
  projYear: { fontSize: 10, color: '#64748b', marginLeft: 4 },
  projTech: { fontSize: 10, color: '#2563eb', marginBottom: 2 },
  projDesc: { fontSize: 10, marginLeft: 8, marginBottom: 2 },
  projLink: { fontSize: 10, color: '#2563eb', textDecoration: 'underline', marginLeft: 8 },
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
/**
 * CV Document component
 * Renders the complete CV structure for PDF generation using @react-pdf/renderer
 * @param props - Component props including all CV data and language
 * @returns JSX element representing the complete CV document structure
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
        case 'LinkedIn':
          return 'LinkedIn';
        case 'GitHub':
          return 'GitHub';
        case 'GitLab':
          return 'GitLab';
        case 'Portfolio':
          return 'Portfolio';
        case 'Outro':
          return 'Other';
        default:
          return type;
      }
    } else {
      // Portuguese (default)
      switch (type) {
        case 'LinkedIn':
          return 'LinkedIn';
        case 'GitHub':
          return 'GitHub';
        case 'GitLab':
          return 'GitLab';
        case 'Portfolio':
          return 'Portfolio';
        case 'Outro':
          return 'Outro';
        default:
          return type;
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
      // Portuguese (default) - translate English to Portuguese
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
    if (lang === 'en') {
      switch (level) {
        case 'Básico': return 'Basic';
        case 'Intermediário': return 'Intermediate';
        case 'Avançado': return 'Advanced';
        case 'Fluente': return 'Fluent';
        case 'Nativo': return 'Native';
        default: return level;
      }
    } else {
      // Portuguese (default) - translate English to Portuguese
      switch (level) {
        case 'Basic': return 'Básico';
        case 'Intermediate': return 'Intermediário';
        case 'Advanced': return 'Avançado';
        case 'Fluent': return 'Fluente';
        case 'Native': return 'Nativo';
        default: return level;
      }
    }
  };

  // Helper to translate "Current"
  const translateCurrent = (lang: string) => {
    return lang === 'en' ? 'Current' : 'Atual';
  };

  // Helper to translate education types
  const translateEducationType = (type: string, lang: string) => {
    if (lang === 'en') {
      switch (type) {
        case 'Licenciatura':
          return 'Bachelor\'s Degree';
        case 'Mestrado':
          return 'Master\'s Degree';
        case 'Doutoramento':
          return 'PhD';
        case 'Pós-Graduação':
          return 'Postgraduate';
        case 'Curso Técnico':
          return 'Technical Course';
        default:
          return type;
      }
    } else {
      // Portuguese (default)
      switch (type) {
        case 'Bachelor\'s Degree':
          return 'Licenciatura';
        case 'Master\'s Degree':
          return 'Mestrado';
        case 'PhD':
          return 'Doutoramento';
        case 'Postgraduate':
          return 'Pós-Graduação';
        case 'Technical Course':
          return 'Curso Técnico';
        default:
          return type;
      }
    }
  };

  // Helper to translate education status
  const translateEducationStatus = (status: string, lang: string) => {
    if (lang === 'en') {
      switch (status) {
        case 'Completo':
          return 'Completed';
        case 'Em curso':
          return 'In Progress';
        case 'Em andamento':
          return 'In Progress';
        case 'Incompleto':
          return 'Incomplete';
        case 'Interrompido':
          return 'Interrupted';
        default:
          return status;
      }
    } else {
      // Portuguese (default)
      switch (status) {
        case 'Completed':
          return 'Completo';
        case 'In Progress':
          return 'Em andamento';
        case 'Incomplete':
          return 'Incompleto';
        case 'Interrupted':
          return 'Interrompido';
        default:
          return status;
      }
    }
  };

  // Helper to translate certification descriptions
  const translateCertificationDesc = (desc: string, lang: string) => {
    if (lang === 'en') {
      switch (desc) {
        case 'Foco em sistemas escaláveis e tolerantes a falhas.':
          return 'Focus on scalable and fault-tolerant systems.';
        default:
          return desc;
      }
    } else {
      // Portuguese (default)
      switch (desc) {
        case 'Focus on scalable and fault-tolerant systems.':
          return 'Foco em sistemas escaláveis e tolerantes a falhas.';
        default:
          return desc;
      }
    }
  };

  // Helper to convert month number to month name
  const getMonthName = (monthNum: string, lang: string) => {
    const monthMap = {
      '01': lang === 'en' ? 'Jan' : 'Jan',
      '02': lang === 'en' ? 'Feb' : 'Fev',
      '03': lang === 'en' ? 'Mar' : 'Mar',
      '04': lang === 'en' ? 'Apr' : 'Abr',
      '05': lang === 'en' ? 'May' : 'Mai',
      '06': lang === 'en' ? 'Jun' : 'Jun',
      '07': lang === 'en' ? 'Jul' : 'Jul',
      '08': lang === 'en' ? 'Aug' : 'Ago',
      '09': lang === 'en' ? 'Sep' : 'Set',
      '10': lang === 'en' ? 'Oct' : 'Out',
      '11': lang === 'en' ? 'Nov' : 'Nov',
      '12': lang === 'en' ? 'Dec' : 'Dez'
    };
    return monthMap[monthNum as keyof typeof monthMap] || monthNum;
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
          <Text style={styles.desiredRole}>{personalInfo?.desiredRole}</Text>
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
                    {translateLinkType(l.type, currentLang)}: {l.value}
                  </Link>
                ) : null
              ))}
            </View>
          )}
        </View>

        {/* Professional Summary section */}
        <View style={{ ...styles.section, marginBottom: (filteredExperiences?.length > 0 || filteredEducation?.length > 0 || skills || filteredLanguages?.length > 0 || filteredCertifications?.length > 0 || filteredProjects?.length > 0) ? 13 : 0 }}>
          <Text style={styles.sectionTitle}>{sectionTitles[currentLang].summary}</Text>
          <Text style={{ marginBottom: 0 }}>{resume}</Text>
        </View>

        {/* Professional Experience section */}
        {filteredExperiences?.length > 0 && (
          <View style={{ ...styles.section, marginBottom: (filteredEducation?.length > 0 || skills || filteredLanguages?.length > 0 || filteredCertifications?.length > 0 || filteredProjects?.length > 0) ? 13 : 0 }}>
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
                    marginBottom: showSeparator ? styles.expBlock.marginBottom : 0,
                    borderBottomWidth: showSeparator ? styles.expBlock.borderBottomWidth : 0,
                    borderBottomColor: showSeparator ? styles.expBlock.borderBottomColor : undefined,
                    borderBottomStyle: showSeparator ? styles.expBlock.borderBottomStyle : undefined,
                  }}
                >
                  {(exp.role || exp.company || hasDates) && (
                    <View style={styles.roleAndDate}>
                      <View style={styles.roleAndCompany}>
                        {exp.role && <Text style={styles.jobRole}>{exp.role} </Text>}
                        {(exp.role && exp.company) && <Text style={styles.companySeparator}>- </Text>}
                        {exp.company && <Text style={styles.companyName}>{exp.company}</Text>}
                      </View>
                      {hasDates && (
                        <Text style={styles.dateRange}>
                          {`${translateMonth(exp.startMonth || '', currentLang)}${exp.startMonth && exp.startYear ? '/' : ''}${exp.startYear || ''} – ${exp.current ? translateCurrent(currentLang) : ((translateMonth(exp.endMonth || '', currentLang)) + (exp.endMonth && exp.endYear ? '/' : '') + (exp.endYear || ''))}`}
                        </Text>
                      )}
                    </View>
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
          <View style={{ ...styles.section, marginBottom: (skills || filteredLanguages?.length > 0 || filteredCertifications?.length > 0 || filteredProjects?.length > 0) ? 13 : 0 }}>
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
                    marginBottom: showSeparator ? styles.eduBlock.marginBottom : 0,
                    borderBottomWidth: showSeparator ? styles.eduBlock.borderBottomWidth : 0,
                    borderBottomColor: showSeparator ? styles.eduBlock.borderBottomColor : undefined,
                    borderBottomStyle: showSeparator ? styles.eduBlock.borderBottomStyle : undefined,
                  }}
                >
                  {(ed.type || ed.course || ed.status) && (
                    <Text style={styles.eduTitle}>
                      {ed.course}{ed.course && ed.type ? ' - ' : ''}{translateEducationType(ed.type, currentLang)}
                      {ed.status && <Text style={styles.certDate}> ({translateEducationStatus(ed.status, currentLang)})</Text>}
                    </Text>
                  )}
                  {(ed.institution || hasDates) && (
                    <Text style={styles.eduInst}>
                      {ed.institution}
                      {ed.institution && hasDates ? ' | ' : ''}
                      {hasDates ? (
                        (ed.status === 'Completo' || ed.status === 'Completed') ? 
                          `${translateMonth(ed.startMonth || '', currentLang)}${ed.startMonth && ed.startYear ? '/' : ''}${ed.startYear || ''} - ${translateMonth(ed.endMonth || '', currentLang)}${ed.endMonth && ed.endYear ? '/' : ''}${ed.endYear || ''}` :
                          `${translateMonth(ed.startMonth || '', currentLang)}${ed.startMonth && ed.startYear ? '/' : ''}${ed.startYear || ''} - ${translateCurrent(currentLang)}`
                      ) : ''}
                    </Text>
                  )}
                  {ed.description && <Text style={styles.eduDesc}>• {ed.description}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* Skills and Languages in columns */}
        {(skills || filteredLanguages?.length > 0) && (
          <View style={{ ...styles.skillsLangRow, marginBottom: (filteredCertifications?.length > 0 || filteredProjects?.length > 0) ? 13 : 0 }}>
            <View style={styles.skillsCol}>
              <Text style={styles.sectionTitle}>{sectionTitles[currentLang].skills}</Text>
              <Text style={styles.skillText}>{skills}</Text>
            </View>
            <View style={styles.langCol}>
              <Text style={styles.sectionTitle}>{sectionTitles[currentLang].languages}</Text>
              <View style={styles.langRow}>
                {filteredLanguages.map((lang: any, i: number) => {
                  if (!lang.name && !lang.level) return null;
                  return <Text key={i} style={styles.langItem}>{lang.name}{lang.name && lang.level ? ' - ' : ''}{translateLanguageLevel(lang.level, currentLang)}</Text>;
                })}
              </View>
            </View>
          </View>
        )}

        {/* Certifications/Courses section */}
        {filteredCertifications?.length > 0 && (
          <View style={{ ...styles.section, marginBottom: filteredProjects?.length > 0 ? 13 : 0 }}>
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
                    marginBottom: showSeparator ? styles.certBlock.marginBottom : 0,
                    borderBottomWidth: showSeparator ? styles.certBlock.borderBottomWidth : 0,
                    borderBottomColor: showSeparator ? styles.certBlock.borderBottomColor : undefined,
                    borderBottomStyle: showSeparator ? styles.certBlock.borderBottomStyle : undefined,
                  }}
                >
                  {(cert.name || cert.completionDate) && (
                    <Text style={styles.certName}>
                      {cert.name}
                      {cert.completionDate && (
                        <Text style={styles.certDate}>
                          {' '}({cert.completionDate.includes('-') ? 
                            `${getMonthName(cert.completionDate.split('-')[1] || '', currentLang)} ${cert.completionDate.split('-')[0] || ''}` : 
                            cert.completionDate
                          })
                        </Text>
                      )}
                    </Text>
                  )}
                  {(cert.hours || cert.issuer) && (
                    <Text style={styles.certIssuer}>
                      {cert.hours ? `${cert.hours}${cert.hours.includes('h') ? '' : 'h'}` : ''}{cert.hours && cert.issuer ? ' | ' : ''}{cert.issuer || ''}
                    </Text>
                  )}
                  {cert.description && <Text style={styles.certDesc}>• {translateCertificationDesc(cert.description, currentLang)}</Text>}
                  {cert.validationLink && (
                    <Link src={cert.validationLink} style={styles.certLink}>
                      {cert.validationLink}
                    </Link>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Projects section */}
        {filteredProjects?.length > 0 && (
          <View style={{ ...styles.section, marginBottom: 0 }}>
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
                    ...styles.projBlock,
                    marginBottom: showSeparator ? styles.projBlock.marginBottom : 0,
                    borderBottomWidth: showSeparator ? styles.projBlock.borderBottomWidth : 0,
                    borderBottomColor: showSeparator ? styles.projBlock.borderBottomColor : undefined,
                    borderBottomStyle: showSeparator ? styles.projBlock.borderBottomStyle : undefined,
                  }}
                >
                  {proj.name && (
                    <Text style={styles.projName}>{proj.name}{proj.year && <Text style={styles.projYear}> ({proj.year})</Text>}</Text>
                  )}
                  {proj.tech && (
                    <Text style={styles.projTech}>{proj.tech}</Text>
                  )}
                  {proj.description && (
                    <Text style={styles.projDesc}>• {proj.description}</Text>
                  )}
                  {proj.link && (
                    <Link src={proj.link} style={styles.projLink}>{proj.link}</Link>
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
