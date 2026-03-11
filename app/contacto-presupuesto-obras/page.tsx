import { Metadata } from 'next';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { contactPageData, siteConfig } from '../../data/content';
import { FAQAccordion } from '@/components/FAQAccordion';
import { ContactForm } from '@/components/ContactForm';
import { BreadcrumbJsonLd, FAQPageJsonLd } from '@/components/StructuredData';

export const metadata: Metadata = {
    title: contactPageData.meta.title,
    description: contactPageData.meta.description,
    alternates: {
        canonical: `${siteConfig.siteUrl}/contacto-presupuesto-obras`,
    },
    openGraph: {
        title: contactPageData.meta.title,
        description: contactPageData.meta.description,
        url: `${siteConfig.siteUrl}/contacto-presupuesto-obras`,
        images: [
            {
                url: "/brand/logo_name_completo_fondo_800x800.jpg",
                alt: "Cuyo Smart",
                width: 800,
                height: 800,
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: contactPageData.meta.title,
        description: contactPageData.meta.description,
        images: ["/brand/logo_name_completo_fondo_800x800.jpg"],
    },
};

export default function Contacto() {
    return (
        <div className="flex flex-col bg-white">
            {/* Structured Data para SEO */}
            <BreadcrumbJsonLd items={[{ name: "Contacto y Presupuestos", path: "/contacto-presupuesto-obras" }]} />
            <FAQPageJsonLd items={contactPageData.faq} />

            {/* 1. Hero Section */}
            <section className="relative py-28 lg:py-36 bg-primary text-white">
                {/* Decorative blurs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-tertiary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-montserrat mb-6">
                        {contactPageData.hero.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light font-opensans">
                        {contactPageData.hero.subtitle}
                    </p>
                </div>
            </section>

            {/* 2. Información Directa – cards flotantes */}
            <section className="py-16 bg-white -mt-10 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Card: Asesoramiento / WhatsApp */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                            <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-xl flex items-center justify-center mb-5 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                                <Phone size={30} />
                            </div>
                            <div className="w-8 h-0.5 bg-secondary mx-auto mb-4 rounded-full" />
                            <h3 className="text-lg font-bold text-primary mb-2 font-montserrat">{contactPageData.directInfo.sales.title}</h3>
                            <p className="text-gray-600 mb-6 font-bold text-lg">{contactPageData.directInfo.sales.phone}</p>
                            <a
                                href={contactPageData.directInfo.sales.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-md hover:shadow-secondary/20 hover:shadow-lg"
                            >
                                <MessageCircle size={18} /> {contactPageData.directInfo.sales.cta}
                            </a>
                        </div>

                        {/* Card: Presupuestos / Email */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <Mail size={30} />
                            </div>
                            <div className="w-8 h-0.5 bg-primary mx-auto mb-4 rounded-full" />
                            <h3 className="text-lg font-bold text-primary mb-2 font-montserrat">{contactPageData.directInfo.admin.title}</h3>
                            <a href={`mailto:${contactPageData.directInfo.admin.email}`} className="text-gray-700 mb-2 font-bold hover:text-secondary transition-colors block">
                                {contactPageData.directInfo.admin.email}
                            </a>
                            <p className="text-gray-500 text-sm">{contactPageData.directInfo.admin.hours}</p>
                        </div>

                        {/* Card: Ubicación */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                            <div className="w-16 h-16 mx-auto bg-tertiary/10 rounded-xl flex items-center justify-center mb-5 text-tertiary group-hover:bg-tertiary group-hover:text-white transition-all duration-300">
                                <MapPin size={30} />
                            </div>
                            <div className="w-8 h-0.5 bg-tertiary mx-auto mb-4 rounded-full" />
                            <h3 className="text-lg font-bold text-primary mb-2 font-montserrat">{contactPageData.directInfo.location.title}</h3>
                            <p className="text-gray-700 mb-2 font-bold">{contactPageData.directInfo.location.address}</p>
                            <p className="text-gray-500 text-sm">{contactPageData.directInfo.location.coverage}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Formulario de Cotización */}
            <section className="py-20 bg-background-secondary">
                <div className="container mx-auto px-6">
                    <ContactForm
                        services={contactPageData.form.services}
                        buttonText={contactPageData.form.buttonText ?? 'ENVIAR CONSULTA'}
                        title={contactPageData.form.title}
                        subtitle={contactPageData.form.subtitle ?? ''}
                    />
                </div>
            </section>

            {/* 4. Ubicación (Mapa) */}
            {contactPageData.location && contactPageData.location.embedUrl && !contactPageData.location.embedUrl.startsWith('__') && contactPageData.location.embedUrl !== "__MAP_PLACEHOLDER__" && (
                <section className="w-full h-[420px] relative bg-gray-200">
                    <iframe
                        src={contactPageData.location.embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación CuyoSmart"
                        className="grayscale hover:grayscale-0 transition duration-500"
                    />
                </section>
            )}

            {/* 5. FAQ Acordeón */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-primary text-3xl font-bold font-montserrat uppercase tracking-wider">
                            Preguntas Frecuentes
                        </h2>
                        <div className="w-12 h-1 bg-secondary mx-auto mt-4 rounded-full" />
                    </div>
                    <FAQAccordion items={contactPageData.faq} />
                </div>
            </section>
        </div>
    );
}
