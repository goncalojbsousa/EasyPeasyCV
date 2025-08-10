import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { CvData, CvColor } from '../../types/cv';
import { getColorTheme } from '../../utils/color-themes';

/**
 * Props interface for the MinimalTemplate component
 */
interface MinimalTemplateProps extends CvData {
  /** Language for the document (pt, en or es) */
  lang?: string;
  /** Optional color theme */
  color?: CvColor;
}

/**
 * Minimal template styles with clean two-column layout (sidebar + main)
 */
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  // Layout
  container: { flexDirection: 'row' },
  sidebar: { width: 180, backgroundColor: '#f8fafc', padding: 20, minHeight: '100%' },
  main: { flex: 1, padding: 30 },

  // Header (in main)
  header: { marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  desiredRole: { fontSize: 12, color: '#334155', marginTop: 4 },

  // Sidebar blocks
  sideSectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#0f172a', marginTop: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  contactItem: { fontSize: 9, color: '#334155', marginBottom: 4 },
  linkItem: { fontSize: 9, color: '#2563eb', textDecoration: 'underline', marginBottom: 4 },
  skillPill: { fontSize: 9, color: '#0f172a', backgroundColor: '#e2e8f0', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, marginRight: 6, marginBottom: 6 },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  langItem: { fontSize: 9, color: '#0f172a', marginBottom: 4 },

  // Sections (main)
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  summary: { fontSize: 10, color: '#334155', lineHeight: 1.4 },

  expBlock: { marginBottom: 10 },
  roleAndDate: { fontSize: 9, color: '#64748b', marginBottom: 3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roleAndCompany: { fontSize: 10, color: '#0f172a', flexDirection: 'row' },
  jobRole: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  companyName: { fontSize: 10, color: '#64748b' },
  companySeparator: { fontSize: 10, color: '#64748b' },
  dateRange: { fontSize: 9, color: '#64748b' },
  tech: { fontSize: 9, color: '#2563eb', marginBottom: 3, fontWeight: 'bold' },
  activities: { fontSize: 9, color: '#334155', marginBottom: 3 },
  results: { fontSize: 9, fontStyle: 'italic', color: '#059669' },

  eduBlock: { marginBottom: 10 },
  eduTitle: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  eduInst: { fontSize: 9, color: '#64748b', marginBottom: 3 },
  eduDesc: { fontSize: 9, color: '#334155' },

  projBlock: { marginBottom: 10 },
  projName: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  projYear: { fontSize: 9, color: '#64748b', marginLeft: 6 },
  projTech: { fontSize: 9, color: '#2563eb', marginBottom: 3 },
  projDesc: { fontSize: 9, color: '#334155' },
  projLink: { fontSize: 9, color: '#2563eb', textDecoration: 'underline' },

  certBlock: { marginBottom: 10 },
  certName: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  certDate: { fontSize: 9, fontStyle: 'italic', color: '#64748b' },
  certIssuer: { fontSize: 9, color: '#64748b' },
  certLink: { fontSize: 9, color: '#2563eb', textDecoration: 'underline' },
  certDesc: { fontSize: 9, color: '#334155' },

  volBlock: { marginBottom: 10 },
  volRole: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  volOrg: { fontSize: 9, color: '#64748b' },
  volDesc: { fontSize: 9, color: '#334155' },
  volImpact: { fontSize: 9, fontStyle: 'italic', color: '#059669' },
});

// Helpers
function translateLinkType(type: string, lang: string, customName?: string) {
  const map: Record<string, Record<string, string>> = {
    pt: { email: 'Email', phone: 'Telefone', linkedin: 'LinkedIn', github: 'GitHub', portfolio: 'Portefólio', other: customName || 'Outro' },
    en: { email: 'Email', phone: 'Phone', linkedin: 'LinkedIn', github: 'GitHub', portfolio: 'Portfolio', other: customName || 'Other' },
    es: { email: 'Correo', phone: 'Teléfono', linkedin: 'LinkedIn', github: 'GitHub', portfolio: 'Portafolio', other: customName || 'Otro' },
  };
  const l = map[lang as keyof typeof map] ? lang : 'pt';
  return map[l][type] || customName || type;
}

