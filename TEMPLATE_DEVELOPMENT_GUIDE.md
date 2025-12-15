# Template Development Guide

Technical documentation for CV template development in EasyPeasyCV.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [File Structure](#file-structure)
3. [API Reference](#api-reference)
4. [Template Development](#template-development)
5. [Implementation Examples](#implementation-examples)

---

## System Architecture

The template system uses a layered architecture to maximize code reuse and separate responsibilities. The structure is divided into three distinct layers:

### Layer 1: Types and Interfaces

**Location:** `app/types/cv.ts`

Defines all TypeScript data structures used by the system:

- **Data Interfaces:** `PersonalInfo`, `Experience`, `Education`, `Language`, `Certification`, `Project`, `Volunteer`, `CustomSection`
- **Settings:** `CvRenderSettings` contains all customization options (layout, density, font, margins, etc.)
- **Main Interface:** `CvData` aggregates all CV data into a single interface
- **Auxiliary Types:** `CvColor`, `SectionKey`, `PredefinedSectionKey`

### Layer 2: Utilities and Helpers

**Location:** `app/utils/`

Set of pure functions and reusable components that implement shared logic:

#### `template-helpers.ts`
Utility functions for data manipulation and formatting:
- Date and time interval formatting
- Multilingual label and text translations
- String manipulation and parsing
- Social network URL generation
- Unit conversions (cm to pt)

#### `template-styles.ts`
Centralized system for style and metrics calculation:
- Metrics calculation based on user settings
- Generation of base styles common to all templates
- Definition of density presets (compact, normal, spacious)
- Photo dimension calculation by aspect ratio

#### `section-renderers.tsx`
Reusable React components for section rendering:
- Renderers for each predefined section type
- Customization support through optional parameters
- Section ordering logic
- Handling of user-created custom sections

### Layer 3: Templates

**Location:** `app/components/cv_templates/`

Concrete template implementations that combine utilities and define unique layouts:
- Each template is a React component that returns a `<Document>` from `@react-pdf/renderer`
- Templates import and use utilities from layer 2
- Each template defines specific styles that complement base styles
- Templates have freedom to customize or override default renderers

---

## File Structure

```
app/
├── components/
│   └── cv_templates/
│       ├── classic_template.tsx      # Template with side timeline
│       ├── renewed_template.tsx      # Template with centered layout
│       └── [new_template].tsx        # New templates
├── types/
│   └── cv.ts                          # TypeScript definitions
└── utils/
    ├── template-helpers.ts            # General utility functions
    ├── template-styles.ts             # Style calculation system
    ├── section-renderers.tsx          # Rendering components
    ├── color-themes.ts                # Color palette definitions
    └── months.ts                      # Month translation dictionaries
```

---

## API Reference

### app/utils/template-helpers.ts

#### `formatDateRange()`
Formats a date range based on settings and language.

**Signature:**
```typescript
formatDateRange(
  startMonth: string,
  startYear: string,
  endMonth: string,
  endYear: string,
  current: boolean | undefined,
  lang: 'pt' | 'en' | 'es',
  format?: 'full' | 'short' | 'year-only'
): string
```

**Parameters:**
- `startMonth`: Start month (abbreviated: "Jan", "Feb", etc.)
- `startYear`: Start year
- `endMonth`: End month (abbreviated)
- `endYear`: End year
- `current`: If true, displays "Present" instead of end date
- `lang`: Language for translation
- `format`: Display format (optional)
  - `'full'`: "January 2020 - December 2023"
  - `'short'`: "Jan 2020 - Dec 2023"
  - `'year-only'`: "2020 - 2023"

**Returns:** Formatted string representing the interval

**Example:**
```typescript
formatDateRange("Jan", "2020", "Dec", "2023", false, "en", "short")
// Returns: "Jan 2020 - Dec 2023"

formatDateRange("Jan", "2020", "", "", true, "en", "short")
// Returns: "Jan 2020 - Present"
```

#### `translateLabel()`
Translates education type/status labels and other fields.

**Signature:**
```typescript
translateLabel(value: string, lang?: string): string
```

**Parameters:**
- `value`: Value to be translated (e.g., "bachelor", "in-progress")
- `lang`: Target language (optional, default: pt)

**Returns:** Translated string

**Mappings:**
- Education types: bachelor, master, phd, technical, bootcamp, certification, other
- Status: in-progress, completed, incomplete

#### `translateLanguageLevel()`
Translates language proficiency levels.

**Signature:**
```typescript
translateLanguageLevel(level: string, lang?: string): string
```

**Supported levels:**
- native, fluent, advanced, intermediate, basic

#### `splitLines()`
Splits text by line breaks, useful for creating bullet lists.

**Signature:**
```typescript
splitLines(text: string): string[]
```

**Behavior:**
- Removes empty lines
- Trims each line
- Supports `\n` and `\r\n`

#### `getSocialUrl()`
Generates complete URL from social link type and value.

**Signature:**
```typescript
getSocialUrl(type: string, value: string): string
```

**Supported types:**
- `'LinkedIn'`: Adds `https://linkedin.com/in/` if needed
- `'GitHub'`: Adds `https://github.com/` if needed
- `'Portfolio'`, `'Other'`: Returns value directly

#### `cmToPt()`
Converts centimeters to points (PDF unit).

**Signature:**
```typescript
cmToPt(cm: number): number
```

**Formula:** `cm * 28.3465`

---

### app/utils/template-styles.ts

#### `computeMetrics()`
Calculates all layout metrics based on user settings.

**Signature:**
```typescript
computeMetrics(
  settings?: CvRenderSettings, 
  color?: CvColor
): ComputedMetrics
```

**Returns:**
```typescript
interface ComputedMetrics {
  margins: { top: number; right: number; bottom: number; left: number };
  sectionSpacing: number;      // Spacing between sections
  lineSpacing: number;          // Line spacing (line-height)
  finalScale: number;           // Final scale applied to fonts
  singlePageMult: number;       // Multiplier for single page mode
  densityMult: DensityMultipliers;
  textAlign: 'left' | 'right' | 'center' | 'justify';
  fontFamily: string;
  sectionTitleColor: string;
  sectionTitleSize: number;
  accent: string;               // Theme accent color
}
```

**Calculation Logic:**

1. **Density:** Applies multipliers based on `settings.layout.density`
   - `compact`: reduces margins by 30%, spacing by 40%, line-height by 10%
   - `normal`: no changes (multiplier 1.0)
   - `spacious`: increases margins by 30%, spacing by 50%, line-height by 10%

2. **Single Page Mode:** If enabled, applies additional 0.85 multiplier to compress content

3. **Final Scale:** `scale * densityMult.fontSize * singlePageMult`

4. **Font Family:** Handles custom font special case and maps "Arial" to "Helvetica"

#### `buildCommonStyles()`
Generates common base styles used by all templates.

**Signature:**
```typescript
buildCommonStyles(
  metrics: ComputedMetrics, 
  settings?: CvRenderSettings
): StyleSheet
```

**Returned Styles:**
- `page`: Main page container with padding and base font
- `section`: Section container with marginBottom
- `sectionTitle`: Section title with size and color
- `name`: Full name in header
- `title`: Desired position in header
- `divider`: Header dividing line
- `summaryText`: Professional summary text
- `expItem`: Experience item container
- `expHeaderRow`: Row with title and dates
- `expLeft`: Left column (title/company)
- `expRight`: Right column (dates)
- `jobRole`: Position/role style
- `company`: Company/institution style
- `bullets`: Style for list items
- `activitiesText`: Activities/description text

**Note:** Templates can override any returned style.

#### `getPhotoSize()`
Returns photo dimensions based on selected aspect ratio.

**Signature:**
```typescript
getPhotoSize(aspectRatio?: '1:1' | '3:4' | '4:3'): { width: number; height: number }
```

**Mappings:**
- `'1:1'`: 90x90 px
- `'3:4'`: 90x120 px
- `'4:3'`: 120x90 px

#### `DENSITY_PRESETS`
Constant that defines multipliers for each density level.

```typescript
const DENSITY_PRESETS: Record<'compact' | 'normal' | 'spacious', DensityMultipliers> = {
  compact: { margin: 0.7, spacing: 0.6, lineHeight: 0.9, fontSize: 0.95 },
  normal: { margin: 1, spacing: 1, lineHeight: 1, fontSize: 1 },
  spacious: { margin: 1.3, spacing: 1.5, lineHeight: 1.1, fontSize: 1 }
};
```

---

### app/utils/section-renderers.tsx

All renderers follow the same base interface:

```typescript
interface SectionRenderProps {
  styles: any;
  lang: 'pt' | 'en' | 'es';
  settings?: CvRenderSettings;
}

interface SectionWrapperProps {
  children: React.ReactNode;  // The section content to wrap
  sectionKey: string;          // Unique key for the section (e.g., "professional_experience")
  label: string;               // Translated section title (e.g., "EXPERIENCE")
}
```

#### `getSectionOrder()`
Generates ordered array of section keys based on defined order and custom sections.

**Signature:**
```typescript
getSectionOrder(
  sectionOrder: SectionKey[] | undefined,
  customSections: CustomSection[] | undefined
): SectionKey[]
```

**Behavior:**
- If `sectionOrder` is not provided, uses default order
- Adds custom sections to the end
- Custom sections have key in format `custom_${id}`

#### `renderSummarySection()`
Renders professional summary section.

**Signature:**
```typescript
renderSummarySection(
  resume: string | undefined,
  props: SectionRenderProps,
  SectionTitle: React.ComponentType<{ label: string }>
): JSX.Element | null
```

**Returns:** `null` if `resume` is empty

#### `renderExperienceSection()`
Renders professional experience section.

**Signature:**
```typescript
renderExperienceSection(
  experiences: Experience[],
  props: SectionRenderProps,
  SectionTitle: React.ComponentType<{ label: string }>,
  ItemWrapper?: React.ComponentType<{ children: React.ReactNode }>,
  SectionWrapper?: React.ComponentType<SectionWrapperProps>
): JSX.Element | null
```

**Parameters:**
- `ItemWrapper`: Optional component to wrap each item (e.g., to add timeline bullets)
- `SectionWrapper`: Optional component to wrap the entire section with custom layout (e.g., timeline container)

**Rendering:**
- Header with role, company and dates
- Activities (continuous text)
- Results (bullet list)
- Tech stack

#### `renderEducationSection()`
Renders academic education section.

**Signature:**
```typescript
renderEducationSection(
  education: Education[],
  props: SectionRenderProps,
  SectionTitle: React.ComponentType<{ label: string }>,
  ItemWrapper?: React.ComponentType<{ children: React.ReactNode }>,
  SectionWrapper?: React.ComponentType<SectionWrapperProps>
): JSX.Element | null
```

**Parameters:**
- `ItemWrapper`: Optional component to wrap each item
- `SectionWrapper`: Optional component to wrap the entire section with custom layout

**Rendering:**
- Course name
- Institution, type and status (inline with " • " separator)
- Description
- Achievements (bullet list)

#### `renderSkillsSection()`
Renders technical skills section.

**Signature:**
```typescript
renderSkillsSection(
  skills: string | undefined,
  props: SectionRenderProps,
  SectionTitle: React.ComponentType<{ label: string }>,
  customTextStyle?: any
): JSX.Element | null
```

**Parameters:**
- `customTextStyle`: Allows passing custom style for text (useful for centering)

#### `renderLanguagesSection()`
Renders languages section.

**Signature:**
```typescript
renderLanguagesSection(
  languages: Language[] | undefined,
  props: SectionRenderProps,
  SectionTitle: React.ComponentType<{ label: string }>,
  CustomRender?: (languages: Language[], styles: any, lang: 'pt' | 'en' | 'es') => React.ReactNode
): JSX.Element | null
```

**Parameters:**
- `CustomRender`: Optional function for custom rendering (allows full layout control)

**Default rendering:**
- Horizontal row with wrap
- Each language: "Name (Level)"

#### `renderCertificationsSection()`
Renders certifications section.

**Signature:**
```typescript
renderCertificationsSection(
  certifications: Certification[] | undefined,
  props: SectionRenderProps,
  SectionTitle: React.ComponentType<{ label: string }>
): JSX.Element | null
```

**Rendering:**
- Name and completion date
- Issuer
- Validation link
- Description (if exists)

#### `renderProjectsSection()`
Renders projects section.

**Signature:**
```typescript
renderProjectsSection(
  projects: Project[] | undefined,
  props: SectionRenderProps,
  SectionTitle: React.ComponentType<{ label: string }>
): JSX.Element | null
```

**Rendering:**
- Name and year
- Technologies used
- Description
- Impact (bullet list)
- Links (project and source code)

#### `renderVolunteerSection()`
Renders volunteer work section.

**Signature:**
```typescript
renderVolunteerSection(
  volunteers: Volunteer[] | undefined,
  props: SectionRenderProps,
  SectionTitle: React.ComponentType<{ label: string }>,
  ItemWrapper?: React.ComponentType<{ children: React.ReactNode }>,
  SectionWrapper?: React.ComponentType<SectionWrapperProps>
): JSX.Element | null
```

**Parameters:**
- `ItemWrapper`: Optional component to wrap each item
- `SectionWrapper`: Optional component to wrap the entire section with custom layout

**Rendering:**
Similar to `renderExperienceSection` but with organization instead of company.

#### `renderCustomSection()`
Renders user-created custom sections.

**Signature:**
```typescript
renderCustomSection(
  section: CustomSection,
  props: SectionRenderProps,
  SectionTitle: React.ComponentType<{ label: string }>,
  ItemWrapper?: React.ComponentType<{ children: React.ReactNode }>,
  SectionWrapper?: React.ComponentType<SectionWrapperProps>
): JSX.Element | null
```

**Parameters:**
- `ItemWrapper`: Optional component to wrap each item
- `SectionWrapper`: Optional component to wrap the entire section with custom layout

**Behavior:**
- Filters empty fields (meaningful fields)
- Supports `centerValue` for text centering
- Renders label, subtitle, dates, value and bullets as available

---

## Template Development

### Base Template Structure

Every template must be a React component that returns a `<Document>` from `@react-pdf/renderer`. The recommended minimum structure is:

**File:** `app/components/cv_templates/[template_name].tsx`

```tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Image } from '@react-pdf/renderer';
import { CvData, CvRenderSettings, CvColor } from '../../types/cv';
import { getSocialUrl } from '../../utils/template-helpers';
import { computeMetrics, buildCommonStyles, getPhotoSize } from '../../utils/template-styles';
import {
  getSectionOrder,
  renderSummarySection,
  renderExperienceSection,
  renderEducationSection,
  renderSkillsSection,
  renderLanguagesSection,
  renderCertificationsSection,
  renderProjectsSection,
  renderVolunteerSection,
  renderCustomSection,
} from '../../utils/section-renderers';

interface YourTemplateProps extends CvData {
  lang?: string;
  settings?: CvRenderSettings;
  color?: CvColor;
}

export function YourTemplate({ 
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
  customSections, 
  lang, 
  settings, 
  color, 
  sectionOrder 
}: YourTemplateProps) {
  // Your code here
}
```

### Style System

The `buildStyles` function is responsible for generating the complete template stylesheet. It's recommended to follow this pattern:

```tsx
const buildStyles = (settings?: CvRenderSettings, color: CvColor = 'blue') => {
  // 1. Compute metrics based on settings and color
  const metrics = computeMetrics(settings, color);
  
  // 2. Generate common base styles
  const commonStyles = buildCommonStyles(metrics, settings);
  
  // 3. Define template-specific styles
  const specificStyles = StyleSheet.create({
    // Override or add styles
    customHeader: { 
      backgroundColor: metrics.accent, 
      padding: 10 * metrics.singlePageMult
    },
    customBorder: {
      borderLeft: `2px solid ${metrics.accent}`,
      paddingLeft: 10
    }
  });

  // 4. Return combined styles
  return {
    ...commonStyles,
    ...specificStyles,
    _finalScale: metrics.finalScale,
    _singlePageMult: metrics.singlePageMult,
  };
};
```

**Important notes:**
- `metrics` contains all calculated values (margins, scales, colors)
- `commonStyles` provides base styles that can be overridden
- Always multiply spacing values by `metrics.singlePageMult` to support single page mode
- Properties prefixed with `_` are exposed for internal template use

### Inicialização do Template

```tsx
export function YourTemplate({ 
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
  customSections, 
  lang, 
  settings, 
  color, 
  sectionOrder 
}: YourTemplateProps) {
  // 1. Language normalization
  // "br" is converted to "pt" for backward compatibility
  const l = (lang === 'br' ? 'pt' : (lang || 'pt')) as 'pt' | 'en' | 'es';
  
  // 2. Style generation
  const styles = buildStyles(settings, color || 'blue');
  
  // 3. Get section order
  // Combines defined order with custom sections
  const order = getSectionOrder(sectionOrder, customSections);
  
  // 4. Data preparation
  const contactItems = [
    personalInfo?.city,
    personalInfo?.postalCode,
    personalInfo?.email,
    personalInfo?.countryCode && personalInfo?.phone 
      ? `${personalInfo.countryCode} ${personalInfo.phone}` 
      : personalInfo?.phone
  ].filter(Boolean);
  
  // ... continues with rendering
}
```

### Layout Components

Templates should define reusable components for repeated elements:

```tsx
// Required component: Section title
// Used by renderers to maintain visual consistency
const SectionTitle = ({ label }: { label: string }) => (
  <View style={styles.sectionTitleWrap}>
    <Text style={styles.sectionTitle}>{label}</Text>
    <View style={styles.sectionLine} />
  </View>
);

// Optional component: Item wrapper (e.g., timeline)
// Useful for adding consistent visual elements
const ItemWrapper = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.itemWrap}>
    <View style={styles.bullet} />
    <View style={{ flex: 1 }}>{children}</View>
  </View>
);
```

**Design Considerations:**
- `SectionTitle` is passed to all renderers and must accept `label: string` prop
- `ItemWrapper` is optional and used only by renderers that support it (Experience, Education, Volunteer, Custom)
- Components should use stylesheet styles, not inline styles

### Best Practices and Conventions

#### ✅ DO - Use Renderers Directly

Templates should use renderers directly and let them handle section structure:

```tsx
// ✅ CORRECT - Let the renderer handle everything
case 'professional_experience':
  return renderExperienceSection(experiences, renderProps, SectionTitle);

// ✅ CORRECT - With ItemWrapper for custom item decoration
case 'professional_experience':
  return renderExperienceSection(experiences, renderProps, SectionTitle, TimelineItem);

// ✅ CORRECT - With SectionWrapper for custom section layout
case 'professional_experience':
  return renderExperienceSection(experiences, renderProps, SectionTitle, TimelineItem, TimelineWrapper);
```

#### ❌ DON'T - Manual Section Wrapping

Avoid manually wrapping renderer output or bypassing their logic:

```tsx
// ❌ WRONG - Manual wrapper with () => null breaks the pattern
case 'professional_experience':
  return experiences.length > 0 ? (
    <View style={styles.section}>
      <SectionTitle label="EXPERIENCE" />
      {renderExperienceSection(experiences, renderProps, () => null, ItemWrapper)}
    </View>
  ) : null;

// ❌ WRONG - Redundant null checks (renderer already handles this)
case 'certifications':
  return certifications && certifications.length > 0 
    ? renderCertificationsSection(certifications, renderProps, SectionTitle)
    : null;
```

#### Using SectionWrapper

When you need to apply consistent custom layout to multiple sections (like timeline), create a `SectionWrapper`:

```tsx
const TimelineWrapper = ({ children, sectionKey, label }: SectionWrapperProps) => (
  <View style={styles.section} key={sectionKey}>
    <SectionTitle label={label} />
    <View style={styles.timelineWrap}>
      {children}
    </View>
  </View>
);

// Then use it with compatible renderers
case 'professional_experience':
  return renderExperienceSection(experiences, renderProps, SectionTitle, TimelineItem, TimelineWrapper);
```

**Key Points:**
- `SectionWrapper` receives `children`, `sectionKey`, and `label`
- Only 4 renderers support `SectionWrapper`: Experience, Education, Volunteer, and Custom
- `SectionWrapper` wraps the entire section content (title + items)
- `ItemWrapper` wraps each individual item within the section

### Section Rendering

The switch case determines how each section type is rendered:

```tsx
// Prepare common props for renderers
const renderProps = { styles, lang: l, settings };

// Function that maps section key to appropriate renderer
const renderSection = (sectionKey: import('../../types/cv').SectionKey) => {
  switch (sectionKey) {
    // Professional summary section
    case 'professional_summary':
      return renderSummarySection(resume, renderProps, SectionTitle);
    
    // Professional experience section
    case 'professional_experience':
      return renderExperienceSection(
        experiences, 
        renderProps, 
        SectionTitle,
        ItemWrapper,      // Optional: to add bullets or timeline per item
        SectionWrapper    // Optional: to wrap entire section with custom layout
      );
    
    // Academic education section
    case 'academic_education':
      return renderEducationSection(
        education, 
        renderProps, 
        SectionTitle,
        ItemWrapper,
        SectionWrapper
      );
    
    // Technical skills section
    case 'technical_skills':
      // 4th parameter allows customizing text style
      return renderSkillsSection(
        skills, 
        renderProps, 
        SectionTitle, 
        styles.skillsTextCustom
      );
    
    // Languages section
    case 'languages':
      // 4th parameter allows completely custom rendering
      return renderLanguagesSection(
        languages, 
        renderProps, 
        SectionTitle, 
        CustomLanguageRenderer
      );
    
    // Sections with standard rendering
    case 'certifications':
      return renderCertificationsSection(certifications, renderProps, SectionTitle);
    
    case 'projects':
      return renderProjectsSection(projects, renderProps, SectionTitle);
    
    case 'volunteer':
      return renderVolunteerSection(
        volunteers, 
        renderProps, 
        SectionTitle, 
        ItemWrapper,
        SectionWrapper
      );
    
    // Custom sections handling
    default:
      if (sectionKey.startsWith('custom_')) {
        const customId = sectionKey.replace('custom_', '');
        const section = customSections?.find((cs) => cs.id === customId);
        if (section) {
          return renderCustomSection(
            section, 
            renderProps, 
            SectionTitle, 
            ItemWrapper,
            SectionWrapper
          );
        }
      }
      return null;
  }
};
```

**Notes:**
- Renderers return `null` when data is empty - **no need for manual null checks**
- Rendering order is determined by `sectionOrder`
- Custom sections are identified by `custom_` prefix
- `ItemWrapper` is optional and wraps individual items within a section
- `SectionWrapper` is optional and wraps the entire section (title + items)
- Both wrappers are only supported by: Experience, Education, Volunteer, and Custom sections

### Document Construction

```tsx
return (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.name}>{personalInfo?.name || 'YOUR NAME'}</Text>
        {personalInfo?.desiredRole && (
          <Text style={styles.title}>{personalInfo.desiredRole}</Text>
        )}
        
        {/* Contact Information */}
        {contactItems.length > 0 && (
          <View style={styles.contactRow}>
            {contactItems.map((item, i) => (
              <Text key={i} style={styles.contactItem}>{item}</Text>
            ))}
          </View>
        )}
        
        {/* Social Links */}
        {links && links.length > 0 && (
          <View style={styles.linksRow}>
            {links.map((lnk, i) => (
              <Link 
                key={i} 
                src={getSocialUrl(lnk.type, lnk.value)} 
                style={styles.link}
              >
                {lnk.hideLinkLabel 
                  ? lnk.value 
                  : `${lnk.customName || lnk.type}: ${lnk.value}`
                }
              </Link>
            ))}
          </View>
        )}
        
        {/* Photo (if enabled) */}
        {settings?.photo?.enabled && settings?.photo?.dataUrl && (
          <Image src={settings.photo.dataUrl} style={styles.photo} />
        )}
      </View>

      {/* Dynamic Section Rendering */}
      {order.map(sectionKey => renderSection(sectionKey))}
    </Page>
  </Document>
);
```

**Document Structure:**
- `<Document>`: PDF root container
- `<Page>`: Individual page (size="A4" or "LETTER")
- Header contains personal information and always appears at the top
- Sections are dynamically rendered based on `order`

---

## Support and Contribution

For questions, suggestions or to report issues:
- Open an issue on GitHub with tag `template-development`
- To contribute code, fork and open a Pull Request
- Follow conventional commits: `feat:`, `fix:`, `docs:`, etc.