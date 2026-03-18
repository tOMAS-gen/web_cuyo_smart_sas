import { Metadata } from 'next';
import { projectsPageData, siteConfig } from '@/data/content';
import ProyectosClient from './ProyectosClient';
import { BreadcrumbJsonLd } from '@/components/StructuredData';

export const metadata: Metadata = {
    title: projectsPageData.meta.title,
    description: projectsPageData.meta.description,
    keywords: projectsPageData.meta.keywords,
    alternates: {
        canonical: `${siteConfig.siteUrl}/proyectos-obras-realizadas`,
    },
    openGraph: {
        title: projectsPageData.meta.title,
        description: projectsPageData.meta.description,
        url: `${siteConfig.siteUrl}/proyectos-obras-realizadas`,
        images: [
            {
                url: "/images/techos/15.jpeg",
                alt: "Galería de Proyectos y Obras Realizadas en Mendoza - CuyoSmart",
                width: 1200,
                height: 630,
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: projectsPageData.meta.title,
        description: projectsPageData.meta.description,
        images: ["/images/techos/15.jpeg"],
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
