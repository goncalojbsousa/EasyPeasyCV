  "use client";

  import { PersonalInfo, Link } from '../../types/cv';
  import { GripVertical, X, Plus } from 'lucide-react';
import { FormSection } from '../ui/form_section';
import { FormField } from '../ui/form_field';
import { Icons } from '../ui/icons';
import { useLanguage } from '../../contexts/LanguageContext';
  import { useCallback, useMemo, useState } from 'react';
  import { SelectMenu } from '../ui/select_menu';

import { SortableList, DragHandle } from '../dnd/sortable_list';
/**
 * Props interface for the PersonalInformation component
 */
interface PersonalInformationProps {
  /** Array of social media and portfolio links */
  links: Link[];
  /** Personal information data */
  personalInfo: PersonalInfo;
  /** Handler for adding new link */
  onAddLink: (type: string, value: string, customName?: string) => void;
  /** Handler for removing link */
  onRemoveLink: (idx: number) => void;
  /** Handler for updating personal information fields */
  onPersonalInfoChange: (field: string, value: string) => void;
  /** Handler for reordering links */
  onReorderLinks?: (fromIndex: number, toIndex: number) => void;
  /** Handler for toggling link label visibility */
  onToggleLinkLabel?: (idx: number) => void;
  /** Validation error states for form fields */
  validationErrors?: {[key: string]: boolean};
  /** Whether to show validation errors */
  showValidationErrors?: boolean;
}

/**
 * Available link types with their URL prefixes
 */
const LINK_TYPES = [
  { label: 'LinkedIn', prefix: 'linkedin.com/in/' },
  { label: 'GitHub', prefix: 'github.com/' },
  { label: 'GitLab', prefix: 'gitlab.com/' },
  { label: 'Portfolio', prefix: '' },
  { label: 'Other', prefix: '' },
];

/**
 * Available country codes
 */
