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
  
  // Density presets
  const density = s?.layout.density || 'normal';
  const densityMultipliers = {
    compact: { margin: 0.7, spacing: 0.6, lineHeight: 0.9, fontSize: 0.95 },
    normal: { margin: 1, spacing: 1, lineHeight: 1, fontSize: 1 },
    spacious: { margin: 1.3, spacing: 1.5, lineHeight: 1.1, fontSize: 1 }
  };
  const densityMult = densityMultipliers[density];
  
  // Single page mode adjustments
  const singlePageMult = s?.layout.singlePageMode ? 0.85 : 1;
  
  // Calculate final values
  const baseMargins = s?.layout.marginsCm ?? { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 };
  const margins = {
    top: baseMargins.top * densityMult.margin * singlePageMult,
    right: baseMargins.right * densityMult.margin * singlePageMult,
    bottom: baseMargins.bottom * densityMult.margin * singlePageMult,
    left: baseMargins.left * densityMult.margin * singlePageMult
  };
  const sectionSpacing = (s?.layout.sectionSpacingPx ?? 12) * densityMult.spacing * singlePageMult;
  const lineSpacing = (s?.layout.lineSpacing ?? 1.4) * densityMult.lineHeight;
  const finalScale = scale * densityMult.fontSize * singlePageMult;
  
  // Section styling
  const sectionTitleColor = s?.sections?.titleColor || '#000000';
  const sectionTitleSize = (s?.sections?.titleFontSize ?? 12) * finalScale;
  
  // Text alignment
  const textAlign = s?.layout.textAlignment || 'left';

  // Photo sizing based on selected aspect ratio
  const ar = s?.photo?.aspectRatio || '1:1';
  let photoW = 90;
  let photoH = 110;
  if (ar === '1:1') { photoW = 90; photoH = 90; }
  if (ar === '3:4') { photoW = 90; photoH = 120; }
  if (ar === '4:3') { photoW = 120; photoH = 90; }

  return StyleSheet.create({
    // Page container: overall padding, base font size and family for the document
    page: { paddingTop: cmToPt(margins.top), paddingRight: cmToPt(margins.right), paddingBottom: cmToPt(margins.bottom), paddingLeft: cmToPt(margins.left), fontSize: 11 * finalScale, fontFamily, lineHeight: lineSpacing },
    // Header: stack header row and divider so divider spans full width
    header: { flexDirection: 'column', marginBottom: 8 * singlePageMult },
    // HeaderRow: contains name/title/contacts and optionally the photo
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    // Name: main full name text displayed prominently in header
    name: { fontSize: (s?.header.nameFontSize ?? 24) * finalScale, fontWeight: s?.header.nameFontWeight === 'heavy' ? 800 : s?.header.nameFontWeight === 'bold' ? 700 : 500, color: s?.header.nameColor || '#000000', marginBottom: 8 * singlePageMult },
    // Title: desired role / professional title shown under the name
    title: { fontSize: 12 * finalScale, color: '#000000', marginBottom: 6 * singlePageMult, textTransform: s?.header.titleStyle === 'uppercase' ? 'uppercase' : 'none', fontStyle: s?.header.titleStyle === 'italic' ? 'italic' : 'normal' },
    // ContactRow: row holding city, phone, email and other small contact items
    contactRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', color: '#000000', fontSize: 9 * finalScale, marginBottom: 6 * singlePageMult },
    // ContactItem: spacing for each contact piece inside the contact row
    contactItem: { marginHorizontal: 6 },
    // HeaderLeft: left column inside header (name + contacts)
    headerLeft: { flex: 1, alignItems: 'center' },
    // Divider: horizontal line below the header (full width, under photo too)
    divider: { width: '100%', borderBottomWidth: s?.header.dividerThickness ?? 1, borderBottomColor: '#e5e7eb', marginVertical: 6 * singlePageMult },
    // Section: general spacing for each main section (experience, education, etc.)
    section: { marginBottom: sectionSpacing },
    // SectionTitle: centered, uppercase headings for each section
    sectionTitle: { textAlign: 'center', fontSize: sectionTitleSize, fontWeight: 'bold', letterSpacing: 1.2, marginBottom: 6 * singlePageMult, textTransform: 'uppercase', color: sectionTitleColor },
    // SummaryText: styling for the resume / summary paragraph
    summaryText: { textAlign: textAlign as any, marginBottom: 4 * singlePageMult, fontSize: 10 * finalScale, color: '#000000' },
    // ExpItem: container for each experience entry
    expItem: { marginBottom: 8 * singlePageMult },
    // ExpHeaderRow: row inside an experience containing left (role/company) and right (dates)
    expHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    // ExpLeft: left column in experience (role, company, details)
    expLeft: { flexDirection: 'column', flex: 1, paddingRight: 6 },
    // ExpRight: right column in experience used for dates (aligned right)
    expRight: { width: 100, textAlign: 'right', color: '#000000', fontSize: 10 * finalScale },
    // JobRole: role/title text styling in experience/volunteer
    jobRole: { fontSize: 11 * finalScale, fontWeight: 'bold' },
    // Company: company or institution name styling
    company: { fontSize: 10 * finalScale, color: '#000000', marginBottom: 4 * singlePageMult },
    // Bullets: bullet item text styling used for results/descriptions
    bullets: { marginLeft: 8, color: '#000000', fontSize: 10 * finalScale, textAlign: textAlign as any },
    // Activities: continuous activities text should not have left margin
    activitiesText: { marginLeft: 0, color: '#000000', fontSize: 10 * finalScale, textAlign: textAlign as any },
    // EduItem: container for each education entry
    eduItem: { marginBottom: 8 * singlePageMult },
    // Skills: central block styling for skills text
    skills: { textAlign: 'center', color: '#000000', fontSize: 10 * finalScale },
    // Photo container: fixed box that defines crop area
    photo: { width: photoW, height: photoH, borderRadius: 4, marginLeft: 10 },
    // Photo image: fills container and crops using cover
    photoImage: { width: photoW, height: photoH, objectFit: 'cover', borderRadius: 4 }
  });
};

