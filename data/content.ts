import { HomeData, TechosData, InsulationPageData, ObrasData, ProjectsPageData, ContactPageData } from '../types/content';

const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+54 9 261 555 5555";
const EMAIL_ADDRESS = process.env.NEXT_PUBLIC_EMAIL_ADDRESS || "info@cuyosmart.com";
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contacto@cuyosmart.com";
const ADDRESS = process.env.NEXT_PUBLIC_ADDRESS || "Dorrego, Guaymallén, Mendoza";
const WHATSAPP_LINK = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://wa.me/5492615555555";
const GOOGLE_MAPS_EMBED_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.686037722766!2d-68.82992928481177!3d-32.87999998094098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e08d1c7a3b3a9%3A0x123456789abcdef!2sDorrego%2C%20Mendoza!5e0!3m2!1ses!2sar!4v1620000000000!5m2!1ses!2sar";

export const homeData: HomeData = {
    meta: {
        title: "Empresa de Mantenimiento y Obras Civiles en Mendoza | CuyoSmart",
        description: "Soluciones integrales para industrias, bodegas y hogares. Expertos en recuperación de techos, construcción en seco y aislación térmica. 17 años de experiencia."
    },
    hero: {
        title: "Soluciones Integrales de Mantenimiento e Infraestructura",
        subtitle: "Calidad industrial y respaldo técnico para empresas, bodegas y hogares. Ejecución garantizada desde 2009.",
        image: "/home/techo-industrial.jpeg",
        ctaPrimary: "Hablar por WhatsApp",
        ctaSecondary: "Ver Proyectos Realizados"
    },
    services: [
        {
            id: 'reparacion-techos-impermeabilizacion',
            title: "Recuperación de Cubiertas",
            description: "Soluciones definitivas a filtraciones. Diagnóstico, cambio de chapas, zinguería e impermeabilización.",
            linkText: "Más información",
            whatsappMessage: "Hola CuyoSmart, necesito asesoramiento técnico por reparación de techos.",
            image: "/home/recuperacion-cubiertas.jpeg",
            orientation: "left"
        },
        {
            id: 'obras-civiles-remodelaciones',
            title: "Infraestructura Híbrida: Tradicional y Steel Framing",
            description: "Adaptamos el sistema constructivo a la necesidad de su empresa o vivienda. No nos limitamos a un solo método: \n\n✓ Obra Tradicional: Solidez para ampliaciones, fachadas y reformas estructurales. \n✓ Construcción en Seco: Rapidez y limpieza para oficinas internas, cielorrasos y divisiones.",
            linkText: "Más información",
            whatsappMessage: "Hola, me interesa un presupuesto para construcción (Tradicional / Seco).",
            image: "/home/obras-civiles.jpeg",
            orientation: "right"
        },
        {
            id: 'aislacion-termica-poliuretano',
            title: "Tecnología de Aislación",
            description: "Eficiencia energética y control de temperatura para bodegas, galpones y hogares.",
            linkText: "Más información",
            whatsappMessage: "Hola, me interesa cotizar aislación térmica con poliuretano.",
            image: "/home/aislacion.jpeg",
            orientation: "left"
        }
    ],
    differentials: {
        title: "¿Por qué elegir CuyoSmart?",
        items: [
            {
                title: "Solución 360°",
                description: "Reparamos la estructura completa, no solo lo estético.",
                icon: "Settings"
            },
            {
                title: "Logística Propia",
                description: "Materiales y andamios puestos en obra por nosotros.",
                icon: "Truck"
            },
            {
                title: "Garantía Escrita",
                description: "Respaldo real sobre mano de obra y materiales.",
                icon: "ShieldCheck"
            }
        ]
    },
    featuredProjects: {
        title: "Nuestra capacidad de ejecución.",
        cta: "Ver Portafolio Completo",
        items: [
            {
                image: "/home/obras-civiles.jpeg",
                label: "Mantenimiento Industrial"
            },
            {
                image: "/home/obras-civiles.jpeg",
                label: "Obra Comercial"
            },
            {
                image: "/home/obras-civiles.jpeg",
                label: "Residencial"
            }
        ]
    },
    footerUp: {
        title: "¿Tiene una urgencia o un proyecto?",
        cta: "Enviar WhatsApp al Técnico",
        email: EMAIL_ADDRESS,
        location: "Mendoza y Gran Mendoza."
    }
};

