'use client';

import { useAutoResize } from '@/app/utils/useAutoResize';
import { TextareaHTMLAttributes } from 'react';

interface AutoResizeTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  minHeight?: number;
  maxHeight?: number;
}

/**
 * Textarea component that automatically resizes based on content
 */
export function AutoResizeTextarea({ 
  value, 
  onChange, 
  minHeight = 80, 
  maxHeight,
  className = '',
  ...props 
}: AutoResizeTextareaProps) {
  const { textareaRef, adjustHeight } = useAutoResize(minHeight, maxHeight);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    adjustHeight();
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      className={`${className} resize-none overflow-hidden`}
      {...props}
    />
  );
}
