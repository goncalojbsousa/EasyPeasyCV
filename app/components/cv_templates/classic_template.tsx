import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Image } from '@react-pdf/renderer';
import { CvData, CvRenderSettings, CvColor } from '../../types/cv';
import { translateMonthForLang } from '../../utils/months';
import ptTranslations from '../../translations/pt';
import enTranslations from '../../translations/en';
import esTranslations from '../../translations/es';
import brTranslations from '../../translations/br';
import { getColorTheme } from '../../utils/color-themes';

interface ClassicTemplateProps extends CvData {
  lang?: string;
  settings?: CvRenderSettings;
  color?: CvColor;
}

type PdfTextAlign = 'left' | 'right' | 'center' | 'justify';
const cmToPt = (cm: number) => cm * 28.3465;

const buildStyles = (settings?: CvRenderSettings, color: CvColor = 'blue') => {
  const s = settings;
  const scale = s?.layout.textScale || 1;
  const familyRaw = s?.layout.fontFamily || 'Helvetica';
  const fontFamily = s?.layout.fontFamily === 'Custom' ? (s?.layout.customFont?.name || 'Helvetica') : (familyRaw === 'Arial' ? 'Helvetica' : familyRaw);

  const density = s?.layout.density || 'normal';
  const densityMultipliers = {
    compact: { margin: 0.7, spacing: 0.7, lineHeight: 0.95, fontSize: 0.95 },
    normal: { margin: 1, spacing: 1, lineHeight: 1, fontSize: 1 },
    spacious: { margin: 1.3, spacing: 1.4, lineHeight: 1.05, fontSize: 1.05 },
  } as const;
  const densityMult = densityMultipliers[density];

  const singlePageMult = s?.layout.singlePageMode ? 0.9 : 1;

  const baseMargins = s?.layout.marginsCm ?? { top: 1.8, right: 1.5, bottom: 1.5, left: 1.5 };
  const margins = {
    top: baseMargins.top * densityMult.margin * singlePageMult,
    right: baseMargins.right * densityMult.margin * singlePageMult,
    bottom: baseMargins.bottom * densityMult.margin * singlePageMult,
    left: baseMargins.left * densityMult.margin * singlePageMult,
  };

  const sectionSpacing = (s?.layout.sectionSpacingPx ?? 14) * densityMult.spacing * singlePageMult;
  const lineSpacing = (s?.layout.lineSpacing ?? 1.4) * densityMult.lineHeight;
  const finalScale = scale * densityMult.fontSize * singlePageMult;
  const textAlign: PdfTextAlign = (s?.layout.textAlignment as PdfTextAlign) || 'left';

  const sectionTitleColor = s?.sections?.titleColor || getColorTheme(color).primary;
  const sectionTitleSize = (s?.sections?.titleFontSize ?? 12) * finalScale;
  const accent = getColorTheme(color).primary;
  const lineColor = '#d1d5db';

  const photoSize = 78;

  const createdStyles = StyleSheet.create({
    page: {
      paddingTop: cmToPt(margins.top),
      paddingRight: cmToPt(margins.right),
      paddingBottom: cmToPt(margins.bottom),
      paddingLeft: cmToPt(margins.left),
      fontSize: 11 * finalScale,
      fontFamily,
      lineHeight: lineSpacing,
      color: '#111827',
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 * singlePageMult },
    headerLeft: { flex: 1 },
    name: {
      fontSize: (s?.header.nameFontSize ?? 24) * finalScale,
      fontWeight: s?.header.nameFontWeight === 'heavy' ? 800 : s?.header.nameFontWeight === 'bold' ? 700 : 500,
      color: s?.header.nameColor || '#0f172a',
      marginBottom: 4 * singlePageMult,
    },
    title: {
      fontSize: 12 * finalScale,
      color: '#1f2937',
      marginBottom: 8 * singlePageMult,
      textTransform: s?.header.titleStyle === 'uppercase' ? 'uppercase' : 'none',
      fontStyle: s?.header.titleStyle === 'italic' ? 'italic' : 'normal',
    },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
    contactItem: { flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 4, fontSize: 9 * finalScale, color: '#374151' },
    contactLabel: { fontWeight: 'bold', marginRight: 4 },
    contactSeparator: { marginRight: 8, color: '#9ca3af' },
    photoFrame: {
      width: photoSize,
      height: photoSize,
      borderRadius: photoSize / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      overflow: 'hidden',
    },
    photoImage: { width: photoSize, height: photoSize, objectFit: 'cover' },
    initials: { fontSize: 20 * finalScale, fontWeight: 'bold', color: '#0f172a' },
    divider: {
      width: '100%',
      borderBottomWidth: s?.header.dividerThickness ?? 1,
      borderBottomColor: '#e5e7eb',
      marginTop: 10 * singlePageMult,
      marginBottom: 12 * singlePageMult,
      borderStyle: s?.header.dividerStyle || 'solid',
    },
    section: { marginBottom: sectionSpacing },
    sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 * singlePageMult },
    sectionTitle: { fontSize: sectionTitleSize, fontWeight: 'bold', letterSpacing: 1.1, color: sectionTitleColor },
    sectionLine: { height: 1, backgroundColor: lineColor, flex: 1, marginLeft: 8 },
    paragraph: { fontSize: 10 * finalScale, color: '#111827', textAlign },
    subText: { fontSize: 9 * finalScale, color: '#374151', textAlign },
    timelineWrap: { paddingLeft: 14, borderLeftWidth: 1, borderLeftColor: lineColor },
    timelineItem: { position: 'relative', paddingLeft: 10, marginBottom: 12 * singlePageMult },
    timelineBullet: { position: 'absolute', width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: accent, backgroundColor: '#ffffff', left: -19.5, top: 0 },
    entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
    role: { fontSize: 11 * finalScale, fontWeight: 'bold', color: '#0f172a' },
    company: { fontSize: 10 * finalScale, color: '#1f2937', marginBottom: 2 },
    date: { fontSize: 10 * finalScale, color: '#374151', textAlign: 'right', marginLeft: 8 },
    bulletText: { marginLeft: 8, fontSize: 10 * finalScale, color: '#0f172a', textAlign },
    metaText: { fontSize: 9 * finalScale, color: '#4b5563' },
    langRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    langName: { fontSize: 10 * finalScale, fontWeight: 'bold', color: '#0f172a' },
    langDivider: { flex: 1, height: 1, backgroundColor: lineColor, marginHorizontal: 6 },
    langLevel: { fontSize: 9 * finalScale, color: '#6b7280', textTransform: 'uppercase' },
    skillRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
    skillDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: accent, marginRight: 6 },
    centerText: { textAlign: 'center' as PdfTextAlign },
    link: { fontSize: 9 * finalScale, color: accent, marginRight: 8 },
  });

  return { ...createdStyles, _finalScale: finalScale, _singlePageMult: singlePageMult, _accent: accent };
};