export const techosData: TechosData = {
    meta: {
        title: "Reparación de Techos e Impermeabilización Industrial | CuyoSmart",
        description: "Soluciones definitivas a filtraciones. Diagnóstico estructural, cambio de chapas, zinguería y membranas. Servicio para industrias y hogares en Mendoza."
    },
    hero: {
        title: "Recuperación y Mantenimiento Integral de Cubiertas",
        subtitle: "Diagnóstico experto, reparación estructural e impermeabilización definitiva. Extendemos la vida útil de su techo industrial o residencial.",
        image: "/home/techo-industrial.jpeg",
        cta: "Solicitar Visita Técnica",
        whatsappMessage: "Hola CuyoSmart necesito una visita tecnica por mi techo"
    },
    problemSolution: {
        title: "No tapamos el problema, lo resolvemos de raíz.",
        text1: "Muchas empresas se limitan a aplicar membrana sobre superficies dañadas u oxidadas. En CuyoSmart, entendemos el techo como un sistema completo.",
        text2: "Antes de impermeabilizar, realizamos un diagnóstico estructural. Si hay chapas podridas, zinguería deficiente o pendientes mal calculadas, lo reparamos primero. Garantizamos que la inversión que hace hoy, no la tenga que volver a hacer el año que viene."
    },
    services: [
        {
            title: "Diagnóstico y Zinguería (La base)",
            description: "El agua entra por los detalles. Antes de cualquier tratamiento, revisamos y reparamos canaletas, bajadas, cumbreras y babetas. Reemplazamos chapas en mal estado para asegurar el correcto desagüe.",
            icon: "Search",
            image: "/home/techo-industrial.jpeg",
            cta: "Consultar por Reparación/Zinguería",
            whatsappMessage: "Hola CuyoSmart, tengo problemas de zingueria o chapas en mi techo"
        },
        {
            title: "Impermeabilización (La protección)",
            description: "Aplicación profesional de membranas asfálticas y líquidas de alto tránsito. Seleccionamos el material idóneo según el tipo de techo (losa, chapa o teja) para garantizar estanqueidad total y durabilidad ante el sol de Mendoza.",
            icon: "Droplets",
            image: "/home/techo-industrial.jpeg",
            cta: "Presupuesto Impermeabilización",
            whatsappMessage: "Hola, necesito un presupuesto para impermeabilizar un techo"
        },
        {
            title: "Aislación y Eficiencia (El plus)",
            description: "La solución doble propósito. Mejoramos la eficiencia de la cubierta aplicando espuma de poliuretano, que actúa como barrera térmica (frío/calor) y sella todas las grietas y uniones, evitando filtraciones por condensación.",
            icon: "ShieldCheck",
            image: "/home/techo-industrial.jpeg",
            cta: "Cotizar Aislación Térmica",
            whatsappMessage: "Hola, me interesa cotizar aislacion termica con poliuretano"
        }
    ],
    segmentation: [
        {
            title: "Para Industrias y Bodegas",
            description: "Sabemos que su operativa no puede frenar. Realizamos trabajos con normas de seguridad (ART, EPP) y rapidez de ejecución para no interferir en su producción.",
            icon: "Factory"
        },
        {
            title: "Logística Propia",
            description: "Materiales puestos en obra. Nosotros gestionamos la compra, el traslado y la subida de materiales. Servicio llave en mano.",
            icon: "Truck"
        }
    ],
    gallery: {
        title: "Resultados a la vista.",
        description: "Recuperación funcional de desagües pluviales en nave industrial.",
        before: "/home/techo-industrial.jpeg",
        after: "/home/techo-industrial.jpeg"
    },
    logistics: {
        title: "Logística Propia",
        description: "Materiales puestos en obra. Nosotros gestionamos la compra, el traslado y la subida de materiales. Servicio llave en mano."
    },
    footerCTA: {
        title: "¿Filtraciones o calor excesivo?",
        text: "Actúe antes de la próxima lluvia. Un diagnóstico a tiempo ahorra dinero.",
        buttonText: "Hablar con un Técnico Ahora",
        whatsappMessage: "Hola CuyoSmart, tengo problemas de zingueria o chapas en mi techo"
    }
};

