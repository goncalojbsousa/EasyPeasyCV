'use client';

import { CustomSection } from '../types/cv';
import { FormSection } from './ui/form-section';
import { FormField } from './ui/form-field';
import { IconButton } from './ui/icon-button';
import { EmptyState } from './ui/empty-state';
import { Icons } from './ui/icons';
import { useLanguage } from '../contexts/LanguageContext';
import { SortableList, DragHandle } from './dnd/sortable-list';
import { AutoResizeTextarea } from './ui/auto-resize-textarea';

interface CustomSectionCardProps {
  section: CustomSection;
  onTitleChange: (value: string) => void;
  onAddField: () => void;
  onFieldChange: (
    fieldId: string,
    key: 'label' | 'subtitle' | 'value' | 'startMonth' | 'startYear' | 'endMonth' | 'endYear' | 'bullets' | 'current' | 'centerValue',
    value: string | boolean,
  ) => void;
  onRemoveField: (fieldId: string) => void;
  onRemoveSection: () => void;
  onReorderFields?: (fromIndex: number, toIndex: number) => void;
  canReorder?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function CustomSectionCard({
  section,
  onTitleChange,
  onAddField,
  onFieldChange,
  onRemoveField,
  onRemoveSection,
  onReorderFields,
  canReorder = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: CustomSectionCardProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <FormSection
        title={section.title || t('custom.section.default')}
        icon={Icons.actions}
        canReorder={canReorder}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        actionButton={(
          <IconButton onClick={onRemoveSection} variant="danger" size="sm" ariaLabel={t('custom.section.remove')}>
            {Icons.remove}
            {t('custom.section.remove')}
          </IconButton>
        )}
      >
        <div className="space-y-4">
          <FormField label={t('custom.section.name')}>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
              placeholder={t('custom.section.placeholder.name')}
              value={section.title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </FormField>

          {section.fields.length === 0 && <EmptyState message={t('custom.section.empty.fields')} />}

          <SortableList
            length={section.fields.length}
            onReorder={(from, to) => onReorderFields && onReorderFields(from, to)}
            renderItem={(idx) => {
              const field = section.fields[idx];
              return (
                <div
                  key={field.id}
                  className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm relative mb-4 transition-colors duration-300"
                >
                  <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 border-b border-gray-200 dark:border-zinc-700 rounded-t-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {section.fields.length > 1 && (
                        <DragHandle
                          ariaLabel={t('custom.field.reorder')}
                          className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors duration-300"
                        >
                          {Icons.drag}
                        </DragHandle>
                      )}
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {field.label || `${t('custom.field.default')} ${idx + 1}`}
                      </h4>
                    </div>
                    <IconButton onClick={() => onRemoveField(field.id)} variant="danger" size="sm" ariaLabel={t('custom.field.remove')}>
                      {Icons.remove}
                    </IconButton>
                  </div>
                  <div className="p-4 space-y-3">
                    <FormField label={t('custom.field.label')}>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                        placeholder={t('custom.field.placeholder.label')}
                        value={field.label}
                        onChange={(e) => onFieldChange(field.id, 'label', e.target.value)}
                      />
                    </FormField>
                    <FormField label={t('custom.field.subtitle')}>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                        placeholder={t('custom.field.placeholder.subtitle')}
                        value={field.subtitle || ''}
                        onChange={(e) => onFieldChange(field.id, 'subtitle', e.target.value)}
                      />
                    </FormField>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormField label={t('custom.field.start')}>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                            placeholder={t('custom.field.placeholder.month')}
                            value={field.startMonth || ''}
                            onChange={(e) => onFieldChange(field.id, 'startMonth', e.target.value)}
                          />
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                            placeholder={t('custom.field.placeholder.year')}
                            value={field.startYear || ''}
                            onChange={(e) => onFieldChange(field.id, 'startYear', e.target.value)}
                          />
                        </div>
                      </FormField>
                      {!field.current && (
                        <FormField label={t('custom.field.end')}>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                              placeholder={t('custom.field.placeholder.month')}
                              value={field.endMonth || ''}
                              onChange={(e) => onFieldChange(field.id, 'endMonth', e.target.value)}
                            />
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                              placeholder={t('custom.field.placeholder.year')}
                              value={field.endYear || ''}
                              onChange={(e) => onFieldChange(field.id, 'endYear', e.target.value)}
                            />
                          </div>
                        </FormField>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                          checked={!!field.current}
                          onChange={(e) => onFieldChange(field.id, 'current', e.target.checked)}
                        />
                        {t('custom.field.current')}
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                          checked={!!field.centerValue}
                          onChange={(e) => onFieldChange(field.id, 'centerValue', e.target.checked)}
                        />
                        {t('custom.field.center')}
                      </label>
                    </div>
                    <FormField label={t('custom.field.value')}>
                      <AutoResizeTextarea
                        className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                        placeholder={t('custom.field.placeholder.value')}
                        value={field.value}
                        onChange={(e) => onFieldChange(field.id, 'value', e.target.value)}
                        minHeight={80}
                      />
                    </FormField>
                    <FormField label={t('custom.field.bullets')}>
                      <AutoResizeTextarea
                        className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all text-sm text-gray-900 dark:text-gray-100"
                        placeholder={t('custom.field.placeholder.bullets')}
                        value={field.bullets || ''}
                        onChange={(e) => onFieldChange(field.id, 'bullets', e.target.value)}
                        minHeight={80}
                      />
                    </FormField>
                  </div>
                </div>
              );
            }}
          />

          <div className="flex justify-start mt-4">
            <IconButton onClick={onAddField}>
              {Icons.add}
              {t('custom.field.add')}
            </IconButton>
          </div>
        </div>
      </FormSection>
    </div>
  );
}
