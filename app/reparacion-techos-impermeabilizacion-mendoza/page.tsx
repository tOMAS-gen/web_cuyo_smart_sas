import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search,
    Droplets,
    ShieldCheck,
    Factory,
    Home,
    Truck,
    MessageCircle,
    ArrowRight,
    LucideIcon
} from 'lucide-react';
import { techosData, siteConfig } from '../../data/content';
import { ServiceItem, DifferentialItem } from '@/types/content';
import { BreadcrumbJsonLd, ServiceJsonLd } from '@/components/StructuredData';

export const metadata: Metadata = {
    title: techosData.meta.title,
    description: techosData.meta.description,
    keywords: techosData.meta.keywords,
    alternates: {
        canonical: `${siteConfig.siteUrl}/reparacion-techos-impermeabilizacion-mendoza`,
    },
    openGraph: {
        title: techosData.meta.title,
        description: techosData.meta.description,
        url: `${siteConfig.siteUrl}/reparacion-techos-impermeabilizacion-mendoza`,
        images: [
            {
                url: "/images/techos/08.jpeg",
                alt: "Reparación de Techos e Impermeabilización en Mendoza - CuyoSmart",
                width: 1200,
                height: 630,
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: techosData.meta.title,
        description: techosData.meta.description,
        images: ["/images/techos/08.jpeg"],
    },
};

const iconMap: Record<string, LucideIcon> = {
    Search: Search,
    Droplets: Droplets,
    ShieldCheck: ShieldCheck,
    Factory: Factory,
    Home: Home,
    Truck: Truck
};

export default function ReparacionTechos() {
    return (
        <div className="flex flex-col bg-white">
            <BreadcrumbJsonLd items={[{ name: "Reparación de Techos e Impermeabilización", path: "/reparacion-techos-impermeabilizacion-mendoza" }]} />
            <ServiceJsonLd
                name="Reparación de Techos e Impermeabilización"
                description={techosData.meta.description}
                url="/reparacion-techos-impermeabilizacion-mendoza"
                image={techosData.hero.image}
            />
            {/* 1. Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] flex items-center bg-primary text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {techosData.hero.image && (
                        <Image
                            src={techosData.hero.image}
                            alt="reparacion-techo-impermeabilizacion-mendoza"
                            fill
                            className="object-cover opacity-30"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-r from-primary to-primary/60 shadow-inner"></div>
                </div>

                <div className="container pt-16 lg:pt-24 mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <span className="bg-secondary text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4 inline-block shadow-lg">
                            Solución Definitiva
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold font-montserrat mb-6 leading-tight drop-shadow-xl">
                            {techosData.hero.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed font-light font-opensans mb-10 border-l-4 border-secondary pl-6">
                            {techosData.hero.subtitle}
                        </p>
                        <a
                            href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(techosData.hero.whatsappMessage)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/80 text-primary font-bold py-4 px-10 rounded-cuyo shadow-xl hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide"
                        >
                            <MessageCircle size={24} /> {techosData.hero.cta}
                        </a>
                    </div>
                </div>
            </section>

            {/* 2. El Problema / La Solución */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <h2 className="text-primary text-3xl md:text-4xl font-bold mb-8 font-montserrat border-l-4 border-secondary pl-6 uppercase tracking-wider">
                                {techosData.problemSolution.title}
                            </h2>
                            <p className="text-gray-600 text-lg md:text-xl mb-6 leading-relaxed font-opensans">
                                {techosData.problemSolution.text1}
                            </p>
                            <p className="text-primary text-lg md:text-xl leading-relaxed font-opensans font-bold bg-secondary/5 p-6 rounded-r-xl border-l-4 border-secondary">
                                {techosData.problemSolution.text2}
                            </p>
                        </div>
                        <div className="md:w-1/2 relative">
                            <div className="absolute -inset-4 bg-secondary/10 rounded-xl transform rotate-3"></div>
                            <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/techos/10.jpeg"
                                    alt="reparacion-techo-chapa-zingueria-mendoza"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Desglose del Servicio */}
            <section className="py-24 bg-[#F9FAFB]">
                <div className="container mx-auto px-6">
                    <div className="space-y-24 max-w-5xl mx-auto">
                        {techosData.services.map((service: ServiceItem, index: number) => {
                            const Icon = iconMap[service.icon || 'Search'] || Search;
                            return (
                                <div key={index} className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 hover:border-secondary/30 transition-all duration-500 group">
                                    {/* Imagen Superior */}
                                    <div className="w-full h-[450px] relative overflow-hidden">
                                        {service.image && (
                                            <Image
                                                src={service.image}
                                                alt={service.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition duration-700"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-10 left-10 flex items-center gap-6">
                                            <div className="bg-secondary p-5 rounded-2xl shadow-xl">
                                                <Icon size={40} className="text-primary" />
                                            </div>
                                            <h3 className="text-3xl md:text-4xl font-bold text-white font-montserrat drop-shadow-lg">
                                                {service.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Texto y Botón */}
                                    <div className="p-10 md:p-16">
                                        <p className="text-gray-600 text-lg md:text-2xl leading-relaxed font-opensans mb-10">
                                            {service.description}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            <a
                                                href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(service.whatsappMessage || "")}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/80 text-primary font-bold py-5 px-12 rounded-cuyo shadow-lg hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide text-lg"
                                            >
                                                <MessageCircle size={24} /> {service.cta}
                                            </a>
                                            <Link
                                                href="/contacto-presupuesto-obras"
                                                className="inline-flex items-center justify-center gap-2 text-tertiary hover:text-primary font-bold py-5 px-4 transition-colors duration-200 text-lg uppercase tracking-wider"
                                            >
                                                Pedir Presupuesto Estimado <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. Segmentación & Logística */}
            <section className="py-24 bg-primary text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {techosData.segmentation.map((segment: DifferentialItem, index: number) => {
                            const Icon = iconMap[segment.icon] || Factory;
                            return (
                                <div key={index} className="flex gap-8 items-start p-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                                    <div className="bg-tertiary p-6 rounded-2xl shrink-0 shadow-lg">
                                        <Icon size={36} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-4 font-montserrat text-secondary uppercase tracking-wide">
                                            {segment.title}
                                        </h3>
                                        <p className="text-gray-300 text-lg leading-relaxed font-opensans">
                                            {segment.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 6. Footer CTA */}
            <section className="bg-primary py-24 text-center border-t border-white/10 relative overflow-hidden">
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-montserrat max-w-4xl mx-auto leading-tight">
                        {techosData.footerCTA.title}
                    </h2>
                    <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-opensans">
                        {techosData.footerCTA.text}
                    </p>
                    <a
                        href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(techosData.footerCTA.whatsappMessage)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-5 px-14 rounded-full shadow-2xl hover:-translate-y-1 transition-all duration-200 text-xl tracking-wide"
                    >
                        <MessageCircle size={32} /> {techosData.footerCTA.buttonText}
                    </a>
                </div>
            </section>
        </div>
    );
}
