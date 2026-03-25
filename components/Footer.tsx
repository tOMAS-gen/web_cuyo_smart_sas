import Image from 'next/image';
import { Facebook, Instagram, MessageCircle, ChevronRight, MapPin, Mail, Phone } from 'lucide-react';
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
                        <div className="flex gap-3 flex-wrap">
                            {[
                                { Icon: Facebook, label: 'Facebook', url: siteConfig.socialMedia.facebook },
                                { Icon: Instagram, label: 'Instagram', url: siteConfig.socialMedia.instagram },
                            ].filter(({ url }) => url && !url.startsWith('__')).map(({ Icon, label, url }) => (
                                <a
                                    key={label}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center text-white/50
                                               hover:text-secondary hover:border-secondary hover:scale-110 hover:bg-secondary/5
                                               transition-all duration-200"
                                >
                                    <Icon size={20} strokeWidth={1.5} />
                                </a>
                            ))}
                            {siteConfig.whatsappLink && !siteConfig.whatsappNumber.startsWith('__') && (
                                <a
                                    href={`${siteConfig.whatsappLink}?text=${encodeURIComponent('Hola CuyoSmart, quiero hacer una consulta')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="WhatsApp"
                                    className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center text-white/50
                                               hover:text-secondary hover:border-secondary hover:scale-110 hover:bg-secondary/5
                                               transition-all duration-200"
                                >
                                    <MessageCircle size={20} strokeWidth={1.5} />
                                </a>
                            )}
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

                    {/* Columna 3: Cobertura */}
                    <div>
                        <h3 className="text-sm font-bold mb-6 text-secondary uppercase tracking-widest">Cobertura</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            {['Gran Mendoza', 'Valle de Uco', 'Zona Este'].map(item => (
                                <li key={item} className="flex items-start">
                                    <MapPin size={15} className="mr-2 text-tertiary shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 4: Contacto */}
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
                <div className="border-t border-white/10 pt-8 flex flex-col items-center gap-2 text-xs text-gray-400">
                    <p>&copy; {year} CuyoSmart SAS. Todos los derechos reservados.</p>
                    <p className="text-gray-500">
                        Diseño y desarrollo web por{' '}
                        <a
                            href="https://genmarketing.com.ar"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white transition-colors duration-200"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
                        >
                            <span style={{ fontWeight: 600 }}>›gen</span>marketing
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