function translateMonth(month: string, lang: string) {
  const target = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  return translateMonthForLang(month, target);
}

function getFullMonthName(month?: string, lang?: string): string {
  if (!month) return '';
  const target = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  
  // Map abbreviated months to full month names
  const monthMap: Record<string, Record<'pt' | 'en' | 'es', string>> = {
    'Jan': { pt: 'Janeiro', en: 'January', es: 'Enero' },
    'Feb': { pt: 'Fevereiro', en: 'February', es: 'Febrero' },
    'Mar': { pt: 'Março', en: 'March', es: 'Marzo' },
    'Apr': { pt: 'Abril', en: 'April', es: 'Abril' },
    'May': { pt: 'Maio', en: 'May', es: 'Mayo' },
    'Jun': { pt: 'Junho', en: 'June', es: 'Junio' },
    'Jul': { pt: 'Julho', en: 'July', es: 'Julio' },
    'Aug': { pt: 'Agosto', en: 'August', es: 'Agosto' },
    'Sep': { pt: 'Setembro', en: 'September', es: 'Septiembre' },
    'Oct': { pt: 'Outubro', en: 'October', es: 'Octubre' },
    'Nov': { pt: 'Novembro', en: 'November', es: 'Noviembre' },
    'Dec': { pt: 'Dezembro', en: 'December', es: 'Diciembre' },
    'Fev': { pt: 'Fevereiro', en: 'February', es: 'Febrero' },
    'Abr': { pt: 'Abril', en: 'April', es: 'Abril' },
    'Mai': { pt: 'Maio', en: 'May', es: 'Mayo' },
    'Ago': { pt: 'Agosto', en: 'August', es: 'Agosto' },
    'Set': { pt: 'Setembro', en: 'September', es: 'Septiembre' },
    'Out': { pt: 'Outubro', en: 'October', es: 'Octubre' },
    'Dez': { pt: 'Dezembro', en: 'December', es: 'Diciembre' },
    'Ene': { pt: 'Janeiro', en: 'January', es: 'Enero' },
  };
  
  return monthMap[month]?.[target] || month;
}

function translateCurrent(lang: string) {
  const target = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  if (target === 'en') return 'Current';
  if (target === 'es') return 'Actual';
  return 'Atual';
}

