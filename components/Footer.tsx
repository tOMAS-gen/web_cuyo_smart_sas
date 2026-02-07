import Image from 'next/image';
import { Facebook, Instagram, Linkedin, ChevronRight, MapPin, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-primary text-white pt-20 pb-10 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
                    <div className="col-span-1">
                        <Link href="/">
                            <Image src="/logo_name_completo_horizontal.svg" alt="CuyoSmart" width={200} height={64} className="h-16 mb-6 w-auto" />
                        </Link>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed font-sans">Soluciones integrales de techado y aislación para Empresas, Bodegas y Consorcios en Mendoza. Calidad garantizada desde 2009.</p>
                        <div className="flex space-x-4">
                            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/60 hover:text-secondary hover:border-secondary transition-all duration-300">
                                    <Icon size={18} strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Servicios</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link href="/reparacion-techos-impermeabilizacion" className="flex items-center hover:text-tertiary transition">
                                    <ChevronRight size={14} className="mr-2 text-secondary" /> Reparación de Techos
                                </Link>
                            </li>
                            <li>
                                <Link href="/aislacion-termica-poliuretano" className="flex items-center hover:text-tertiary transition">
                                    <ChevronRight size={14} className="mr-2 text-secondary" /> Aislación Industrial
                                </Link>
                            </li>
                            <li>
                                <Link href="/obras-civiles-remodelaciones" className="flex items-center hover:text-tertiary transition">
                                    <ChevronRight size={14} className="mr-2 text-secondary" /> Obras Civiles y Mantenimiento
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Cobertura</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            {['Gran Mendoza', 'Valle de Uco', 'Zona Este'].map(item => (
                                <li key={item} className="flex items-start"><MapPin size={16} className="mr-2 text-tertiary shrink-0 mt-0.5" /> <span>{item}</span></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Contacto</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center"><Mail size={16} className="mr-3 text-tertiary" /> contacto@cuyosmart.com</li>
                            <li className="flex items-center"><Phone size={16} className="mr-3 text-tertiary" /> +54 9 261 XXX XXXX</li>
                            <li className="flex items-start"><MapPin size={16} className="mr-3 text-tertiary mt-1" /> Dorrego, Guaymallén</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; 2026 CuyoSmart SAS. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
