"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    className?: string;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    label,
    placeholder = "Select...",
    error,
    className
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={cn("space-y-1", className)} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-primary-900 dark:text-neutral-100">
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full px-3 py-2 text-left border border-primary-200 dark:border-primary-800 rounded-md",
                        "bg-neutral-50 dark:bg-primary-900",
                        "text-primary-900 dark:text-neutral-100",
                        "focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent",
                        "flex items-center justify-between",
                        error && "border-red-500"
                    )}
                >
                    <span className={!selectedOption ? "text-gray-500" : ""}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </button>

                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg max-h-60 overflow-auto">
                        <div className="p-2 sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    className="w-full pl-8 pr-3 py-2 text-sm border rounded-md bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-accent-500"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="py-1">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-slate-500 text-center">No results found</div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={cn(
                                            "px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800",
                                            value === option.value && "bg-slate-50 dark:bg-slate-800 text-accent-600 font-medium"
                                        )}
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                            setSearch("");
                                        }}
                                    >
                                        {option.label}
                                        {value === option.value && <Check className="h-4 w-4" />}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