function getSocialUrl(type: string, value: string) {
  if (!value) return '';
  const val = value.trim();
  const hasProtocol = /^https?:\/\//i.test(val);
  const lowerType = type.toLowerCase();
  if (lowerType === 'email') return `mailto:${val}`;
  if (lowerType === 'phone') return `tel:${val}`;

  if (!hasProtocol) {
    if (/linkedin\.com/i.test(val)) return `https://${val}`;
    if (/github\.com/i.test(val)) return `https://${val}`;
    if (/gitlab\.com/i.test(val)) return `https://${val}`;
  }

  if (!hasProtocol) {
    if (lowerType === 'linkedin') return `https://www.linkedin.com/in/${val}`;
    if (lowerType === 'github') return `https://github.com/${val}`;
    if (lowerType === 'gitlab') return `https://gitlab.com/${val}`;
    return `https://${val}`;
  }
  return val;
}

function translateMonth(month: string, lang: string) {
  const dict: Record<string, Record<string, string>> = {
    pt: { Jan: 'Jan', Feb: 'Fev', Mar: 'Mar', Apr: 'Abr', May: 'Mai', Jun: 'Jun', Jul: 'Jul', Aug: 'Ago', Sep: 'Set', Oct: 'Out', Nov: 'Nov', Dec: 'Dez' },
    en: { Jan: 'Jan', Feb: 'Feb', Mar: 'Mar', Apr: 'Apr', May: 'May', Jun: 'Jun', Jul: 'Jul', Aug: 'Aug', Sep: 'Sep', Oct: 'Oct', Nov: 'Nov', Dec: 'Dec' },
    es: { Jan: 'Ene', Feb: 'Feb', Mar: 'Mar', Apr: 'Abr', May: 'May', Jun: 'Jun', Jul: 'Jul', Aug: 'Ago', Sep: 'Sep', Oct: 'Oct', Nov: 'Nov', Dec: 'Dic' },
  };
  const l: 'pt'|'en'|'es' = lang === 'en' ? 'en' : lang === 'es' ? 'es' : 'pt';
  return dict[l][month] || month;
}

function translateCurrent(lang: string) {
  const l: 'pt'|'en'|'es' = lang === 'en' ? 'en' : lang === 'es' ? 'es' : 'pt';
  if (l === 'en') return 'Present';
  if (l === 'es') return 'Actual';
  return 'Atual';
}

// Translates language level values (e.g., 'language.level.c1', 'C1', 'fluent') to localized labels
function translateLanguageLevel(level: string, lang: string) {
  if (!level) return '';
  const key = level.trim().toLowerCase();

  // CEFR codes mapping (displayed the same across languages)
  const cefrMap: Record<string, string> = {
    'a1': 'A1',
    'a2': 'A2',
    'b1': 'B1',
    'b2': 'B2',
    'c1': 'C1',
    'c2': 'C2',
  };

  // Extract trailing token if key comes like 'language.level.c1'
  const parts = key.split('.');
  const last = parts[parts.length - 1];
  if (cefrMap[last]) return cefrMap[last];

  // Common verbal levels
  const verbalLevels = {
    en: {
      native: 'Native',
      fluent: 'Fluent',
      advanced: 'Advanced',
      intermediate: 'Intermediate',
      basic: 'Basic',
      beginner: 'Beginner',
    },
    es: {
      native: 'Nativo',
      fluent: 'Fluido',
      advanced: 'Avanzado',
      intermediate: 'Intermedio',
      basic: 'Básico',
      beginner: 'Principiante',
    },
    pt: {
      native: 'Nativo',
      fluent: 'Fluente',
      advanced: 'Avançado',
      intermediate: 'Intermédio',
      basic: 'Básico',
      beginner: 'Iniciante',
    },
  } as const;

  type VerbalDict = Record<keyof typeof verbalLevels.en, string>;
  const l: 'pt'|'en'|'es' = lang === 'en' ? 'en' : lang === 'es' ? 'es' : 'pt';
  const dict: VerbalDict = l === 'en' ? verbalLevels.en : l === 'es' ? verbalLevels.es : verbalLevels.pt;

  // Handle keys like 'language.level.native' too
  const verbalKey = (last in dict ? last : key.replace('language.level.', '')) as keyof VerbalDict;
  if (verbalKey in dict) return dict[verbalKey];

  // Fallback: if it's already something like 'C1' return as-is uppercase
  if (cefrMap[key]) return cefrMap[key];
  return level;
}