const COUNTRY_CODES = [
  // Europe
  { label: 'Portugal (+351)', value: 'Portugal (+351)' },
  { label: 'Espanha (+34)', value: 'Espanha (+34)' },
  { label: 'França (+33)', value: 'França (+33)' },
  { label: 'Alemanha (+49)', value: 'Alemanha (+49)' },
  { label: 'Itália (+39)', value: 'Itália (+39)' },
  { label: 'Irlanda (+353)', value: 'Irlanda (+353)' },
  { label: 'Reino Unido (+44)', value: 'Reino Unido (+44)' },
  { label: 'Países Baixos (+31)', value: 'Países Baixos (+31)' },
  { label: 'Bélgica (+32)', value: 'Bélgica (+32)' },
  { label: 'Luxemburgo (+352)', value: 'Luxemburgo (+352)' },
  { label: 'Suíça (+41)', value: 'Suíça (+41)' },
  { label: 'Áustria (+43)', value: 'Áustria (+43)' },
  { label: 'Suécia (+46)', value: 'Suécia (+46)' },
  { label: 'Noruega (+47)', value: 'Noruega (+47)' },
  { label: 'Dinamarca (+45)', value: 'Dinamarca (+45)' },
  { label: 'Finlândia (+358)', value: 'Finlândia (+358)' },
  { label: 'Polónia (+48)', value: 'Polónia (+48)' },
  { label: 'República Checa (+420)', value: 'República Checa (+420)' },
  { label: 'Eslováquia (+421)', value: 'Eslováquia (+421)' },
  { label: 'Hungria (+36)', value: 'Hungria (+36)' },
  { label: 'Roménia (+40)', value: 'Roménia (+40)' },
  { label: 'Bulgária (+359)', value: 'Bulgária (+359)' },
  { label: 'Grécia (+30)', value: 'Grécia (+30)' },
  { label: 'Croácia (+385)', value: 'Croácia (+385)' },
  { label: 'Eslovénia (+386)', value: 'Eslovénia (+386)' },
  { label: 'Sérvia (+381)', value: 'Sérvia (+381)' },
  { label: 'Bósnia e Herzegovina (+387)', value: 'Bósnia e Herzegovina (+387)' },
  { label: 'Macedónia do Norte (+389)', value: 'Macedónia do Norte (+389)' },
  { label: 'Montenegro (+382)', value: 'Montenegro (+382)' },
  { label: 'Kosovo (+383)', value: 'Kosovo (+383)' },
  { label: 'Albânia (+355)', value: 'Albânia (+355)' },
  { label: 'Estónia (+372)', value: 'Estónia (+372)' },
  { label: 'Letónia (+371)', value: 'Letónia (+371)' },
  { label: 'Lituânia (+370)', value: 'Lituânia (+370)' },
  { label: 'Islândia (+354)', value: 'Islândia (+354)' },
  { label: 'Malta (+356)', value: 'Malta (+356)' },
  { label: 'Chipre (+357)', value: 'Chipre (+357)' },
  { label: 'Moldávia (+373)', value: 'Moldávia (+373)' },
  { label: 'Bielorrússia (+375)', value: 'Bielorrússia (+375)' },
  { label: 'Ucrânia (+380)', value: 'Ucrânia (+380)' },
  { label: 'Rússia (+7)', value: 'Rússia (+7)' },
  { label: 'Geórgia (+995)', value: 'Geórgia (+995)' },
  { label: 'Arménia (+374)', value: 'Arménia (+374)' },
  { label: 'Azerbaijão (+994)', value: 'Azerbaijão (+994)' },
  { label: 'Andorra (+376)', value: 'Andorra (+376)' },
  { label: 'Mónaco (+377)', value: 'Mónaco (+377)' },
  { label: 'São Marino (+378)', value: 'São Marino (+378)' },
  { label: 'Liechtenstein (+423)', value: 'Liechtenstein (+423)' },
  { label: 'Gibraltar (+350)', value: 'Gibraltar (+350)' },
  
  // Americas
  { label: 'Estados Unidos (+1)', value: 'Estados Unidos (+1)' },
  { label: 'Canadá (+1)', value: 'Canadá (+1)' },
  { label: 'México (+52)', value: 'México (+52)' },
  { label: 'Brasil (+55)', value: 'Brasil (+55)' },
  { label: 'Argentina (+54)', value: 'Argentina (+54)' },
  { label: 'Chile (+56)', value: 'Chile (+56)' },
  { label: 'Colômbia (+57)', value: 'Colômbia (+57)' },
  { label: 'Peru (+51)', value: 'Peru (+51)' },
  { label: 'Uruguai (+598)', value: 'Uruguai (+598)' },
  { label: 'Paraguai (+595)', value: 'Paraguai (+595)' },
  { label: 'Bolívia (+591)', value: 'Bolívia (+591)' },
  { label: 'Venezuela (+58)', value: 'Venezuela (+58)' },
  { label: 'Equador (+593)', value: 'Equador (+593)' },
  { label: 'Costa Rica (+506)', value: 'Costa Rica (+506)' },
  { label: 'Panamá (+507)', value: 'Panamá (+507)' },
  { label: 'Guatemala (+502)', value: 'Guatemala (+502)' },
  { label: 'Honduras (+504)', value: 'Honduras (+504)' },
  { label: 'El Salvador (+503)', value: 'El Salvador (+503)' },
  { label: 'Nicarágua (+505)', value: 'Nicarágua (+505)' },
  { label: 'República Dominicana (+1)', value: 'República Dominicana (+1)' },
  { label: 'Cuba (+53)', value: 'Cuba (+53)' },
  
  // Africa
  { label: 'África do Sul (+27)', value: 'África do Sul (+27)' },
  { label: 'Marrocos (+212)', value: 'Marrocos (+212)' },
  { label: 'Argélia (+213)', value: 'Argélia (+213)' },
  { label: 'Tunísia (+216)', value: 'Tunísia (+216)' },
  { label: 'Egito (+20)', value: 'Egito (+20)' },
  { label: 'Nigéria (+234)', value: 'Nigéria (+234)' },
  { label: 'Gana (+233)', value: 'Gana (+233)' },
  { label: 'Quénia (+254)', value: 'Quénia (+254)' },
  { label: 'Etiópia (+251)', value: 'Etiópia (+251)' },
  { label: 'Tanzânia (+255)', value: 'Tanzânia (+255)' },
  { label: 'Angola (+244)', value: 'Angola (+244)' },
  { label: 'Moçambique (+258)', value: 'Moçambique (+258)' },
  { label: 'Cabo Verde (+238)', value: 'Cabo Verde (+238)' },
  { label: 'Guiné-Bissau (+245)', value: 'Guiné-Bissau (+245)' },
  { label: 'São Tomé e Príncipe (+239)', value: 'São Tomé e Príncipe (+239)' },
  { label: 'Ilha Reunião (+262)', value: 'Ilha Reunião (+262)' },
  { label: 'Maurícia (+230)', value: 'Maurícia (+230)' },
  { label: 'Seychelles (+248)', value: 'Seychelles (+248)' },
  
  // Asia & Middle East
  { label: 'Emirados Árabes Unidos (+971)', value: 'Emirados Árabes Unidos (+971)' },
  { label: 'Arábia Saudita (+966)', value: 'Arábia Saudita (+966)' },
  { label: 'Catar (+974)', value: 'Catar (+974)' },
  { label: 'Kuwait (+965)', value: 'Kuwait (+965)' },
  { label: 'Omã (+968)', value: 'Omã (+968)' },
  { label: 'Bahrein (+973)', value: 'Bahrein (+973)' },
  { label: 'Israel (+972)', value: 'Israel (+972)' },
  { label: 'Líbano (+961)', value: 'Líbano (+961)' },
  { label: 'Jordânia (+962)', value: 'Jordânia (+962)' },
  { label: 'Índia (+91)', value: 'Índia (+91)' },
  { label: 'China (+86)', value: 'China (+86)' },
  { label: 'Japão (+81)', value: 'Japão (+81)' },
  { label: 'Coreia do Sul (+82)', value: 'Coreia do Sul (+82)' },
  { label: 'Singapura (+65)', value: 'Singapura (+65)' },
  { label: 'Malásia (+60)', value: 'Malásia (+60)' },
  { label: 'Indonésia (+62)', value: 'Indonésia (+62)' },
  { label: 'Filipinas (+63)', value: 'Filipinas (+63)' },
  { label: 'Tailândia (+66)', value: 'Tailândia (+66)' },
  { label: 'Vietname (+84)', value: 'Vietname (+84)' },
  { label: 'Taiwan (+886)', value: 'Taiwan (+886)' },
  { label: 'Hong Kong (+852)', value: 'Hong Kong (+852)' },
  { label: 'Macau (+853)', value: 'Macau (+853)' },
  { label: 'Cazaquistão (+7)', value: 'Cazaquistão (+7)' },
  { label: 'Paquistão (+92)', value: 'Paquistão (+92)' },
  { label: 'Bangladesh (+880)', value: 'Bangladesh (+880)' },
  { label: 'Sri Lanka (+94)', value: 'Sri Lanka (+94)' },
  { label: 'Nepal (+977)', value: 'Nepal (+977)' },
  
  // Oceania
  { label: 'Austrália (+61)', value: 'Austrália (+61)' },
  { label: 'Nova Zelândia (+64)', value: 'Nova Zelândia (+64)' },
];

