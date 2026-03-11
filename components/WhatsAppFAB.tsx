"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/data/content';

export const WhatsAppFAB = () => {
    const whatsappUrl = `${siteConfig.whatsappLink}?text=${encodeURIComponent("Hola CuyoSmart, quisiera hacer una consulta.")}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-0 overflow-hidden bg-[#25D366] text-white rounded-full shadow-2xl
                       transition-all duration-300 ease-in-out
                       hover:bg-[#20bd5a] hover:shadow-[#25D366]/40 hover:shadow-xl
                       hover:gap-3 hover:pr-5
                       group"
            aria-label="¿Hablamos? Contactar por WhatsApp"
        >
            {/* Tooltip sobre el botón */}
            <div className="absolute -top-11 right-0 bg-white text-primary text-xs font-bold py-1.5 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-gray-100">
                ¿En qué podemos ayudarte?
                <div className="absolute -bottom-1 right-5 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100" />
            </div>

            {/* Ícono */}
            <span className="p-4 shrink-0">
                <MessageCircle size={32} className="drop-shadow-md" />
            </span>

            {/* Texto expandible (visible solo en hover, desktop) */}
            <span className="text-sm font-bold uppercase tracking-wide whitespace-nowrap max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out hidden sm:inline-block">
                ¿Hablamos?
            </span>

            {/* Ping animado */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:hidden pointer-events-none" />
        </a>
    );
};
