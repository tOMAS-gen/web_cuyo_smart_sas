import { 
  Layout, 
  BrickWall, 
  PaintBucket, 
  MessageCircle, 
  Check, 
  Briefcase, 
  Clipboard 
} from "lucide-react";
import { obrasData, siteConfig } from "@/data/content";
import { Metadata } from "next";
import Image from 'next/image';
import { BreadcrumbJsonLd, ServiceJsonLd, FAQPageJsonLd } from '@/components/StructuredData';

export const metadata: Metadata = {
    title: obrasData.meta.title,
    description: obrasData.meta.description,
    keywords: obrasData.meta.keywords,
    alternates: {
        canonical: `${siteConfig.siteUrl}/obras-civiles-construccion-en-seco-mendoza`,
    },
    openGraph: {
        title: obrasData.meta.title,
        description: obrasData.meta.description,
        url: `${siteConfig.siteUrl}/obras-civiles-construccion-en-seco-mendoza`,
        images: [
            {
                url: "/images/obras-civiles/05.jpeg",
                alt: "Obras Civiles y Construcción en Seco en Mendoza - CuyoSmart",
                width: 1200,
                height: 630,
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: obrasData.meta.title,
        description: obrasData.meta.description,
        images: ["/images/obras-civiles/05.jpeg"],
    },
};

const iconMap: Record<string, React.ComponentType<{ size?: number, className?: string }>> = {
    Layout,
    BrickWall,
    PaintBucket
};

export default function ObrasCiviles() {
    return (
        <div className="animate-in fade-in duration-500">
            <BreadcrumbJsonLd items={[{ name: "Obras Civiles y Construcción", path: "/obras-civiles-construccion-en-seco-mendoza" }]} />
            <FAQPageJsonLd items={obrasData.faq} />
            <ServiceJsonLd
                name="Obras Civiles y Construcción en Seco"
                description={obrasData.meta.description}
                url="/obras-civiles-construccion-en-seco-mendoza"
                image={obrasData.hero.image}
            />
            {/* 1. Hero Section */}
            <div className="relative h-[70vh] min-h-[500px] flex items-center bg-[#0B132B] text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {obrasData.hero.image && (
                        <Image
                            src={obrasData.hero.image}
                            alt="Construcción en seco con Steel Framing en oficinas de Mendoza"
                            fill
                            sizes="100vw"
                            className="object-cover opacity-30"
                            priority
                        />
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
                <div className="container pt-16 lg:pt-24 mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <span className="bg-secondary text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4 inline-block shadow-lg">Ejecución Profesional</span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white font-montserrat mb-6 leading-tight">
                            {obrasData.hero.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed font-light font-opensans mb-10 border-l-4 border-secondary pl-6">
                            {obrasData.hero.subtitle}
                        </p>
                        <a
                            href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(obrasData.hero.whatsappMessage || "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/80 text-primary font-bold py-4 px-10 rounded-cuyo shadow-lg transition transform hover:scale-105 uppercase tracking-wide"
                        >
                            <MessageCircle size={24} /> {obrasData.hero.cta}
                        </a>
                    </div>
                </div>
            </div>

            {/* 2. Propuesta de Valor */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h2 className="text-primary text-3xl md:text-4xl font-bold mb-8 font-montserrat">
                        {obrasData.valueProposition.title}
                    </h2>
                    <div className="space-y-6 text-gray-600 text-lg leading-relaxed text-justify md:text-center font-opensans">
                        <p>{obrasData.valueProposition.text1}</p>
                        <p className="font-medium text-primary">{obrasData.valueProposition.text2}</p>
                    </div>
                </div>
            </section>

            {/* 3. Desglose de Servicios */}
            <section className="py-20 bg-background-secondary">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {obrasData.services.map((service, index) => {
                            const ServiceIcon = service.icon ? (iconMap[service.icon] || Layout) : Layout;
                            return (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-secondary hover:-translate-y-2 transition duration-300">
                                    <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-primary">
                                        <ServiceIcon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary mb-4 font-montserrat">{service.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed font-bold">{service.description}</p>
                                    <ul className="space-y-2 mb-6">
                                        {service.features?.map((feature, idx) => (
                                            <li key={idx} className="flex items-start text-sm text-gray-500">
                                                <Check size={16} className="text-tertiary mr-2 mt-0.5 shrink-0" /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    {service.benefit && (
                                        <div className="bg-secondary/10 p-3 rounded text-xs text-primary font-bold mb-6">
                                            ✨ {service.benefit}
                                        </div>
                                    )}
                                    <a
                                        href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(service.whatsappMessage || "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-primary font-bold py-3 px-6 rounded-md transition duration-300"
                                    >
                                        <MessageCircle size={18} /> {service.cta}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. Para Arquitectos y Constructoras */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <span className="text-tertiary font-bold uppercase tracking-widest text-sm mb-2 block">Socios Estratégicos</span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat border-l-4 border-tertiary pl-6">
                                {obrasData.forArchitects.title}
                            </h2>
                            <p className="text-gray-300 text-lg mb-6 leading-relaxed font-opensans">
                                {obrasData.forArchitects.text1}
                            </p>
                            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm mb-6">
                                <p className="text-white font-bold leading-relaxed">
                                    {obrasData.forArchitects.text2}
                                </p>
                            </div>
                            <a
                                href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(obrasData.forArchitects.whatsappMessage || "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 border-2 border-white hover:bg-white hover:text-primary text-white font-bold py-3 px-8 rounded-full transition duration-300"
                            >
                                <MessageCircle size={20} /> {obrasData.forArchitects.cta}
                            </a>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-2xl skew-y-3 transform hover:skew-y-0 transition duration-500 max-w-sm">
                                <Briefcase size={48} className="text-primary mb-4" />
                                <h3 className="text-primary font-bold text-xl mb-2">Profesional a Profesional</h3>
                                <p className="text-gray-600 text-sm">Hablamos su mismo idioma técnico. Entendemos la importancia de los detalles y los plazos de entrega.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Galería de Transformaciones */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-primary text-3xl font-bold mb-12 text-center font-montserrat uppercase tracking-wider">Transformaciones Reales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {obrasData.gallery.cases.map((item, index) => (
                            <div key={index} className="group relative rounded-cuyo overflow-hidden shadow-lg h-80">
                                <Image
                                    src={item.image}
                                    alt={`${item.title.toLowerCase().replace(/ /g, '-')}-Mendoza`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transform group-hover:scale-110 transition duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8 text-white z-10">
                                    <h3 className="text-xl font-bold mb-2 font-montserrat uppercase tracking-wide">{item.title}</h3>
                                    <p className="text-sm text-gray-300 mb-1 font-opensans"><span className="text-secondary font-bold">Desafío:</span> {item.challenge}</p>
                                    <p className="text-sm text-gray-300 font-opensans"><span className="text-tertiary font-bold">Solución:</span> {item.solution}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Diferencial Logístico */}
            <section className="py-20 bg-background-secondary">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-cuyo p-8 md:p-12 shadow-md border border-gray-100 flex flex-col md:flex-row items-start gap-8">
                        <div className="bg-tertiary/10 p-4 rounded-cuyo text-tertiary shrink-0">
                            <Clipboard size={40} className="text-primary" />
                        </div>
                        <div>
                            <h2 className="text-primary text-2xl font-bold mb-4 font-montserrat uppercase tracking-wider">{obrasData.logistics.title}</h2>
                            <p className="text-gray-600 text-lg leading-relaxed font-opensans">{obrasData.logistics.text}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Footer CTA */}
            <section className="bg-white border-t-4 border-secondary py-20 text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-primary text-3xl md:text-4xl font-bold mb-6 font-montserrat uppercase tracking-wider">
                        {obrasData.footerCTA.title}
                    </h2>
                    <p className="text-gray-600 text-xl mb-10 max-w-2xl mx-auto font-opensans leading-relaxed">
                        {obrasData.footerCTA.text}
                    </p>
                    <a
                        href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(obrasData.footerCTA.whatsappMessage || "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/80 text-primary font-bold py-5 px-12 rounded-full shadow-xl transition transform hover:scale-105 text-lg uppercase tracking-widest"
                    >
                        <MessageCircle size={24} /> {obrasData.footerCTA.buttonText}
                    </a>
                </div>
            </section>
        </div>
    );
}