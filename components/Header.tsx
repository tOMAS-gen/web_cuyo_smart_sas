"use client";

import React, { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { path: '/', label: 'Inicio' },
        { path: '/reparacion-techos-impermeabilizacion', label: 'Techos' },
        { path: '/obras-civiles-remodelaciones', label: 'Obras Civiles' },
        { path: '/aislacion-termica-poliuretano', label: 'Aislación' },
        { path: '/proyectos-obras-realizadas', label: 'Proyectos' },
    ];

    const activeStyle = "text-secondary border-b-2 border-secondary";
    const inactiveStyle = "text-white/80 hover:text-white transition-opacity";

    return (
        <header className="fixed w-full z-50 bg-primary shadow-md transition-all duration-300">
            {/* Top Bar - Contacto Rápido */}
            <div className="bg-primary text-white text-xs py-2 hidden md:block border-b border-white/10">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2 text-gray-300">
                            <Phone size={14} className="text-secondary" /> +54 9 261 555 5555
                        </span>
                        <span className="flex items-center gap-2 text-gray-300">
                            <Mail size={14} className="text-secondary" /> contacto@cuyosmart.com
                        </span>
                    </div>
                    <div className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Líderes en Techado y Aislación Industrial</div>
                </div>
            </div>

            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo_name_completo_horizontal.svg"
                            alt="CuyoSmart"
                            width={180}
                            height={48}
                            className="h-10 md:h-12 w-auto object-contain"
                        />
                    </Link>

                    <div className="hidden md:flex space-x-8 items-center">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`text-sm font-bold uppercase tracking-wide transition-colors duration-300 ${isActive ? activeStyle : inactiveStyle}`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                        <Link
                            href="/contacto-presupuesto"
                            className={`bg-secondary hover:bg-secondary/80 text-primary px-6 py-2 rounded-md font-bold text-sm uppercase tracking-wide transition-all duration-300 shadow-lg ${pathname === '/contacto-presupuesto' ? 'ring-2 ring-white/50' : ''}`}
                        >
                            CONTACTO
                        </Link>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden mt-4 pb-4 animate-in slide-in-from-top-2 border-t border-white/10 pt-4 bg-primary">
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-left font-bold py-2 px-4 ${isActive ? 'text-secondary bg-white/10' : 'text-white hover:bg-white/5'}`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                            <Link
                                href="/contacto-presupuesto"
                                onClick={() => setIsOpen(false)}
                                className="bg-secondary text-primary py-3 mx-4 rounded-md text-center font-bold shadow-md uppercase tracking-wide text-sm"
                            >
                                CONTACTO
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header >
    );
}
