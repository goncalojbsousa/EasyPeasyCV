/**
 * Interface for personal information data
 */
export interface PersonalInfo {
  /** Full name of the person */
  name: string;
  /** Desired job role or position */
  desiredRole: string;
  /** City of residence */
  city: string;
  /** Postal code */
  postalCode: string;
  /** Email address */
  email: string;
  /** Country code for phone number */
  countryCode: string;
  /** Phone number */
  phone: string;
}

/**
 * Interface for social media and portfolio links
 */
export interface Link {
  /** Type of link (LinkedIn, GitHub, Portfolio, etc.) */
  type: string;
  /** URL or username value */
  value: string;
  /** Custom name for the platform (when type is "Other") */
  customName?: string;
}

/**
 * Interface for professional experience entries
 */
export interface Experience {
  /** Job title or role */
  role: string;
  /** Company name */
  company: string;
  /** Start month (abbreviated) */
  startMonth: string;
  /** Start year */
  startYear: string;
  /** End month (abbreviated) */
  endMonth: string;
  /** End year */
  endYear: string;
  /** Whether this is the current job */
  current: boolean;
  /** Technologies used in this role */
  tech: string;
  /** Activities and responsibilities */
  activities: string;
  /** Achievements and results with metrics */
  results: string;
}

/**
 * Interface for education entries
 */
export interface Education {
  /** Type of education (degree level) */
  type: string;
  /** Status of education (completed, in progress, etc.) */
  status: string;
  /** Course or degree name */
  course: string;
  /** Educational institution */
  institution: string;
  /** Start month (abbreviated) */
  startMonth: string;
  /** Start year */
  startYear: string;
  /** End month (abbreviated) */
  endMonth: string;
  /** End year */
  endYear: string;
  /** Description of education and achievements */
  description: string;
}

/**
 * Interface for language proficiency entries
 */
export interface Language {
  /** Language name */
  name: string;
  /** Proficiency level */
  level: string;
}

/**
 * Interface for certification entries
 */
export interface Certification {
  /** Certification name */
  name: string;
  /** Issuing organization or institution */
  issuer: string;
  /** Date of completion */
  completionDate: string;
  /** Hours of study or course duration */
  hours: string;
  /** URL for certificate validation */
  validationLink: string;
  /** Description of certification content */
  description: string;
}

/**
 * Interface for project entries
 */
export interface Project {
  /** Project name */
  name: string;
  /** Project description */
  description: string;
  /** Project URL or repository link */
  link: string;
  /** Technologies used in the project */
  tech: string;
  /** Year of project completion */
  year: string;
}

/**
 * Interface for volunteer work entries
 */
export interface Volunteer {
  /** Organization name */
  organization: string;
  /** Role or position in the organization */
  role: string;
  /** Start month (abbreviated) */
  startMonth: string;
  /** Start year */
  startYear: string;
  /** End month (abbreviated) */
  endMonth: string;
  /** End year */
  endYear: string;
  /** Whether this is the current volunteer position */
  current: boolean;
  /** Description of volunteer activities and responsibilities */
  description: string;
  /** Impact and achievements in the volunteer role */
  impact: string;
}

/**
 * Available CV template types
 */
export type CvTemplate = 'classic' | 'modern' | 'creative' | 'minimal' | 'timeline' | 'professional';

export type CvColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 'indigo' | 'pink';

/**
 * Main interface containing all CV data
 */
export interface CvData {
  /** Personal information */
  personalInfo: PersonalInfo;
  /** Social media and portfolio links */
  links: Link[];
  /** Professional summary */
  resume: string;
  /** Professional experience entries */
  experiences: Experience[];
  /** Education entries */
  education: Education[];
  /** Technical skills */
  skills: string;
  /** Language proficiency entries */
  languages: Language[];
  /** Certification entries */
  certifications: Certification[];
  /** Project entries */
  projects: Project[];
  /** Volunteer work entries */
  volunteers: Volunteer[];
  /** Selected CV template */
  template?: CvTemplate;
  /** Selected color theme */
  color?: CvColor;
} 