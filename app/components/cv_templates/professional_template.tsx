import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { CvData, CvColor, CvRenderSettings } from '../../types/cv';
import { getColorTheme } from '../../utils/color-themes';

/**
 * Props interface for the ProfessionalTemplate component
 */
interface ProfessionalTemplateProps extends CvData {
  /** Language for the document (pt, en or es) */
  lang?: string;
  /** Optional color theme */
  color?: CvColor;
  settings?: CvRenderSettings;
}

const cmToPt = (cm: number) => cm * 28.3465;
const buildStyles = (settings?: CvRenderSettings) => {
  const s = settings;
  const scale = s?.layout.textScale || 1.0;
  const familyRaw = s?.layout.fontFamily || 'Helvetica';
  const fontFamily = s?.layout.fontFamily === 'Custom' ? (s?.layout.customFont?.name || 'Helvetica') : (familyRaw === 'Arial' ? 'Helvetica' : familyRaw);
  const margins = s?.layout.marginsCm ?? { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 };
  const lineHeight = s?.layout.lineSpacing ?? 1.4;
  const sectionSpacing = s?.layout.sectionSpacingPx ?? 14;
  const isATS = false;
  const neutral = { primary: '#0f172a', accent: '#666666', border: '#e5e7eb' };
  const linkFontSize = ((s?.header.iconSizePx ?? 18) / 2) * scale;
  const nameSpacing = Math.max(8, Math.round(((s?.header.nameFontSize ?? 22) * scale) * 0.6));
  const roleSpacing = Math.max(6, Math.round((12 * scale) * 0.3));
  return StyleSheet.create({
    page: { paddingTop: cmToPt(margins.top), paddingRight: cmToPt(margins.right), paddingBottom: cmToPt(margins.bottom), paddingLeft: cmToPt(margins.left), fontSize: 10 * scale, fontFamily, backgroundColor: '#ffffff', lineHeight },
    header: { marginBottom: 16, paddingBottom: 8, borderBottomWidth: s?.header.dividerThickness ?? 1, borderBottomColor: isATS ? neutral.border : '#e5e7eb', borderBottomStyle: s?.header.dividerStyle ?? 'solid' },
    name: { fontSize: (s?.header.nameFontSize ?? 22) * scale, fontWeight: s?.header.nameFontWeight === 'heavy' ? 800 : s?.header.nameFontWeight === 'bold' ? 700 : 400, color: s?.header.nameColor || (isATS ? neutral.primary : '#0f172a'), marginBottom: nameSpacing },
    desiredRole: { fontSize: 12 * scale, color: isATS ? neutral.accent : '#334155', marginTop: 4, marginBottom: roleSpacing, fontStyle: s?.header.titleStyle === 'italic' ? 'italic' : 'normal', textTransform: s?.header.titleStyle === 'uppercase' ? 'uppercase' : 'none' },
    accentBar: { height: 3, marginTop: 10, marginBottom: 10, backgroundColor: isATS ? neutral.border : '#2563eb' },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
    contactItem: { fontSize: 9 * scale, color: isATS ? neutral.accent : '#475569', marginRight: 12 },
    separator: { fontSize: 9 * scale, color: isATS ? neutral.border : '#cbd5e1', marginHorizontal: 8 },
    linksRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, justifyContent: s?.header.iconAlignment === 'center' ? 'center' : s?.header.iconAlignment === 'right' ? 'flex-end' : 'flex-start' },
    linkItem: { fontSize: linkFontSize, color: isATS ? neutral.accent : '#2563eb', textDecoration: 'underline', marginRight: s?.header.iconSpacingPx ?? 14, marginBottom: 2 },
    section: { marginBottom: sectionSpacing },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    sectionAccent: { width: 3, height: 12, marginRight: 6, backgroundColor: isATS ? neutral.border : '#2563eb', borderRadius: 2 },
    sectionTitle: { fontSize: 12 * scale, fontWeight: 'bold', color: isATS ? neutral.primary : '#0f172a', letterSpacing: 0.3 },
    summary: { fontSize: 10 * scale, color: isATS ? neutral.accent : '#334155' },
    expBlock: { marginBottom: 10, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: isATS ? neutral.border : '#e5e7eb', borderBottomStyle: 'solid' },
    roleAndDate: { fontSize: 9 * scale, color: isATS ? neutral.accent : '#64748b', marginBottom: 3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    roleAndCompany: { fontSize: 10 * scale, color: isATS ? neutral.primary : '#0f172a', flexDirection: 'row' },
    jobRole: { fontSize: 10 * scale, fontWeight: 'bold', color: isATS ? neutral.primary : '#0f172a' },
    companyName: { fontSize: 10 * scale, color: isATS ? neutral.accent : '#64748b' },
    companySeparator: { fontSize: 10 * scale, color: isATS ? neutral.accent : '#64748b' },
    dateRange: { fontSize: 9 * scale, color: isATS ? neutral.accent : '#64748b' },
    tech: { fontSize: 9 * scale, color: isATS ? neutral.accent : '#2563eb', marginBottom: 3, fontWeight: 'bold' },
    activities: { fontSize: 9 * scale, color: isATS ? neutral.primary : '#334155', marginBottom: 2, marginLeft: 8 },
    results: { fontSize: 9 * scale, fontStyle: 'italic', color: '#059669', marginLeft: 8 },
    eduBlock: { marginBottom: 10 },
    eduTitle: { fontSize: 10 * scale, fontWeight: 'bold', color: isATS ? neutral.primary : '#0f172a' },
    eduInst: { fontSize: 9 * scale, color: isATS ? neutral.accent : '#64748b', marginBottom: 2 },
    eduDesc: { fontSize: 9 * scale, color: isATS ? neutral.primary : '#334155', marginLeft: 8 },
    skillsLangRow: { flexDirection: 'row', gap: 24 },
    skillsCol: { flex: 1 },
    langCol: { flex: 1 },
    skillText: { fontSize: 9 * scale, color: isATS ? neutral.primary : '#0f172a' },
    langItem: { fontSize: 9 * scale, color: isATS ? neutral.primary : '#0f172a', marginBottom: 2 },
    projBlock: { marginBottom: 10 },
    projName: { fontSize: 10 * scale, fontWeight: 'bold', color: isATS ? neutral.primary : '#0f172a' },
    projYear: { fontSize: 9 * scale, color: isATS ? neutral.accent : '#64748b', marginLeft: 6 },
    projTech: { fontSize: 9 * scale, color: isATS ? neutral.accent : '#2563eb', marginBottom: 2 },
    projDesc: { fontSize: 9 * scale, color: isATS ? neutral.primary : '#334155', marginLeft: 8 },
    projLink: { fontSize: 9 * scale, color: isATS ? neutral.accent : '#2563eb', textDecoration: 'underline' },
    certBlock: { marginBottom: 10 },
    certName: { fontSize: 10 * scale, fontWeight: 'bold', color: isATS ? neutral.primary : '#0f172a' },
    certDate: { fontSize: 9 * scale, fontStyle: 'italic', color: isATS ? neutral.accent : '#64748b' },
    certIssuer: { fontSize: 9 * scale, color: isATS ? neutral.accent : '#64748b' },
    certLink: { fontSize: 9 * scale, color: isATS ? neutral.accent : '#2563eb', textDecoration: 'underline' },
    certDesc: { fontSize: 9 * scale, color: isATS ? neutral.primary : '#334155' },
    volBlock: { marginBottom: 10 },
    volRole: { fontSize: 10 * scale, fontWeight: 'bold', color: isATS ? neutral.primary : '#0f172a' },
    volOrg: { fontSize: 9 * scale, color: isATS ? neutral.accent : '#64748b' },
    volDesc: { fontSize: 9 * scale, color: isATS ? neutral.primary : '#334155' },
    volImpact: { fontSize: 9 * scale, fontStyle: 'italic', color: '#059669' },
  });
};

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

