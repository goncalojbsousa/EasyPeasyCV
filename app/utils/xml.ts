// Utility functions to serialize and deserialize CvData to/from XML
// This runs in the browser (client components) and relies on DOMParser for parsing.

import type { CvData, Link, Experience, Education, Language, Certification, Project, Volunteer } from '../types/cv';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function el(name: string, value: string | undefined | null): string {
  const safe = value ?? '';
  return `<${name}>${escapeXml(String(safe))}</${name}>`;
}

function arr(name: string, itemsXml: string): string {
  return `<${name}>${itemsXml}</${name}>`;
}

export function cvDataToXml(data: CvData): string {
  const linksXml = (data.links || [])
    .map((l: Link) => `<link>${el('type', l.type)}${el('value', l.value)}${el('customName', l.customName || '')}</link>`) 
    .join('');

  const experiencesXml = (data.experiences || [])
    .map((e: Experience) => `<experience>
      ${el('role', e.role)}
      ${el('company', e.company)}
      ${el('startMonth', e.startMonth)}
      ${el('startYear', e.startYear)}
      ${el('endMonth', e.endMonth)}
      ${el('endYear', e.endYear)}
      ${el('current', String(e.current))}
      ${el('tech', e.tech)}
      ${el('activities', e.activities)}
      ${el('results', e.results)}
    </experience>`)
    .join('');

  const educationXml = (data.education || [])
    .map((e: Education) => `<education>
      ${el('type', e.type)}
      ${el('status', e.status)}
      ${el('course', e.course)}
      ${el('institution', e.institution)}
      ${el('startMonth', e.startMonth)}
      ${el('startYear', e.startYear)}
      ${el('endMonth', e.endMonth)}
      ${el('endYear', e.endYear)}
      ${el('description', e.description)}
    </education>`)
    .join('');

  const languagesXml = (data.languages || [])
    .map((l: Language) => `<language>${el('name', l.name)}${el('level', l.level)}</language>`) 
    .join('');

  const certificationsXml = (data.certifications || [])
    .map((c: Certification) => `<certification>
      ${el('name', c.name)}
      ${el('issuer', c.issuer)}
      ${el('completionDate', c.completionDate)}
      ${el('hours', c.hours)}
      ${el('validationLink', c.validationLink)}
      ${el('description', c.description)}
    </certification>`)
    .join('');

  const projectsXml = (data.projects || [])
    .map((p: Project) => `<project>
      ${el('name', p.name)}
      ${el('description', p.description)}
      ${el('link', p.link)}
      ${el('sourceCode', p.sourceCode || '')}
      ${el('tech', p.tech)}
      ${el('year', p.year)}
    </project>`)
    .join('');

  const volunteersXml = (data.volunteers || [])
    .map((v: Volunteer) => `<volunteer>
      ${el('organization', v.organization)}
      ${el('role', v.role)}
      ${el('startMonth', v.startMonth)}
      ${el('startYear', v.startYear)}
      ${el('endMonth', v.endMonth)}
      ${el('endYear', v.endYear)}
      ${el('current', String(v.current))}
      ${el('description', v.description)}
      ${el('impact', v.impact)}
    </volunteer>`)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cv>
  <personalInfo>
    ${el('name', data.personalInfo?.name)}
    ${el('desiredRole', data.personalInfo?.desiredRole)}
    ${el('city', data.personalInfo?.city)}
    ${el('postalCode', data.personalInfo?.postalCode)}
    ${el('email', data.personalInfo?.email)}
    ${el('countryCode', data.personalInfo?.countryCode)}
    ${el('phone', data.personalInfo?.phone)}
  </personalInfo>
  ${arr('links', linksXml)}
  ${el('resume', data.resume || '')}
  ${arr('experiences', experiencesXml)}
  ${arr('education', educationXml)}
  ${el('skills', data.skills || '')}
  ${arr('languages', languagesXml)}
  ${arr('certifications', certificationsXml)}
  ${arr('projects', projectsXml)}
  ${arr('volunteers', volunteersXml)}
  ${el('template', data.template || '')}
  ${el('color', data.color || '')}
</cv>`;
  return xml;
}

function textContent(parent: Element, tag: string): string {
  const el = parent.getElementsByTagName(tag)[0];
  return el?.textContent ?? '';
}

export function xmlToCvData(xml: string): CvData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const parserError = doc.getElementsByTagName('parsererror')[0];
  if (parserError) {
    throw new Error('Invalid XML');
  }

  const cvEl = doc.getElementsByTagName('cv')[0];
  if (!cvEl) throw new Error('Missing <cv> root');

  const personalInfoEl = cvEl.getElementsByTagName('personalInfo')[0];
  const personalInfo = {
    name: textContent(personalInfoEl, 'name'),
    desiredRole: textContent(personalInfoEl, 'desiredRole'),
    city: textContent(personalInfoEl, 'city'),
    postalCode: textContent(personalInfoEl, 'postalCode'),
    email: textContent(personalInfoEl, 'email'),
    countryCode: textContent(personalInfoEl, 'countryCode') || 'Portugal (+351)',
    phone: textContent(personalInfoEl, 'phone'),
  };

  const links: Link[] = Array.from(cvEl.getElementsByTagName('links')[0]?.getElementsByTagName('link') || [])
    .map((ln) => ({
      type: textContent(ln, 'type'),
      value: textContent(ln, 'value'),
      customName: textContent(ln, 'customName') || undefined,
    }));

  const experiences: Experience[] = Array.from(cvEl.getElementsByTagName('experiences')[0]?.getElementsByTagName('experience') || [])
    .map((ex) => ({
      role: textContent(ex, 'role'),
      company: textContent(ex, 'company'),
      startMonth: textContent(ex, 'startMonth'),
      startYear: textContent(ex, 'startYear'),
      endMonth: textContent(ex, 'endMonth'),
      endYear: textContent(ex, 'endYear'),
      current: textContent(ex, 'current') === 'true',
      tech: textContent(ex, 'tech'),
      activities: textContent(ex, 'activities'),
      results: textContent(ex, 'results'),
    }));

  const education: Education[] = Array.from(cvEl.getElementsByTagName('education')[0]?.getElementsByTagName('education') || [])
    .map((ed) => ({
      type: textContent(ed, 'type'),
      status: textContent(ed, 'status'),
      course: textContent(ed, 'course'),
      institution: textContent(ed, 'institution'),
      startMonth: textContent(ed, 'startMonth'),
      startYear: textContent(ed, 'startYear'),
      endMonth: textContent(ed, 'endMonth'),
      endYear: textContent(ed, 'endYear'),
      description: textContent(ed, 'description'),
    }));

  const languages: Language[] = Array.from(cvEl.getElementsByTagName('languages')[0]?.getElementsByTagName('language') || [])
    .map((lg) => ({
      name: textContent(lg, 'name'),
      level: textContent(lg, 'level'),
    }));

  const certifications: Certification[] = Array.from(cvEl.getElementsByTagName('certifications')[0]?.getElementsByTagName('certification') || [])
    .map((ce) => ({
      name: textContent(ce, 'name'),
      issuer: textContent(ce, 'issuer'),
      completionDate: textContent(ce, 'completionDate'),
      hours: textContent(ce, 'hours'),
      validationLink: textContent(ce, 'validationLink'),
      description: textContent(ce, 'description'),
    }));

  const projects: Project[] = Array.from(cvEl.getElementsByTagName('projects')[0]?.getElementsByTagName('project') || [])
    .map((pr) => ({
      name: textContent(pr, 'name'),
      description: textContent(pr, 'description'),
      link: textContent(pr, 'link'),
      sourceCode: textContent(pr, 'sourceCode') || undefined,
      tech: textContent(pr, 'tech'),
      year: textContent(pr, 'year'),
    }));

  const volunteers: Volunteer[] = Array.from(cvEl.getElementsByTagName('volunteers')[0]?.getElementsByTagName('volunteer') || [])
    .map((vo) => ({
      organization: textContent(vo, 'organization'),
      role: textContent(vo, 'role'),
      startMonth: textContent(vo, 'startMonth'),
      startYear: textContent(vo, 'startYear'),
      endMonth: textContent(vo, 'endMonth'),
      endYear: textContent(vo, 'endYear'),
      current: textContent(vo, 'current') === 'true',
      description: textContent(vo, 'description'),
      impact: textContent(vo, 'impact'),
    }));

  const resume = textContent(cvEl, 'resume');
  const skills = textContent(cvEl, 'skills');
  const template = textContent(cvEl, 'template') as CvData['template'];
  const color = textContent(cvEl, 'color') as CvData['color'];

  return {
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
    template,
    color,
  };
}