export const insulationPageData: InsulationPageData = {
    meta: {
        title: "Aislación Térmica con Poliuretano Expandido en Mendoza | CuyoSmart",
        description: "Proyección de espuma de poliuretano in situ. Solución definitiva para control de temperatura y condensación en bodegas, galpones y techos residenciales."
    },
    hero: {
        title: "Aislación Térmica de Alto Rendimiento",
        subtitle: "Tecnología de Poliuretano Expandido proyectado in situ. Control de temperatura, eliminación de condensación y ahorro energético inmediato.",
        image: "/home/aislacion.jpeg",
        cta: "Cotizar Aislación por WhatsApp",
        whatsappMessage: "Hola, me interesa cotizar aislacion termica con poliuretano"
    },
    intro: {
        title: "La barrera definitiva contra el clima de Cuyo.",
        text1: "En una zona de amplitudes térmicas extremas como Mendoza, la chapa desnuda no es suficiente. El poliuretano proyectado es un sistema de aislación monolítico (sin juntas) que se adhiere perfectamente a la superficie.",
        text2: "No solo bloquea el calor del verano y el frío del invierno; sella grietas, evita el 'goteo' por condensación y refuerza la estructura del techo al comportarse como una viga solidaria."
    },
    benefits: [
        {
            title: "Eficiencia Energética",
            desc: "Reduce hasta un 40% el gasto en climatización (Aire Acondicionado/Calefacción). La inversión se paga sola con el ahorro de energía.",
            icon: "Zap",
            color: "secondary"
        },
        {
            title: "Adiós Condensación",
            desc: "Elimina el choque térmico que produce el goteo interno en invierno, protegiendo mercadería y maquinaria de la humedad.",
            icon: "Droplets",
            color: "tertiary"
        },
        {
            title: "Aislación Acústica",
            desc: "Amortigua drásticamente el ruido de la lluvia o el granizo sobre la chapa, mejorando el ambiente laboral.",
            icon: "VolumeX",
            color: "tertiary"
        },
        {
            title: "Rapidez de Aplicación",
            desc: "Cubrimos cientos de metros cuadrados en un solo día, sin necesidad de desmontar el techo ni frenar la actividad de su empresa.",
            icon: "Clock",
            color: "secondary"
        }
    ],
    applications: [
        {
            title: "Control Térmico Industrial",
            text: "Vital para la conservación del vino y productos sensibles. Garantizamos una temperatura estable en la nave, reduciendo la carga de los equipos de frío.",
            icon: "Factory",
            cta: "Cotizar Galpón/Bodega",
            whatsappMessage: "Hola, necesito presupuesto para aislar un galpon/bodega"
        },
        {
            title: "Confort en el Hogar",
            text: "Transformamos casas calurosas en espacios habitables. Aplicable sobre techos de chapa, losa o teja existente sin obras molestas.",
            icon: "Home",
            cta: "Cotizar Techo de Casa",
            whatsappMessage: "Hola, quisiera aislar el techo de mi casa"
        }
    ],
    process: [
        { step: "Paso 1", name: "Limpieza", desc: "Preparación de la superficie para asegurar adherencia." },
        { step: "Paso 2", name: "Proyección", desc: "Aplicación de espuma de alta densidad (según requerimiento)." },
        { step: "Paso 3", name: "Protección UV", desc: "Aplicación de pintura protectora (blanca o terracota) para evitar la degradación por el sol." }
    ],
    differential: {
        title: "Densidad y Espesor Garantizado",
        text: "No vendemos aire. En CuyoSmart aplicamos la densidad real pactada en el presupuesto. Contamos con maquinaria de alta presión que asegura una mezcla perfecta de los componentes y una espuma rígida y duradera."
    },
    footerCTA: {
        title: "Deje de perder energía (y dinero) por el techo.",
        text: "La inversión más inteligente para su propiedad. Confort inmediato.",
        buttonText: "Consultar Precio por m²",
        whatsappMessage: "Hola, quisiera saber el precio del m2 de poliuretano"
    }
};

