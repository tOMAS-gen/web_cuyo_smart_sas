/** Configuración global del sitio: contacto, URLs y redes sociales. */
export interface SiteConfig {
    siteUrl: string;
    phone: string;
    phoneDisplay: string;
    contactEmail: string;
    adminEmail: string;
    address: string;
    whatsappNumber: string;
    whatsappLink: string;
    googleMapsEmbedUrl: string;
    socialMedia: {
        facebook: string;
        instagram: string;
        linkedin: string;
    };
}

export interface MetaData {
    title: string;
    description: string;
}

export interface HeroData {
    title: string;
    subtitle: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: any;
    cta?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
    whatsappMessage?: string;
}

export interface ServiceItem {
    id?: string;
    title: string;
    description: string;
    linkText?: string;
    whatsappMessage?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image?: any;
    orientation?: 'left' | 'right';
    icon?: string;
    features?: string[];
    benefit?: string;
    cta?: string;
}

export interface DifferentialItem {
    title: string;
    description: string;
    icon: string;
}

export interface ProjectItem {
    id: number;
    title: string;
    client: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: any;
    description: string;
    category: string;
    tags?: string[];
    tag?: string; // Keeping for backward compatibility if needed, or deprecate
    altText?: string;
}

export interface HomeData {
    meta: MetaData;
    hero: HeroData;
    services: ServiceItem[];
    differentials: {
        title: string;
        items: DifferentialItem[];
    };
    featuredProjects: {
        title: string;
        cta: string;
        items: { image: string; label: string }[];
    };
    footerUp: {
        title: string;
        cta: string;
        email: string;
        location: string;
    };
}

export interface TechosData {
    meta: MetaData;
    hero: HeroData & { whatsappMessage: string };
    problemSolution: {
        title: string;
        text1: string;
        text2: string;
    };
    services: ServiceItem[];
    segmentation: {
        title: string;
        description: string;
        icon: string;
    }[];
    logistics: {
        title: string;
        description: string;
    };
    footerCTA: {
        title: string;
        text: string;
        buttonText: string;
        whatsappMessage: string;
    };
}

export interface InsulationPageData {
    meta: MetaData;
    hero: HeroData;
    intro: {
        title: string;
        text1: string;
        text2: string;
    };
    benefits: {
        title: string;
        desc: string;
        icon: string;
        color: string;
    }[];
    applications: {
        title: string;
        text: string;
        highlight?: string;
        icon: string;
        cta?: string;
        whatsappMessage?: string;
    }[];
    process: {
        step: string;
        name: string;
        desc: string;
    }[];
    differential: {
        title: string;
        text: string;
    };
    footerCTA: {
        title: string;
        text: string;
        buttonText: string;
        whatsappMessage?: string;
    };
}

export interface ObrasData {
    meta: MetaData;
    hero: HeroData;
    valueProposition: {
        title: string;
        text1: string;
        text2: string;
    };
    services: ServiceItem[];
    forArchitects: {
        title: string;
        text1: string;
        text2: string;
        cta: string;
        whatsappMessage: string;
    };
    gallery: {
        cases: {
            title: string;
            challenge: string;
            solution: string;
            image: string;
        }[];
    };
    logistics: {
        title: string;
        text: string;
    };
    footerCTA: {
        title: string;
        text: string;
        buttonText: string;
        whatsappMessage?: string;
    };
}

export interface ProjectsPageData {
    meta: MetaData;
    hero: HeroData;
    categories: { id: string; label: string }[];
    projects: ProjectItem[];
    methodology: {
        title: string;
        steps: { title: string; desc: string; icon: string }[];
    };
    footerCTA: {
        title: string;
        subtitle: string;
        buttonText: string;
        whatsappMessage?: string;
    };
}

export interface ContactPageData {
    meta: MetaData;
    hero: HeroData;
    directInfo: {
        sales: {
            title: string;
            phone: string;
            link: string;
            cta: string;
        };
        admin: {
            title: string;
            email: string;
            hours: string;
        };
        location: {
            title: string;
            address: string;
            coverage: string;
        };
    };
    form: {
        title: string;
        subtitle?: string;
        services: string[];
        buttonText?: string;
    };
    faq: { q: string; a: string }[];
    location?: {
        title: string;
        embedUrl: string;
    };
}
