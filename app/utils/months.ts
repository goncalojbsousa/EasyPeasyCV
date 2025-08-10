// Shared month utilities (EN/PT/ES)
// Centralizes month constants, normalization and translation helpers

export const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] as const;
export const MONTHS_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'] as const;
export const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'] as const;

export type EnMonth = typeof MONTHS_EN[number];
export type PtMonth = typeof MONTHS_PT[number];
export type EsMonth = typeof MONTHS_ES[number];

// Return the 0-11 index for a month string in any supported language; -1 if not found
export function monthIndex(m?: string): number {
  if (!m) return -1;
  const iEn = MONTHS_EN.indexOf(m as EnMonth);
  if (iEn >= 0) return iEn;
  const iPt = MONTHS_PT.indexOf(m as PtMonth);
  if (iPt >= 0) return iPt;
  const iEs = MONTHS_ES.indexOf(m as EsMonth);
  return iEs;
}

// Normalize to EN month literal when possible
export function toEN(m?: string): EnMonth | undefined {
  const i = monthIndex(m);
  return i >= 0 ? MONTHS_EN[i] : undefined;
}

// Given a month index (0-11), return i18n key suffix
export function monthKeyByIndex(i: number): string | undefined {
  const keys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'] as const;
  return i >= 0 && i < 12 ? keys[i] : undefined;
}

// Translate a month using a provided t() function from LanguageContext
export function getTranslatedMonthWithT(t: (key: string) => string, month?: string): string {
  const i = monthIndex(month);
  if (i < 0) return month || '';
  const key = monthKeyByIndex(i);
  return key ? t(`month.${key}`) : (month || '');
}

// Translate month to target language literal (pt/en/es)
export function translateMonthForLang(month: string, lang: 'pt' | 'en' | 'es'): string {
  const i = monthIndex(month);
  if (i === -1) return month;
  if (lang === 'en') return MONTHS_EN[i];
  if (lang === 'es') return MONTHS_ES[i];
  return MONTHS_PT[i];
}