function formatMonthYear(month?: string, year?: string, lang?: string, dateFormat?: 'short' | 'medium' | 'long') {
  if (!month || !year) return '';
  const target = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  const abbr = translateMonthForLang(month, target) || '';
  
  // Format based on dateFormat preference
  if (dateFormat === 'short') {
    // Format: 01/2020 - find the month number from English months
    const enMonth = translateMonthForLang(month, 'en') || month;
    const monthNum = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(enMonth) + 1;
    return `${monthNum.toString().padStart(2, '0')}/${year}`;
  } else if (dateFormat === 'long') {
    // Format: Janeiro 2020 - use full month name
    const fullName = getFullMonthName(month, lang);
    return `${fullName} ${year}`;
  } else {
    // Format: Jan 2020 (default/medium)
    const normalized = abbr.charAt(0).toUpperCase() + abbr.slice(1).toLowerCase();
    return `${normalized} ${year}`;
  }
}

function formatDateRange(startMonth?: string, startYear?: string, endMonth?: string, endYear?: string, current?: boolean, lang?: string, dateFormat?: 'short' | 'medium' | 'long') {
  const start = (() => {
    if (startMonth && startYear) return formatMonthYear(startMonth, startYear, lang, dateFormat);
    if (startYear || startMonth) {
      const month = startMonth ? translateMonth(startMonth, lang || 'pt') : '';
      const divider = startMonth && startYear ? '/' : '';
      return `${month}${divider}${startYear || ''}`.trim();
    }
    return '';
  })();

  const end = (() => {
    if (current) return translateCurrent(lang || 'pt');
    if (endMonth && endYear) return formatMonthYear(endMonth, endYear, lang, dateFormat);
    if (endYear || endMonth) {
      const month = endMonth ? translateMonth(endMonth, lang || 'pt') : '';
      const divider = endMonth && endYear ? '/' : '';
      return `${month}${divider}${endYear || ''}`.trim();
    }
    return '';
  })();

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end) return end;
  return '';
}

