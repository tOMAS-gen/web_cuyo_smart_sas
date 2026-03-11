'use client';

import { useState, type FormEvent } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/data/content';

interface ContactFormProps {
    services: string[];
    buttonText: string;
    title: string;
    subtitle: string;
}

export function ContactForm({ services, buttonText, title, subtitle }: ContactFormProps) {
    const [sent, setSent] = useState(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);

        const nombre = (data.get('nombre') as string) || '';
        const empresa = (data.get('empresa') as string) || '';
        const telefono = (data.get('telefono') as string) || '';
        const email = (data.get('email') as string) || '';
        const servicio = (data.get('servicio') as string) || '';
        const ubicacion = (data.get('ubicacion') as string) || '';
        const mensaje = (data.get('mensaje') as string) || '';

        // Armar mensaje para WhatsApp
        const lines = [
            `Hola CuyoSmart, completo el formulario de contacto de la web:`,
            ``,
            `*Nombre:* ${nombre}`,
        ];
        if (empresa) lines.push(`*Empresa:* ${empresa}`);
        if (telefono) lines.push(`*Teléfono:* ${telefono}`);
        if (email) lines.push(`*Email:* ${email}`);
        if (servicio) lines.push(`*Servicio:* ${servicio}`);
        if (ubicacion) lines.push(`*Ubicación:* ${ubicacion}`);
        if (mensaje) {
            lines.push(``);
            lines.push(`*Mensaje:*`);
            lines.push(mensaje);
        }

        const text = encodeURIComponent(lines.join('\n'));
        const url = `${siteConfig.whatsappLink}?text=${text}`;

        window.open(url, '_blank', 'noopener,noreferrer');
        setSent(true);
    }

    if (sent) {
        return (
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center py-10">
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <MessageCircle size={36} className="text-green-600" />
                    </div>
                    <h3 className="text-primary text-2xl font-bold mb-3 font-montserrat">
                        ¡Consulta enviada!
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Se abrió WhatsApp con los datos de su consulta. Si no se abrió automáticamente,
                        puede enviarnos un mensaje directamente.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href={`${siteConfig.whatsappLink}?text=Hola%20CuyoSmart,%20quiero%20hacer%20una%20consulta`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-md"
                        >
                            <MessageCircle size={18} /> Abrir WhatsApp
                        </a>
                        <button
                            type="button"
                            onClick={() => setSent(false)}
                            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full transition-all duration-200"
                        >
                            Enviar otra consulta
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
            <div className="text-center mb-10">
                <h2 className="text-primary text-3xl font-bold mb-2 font-montserrat">{title}</h2>
                <p className="text-gray-500">{subtitle}</p>
                <div className="w-12 h-1 bg-secondary mx-auto mt-4 rounded-full" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1.5 text-sm" htmlFor="nombre">
                            Nombre y Apellido <span className="text-secondary">*</span>
                        </label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:bg-white outline-none transition-all duration-200"
                            placeholder="Su nombre"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1.5 text-sm" htmlFor="empresa">
                            Empresa / Razón Social
                        </label>
                        <input
                            id="empresa"
                            name="empresa"
                            type="text"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:bg-white outline-none transition-all duration-200"
                            placeholder="Nombre de su empresa"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1.5 text-sm" htmlFor="telefono">
                            Teléfono / WhatsApp <span className="text-secondary">*</span>
                        </label>
                        <input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:bg-white outline-none transition-all duration-200"
                            placeholder="+54 9 ..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1.5 text-sm" htmlFor="email">
                            Email <span className="text-secondary">*</span>
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:bg-white outline-none transition-all duration-200"
                            placeholder="su@email.com"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1.5 text-sm" htmlFor="servicio">
                        Tipo de Servicio <span className="text-secondary">*</span>
                    </label>
                    <select
                        id="servicio"
                        name="servicio"
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:bg-white outline-none transition-all duration-200 appearance-none"
                        required
                        defaultValue=""
                    >
                        <option value="" disabled>Seleccione una opción</option>
                        {services.map((service, index) => (
                            <option key={index} value={service}>{service}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1.5 text-sm" htmlFor="ubicacion">
                        Ubicación de la Obra
                    </label>
                    <input
                        id="ubicacion"
                        name="ubicacion"
                        type="text"
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:bg-white outline-none transition-all duration-200"
                        placeholder="Ej: Luján de Cuyo"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1.5 text-sm" htmlFor="mensaje">
                        Mensaje / Detalles
                    </label>
                    <textarea
                        id="mensaje"
                        name="mensaje"
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:bg-white outline-none transition-all duration-200 h-32 resize-none"
                        placeholder="Describa brevemente su proyecto..."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-secondary/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                    <Send size={18} /> {buttonText}
                </button>

                <p className="text-center text-xs text-gray-400 mt-2">
                    Al enviar, se abrirá WhatsApp con los datos de su consulta para atención inmediata.
                </p>
            </form>
        </div>
    );
}
