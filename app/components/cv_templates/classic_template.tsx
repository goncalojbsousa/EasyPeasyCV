import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { CvData } from '../../types/cv';
import { translateMonthForLang } from '../../utils/months';

/**
 * Props interface for the ClassicTemplate component
 */
interface ClassicTemplateProps extends CvData {
  /** Language for the document (pt, en or es) */
  lang?: string;
}

/**
 * Classic template styles with traditional and professional design
 */
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 11, fontFamily: 'Helvetica' },
    header: { marginBottom: 13, paddingBottom: 8 },
    name: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
    desiredRole: { fontSize: 13, color: '#2563eb', fontWeight: 'bold', marginBottom: 8 },
    contactRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 2 },
    contactItem: { fontSize: 10, color: '#374151', marginRight: 12 },
    separator: { fontSize: 12, color: '#d1d5db', marginHorizontal: 8 },
    linksRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2, marginBottom: 2 },
    linkItem: { fontSize: 9, color: '#2563eb', textDecoration: 'underline', marginRight: 20, marginBottom: 2 },
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
    certLink: { fontSize: 9, color: '#2563eb', textDecoration: 'underline', marginBottom: 2 },
    certDesc: { fontSize: 10, marginLeft: 8, marginBottom: 2 },
    projBlock: { marginBottom: 12, paddingBottom: 6, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid' },
    projName: { fontSize: 11, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 },
    projYear: { fontSize: 10, color: '#64748b', marginLeft: 4 },
    projTech: { fontSize: 10, color: '#2563eb', marginBottom: 2 },
    projDesc: { fontSize: 10, marginLeft: 8, marginBottom: 2 },
    projLink: { fontSize: 9, color: '#2563eb', textDecoration: 'underline', marginLeft: 8 },
    volBlock: { marginBottom: 12, paddingBottom: 6, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid' },
    volRole: { fontSize: 11, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 },
    volOrg: { fontSize: 10, color: '#64748b', marginBottom: 2 },
    volDesc: { fontSize: 10, marginLeft: 8, marginBottom: 2 },
    volImpact: { fontSize: 10, fontStyle: 'italic', marginLeft: 8, marginBottom: 2 },
  });

/**
 * Classic CV Template component
 * Features a traditional and professional layout
 * @param props - Component props including all CV data and language
 * @returns JSX element representing the classic CV template
 */