export const obrasData: ObrasData = {
    meta: {
        title: "Obras Civiles y Construcción en Seco: Oficinas y Reformas | CuyoSmart",
        description: "Empresa constructora especializada en obras civiles, construcción en seco, remodelación de oficinas y locales en Mendoza."
    },
    hero: {
        title: "Infraestructura y Obras Civiles: Ejecución Profesional",
        subtitle: "Construcción en seco y tradicional para la expansión de su empresa. Versatilidad técnica para proyectos llave en mano.",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1920",
        cta: "Cotizar Proyecto"
    },
    valueProposition: {
        title: "Transformamos espacios, potenciamos su estructura.",
        text1: "La infraestructura de una empresa debe ser dinámica. En CuyoSmart combinamos la rapidez de la construcción en seco con la solidez de la albañilería tradicional.",
        text2: "Ya sea que necesite montar oficinas operativas dentro de una nave industrial, remodelar un local comercial o ampliar una residencia, ofrecemos ejecución precisa, lectura de planos y cumplimiento estricto de los tiempos de obra."
    },
    services: [
        {
            title: "Construcción en Seco (Steel Framing & Durlock)",
            description: "La solución ideal para empresas que buscan rapidez y limpieza.",
            features: ["Divisiones de oficinas y tabiquería interior.", "Cielorrasos desmontables y acústicos.", "Revestimientos y estructuras ligeras."],
            benefit: "Obra rápida, sin escombros y con excelentes propiedades de aislación.",
            icon: "Layout"
        },
        {
            title: "Obra Tradicional y Albañilería",
            description: "Solidez estructural para ampliaciones y reformas mayores.",
            features: ["Mampostería, revoques y contrapisos.", "Ampliaciones de planta y reformas de fachada.", "Obras húmedas complementarias."],
            benefit: "Construcción sólida y duradera para proyectos que requieren máxima resistencia.",
            icon: "BrickWall"
        },
        {
            title: "Mantenimiento Edilicio Integral",
            description: "Cuidamos el valor de sus instalaciones.",
            features: ["Pintura industrial y comercial.", "Reparación de pisos y revestimientos.", "Mantenimiento general de infraestructura."],
            icon: "PaintBucket"
        }
    ],
    forArchitects: {
        title: "Su socio técnico en la ejecución",
        text1: "Sabemos que delegar una obra es un acto de confianza. Trabajamos codo a codo con estudios de arquitectura y constructoras, actuando como su brazo ejecutor.",
        text2: "Nuestro compromiso: Interpretación fiel de planos, personal asegurado, dirección técnica en sitio y respeto absoluto por el diseño original. Usted proyecta, nosotros materializamos.",
        cta: "Hablemos de Alianzas",
        whatsappMessage: "Hola, soy arquitecto/profesional y me interesa trabajar con ustedes"
    },
    gallery: {
        cases: [
            {
                title: "Solución Industrial",
                challenge: "Crear oficinas administrativas dentro de un galpón.",
                solution: "Estructura Steel Framing con aislación acústica.",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
            },
            {
                title: "Renovación Comercial",
                challenge: "Renovación de local para franquicia.",
                solution: "Cielorrasos, pintura y tabiquería en tiempo récord.",
                image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800"
            }
        ]
    },
    logistics: {
        title: "Gestión Integral de Obra",
        text: "Centralizamos la gestión de materiales, escombros y personal. Entregamos la obra lista para usar, minimizando el impacto en su rutina diaria o en la operatividad de su negocio."
    },
    footerCTA: {
        title: "¿Tiene un plano o una idea para reformar?",
        text: "Analicemos juntos la viabilidad técnica y económica de su proyecto.",
        buttonText: "Enviar Planos / Consultar",
        whatsappMessage: "Hola tengo un proyecto de obra y quiero asesoramiento"
    }
};