/**
 * Personal Information component
 * Manages personal details, contact information, and social media links
 * @param links - Array of social media and portfolio links
 * @param personalInfo - Personal information data
 * @param onAddLink - Function to add new link
 * @param onRemoveLink - Function to remove link
 * @param onPersonalInfoChange - Function to handle personal info field updates
 * @param onReorderLinks - Function to reorder links
 * @param validationErrors - Object containing validation error states
 * @param showValidationErrors - Whether to display validation errors
 * @returns JSX element representing the personal information form section
 */
export function PersonalInformation({
  links,
  personalInfo,
  onAddLink,
  onRemoveLink,
  onPersonalInfoChange,
  onReorderLinks,
  onToggleLinkLabel,
  validationErrors = {},
  showValidationErrors = true
}: PersonalInformationProps) {
  const { t, language } = useLanguage();
  const [newLinkType, setNewLinkType] = useState('LinkedIn');
  const [newLinkValue, setNewLinkValue] = useState('');
  const [newLinkCustomName, setNewLinkCustomName] = useState('');
  const getSearchPlaceholder = () => {
    const s = t('search.placeholder');
    if (s && s !== 'search.placeholder') return s;
    if (language === 'pt') return 'Procurar...';
    if (language === 'es') return 'Buscar...';
    return 'Search...';
  };


  const handleAddLink = () => {
    if (newLinkValue.trim()) {
  // Create the full URL with prefix for the new link
      const prefix = getLinkPrefix(newLinkType);
      const fullValue = prefix ? `${prefix}${newLinkValue}` : newLinkValue;
      
  // Add the link with the correct type, value, and custom name if applicable
      onAddLink(newLinkType, fullValue, newLinkType === 'Other' ? newLinkCustomName.trim() : undefined);
      
  // Reset the new link form fields
      setNewLinkValue('');
      setNewLinkCustomName('');
    }
  };

  const getLinkPrefix = (type: string) => {
    const linkType = LINK_TYPES.find(t => t.label === type);
    return linkType?.prefix || '';
  };

  const getLinkPlaceholder = (type: string) => {
    switch (type) {
      case 'LinkedIn':
        return t('link.placeholder.linkedin');
      case 'GitHub':
        return t('link.placeholder.github');
      case 'GitLab':
        return t('link.placeholder.gitlab');
      case 'Portfolio':
        return t('link.placeholder.portfolio');
      case 'Other':
        return t('link.placeholder.other');
      default:
        return t('link.placeholder.linkedin');
    }
  };

  const translateLinkType = useCallback((type: string, customName?: string) => {
    // If it's "Other" type and has a custom name, return the custom name
    if (type === 'Other' && customName) {
      return customName;
    }
    
    switch (type) {
      case 'LinkedIn':
        return t('link.type.linkedin');
      case 'GitHub':
        return t('link.type.github');
      case 'GitLab':
        return t('link.type.gitlab');
      case 'Portfolio':
        return t('link.type.portfolio');
      case 'Other':
        return t('link.type.other');
      default:
        return type;
    }
  }, [t]);

  // Endonym (native) name for each country regardless of site language
  const getCountryDisplayName = useCallback((label: string) => {
    const base = label.replace(/\s*\(\+.*\)$/, '').trim();
    const endonym: Record<string, string> = {
      // Europe (selected common endonyms)
      'Portugal': 'Portugal',
      'Espanha': 'España',
      'França': 'France',
      'Alemanha': 'Deutschland',
      'Itália': 'Italia',
      'Irlanda': 'Ireland',
      'Reino Unido': 'United Kingdom',
      'Países Baixos': 'Nederland',
      'Bélgica': 'Belgium',
      'Luxemburgo': 'Lëtzebuerg',
      'Suíça': 'Schweiz',
      'Áustria': 'Österreich',
      'Suécia': 'Sverige',
      'Noruega': 'Norge',
      'Dinamarca': 'Danmark',
      'Finlândia': 'Suomi',
      'Polónia': 'Polska',
      'República Checa': 'Česko',
      'Eslováquia': 'Slovensko',
      'Hungria': 'Magyarország',
      'Roménia': 'România',
      'Bulgária': 'България',
      'Grécia': 'Ελλάδα',
      'Croácia': 'Hrvatska',
      'Eslovénia': 'Slovenija',
      'Sérvia': 'Србија',
      'Bósnia e Herzegovina': 'Bosna i Hercegovina',
      'Macedónia do Norte': 'Северна Македонија',
      'Montenegro': 'Crna Gora',
      'Kosovo': 'Kosovë',
      'Albânia': 'Shqipëria',
      'Estónia': 'Eesti',
      'Letónia': 'Latvija',
      'Lituânia': 'Lietuva',
      'Islândia': 'Ísland',
      'Malta': 'Malta',
      'Chipre': 'Κύπρος',
      'Moldávia': 'Moldova',
      'Bielorrússia': 'Беларусь',
      'Ucrânia': 'Україна',
      'Rússia': 'Россия',
      'Geórgia': 'საქართველო',
      'Arménia': 'Հայաստան',
      'Azerbaijão': 'Azərbaycan',
      'Andorra': 'Andorra',
      'Mónaco': 'Monaco',
      'São Marino': 'San Marino',
      'Liechtenstein': 'Liechtenstein',
      'Gibraltar': 'Gibraltar',
      // Americas
      'Estados Unidos': 'United States',
      'Canadá': 'Canada',
      'México': 'México',
      'Brasil': 'Brasil',
      'Argentina': 'Argentina',
      'Chile': 'Chile',
      'Colômbia': 'Colombia',
      'Peru': 'Perú',
      'Uruguai': 'Uruguay',
      'Paraguai': 'Paraguay',
      'Bolívia': 'Bolivia',
      'Venezuela': 'Venezuela',
      'Equador': 'Ecuador',
      'Costa Rica': 'Costa Rica',
      'Panamá': 'Panamá',
      'Guatemala': 'Guatemala',
      'Honduras': 'Honduras',
      'El Salvador': 'El Salvador',
      'Nicarágua': 'Nicaragua',
      'República Dominicana': 'República Dominicana',
      'Cuba': 'Cuba',
      // Africa
      'África do Sul': 'South Africa',
      'Marrocos': 'المغرب',
      'Argélia': 'الجزائر',
      'Tunísia': 'تونس',
      'Egito': 'مصر',
      'Nigéria': 'Nigeria',
      'Gana': 'Ghana',
      'Quénia': 'Kenya',
      'Etiópia': 'ኢትዮጵያ',
      'Tanzânia': 'Tanzania',
      'Angola': 'Angola',
      'Moçambique': 'Moçambique',
      'Cabo Verde': 'Cabo Verde',
      'Guiné-Bissau': 'Guiné-Bissau',
      'São Tomé e Príncipe': 'São Tomé e Príncipe',
      'Ilha Reunião': 'La Réunion',
      'Maurícia': 'Maurice',
      'Seychelles': 'Seychelles',
      // Asia & Middle East
      'Emirados Árabes Unidos': 'الإمارات العربية المتحدة',
      'Arábia Saudita': 'السعودية',
      'Catar': 'قطر',
      'Kuwait': 'الكويت',
      'Omã': 'عُمان',
      'Bahrein': 'البحرين',
      'Israel': 'ישראל',
      'Líbano': 'لبنان',
      'Jordânia': 'الأردن',
      'Índia': 'भारत',
      'China': '中国',
      'Japão': '日本',
      'Coreia do Sul': '대한민국',
      'Singapura': 'Singapore',
      'Malásia': 'Malaysia',
      'Indonésia': 'Indonesia',
      'Filipinas': 'Pilipinas',
      'Tailândia': 'ประเทศไทย',
      'Vietname': 'Việt Nam',
      'Taiwan': '台灣',
      'Hong Kong': '香港',
      'Macau': '澳門',
      'Cazaquistão': 'Қазақстан',
      'Paquistão': 'پاکستان',
      'Bangladesh': 'বাংলাদেশ',
      'Sri Lanka': 'ශ්‍රී ලංකාව',
      'Nepal': 'नेपाल',
      // Oceania
      'Austrália': 'Australia',
      'Nova Zelândia': 'Aotearoa New Zealand',
    };
    return endonym[base] || base;
  }, []);

  // Drag & drop handled by SortableList

  const countryOptions = useMemo(() => {
    return COUNTRY_CODES
      .map((country) => {
        const dial = country.label.match(/\(\+.*\)/)?.[0] || '';
        const name = getCountryDisplayName(country.label);
        const label = `${name} ${dial}`.trim();
        return {
          value: country.value,
          label,
          searchText: `${name} ${dial}`.toLowerCase(),
          sortKey: name,
        };
      })
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(item => ({ value: item.value, label: item.label, searchText: item.searchText }));
  }, [getCountryDisplayName]);

  const linkTypeOptions = useMemo(() => {
    return LINK_TYPES.map((linkType) => ({
      value: linkType.label,
      label: translateLinkType(linkType.label),
    }));
  }, [translateLinkType]);

  return (
    <form className="space-y-8">
      <FormSection title={t('section.personal.info')} icon={Icons.personalInfo}>
        {/* Name and desired role fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
          <FormField label={t('field.full.name')} required>
            <input 
              type="text" 
              placeholder={t('placeholder.full.name')} 
              className={`w-full p-3 sm:p-2 border rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100 ${showValidationErrors && validationErrors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-zinc-600'}`}
              value={personalInfo.name} 
              onChange={e => onPersonalInfoChange('name', e.target.value)}
              data-error={showValidationErrors && validationErrors.name ? "true" : "false"}
            />
          </FormField>
          <FormField label={t(`cvType.field.desired.role`)} required>
            <input 
              type="text" 
              placeholder={t(`cvType.placeholder.desired.role`)} 
              className={`w-full p-2 border rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100 ${showValidationErrors && validationErrors.desiredRole ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-zinc-600'}`}
              value={personalInfo.desiredRole} 
              onChange={e => onPersonalInfoChange('desiredRole', e.target.value)}
              data-error={showValidationErrors && validationErrors.desiredRole ? "true" : "false"}
            />
          </FormField>
        </div>
        
        {/* Postal code and city fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
          <FormField label={t('field.postal.code')}>
            <input 
              type="text" 
              placeholder={t('placeholder.postal.code')} 
              className="w-full p-3 sm:p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100" 
              value={personalInfo.postalCode} 
              onChange={e => onPersonalInfoChange('postalCode', e.target.value)} 
            />
          </FormField>
          <FormField label={t('field.city')}>
            <input 
              type="text" 
              placeholder={t('placeholder.city')} 
              className="w-full p-3 sm:p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100" 
              value={personalInfo.city} 
              onChange={e => onPersonalInfoChange('city', e.target.value)} 
            />
          </FormField>
        </div>
        
        {/* Email, country code, and phone fields */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <FormField label={t('field.email')} required>
            <input 
              type="email" 
              placeholder={t('placeholder.email')} 
              className={`w-full p-3 sm:p-2 border rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100 ${showValidationErrors && validationErrors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-zinc-600'}`}
              value={personalInfo.email} 
              onChange={e => onPersonalInfoChange('email', e.target.value)}
              data-error={showValidationErrors && validationErrors.email ? "true" : "false"}
            />
          </FormField>
          <FormField label={t('field.country.code')}>
            <SelectMenu
              options={countryOptions}
              value={personalInfo.countryCode}
              placeholder={t('select.country')}
              onSelect={(country) => onPersonalInfoChange('countryCode', country)}
              searchable
              searchPlaceholder={getSearchPlaceholder()}
              renderTriggerLabel={(option) => option?.label || t('select.country')}
            />
          </FormField>
          <FormField label={t('field.phone')}>
            <input 
              type="text" 
              placeholder={t('placeholder.phone')} 
              className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100" 
              value={personalInfo.phone} 
              onChange={e => onPersonalInfoChange('phone', e.target.value)} 
            />
          </FormField>
        </div>

        {/* Social media and portfolio links section */}
        <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">{t('field.links.social')}</label>
          
          {/* Display existing links as tags */}
          {links.length > 0 && (
            <div className="mb-4 space-y-2">
              <SortableList
                length={links.length}
                onReorder={(from, to) => onReorderLinks && onReorderLinks(from, to)}
                renderItem={(idx) => {
                  const link = links[idx];
                  const linkType = LINK_TYPES.find(t => t.label === link.type) || LINK_TYPES[0];
                  const displayValue = linkType.prefix && link.value.startsWith('https://www.' + linkType.prefix)
                    ? link.value.replace('https://www.' + linkType.prefix, '')
                    : linkType.prefix && link.value.startsWith('https://' + linkType.prefix)
                    ? link.value.replace('https://' + linkType.prefix, '')
                    : linkType.prefix && link.value.startsWith(linkType.prefix)
                    ? link.value.replace(linkType.prefix, '')
                    : link.value;
                  return (
                    <div 
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm transition-all"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {links.length > 1 && (
                          <DragHandle ariaLabel="Reordenar link" className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors duration-300 flex-shrink-0">
                            <GripVertical className="w-3 h-3" />
                          </DragHandle>
                        )}
                        {!link.hideLinkLabel && (
                          <span className="font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">{translateLinkType(link.type, link.customName)}:</span>
                        )}
                        <span className="text-gray-600 dark:text-gray-400 truncate">{displayValue}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:flex-shrink-0 ml-auto sm:ml-0">
                        {onToggleLinkLabel && (
                          <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                            <input
                              type="checkbox"
                              checked={!!link.hideLinkLabel}
                              onChange={() => onToggleLinkLabel(idx)}
                              className="w-3 h-3 rounded border-gray-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 focus:ring-1"
                            />
                            <span className="whitespace-nowrap">{t('field.link.hide.label')}</span>
                          </label>
                        )}
                        <button
                          type="button"
                          onClick={() => onRemoveLink(idx)}
                          className="text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 flex-shrink-0"
                          aria-label="Remove link"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                }}
              />
            </div>

          )}
          
          {/* Fixed input section for adding new links */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
            {/* Custom name input for "Other" type */}
            {newLinkType === 'Other' && (
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-1">{t('field.link.custom.name')}</label>
                <input
                  type="text"
                  placeholder={t('placeholder.link.custom.name')}
                  value={newLinkCustomName}
                  onChange={(e) => setNewLinkCustomName(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            )}
            {/* Link type selection */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">{t('field.link.type')}</label>
              <SelectMenu
                options={linkTypeOptions}
                value={newLinkType}
                placeholder={t('field.link.type')}
                onSelect={(type) => setNewLinkType(type)}
                renderTriggerLabel={(option) => option?.label || t('field.link.type')}
              />
            </div>
            
            {/* Link URL input with prefix */}
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-1">{t('field.url')}</label>
                <div className="flex">
                  {getLinkPrefix(newLinkType) && (
                    <span className="inline-flex items-center px-2 bg-gray-100 dark:bg-zinc-700 border border-r-0 border-gray-300 dark:border-zinc-600 rounded-l-lg text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{getLinkPrefix(newLinkType)}</span>
                  )}
                  <input
                    type="text"
                    placeholder={getLinkPlaceholder(newLinkType)}
                    value={newLinkValue}
                    onChange={(e) => setNewLinkValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
                    className={`w-full p-2 border border-gray-300 dark:border-zinc-600 ${getLinkPrefix(newLinkType) ? 'rounded-r-lg' : 'rounded-lg'} bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100`}
                  />
                </div>
              </div>
              
              {/* Add link button */}
              <button
                type="button"
                onClick={handleAddLink}
                disabled={!newLinkValue.trim()}
                className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-zinc-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300 shadow-sm flex-shrink-0"
                aria-label="Add link"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </FormSection>
    </form>
  );
}