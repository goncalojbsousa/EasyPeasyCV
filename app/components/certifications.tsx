'use client';

import { useState, useRef, useEffect } from 'react';
import { Certification } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';

/**
 * Props interface for the Certifications component
 */
interface CertificationsProps {
  /** Array of certification entries */
  certifications: Certification[];
  /** Handler for updating certification fields */
  onCertificationChange: (idx: number, field: string, value: string) => void;
  /** Handler for adding new certification entry */
  onAddCertification: () => void;
  /** Handler for removing certification entry */
  onRemoveCertification: (idx: number) => void;
  /** Handler for reordering certification entries */
  onReorderCertifications?: (fromIndex: number, toIndex: number) => void;
}

/**
 * Custom Date Picker Component
 */
/**
 * Custom Date Picker Component
 * Provides a calendar interface for date selection
 * @param value - Current selected date value
 * @param onChange - Callback function when date is selected
 * @param placeholder - Placeholder text for the input
 */
function DatePicker({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date to ISO string format (YYYY-MM-DD)
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Format date for display in Portuguese locale
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
  };

  // Generate array of days for the current month including empty cells for alignment
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Handle date selection and close dropdown
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange(formatDate(date));
    setIsOpen(false);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const [showYearPicker, setShowYearPicker] = useState(false);
  const [yearRange, setYearRange] = useState(() => {
    const currentYear = new Date().getFullYear();
    return { start: currentYear - 10, end: currentYear + 10 };
  });

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Navigate to previous decade in year picker
  const goToPreviousYear = () => {
    setYearRange(prev => ({ start: prev.start - 10, end: prev.end - 10 }));
  };

  // Navigate to next decade in year picker
  const goToNextYear = () => {
    setYearRange(prev => ({ start: prev.start + 10, end: prev.end + 10 }));
  };

  // Set current date to today and close dropdowns
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    onChange(formatDate(today));
    setIsOpen(false);
    setShowYearPicker(false);
  };

  // Clear selected date and close dropdowns
  const clearDate = () => {
    setSelectedDate(null);
    onChange('');
    setIsOpen(false);
    setShowYearPicker(false);
  };

  // Select year and close year picker
  const selectYear = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearPicker(false);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Generate array of years for the year picker
  const generateYearRange = () => {
    const years = [];
    for (let year = yearRange.start; year <= yearRange.end; year++) {
      years.push(year);
    }
    return years;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div className="relative">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all pr-10 text-gray-900 dark:text-gray-100"
          placeholder={placeholder}
          value={formatDisplayDate(value)}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 p-4 z-50">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowYearPicker(!showYearPicker)}
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-2 py-1 rounded"
              >
                {monthNames[currentDate.getMonth()]}
              </button>
              <button
                type="button"
                onClick={() => setShowYearPicker(!showYearPicker)}
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 px-2 py-1 rounded"
              >
                {currentDate.getFullYear()}
              </button>
            </div>
            <button
              type="button"
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Year Picker */}
          {showYearPicker && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={goToPreviousYear}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded transition-colors duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {yearRange.start} - {yearRange.end}
                </span>
                <button
                  type="button"
                  onClick={goToNextYear}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded transition-colors duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {generateYearRange().map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => selectYear(year)}
                    className={`
                      p-2 text-sm rounded transition-all duration-150
                      ${year === currentDate.getFullYear()
                        ? 'bg-blue-600 text-white font-semibold shadow-md'
                        : 'hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                      }
                    `}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-zinc-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                type="button"
                className={`
                  p-2 text-sm rounded-lg transition-all duration-150
                  ${!day ? 'invisible' : ''}
                  ${day && selectedDate && day.toDateString() === selectedDate.toDateString()
                    ? 'bg-blue-600 text-white font-semibold shadow-md'
                    : day && day.toDateString() === new Date().toDateString()
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50'
                    : day
                    ? 'hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                    : ''
                  }
                `}
                onClick={() => day && handleDateSelect(day)}
                disabled={!day}
              >
                {day ? day.getDate() : ''}
              </button>
            ))}
          </div>

          {/* Calendar Footer */}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={clearDate}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded transition-colors"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Certifications component manages the certifications and courses section of the CV form
 * @param certifications - Array of certification entries
 * @param onCertificationChange - Function to handle certification field updates
 * @param onAddCertification - Function to add new certification entry
 * @param onRemoveCertification - Function to remove certification entry
 * @returns JSX element representing the certifications form section
 */
