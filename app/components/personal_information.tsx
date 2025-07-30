'use client';

import { PersonalInfo, Link } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { Icons } from './ui/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';

/**
 * Props interface for the PersonalInformation component
 */
interface PersonalInformationProps {
  /** Array of social media and portfolio links */
  links: Link[];
  /** Personal information data */
  personalInfo: PersonalInfo;
  /** Handler for adding new link */
  onAddLink: (type: string, value: string) => void;
  /** Handler for removing link */
  onRemoveLink: (idx: number) => void;
  /** Handler for updating personal information fields */
  onPersonalInfoChange: (field: string, value: string) => void;
  /** Handler for reordering links */
  onReorderLinks?: (fromIndex: number, toIndex: number) => void;
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
  { label: 'Portugal (+351)', value: 'Portugal (+351)' },
  { label: 'Brasil (+55)', value: 'Brasil (+55)' },
  { label: 'Espanha (+34)', value: 'Espanha (+34)' },
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
  validationErrors = {},
  showValidationErrors = true
}: PersonalInformationProps) {
  const { t, cvType } = useLanguage();
  const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null);
  const [newLinkType, setNewLinkType] = useState('LinkedIn');
  const [newLinkValue, setNewLinkValue] = useState('');
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openDropdownIdx !== null && dropdownRefs.current[openDropdownIdx]) {
        if (!dropdownRefs.current[openDropdownIdx]?.contains(event.target as Node)) {
          setOpenDropdownIdx(null);
        }
      }
      if (openCountryDropdown && countryDropdownRef.current) {
        if (!countryDropdownRef.current.contains(event.target as Node)) {
          setOpenCountryDropdown(false);
        }
      }
    }
    if (openDropdownIdx !== null || openCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownIdx, openCountryDropdown]);

  const handleAddLink = () => {
    if (newLinkValue.trim()) {
      // Create the full URL with prefix
      const prefix = getLinkPrefix(newLinkType);
      const fullValue = prefix ? `${prefix}${newLinkValue}` : newLinkValue;
      
      // Add the link with the correct type and value
      onAddLink(newLinkType, fullValue);
      
      // Reset the form
      setNewLinkValue('');
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

  const translateLinkType = (type: string) => {
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
  };

  const translateCountryCode = (code: string) => {
    switch (code) {
      case 'Portugal (+351)':
        return t('country.portugal');
      case 'Brasil (+55)':
        return t('country.brazil');
      case 'Espanha (+34)':
        return t('country.spain');
      default:
        return code;
    }
  };

  // Drag and drop handlers for links
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Enhanced auto-scroll with variable speed based on distance from edges
    const scrollThreshold = 150; // pixels from edges
    const maxScrollSpeed = 15;
    
    // Horizontal scroll
    if (e.clientX < scrollThreshold) {
      // Scroll left with variable speed
      const distanceFromEdge = scrollThreshold - e.clientX;
      const scrollSpeed = Math.min(maxScrollSpeed, Math.max(5, distanceFromEdge / 10));
      window.scrollBy(-scrollSpeed, 0);
    } else if (e.clientX > window.innerWidth - scrollThreshold) {
      // Scroll right with variable speed
      const distanceFromEdge = e.clientX - (window.innerWidth - scrollThreshold);
      const scrollSpeed = Math.min(maxScrollSpeed, Math.max(5, distanceFromEdge / 10));
      window.scrollBy(scrollSpeed, 0);
    }
    
    // Vertical scroll
    if (e.clientY < scrollThreshold) {
      // Scroll up with variable speed
      const distanceFromEdge = scrollThreshold - e.clientY;
      const scrollSpeed = Math.min(maxScrollSpeed, Math.max(5, distanceFromEdge / 10));
      window.scrollBy(0, -scrollSpeed);
    } else if (e.clientY > window.innerHeight - scrollThreshold) {
      // Scroll down with variable speed
      const distanceFromEdge = e.clientY - (window.innerHeight - scrollThreshold);
      const scrollSpeed = Math.min(maxScrollSpeed, Math.max(5, distanceFromEdge / 10));
      window.scrollBy(0, scrollSpeed);
    }
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorderLinks) {
      onReorderLinks(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

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
            <div className="relative" ref={countryDropdownRef}>
              <button
                type="button"
                className="w-full flex items-center justify-between p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left text-sm text-gray-900 dark:text-gray-100"
                onClick={() => setOpenCountryDropdown(!openCountryDropdown)}
                tabIndex={0}
              >
                <span>{personalInfo.countryCode ? translateCountryCode(personalInfo.countryCode) : t('select.country')}</span>
                <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openCountryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
              </button>
              {openCountryDropdown && (
                <div className="absolute left-0 mt-2 w-full bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-1 z-50 animate-fade-in">
                  {COUNTRY_CODES.map(country => (
                    <button
                      key={country.value}
                      type="button"
                      className={`w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 ${personalInfo.countryCode === country.value ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-400' : ''}`}
                      onClick={() => {
                        onPersonalInfoChange('countryCode', country.value);
                        setOpenCountryDropdown(false);
                      }}
                    >
                      {translateCountryCode(country.label)}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            <div className="mb-4 flex flex-wrap gap-2">
              {links.map((link, idx) => {
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
                    className={`flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-full px-3 py-1 text-sm transition-all relative ${
                      draggedIndex === idx ? 'opacity-50 scale-95' : ''
                    }`}
                    onDragOver={links.length > 1 ? handleDragOver : undefined}
                    onDragEnter={links.length > 1 ? () => handleDragEnter(idx) : undefined}
                    onDrop={links.length > 1 ? (e) => handleDrop(e, idx) : undefined}
                  >
                    {/* Drop indicator - shows between items */}
                    {dragOverIndex === idx && draggedIndex !== idx && (
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-full z-10"></div>
                    )}
                    {links.length > 1 && (
                      <div 
                        className="text-gray-400 dark:text-zinc-500 cursor-move hover:text-gray-600 dark:hover:text-zinc-300 transition-colors duration-300"
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={handleDragOver}
                        onDragEnter={() => handleDragEnter(idx)}
                        onDrop={(e) => handleDrop(e, idx)}
                        onDragEnd={handleDragEnd}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                        </svg>
                      </div>
                    )}
                    <span className="font-medium text-gray-700 dark:text-gray-300">{translateLinkType(link.type)}:</span>
                    <span className="text-gray-600 dark:text-gray-400">{displayValue}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveLink(idx)}
                      className="text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 ml-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Fixed input section for adding new links */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
            {/* Link type selection */}
            <div className="relative" ref={(el) => { dropdownRefs.current[0] = el; }}>
              <label className="block text-sm font-medium mb-1">{t('field.link.type')}</label>
              <button
                type="button"
                className="w-full flex items-center justify-between p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-left text-sm text-gray-900 dark:text-gray-100"
                onClick={() => setOpenDropdownIdx(openDropdownIdx === 0 ? null : 0)}
                tabIndex={0}
              >
                <span>{translateLinkType(newLinkType)}</span>
                <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${openDropdownIdx === 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
              </button>
              {openDropdownIdx === 0 && (
                <div className="absolute left-0 mt-2 w-full bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-1 z-50 animate-fade-in">
                  {LINK_TYPES.map(t => (
                    <button
                      key={t.label}
                      type="button"
                      className={`w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 ${newLinkType === t.label ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-400' : ''}`}
                      onClick={() => {
                        setNewLinkType(t.label);
                        setOpenDropdownIdx(null);
                      }}
                    >
                      {translateLinkType(t.label)}
                    </button>
                  ))}
                </div>
              )}
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
                className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300 shadow-sm flex-shrink-0"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </FormSection>
    </form>
  );
}