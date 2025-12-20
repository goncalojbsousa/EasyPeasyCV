import { StyleSheet } from '@react-pdf/renderer';
import { CvRenderSettings, CvColor } from '../types/cv';
import { getColorTheme } from './color-themes';
import { cmToPt } from './template-helpers';

export type PdfTextAlign = 'left' | 'right' | 'center' | 'justify';

export interface DensityMultipliers {
  margin: number;
  spacing: number;
  lineHeight: number;
  fontSize: number;
}

export interface ComputedMetrics {
  margins: { top: number; right: number; bottom: number; left: number };
  sectionSpacing: number;
  lineSpacing: number;
  finalScale: number;
  singlePageMult: number;
  densityMult: DensityMultipliers;
  textAlign: PdfTextAlign;
  fontFamily: string;
  sectionTitleColor: string;
  sectionTitleSize: number;
  accent: string;
  linkColor: string;
}

export const DENSITY_PRESETS: Record<'compact' | 'normal' | 'spacious', DensityMultipliers> = {
  compact: { margin: 0.7, spacing: 0.6, lineHeight: 0.9, fontSize: 0.95 },
  normal: { margin: 1, spacing: 1, lineHeight: 1, fontSize: 1 },
  spacious: { margin: 1.3, spacing: 1.5, lineHeight: 1.1, fontSize: 1 },
};

export function computeMetrics(settings?: CvRenderSettings, color: CvColor = 'blue'): ComputedMetrics {
  const s = settings;
  const hyperlinkBlue = '#2563eb';
  const scale = s?.layout.textScale || 1;
  const familyRaw = s?.layout.fontFamily || 'Helvetica';
  const fontFamily = s?.layout.fontFamily === 'Custom' 
    ? (s?.layout.customFont?.name || 'Helvetica') 
    : (familyRaw === 'Arial' ? 'Helvetica' : familyRaw);
  
  const density = s?.layout.density || 'normal';
  const densityMult = DENSITY_PRESETS[density];
  const singlePageMult = s?.layout.singlePageMode ? 0.85 : 1;
  
  const baseMargins = s?.layout.marginsCm ?? { top: 1.5, right: 1.5, bottom: 1.5, left: 1.5 };
  const margins = {
    top: baseMargins.top * densityMult.margin * singlePageMult,
    right: baseMargins.right * densityMult.margin * singlePageMult,
    bottom: baseMargins.bottom * densityMult.margin * singlePageMult,
    left: baseMargins.left * densityMult.margin * singlePageMult,
  };
  
  const sectionSpacing = (s?.layout.sectionSpacingPx ?? 12) * densityMult.spacing * singlePageMult;
  const lineSpacing = (s?.layout.lineSpacing ?? 1.4) * densityMult.lineHeight;
  const finalScale = scale * densityMult.fontSize * singlePageMult;
  const textAlign: PdfTextAlign = (s?.layout.textAlignment as PdfTextAlign) || 'left';
  
  const sectionTitleColor = s?.sections?.titleColor || getColorTheme(color).primary;
  const sectionTitleSize = (s?.sections?.titleFontSize ?? 12) * finalScale;
  const accent = getColorTheme(color).primary;
  const linkColor = s?.sections?.useThemeColorForLinks ? accent : hyperlinkBlue;
  
  return {
    margins,
    sectionSpacing,
    lineSpacing,
    finalScale,
    singlePageMult,
    densityMult,
    textAlign,
    fontFamily,
    sectionTitleColor,
    sectionTitleSize,
    accent,
    linkColor,
  };
}

export function getPhotoSize(aspectRatio?: '1:1' | '3:4' | '4:3'): { width: number; height: number } {
  const ar = aspectRatio || '1:1';
  if (ar === '1:1') return { width: 90, height: 90 };
  if (ar === '3:4') return { width: 90, height: 120 };
  if (ar === '4:3') return { width: 120, height: 90 };
  return { width: 90, height: 90 };
}

export function buildCommonStyles(metrics: ComputedMetrics, settings?: CvRenderSettings) {
  const { margins, lineSpacing, finalScale, fontFamily, singlePageMult } = metrics;
  
  return StyleSheet.create({
    page: {
      paddingTop: cmToPt(margins.top),
      paddingRight: cmToPt(margins.right),
      paddingBottom: cmToPt(margins.bottom),
      paddingLeft: cmToPt(margins.left),
      fontSize: 11 * finalScale,
      fontFamily,
      lineHeight: lineSpacing,
    },
    section: {
      marginBottom: metrics.sectionSpacing,
    },
    sectionTitle: {
      fontSize: metrics.sectionTitleSize,
      fontWeight: 'bold',
      letterSpacing: 1.2,
      color: metrics.sectionTitleColor,
      marginBottom: 6 * singlePageMult,
    },
    name: {
      fontSize: (settings?.header.nameFontSize ?? 24) * finalScale,
      fontWeight: settings?.header.nameFontWeight === 'heavy' ? 800 : settings?.header.nameFontWeight === 'bold' ? 700 : 500,
      color: settings?.header.nameColor || '#000000',
      marginBottom: 8 * singlePageMult,
    },
    title: {
      fontSize: 12 * finalScale,
      color: '#000000',
      marginBottom: 6 * singlePageMult,
      textTransform: settings?.header.titleStyle === 'uppercase' ? 'uppercase' : 'none',
      fontStyle: settings?.header.titleStyle === 'italic' ? 'italic' : 'normal',
    },
    divider: {
      width: '100%',
      borderBottomWidth: (settings?.header.dividerThickness ?? 1) as number,
      borderBottomColor: '#e5e7eb',
      borderStyle: 'solid',
      marginVertical: 6 * singlePageMult,
    },
    summaryText: {
      textAlign: metrics.textAlign,
      marginBottom: 4 * singlePageMult,
      fontSize: 10 * finalScale,
      color: '#000000',
    },
    expItem: {
      marginBottom: 8 * singlePageMult,
    },
    expHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    expLeft: {
      flexDirection: 'column',
      flex: 1,
      paddingRight: 6,
    },
    expRight: {
      width: 100,
      textAlign: 'right',
      color: '#000000',
      fontSize: 10 * finalScale,
    },
    jobRole: {
      fontSize: 11 * finalScale,
      fontWeight: 'bold',
    },
    company: {
      fontSize: 10 * finalScale,
      color: '#000000',
      marginBottom: 4 * singlePageMult,
    },
    bullets: {
      marginLeft: 8,
      color: '#000000',
      fontSize: 10 * finalScale,
      textAlign: metrics.textAlign,
    },
    activitiesText: {
      marginLeft: 0,
      color: '#000000',
      fontSize: 10 * finalScale,
      textAlign: metrics.textAlign,
    },
  });
}
