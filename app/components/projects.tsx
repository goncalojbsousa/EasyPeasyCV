'use client';

import { Project } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';

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
}

/**
 * Projects component manages the projects section of the CV form
 * @param projects - Array of project entries
 * @param onProjectChange - Function to handle project field updates
 * @param onAddProject - Function to add new project entry
 * @param onRemoveProject - Function to remove project entry
 * @returns JSX element representing the projects form section
 */
export function Projects({
  projects,
  onProjectChange,
  onAddProject,
  onRemoveProject
}: ProjectsProps) {
  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title="Projetos" 
        icon={Icons.projects}
        actionButton={
          <IconButton onClick={onAddProject}>
            {Icons.add}
            Adicionar Projeto
          </IconButton>
        }
      >
        {/* Display empty state when no projects exist */}
        {projects.length === 0 && (
          <EmptyState message="Nenhum projeto adicionado" />
        )}
        
        {/* Render each project entry */}
        {projects.map((proj, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 relative mb-6">
            {/* Remove button positioned at top right */}
            <IconButton 
              onClick={() => onRemoveProject(idx)} 
              variant="danger" 
              size="sm"
              className="absolute top-2 right-4"
            >
              {Icons.remove}
            </IconButton>
            
            {/* Project name and year fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField label="Nome do Projeto">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Portfolio Website"
                  value={proj.name}
                  onChange={e => onProjectChange(idx, 'name', e.target.value)}
                />
              </FormField>
              <FormField label="Ano">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: 2023"
                  value={proj.year}
                  onChange={e => onProjectChange(idx, 'year', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Technologies and project link fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField label="Tecnologias">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: React, Node.js, MongoDB"
                  value={proj.tech}
                  onChange={e => onProjectChange(idx, 'tech', e.target.value)}
                />
              </FormField>
              <FormField label="Link">
                <input
                  type="url"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: https://github.com/utilizador/projeto"
                  value={proj.link}
                  onChange={e => onProjectChange(idx, 'link', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Project description field */}
            <FormField label="Descrição">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                placeholder="Breve descrição do projeto, objetivos, resultados..."
                value={proj.description}
                onChange={e => onProjectChange(idx, 'description', e.target.value)}
              />
            </FormField>
          </div>
        ))}
      </FormSection>
    </form>
  );
} 