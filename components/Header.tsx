"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/data/content';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            requestAnimationFrame(() => { setIsOpen(false); });
        }
    }, [pathname]);

    const navItems = [
        { path: '/', label: 'Inicio' },
        { path: '/reparacion-techos-impermeabilizacion-mendoza', label: 'Techos' },
        { path: '/obras-civiles-construccion-en-seco-mendoza', label: 'Obras Civiles' },
        { path: '/aislacion-termica-poliuretano-expandido', label: 'Aislación' },
        { path: '/proyectos-obras-realizadas', label: 'Proyectos' },
    ];

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                    ? 'bg-primary/95 backdrop-blur-md shadow-2xl'
                    : 'bg-primary shadow-md'
                }`}
        >
            {/* Top Bar */}
            <div className="bg-primary text-white text-xs py-2 hidden md:block border-b border-white/10">
                <div className="container mx-auto px-6 flex justify-between items-center">

                    {/* Izquierda: teléfono + email */}
                    <div className="flex items-center gap-5">
                        <a
                            href={`tel:${siteConfig.phone}`}
                            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
                        >
                            <Phone size={13} className="text-secondary" />
                            {siteConfig.phoneDisplay}
                        </a>
                        <a
                            href={`mailto:${siteConfig.contactEmail}`}
                            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
                        >
                            <Mail size={13} className="text-secondary" />
                            {siteConfig.contactEmail}
                        </a>
                    </div>

                    {/* Derecha: redes sociales */}
                    <div className="flex items-center gap-3">
                        {siteConfig.socialMedia.facebook && !siteConfig.socialMedia.facebook.startsWith('__') && (
                            <a
                                href={siteConfig.socialMedia.facebook}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="text-gray-400 hover:text-secondary transition-colors"
                            >
                                <Facebook size={14} />
                            </a>
                        )}
                        {siteConfig.socialMedia.instagram && !siteConfig.socialMedia.instagram.startsWith('__') && (
                            <a
                                href={siteConfig.socialMedia.instagram}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="text-gray-400 hover:text-secondary transition-colors"
                            >
                                <Instagram size={14} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center group">
                        <Image
                            src="/brand/logo_name_completo_horizontal.svg"
                            alt="CuyoSmart"
                            width={180}
                            height={48}
                            className="h-10 md:h-12 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`relative text-sm font-bold uppercase tracking-wide transition-colors duration-200 pb-1 ${isActive
                                            ? 'text-secondary'
                                            : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    {item.label}
                                    <span
                                        className={`absolute bottom-0 left-0 h-0.5 bg-secondary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                            }`}
                                    />
                                </Link>
                            );
                        })}
                        <Link
                            href="/contacto-presupuesto-obras"
                            className={`bg-secondary hover:bg-secondary/80 text-primary px-6 py-2 rounded-md font-bold text-sm uppercase tracking-wide shadow-lg hover:shadow-secondary/30 hover:-translate-y-0.5 transition-all duration-200 ${pathname === '/contacto-presupuesto-obras' ? 'ring-2 ring-white/50' : ''}`}
                        >
                            CONTACTO
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
                        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={isOpen}
                        aria-controls="mobile-nav"
                    >
                        <span className="transition-all duration-200">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </span>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    id="mobile-nav"
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="mt-4 pb-4 border-t border-white/10 pt-4">
                        <div className="flex flex-col space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-left font-bold py-3 px-4 rounded-md transition-colors duration-200 ${isActive
                                                ? 'text-secondary bg-white/10'
                                                : 'text-white hover:bg-white/5 hover:text-secondary'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                            <Link
                                href="/contacto-presupuesto-obras"
                                onClick={() => setIsOpen(false)}
                                className="bg-secondary text-primary py-3 mx-2 rounded-md text-center font-bold shadow-md uppercase tracking-wide text-sm hover:bg-secondary/80 transition-colors mt-2"
                            >
                                CONTACTO
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
