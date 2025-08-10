'use client';

import { Project } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { SortableList, DragHandle } from './dnd/sortable-list';

/**
 * Props interface for the Projects component
 */
interface ProjectsProps {
  /** Array of project entries */
  projects: Project[];
  /** Handler for updating project fields */
  onProjectChange: (idx: number, field: string, value: string) => void;
  /** Handler for adding new project entry */
  onAddProject: () => void;
  /** Handler for removing project entry */
  onRemoveProject: (idx: number) => void;
  /** Handler for reordering project entries */
  onReorderProjects?: (fromIndex: number, toIndex: number) => void;
}

/**
 * Projects component
 * Manages project portfolio entries with drag-and-drop reordering
 * @param projects - Array of project entries
 * @param onProjectChange - Function to handle project field updates
 * @param onAddProject - Function to add new project entry
 * @param onRemoveProject - Function to remove project entry
 * @param onReorderProjects - Function to reorder project entries
 * @returns JSX element representing the projects form section
 */
export function Projects({
  projects,
  onProjectChange,
  onAddProject,
  onRemoveProject,
  onReorderProjects
}: ProjectsProps) {
  const { t } = useLanguage();
  
  // Generates a display title for each project card based on available data
  const getProjectTitle = (proj: Project, idx: number) => {
    if (proj.name) return proj.name;
    return `${t('project.title')} ${idx + 1}`;
  };

  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title={t('section.projects')} 
        icon={Icons.projects}
      >
        {/* Display empty state when no projects exist */}
        {projects.length === 0 && (
          <EmptyState message={t('empty.project')} />
        )}
        
        {/* Render each project entry using SortableList */}
        <SortableList
          length={projects.length}
          onReorder={(from, to) => onReorderProjects && onReorderProjects(from, to)}
          renderItem={(idx) => {
            const proj = projects[idx];
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm relative mb-6 transition-all duration-300"
              >
                {/* Card header with title */}
                <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 border-b border-gray-200 dark:border-zinc-700 rounded-t-lg transition-colors duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {/* Drag handle icon (visual) */}
                      {projects.length > 1 && (
                        <DragHandle
                          ariaLabel="Reorder project"
                          className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors duration-300"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                          </svg>
                        </DragHandle>
                      )}
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {getProjectTitle(proj, idx)}
                      </h3>
                    </div>
                    <IconButton 
                      onClick={() => onRemoveProject(idx)} 
                      variant="danger" 
                      size="sm"
                      ariaLabel="Remove project"
                    >
                      {Icons.remove}
                    </IconButton>
                  </div>
                </div>
                
                {/* Card content */}
                <div className="p-4">
                
                {/* Project name and year fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <FormField label={t('field.project.name')}>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t(`cvType.placeholder.project.name`)}
                      value={proj.name}
                      onChange={e => onProjectChange(idx, 'name', e.target.value)}
                    />
                  </FormField>
                  <FormField label={t('field.year')}>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.project.year')}
                      value={proj.year}
                      onChange={e => onProjectChange(idx, 'year', e.target.value)}
                    />
                  </FormField>
                </div>
                
                {/* Source code and project link fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
                  <FormField label={t('field.project.sourceCode')}>
                    <input
                      type="url"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.project.sourceCode')}
                      value={proj.sourceCode || ''}
                      onChange={e => onProjectChange(idx, 'sourceCode', e.target.value)}
                    />
                  </FormField>
                  <FormField label={t('field.project.link')}>
                    <input
                      type="url"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t('placeholder.project.link')}
                      value={proj.link}
                      onChange={e => onProjectChange(idx, 'link', e.target.value)}
                    />
                  </FormField>
                </div>

                {/* Technologies field */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-4">
                  <FormField label={t(`cvType.field.technologies`)}>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                      placeholder={t(`cvType.placeholder.technologies`)}
                      value={proj.tech}
                      onChange={e => onProjectChange(idx, 'tech', e.target.value)}
                    />
                  </FormField>
                </div>
                
                {/* Project description field */}
                <FormField label={t('field.description')}>
                  <textarea
                    className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                    placeholder={t(`cvType.placeholder.project.description`)}
                    value={proj.description}
                    onChange={e => onProjectChange(idx, 'description', e.target.value)}
                  />
                </FormField>
                </div>
              </div>
            );
          }}
        />
        
        {/* Add project button at bottom */}
        <div className="flex justify-start mt-4">
          <IconButton onClick={onAddProject}>
            {Icons.add}
            {t('add.project')}
          </IconButton>
        </div>
      </FormSection>
    </form>
  );
} 