/**
 * Certifications component
 * Manages certification and course entries with drag-and-drop reordering
 * @param props - Component props including certification data and handlers
 * @returns JSX element representing the certifications form section
 */
export function Certifications({
  certifications,
  onCertificationChange,
  onAddCertification,
  onRemoveCertification,
  onReorderCertifications
}: CertificationsProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Helper function to generate smart titles for certification cards
  const getCertificationTitle = (cert: Certification, idx: number) => {
    if (cert.name && cert.issuer) return `${cert.name} | ${cert.issuer}`;
    if (cert.name) return cert.name;
    if (cert.issuer) return cert.issuer;
    return `Certificação ${idx + 1}`;
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
    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorderCertifications) {
      onReorderCertifications(draggedIndex, dropIndex);
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
        title="Certificações/Cursos" 
        icon={Icons.certifications}
      >
        {/* Display empty state when no certifications exist */}
        {certifications.length === 0 && (
          <EmptyState message="Nenhuma certificação adicionada" />
        )}
        
        {/* Render each certification entry */}
        {certifications.map((cert, idx) => (
          <div 
            key={idx} 
            className={`bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm relative mb-6 transition-all duration-300 ${
              draggedIndex === idx ? 'opacity-50 scale-95' : ''
            }`}
            onDragOver={certifications.length > 1 ? handleDragOver : undefined}
            onDragEnter={certifications.length > 1 ? () => handleDragEnter(idx) : undefined}
            onDrop={certifications.length > 1 ? (e) => handleDrop(e, idx) : undefined}
          >
            {/* Drop indicator - shows between items */}
            {dragOverIndex === idx && draggedIndex !== idx && (
              <div className="absolute left-0 -top-3 w-full h-0.5 bg-blue-500 rounded-full z-10"></div>
            )}
            {/* Card header with title */}
            <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 border-b border-gray-200 dark:border-zinc-700 rounded-t-lg transition-colors duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {certifications.length > 1 && (
                    <div 
                      className="text-gray-400 dark:text-zinc-500 cursor-move hover:text-gray-600 dark:hover:text-zinc-300 transition-colors duration-300"
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
                    {getCertificationTitle(cert, idx)}
                  </h3>
                </div>
                <IconButton 
                  onClick={() => onRemoveCertification(idx)} 
                  variant="danger" 
                  size="sm"
                >
                  {Icons.remove}
                </IconButton>
              </div>
            </div>
            
            {/* Card content */}
            <div className="p-4">
            
            {/* Certification name and issuer fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
              <FormField label="Certificação">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                  placeholder="Ex: Certificação AWS Cloud Practitioner"
                  value={cert.name}
                  onChange={e => onCertificationChange(idx, 'name', e.target.value)}
                />
              </FormField>
              <FormField label="Emissor/Instituição">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                  placeholder="Ex: Udemy, Alura, AWS"
                  value={cert.issuer}
                  onChange={e => onCertificationChange(idx, 'issuer', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Completion date, hours, and validation link fields */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
              <FormField label="Data de Conclusão">
                <DatePicker
                  value={cert.completionDate}
                  onChange={(value) => onCertificationChange(idx, 'completionDate', value)}
                  placeholder="Selecionar data"
                />
              </FormField>
              <FormField label="Carga Horária">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                  placeholder="Ex: 40 horas"
                  value={cert.hours}
                  onChange={e => onCertificationChange(idx, 'hours', e.target.value)}
                />
              </FormField>
              <FormField label="Link de Validação">
                <input
                  type="url"
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                  placeholder="Ex: https://certificado.instituicao.com/123456"
                  value={cert.validationLink}
                  onChange={e => onCertificationChange(idx, 'validationLink', e.target.value)}
                />
              </FormField>
            </div>
            
            {/* Description field */}
            <FormField label="Descrição">
              <textarea
                className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                placeholder="Ex: Curso focado em desenvolvimento de APIs REST com Node.js..."
                value={cert.description}
                onChange={e => onCertificationChange(idx, 'description', e.target.value)}
              />
            </FormField>
            </div>
          </div>
        ))}
        
        {/* Add certification button at bottom */}
        <div className="flex justify-start mt-4">
          <IconButton onClick={onAddCertification}>
            {Icons.add}
            Adicionar Certificação/Curso
          </IconButton>
        </div>
      </FormSection>
    </form>
  );
} 