export function RenewedTemplate({ personalInfo, links, resume, experiences, education, skills, languages, certifications, projects, volunteers, customSections, lang, settings, color, sectionOrder }: RenewedTemplateProps) {
  const l = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  const styles = buildStyles(settings);
  
  // Default section order if not provided
  const defaultOrder: import('../../types/cv').PredefinedSectionKey[] = [
    'professional_summary',
    'professional_experience',
    'academic_education',
    'technical_skills',
    'languages',
    'certifications',
    'projects',
    'volunteer',
  ];
  
  const customOrder = (customSections || []).map((cs) => `custom_${cs.id}` as import('../../types/cv').SectionKey);
  const baseOrder = sectionOrder && sectionOrder.length > 0 ? sectionOrder : defaultOrder;
  const order = [...baseOrder, ...customOrder.filter((k) => !baseOrder.includes(k))];

  const contactItems = [personalInfo?.city, personalInfo?.postalCode, personalInfo?.email, personalInfo?.countryCode && personalInfo?.phone ? `${personalInfo.countryCode.match(/\(([^)]+)\)/)?.[1] || personalInfo.countryCode} ${personalInfo.phone}` : personalInfo?.phone].filter(Boolean);
  
  // Function to render each section based on the section key
  const renderSection = (sectionKey: import('../../types/cv').SectionKey) => {
    switch (sectionKey) {
      case 'professional_summary':
        return resume ? (
          <View style={styles.section} key={sectionKey}>
            <Text style={styles.sectionTitle}>{l === 'en' ? 'SUMMARY' : l === 'es' ? 'RESUMEN' : 'RESUMO'}</Text>
            <Text style={styles.summaryText}>{resume}</Text>
          </View>
        ) : null;
        
      case 'professional_experience':
        return experiences.length > 0 ? (
          <View style={styles.section} key={sectionKey}>
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
                      const dr = formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.current, l, settings?.sections?.dateFormat);
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
        ) : null;
        
      case 'academic_education':
        return education.length > 0 ? (
          <View style={styles.section} key={sectionKey}>
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
                      const dr = formatDateRange(edu.startMonth, edu.startYear, edu.endMonth, edu.endYear, (edu as any).current, l, settings?.sections?.dateFormat);
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
        ) : null;
        
      case 'technical_skills':
        return skills ? (
          <View style={styles.section} key={sectionKey}>
            <Text style={styles.sectionTitle}>{l === 'en' ? 'SKILLS' : l === 'es' ? 'HABILIDADES' : 'COMPETÊNCIAS'}</Text>
            <Text style={styles.skills}>{skills}</Text>
          </View>
        ) : null;
        
      case 'languages':
        return languages && languages.length > 0 ? (
          <View style={styles.section} key={sectionKey}>
            <Text style={styles.sectionTitle}>{l === 'en' ? 'LANGUAGES' : l === 'es' ? 'IDIOMAS' : 'IDIOMAS'}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
              {languages.map((langItem, li) => (
                <Text key={li} style={{ marginHorizontal: 6, fontSize: 10 }}>
                  {langItem.name}{langItem.level ? ` (${langItem.level})` : ''}
                </Text>
              ))}
            </View>
          </View>
        ) : null;
        
      case 'certifications':
        return certifications && certifications.length > 0 ? (
          <View style={styles.section} key={sectionKey}>
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
        ) : null;
        
      case 'projects':
        return projects && projects.length > 0 ? (
          <View style={styles.section} key={sectionKey}>
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
        ) : null;
        
      case 'volunteer':
        return volunteers && volunteers.length > 0 ? (
          <View style={styles.section} key={sectionKey}>
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
                      const dr = formatDateRange(vol.startMonth, vol.startYear, vol.endMonth, vol.endYear, (vol as any).current, l, settings?.sections?.dateFormat);
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
        ) : null;
        
      default:
        if (sectionKey.startsWith('custom_')) {
          const customId = sectionKey.replace('custom_', '');
          const section = (customSections || []).find((cs) => cs.id === customId);
          if (!section) return null;

          const meaningfulFields = (section.fields || []).filter((f) => f.label || f.value || f.bullets || f.subtitle || f.startYear || f.endYear || f.startMonth || f.endMonth || f.current);
          if (!section.title && meaningfulFields.length === 0) return null;

          return (
            <View style={styles.section} key={sectionKey}>
              <Text style={styles.sectionTitle}>
                {section.title || (l === 'en' ? 'CUSTOM SECTION' : l === 'es' ? 'SECCIÓN PERSONALIZADA' : 'SECÇÃO PERSONALIZADA')}
              </Text>
              {meaningfulFields.map((field, idx) => (
                <View key={field.id || idx} style={{ marginBottom: 8 }}>
                  {(field.label || field.subtitle || field.startYear || field.endYear || field.startMonth || field.endMonth || field.current) ? (
                    <View style={styles.expHeaderRow}>
                      <View style={styles.expLeft}>
                        {field.label ? <Text style={styles.jobRole}>{field.label}</Text> : null}
                        {field.subtitle ? <Text style={styles.company}>{field.subtitle}</Text> : null}
                      </View>
                      <View style={styles.expRight}>
                        <Text>
                          {(() => {
                            const dr = formatDateRange(field.startMonth, field.startYear, field.endMonth, field.endYear, field.current, l, settings?.sections?.dateFormat);
                            if (dr) return dr;
                            const start = (field.startMonth || field.startYear) ? `${translateMonth(field.startMonth || '', l)}${field.startMonth && field.startYear ? '/' : ''}${field.startYear || ''}` : '';
                            const end = field.current ? translateCurrent(l) : (field.endMonth || field.endYear ? `${translateMonth(field.endMonth || '', l)}${field.endMonth && field.endYear ? '/' : ''}${field.endYear || ''}` : '');
                            if (!start && !end) return '';
                            return `${start}${start && end ? ' - ' : ''}${end}`;
                          })()}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  {field.value ? (
                    <Text style={styles.activitiesText}>{field.value}</Text>
                  ) : null}
                  {field.bullets ? (
                    <View style={{ marginTop: 2 }}>
                      {(field.bullets || '').split(/\r\n|\r|\n/).filter(Boolean).map((line, li) => (
                        <Text key={li} style={styles.bullets}>• {line}</Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          );
        }
        return null;
    }
  };

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
          <View style={styles.headerRow}>
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
                      {lnk.hideLinkLabel ? lnk.value : `${lnk.customName || lnk.type}: ${lnk.value}`}
                    </Link>
                  ))}
                </View>
              )}
            </View>
            {settings?.photo?.enabled && settings?.photo?.dataUrl ? (
              <View style={styles.photo}>
                <Image src={settings.photo.dataUrl as string} style={styles.photoImage} />
              </View>
            ) : null}
          </View>
          <View style={styles.divider} />
        </View>

        {/* Render sections dynamically based on sectionOrder */}
        {order.map(sectionKey => renderSection(sectionKey))}

      </Page>
    </Document>
  );
}
