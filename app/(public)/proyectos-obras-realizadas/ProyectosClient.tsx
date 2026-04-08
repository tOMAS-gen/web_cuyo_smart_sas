"use client";

import { useState } from 'react';
import Image from 'next/image';
import {
    Search,
    FileText,
    ShieldCheck,
    Sparkles,
    MessageCircle,
    LucideIcon
} from 'lucide-react';
import { projectsPageData, siteConfig } from '@/data/content';

const iconMap: Record<string, LucideIcon> = {
    Search,
    FileText,
    ShieldCheck,
    Sparkles
};

export default function ProyectosClient() {
    const [activeFilter, setActiveFilter] = useState("Todos");

    const filteredProjects = activeFilter === "Todos"
        ? projectsPageData.projects
        : projectsPageData.projects.filter(p => {
            if (activeFilter === "Industrial y Bodegas") return p.category === "Industrial";
            if (activeFilter === "Comercial y Oficinas") return p.category === "Comercial";
            if (activeFilter === "Residencial") return p.category === "Residencial";
            return true;
        });

    return (
        <div className="flex flex-col bg-white">
            {/* 1. Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center bg-primary text-white overflow-hidden">
                <div className="absolute inset-0 z-0 flex">
                    <div className="w-full h-full relative">
                        {projectsPageData.hero.image && (
                            <Image
                                src={projectsPageData.hero.image}
                                alt="Proyectos y obras realizadas en Mendoza - CuyoSmart"
                                fill
                                sizes="100vw"
                                className="object-cover opacity-30"
                                priority
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
                    </div>
                </div>

                <div className="container pt-16 mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <span className="bg-secondary text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4 inline-block shadow-lg">
                            Portafolio
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold font-montserrat mb-6 leading-tight">
                            {projectsPageData.hero.title}
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed font-light font-opensans border-l-4 border-secondary pl-6">
                            {projectsPageData.hero.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. Galería Filtrable */}
            <section className="py-24 bg-background-secondary min-h-[800px]">
                <div className="container mx-auto px-6">
                    {/* Filtros */}
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {projectsPageData.categories.map((cat, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveFilter(cat.label)}
                                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-md ${activeFilter === cat.label
                                        ? 'bg-secondary text-white scale-105'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-primary'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid de Proyectos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={project.image}
                                        alt={project.altText || project.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                                        {project.category}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h2 className="text-xl font-bold text-primary mb-3 font-montserrat line-clamp-2">
                                        {project.title}
                                    </h2>
                                    <div className="text-sm text-gray-400 font-bold mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                        {project.client}
                                    </div>
                                    <p className="text-gray-600 font-opensans leading-relaxed mb-6 line-clamp-3">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                                        {(project.tags || []).map((tag, i) => (
                                            <span key={i} className="text-xs text-secondary font-bold bg-secondary/10 px-2 py-1 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Metodología de Trabajo */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-primary text-3xl font-bold text-center mb-16 font-montserrat uppercase tracking-wider">
                        {projectsPageData.methodology.title}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {projectsPageData.methodology.steps.map((step, index) => {
                            const Icon = iconMap[step.icon] || Sparkles;
                            return (
                                <div key={index} className="text-center group">
                                    <div className="w-20 h-20 mx-auto bg-background-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:-translate-y-2 transition-all duration-300">
                                        <Icon size={32} className="text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-primary mb-3 font-montserrat">{step.title}</h3>
                                    <p className="text-gray-500 font-opensans">{step.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. Footer CTA */}
            <section className="bg-primary py-24 text-center border-t border-white/10 relative overflow-hidden">
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-montserrat max-w-4xl mx-auto leading-tight">
                        {projectsPageData.footerCTA.title}
                    </h2>
                    <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-opensans">
                        {projectsPageData.footerCTA.subtitle}
                    </p>
                    <a
                        href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(projectsPageData.footerCTA.whatsappMessage || "Hola CuyoSmart")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-5 px-14 rounded-full shadow-2xl hover:-translate-y-1 transition-all duration-200 text-xl tracking-wide"
                    >
                        <MessageCircle size={32} /> {projectsPageData.footerCTA.buttonText}
                    </a>
                </div>
            </section>
        </div>
    );
}
