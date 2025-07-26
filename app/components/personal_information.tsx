'use client';

import { PersonalInfo, Link } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { Icons } from './ui/icons';

/**
 * Props interface for the PersonalInformation component
 */
interface PersonalInformationProps {
  /** Array of social media and portfolio links */
  links: Link[];
  /** Personal information data */
  personalInfo: PersonalInfo;
  /** Handler for updating link types */
  onLinkTypeChange: (idx: number, newType: string) => void;
  /** Handler for updating link values */
  onLinkValueChange: (idx: number, newValue: string) => void;
  /** Handler for adding new link */
  onAddLink: () => void;
  /** Handler for removing link */
  onRemoveLink: (idx: number) => void;
  /** Handler for updating personal information fields */
  onPersonalInfoChange: (field: string, value: string) => void;
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
  { label: 'Portfolio', prefix: '' },
];

/**
 * PersonalInformation component manages the personal information and links section of the CV form
 * @param links - Array of social media and portfolio links
 * @param personalInfo - Personal information data
 * @param onLinkTypeChange - Function to handle link type updates
 * @param onLinkValueChange - Function to handle link value updates
 * @param onAddLink - Function to add new link
 * @param onRemoveLink - Function to remove link
 * @param onPersonalInfoChange - Function to handle personal info field updates
 * @param validationErrors - Object containing validation error states
 * @param showValidationErrors - Whether to display validation errors
 * @returns JSX element representing the personal information form section
 */
export function PersonalInformation({
  links,
  personalInfo,
  onLinkTypeChange,
  onLinkValueChange,
  onAddLink,
  onRemoveLink,
  onPersonalInfoChange,
  validationErrors = {},
  showValidationErrors = true
}: PersonalInformationProps) {
  return (
    <form className="space-y-8">
      <FormSection title="Informações Pessoais" icon={Icons.personalInfo}>
        {/* Name and desired role fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <FormField label="Nome completo" required>
            <input 
              type="text" 
              placeholder="Ex: Gonçalo Sousa" 
              className={`w-full p-2 border rounded-lg bg-white ${showValidationErrors && validationErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              value={personalInfo.name} 
              onChange={e => onPersonalInfoChange('name', e.target.value)}
              data-error={showValidationErrors && validationErrors.name ? "true" : "false"}
            />
          </FormField>
          <FormField label="Cargo Desejado" required>
            <input 
              type="text" 
              placeholder="Ex: Desenvolvedor Full Stack" 
              className={`w-full p-2 border rounded-lg bg-white ${showValidationErrors && validationErrors.desiredRole ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              value={personalInfo.desiredRole} 
              onChange={e => onPersonalInfoChange('desiredRole', e.target.value)}
              data-error={showValidationErrors && validationErrors.desiredRole ? "true" : "false"}
            />
          </FormField>
        </div>
        
        {/* Postal code and city fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <FormField label="Código Postal">
            <input 
              type="text" 
              placeholder="Ex: 1234-567" 
              className="w-full p-2 border border-gray-300 rounded-lg bg-white" 
              value={personalInfo.postalCode} 
              onChange={e => onPersonalInfoChange('postalCode', e.target.value)} 
            />
          </FormField>
          <FormField label="Cidade">
            <input 
              type="text" 
              placeholder="Ex: Viana do Castelo" 
              className="w-full p-2 border border-gray-300 rounded-lg bg-white" 
              value={personalInfo.city} 
              onChange={e => onPersonalInfoChange('city', e.target.value)} 
            />
          </FormField>
        </div>
        
        {/* Email, country code, and phone fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Email" required>
            <input 
              type="email" 
              placeholder="Ex: email@exemplo.com" 
              className={`w-full p-2 border rounded-lg bg-white ${showValidationErrors && validationErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              value={personalInfo.email} 
              onChange={e => onPersonalInfoChange('email', e.target.value)}
              data-error={showValidationErrors && validationErrors.email ? "true" : "false"}
            />
          </FormField>
          <FormField label="Código do País">
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg bg-white" 
              value={personalInfo.countryCode} 
              onChange={e => onPersonalInfoChange('countryCode', e.target.value)}
            >
              <option>Portugal (+351)</option>
              <option>Brasil (+55)</option>
              <option>Espanha (+34)</option>
            </select>
          </FormField>
          <FormField label="Telefone">
            <input 
              type="text" 
              placeholder="Ex: 912345678" 
              className="w-full p-2 border border-gray-300 rounded-lg bg-white" 
              value={personalInfo.phone} 
              onChange={e => onPersonalInfoChange('phone', e.target.value)} 
            />
          </FormField>
        </div>
      </FormSection>
      
      {/* Social media and portfolio links section */}
      <div>
        <label className="block text-sm font-medium mb-2">Links e Redes Sociais</label>
        <div className="flex flex-col gap-4">
          {links.map((link, idx) => {
            const linkType = LINK_TYPES.find(t => t.label === link.type) || LINK_TYPES[0];
            return (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                {/* Link type selection */}
                <div>
                  <label className="block text-xs font-medium mb-1">Tipo de Link</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    value={link.type}
                    onChange={e => onLinkTypeChange(idx, e.target.value)}
                  >
                    {LINK_TYPES.map(t => (
                      <option key={t.label} value={t.label}>{t.label}</option>
                    ))}
                  </select>
                </div>
                {/* Link URL input with prefix */}
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1">URL</label>
                    <div className="flex">
                      {linkType.prefix && (
                        <span className="inline-flex items-center px-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">{linkType.prefix}</span>
                      )}
                      <input
                        type="text"
                        placeholder={linkType.label === 'LinkedIn' ? 'Ex: seuperfil' : linkType.label === 'GitHub' ? 'Ex: utilizador' : 'Ex: seuwebsite.com'}
                        className={`w-full p-2 border border-gray-300 ${linkType.prefix ? 'rounded-r-lg' : 'rounded-lg'} bg-white`}
                        value={link.value}
                        onChange={e => onLinkValueChange(idx, e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Remove link button */}
                  {links.length > 1 && (
                    <IconButton onClick={() => onRemoveLink(idx)} variant="danger" size="sm" className="mt-4">
                      {Icons.remove}
                    </IconButton>
                  )}
                </div>
              </div>
            );
          })}
          {/* Add new link button */}
          <button
            type="button"
            onClick={onAddLink}
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm mt-2"
          >
            {Icons.add}
            Adicionar Link
          </button>
        </div>
      </div>
    </form>
  );
}