import { Metadata } from 'next';
import { projectsPageData, siteConfig } from '@/data/content';
import ProyectosClient from './ProyectosClient';
import { BreadcrumbJsonLd } from '@/components/StructuredData';

export const metadata: Metadata = {
    title: projectsPageData.meta.title,
    description: projectsPageData.meta.description,
    alternates: {
        canonical: `${siteConfig.siteUrl}/proyectos-obras-realizadas`,
    },
    openGraph: {
        title: projectsPageData.meta.title,
        description: projectsPageData.meta.description,
        url: `${siteConfig.siteUrl}/proyectos-obras-realizadas`,
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
    twitter: {
        card: "summary",
        title: projectsPageData.meta.title,
        description: projectsPageData.meta.description,
        images: ["/brand/logo_name_completo_fondo_800x800.jpg"],
    },
};

export default function ProyectosPage() {
    return (
        <>
            <BreadcrumbJsonLd items={[{ name: "Proyectos y Obras Realizadas", path: "/proyectos-obras-realizadas" }]} />
            <ProyectosClient />
        </>
    );
}
