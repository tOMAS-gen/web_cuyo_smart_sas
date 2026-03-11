'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
    q: string;
    a: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-3">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <div
                        key={index}
                        className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen
                                ? 'border-secondary/40 shadow-md shadow-secondary/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex items-center justify-between text-left px-6 py-5 bg-white hover:bg-gray-50 transition-colors duration-200"
                            aria-expanded={isOpen}
                        >
                            <span className="text-primary font-bold text-base pr-4 flex items-center gap-3">
                                <span className="text-secondary text-lg font-extrabold shrink-0">?</span>
                                {item.q}
                            </span>
                            <ChevronDown
                                size={20}
                                className={`text-secondary shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'
                                }`}
                        >
                            <p className="text-gray-600 leading-relaxed px-6 pb-5 pl-14 border-l-0 bg-gray-50/50">
                                {item.a}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