export const projectsPageData: ProjectsPageData = {
    meta: {
        title: "Galería de Obras y Proyectos Realizados en Mendoza | CuyoSmart",
        description: "Portafolio de obras. Vea nuestros trabajos en mantenimiento industrial, reparación de techos y construcción civil para empresas como Banco Columbia y Samaco."
    },
    hero: {
        title: "Nuestra Experiencia en Obra",
        subtitle: "Más de 17 años materializando soluciones. Calidad de ejecución comprobable en industrias, comercios y residencias.",
        image: "/home/techo-industrial.jpeg" // Using a default for now, will be replaced by component logic or specific image if provided
    },
    categories: [
        { id: "Todos", label: "Todos" },
        { id: "Industrial", label: "Industrial y Bodegas" },
        { id: "Comercial", label: "Comercial y Oficinas" },
        { id: "Residencial", label: "Residencial" }
    ],
    projects: [
        {
            id: 1,
            title: "Mantenimiento Integral de Cubierta",
            client: "SAMACO / Bodega",
            image: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800",
            description: "Recuperación de 2.000 m² de techo. Reparación de zinguería, cambio de chapas traslúcidas y proyección de poliuretano para control térmico.",
            category: "Industrial",
            tags: ["#Techos", "#Industrial"],
            altText: "mantenimiento-techo-bodega-mendoza"
        },
        {
            id: 2,
            title: "Remodelación y Adecuación de Oficinas",
            client: "Banco Columbia / Empresa Privada",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
            description: "Obra civil llave en mano. Construcción en seco para divisiones internas, pintura e iluminación. Ejecución en horario nocturno para no afectar atención al público.",
            category: "Comercial",
            tags: ["#ObrasCiviles", "#Comercial"],
            altText: "remodelacion-oficinas-banco-columbia"
        },
        {
            id: 3,
            title: "Aislación Térmica Residencial",
            client: "Barrio Privado (Luján/Maipú)",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
            description: "Solución definitiva a problemas de temperatura. Aplicación de poliuretano sobre losa existente y protección UV.",
            category: "Residencial",
            tags: ["#Aislacion", "#Residencial"],
            altText: "aislacion-termica-casa-barrio-privado"
        },
        {
            id: 4,
            title: "Nave Logística",
            client: "Distribuidora Regional",
            image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
            description: "Impermeabilización total de nave logística. Garantía de estanqueidad por 10 años.",
            category: "Industrial",
            tags: ["#Impermeabilizacion", "#Industrial"],
            altText: "impermeabilizacion-nave-industrial-godoy-cruz"
        },
        {
            id: 5,
            title: "Local Comercial Centro",
            client: "Franquicia de Indumentaria",
            image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=800",
            description: "Reforma integral de fachada e interior en tiempo récord.",
            category: "Comercial",
            tags: ["#Remodelacion", "#Comercial"],
            altText: "remodelacion-local-comercial-mendoza"
        },
        {
            id: 6,
            title: "Recuperación de Techo",
            client: "Particular",
            image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
            description: "Limpieza mecánica y aplicación de espuma de poliuretano expandido.",
            category: "Residencial",
            tags: ["#Techos", "#Residencial"],
            altText: "reparacion-techo-chapa-guaymallen"
        }
    ],
    beforeAfter: {
        title: "Resultados que se ven",
        cases: [
            {
                title: "CASO A (Techos)",
                before: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80&w=1200",
                after: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=1200",
                label: "Recuperación de Cubierta"
            },
            {
                title: "CASO B (Obras)",
                before: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200",
                after: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
                label: "Transformación de Espacio"
            }
        ]
    },
    methodology: {
        title: "Cómo trabajamos en cada proyecto",
        steps: [
            { title: "Relevamiento Técnico", desc: "Diagnóstico presencial, no adivinamos.", icon: "Search" },
            { title: "Presupuesto Claro", desc: "Sin costos ocultos.", icon: "FileText" },
            { title: "Seguridad (ART/EPP)", desc: "Personal asegurado y normativa vigente.", icon: "ShieldCheck" },
            { title: "Limpieza de Obra", desc: "Entregamos el espacio listo para usar.", icon: "Sparkles" }
        ]
    },
    footerCTA: {
        title: "¿Le gusta cómo trabajamos?",
        subtitle: "Llevemos esta calidad de ejecución a su próximo proyecto.",
        buttonText: "Quiero un Resultado Así",
        whatsappMessage: "Hola CuyoSmart vi sus proyectos en la web y me interesa pedir presupuesto"
    }
};