export function MinimalTemplate({
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
}: MinimalTemplateProps) {
  const theme = getColorTheme(color);

  // dynamic styles using theme
  const dynamic = StyleSheet.create({
    accentText: { color: theme.primary },
    link: { color: theme.primary },
    pill: { backgroundColor: theme.accent },
    sectionTitle: { borderBottomWidth: 1, borderBottomColor: theme.accent, borderBottomStyle: 'solid' },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <Text style={styles.sideSectionTitle}>{personalInfo.name}</Text>
            <Text style={[styles.contactItem, styles.desiredRole, dynamic.accentText]}>{personalInfo.desiredRole}</Text>

            <Text style={styles.sideSectionTitle}>{lang === 'en' ? 'Contacts' : lang === 'es' ? 'Contactos' : 'Contactos'}</Text>
            <Text style={styles.contactItem}>{personalInfo.city} {personalInfo.postalCode ? `• ${personalInfo.postalCode}` : ''}</Text>
            <Text style={styles.contactItem}>{personalInfo.countryCode} {personalInfo.phone}</Text>
            <Text style={styles.contactItem}>{personalInfo.email}</Text>

            {links && links.length > 0 && (
              <>
                <Text style={styles.sideSectionTitle}>{lang === 'en' ? 'Links' : 'Links'}</Text>
                {links.map((l, i) => (
                  <Link key={i} src={getSocialUrl(l.type, l.value)} style={[styles.linkItem, dynamic.link]}>
                    {translateLinkType(l.type.toLowerCase(), lang || 'pt', l.customName)}
                  </Link>
                ))}
              </>
            )}

            {skills && (
              <>
                <Text style={styles.sideSectionTitle}>{lang === 'en' ? 'Skills' : lang === 'es' ? 'Habilidades' : 'Competências'}</Text>
                <View style={styles.skillsWrap}>
                  {skills.split(',').map((s, i) => (
                    <Text key={i} style={[styles.skillPill, dynamic.pill]}>{s.trim()}</Text>
                  ))}
                </View>
              </>
            )}

            {languages && languages.length > 0 && (
              <>
                <Text style={styles.sideSectionTitle}>{lang === 'en' ? 'Languages' : lang === 'es' ? 'Idiomas' : 'Idiomas'}</Text>
                {languages.map((lg, i) => (
                  <Text key={i} style={styles.langItem}>{lg.name} — {translateLanguageLevel(lg.level, lang || 'pt')}</Text>
                ))}
              </>
            )}
          </View>

          {/* Main */}
          <View style={styles.main}>
            <View style={styles.header}>
              <Text style={styles.name}>{personalInfo.name}</Text>
              <Text style={[styles.desiredRole, dynamic.accentText]}>{personalInfo.desiredRole}</Text>
            </View>

            {resume && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, dynamic.sectionTitle]}>{lang === 'en' ? 'Summary' : lang === 'es' ? 'Resumen' : 'Resumo'}</Text>
                <Text style={styles.summary}>{resume}</Text>
              </View>
            )}

            {experiences && experiences.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, dynamic.sectionTitle]}>{lang === 'en' ? 'Experience' : lang === 'es' ? 'Experiencia' : 'Experiência'}</Text>
                {experiences.map((exp, i) => {
                  const showSep = experiences.length > 1 && i < experiences.length - 1;
                  return (
                    <View key={i} style={{ ...styles.expBlock, marginBottom: showSep ? styles.expBlock.marginBottom : 0 }}>
                      <View style={styles.roleAndDate}>
                        <Text style={styles.dateRange}>
                          {exp.startMonth && exp.startYear ? `${translateMonth(exp.startMonth, lang || 'pt')} ${exp.startYear}` : ''}
                          {exp.startMonth && exp.startYear && (exp.endMonth || exp.endYear || exp.current) ? ' - ' : ''}
                          {exp.current ? translateCurrent(lang || 'pt') : exp.endMonth && exp.endYear ? `${translateMonth(exp.endMonth, lang || 'pt')} ${exp.endYear}` : ''}
                        </Text>
                      </View>
                      <View style={styles.roleAndCompany}>
                        <Text style={styles.jobRole}>{exp.role}</Text>
                        <Text style={styles.companySeparator}>{'  •  '}</Text>
                        <Text style={styles.companyName}>{exp.company}</Text>
                      </View>
                      {exp.tech && <Text style={styles.tech}>{exp.tech}</Text>}
                      {exp.activities && <Text style={styles.activities}>• {exp.activities}</Text>}
                      {exp.results && <Text style={styles.results}>• {exp.results}</Text>}
                    </View>
                  );
                })}
              </View>
            )}

            {education && education.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, dynamic.sectionTitle]}>{lang === 'en' ? 'Education' : lang === 'es' ? 'Educación' : 'Educação'}</Text>
                {education.map((edu, i) => (
                  <View key={i} style={styles.eduBlock}>
                    <Text style={styles.eduTitle}>{edu.course}</Text>
                    <Text style={styles.eduInst}>{edu.institution}</Text>
                    {edu.description && <Text style={styles.eduDesc}>• {edu.description}</Text>}
                  </View>
                ))}
              </View>
            )}

            {projects && projects.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, dynamic.sectionTitle]}>{lang === 'en' ? 'Projects' : lang === 'es' ? 'Proyectos' : 'Projetos'}</Text>
                {projects.map((proj, i) => (
                  <View key={i} style={styles.projBlock}>
                    <View style={styles.roleAndDate}>
                      <Text style={styles.projName}>{proj.name}</Text>
                      <Text style={styles.projYear}>{proj.year}</Text>
                    </View>
                    {proj.tech && <Text style={styles.projTech}>{proj.tech}</Text>}
                    {proj.description && <Text style={styles.projDesc}>• {proj.description}</Text>}
                    {proj.link && (
                      <Link src={proj.link} style={styles.projLink}>
                        {lang === 'en' ? 'View Project' : lang === 'es' ? 'Ver Proyecto' : 'Ver Projeto'}
                      </Link>
                    )}
                    {proj.sourceCode && (
                      <Link src={proj.sourceCode} style={styles.projLink}>
                        {lang === 'en' ? 'Source Code' : lang === 'es' ? 'Código fuente' : 'Código-fonte'}
                      </Link>
                    )}
                  </View>
                ))}
              </View>
            )}

            {certifications && certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, dynamic.sectionTitle]}>{lang === 'en' ? 'Certifications' : lang === 'es' ? 'Certificaciones' : 'Certificações'}</Text>
                {certifications.map((cert, i) => (
                  <View key={i} style={styles.certBlock}>
                    <View style={styles.roleAndDate}>
                      <Text style={styles.certName}>{cert.name}</Text>
                      <Text style={styles.certDate}>{cert.completionDate}</Text>
                    </View>
                    <Text style={styles.certIssuer}>{cert.issuer}</Text>
                    {cert.validationLink && (
                      <Link src={cert.validationLink} style={styles.certLink}>
                        {lang === 'en' ? 'View Certificate' : lang === 'es' ? 'Ver Certificado' : 'Ver Certificado'}
                      </Link>
                    )}
                    {cert.description && <Text style={styles.certDesc}>{cert.description}</Text>}
                  </View>
                ))}
              </View>
            )}

            {volunteers && volunteers.length > 0 && (
              <View style={{ ...styles.section, marginBottom: 0 }}>
                <Text style={[styles.sectionTitle, dynamic.sectionTitle]}>{lang === 'en' ? 'Volunteer Work' : 'Voluntariado'}</Text>
                {volunteers.map((vol, i) => (
                  <View key={i} style={styles.volBlock}>
                    <View style={styles.roleAndDate}>
                      <Text style={styles.volRole}>{vol.role}</Text>
                      <Text style={styles.dateRange}>
                        {vol.startMonth && vol.startYear ? `${translateMonth(vol.startMonth, lang || 'pt')} ${vol.startYear}` : ''}
                        {vol.startMonth && vol.startYear && (vol.endMonth || vol.endYear || vol.current) ? ' - ' : ''}
                        {vol.current ? translateCurrent(lang || 'pt') : vol.endMonth && vol.endYear ? `${translateMonth(vol.endMonth, lang || 'pt')} ${vol.endYear}` : ''}
                      </Text>
                    </View>
                    <Text style={styles.volOrg}>{vol.organization}</Text>
                    {vol.description && <Text style={styles.volDesc}>• {vol.description}</Text>}
                    {vol.impact && <Text style={styles.volImpact}>• {vol.impact}</Text>}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
