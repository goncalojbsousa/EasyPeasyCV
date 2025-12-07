import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Image } from '@react-pdf/renderer';
import { CvData, CvRenderSettings, CvColor } from '../../types/cv';
import { translateMonthForLang } from '../../utils/months';

interface RenewedTemplateProps extends CvData {
  lang?: string;
  settings?: CvRenderSettings;
  color?: CvColor;
}

const cmToPt = (cm: number) => cm * 28.3465;

const buildStyles = (settings?: CvRenderSettings) => {
  const s = settings;
  const scale = s?.layout.textScale || 1;
  const familyRaw = s?.layout.fontFamily || 'Helvetica';
  const fontFamily = s?.layout.fontFamily === 'Custom' ? (s?.layout.customFont?.name || 'Helvetica') : (familyRaw === 'Arial' ? 'Helvetica' : familyRaw);
  const margins = s?.layout.marginsCm ?? { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 };
  const sectionSpacing = s?.layout.sectionSpacingPx ?? 12;

  return StyleSheet.create({
    // Page container: overall padding, base font size and family for the document
    page: { paddingTop: cmToPt(margins.top), paddingRight: cmToPt(margins.right), paddingBottom: cmToPt(margins.bottom), paddingLeft: cmToPt(margins.left), fontSize: 11 * scale, fontFamily, lineHeight: s?.layout.lineSpacing ?? 1.4 },
    // Header row: contains name, title and optionally the photo
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    // Name: main full name text displayed prominently in header
    name: { fontSize: (s?.header.nameFontSize ?? 24) * scale, fontWeight: s?.header.nameFontWeight === 'heavy' ? 800 : s?.header.nameFontWeight === 'bold' ? 700 : 500, color: s?.header.nameColor || '#000000', marginBottom: 8 },
    // Title: desired role / professional title shown under the name
    title: { fontSize: 12 * scale, color: '#000000', marginBottom: 6, textTransform: s?.header.titleStyle === 'uppercase' ? 'uppercase' : 'none', fontStyle: s?.header.titleStyle === 'italic' ? 'italic' : 'normal' },
    // ContactRow: row holding city, phone, email and other small contact items
    contactRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', color: '#000000', fontSize: 9 * scale, marginBottom: 6 },
    // ContactItem: spacing for each contact piece inside the contact row
    contactItem: { marginHorizontal: 6 },
    // HeaderLeft: left column inside header (name + contacts)
    headerLeft: { flex: 1, alignItems: 'center' },
    // Divider: horizontal line below the header
    divider: { width: '100%', borderBottomWidth: s?.header.dividerThickness ?? 1, borderBottomColor: '#e5e7eb', marginVertical: 6 },
    // Section: general spacing for each main section (experience, education, etc.)
    section: { marginBottom: sectionSpacing },
    // SectionTitle: centered, uppercase headings for each section
    sectionTitle: { textAlign: 'center', fontSize: 12 * scale, fontWeight: 'bold', letterSpacing: 1.2, marginBottom: 6, textTransform: 'uppercase' },
    // SummaryText: styling for the resume / summary paragraph
    summaryText: { textAlign: 'left', marginBottom: 4, fontSize: 10 * scale, color: '#000000' },
    // ExpItem: container for each experience entry
    expItem: { marginBottom: 8 },
    // ExpHeaderRow: row inside an experience containing left (role/company) and right (dates)
    expHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    // ExpLeft: left column in experience (role, company, details)
    expLeft: { flexDirection: 'column', flex: 1, paddingRight: 6 },
    // ExpRight: right column in experience used for dates (aligned right)
    expRight: { width: 100, textAlign: 'right', color: '#000000', fontSize: 10 * scale },
    // JobRole: role/title text styling in experience/volunteer
    jobRole: { fontSize: 11 * scale, fontWeight: 'bold' },
    // Company: company or institution name styling
    company: { fontSize: 10 * scale, color: '#000000', marginBottom: 4 },
    // Bullets: bullet item text styling used for results/descriptions
    bullets: { marginLeft: 8, color: '#000000', fontSize: 10 * scale },
    // Activities: continuous activities text should not have left margin
    activitiesText: { marginLeft: 0, color: '#000000', fontSize: 10 * scale },
    // EduItem: container for each education entry
    eduItem: { marginBottom: 8 },
    // Skills: central block styling for skills text
    skills: { textAlign: 'center', color: '#000000', fontSize: 10 * scale },
    // Photo: profile photo size and corner rounding
    photo: { width: 90, height: 110, borderRadius: 4, marginLeft: 10 }
  });
};

function translateMonth(month: string, lang: string) {
  const target = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  return translateMonthForLang(month, target);
}

function translateCurrent(lang: string) {
  const target = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  if (target === 'en') return 'Current';
  if (target === 'es') return 'Actual';
  return 'Atual';
}

function formatMonthYear(month?: string, year?: string, lang?: string) {
  if (!month || !year) return '';
  const target = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  const full = translateMonthForLang(month, target) || '';
  const abbr = full.substring(0, 3);
  const normalized = abbr.charAt(0).toUpperCase() + abbr.slice(1).toLowerCase();
  return `${normalized} ${year}`;
}

