import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { CvData, CvColor } from '../../types/cv';
import { getColorTheme } from '../../utils/color-themes';

/**
 * Props interface for the TimelineTemplate component
 */
interface TimelineTemplateProps extends CvData {
  /** Language for the document (pt, en or es) */
  lang?: string;
  /** Optional color theme */
  color?: CvColor;
}

/**
 * Timeline template styles with vertical rail and nodes
 */
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  header: { marginBottom: 18, paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  desiredRole: { fontSize: 12, color: '#2563eb', fontWeight: 'bold', marginTop: 4 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  contactItem: { fontSize: 9, color: '#475569', marginRight: 12 },
  separator: { fontSize: 9, color: '#cbd5e1', marginHorizontal: 8 },
  linksRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  linkItem: { fontSize: 9, color: '#2563eb', textDecoration: 'underline', marginRight: 14, marginBottom: 2 },

  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Timeline layout
  timelineRow: { flexDirection: 'row' },
  rail: { width: 14, alignItems: 'center' },
  railLine: { width: 2, backgroundColor: '#e5e7eb', flex: 1 },
  nodeWrap: { position: 'absolute', left: 5, width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb' },
  content: { flex: 1, paddingLeft: 14, paddingBottom: 12 },
  date: { fontSize: 9, color: '#64748b', marginBottom: 2 },
  role: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  meta: { fontSize: 9, color: '#64748b', marginBottom: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  tech: { fontSize: 9, color: '#2563eb', marginBottom: 3, fontWeight: 'bold' },
  activities: { fontSize: 9, color: '#334155', marginBottom: 3 },
  results: { fontSize: 9, fontStyle: 'italic', color: '#059669' },

  // Other blocks
  summary: { fontSize: 10, color: '#334155', lineHeight: 1.4 },
  eduTitle: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  eduInst: { fontSize: 9, color: '#64748b', marginBottom: 3 },
  eduDesc: { fontSize: 9, color: '#334155' },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  skillPill: { fontSize: 9, color: '#0f172a', backgroundColor: '#e2e8f0', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, marginRight: 6, marginBottom: 6 },
  langItem: { fontSize: 9, color: '#0f172a', marginBottom: 4 },

  projName: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  projYear: { fontSize: 9, color: '#64748b', marginLeft: 6 },
  projTech: { fontSize: 9, color: '#2563eb', marginBottom: 3 },
  projDesc: { fontSize: 9, color: '#334155' },
  projLink: { fontSize: 9, color: '#2563eb', textDecoration: 'underline' },

  certName: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  certDate: { fontSize: 9, fontStyle: 'italic', color: '#64748b' },
  certIssuer: { fontSize: 9, color: '#64748b' },
  certLink: { fontSize: 9, color: '#2563eb', textDecoration: 'underline' },
  certDesc: { fontSize: 9, color: '#334155' },

  volRole: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  volOrg: { fontSize: 9, color: '#64748b' },
  volDesc: { fontSize: 9, color: '#334155' },
  volImpact: { fontSize: 9, fontStyle: 'italic', color: '#059669' },
});

// Helper functions for social links and text localization
/**
 * Build a fully-qualified URL for a social/contact entry.
 * Supports email (mailto:), phone (tel:) and common platforms.
 */
function getSocialUrl(type: string, value: string) {
  if (!value) return '';
  const val = value.trim();
  const hasProtocol = /^https?:\/\//i.test(val);
  const lowerType = type.toLowerCase();
  if (lowerType === 'email') return `mailto:${val}`;
  if (lowerType === 'phone') return `tel:${val}`;

  // If already contains a known domain but missing protocol, just prefix it
  if (!hasProtocol) {
    if (/linkedin\.com/i.test(val)) return `https://${val}`;
    if (/github\.com/i.test(val)) return `https://${val}`;
    if (/gitlab\.com/i.test(val)) return `https://${val}`;
  }

  if (!hasProtocol) {
    if (lowerType === 'linkedin') return `https://www.linkedin.com/in/${val}`;
    if (lowerType === 'github') return `https://github.com/${val}`;
    if (lowerType === 'gitlab') return `https://gitlab.com/${val}`;
    // portfolio/other: assume domain or path, prefix https
    return `https://${val}`;
  }
  return val;
}

/**
 * Localize a link type label (e.g., LinkedIn, Website) for the given language.
 */
function translateLinkType(type: string, lang: string, customName?: string) {
  const t = type.toLowerCase();
  const isPT = lang === 'pt';
  const isES = lang === 'es';
  if (t === 'other' && customName) return customName;
  if (t === 'linkedin') return 'LinkedIn';
  if (t === 'github') return 'GitHub';
  if (t === 'portfolio' || t === 'website') return isES ? 'Sitio Web' : isPT ? 'Website' : 'Website';
  if (t === 'email') return isES ? 'Correo' : isPT ? 'Email' : 'Email';
  if (t === 'phone') return isES ? 'Teléfono' : isPT ? 'Telemóvel' : 'Phone';
  return customName || type;
}

/**
 * Translate month abbreviations across pt/en/es.
 */
function translateMonth(month: string, lang: string) {
  const m = month.toLowerCase();
  const isPT = lang === 'pt';
  const isES = lang === 'es';
  const map: Record<string, { pt: string; es: string; en: string }> = {
    jan: { pt: 'Jan', es: 'Ene', en: 'Jan' },
    feb: { pt: 'Fev', es: 'Feb', en: 'Feb' },
    mar: { pt: 'Mar', es: 'Mar', en: 'Mar' },
    apr: { pt: 'Abr', es: 'Abr', en: 'Apr' },
    may: { pt: 'Mai', es: 'May', en: 'May' },
    jun: { pt: 'Jun', es: 'Jun', en: 'Jun' },
    jul: { pt: 'Jul', es: 'Jul', en: 'Jul' },
    aug: { pt: 'Ago', es: 'Ago', en: 'Aug' },
    sep: { pt: 'Set', es: 'Sep', en: 'Sep' },
    oct: { pt: 'Out', es: 'Oct', en: 'Oct' },
    nov: { pt: 'Nov', es: 'Nov', en: 'Nov' },
    dec: { pt: 'Dez', es: 'Dic', en: 'Dec' },
  };
  const l: 'pt' | 'es' | 'en' = isPT ? 'pt' : isES ? 'es' : 'en';
  return map[m]?.[l] ?? month;
}

/**
 * Localize the "current" date label used in ranges.
 */
function translateCurrent(lang: string) {
  if (lang === 'en') return 'Present';
  if (lang === 'es') return 'Actualidad';
  return 'Atualidade';
}

// Translates language level values (e.g., 'language.level.c1', 'C1', 'fluent') to localized labels
function translateLanguageLevel(level: string, lang: string) {
  if (!level) return '';
  const key = level.trim().toLowerCase();

  const cefrMap: Record<string, string> = { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2', c1: 'C1', c2: 'C2' };
  const parts = key.split('.');
  const last = parts[parts.length - 1];
  if (cefrMap[last]) return cefrMap[last];

  const verbal = {
    en: { native: 'Native', fluent: 'Fluent', advanced: 'Advanced', intermediate: 'Intermediate', basic: 'Basic', beginner: 'Beginner' },
    es: { native: 'Nativo', fluent: 'Fluido', advanced: 'Avanzado', intermediate: 'Intermedio', basic: 'Básico', beginner: 'Principiante' },
    pt: { native: 'Nativo', fluent: 'Fluente', advanced: 'Avançado', intermediate: 'Intermédio', basic: 'Básico', beginner: 'Iniciante' },
  } as const;
  type VerbalDict = Record<keyof typeof verbal.en, string>;
  const dict: VerbalDict = lang === 'en' ? verbal.en : lang === 'es' ? verbal.es : verbal.pt;
  const verbalKey = last in dict ? last : key.replace('language.level.', '');
  if (verbalKey in dict) return dict[verbalKey as keyof VerbalDict];
  if (cefrMap[key]) return cefrMap[key];
  return level;
}

export function TimelineTemplate({
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
}: TimelineTemplateProps) {
  const theme = getColorTheme(color);
  const dynamic = StyleSheet.create({
    desiredRole: { color: theme.primary },
    node: { backgroundColor: theme.primary },
    link: { color: theme.primary },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name}</Text>
          <Text style={[styles.desiredRole, dynamic.desiredRole]}>{personalInfo.desiredRole}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{personalInfo.city} {personalInfo.postalCode ? `• ${personalInfo.postalCode}` : ''}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.contactItem}>{personalInfo.countryCode} {personalInfo.phone}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.contactItem}>{personalInfo.email}</Text>
          </View>
          {links && links.length > 0 && (
            <View style={styles.linksRow}>
              {links.map((l, i) => (
                <Link key={i} src={getSocialUrl(l.type, l.value)} style={[styles.linkItem, dynamic.link]}>
                  {translateLinkType(l.type.toLowerCase(), lang || 'pt', l.customName)}
                </Link>
              ))}
            </View>
          )}
        </View>

        {/* Summary */}
        {resume && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{lang === 'en' ? 'Summary' : lang === 'es' ? 'Resumen' : 'Resumo'}</Text>
            <Text style={styles.summary}>{resume}</Text>
          </View>
        )}

        {/* Experience timeline */}
        {experiences && experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{lang === 'en' ? 'Experience' : lang === 'es' ? 'Experiencia' : 'Experiência'}</Text>
            {experiences.map((exp, i) => (
              <View key={i} style={styles.timelineRow}>
                <View style={styles.rail}>
                  <View style={styles.railLine} />
                  <View style={[styles.nodeWrap, dynamic.node]} />
                </View>
                <View style={styles.content}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.role}>{exp.role}</Text>
                    <Text style={styles.date}>
                      {exp.startMonth && exp.startYear ? `${translateMonth(exp.startMonth, lang || 'pt')} ${exp.startYear}` : ''}
                      {exp.startMonth && exp.startYear && (exp.endMonth || exp.endYear || exp.current) ? ' - ' : ''}
                      {exp.current ? translateCurrent(lang || 'pt') : exp.endMonth && exp.endYear ? `${translateMonth(exp.endMonth, lang || 'pt')} ${exp.endYear}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.meta}>{exp.company}</Text>
                  {exp.tech && <Text style={styles.tech}>{exp.tech}</Text>}
                  {exp.activities && <Text style={styles.activities}>• {exp.activities}</Text>}
                  {exp.results && <Text style={styles.results}>• {exp.results}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{lang === 'en' ? 'Education' : lang === 'es' ? 'Educación' : 'Educação'}</Text>
            {education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.eduTitle}>{edu.course}</Text>
                  <Text style={styles.date}>
                    {edu.startMonth && edu.startYear ? `${translateMonth(edu.startMonth, lang || 'pt')} ${edu.startYear}` : ''}
                    {edu.startMonth && edu.startYear && (edu.endMonth || edu.endYear) ? ' - ' : ''}
                    {edu.endMonth && edu.endYear ? `${translateMonth(edu.endMonth, lang || 'pt')} ${edu.endYear}` : ''}
                  </Text>
                </View>
                <Text style={styles.eduInst}>{edu.institution}</Text>
                {edu.description && <Text style={styles.eduDesc}>• {edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{lang === 'en' ? 'Skills' : lang === 'es' ? 'Habilidades' : 'Competências'}</Text>
            <View style={styles.skillsWrap}>
              {skills.split(',').map((s, i) => (
                <Text key={i} style={styles.skillPill}>{s.trim()}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{lang === 'en' ? 'Languages' : lang === 'es' ? 'Idiomas' : 'Idiomas'}</Text>
            {languages.map((lg, i) => (
              <Text key={i} style={styles.langItem}>{lg.name} — {translateLanguageLevel(lg.level, lang || 'pt')}</Text>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{lang === 'en' ? 'Projects' : lang === 'es' ? 'Proyectos' : 'Projetos'}</Text>
            {projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
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
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{lang === 'en' ? 'Certifications' : lang === 'es' ? 'Certificaciones' : 'Certificações'}</Text>
            {certifications.map((cert, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
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

        {/* Volunteer */}
        {volunteers && volunteers.length > 0 && (
          <View style={{ ...styles.section, marginBottom: 0 }}>
            <Text style={styles.sectionTitle}>{lang === 'en' ? 'Volunteer Work' : 'Voluntariado'}</Text>
            {volunteers.map((vol, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Text style={styles.volRole}>{vol.role}</Text>
                  <Text style={styles.date}>
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
      </Page>
    </Document>
  );
}
