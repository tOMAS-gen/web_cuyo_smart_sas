import { SiteConfig, HomeData, TechosData, InsulationPageData, ObrasData, ProjectsPageData, ContactPageData } from '../types/content';

// ---------------------------------------------------------------------------
// Configuración centralizada del sitio.
// Única fuente de verdad para datos de contacto, URLs y redes sociales.
//
// Los fallbacks usan placeholders con formato __VARIABLE__ que el script
// entrypoint.sh reemplaza en runtime con los valores del environment de
// Docker. Esto permite cambiar datos desde docker-compose.yml sin
// reconstruir la imagen.
// ---------------------------------------------------------------------------

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "__NEXT_PUBLIC_SITE_URL__";
const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || "__NEXT_PUBLIC_PHONE_NUMBER__";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_PHONE_DISPLAY || "__NEXT_PUBLIC_PHONE_DISPLAY__";
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "__NEXT_PUBLIC_CONTACT_EMAIL__";
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "__NEXT_PUBLIC_ADMIN_EMAIL__";
const ADDRESS = process.env.NEXT_PUBLIC_ADDRESS || "__NEXT_PUBLIC_ADDRESS__";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "__NEXT_PUBLIC_WHATSAPP_NUMBER__";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
const GOOGLE_MAPS_EMBED_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || "__NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL__";
const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || "__NEXT_PUBLIC_FACEBOOK_URL__";
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "__NEXT_PUBLIC_INSTAGRAM_URL__";
const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL || "__NEXT_PUBLIC_LINKEDIN_URL__";

/** Configuración global del sitio, exportada para uso en cualquier componente. */
export const siteConfig: SiteConfig = {
    siteUrl: SITE_URL,
    phone: PHONE_NUMBER,
    phoneDisplay: PHONE_DISPLAY,
    contactEmail: CONTACT_EMAIL,
    adminEmail: ADMIN_EMAIL,
    address: ADDRESS,
    whatsappNumber: WHATSAPP_NUMBER,
    whatsappLink: WHATSAPP_LINK,
    googleMapsEmbedUrl: GOOGLE_MAPS_EMBED_URL,
    socialMedia: {
        facebook: FACEBOOK_URL,
        instagram: INSTAGRAM_URL,
        linkedin: LINKEDIN_URL,
    },
};

export const homeData: HomeData = {
    meta: {
        title: "Empresa de Mantenimiento e Infraestructura en Mendoza | CuyoSmart",
        description: "Soluciones integrales para empresas y hogares en Mendoza. Expertos en reparación de techos, impermeabilización, construcción en seco y aislación. Presupuesto sin cargo."
    },
    hero: {
        title: "Soluciones Integrales de Mantenimiento e Infraestructura",
        subtitle: "Calidad industrial y respaldo técnico para empresas, bodegas y hogares. Ejecución garantizada desde 2009.",
        image: "/images/techos/01.jpeg",
        ctaPrimary: "Hablar por WhatsApp",
        ctaSecondary: "Ver Proyectos Realizados"
    },
    services: [
        {
            id: 'reparacion-techos-impermeabilizacion-mendoza',
            title: "Recuperación de Cubiertas",
            description: "Soluciones definitivas a filtraciones. Diagnóstico, cambio de chapas, zinguería e impermeabilización.",
            linkText: "Ver Detalles de Reparación de Techos",
            whatsappMessage: "Hola CuyoSmart, necesito asesoramiento técnico por reparación de techos.",
            image: "/images/impermeabilizacion/01.jpeg",
            orientation: "left"
        },
        {
            id: 'obras-civiles-construccion-en-seco-mendoza',
            title: "Infraestructura Híbrida: Tradicional y Steel Framing",
            description: "Adaptamos el sistema constructivo a la necesidad de su empresa o vivienda. No nos limitamos a un solo método: \n\n✓ Obra Tradicional: Solidez para ampliaciones, fachadas y reformas estructurales. \n✓ Construcción en Seco: Rapidez y limpieza para oficinas internas, cielorrasos y divisiones.",
            linkText: "Conocer más sobre Obras Civiles",
            whatsappMessage: "Hola, me interesa un presupuesto para construcción (Tradicional / Seco).",
            image: "/images/obras-civiles/01.jpeg",
            orientation: "right"
        },
        {
            id: 'aislacion-termica-poliuretano-expandido',
            title: "Tecnología de Aislación",
            description: "Eficiencia energética y control de temperatura para bodegas, galpones y hogares.",
            linkText: "Descubrir Aislación con Poliuretano",
            whatsappMessage: "Hola, me interesa cotizar aislación térmica con poliuretano.",
            image: "/images/aislacion/01.jpeg",
            orientation: "left"
        }
    ],
    differentials: {
        title: "¿Por qué elegir CuyoSmart?",
        items: [
            {
                title: "Solución 360°",
                description: "Reparamos la estructura completa, no solo lo estético. Equipo técnico propio con más de 17 años de experiencia.",
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
                image: "/images/techos/05.jpeg",
                label: "Mantenimiento Industrial"
            },
            {
                image: "/images/impermeabilizacion/10.jpeg",
                label: "Impermeabilización"
            },
            {
                image: "/images/obras-civiles/10.jpeg",
                label: "Obras Civiles"
            },
            {
                image: "/images/aislacion/29.jpeg",
                label: "Aislación Térmica"
            },
            {
                image: "/images/techos/93.jpeg",
                label: "Techos desde Cero"
            },
            {
                image: "/images/obras-civiles/74.jpeg",
                label: "Remodelaciones"
            }
        ]
    },
    footerUp: {
        title: "¿Tiene una urgencia o un proyecto?",
        cta: "Enviar WhatsApp al Técnico",
        email: CONTACT_EMAIL,
        location: "Mendoza y Gran Mendoza."
    }
};

