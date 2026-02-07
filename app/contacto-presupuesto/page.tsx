import { Metadata } from 'next';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { contactPageData } from '../../data/content';

export const metadata: Metadata = {
    title: contactPageData.meta.title,
    description: contactPageData.meta.description,
};

export default function Contacto() {
    return (
        <div className="flex flex-col bg-white">
            {/* 1. Hero Section */}
            <section className="relative py-20 lg:py-32 bg-primary text-white">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-montserrat mb-6">
                        {contactPageData.hero.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light font-opensans">
                        {contactPageData.hero.subtitle}
                    </p>
                </div>
            </section>

            {/* 2. Información Directa */}
            <section className="py-16 bg-white -mt-10 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Bloque 1: Ventas */}
                        <div className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-secondary text-center hover:-translate-y-2 transition duration-300">
                            <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary">
                                <Phone size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-2 font-montserrat">{contactPageData.directInfo.sales.title}</h3>
                            <p className="text-gray-600 mb-6 font-bold text-lg">{contactPageData.directInfo.sales.phone}</p>
                            <a
                                href={contactPageData.directInfo.sales.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-md"
                            >
                                <MessageCircle size={20} /> {contactPageData.directInfo.sales.cta}
                            </a>
                        </div>

                        {/* Bloque 2: Administración */}
                        <div className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-primary text-center hover:-translate-y-2 transition duration-300">
                            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                                <Mail size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-2 font-montserrat">{contactPageData.directInfo.admin.title}</h3>
                            <p className="text-gray-600 mb-2 font-bold">{contactPageData.directInfo.admin.email}</p>
                            <p className="text-gray-500 text-sm">{contactPageData.directInfo.admin.hours}</p>
                        </div>

                        {/* Bloque 3: Ubicación */}
                        <div className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-tertiary text-center hover:-translate-y-2 transition duration-300">
                            <div className="w-16 h-16 mx-auto bg-tertiary/10 rounded-full flex items-center justify-center mb-6 text-tertiary">
                                <MapPin size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-2 font-montserrat">{contactPageData.directInfo.location.title}</h3>
                            <p className="text-gray-600 mb-2 font-bold">{contactPageData.directInfo.location.address}</p>
                            <p className="text-gray-500 text-sm">{contactPageData.directInfo.location.coverage}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Formulario de Cotización */}
            <section className="py-20 bg-background-secondary">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                        <div className="text-center mb-10">
                            <h2 className="text-primary text-3xl font-bold mb-2 font-montserrat">{contactPageData.form.title}</h2>
                            <p className="text-gray-600">{contactPageData.form.subtitle}</p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2 text-sm">Nombre y Apellido *</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-orange/20 outline-none transition" placeholder="Su nombre" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2 text-sm">Empresa / Razón Social</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-orange/20 outline-none transition" placeholder="Nombre de su empresa" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2 text-sm">Teléfono / WhatsApp *</label>
                                    <input type="tel" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-orange/20 outline-none transition" placeholder="+54 9 ..." required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2 text-sm">Email *</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-orange/20 outline-none transition" placeholder="su@email.com" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-sm">Tipo de Servicio *</label>
                                <select className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-orange/20 outline-none transition appearance-none" required>
                                    <option value="" disabled selected>Seleccione una opción</option>
                                    {contactPageData.form.services.map((service, index) => (
                                        <option key={index} value={service}>{service}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-sm">Ubicación de la Obra</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-orange/20 outline-none transition" placeholder="Ej: Luján de Cuyo" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-sm">Mensaje / Detalles</label>
                                <textarea className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-orange/20 outline-none transition h-32 resize-none" placeholder="Describa brevemente su proyecto..." ></textarea>
                            </div>

                            <button type="submit" className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-4 rounded-lg shadow-lg transition transform hover:scale-[1.02] flex items-center justify-center gap-2 uppercase tracking-wide">
                                <Send size={20} /> {contactPageData.form.buttonText}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* 4. Ubicación (Mapa) */}
            {contactPageData.location && (
                <section className="w-full h-[400px] relative bg-gray-200">
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
                    ></iframe>
                </section>
            )}

            {/* 5. FAQ */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-primary text-3xl font-bold mb-12 text-center font-montserrat uppercase tracking-wider">Preguntas Frecuentes</h2>
                    <div className="space-y-6">
                        {contactPageData.faq.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition bg-gray-50">
                                <h3 className="text-primary font-bold text-lg mb-2 flex items-center gap-2">
                                    <span className="text-secondary">?</span> {item.q}
                                </h3>
                                <p className="text-gray-600 leading-relaxed pl-6 border-l-2 border-tertiary">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