const translationMaps: Record<'pt' | 'en' | 'es' | 'br', Record<string, string>> = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
  br: brTranslations,
};

function translateLabel(key?: string, lang?: string) {
  if (!key) return '';
  const target = (lang || 'pt') as 'pt' | 'en' | 'es' | 'br';
  const map = translationMaps[target] || translationMaps.pt;
  return map[key] || '';
}

function translateMonth(month: string, lang: string) {
  const target = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  return translateMonthForLang(month, target);
}

function getFullMonthName(month?: string, lang?: string): string {
  if (!month) return '';
  const target = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';

  const monthMap: Record<string, Record<'pt' | 'en' | 'es', string>> = {
    Jan: { pt: 'Janeiro', en: 'January', es: 'Enero' },
    Feb: { pt: 'Fevereiro', en: 'February', es: 'Febrero' },
    Mar: { pt: 'Março', en: 'March', es: 'Marzo' },
    Apr: { pt: 'Abril', en: 'April', es: 'Abril' },
    May: { pt: 'Maio', en: 'May', es: 'Mayo' },
    Jun: { pt: 'Junho', en: 'June', es: 'Junio' },
    Jul: { pt: 'Julho', en: 'July', es: 'Julio' },
    Aug: { pt: 'Agosto', en: 'August', es: 'Agosto' },
    Sep: { pt: 'Setembro', en: 'September', es: 'Septiembre' },
    Oct: { pt: 'Outubro', en: 'October', es: 'Octubre' },
    Nov: { pt: 'Novembro', en: 'November', es: 'Noviembre' },
    Dec: { pt: 'Dezembro', en: 'December', es: 'Diciembre' },
  };

  return monthMap[month]?.[target] || month;
}

