"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption<T = string> {
  value: T;
  label: ReactNode;
  searchText?: string;
}

interface SelectMenuProps<T = string> {
  options: SelectOption<T>[];
  value?: T;
  placeholder: ReactNode;
  onSelect: (value: T) => void;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  align?: "left" | "right";
  searchable?: boolean;
  searchPlaceholder?: string;
  filterOption?: (option: SelectOption<T>, search: string) => boolean;
  isOptionEqual?: (optionValue: T, value?: T) => boolean;
  renderTriggerLabel?: (option?: SelectOption<T>) => React.ReactNode;
  renderOption?: (option: SelectOption<T>, selected: boolean) => React.ReactNode;
}

export function SelectMenu<T = string>({
  options,
  value,
  placeholder,
  onSelect,
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
  align = "left",
  searchable = false,
  searchPlaceholder = "Search...",
  filterOption,
  isOptionEqual,
  renderTriggerLabel,
  renderOption,
}: SelectMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const equality = isOptionEqual || ((optValue: T, current?: T) => optValue === current);

  const selectedOption = useMemo(
    () => options.find((opt) => equality(opt.value, value)),
    [options, value, equality]
  );

  const filteredOptions = useMemo(() => {
    if (!searchable || search.trim() === "") return options;
    const lowered = search.trim().toLowerCase();
    return options.filter((opt) => {
      if (filterOption) return filterOption(opt, lowered);
      const haystack = opt.searchText
        ? opt.searchText.toLowerCase()
        : `${typeof opt.label === "string" ? opt.label : ""} ${String(opt.value)}`.toLowerCase();
      return haystack.includes(lowered);
    });
  }, [options, search, searchable, filterOption]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const alignmentClass = align === "right" ? "right-0" : "left-0";

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        className={`w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all text-left text-sm text-gray-900 dark:text-gray-100 ${buttonClassName}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <span>{renderTriggerLabel ? renderTriggerLabel(selectedOption) : selectedOption?.label || placeholder}</span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${alignmentClass} mt-2 w-full bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 z-50 ${dropdownClassName}`}
        >
          {searchable && (
            <div className="px-3 pt-3 pb-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          )}
          <div className="max-h-64 overflow-y-auto py-1">
            {filteredOptions.map((opt) => {
              const isSelected = equality(opt.value, value);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  className={`w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors duration-200 ${
                    isSelected ? "bg-sky-50 dark:bg-sky-900/20 font-semibold text-sky-700 dark:text-sky-400" : ""
                  }`}
                  onClick={() => {
                    onSelect(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  {renderOption ? renderOption(opt, isSelected) : opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
