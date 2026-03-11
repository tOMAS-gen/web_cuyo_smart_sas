import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { homeData, siteConfig } from "../data/content";
import * as LucideIcons from "lucide-react";

export const metadata: Metadata = {
  title: homeData.meta.title,
  description: homeData.meta.description,
  openGraph: {
    title: homeData.meta.title,
    description: homeData.meta.description,
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
  other: {
    "og:site_name": "CuyoSmart",
    "business:contact_data:street_address": "Mendoza",
    "business:contact_data:locality": "Mendoza",
    "business:contact_data:region": "Mendoza",
    "business:contact_data:postal_code": "5500",
    "business:contact_data:country_name": "AR"
  },
};
const iconMap: Record<string, LucideIcons.LucideIcon> = {
  Hammer: LucideIcons.Hammer,
  HardHat: LucideIcons.HardHat,
  Thermometer: LucideIcons.Thermometer,
  Settings: LucideIcons.Settings,
  Truck: LucideIcons.Truck,
  ShieldCheck: LucideIcons.ShieldCheck,
  HelpCircle: LucideIcons.HelpCircle,
};

export default function Home() {
  const { hero, services, differentials, featuredProjects, footerUp } = homeData;

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || LucideIcons.HelpCircle;
    return <Icon size={36} className="text-secondary" strokeWidth={1.5} />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="grow">

        {/* 1. Hero Section */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center bg-primary">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            {hero.image && (
              <Image
                src={hero.image}
                alt="empresa-mantenimiento-industrial-mendoza"
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Hero content */}
          <div className="container mx-auto px-6 relative z-10 text-center md:text-left pt-24">
            <div className="max-w-4xl">

              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/40 text-secondary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 animate-fade-in-up backdrop-blur-sm">
                <LucideIcons.Award size={14} />
                <span>+17 años de trayectoria · +500 obras realizadas</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 font-montserrat drop-shadow-2xl animate-fade-in-up animation-delay-100">
                {hero.title}
              </h1>
              <p className="text-gray-200 text-lg md:text-2xl mb-10 leading-relaxed font-light font-opensans max-w-3xl border-l-4 border-secondary pl-6 ml-1 md:ml-0 animate-fade-in-up animation-delay-200">
                {hero.subtitle}
              </p>

              <div className="flex flex-col md:flex-row gap-5 animate-fade-in-up animation-delay-300">
                <a
                  href={`${siteConfig.whatsappLink}?text=${encodeURIComponent("Hola CuyoSmart quisiera hacer una consulta general")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-secondary hover:bg-secondary/80 text-primary text-center font-bold py-4 px-10 rounded-cuyo shadow-xl shadow-secondary/20 text-lg uppercase tracking-wide flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 focus:ring-4 focus:ring-secondary/50 focus:outline-none"
                >
                  <LucideIcons.MessageCircle size={24} /> {hero.ctaPrimary}
                </a>
                <Link
                  href="/proyectos-obras-realizadas"
                  className="border-2 border-white/70 hover:bg-white hover:text-primary text-white text-center font-bold py-4 px-10 rounded-cuyo text-lg uppercase tracking-wide flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 focus:ring-4 focus:ring-white/50 focus:outline-none"
                >
                  {hero.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60 animate-bounce-slow">
            <span className="text-xs uppercase tracking-widest font-bold">Servicios</span>
            <LucideIcons.ChevronDown size={24} />
          </div>
        </section>

        {/* 2. Sección de Servicios (Zig-Zag / Editorial) */}
        <section className="bg-white">
          {services.map((service) => {
            const isImageLeft = service.orientation === 'left';
            const isObras = service.id === 'obras-civiles-construccion-en-seco-mendoza';

            return (
              <div key={service.id} className="flex flex-col md:flex-row h-auto md:h-[600px]">
                {/* Imagen */}
                <div className={`w-full md:w-1/2 relative h-[400px] md:h-full overflow-hidden ${isImageLeft ? 'md:order-1' : 'md:order-2'}`}>
                  {service.image && (
                    <Image
                      src={service.image}
                      alt={`${service.title.toLowerCase().replace(/ /g, '-')}-mendoza`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Texto */}
                <div className={`w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 ${isObras ? 'bg-background-secondary' : 'bg-white'} ${isImageLeft ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-montserrat">
                      {service.title}
                    </h2>
                    <div className="text-gray-600 text-lg mb-8 leading-relaxed font-opensans whitespace-pre-line">
                      {service.description}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(service.whatsappMessage || "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-secondary hover:bg-secondary/80 text-primary font-bold py-3 px-8 rounded-cuyo shadow hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-center focus:ring-4 focus:ring-secondary/50 focus:outline-none"
                      >
                        <LucideIcons.MessageCircle size={20} /> Consultar
                      </a>
                      <Link
                        href={`/${service.id}`}
                        className="text-primary hover:text-secondary font-bold py-3 px-2 flex items-center justify-center gap-2 transition-colors duration-200 focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:outline-none"
                      >
                        {service.linkText} <LucideIcons.ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* 3. Diferenciales Técnicos */}
        <section className="py-24 bg-background-secondary">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat text-primary uppercase tracking-wider">
                {differentials.title}
              </h3>
              <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {differentials.items.map((diff, index) => (
                <div
                  key={index}
                  className="relative text-center group p-8 bg-white rounded-xl border border-gray-100 hover:border-secondary/30 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Número decorativo de fondo */}
                  <span className="absolute top-4 right-6 text-7xl font-extrabold text-gray-100 select-none group-hover:text-secondary/10 transition-colors duration-300 leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto bg-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-secondary/10 transition-all duration-300">
                      {getIcon(diff.icon)}
                    </div>
                    <h3 className="text-xl font-bold mb-4 font-montserrat text-primary">{diff.title}</h3>
                    <p className="text-gray-600 font-opensans leading-relaxed max-w-xs mx-auto">{diff.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Proyectos Destacados */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-primary text-3xl font-bold font-montserrat mb-2 uppercase tracking-wider">
                {featuredProjects.title}
              </h2>
              <div className="w-16 h-1 bg-secondary mx-auto rounded-full mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 rounded-xl overflow-hidden shadow-2xl">
              {featuredProjects.items.map((project, index) => (
                <Link
                  key={index}
                  href="/proyectos-obras-realizadas"
                  className="group relative h-96 overflow-hidden"
                >
                   <Image
                    src={project.image}
                                     alt={`${project.label} - CuyoSmart Mendoza`}
                    fill
                    className="object-cover transform group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transition duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <p className="text-white font-bold text-2xl font-montserrat border-l-4 border-secondary pl-4 mb-2">{project.label}</p>
                    <span className="text-secondary text-sm font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Ver proyectos <LucideIcons.ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/proyectos-obras-realizadas"
                className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-10 rounded-cuyo uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5"
              >
                {featuredProjects.cta} <LucideIcons.ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Banner Final de Contacto (Urgency) */}
        <section className="bg-primary py-20 border-t border-white/10 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 font-montserrat">
              {footerUp.title}
            </h2>
            <p className="text-gray-400 mb-10 text-lg max-w-xl mx-auto">Respuesta en menos de 24 hs. Presupuesto sin cargo.</p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10">
              <a
                href={`${siteConfig.whatsappLink}?text=${encodeURIComponent("Hola CuyoSmart quisiera hacer una consulta")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center bg-secondary hover:bg-secondary/80 text-primary font-bold py-5 px-12 rounded-cuyo shadow-lg shadow-secondary/20 hover:-translate-y-1 transition-all duration-200 text-lg uppercase tracking-wider"
              >
                <LucideIcons.MessageCircle size={28} className="mr-3" /> {footerUp.cta}
              </a>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-8 text-gray-400 text-sm font-sans">
              <span className="flex items-center justify-center gap-2">
                <LucideIcons.MapPin size={15} className="text-tertiary" /> {footerUp.location}
              </span>
              <span className="flex items-center justify-center gap-2">
                <LucideIcons.Phone size={15} className="text-tertiary" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-white transition-colors">{siteConfig.phoneDisplay}</a>
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}