function formatDateRange(startMonth?: string, startYear?: string, endMonth?: string, endYear?: string, current?: boolean, lang?: string) {
  // Only return the compact "Mon YYYY - Mon YYYY" format when both month and year are present
  const hasStart = !!(startMonth && startYear);
  const hasEnd = !!(endMonth && endYear);
  if (!hasStart) {
    // fallback to any available pieces
    if (startYear) return startYear;
    return '';
  }

  const start = formatMonthYear(startMonth, startYear, lang);
  if (current) return `${start} - ${translateCurrent(lang || 'pt')}`;
  if (hasEnd) {
    const end = formatMonthYear(endMonth, endYear, lang);
    return `${start} - ${end}`;
  }

  // if end doesn't have both month+year but has year, show fallback
  if (endYear) return `${start} - ${endYear}`;
  return start;
}

export function RenewedTemplate({ personalInfo, links, resume, experiences, education, skills, languages, certifications, projects, volunteers, lang, settings, color }: RenewedTemplateProps) {
  const l = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  const styles = buildStyles(settings);

  const contactItems = [personalInfo?.city, personalInfo?.postalCode, personalInfo?.email, personalInfo?.countryCode && personalInfo?.phone ? `${personalInfo.countryCode.match(/\(([^)]+)\)/)?.[1] || personalInfo.countryCode} ${personalInfo.phone}` : personalInfo?.phone].filter(Boolean);

  function getSocialUrl(type: string, value: string) {
    if (!value) return '';
    const val = value.trim();
    const hasProtocol = /^https?:\/\//i.test(val);
    const lower = type.toLowerCase();
    if (lower === 'email') return `mailto:${val}`;
    if (lower === 'phone') return `tel:${val}`;
    if (!hasProtocol) {
      if (/linkedin\.com/i.test(val)) return `https://${val}`;
      if (/github\.com/i.test(val)) return `https://${val}`;
      return `https://${val}`;
    }
    return val;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
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
                    {lnk.customName || lnk.type}: {lnk.value}
                  </Link>
                ))}
              </View>
            )}
            <View style={styles.divider} />
          </View>
          {settings?.photo?.enabled && settings?.photo?.dataUrl ? (
            <Image src={settings.photo.dataUrl as string} style={styles.photo} />
          ) : null}
        </View>

        {/* Summary */}
        {resume && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l === 'en' ? 'SUMMARY' : l === 'es' ? 'RESUMEN' : 'RESUMO'}</Text>
            <Text style={styles.summaryText}>{resume}</Text>
          </View>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l === 'en' ? 'EXPERIENCE' : l === 'es' ? 'EXPERIENCIA' : 'EXPERIÊNCIA'}</Text>
            {experiences.map((exp, idx) => (
              <View key={idx} style={styles.expItem}>
                <View style={styles.expHeaderRow}>
                  <View style={styles.expLeft}>
                    {exp.role && <Text style={styles.jobRole}>{exp.role}</Text>}
                    {exp.company && <Text style={styles.company}>{exp.company}</Text>}
                  </View>
                  <View style={styles.expRight}>
                    <Text>{(() => {
                      const dr = formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.current, l);
                      if (dr) return dr;
                      const start = (exp.startMonth || exp.startYear) ? `${translateMonth(exp.startMonth || '', l)}${exp.startMonth && exp.startYear ? '/' : ''}${exp.startYear || ''}` : '';
                      const end = exp.current ? translateCurrent(l) : (exp.endMonth || exp.endYear ? `${translateMonth(exp.endMonth || '', l)}${exp.endMonth && exp.endYear ? '/' : ''}${exp.endYear || ''}` : '');
                      if (!start && !end) return '';
                      return `${start}${start && end ? ' - ' : ''}${end}`;
                    })()}</Text>
                  </View>
                </View>
                {exp.activities && (
                  <Text style={styles.activitiesText}>{exp.activities}</Text>
                )}
                {exp.results && (
                  <View style={{ marginTop: 2 }}>
                    {(exp.results || '').split(/\r\n|\r|\n/).filter(Boolean).map((line, li) => (
                      <Text key={li} style={styles.bullets}>• {line}</Text>
                    ))}
                  </View>
                )}
                {exp.tech && <Text style={{ marginTop: 4, color: '#000000', fontSize: 10 }}>{exp.tech}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l === 'en' ? 'EDUCATION' : l === 'es' ? 'EDUCACIÓN' : 'EDUCAÇÃO'}</Text>
            {education.map((edu, idx) => (
              <View key={idx} style={styles.eduItem}>
                <View style={styles.expHeaderRow}>
                  <View style={styles.expLeft}>
                    <Text style={styles.jobRole}>{edu.course}</Text>
                    <Text style={styles.company}>{edu.institution}</Text>
                  </View>
                  <View style={styles.expRight}>
                    <Text>{(() => {
                      const dr = formatDateRange(edu.startMonth, edu.startYear, edu.endMonth, edu.endYear, (edu as any).current, l);
                      if (dr) return dr;
                      const start = (edu.startMonth || edu.startYear) ? `${translateMonth(edu.startMonth || '', l)}${edu.startMonth && edu.startYear ? '/' : ''}${edu.startYear || ''}` : '';
                      const end = (edu.endMonth || edu.endYear) ? `${translateMonth(edu.endMonth || '', l)}${edu.endMonth && edu.endYear ? '/' : ''}${edu.endYear || ''}` : '';
                      if (!start && !end) return '';
                      return `${start}${start && end ? ' - ' : ''}${end}`;
                    })()}</Text>
                  </View>
                </View>
                {edu.description && (
                  <Text style={styles.activitiesText}>{edu.description}</Text>
                )}
                {edu.achievements && (
                  <View style={{ marginTop: 2 }}>
                    {(edu.achievements || '').split(/\r\n|\r|\n/).filter(Boolean).map((line, li) => (
                      <Text key={li} style={styles.bullets}>• {line}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l === 'en' ? 'SKILLS' : l === 'es' ? 'HABILIDADES' : 'COMPETÊNCIAS'}</Text>
            <Text style={styles.skills}>{skills}</Text>
          </View>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l === 'en' ? 'LANGUAGES' : l === 'es' ? 'IDIOMAS' : 'IDIOMAS'}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
              {languages.map((langItem, li) => (
                <Text key={li} style={{ marginHorizontal: 6, fontSize: 10 }}>
                  {langItem.name}{langItem.level ? ` (${langItem.level})` : ''}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l === 'en' ? 'CERTIFICATIONS' : l === 'es' ? 'CERTIFICACIONES' : 'CERTIFICAÇÕES'}</Text>
            {certifications.map((cert, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{cert.name} <Text style={{ fontSize: 10, fontStyle: 'italic' }}>{cert.completionDate}</Text></Text>
                {cert.issuer && <Text style={{ fontSize: 10, color: '#000000' }}>{cert.issuer}</Text>}
                {cert.validationLink && <Link src={cert.validationLink} style={{ fontSize: 9, color: '#2563eb' }}>{cert.validationLink}</Link>}
                {cert.description && <Text style={styles.bullets}>• {cert.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Volunteer Work */}
        {volunteers && volunteers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l === 'en' ? 'VOLUNTEER' : l === 'es' ? 'VOLUNTARIADO' : 'VOLUNTARIADO'}</Text>
            {volunteers.map((vol, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={styles.expHeaderRow}>
                  <View style={styles.expLeft}>
                    <Text style={styles.jobRole}>{vol.role}</Text>
                    <Text style={styles.company}>{vol.organization}</Text>
                  </View>
                  <View style={styles.expRight}>
                    <Text>{(() => {
                      const dr = formatDateRange(vol.startMonth, vol.startYear, vol.endMonth, vol.endYear, (vol as any).current, l);
                      if (dr) return dr;
                      const start = vol.startMonth && vol.startYear ? `${translateMonth(vol.startMonth, l)}${vol.startMonth && vol.startYear ? '/' : ''}${vol.startYear}` : '';
                      const end = (vol as any).current ? translateCurrent(l) : (vol.endMonth && vol.endYear ? `${translateMonth(vol.endMonth, l)}${vol.endMonth && vol.endYear ? '/' : ''}${vol.endYear}` : '');
                      if (!start && !end) return '';
                      return `${start}${start && end ? ' - ' : ''}${end}`;
                    })()}</Text>
                  </View>
                </View>
                {vol.description && (
                  <Text style={styles.activitiesText}>{vol.description}</Text>
                )}
                {vol.impact && (
                  <View style={{ marginTop: 2 }}>
                    {(vol.impact || '').split(/\r\n|\r|\n/).filter(Boolean).map((line, li) => (
                      <Text key={li} style={styles.bullets}>• {line}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l === 'en' ? 'PROJECTS' : l === 'es' ? 'PROYECTOS' : 'PROJETOS'}</Text>
            {projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{proj.name} {proj.year ? <Text style={{ fontSize: 10, fontStyle: 'italic' }}>{proj.year}</Text> : null}</Text>
                {proj.tech && <Text style={{ fontSize: 10, color: '#000000' }}>{proj.tech}</Text>}
                {proj.description && (
                  <Text style={styles.activitiesText}>{proj.description}</Text>
                )}
                {proj.impact && (
                  <View style={{ marginTop: 2 }}>
                    {(proj.impact || '').split(/\r\n|\r|\n/).filter(Boolean).map((line, li) => (
                      <Text key={li} style={styles.bullets}>• {line}</Text>
                    ))}
                  </View>
                )}
                {proj.link && <Link src={proj.link} style={{ fontSize: 9, color: '#2563eb' }}>{proj.link}</Link>}
                {proj.sourceCode && <Link src={proj.sourceCode} style={{ fontSize: 9, color: '#2563eb' }}>{proj.sourceCode}</Link>}
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}

export default RenewedTemplate;