export const contactPageData: ContactPageData = {
    meta: {
        title: "Contacto y Solicitud de Presupuesto | CuyoSmart Mendoza",
        description: "Solicite su presupuesto o visita técnica. Atención a empresas, bodegas y particulares en Mendoza. WhatsApp directo y formulario online."
    },
    hero: {
        title: "Hablemos de su Proyecto.",
        subtitle: "Estamos listos para asesorarlo. Solicite una visita técnica o un presupuesto sin cargo.",
        image: null
    },
    directInfo: {
        sales: {
            title: "Asesoramiento Técnico",
            phone: PHONE_NUMBER,
            link: `${WHATSAPP_LINK}?text=Hola%20CuyoSmart,%20quiero%20hacer%20una%20consulta`,
            cta: "Enviar WhatsApp Ahora"
        },
        admin: {
            title: "Presupuestos Formales",
            email: EMAIL_ADDRESS,
            hours: "Envíenos sus planos o pliegos por correo."
        },
        location: {
            title: "Oficina y Taller",
            address: ADDRESS,
            coverage: "Lun a Vie de 8:00 a 18:00 hs. Gran Mendoza, Zona Este y Valle de Uco."
        }
    },
    form: {
        title: "Solicitar Presupuesto Online",
        subtitle: "Complete el formulario y un técnico analizará su caso.",
        services: [
            "Mantenimiento de Techos / Zinguería",
            "Aislación Térmica (Poliuretano)",
            "Obras Civiles / Remodelación",
            "Mantenimiento Corporativo General",
            "Otro"
        ],
        buttonText: "ENVIAR CONSULTA"
    },
    faq: [
        { q: "¿Realizan Factura A?", a: "Sí, somos una empresa constituida (SAS). Emitimos Factura A y B." },
        { q: "¿Tienen garantía los trabajos?", a: "Absolutamente. Todos nuestros trabajos cuentan con garantía escrita sobre mano de obra y materiales." },
        { q: "¿Cuál es la zona de cobertura?", a: "Atendemos principalmente Gran Mendoza, Zona Este y Valle de Uco. Para proyectos grandes en otras zonas, consúltenos." },
        { q: "¿Cobran la visita técnica?", a: "La primera visita de relevamiento visual en Gran Mendoza es bonificada. Para diagnósticos profundos o informes técnicos, consultar." }
    ],
    location: {
        title: "Ubicación",
        embedUrl: GOOGLE_MAPS_EMBED_URL
    }
};
