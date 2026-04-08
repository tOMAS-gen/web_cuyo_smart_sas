import { Metadata } from 'next';
import Image from 'next/image';
import {
    Zap,
    Droplets,
    VolumeX,
    Clock,
    Factory,
    Home,
    MessageCircle,
    LucideIcon
} from 'lucide-react';
import { insulationPageData, siteConfig } from "@/data/content";
import { BreadcrumbJsonLd, ServiceJsonLd, FAQPageJsonLd } from '@/components/StructuredData';

export const metadata: Metadata = {
    title: insulationPageData.meta.title,
    description: insulationPageData.meta.description,
    keywords: insulationPageData.meta.keywords,
    alternates: {
        canonical: `${siteConfig.siteUrl}/aislacion-termica-poliuretano-expandido`,
    },
    openGraph: {
        title: insulationPageData.meta.title,
        description: insulationPageData.meta.description,
        url: `${siteConfig.siteUrl}/aislacion-termica-poliuretano-expandido`,
        images: [
            {
                url: "/images/aislacion/03.jpeg",
                alt: "Aislación Térmica con Poliuretano Expandido en Mendoza - CuyoSmart",
                width: 1200,
                height: 630,
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: insulationPageData.meta.title,
        description: insulationPageData.meta.description,
        images: ["/images/aislacion/03.jpeg"],
    },
};

const iconMap: Record<string, LucideIcon> = {
    Zap,
    Droplets,
    VolumeX,
    Clock,
    Factory,
    Home
};

export default function AislacionTermica() {
    return (
        <div className="flex flex-col bg-white">
            <BreadcrumbJsonLd items={[{ name: "Aislación Térmica Poliuretano", path: "/aislacion-termica-poliuretano-expandido" }]} />
            <FAQPageJsonLd items={insulationPageData.faq} />
            <ServiceJsonLd
                name="Aislación Térmica con Poliuretano Expandido"
                description={insulationPageData.meta.description}
                url="/aislacion-termica-poliuretano-expandido"
                image={insulationPageData.hero.image}
            />
            {/* 1. Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] flex items-center bg-[#0B132B] text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {insulationPageData.hero.image && (
                        <Image
                            src={insulationPageData.hero.image}
                            alt="Proyección de poliuretano expandido en techo de bodega en Mendoza"
                            fill
                            sizes="100vw"
                            className="object-cover opacity-40"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent"></div>
                </div>

                <div className="container pt-16 lg:pt-24 mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <span className="bg-secondary text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4 inline-block shadow-lg">
                            Tecnología In Situ
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold font-montserrat mb-6 leading-tight drop-shadow-xl">
                            {insulationPageData.hero.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed font-light font-opensans mb-10 border-l-4 border-secondary pl-6">
                            {insulationPageData.hero.subtitle}
                        </p>
                        <a
                            href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(insulationPageData.hero.whatsappMessage || "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/80 text-primary font-bold py-4 px-10 rounded-cuyo shadow-xl transition transform hover:scale-105 uppercase tracking-wide"
                        >
                            <MessageCircle size={24} /> {insulationPageData.hero.cta}
                        </a>
                    </div>
                </div>
            </section>

            {/* 2. Introducción Técnica */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-primary text-3xl md:text-4xl font-bold mb-8 font-montserrat uppercase tracking-wider">
                        {insulationPageData.intro.title}
                    </h2>
                    <div className="space-y-6 text-gray-600 text-lg md:text-xl leading-relaxed font-opensans text-justify md:text-center">
                        <p>{insulationPageData.intro.text1}</p>
                        <p className="font-bold text-primary">{insulationPageData.intro.text2}</p>
                    </div>
                </div>
            </section>

            {/* 3. Beneficios Clave */}
            <section className="py-24 bg-background-secondary">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {insulationPageData.benefits.map((benefit, index) => {
                            const Icon = iconMap[benefit.icon] || Zap;
                            return (
                                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-secondary hover:-translate-y-2 transition duration-300">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${benefit.color === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'}`}>
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary mb-4 font-montserrat">{benefit.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. Aplicaciones Estratégicas */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="space-y-24 max-w-5xl mx-auto">
                        {insulationPageData.applications.map((app, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 hover:border-secondary/30 transition-all duration-500">
                                {/* Imagen Superior */}
                                <div className="w-full h-[400px] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary">
                                        {/* Placeholder for application images if specific ones aren't defined in data structure but requested in doc */}
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            {/* Using hero image as fallback if no specific image is available in data structure yet */}
                                            <Image
                                                src={insulationPageData.hero.image || "/images/aislacion/01.jpeg"}
                                                alt={app.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover opacity-80 group-hover:scale-105 transition duration-700"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
                                    <div className="absolute bottom-8 left-8">
                                        <h3 className="text-3xl md:text-4xl font-bold text-white font-montserrat drop-shadow-lg">
                                            {app.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Texto y Botón */}
                                <div className="p-10 md:p-12 bg-white">
                                    <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-opensans mb-8">
                                        {app.text}
                                    </p>
                                    <a
                                        href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(app.whatsappMessage || "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/80 text-primary font-bold py-4 px-10 rounded-cuyo shadow-lg transition transform hover:scale-105 uppercase tracking-wide"
                                    >
                                        <MessageCircle size={24} /> {app.cta}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. El Proceso */}
            <section className="py-24 bg-primary text-white relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center font-montserrat uppercase tracking-wider">
                        El Proceso de Aplicación
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-secondary/30 -z-10"></div>

                        {insulationPageData.process.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-primary border-4 border-secondary rounded-full flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(247,148,29,0.3)] group-hover:scale-110 transition duration-300 z-10">
                                    <span className="text-3xl font-bold text-secondary">{index + 1}</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 font-montserrat text-white">
                                    {step.name}
                                </h3>
                                <p className="text-gray-300 text-lg leading-relaxed font-opensans max-w-xs">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Diferencial Técnico */}
            <section className="py-24 bg-background-secondary">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
                        <h2 className="text-primary text-3xl md:text-4xl font-bold mb-6 font-montserrat uppercase tracking-wider">
                            {insulationPageData.differential.title}
                        </h2>
                        <p className="text-gray-600 text-xl leading-relaxed font-opensans">
                            {insulationPageData.differential.text}
                        </p>
                    </div>
                </div>
            </section>

            {/* 7. Banner Final */}
            <section className="bg-primary py-24 text-center border-t border-white/10 relative overflow-hidden">
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-montserrat max-w-4xl mx-auto leading-tight">
                        {insulationPageData.footerCTA.title}
                    </h2>
                    <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-opensans">
                        {insulationPageData.footerCTA.text}
                    </p>
                    <a
                        href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(insulationPageData.footerCTA.whatsappMessage || "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-4 bg-secondary hover:bg-secondary/80 text-primary font-bold py-5 px-14 rounded-full shadow-2xl transition transform hover:scale-105 text-xl tracking-wide"
                    >
                        <MessageCircle size={32} /> {insulationPageData.footerCTA.buttonText}
                    </a>
                </div>
            </section>
        </div>
    );
}
