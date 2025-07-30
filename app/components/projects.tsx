'use client';

import { Project } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

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
  const { t, cvType } = useLanguage();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Helper function to generate smart titles for project cards
  const getProjectTitle = (proj: Project, idx: number) => {
    if (proj.name) return proj.name;
    return `Projeto ${idx + 1}`;
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Enhanced auto-scroll with variable speed based on distance from edge
    const scrollThreshold = 150; // pixels from top/bottom
    const maxScrollSpeed = 15;
    
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
    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorderProjects) {
      onReorderProjects(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <form className="space-y-8 flex flex-col items-center">
      <FormSection 
        title="Projetos" 
        icon={Icons.projects}
      >
        {/* Display empty state when no projects exist */}
        {projects.length === 0 && (
          <EmptyState message="Nenhum projeto adicionado" />
        )}
        
        {/* Render each project entry */}
        {projects.map((proj, idx) => (
          <div 
            key={idx} 
            className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm relative mb-6 transition-all duration-300 ${
              draggedIndex === idx ? 'opacity-50 scale-95' : ''
            }`}
            onDragOver={projects.length > 1 ? handleDragOver : undefined}
            onDragEnter={projects.length > 1 ? () => handleDragEnter(idx) : undefined}
            onDrop={projects.length > 1 ? (e) => handleDrop(e, idx) : undefined}
          >
            {/* Drop indicator - shows between items */}
            {dragOverIndex === idx && draggedIndex !== idx && (
              <div className="absolute left-0 -top-3 w-full h-0.5 bg-blue-500 rounded-full z-10"></div>
            )}
            {/* Card header with title */}
            <div className="bg-gray-50 dark:bg-zinc-800 px-4 py-3 border-b border-gray-200 dark:border-zinc-700 rounded-t-lg transition-colors duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {projects.length > 1 && (
                    <div 
                      className="text-gray-400 dark:text-zinc-500 cursor-move hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={handleDragOver}
                      onDragEnter={() => handleDragEnter(idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                      </svg>
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {getProjectTitle(proj, idx)}
                  </h3>
                </div>
                <IconButton 
                  onClick={() => onRemoveProject(idx)} 
                  variant="danger" 
                  size="sm"
                >
                  {Icons.remove}
                </IconButton>
              </div>
            </div>
            
            {/* Card content */}
            <div className="p-4">
            
            {/* Project name and year fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
              <FormField label="Nome do Projeto">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                  placeholder={t(`cvType.placeholder.project.name`)}
                  value={proj.name}
                  onChange={e => onProjectChange(idx, 'name', e.target.value)}
                />
              </FormField>
              <FormField label="Ano">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                  placeholder="Ex: 2023"
                  value={proj.year}
                  onChange={e => onProjectChange(idx, 'year', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Technologies and project link fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
              <FormField label={t(`cvType.field.technologies`)}>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                  placeholder={t(`cvType.placeholder.technologies`)}
                  value={proj.tech}
                  onChange={e => onProjectChange(idx, 'tech', e.target.value)}
                />
              </FormField>
              <FormField label="Link">
                <input
                  type="url"
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                  placeholder="Ex: https://github.com/user/project"
                  value={proj.link}
                  onChange={e => onProjectChange(idx, 'link', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Project description field */}
            <FormField label="Descrição">
              <textarea
                className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                                  placeholder={t(`cvType.placeholder.project.description`)}
                value={proj.description}
                onChange={e => onProjectChange(idx, 'description', e.target.value)}
              />
            </FormField>
            </div>
          </div>
        ))}
        
        {/* Add project button at bottom */}
        <div className="flex justify-start mt-4">
          <IconButton onClick={onAddProject}>
            {Icons.add}
            Adicionar Projeto
          </IconButton>
        </div>
      </FormSection>
    </form>
  );
} 