export function ClassicTemplate({
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
}: ClassicTemplateProps) {
  // Normalize language: treat 'br' as 'pt' for template translations
  const l = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  
  const contactItems = [
    personalInfo?.city,
    personalInfo?.postalCode,
    personalInfo?.email,
    personalInfo?.countryCode && personalInfo?.phone ? `${personalInfo.countryCode.match(/\(([^)]+)\)/)?.[1] || personalInfo.countryCode} ${personalInfo.phone}` : personalInfo?.phone
  ].filter(Boolean);

  /**
   * Build a fully-qualified URL for a social/contact entry.
   * Supports email (mailto:), phone (tel:) and common platforms.
   */
  function getSocialUrl(type: string, value: string) {
    if (!value) return '';
    const val = value.trim();
    const hasProtocol = /^https?:\/\//i.test(val);
    const lower = type.toLowerCase();

    if (lower === 'email') return `mailto:${val}`;
    if (lower === 'phone') return `tel:${val}`;

    // If the value already includes a known domain but lacks protocol, prefix https
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

  /**
   * Localize a link type label (e.g., LinkedIn, Website) for the given language.
   */
  function translateLinkType(type: string, lang: string, customName?: string) {
    // If it's "Other" type and has a custom name, return the custom name
    if (type === 'Other' && customName) {
      return customName;
    }
    
    if ((lang === 'en')) {
      switch (type) {
        case 'LinkedIn': return 'LinkedIn';
        case 'GitHub': return 'GitHub';
        case 'GitLab': return 'GitLab';
        case 'Portfolio': return 'Portfolio';
        case 'Other': return 'Other';
        default: return type;
      }
    } else if ((lang === 'es')) {
      switch (type) {
        case 'LinkedIn': return 'LinkedIn';
        case 'GitHub': return 'GitHub';
        case 'GitLab': return 'GitLab';
        case 'Portfolio': return 'Portfolio';
        case 'Other': return 'Otro';
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

  /**
   * Translate month abbreviations across pt/en/es.
   */
  function translateMonth(month: string, lang: string) {
    const target = (lang === 'br' ? 'pt' : lang) as 'pt' | 'en' | 'es';
    return translateMonthForLang(month, target);
  };

  /**
   * Localize the "current" date label used in ranges.
   */
  function translateCurrent(lang: string) {
    const target = (lang === 'br' ? 'pt' : lang);
    if (target === 'en') return 'Current';
    if (target === 'es') return 'Actual';
    return 'Atual';
  };

  // ... rest of the code remains the same ...
  // Helper to translate education types
  const translateEducationType = (type: string, lang: string) => {
    // Support i18n keys from the form
    const map = {
      // Keys
      'education.type.secondary': { pt: 'Ensino Secundário', en: 'Secondary Education', es: 'Educación Secundaria' },
      'education.type.technical': { pt: 'Curso Técnico', en: 'Technical Course', es: 'Curso Técnico' },
      'education.type.bachelor':  { pt: 'Licenciatura', en: "Bachelor's Degree", es: 'Grado' },
      'education.type.postgraduate': { pt: 'Pós-Graduação', en: 'Postgraduate', es: 'Posgrado' },
      'education.type.master':    { pt: 'Mestrado', en: "Master's Degree", es: 'Máster' },
      'education.type.phd':       { pt: 'Doutoramento', en: 'PhD', es: 'Doctorado' },
    } as const;

    type LangKey = 'pt' | 'en' | 'es';
    type EducationTypeKey = keyof typeof map;
    if (Object.prototype.hasOwnProperty.call(map, type)) {
      const entry = map[type as EducationTypeKey];
      return entry[(lang as LangKey) || 'pt'] || type;
    }
    return type;
  };

  // Helper to translate education status
  const translateEducationStatus = (status: string, lang: string) => {
    // Normalize i18n keys literals to target language
    const map = {
      // Keys
      'education.status.completed':  { pt: 'Completo', en: 'Completed', es: 'Completado' },
      'education.status.in.progress':{ pt: 'Em andamento', en: 'In Progress', es: 'En curso' },
      'education.status.interrupted':{ pt: 'Interrompido', en: 'Interrupted', es: 'Interrumpido' },
    } as const;

    type LangKey = 'pt' | 'en' | 'es';
    type EducationStatusKey = keyof typeof map;
    if (Object.prototype.hasOwnProperty.call(map, status)) {
      const entry = map[status as EducationStatusKey];
      return entry[(lang as LangKey) || 'pt'] || status;
    }
    return status;
  };

  // Helper to determine if education is completed based on status value (supports i18n keys)
  const isEducationCompleted = (status?: string) => {
    if (!status) return false;
    const normalized = status.trim();
    return [
      'education.status.completed',
    ].includes(normalized);
  };

  // Helper to translate language levels
  const translateLanguageLevel = (level: string, lang: string) => {
    if (!level) return '';

    // Normalize input to reduce key mismatches
    const normalized = String(level).trim();

    const levelMap = {
      // CEFR levels
      'language.level.a1': { pt: 'A1', en: 'A1', es: 'A1' },
      'language.level.a2': { pt: 'A2', en: 'A2', es: 'A2' },
      'language.level.b1': { pt: 'B1', en: 'B1', es: 'B1' },
      'language.level.b2': { pt: 'B2', en: 'B2', es: 'B2' },
      'language.level.c1': { pt: 'C1', en: 'C1', es: 'C1' },
      'language.level.c2': { pt: 'C2', en: 'C2', es: 'C2' },
    } as const;

    // 1) Direct map lookup (type-safe)
    type LevelKey = keyof typeof levelMap;
    if (Object.prototype.hasOwnProperty.call(levelMap, normalized)) {
      const direct = levelMap[normalized as LevelKey];
      return direct[lang as keyof typeof direct] ?? normalized;
    }

    // 2) Generic key fallback: language.level.<cefr>
    if (normalized.toLowerCase().startsWith('language.level.')) {
      const suf = normalized.substring('language.level.'.length).toUpperCase();
      const valid = ['A1','A2','B1','B2','C1','C2'];
      if (valid.includes(suf)) return suf; // CEFR labels are language-agnostic
    }

    // 3) Last resort: return normalized value
    return normalized;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.name}</Text>
          <Text style={styles.desiredRole}>{personalInfo?.desiredRole}</Text>
          
          {/* Contact Information */}
          <View style={styles.contactRow}>
            {contactItems.map((item, index) => (
              <React.Fragment key={index}>
                <Text style={styles.contactItem}>{item}</Text>
                {index < contactItems.length - 1 && <Text style={styles.separator}>|</Text>}
              </React.Fragment>
            ))}
          </View>

          {/* Social Links */}
          {links.length > 0 && (
            <View style={styles.linksRow}>
              {links.map((link, index) => (
                <Link key={index} src={getSocialUrl(link.type, link.value)} style={styles.linkItem}>
                  {translateLinkType(link.type, l, link.customName)}: {link.value}
                </Link>
              ))}
            </View>
          )}
        </View>

        {/* Professional Summary */}
        {resume && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {l === 'en' ? 'Professional Summary' : l === 'es' ? 'Resumen Profesional' : 'Resumo Profissional'}
            </Text>
            <Text>{resume}</Text>
          </View>
        )}

        {/* Professional Experience */}
        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {l === 'en' ? 'Professional Experience' : l === 'es' ? 'Experiencia Profesional' : 'Experiência Profissional'}
            </Text>
            {experiences.map((exp, index) => {
              const showSeparator = experiences.length > 1 && index < experiences.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.expBlock,
                    marginBottom: showSeparator ? styles.expBlock.marginBottom : 0,
                    borderBottomWidth: showSeparator ? styles.expBlock.borderBottomWidth : 0,
                    borderBottomColor: showSeparator ? styles.expBlock.borderBottomColor : undefined,
                    borderBottomStyle: showSeparator ? styles.expBlock.borderBottomStyle : undefined,
                  }}
                >
                  <View style={styles.roleAndDate}>
                    <View style={styles.roleAndCompany}>
                      {exp.role && <Text style={styles.jobRole}>{exp.role} </Text>}
                      {(exp.role && exp.company) && <Text style={styles.companySeparator}>- </Text>}
                      {exp.company && <Text style={styles.companyName}>{exp.company}</Text>}
                    </View>
                    <Text style={styles.dateRange}>
                      {`${translateMonth(exp.startMonth || '', l)}${exp.startMonth && exp.startYear ? '/' : ''}${exp.startYear || ''} - ${exp.current ? translateCurrent(l) : ((translateMonth(exp.endMonth || '', l)) + (exp.endMonth && exp.endYear ? '/' : '') + (exp.endYear || ''))}`}
                    </Text>
                  </View>
                  {exp.tech && <Text style={styles.tech}>{exp.tech}</Text>}
                  {exp.activities && <Text style={styles.activities}>• {exp.activities}</Text>}
                  {exp.results && <Text style={styles.results}>• {exp.results}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {l === 'en' ? 'Education' : l === 'es' ? 'Educación' : 'Formação Académica'}
            </Text>
            {education.map((edu, index) => {
              const showSeparator = education.length > 1 && index < education.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.eduBlock,
                    marginBottom: showSeparator ? styles.eduBlock.marginBottom : 0,
                    borderBottomWidth: showSeparator ? styles.eduBlock.borderBottomWidth : 0,
                    borderBottomColor: showSeparator ? styles.eduBlock.borderBottomColor : undefined,
                    borderBottomStyle: showSeparator ? styles.eduBlock.borderBottomStyle : undefined,
                  }}
                >
                  <View style={styles.roleAndDate}>
                    <Text style={styles.eduTitle}>
                      {edu.course}{edu.course && edu.type ? ' - ' : ''}{translateEducationType(edu.type, l)}
                      {edu.status && <Text style={styles.certDate}> ({translateEducationStatus(edu.status, l)})</Text>}
                    </Text>
                    <Text style={styles.dateRange}>
                      {(edu.startMonth || edu.startYear) ? (
                        isEducationCompleted(edu.status) ?
                          `${translateMonth(edu.startMonth || '', l)}${edu.startMonth && edu.startYear ? '/' : ''}${edu.startYear || ''} - ${translateMonth(edu.endMonth || '', l)}${edu.endMonth && edu.endYear ? '/' : ''}${edu.endYear || ''}` :
                          `${translateMonth(edu.startMonth || '', l)}${edu.startMonth && edu.startYear ? '/' : ''}${edu.startYear || ''} - ${translateCurrent(l)}`
                      ) : ''}
                    </Text>
                  </View>
                  <Text style={styles.eduInst}>
                    {edu.institution}
                  </Text>
                  {edu.description && <Text style={styles.eduDesc}>• {edu.description}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* Skills and Languages */}
        {(skills || languages.length > 0) && (
          <View style={styles.section}>
            <View style={styles.skillsLangRow}>
              {skills && (
                <View style={styles.skillsCol}>
                              <Text style={styles.sectionTitle}>
              {l === 'en' ? 'Technical Skills' : l === 'es' ? 'Competencias Técnicas' : 'Competências Técnicas'}
            </Text>
                  <Text style={styles.skillText}>{skills}</Text>
                </View>
              )}
              
              {languages.length > 0 && (
                <View style={styles.langCol}>
                  <Text style={styles.sectionTitle}>
                    {l === 'en' ? 'Languages' : 'Idiomas'}
                  </Text>
                  <View style={styles.langRow}>
                    {languages.map((language, index) => (
                      <Text key={index} style={styles.langItem}>
                        {language.name} ({translateLanguageLevel(language.level, l)})
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
            <Text style={styles.sectionTitle}>
              {l === 'en' ? 'Certifications' : 'Certificações'}
            </Text>
            {certifications.map((cert, index) => {
              const showSeparator = certifications.length > 1 && index < certifications.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.certBlock,
                    marginBottom: showSeparator ? styles.certBlock.marginBottom : 0,
                    paddingBottom: showSeparator ? styles.certBlock.paddingBottom : 0,
                    borderBottomWidth: showSeparator ? styles.certBlock.borderBottomWidth : 0,
                    borderBottomColor: showSeparator ? styles.certBlock.borderBottomColor : undefined,
                    borderBottomStyle: showSeparator ? styles.certBlock.borderBottomStyle : undefined,
                  }}
                >
                  <View style={styles.roleAndDate}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    <Text style={styles.dateRange}>{cert.completionDate}</Text>
                  </View>
                  <Text style={styles.certIssuer}>{cert.issuer}</Text>
                  {cert.validationLink && (
                    <Link src={cert.validationLink} style={styles.certLink}>
                      {cert.validationLink}
                    </Link>
                  )}
                  {cert.description && <Text style={styles.certDesc}>• {cert.description}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* Volunteer Work */}
                      {volunteers && volunteers.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {l === 'en' ? 'Volunteer Work' : 'Voluntariado'}
                  </Text>
                  {volunteers.map((vol, index) => {
                    const showSeparator = volunteers.length > 1 && index < volunteers.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.volBlock,
                    marginBottom: showSeparator ? styles.volBlock.marginBottom : 0,
                    paddingBottom: showSeparator ? styles.volBlock.paddingBottom : 0,
                    borderBottomWidth: showSeparator ? styles.volBlock.borderBottomWidth : 0,
                    borderBottomColor: showSeparator ? styles.volBlock.borderBottomColor : undefined,
                    borderBottomStyle: showSeparator ? styles.volBlock.borderBottomStyle : undefined,
                  }}
                >
                  <View style={styles.roleAndDate}>
                    <Text style={styles.volRole}>{vol.role}</Text>
                    <Text style={styles.dateRange}>
                      {vol.startMonth && vol.startYear ? `${translateMonth(vol.startMonth, l)} ${vol.startYear}` : ''}
                      {vol.startMonth && vol.startYear && (vol.endMonth || vol.endYear || vol.current) ? ' - ' : ''}
                      {vol.current ? translateCurrent(l) : vol.endMonth && vol.endYear ? `${translateMonth(vol.endMonth, l)} ${vol.endYear}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.volOrg}>{vol.organization}</Text>
                  {vol.description && <Text style={styles.volDesc}>• {vol.description}</Text>}
                  {vol.impact && <Text style={styles.volImpact}>• {vol.impact}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={{ ...styles.section, marginBottom: 0 }}>
            <Text style={styles.sectionTitle}>
              {l === 'en' ? 'Projects' : l === 'es' ? 'Proyectos' : 'Projetos'}
            </Text>
            {projects.map((proj, index) => {
              const showSeparator = projects.length > 1 && index < projects.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.projBlock,
                    marginBottom: showSeparator ? styles.projBlock.marginBottom : 0,
                    paddingBottom: showSeparator ? styles.projBlock.paddingBottom : 0,
                    borderBottomWidth: showSeparator ? styles.projBlock.borderBottomWidth : 0,
                    borderBottomColor: showSeparator ? styles.projBlock.borderBottomColor : undefined,
                    borderBottomStyle: showSeparator ? styles.projBlock.borderBottomStyle : undefined,
                  }}
                >
                  <View style={styles.roleAndDate}>
                    <Text style={styles.projName}>{proj.name}</Text>
                    <Text style={styles.dateRange}>{proj.year}</Text>
                  </View>
                  {proj.tech && <Text style={styles.projTech}>{proj.tech}</Text>}
                  {proj.description && <Text style={styles.projDesc}>• {proj.description}</Text>}
                  {proj.link && (
                    <Link src={proj.link} style={styles.projLink}>
                      {proj.link}
                    </Link>
                  )}
                  {proj.sourceCode && (
                    <Link src={proj.sourceCode} style={styles.projLink}>
                      {proj.sourceCode}
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