function translateCurrent(lang: string) {
  const target = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  if (target === 'en') return 'Current';
  if (target === 'es') return 'Actual';
  return 'Atual';
}

function translateLanguageLevel(level?: string, lang?: string) {
  if (!level) return '';
  const translated = translateLabel(level, lang);
  if (translated) return translated;
  return level;
}

function formatMonthYear(month?: string, year?: string, lang?: string, dateFormat?: 'short' | 'medium' | 'long') {
  if (!month || !year) return '';
  const target = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  const abbr = translateMonthForLang(month, target) || '';

  if (dateFormat === 'short') {
    const enMonth = translateMonthForLang(month, 'en') || month;
    const monthNum = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(enMonth) + 1;
    return `${monthNum.toString().padStart(2, '0')}/${year}`;
  }
  if (dateFormat === 'long') {
    const fullName = getFullMonthName(month, lang);
    return `${fullName} ${year}`;
  }
  const normalized = abbr.charAt(0).toUpperCase() + abbr.slice(1).toLowerCase();
  return `${normalized} ${year}`;
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

function getInitials(name?: string) {
  if (!name) return 'YOU';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

function splitLines(value?: string) {
  if (!value) return [] as string[];
  return value.split(/\r\n|\r|\n/).filter(Boolean);
}

export function ClassicTemplate({ personalInfo, links, resume, experiences, education, skills, languages, certifications, projects, volunteers, customSections, lang, settings, color, sectionOrder }: ClassicTemplateProps) {
  const l = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  const styles = buildStyles(settings, color || 'blue');

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

  const contactItems = [
    personalInfo?.phone && { label: 'Tel', value: personalInfo.countryCode && personalInfo.phone ? `${personalInfo.countryCode.match(/\(([^)]+)\)/)?.[1] || personalInfo.countryCode} ${personalInfo.phone}` : personalInfo.phone },
    personalInfo?.email && { label: 'Email', value: personalInfo.email },
    personalInfo?.city && { label: 'City', value: [personalInfo.city, personalInfo.postalCode].filter(Boolean).join(' ') },
  ].filter(Boolean) as { label: string; value: string }[];

  const skillList = skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const photoSrc = settings?.photo?.enabled ? settings.photo?.dataUrl || null : null;

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

  const SectionTitle = ({ label }: { label: string }) => (
    <View style={styles.sectionTitleWrap}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <View style={styles.sectionLine} />
    </View>
  );

  const renderSection = (sectionKey: import('../../types/cv').SectionKey) => {
    switch (sectionKey) {
      case 'professional_summary':
        return resume ? (
          <View style={styles.section} key={sectionKey}>
            <SectionTitle label={l === 'en' ? 'SUMMARY' : l === 'es' ? 'RESUMEN' : 'RESUMO'} />
            <Text style={styles.paragraph}>{resume}</Text>
          </View>
        ) : null;

      case 'professional_experience':
        return experiences.length > 0 ? (
          <View style={styles.section} key={sectionKey}>
            <SectionTitle label={l === 'en' ? 'EXPERIENCE' : l === 'es' ? 'EXPERIENCIA' : 'EXPERIÊNCIA'} />
            <View style={styles.timelineWrap}>
              {experiences.map((exp, idx) => (
                <View key={idx} style={styles.timelineItem}>
                  <View style={styles.timelineBullet} />
                  <View>
                    <View style={styles.entryHeader}>
                      <View style={{ flex: 1 }}>
                        {exp.role ? <Text style={styles.role}>{exp.role}</Text> : null}
                        {exp.company ? <Text style={styles.company}>{exp.company}</Text> : null}
                      </View>
                      <Text style={styles.date}>
                        {formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.current, l, settings?.sections?.dateFormat)}
                      </Text>
                    </View>
                    {exp.activities ? <Text style={styles.subText}>{exp.activities}</Text> : null}
                    {exp.results ? (
                      <View style={{ marginTop: 3 }}>
                        {splitLines(exp.results).map((line, li) => (
                          <Text key={li} style={styles.bulletText}>• {line}</Text>
                        ))}
                      </View>
                    ) : null}
                    {exp.tech ? <Text style={{ ...styles.metaText, marginTop: 4 }}>{exp.tech}</Text> : null}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null;

      case 'academic_education':
        return education.length > 0 ? (
          <View style={styles.section} key={sectionKey}>
            <SectionTitle label={l === 'en' ? 'EDUCATION' : l === 'es' ? 'EDUCACIÓN' : 'EDUCAÇÃO'} />
            <View style={styles.timelineWrap}>
              {education.map((edu, idx) => (
                <View key={idx} style={styles.timelineItem}>
                  <View style={styles.timelineBullet} />
                  <View>
                    <View style={styles.entryHeader}>
                      <View style={{ flex: 1 }}>
                        {edu.course ? <Text style={styles.role}>{edu.course}</Text> : null}
                        {(() => {
                          const typeLabel = translateLabel(edu.type, lang);
                          const statusLabel = translateLabel(edu.status, lang);
                          const meta = [edu.institution, typeLabel, statusLabel].filter(Boolean).join(' • ');
                          return meta ? <Text style={styles.metaText}>{meta}</Text> : null;
                        })()}
                      </View>
                      <Text style={styles.date}>
                        {formatDateRange(edu.startMonth, edu.startYear, edu.endMonth, edu.endYear, edu.current, l, settings?.sections?.dateFormat)}
                      </Text>
                    </View>
                    {edu.description ? <Text style={styles.subText}>{edu.description}</Text> : null}
                    {edu.achievements ? (
                      <View style={{ marginTop: 3 }}>
                        {splitLines(edu.achievements).map((line, li) => (
                          <Text key={li} style={styles.bulletText}>• {line}</Text>
                        ))}
                      </View>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null;

      case 'technical_skills':
        return skills ? (
          <View style={styles.section} key={sectionKey}>
            <SectionTitle label={l === 'en' ? 'SKILLS' : l === 'es' ? 'HABILIDADES' : 'COMPETÊNCIAS'} />
            <Text style={styles.paragraph}>{skills}</Text>
          </View>
        ) : null;

      case 'languages':
        return languages && languages.length > 0 ? (
          <View style={styles.section} key={sectionKey}>
            <SectionTitle label={l === 'en' ? 'LANGUAGES' : l === 'es' ? 'IDIOMAS' : 'IDIOMAS'} />
            {languages.map((langItem, li) => (
              <View key={li} style={styles.langRow}>
                <Text style={styles.langName}>{langItem.name}</Text>
                <View style={styles.langDivider} />
                <Text style={styles.langLevel}>{translateLanguageLevel(langItem.level, lang)}</Text>
              </View>
            ))}
          </View>
        ) : null;

      case 'certifications':
        return certifications && certifications.length > 0 ? (
          <View style={styles.section} key={sectionKey}>
            <SectionTitle label={l === 'en' ? 'CERTIFICATIONS' : l === 'es' ? 'CERTIFICACIONES' : 'CERTIFICAÇÕES'} />
            {certifications.map((cert, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.role}>{cert.name}</Text>
                  <Text style={styles.date}>{cert.completionDate}</Text>
                </View>
                {cert.issuer ? <Text style={styles.metaText}>{cert.issuer}</Text> : null}
                {cert.description ? <Text style={{ ...styles.subText, marginTop: 2 }}>{cert.description}</Text> : null}
                {cert.validationLink ? <Link src={cert.validationLink} style={styles.link}>{cert.validationLink}</Link> : null}
              </View>
            ))}
          </View>
        ) : null;

      case 'projects':
        return projects && projects.length > 0 ? (
          <View style={styles.section} key={sectionKey}>
            <SectionTitle label={l === 'en' ? 'PROJECTS' : l === 'es' ? 'PROYECTOS' : 'PROJETOS'} />
            {projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.role}>{proj.name}</Text>
                  <Text style={styles.date}>{proj.year}</Text>
                </View>
                {proj.tech ? <Text style={styles.metaText}>{proj.tech}</Text> : null}
                {proj.description ? <Text style={{ ...styles.subText, marginTop: 2 }}>{proj.description}</Text> : null}
                {proj.impact ? (
                  <View style={{ marginTop: 3 }}>
                    {splitLines(proj.impact).map((line, li) => (
                      <Text key={li} style={styles.bulletText}>• {line}</Text>
                    ))}
                  </View>
                ) : null}
                {proj.link ? <Link src={proj.link} style={styles.link}>{proj.link}</Link> : null}
                {proj.sourceCode ? <Link src={proj.sourceCode} style={styles.link}>{proj.sourceCode}</Link> : null}
              </View>
            ))}
          </View>
        ) : null;

      case 'volunteer':
        return volunteers && volunteers.length > 0 ? (
          <View style={styles.section} key={sectionKey}>
            <SectionTitle label={l === 'en' ? 'VOLUNTEER' : l === 'es' ? 'VOLUNTARIADO' : 'VOLUNTARIADO'} />
            <View style={styles.timelineWrap}>
              {volunteers.map((vol, i) => (
                <View key={i} style={styles.timelineItem}>
                  <View style={styles.timelineBullet} />
                  <View>
                    <View style={styles.entryHeader}>
                      <View style={{ flex: 1 }}>
                        {vol.role ? <Text style={styles.role}>{vol.role}</Text> : null}
                        {vol.organization ? <Text style={styles.company}>{vol.organization}</Text> : null}
                      </View>
                      <Text style={styles.date}>
                        {formatDateRange(vol.startMonth, vol.startYear, vol.endMonth, vol.endYear, vol.current, l, settings?.sections?.dateFormat)}
                      </Text>
                    </View>
                    {vol.description ? <Text style={styles.subText}>{vol.description}</Text> : null}
                    {vol.impact ? (
                      <View style={{ marginTop: 3 }}>
                        {splitLines(vol.impact).map((line, li) => (
                          <Text key={li} style={styles.bulletText}>• {line}</Text>
                        ))}
                      </View>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
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
              <SectionTitle label={section.title || (l === 'en' ? 'CUSTOM SECTION' : l === 'es' ? 'SECCIÓN PERSONALIZADA' : 'SECÇÃO PERSONALIZADA')} />
              <View style={styles.timelineWrap}>
                {meaningfulFields.map((field, idx) => (
                  <View key={field.id || idx} style={styles.timelineItem}>
                    <View style={styles.timelineBullet} />
                    <View>
                      {(field.label || field.subtitle || field.startYear || field.endYear || field.startMonth || field.endMonth || field.current) ? (
                        <View style={styles.entryHeader}>
                          <View style={{ flex: 1 }}>
                            {field.label ? <Text style={styles.role}>{field.label}</Text> : null}
                            {field.subtitle ? <Text style={styles.metaText}>{field.subtitle}</Text> : null}
                          </View>
                          <Text style={styles.date}>
                            {formatDateRange(field.startMonth, field.startYear, field.endMonth, field.endYear, field.current, l, settings?.sections?.dateFormat)}
                          </Text>
                        </View>
                      ) : null}
                      {field.value ? (
                        <Text style={{ ...styles.subText, ...(field.centerValue ? styles.centerText : {}) }}>
                          {field.value}
                        </Text>
                      ) : null}
                      {field.bullets ? (
                        <View style={{ marginTop: 3 }}>
                          {splitLines(field.bullets).map((line, li) => (
                            <Text key={li} style={styles.bulletText}>• {line}</Text>
                          ))}
                        </View>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        }
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{personalInfo?.name || 'YOUR NAME'}</Text>
            {personalInfo?.desiredRole ? <Text style={styles.title}>{personalInfo.desiredRole}</Text> : null}
            {contactItems.length > 0 ? (
              <View style={styles.contactRow}>
                {contactItems.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <Text style={styles.contactItem}>
                      <Text style={styles.contactLabel}>{item.label}:</Text> {item.value}
                    </Text>
                    {idx < contactItems.length - 1 ? <Text style={styles.contactSeparator}>|</Text> : null}
                  </React.Fragment>
                ))}
              </View>
            ) : null}
            {links && links.length > 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                {links.map((lnk, i) => (
                  <Link key={i} src={getSocialUrl(lnk.type, lnk.value)} style={styles.link}>
                    {lnk.hideLinkLabel ? lnk.value : `${lnk.customName || lnk.type}: ${lnk.value}`}
                  </Link>
                ))}
              </View>
            ) : null}
          </View>
          {photoSrc ? (
            <View style={styles.photoFrame}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={photoSrc} style={styles.photoImage} />
            </View>
          ) : null}
        </View>

        {order.map((sectionKey) => renderSection(sectionKey))}
      </Page>
    </Document>
  );
}