export const techosData: TechosData = {
    meta: {
        title: "Reparación de Techos e Impermeabilización en Mendoza | CuyoSmart",
        description: "Soluciones definitivas a filtraciones. Especialistas en diagnóstico estructural, cambio de chapas, zinguería industrial y membranas. Solicite visita técnica."
    },
    hero: {
        title: "Recuperación y Mantenimiento Integral de Cubiertas",
        subtitle: "Diagnóstico experto, reparación estructural e impermeabilización definitiva. Extendemos la vida útil de su techo industrial o residencial.",
        image: "/images/techos/08.jpeg",
        cta: "Solicitar Visita Técnica",
        whatsappMessage: "Hola CuyoSmart necesito una visita tecnica por mi techo"
    },
    problemSolution: {
        title: "No tapamos el problema, lo resolvemos de raíz",
        text1: "La reparación de techos es nuestro foco principal. Muchas empresas se limitan a aplicar membrana sobre superficies dañadas u oxidadas. En CuyoSmart, entendemos el techo como un sistema completo.",
        text2: "Antes de impermeabilizar, realizamos un diagnóstico estructural. Si hay chapas podridas, zinguería deficiente o pendientes mal calculadas, lo reparamos primero. Garantizamos que la inversión que hace hoy, no la tenga que volver a hacer el año que viene."
    },
    services: [
        {
            title: "Diagnóstico y Zinguería",
            description: "El agua entra por los detalles. Antes de cualquier tratamiento, revisamos y reparamos canaletas, bajadas, cumbreras y babetas. Reemplazamos chapas en mal estado para asegurar el correcto desagüe.",
            icon: "Search",
            image: "/images/techos/12.jpeg",
            cta: "Consultar por Reparación/Zinguería",
            whatsappMessage: "Hola CuyoSmart, tengo problemas de zingueria o chapas en mi techo"
        },
        {
            title: "Impermeabilización de alto tránsito",
            description: "Aplicación profesional de membranas asfálticas y líquidas de alto tránsito. Seleccionamos el material idóneo según el tipo de techo (losa, chapa o teja) para garantizar estanqueidad total y durabilidad ante el sol de Mendoza.",
            icon: "Droplets",
            image: "/images/impermeabilizacion/05.jpeg",
            cta: "Presupuesto Impermeabilización",
            whatsappMessage: "Hola, necesito un presupuesto para impermeabilizar un techo"
        },
        {
            title: "Aislación y Eficiencia",
            description: "La solución doble propósito. Mejoramos la eficiencia de la cubierta aplicando espuma de poliuretano, que actúa como barrera térmica (frío/calor) y sella todas las grietas y uniones, evitando filtraciones por condensación.",
            icon: "ShieldCheck",
            image: "/images/aislacion/05.jpeg",
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
        title: "Aislación Térmica con Poliuretano en Mendoza | CuyoSmart",
        description: "Proyección de espuma de poliuretano in situ. Solución definitiva para el control de temperatura y condensación en bodegas y techos residenciales. Cotice online."
    },
    hero: {
        title: "Aislación Térmica de Alto Rendimiento",
        subtitle: "Tecnología de Poliuretano Expandido proyectado in situ. Control de temperatura, eliminación de condensación y ahorro energético inmediato.",
        image: "/images/aislacion/03.jpeg",
        cta: "Cotizar Aislación por WhatsApp",
        whatsappMessage: "Hola, me interesa cotizar aislacion termica con poliuretano"
    },
    intro: {
        title: "La barrera definitiva contra el clima de Cuyo",
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
            title: "Control Térmico Industrial para Bodegas",
            text: "Vital para la conservación del vino y productos sensibles. Garantizamos una temperatura estable en la nave, reduciendo la carga de los equipos de frío.",
            icon: "Factory",
            cta: "Cotizar Galpón/Bodega",
            whatsappMessage: "Hola, necesito presupuesto para aislar un galpon/bodega"
        },
        {
            title: "Confort en el Hogar (Techos de chapa y losa)",
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
        title: "Obras Civiles y Construcción en Seco en Mendoza | CuyoSmart",
        description: "Ejecución de obras llave en mano. Construcción en seco (Steel Framing) y albañilería tradicional para oficinas, industrias y ampliaciones. Pida presupuesto."
    },
    hero: {
        title: "Infraestructura y Obras Civiles: Ejecución Profesional",
        subtitle: "Construcción en seco y tradicional para la expansión de su empresa. Versatilidad técnica para proyectos llave en mano.",
        image: "/images/obras-civiles/05.jpeg",
        cta: "Cotizar Proyecto"
    },
    valueProposition: {
        title: "Transformamos espacios, potenciamos su estructura",
        text1: "La infraestructura de una empresa debe ser dinámica. En CuyoSmart combinamos la rapidez de la construcción en seco con la solidez de la albañilería tradicional.",
        text2: "Ya sea que necesite montar oficinas operativas dentro de una nave industrial, remodelar un local comercial o ampliar una residencia, ofrecemos ejecución precisa, lectura de planos y cumplimiento estricto de los tiempos de obra."
    },
    services: [
        {
            title: "Soluciones Rápidas: Construcción en Seco (Steel Framing & Durlock)",
            description: "La solución ideal para empresas que buscan rapidez y limpieza.",
            features: ["Divisiones de oficinas y tabiquería interior.", "Cielorrasos desmontables y acústicos.", "Revestimientos y estructuras ligeras."],
            benefit: "Obra rápida, sin escombros y con excelentes propiedades de aislación.",
            icon: "Layout"
        },
        {
            title: "Solidez: Obra Tradicional y Albañilería",
            description: "Solidez estructural para ampliaciones y reformas mayores.",
            features: ["Mampostería, revoques y contrapisos.", "Ampliaciones de planta y reformas de fachada.", "Obras húmedas complementarias."],
            benefit: "Construcción sólida y duradera para proyectos que requieren máxima resistencia.",
            icon: "BrickWall"
        },
        {
            title: "Mantenimiento Edilicio Corporativo",
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
                title: "Expansión de Casa",
                challenge: "Ampliación de espacio habitacional en planta baja.",
                solution: "Obra civil tradicional integrada al diseño existente.",
                image: "/images/obras-civiles/02.jpeg"
            },
            {
                title: "Remodelación de Interiores",
                challenge: "Renovación completa de habitación y baño.",
                solution: "Obra civil con cielorraso, revestimientos y terminaciones.",
                image: "/images/obras-civiles/20.jpeg"
            },
            {
                title: "Remodelación de Baño",
                challenge: "Baño deteriorado con revestimientos dañados y grifería obsoleta.",
                solution: "Renovación integral con nuevos revestimientos, sanitarios y grifería moderna.",
                image: "/images/obras-civiles/74.jpeg"
            },
            {
                title: "Construcción de Vereda",
                challenge: "Acceso perimetral inexistente y problemas de desagüe.",
                solution: "Ejecución de vereda en hormigón con pendientes y juntas de dilatación.",
                image: "/images/obras-civiles/99.jpeg"
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
        title: "Galería de Proyectos y Obras Realizadas en Mendoza | CuyoSmart",
        description: "Explore nuestro portafolio de obras. Trabajos comprobables de mantenimiento industrial, reparación de techos y construcción civil para empresas y hogares."
    },
    hero: {
        title: "Nuestra Experiencia en Obra",
        subtitle: "Más de 17 años materializando soluciones. Calidad de ejecución comprobable en industrias, comercios y residencias.",
        image: "/images/techos/15.jpeg"
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
            title: "Aislación Térmica en Galpón Industrial - Mendoza",
            client: "Cliente Industrial",
            image: "/images/aislacion/02.jpeg",
            description: "Proyección de espuma de poliuretano expandido sobre cubierta de chapa. Reducción de temperatura interior en más de 10°C y eliminación de condensación.",
            category: "Industrial",
            tags: ["#Aislacion", "#Industrial"],
            altText: "aislacion-termica-galpon-industrial-mendoza"
        },
        {
            id: 2,
            title: "Impermeabilización de Techos en Casa - Mendoza",
            client: "Residencial",
            image: "/images/impermeabilizacion/03.jpeg",
            description: "Aplicación de membrana asfáltica sobre losa existente. Solución definitiva a filtraciones recurrentes.",
            category: "Residencial",
            tags: ["#Impermeabilizacion", "#Residencial"],
            altText: "impermeabilizacion-membrana-casa-mendoza"
        },
        {
            id: 3,
            title: "Cambio de Techo y Aislación en Vivienda - Mendoza",
            client: "Vivienda Familiar",
            image: "/images/techos/06.jpeg",
            description: "Reemplazo completo de cubierta deteriorada. Cambio de chapas, zinguería y aplicación de poliuretano para aislación térmica.",
            category: "Residencial",
            tags: ["#Techos", "#Residencial"],
            altText: "cambio-techo-chapa-aislacion-mendoza"
        },
        {
            id: 4,
            title: "Impermeabilización de Nave Industrial",
            client: "Empresa Logística",
            image: "/images/impermeabilizacion/15.jpeg",
            description: "Impermeabilización total con membrana de alto tránsito sobre nave de gran superficie. Garantía de estanqueidad por 10 años.",
            category: "Industrial",
            tags: ["#Impermeabilizacion", "#Industrial"],
            altText: "impermeabilizacion-nave-industrial-mendoza"
        },
        {
            id: 5,
            title: "Remodelación de Ambientes",
            client: "Vivienda Particular",
            image: "/images/obras-civiles/15.jpeg",
            description: "Reforma integral de interiores: cielorraso, revestimientos, baño y habitaciones. Obra terminada llave en mano.",
            category: "Residencial",
            tags: ["#ObrasCiviles", "#Residencial"],
            altText: "remodelacion-interiores-casa-mendoza"
        },
        {
            id: 6,
            title: "Cambio de Tejas por Chapa",
            client: "Particular",
            image: "/images/techos/02.jpeg",
            description: "Retiro de tejas deterioradas y colocación de chapa con estructura nueva. Mayor durabilidad y menor mantenimiento.",
            category: "Residencial",
            tags: ["#Techos", "#Residencial"],
            altText: "cambio-tejas-chapa-mendoza"
        },
        {
            id: 7,
            title: "Aislación Térmica en Nave Industrial",
            client: "Bodega Local",
            image: "/images/aislacion/04.jpeg",
            description: "Servicio de aislación térmica con poliuretano expandido de alta densidad para control de temperatura en zona de estiba.",
            category: "Industrial",
            tags: ["#Aislacion", "#Industrial"],
            altText: "aislacion-termica-bodega-mendoza"
        },
        {
            id: 8,
            title: "Construcción de Veredas y Accesos",
            client: "Particular",
            image: "/images/obras-civiles/05.jpeg",
            description: "Ejecución de veredas perimetrales y accesos vehiculares en hormigón peinado con cordones integrados.",
            category: "Residencial",
            tags: ["#ObrasCiviles", "#Residencial"],
            altText: "construccion-veredas-mendoza"
        },
        {
            id: 9,
            title: "Reparación de Techo Industrial",
            client: "Empresa de Logística",
            image: "/images/techos/20.jpeg",
            description: "Mantenimiento preventivo y correctivo de cubierta metálica, sellado de uniones y cambio de fijaciones.",
            category: "Industrial",
            tags: ["#Techos", "#Industrial"],
            altText: "reparacion-techo-industrial-mendoza"
        },
        {
            id: 10,
            title: "Impermeabilización de Terrazas",
            client: "Consorcio Edificio",
            image: "/images/impermeabilizacion/25.jpeg",
            description: "Tratamiento completo de impermeabilización con membrana líquida reforzada con fibra de vidrio en techos planos.",
            category: "Residencial",
            tags: ["#Impermeabilizacion", "#Residencial"],
            altText: "impermeabilizacion-terraza-mendoza"
        },
        {
            id: 11,
            title: "Remodelación de Oficinas",
            client: "Local Comercial",
            image: "/images/obras-civiles/30.jpeg",
            description: "Remodelación integral de espacio comercial: tabiquería en seco, pintura, cielorrasos y nueva iluminación.",
            category: "Comercial",
            tags: ["#ObrasCiviles", "#Comercial"],
            altText: "remodelacion-oficinas-comercial-mendoza"
        },
        {
            id: 12,
            title: "Zinguería y Desagües Pluviales",
            client: "Nave Industrial",
            image: "/images/techos/30.jpeg",
            description: "Fabricación e instalación de canaletas industriales de gran capacidad y bajadas pluviales en chapa galvanizada.",
            category: "Industrial",
            tags: ["#Techos", "#Industrial"],
            altText: "zingueria-industrial-mendoza"
        },
        {
            id: 13,
            title: "Cambio de Techo Completo en Vivienda",
            client: "Vivienda Particular",
            image: "/images/techos/62.jpeg",
            description: "Retiro de cubierta deteriorada y colocación de chapa nueva con estructura reforzada. Incluye zinguería completa y terminaciones.",
            category: "Residencial",
            tags: ["#Techos", "#Residencial"],
            altText: "cambio-techo-completo-vivienda-mendoza"
        },
        {
            id: 14,
            title: "Cambio de Membrana en Galpón Industrial",
            client: "Empresa Industrial",
            image: "/images/impermeabilizacion/68.jpeg",
            description: "Reemplazo integral de membrana asfáltica en galpón de gran superficie. Tratamiento de juntas y sellado perimetral para máxima estanqueidad.",
            category: "Industrial",
            tags: ["#Impermeabilizacion", "#Industrial"],
            altText: "cambio-membrana-galpon-industrial-mendoza"
        },
        {
            id: 15,
            title: "Aislación Térmica en Techo de Galpón",
            client: "Bodega Mendocina",
            image: "/images/aislacion/29.jpeg",
            description: "Proyección de poliuretano expandido sobre cubierta de chapa en galpón industrial. Mejora de confort térmico y eliminación de condensación.",
            category: "Industrial",
            tags: ["#Aislacion", "#Industrial"],
            altText: "aislacion-termica-techo-galpon-mendoza"
        },
        {
            id: 16,
            title: "Expansión y Ampliación de Casa",
            client: "Vivienda Familiar",
            image: "/images/obras-civiles/60.jpeg",
            description: "Obra civil de ampliación de planta baja con mampostería tradicional, integrada al diseño existente de la vivienda.",
            category: "Residencial",
            tags: ["#ObrasCiviles", "#Residencial"],
            altText: "expansion-ampliacion-casa-mendoza"
        },
        {
            id: 17,
            title: "Impermeabilización con Membrana Líquida",
            client: "Residencial",
            image: "/images/impermeabilizacion/89.jpeg",
            description: "Aplicación de membrana líquida sobre losa existente. Sistema de impermeabilización continuo sin juntas para máxima protección.",
            category: "Residencial",
            tags: ["#Impermeabilizacion", "#Residencial"],
            altText: "impermeabilizacion-membrana-liquida-mendoza"
        },
        {
            id: 18,
            title: "Remodelación Integral de Baño",
            client: "Vivienda Particular",
            image: "/images/obras-civiles/74.jpeg",
            description: "Renovación completa de baño con cambio de revestimientos, sanitarios, grifería y nueva distribución del espacio.",
            category: "Residencial",
            tags: ["#ObrasCiviles", "#Residencial"],
            altText: "remodelacion-integral-bano-mendoza"
        },
        {
            id: 19,
            title: "Cambio de Techo y Mejora de Aislación",
            client: "Vivienda Familiar",
            image: "/images/aislacion/40.jpeg",
            description: "Proyecto integral de cambio de cubierta con incorporación de aislación térmica de poliuretano. Solución de techo + confort en una sola intervención.",
            category: "Residencial",
            tags: ["#Aislacion", "#Techos", "#Residencial"],
            altText: "cambio-techo-mejora-aislacion-mendoza"
        },
        {
            id: 20,
            title: "Construcción de Vereda Perimetral",
            client: "Vivienda Particular",
            image: "/images/obras-civiles/99.jpeg",
            description: "Ejecución de veredas perimetrales en hormigón con terminación alisada. Incluye cordones, pendientes de desagüe y juntas de dilatación.",
            category: "Residencial",
            tags: ["#ObrasCiviles", "#Residencial"],
            altText: "construccion-vereda-perimetral-mendoza"
        },
        {
            id: 21,
            title: "Techo desde Cero para Complejo de Departamentos",
            client: "Consorcio",
            image: "/images/techos/93.jpeg",
            description: "Construcción completa de cubierta nueva para complejo de departamentos. Estructura metálica, chapas, zinguería e impermeabilización integral.",
            category: "Comercial",
            tags: ["#Techos", "#Comercial"],
            altText: "techo-complejo-departamentos-mendoza"
        },
        {
            id: 22,
            title: "Remodelación de Medianera",
            client: "Vivienda Particular",
            image: "/images/obras-civiles/87.jpeg",
            description: "Reparación y remodelación de pared medianera con revoque, impermeabilización y pintura exterior. Refuerzo estructural incluido.",
            category: "Residencial",
            tags: ["#ObrasCiviles", "#Residencial"],
            altText: "remodelacion-medianera-mendoza"
        },
        {
            id: 23,
            title: "Cambio de Tejas por Chapa",
            client: "Vivienda Particular",
            image: "/images/techos/77.jpeg",
            description: "Retiro completo de tejas deterioradas y colocación de cubierta de chapa galvanizada con nueva estructura y aislación.",
            category: "Residencial",
            tags: ["#Techos", "#Residencial"],
            altText: "cambio-tejas-chapa-mendoza"
        },
        {
            id: 24,
            title: "Impermeabilización de Techo con Membrana",
            client: "Vivienda Familiar",
            image: "/images/impermeabilizacion/98.jpeg",
            description: "Aplicación profesional de membrana asfáltica sobre techo existente con tratamiento de juntas, babetas y desagües.",
            category: "Residencial",
            tags: ["#Impermeabilizacion", "#Residencial"],
            altText: "impermeabilizacion-techo-membrana-mendoza"
        },
        {
            id: 25,
            title: "Proyección de Poliuretano en Cubierta",
            client: "Cliente Industrial",
            image: "/images/aislacion/58.jpeg",
            description: "Aislación térmica mediante proyección de espuma de poliuretano de alta densidad sobre cubierta metálica. Reducción de temperatura interior garantizada.",
            category: "Industrial",
            tags: ["#Aislacion", "#Industrial"],
            altText: "proyeccion-poliuretano-cubierta-mendoza"
        },
        {
            id: 26,
            title: "Cielorraso y Terminaciones Interiores",
            client: "Vivienda Particular",
            image: "/images/obras-civiles/69.jpeg",
            description: "Instalación de cielorraso en seco con placas de yeso, estructura galvanizada y terminaciones de pintura. Obra limpia y rápida.",
            category: "Residencial",
            tags: ["#ObrasCiviles", "#Residencial"],
            altText: "cielorraso-terminaciones-interiores-mendoza"
        },
        {
            id: 27,
            title: "Techo de Quincho y Cochera",
            client: "Vivienda Particular",
            image: "/images/techos/82.jpeg",
            description: "Construcción de cubierta para quincho y cochera con estructura metálica y chapa. Incluye canaleta y bajada pluvial integrada.",
            category: "Residencial",
            tags: ["#Techos", "#Residencial"],
            altText: "techo-quincho-cochera-mendoza"
        }
    ],
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
        description: "Comuníquese con CuyoSmart. Solicite asesoramiento técnico o presupuesto para su proyecto de techo, obra civil o aislación en Mendoza. WhatsApp directo."
    },
    hero: {
        title: "Hablemos de su Proyecto.",
        subtitle: "Estamos listos para asesorarlo. Solicite una visita técnica o un presupuesto sin cargo.",
        image: null
    },
    directInfo: {
        sales: {
            title: "Asesoramiento Técnico",
            phone: PHONE_DISPLAY,
            link: `${WHATSAPP_LINK}?text=Hola%20CuyoSmart,%20quiero%20hacer%20una%20consulta`,
            cta: "Enviar WhatsApp Ahora"
        },
        admin: {
            title: "Presupuestos Formales",
            email: ADMIN_EMAIL,
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