// Translates language level values to localized labels (CEFR codes + Native only)
function translateLanguageLevel(level: string, lang: string) {
  const direct: Record<string, Record<string, string>> = {
    pt: { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2', c1: 'C1', c2: 'C2', native: 'Nativo' },
    en: { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2', c1: 'C1', c2: 'C2', native: 'Native' },
    es: { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2', c1: 'C1', c2: 'C2', native: 'Nativo' },
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
  settings,
}: ProfessionalTemplateProps) {
  const theme = getColorTheme(color);
  const styles = buildStyles(settings);
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
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {settings?.header.titlePosition === 'above' && personalInfo.desiredRole ? (
            <Text style={styles.desiredRole}>{personalInfo.desiredRole}</Text>
          ) : null}
          <Text style={styles.name}>{personalInfo.name}</Text>
          {(!settings || settings?.header.titlePosition === 'below') && personalInfo.desiredRole ? (
            <Text style={styles.desiredRole}>{personalInfo.desiredRole}</Text>
          ) : null}
          <View style={[styles.accentBar, dynamic.accentBar]} />

          {/* Contact */}
          <View style={styles.contactRow}>
            {personalInfo.city && <Text style={styles.contactItem}>{personalInfo.city}</Text>}
            {personalInfo.postalCode && (
              <>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.contactItem}>{personalInfo.postalCode}</Text>
              </>
            )}
            {personalInfo.email && (
              <>
                <Text style={styles.separator}>•</Text>
                <Link src={`mailto:${personalInfo.email}`} style={[styles.contactItem, dynamic.linkItem]}>
                  {personalInfo.email}
                </Link>
              </>
            )}
            {personalInfo.phone && (
              <>
                <Text style={styles.separator}>•</Text>
                <Link src={`tel:${personalInfo.phone}`} style={[styles.contactItem, dynamic.linkItem]}>
                  {personalInfo.phone}
                </Link>
              </>
            )}
          </View>

          {/* Links */}
          {links && links.length > 0 && (
            <View style={styles.linksRow}>
              {links.map((l, i) => (
                <Link key={i} src={getSocialUrl(l.type, l.value)} style={[styles.linkItem, dynamic.linkItem]}>
                  {translateLinkType(l.type, lang, l.customName)}
                </Link>
              ))}
            </View>
          )}
        </View>

        {/* Summary */}
        {resume && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, dynamic.sectionAccent]} />
              <Text style={styles.sectionTitle}>
                {lang === 'en' ? 'Professional Summary' : lang === 'es' ? 'Resumen Profesional' : 'Resumo Profissional'}
              </Text>
            </View>
            <Text style={styles.summary}>{resume}</Text>
          </View>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, dynamic.sectionAccent]} />
              <Text style={styles.sectionTitle}>
                {lang === 'en' ? 'Professional Experience' : lang === 'es' ? 'Experiencia Profesional' : 'Experiência Profissional'}
              </Text>
            </View>
            {(settings?.layout.columns ?? 1) === 1 ? experiences.map((exp, i) => (
              <View key={i} style={styles.expBlock}>
                <View style={styles.roleAndDate}>
                  <View style={styles.roleAndCompany}>
                    <Text style={styles.jobRole}>{exp.role}</Text>
                    {(exp.company) && (
                      <>
                        <Text style={styles.companySeparator}> • </Text>
                        <Text style={styles.companyName}>{exp.company}</Text>
                      </>
                    )}
                  </View>
                  <Text style={styles.dateRange}>
                    {exp.startMonth && exp.startYear ? `${translateMonth(exp.startMonth, lang)} ${exp.startYear}` : ''}
                    {(exp.startMonth && exp.startYear) && (exp.endMonth || exp.endYear || exp.current) ? ' - ' : ''}
                    {exp.current ? translateCurrent(lang) : (exp.endMonth && exp.endYear ? `${translateMonth(exp.endMonth, lang)} ${exp.endYear}` : '')}
                  </Text>
                </View>
                {exp.tech && <Text style={[styles.tech, dynamic.tech]}>{exp.tech}</Text>}
                {exp.activities && <Text style={styles.activities}>• {exp.activities}</Text>}
                {exp.results && <Text style={styles.results}>• {exp.results}</Text>}
              </View>
            )) : (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {Array.from({ length: settings?.layout.columns ?? 1 }).map((_, ci) => (
                  <View key={ci} style={{ flex: 1 }}>
                    {experiences.filter((_, idx) => idx % (settings?.layout.columns ?? 1) === ci).map((exp, i) => (
                      <View key={i} style={styles.expBlock}>
                        <View style={styles.roleAndDate}>
                          <View style={styles.roleAndCompany}>
                            <Text style={styles.jobRole}>{exp.role}</Text>
                            {(exp.company) && (
                              <>
                                <Text style={styles.companySeparator}> • </Text>
                                <Text style={styles.companyName}>{exp.company}</Text>
                              </>
                            )}
                          </View>
                          <Text style={styles.dateRange}>
                            {exp.startMonth && exp.startYear ? `${translateMonth(exp.startMonth, lang)} ${exp.startYear}` : ''}
                            {(exp.startMonth && exp.startYear) && (exp.endMonth || exp.endYear || exp.current) ? ' - ' : ''}
                            {exp.current ? translateCurrent(lang) : (exp.endMonth && exp.endYear ? `${translateMonth(exp.endMonth, lang)} ${exp.endYear}` : '')}
                          </Text>
                        </View>
                        {exp.tech && <Text style={[styles.tech, dynamic.tech]}>{exp.tech}</Text>}
                        {exp.activities && <Text style={styles.activities}>• {exp.activities}</Text>}
                        {exp.results && <Text style={styles.results}>• {exp.results}</Text>}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, dynamic.sectionAccent]} />
              <Text style={styles.sectionTitle}>
                {lang === 'en' ? 'Education' : lang === 'es' ? 'Educación' : 'Educação'}
              </Text>
            </View>
            {(settings?.layout.columns ?? 1) === 1 ? education.map((edu, i) => (
              <View key={i} style={styles.eduBlock}>
                <View style={styles.roleAndDate}>
                  <Text style={styles.eduTitle}>{edu.course}</Text>
                  <Text style={styles.dateRange}>
                    {edu.startMonth && edu.startYear ? `${translateMonth(edu.startMonth, lang)} ${edu.startYear}` : ''}
                    {(edu.startMonth && edu.startYear) && (edu.endMonth || edu.endYear) ? ' - ' : ''}
                    {(edu.endMonth && edu.endYear) ? `${translateMonth(edu.endMonth, lang)} ${edu.endYear}` : ''}
                  </Text>
                </View>
                <Text style={styles.eduInst}>{edu.institution}</Text>
                {edu.description && <Text style={styles.eduDesc}>• {edu.description}</Text>}
              </View>
            )) : (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {Array.from({ length: settings?.layout.columns ?? 1 }).map((_, ci) => (
                  <View key={ci} style={{ flex: 1 }}>
                    {education.filter((_, idx) => idx % (settings?.layout.columns ?? 1) === ci).map((edu, i) => (
                      <View key={i} style={styles.eduBlock}>
                        <View style={styles.roleAndDate}>
                          <Text style={styles.eduTitle}>{edu.course}</Text>
                          <Text style={styles.dateRange}>
                            {edu.startMonth && edu.startYear ? `${translateMonth(edu.startMonth, lang)} ${edu.startYear}` : ''}
                            {(edu.startMonth && edu.startYear) && (edu.endMonth || edu.endYear) ? ' - ' : ''}
                            {(edu.endMonth && edu.endYear) ? `${translateMonth(edu.endMonth, lang)} ${edu.endYear}` : ''}
                          </Text>
                        </View>
                        <Text style={styles.eduInst}>{edu.institution}</Text>
                        {edu.description && <Text style={styles.eduDesc}>• {edu.description}</Text>}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Skills & Languages */}
        {(skills || (languages && languages.length > 0)) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, dynamic.sectionAccent]} />
              <Text style={styles.sectionTitle}>
                {lang === 'en' ? 'Skills & Languages' : lang === 'es' ? 'Habilidades e Idiomas' : 'Competências e Idiomas'}
              </Text>
            </View>
            <View style={styles.skillsLangRow}>
              {skills ? (
                <View style={styles.skillsCol}>
                  <Text style={styles.skillText}>{skills}</Text>
                </View>
              ) : null}
              {languages && languages.length > 0 ? (
                <View style={styles.langCol}>
                  {languages.map((lg, i) => (
                    <Text key={i} style={styles.langItem}>
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
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, dynamic.sectionAccent]} />
              <Text style={styles.sectionTitle}>{lang === 'en' ? 'Projects' : lang === 'es' ? 'Proyectos' : 'Projetos'}</Text>
            </View>
            {projects.map((proj, i) => (
              <View key={i} style={styles.projBlock}>
                <View style={styles.roleAndDate}>
                  <Text style={styles.projName}>{proj.name}</Text>
                  <Text style={styles.projYear}>{proj.year}</Text>
                </View>
                {proj.tech && <Text style={[styles.projTech, dynamic.projTech]}>{proj.tech}</Text>}
                {proj.description && <Text style={styles.projDesc}>• {proj.description}</Text>}
                {proj.link && (
                  <Link src={proj.link} style={[styles.projLink, dynamic.projLink]}>
                    {lang === 'en' ? 'View Project' : lang === 'es' ? 'Ver Proyecto' : 'Ver Projeto'}
                  </Link>
                )}
                {proj.sourceCode && (
                  <Link src={proj.sourceCode} style={[styles.projLink, dynamic.projLink]}>
                    {lang === 'en' ? 'Source Code' : lang === 'es' ? 'Código fuente' : 'Código-fonte'}
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, dynamic.sectionAccent]} />
              <Text style={styles.sectionTitle}>{lang === 'en' ? 'Certifications' : lang === 'es' ? 'Certificaciones' : 'Certificações'}</Text>
            </View>
            {certifications.map((cert, i) => (
              <View key={i} style={styles.certBlock}>
                <View style={styles.roleAndDate}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certDate}>{cert.completionDate}</Text>
                </View>
                <Text style={styles.certIssuer}>{cert.issuer}</Text>
                {cert.validationLink && (
                  <Link src={cert.validationLink} style={[styles.certLink, dynamic.certLink]}>
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
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, dynamic.sectionAccent]} />
              <Text style={styles.sectionTitle}>{lang === 'en' ? 'Volunteer Work' : 'Voluntariado'}</Text>
            </View>
            {volunteers.map((vol, i) => (
              <View key={i} style={styles.volBlock}>
                <View style={styles.roleAndDate}>
                  <Text style={styles.volRole}>{vol.role}</Text>
                  <Text style={styles.dateRange}>
                    {vol.startMonth && vol.startYear ? `${translateMonth(vol.startMonth, lang)} ${vol.startYear}` : ''}
                    {(vol.startMonth && vol.startYear) && (vol.endMonth || vol.endYear || vol.current) ? ' - ' : ''}
                    {vol.current ? translateCurrent(lang) : (vol.endMonth && vol.endYear ? `${translateMonth(vol.endMonth, lang)} ${vol.endYear}` : '')}
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

 
