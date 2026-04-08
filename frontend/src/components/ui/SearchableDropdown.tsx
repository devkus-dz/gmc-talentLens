import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export interface SearchableDropdownProps<T> {
    value: T | null;
    onChange: (option: T) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    options: T[];
    isLoading?: boolean;
    placeholder?: string;
    renderOption: (option: T) => React.ReactNode;
    getDisplayValue: (option: T) => string;
    filterNode?: React.ReactNode;
    noOptionsText?: string;
    className?: string;
}

export default function SearchableDropdown<T extends { id?: string; _id?: string }>({
    value,
    onChange,
    searchTerm,
    onSearchChange,
    options,
    isLoading = false,
    placeholder = "Search...",
    renderOption,
    getDisplayValue,
    filterNode,
    noOptionsText = "No results found.",
    className = "w-full"
}: SearchableDropdownProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                if (value) onSearchChange(getDisplayValue(value));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value, getDisplayValue, onSearchChange]);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="relative flex items-center">
                {/* Properly aligned and sized left icon */}
                <Search className="absolute left-4 w-5 h-5 text-base-content/40" />

                {/* Taller input (h-12), larger text, and deep padding to avoid icons */}
                <input
                    type="text"
                    className="input input-bordered w-full pl-12 pr-12 h-12 rounded-xl bg-base-100 focus:outline-primary/20 shadow-sm text-base font-medium"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => {
                        onSearchChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={(e) => {
                        setIsOpen(true);
                        e.target.select();
                    }}
                />

                {/* Properly aligned and sized right icon */}
                <ChevronDown className={`absolute right-4 w-5 h-5 text-base-content/40 pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-content/10 shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col">

                    {filterNode && (
                        <div className="p-3 border-b border-base-content/5 bg-base-200/30 flex items-center justify-between">
                            {filterNode}
                        </div>
                    )}

                    <ul className="max-h-72 overflow-y-auto thin-scrollbar">
                        {isLoading ? (
                            <li className="p-6 text-center flex justify-center"><span className="loading loading-spinner loading-md text-primary"></span></li>
                        ) : options.length > 0 ? (
                            options.map((option, idx) => (
                                <li
                                    key={option.id || option._id || idx}
                                    className="p-4 hover:bg-base-200/60 cursor-pointer border-b border-base-content/5 last:border-none transition-colors"
                                    onClick={() => {
                                        onChange(option);
                                        onSearchChange(getDisplayValue(option));
                                        setIsOpen(false);
                                    }}
                                >
                                    {renderOption(option)}
                                </li>
                            ))
                        ) : (
                            <li className="p-6 text-center text-sm text-base-content/50 font-medium">{noOptionsText}</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}