import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { CvData, CvColor } from '../../types/cv';
import { getColorTheme } from '../../utils/color-themes';

/**
 * Props interface for the ProfessionalTemplate component
 */
interface ProfessionalTemplateProps extends CvData {
  /** Language for the document (pt, en or es) */
  lang?: string;
  /** Optional color theme */
  color?: CvColor;
}

/**
 * Professional template styles: single-column, typographic emphasis,
 * subtle separators and colored accents. Inspired by classic but distinct.
 */
const base = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },

  // Header
  header: { marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  desiredRole: { fontSize: 12, color: '#334155', marginTop: 2 },

  accentBar: { height: 3, marginTop: 10, marginBottom: 10, backgroundColor: '#2563eb' },

  // Contact & links
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  contactItem: { fontSize: 9, color: '#475569', marginRight: 12 },
  separator: { fontSize: 9, color: '#cbd5e1', marginHorizontal: 8 },
  linksRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  linkItem: { fontSize: 9, color: '#2563eb', textDecoration: 'underline', marginRight: 14, marginBottom: 2 },

  // Sections
  section: { marginBottom: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sectionAccent: { width: 3, height: 12, marginRight: 6, backgroundColor: '#2563eb', borderRadius: 2 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', letterSpacing: 0.3 },
  summary: { fontSize: 10, color: '#334155', lineHeight: 1.4 },

  // Experience
  expBlock: { marginBottom: 10, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', borderBottomStyle: 'solid' },
  roleAndDate: { fontSize: 9, color: '#64748b', marginBottom: 3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roleAndCompany: { fontSize: 10, color: '#0f172a', flexDirection: 'row' },
  jobRole: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  companyName: { fontSize: 10, color: '#64748b' },
  companySeparator: { fontSize: 10, color: '#64748b' },
  dateRange: { fontSize: 9, color: '#64748b' },
  tech: { fontSize: 9, color: '#2563eb', marginBottom: 3, fontWeight: 'bold' },
  activities: { fontSize: 9, color: '#334155', marginBottom: 2, marginLeft: 8 },
  results: { fontSize: 9, fontStyle: 'italic', color: '#059669', marginLeft: 8 },

  // Education
  eduBlock: { marginBottom: 10 },
  eduTitle: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  eduInst: { fontSize: 9, color: '#64748b', marginBottom: 2 },
  eduDesc: { fontSize: 9, color: '#334155', marginLeft: 8 },

  // Skills & Languages
  skillsLangRow: { flexDirection: 'row', gap: 24 },
  skillsCol: { flex: 1 },
  langCol: { flex: 1 },
  skillText: { fontSize: 9, color: '#0f172a' },
  langItem: { fontSize: 9, color: '#0f172a', marginBottom: 2 },

  // Projects
  projBlock: { marginBottom: 10 },
  projName: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  projYear: { fontSize: 9, color: '#64748b', marginLeft: 6 },
  projTech: { fontSize: 9, color: '#2563eb', marginBottom: 2 },
  projDesc: { fontSize: 9, color: '#334155', marginLeft: 8 },
  projLink: { fontSize: 9, color: '#2563eb', textDecoration: 'underline' },

  // Certifications
  certBlock: { marginBottom: 10 },
  certName: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  certDate: { fontSize: 9, fontStyle: 'italic', color: '#64748b' },
  certIssuer: { fontSize: 9, color: '#64748b' },
  certLink: { fontSize: 9, color: '#2563eb', textDecoration: 'underline' },
  certDesc: { fontSize: 9, color: '#334155' },

  // Volunteer
  volBlock: { marginBottom: 10 },
  volRole: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  volOrg: { fontSize: 9, color: '#64748b' },
  volDesc: { fontSize: 9, color: '#334155' },
  volImpact: { fontSize: 9, fontStyle: 'italic', color: '#059669' },
});

// Helpers
function getSocialUrl(type: string, value: string) {
  if (!value) return '';
  const val = value.trim();
  const hasProtocol = /^https?:\/\//i.test(val);
  const lowerType = type.toLowerCase();
  if (lowerType === 'email') return `mailto:${val}`;
  if (lowerType === 'phone') return `tel:${val}`;
  if (lowerType === 'linkedin') return hasProtocol ? val : `https://linkedin.com/in/${val}`;
  if (lowerType === 'github') return hasProtocol ? val : `https://github.com/${val}`;
  return hasProtocol ? val : `https://${val}`;
}

function translateLinkType(type: string, lang: string, customName?: string) {
  const map: Record<string, Record<string, string>> = {
    pt: { email: 'Email', phone: 'Telefone', linkedin: 'LinkedIn', github: 'GitHub', portfolio: 'Portefólio', other: customName || 'Outro' },
    en: { email: 'Email', phone: 'Phone', linkedin: 'LinkedIn', github: 'GitHub', portfolio: 'Portfolio', other: customName || 'Other' },
    es: { email: 'Email', phone: 'Teléfono', linkedin: 'LinkedIn', github: 'GitHub', portfolio: 'Portafolio', other: customName || 'Otro' },
  };
  const key = type.toLowerCase();
  return map[lang]?.[key] || customName || type;
}

function translateMonth(month: string, lang: string) {
  const m = month?.toLowerCase();
  const months = {
    jan: { pt: 'Jan', en: 'Jan', es: 'Ene' },
    feb: { pt: 'Fev', en: 'Feb', es: 'Feb' },
    mar: { pt: 'Mar', en: 'Mar', es: 'Mar' },
    apr: { pt: 'Abr', en: 'Apr', es: 'Abr' },
    may: { pt: 'Mai', en: 'May', es: 'May' },
    jun: { pt: 'Jun', en: 'Jun', es: 'Jun' },
    jul: { pt: 'Jul', en: 'Jul', es: 'Jul' },
    aug: { pt: 'Ago', en: 'Aug', es: 'Ago' },
    sep: { pt: 'Set', en: 'Sep', es: 'Sep' },
    oct: { pt: 'Out', en: 'Oct', es: 'Oct' },
    nov: { pt: 'Nov', en: 'Nov', es: 'Nov' },
    dec: { pt: 'Dez', en: 'Dec', es: 'Dic' },
  };
  // fallback: return original month if not found
  type MonthKey = keyof typeof months;
  const entry = months[m as MonthKey];
  const l: 'pt'|'en'|'es' = lang === 'en' ? 'en' : lang === 'es' ? 'es' : 'pt';
  return (entry && entry[l]) || month;
}

function translateCurrent(lang: string) {
  return lang === 'en' ? 'Present' : lang === 'es' ? 'Actualidad' : 'Atual';
}

// Translates language level values to localized labels
function translateLanguageLevel(level: string, lang: string) {
  const direct: Record<string, Record<string, string>> = {
    pt: { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2', c1: 'C1', c2: 'C2', basic: 'Básico', intermediate: 'Intermédio', advanced: 'Avançado', native: 'Nativo', fluent: 'Fluente' },
    en: { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2', c1: 'C1', c2: 'C2', basic: 'Basic', intermediate: 'Intermediate', advanced: 'Advanced', native: 'Native', fluent: 'Fluent' },
    es: { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2', c1: 'C1', c2: 'C2', basic: 'Básico', intermediate: 'Intermedio', advanced: 'Avanzado', native: 'Nativo', fluent: 'Fluido' },
  };
  const key = level?.toLowerCase();
  if (direct[lang]?.[key]) return direct[lang][key];
  // try to normalize values like 'language.level.c1'
  const last = key?.split('.')?.pop() as string;
  return direct[lang]?.[last] || level;
}

export function ProfessionalTemplate({
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
  lang = 'pt',
  color = 'blue',
}: ProfessionalTemplateProps) {
  const theme = getColorTheme(color);
  const dynamic = StyleSheet.create({
    accentBar: { backgroundColor: theme.primary },
    sectionAccent: { backgroundColor: theme.primary },
    linkItem: { color: theme.primary },
    tech: { color: theme.primary },
    projTech: { color: theme.primary },
    projLink: { color: theme.primary },
    certLink: { color: theme.primary },
  });

  return (
    <Document>
      <Page size="A4" style={base.page}>
        {/* Header */}
        <View style={base.header}>
          <Text style={base.name}>{personalInfo.name}</Text>
          {personalInfo.desiredRole ? (
            <Text style={base.desiredRole}>{personalInfo.desiredRole}</Text>
          ) : null}
          <View style={[base.accentBar, dynamic.accentBar]} />

          {/* Contact */}
          <View style={base.contactRow}>
            {personalInfo.city && <Text style={base.contactItem}>{personalInfo.city}</Text>}
            {personalInfo.postalCode && (
              <>
                <Text style={base.separator}>•</Text>
                <Text style={base.contactItem}>{personalInfo.postalCode}</Text>
              </>
            )}
            {personalInfo.email && (
              <>
                <Text style={base.separator}>•</Text>
                <Link src={`mailto:${personalInfo.email}`} style={[base.contactItem, dynamic.linkItem]}>
                  {personalInfo.email}
                </Link>
              </>
            )}
            {personalInfo.phone && (
              <>
                <Text style={base.separator}>•</Text>
                <Link src={`tel:${personalInfo.phone}`} style={[base.contactItem, dynamic.linkItem]}>
                  {personalInfo.phone}
                </Link>
              </>
            )}
          </View>

          {/* Links */}
          {links && links.length > 0 && (
            <View style={base.linksRow}>
              {links.map((l, i) => (
                <Link key={i} src={getSocialUrl(l.type, l.value)} style={[base.linkItem, dynamic.linkItem]}>
                  {translateLinkType(l.type, lang, l.customName)}
                </Link>
              ))}
            </View>
          )}
        </View>

        {/* Summary */}
        {resume && (
          <View style={base.section}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, dynamic.sectionAccent]} />
              <Text style={base.sectionTitle}>
                {lang === 'en' ? 'Professional Summary' : lang === 'es' ? 'Resumen Profesional' : 'Resumo Profissional'}
              </Text>
            </View>
            <Text style={base.summary}>{resume}</Text>
          </View>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <View style={base.section}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, dynamic.sectionAccent]} />
              <Text style={base.sectionTitle}>
                {lang === 'en' ? 'Professional Experience' : lang === 'es' ? 'Experiencia Profesional' : 'Experiência Profissional'}
              </Text>
            </View>
            {experiences.map((exp, i) => (
              <View key={i} style={base.expBlock}>
                <View style={base.roleAndDate}>
                  <View style={base.roleAndCompany}>
                    <Text style={base.jobRole}>{exp.role}</Text>
                    {(exp.company) && (
                      <>
                        <Text style={base.companySeparator}> • </Text>
                        <Text style={base.companyName}>{exp.company}</Text>
                      </>
                    )}
                  </View>
                  <Text style={base.dateRange}>
                    {exp.startMonth && exp.startYear ? `${translateMonth(exp.startMonth, lang)} ${exp.startYear}` : ''}
                    {(exp.startMonth && exp.startYear) && (exp.endMonth || exp.endYear || exp.current) ? ' - ' : ''}
                    {exp.current ? translateCurrent(lang) : (exp.endMonth && exp.endYear ? `${translateMonth(exp.endMonth, lang)} ${exp.endYear}` : '')}
                  </Text>
                </View>
                {exp.tech && <Text style={[base.tech, dynamic.tech]}>{exp.tech}</Text>}
                {exp.activities && <Text style={base.activities}>• {exp.activities}</Text>}
                {exp.results && <Text style={base.results}>• {exp.results}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={base.section}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, dynamic.sectionAccent]} />
              <Text style={base.sectionTitle}>
                {lang === 'en' ? 'Education' : lang === 'es' ? 'Educación' : 'Educação'}
              </Text>
            </View>
            {education.map((edu, i) => (
              <View key={i} style={base.eduBlock}>
                <View style={base.roleAndDate}>
                  <Text style={base.eduTitle}>{edu.course}</Text>
                  <Text style={base.dateRange}>
                    {edu.startMonth && edu.startYear ? `${translateMonth(edu.startMonth, lang)} ${edu.startYear}` : ''}
                    {(edu.startMonth && edu.startYear) && (edu.endMonth || edu.endYear) ? ' - ' : ''}
                    {(edu.endMonth && edu.endYear) ? `${translateMonth(edu.endMonth, lang)} ${edu.endYear}` : ''}
                  </Text>
                </View>
                <Text style={base.eduInst}>{edu.institution}</Text>
                {edu.description && <Text style={base.eduDesc}>• {edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills & Languages */}
        {(skills || (languages && languages.length > 0)) && (
          <View style={base.section}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, dynamic.sectionAccent]} />
              <Text style={base.sectionTitle}>
                {lang === 'en' ? 'Skills & Languages' : lang === 'es' ? 'Habilidades e Idiomas' : 'Competências e Idiomas'}
              </Text>
            </View>
            <View style={base.skillsLangRow}>
              {skills ? (
                <View style={base.skillsCol}>
                  <Text style={base.skillText}>{skills}</Text>
                </View>
              ) : null}
              {languages && languages.length > 0 ? (
                <View style={base.langCol}>
                  {languages.map((lg, i) => (
                    <Text key={i} style={base.langItem}>
                      {lg.name} — {translateLanguageLevel(lg.level, lang)}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={base.section}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, dynamic.sectionAccent]} />
              <Text style={base.sectionTitle}>{lang === 'en' ? 'Projects' : lang === 'es' ? 'Proyectos' : 'Projetos'}</Text>
            </View>
            {projects.map((proj, i) => (
              <View key={i} style={base.projBlock}>
                <View style={base.roleAndDate}>
                  <Text style={base.projName}>{proj.name}</Text>
                  <Text style={base.projYear}>{proj.year}</Text>
                </View>
                {proj.tech && <Text style={[base.projTech, dynamic.projTech]}>{proj.tech}</Text>}
                {proj.description && <Text style={base.projDesc}>• {proj.description}</Text>}
                {proj.link && (
                  <Link src={proj.link} style={[base.projLink, dynamic.projLink]}>
                    {lang === 'en' ? 'View Project' : lang === 'es' ? 'Ver Proyecto' : 'Ver Projeto'}
                  </Link>
                )}
                {proj.sourceCode && (
                  <Link src={proj.sourceCode} style={[base.projLink, dynamic.projLink]}>
                    {lang === 'en' ? 'Source Code' : lang === 'es' ? 'Código fuente' : 'Código-fonte'}
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <View style={base.section}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, dynamic.sectionAccent]} />
              <Text style={base.sectionTitle}>{lang === 'en' ? 'Certifications' : lang === 'es' ? 'Certificaciones' : 'Certificações'}</Text>
            </View>
            {certifications.map((cert, i) => (
              <View key={i} style={base.certBlock}>
                <View style={base.roleAndDate}>
                  <Text style={base.certName}>{cert.name}</Text>
                  <Text style={base.certDate}>{cert.completionDate}</Text>
                </View>
                <Text style={base.certIssuer}>{cert.issuer}</Text>
                {cert.validationLink && (
                  <Link src={cert.validationLink} style={[base.certLink, dynamic.certLink]}>
                    {lang === 'en' ? 'View Certificate' : lang === 'es' ? 'Ver Certificado' : 'Ver Certificado'}
                  </Link>
                )}
                {cert.description && <Text style={base.certDesc}>{cert.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Volunteer */}
        {volunteers && volunteers.length > 0 && (
          <View style={{ ...base.section, marginBottom: 0 }}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, dynamic.sectionAccent]} />
              <Text style={base.sectionTitle}>{lang === 'en' ? 'Volunteer Work' : 'Voluntariado'}</Text>
            </View>
            {volunteers.map((vol, i) => (
              <View key={i} style={base.volBlock}>
                <View style={base.roleAndDate}>
                  <Text style={base.volRole}>{vol.role}</Text>
                  <Text style={base.dateRange}>
                    {vol.startMonth && vol.startYear ? `${translateMonth(vol.startMonth, lang)} ${vol.startYear}` : ''}
                    {(vol.startMonth && vol.startYear) && (vol.endMonth || vol.endYear || vol.current) ? ' - ' : ''}
                    {vol.current ? translateCurrent(lang) : (vol.endMonth && vol.endYear ? `${translateMonth(vol.endMonth, lang)} ${vol.endYear}` : '')}
                  </Text>
                </View>
                <Text style={base.volOrg}>{vol.organization}</Text>
                {vol.description && <Text style={base.volDesc}>• {vol.description}</Text>}
                {vol.impact && <Text style={base.volImpact}>• {vol.impact}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

 
