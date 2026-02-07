"use client";

import { useState } from 'react';
import Image from 'next/image';
import {
    Search,
    FileText,
    ShieldCheck,
    Sparkles,
    MessageCircle,
    ArrowRight,
    LucideIcon
} from 'lucide-react';
import { projectsPageData } from '../../data/content';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';

const iconMap: Record<string, LucideIcon> = {
    Search,
    FileText,
    ShieldCheck,
    Sparkles
};

export default function ProyectosPage() {
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
                                alt={projectsPageData.hero.title}
                                fill
                                className="object-cover opacity-30"
                                priority
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-primary/90"></div>
                    </div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-extrabold font-montserrat mb-6 leading-tight drop-shadow-xl">
                            {projectsPageData.hero.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light font-opensans">
                            {projectsPageData.hero.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. Barra de Filtros */}
            <section className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-6 shadow-sm">
                <div className="container mx-auto px-6 overflow-x-auto">
                    <div className="flex justify-center min-w-max gap-4">
                        {projectsPageData.categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveFilter(cat.label)}
                                className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap border ${
                                    activeFilter === cat.label
                                        ? 'bg-secondary text-white border-secondary shadow-md transform scale-105'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-secondary hover:text-secondary'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Galería de Casos */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full hover:-translate-y-2">
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={project.image}
                                        alt={project.altText || project.title}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                                        {project.tags?.map((tag, i) => (
                                            <span key={i} className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-primary font-montserrat leading-tight mb-2 group-hover:text-secondary transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm font-semibold text-tertiary uppercase tracking-wider">
                                            {project.client}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 font-opensans flex-grow">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredProjects.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-xl">No se encontraron proyectos en esta categoría.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. El Poder de la Transformación */}
            <section className="py-24 bg-background-secondary">
                <div className="container mx-auto px-6">
                    <h2 className="text-primary text-3xl md:text-4xl font-bold mb-16 text-center font-montserrat uppercase tracking-wider">
                        {projectsPageData.beforeAfter.title}
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {projectsPageData.beforeAfter.cases.map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-primary font-montserrat">
                                        {item.title}
                                    </h3>
                                    {item.label && (
                                        <span className="bg-tertiary/10 text-tertiary px-4 py-1 rounded-full text-sm font-bold">
                                            {item.label}
                                        </span>
                                    )}
                                </div>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white flex-grow">
                                    <BeforeAfterSlider
                                        beforeImage={item.before}
                                        afterImage={item.after}
                                    />
                                </div>
                                <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-sm italic">
                                    <ArrowRight size={16} /> Desliza para comparar
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Metodología y Seguridad */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-primary text-3xl md:text-4xl font-bold mb-16 text-center font-montserrat uppercase tracking-wider">
                        {projectsPageData.methodology.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {projectsPageData.methodology.steps.map((step, index) => {
                            const Icon = iconMap[step.icon] || Search;
                            return (
                                <div key={index} className="bg-background-secondary p-8 rounded-xl text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                                    <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors duration-300">
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-primary mb-3 font-montserrat">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 6. Banner Final */}
            <section className="bg-primary py-24 text-center border-t border-white/10 relative overflow-hidden">
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-montserrat max-w-4xl mx-auto leading-tight">
                        {projectsPageData.footerCTA.title}
                    </h2>
                    <p className="text-gray-300 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-opensans font-light">
                        {projectsPageData.footerCTA.subtitle}
                    </p>
                    <a
                        href={`https://wa.me/5492615555555?text=${encodeURIComponent(projectsPageData.footerCTA.whatsappMessage || "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-4 bg-secondary hover:bg-secondary/80 text-primary font-bold py-5 px-14 rounded-full shadow-2xl transition transform hover:scale-105 text-xl tracking-wide"
                    >
                        <MessageCircle size={32} /> {projectsPageData.footerCTA.buttonText}
                    </a>
                </div>
            </section>
        </div>
    );
}
