"use client";

import Image from "next/image";
import Link from "next/link";
import { homeData } from "../data/content";
import * as LucideIcons from "lucide-react";

const iconMap: Record<string, LucideIcons.LucideIcon> = {
  Hammer: LucideIcons.Hammer,
  HardHat: LucideIcons.HardHat,
  Thermometer: LucideIcons.Thermometer,
  Settings: LucideIcons.Settings,
  Truck: LucideIcons.Truck,
  ShieldCheck: LucideIcons.ShieldCheck,
  HelpCircle: LucideIcons.HelpCircle
};

export default function Home() {
  const { hero, services, differentials, featuredProjects, footerUp } = homeData;

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || LucideIcons.HelpCircle;
    return <Icon size={36} className="text-primary" strokeWidth={1.5} />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center bg-primary">
          <div className="absolute inset-0 z-0">
            {hero.image && (
              <Image
                src={hero.image}
                alt="Hero Background"
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/60 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center md:text-left pt-20">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 font-montserrat drop-shadow-2xl">
                {hero.title}
              </h1>
              <h2 className="text-gray-200 text-lg md:text-2xl mb-10 leading-relaxed font-light font-opensans max-w-3xl border-l-4 border-secondary pl-6 ml-1 md:ml-0">
                {hero.subtitle}
              </h2>
              <div className="flex flex-col md:flex-row gap-5">
                <a
                  href={`https://wa.me/5492615555555?text=${encodeURIComponent("Hola CuyoSmart quisiera hacer una consulta general")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-secondary hover:bg-secondary/80 text-white text-center font-bold py-4 px-10 rounded-cuyo shadow-xl text-lg transition transform hover:scale-105 uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <LucideIcons.MessageCircle size={24} /> {hero.ctaPrimary}
                </a>
                <Link
                  href="/proyectos-obras-realizadas"
                  className="border-2 border-white/70 hover:bg-white hover:text-primary text-white text-center font-bold py-4 px-10 rounded-cuyo text-lg transition uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  {hero.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Sección de Servicios (Zig-Zag / Editorial) */}
        <section className="bg-white">
          {services.map((service) => {
            const isImageLeft = service.orientation === 'left';
            const isObras = service.id === 'obras-civiles-remodelaciones';

            return (
              <div key={service.id} className="flex flex-col md:flex-row h-auto md:h-[600px]">
                {/* Imagen */}
                <div className={`w-full md:w-1/2 relative h-[400px] md:h-full ${isImageLeft ? 'md:order-1' : 'md:order-2'}`}>
                  {service.image && (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Texto */}
                <div className={`w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 ${isObras ? 'bg-background-secondary' : 'bg-white'} ${isImageLeft ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="max-w-xl">
                    <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-montserrat">
                      {service.title}
                    </h3>
                    <div className="text-gray-600 text-lg mb-8 leading-relaxed font-opensans whitespace-pre-line">
                      {service.description}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Botón WhatsApp */}
                      <a
                        href={`https://wa.me/5492615555555?text=${encodeURIComponent(service.whatsappMessage || "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-secondary hover:bg-secondary/80 text-primary font-bold py-3 px-8 rounded-cuyo shadow transition transform hover:scale-105 flex items-center justify-center gap-2 text-center"
                      >
                        <LucideIcons.MessageCircle size={20} /> Consultar
                      </a>

                      {/* Botón Más Info */}
                      <Link
                        href={`/${service.id}`}
                        className="text-primary hover:text-secondary font-bold py-3 px-2 flex items-center justify-center gap-2 transition"
                      >
                        {service.linkText} <LucideIcons.ArrowRight size={18} />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat text-primary uppercase tracking-wider">
                {differentials.title}
              </h2>
              <div className="w-20 h-1 bg-secondary mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {differentials.items.map((diff, index) => (
                <div key={index} className="text-center group p-8 bg-white rounded-cuyo border border-white hover:border-secondary/40 hover:shadow-2xl transition-all duration-300">
                  <div className="w-20 h-20 mx-auto bg-primary/5 rounded-cuyo flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                    {getIcon(diff.icon)}
                  </div>
                  <h3 className="text-xl font-bold mb-4 font-montserrat text-primary">{diff.title}</h3>
                  <p className="text-gray-600 font-opensans leading-relaxed max-sm mx-auto">{diff.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Proyectos Destacados (Grilla Simple) */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-primary text-3xl font-bold font-montserrat mb-2">{featuredProjects.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {featuredProjects.items.map((project, index) => (
                <Link
                  key={index}
                  href="/proyectos-obras-realizadas"
                  className="group relative h-96 overflow-hidden"
                >
                  <Image
                    src={project.image}
                    alt={project.label}
                    fill
                    className="object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-300"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-white font-bold text-2xl font-montserrat border-l-4 border-primary pl-4">{project.label}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/proyectos-obras-realizadas"
                className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded transition uppercase tracking-wide"
              >
                {featuredProjects.cta}
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Banner Final de Contacto (Urgency) */}
        <section className="bg-primary py-20 border-t border-gray-800">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-8 font-montserrat">
              {footerUp.title}
            </h2>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-10">
              <a
                href={`https://wa.me/5492615555555?text=${encodeURIComponent("Hola CuyoSmart quisiera hacer una consulta")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center bg-secondary hover:bg-secondary/80 text-primary font-bold py-5 px-12 rounded-cuyo shadow-lg transition transform hover:scale-105 text-lg uppercase tracking-wider"
              >
                <LucideIcons.MessageCircle size={28} className="mr-3" /> {footerUp.cta}
              </a>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-8 text-gray-400 text-sm font-sans">
              <span className="flex items-center justify-center gap-2"><LucideIcons.Settings size={16} /> {footerUp.location}</span>
              <span className="flex items-center justify-center gap-2"><LucideIcons.Phone size={16} /> +54 9 261 555 5555</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
