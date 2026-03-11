import Image from 'next/image';
import { Facebook, Instagram, Linkedin, ChevronRight, MapPin, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { siteConfig } from '@/data/content';
 
export default function Footer() {
    const year = new Date().getFullYear();
 
    return (
        <footer className="bg-primary text-white pt-20 pb-10 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
 
                    {/* Columna 1: Logo + descripción + redes */}
                    <div className="col-span-1">
                        <Link href="/">
                            <Image
                                src="/brand/logo_name_completo_horizontal.svg"
                                alt="CuyoSmart"
                                width={200}
                                height={64}
                                className="h-16 mb-6 w-auto opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed font-sans">
                            Soluciones integrales de techado y aislación para Empresas, Bodegas y Consorcios en Mendoza. Calidad garantizada desde 2009.
                        </p>
                        <div className="flex space-x-3">
                            {[
                                { Icon: Facebook, label: 'Facebook', url: siteConfig.socialMedia.facebook },
                                { Icon: Instagram, label: 'Instagram', url: siteConfig.socialMedia.instagram },
                                { Icon: Linkedin, label: 'LinkedIn', url: siteConfig.socialMedia.linkedin },
                            ].filter(({ url }) => url && !url.startsWith('__')).map(({ Icon, label, url }) => (
                                <a
                                    key={label}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/50
                                               hover:text-secondary hover:border-secondary hover:scale-110 hover:bg-secondary/5
                                               transition-all duration-200"
                                >
                                    <Icon size={18} strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>
  
                    {/* Columna 2: Servicios */}
                    <div>
                        <h3 className="text-sm font-bold mb-6 text-secondary uppercase tracking-widest">Servicios</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                <Link href="/reparacion-techos-impermeabilizacion-mendoza" className="flex items-center hover:text-white transition-colors duration-200 group">
                                    <ChevronRight size={14} className="mr-2 text-secondary group-hover:translate-x-1 transition-transform" />
                                    Reparación de Techos
                                </Link>
                            </li>
                            <li>
                                <Link href="/aislacion-termica-poliuretano-expandido" className="flex items-center hover:text-white transition-colors duration-200 group">
                                    <ChevronRight size={14} className="mr-2 text-secondary group-hover:translate-x-1 transition-transform" />
                                    Aislación Industrial
                                </Link>
                            </li>
                            <li>
                                <Link href="/obras-civiles-construccion-en-seco-mendoza" className="flex items-center hover:text-white transition-colors duration-200 group">
                                    <ChevronRight size={14} className="mr-2 text-secondary group-hover:translate-x-1 transition-transform" />
                                    Obras Civiles y Mantenimiento
                                </Link>
                            </li>
                            <li>
                                <Link href="/proyectos-obras-realizadas" className="flex items-center hover:text-white transition-colors duration-200 group">
                                    <ChevronRight size={14} className="mr-2 text-secondary group-hover:translate-x-1 transition-transform" />
                                    Portafolio de Proyectos
                                </Link>
                            </li>
                        </ul>
                    </div>
  
                    {/* Columna 3: Contacto */}
                    <div>
                        <h3 className="text-sm font-bold mb-6 text-secondary uppercase tracking-widest">Contacto</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                <a href={`mailto:${siteConfig.contactEmail}`} className="flex items-center hover:text-white transition-colors duration-200">
                                    <Mail size={15} className="mr-3 text-tertiary shrink-0" />
                                    {siteConfig.contactEmail}
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${siteConfig.phone}`} className="flex items-center hover:text-white transition-colors duration-200">
                                    <Phone size={15} className="mr-3 text-tertiary shrink-0" />
                                    {siteConfig.phoneDisplay}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
 
                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>&copy; {year} CuyoSmart SAS. Todos los derechos reservados.</p>
                    <p className="text-gray-500">Diseño y desarrollo web – Mendoza, Argentina</p>
                </div>
            </div>
        </footer>
    );
}