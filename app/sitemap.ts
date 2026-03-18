import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/content';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = siteConfig.siteUrl;

    // Fecha de última modificación significativa del contenido del sitio.
    // Usar una fecha fija evita que Google considere todas las páginas como
    // "recién modificadas" en cada build, desperdiciando crawl budget.
    const lastContentUpdate = new Date('2026-03-18');

    return [
        {
            url: baseUrl,
            lastModified: lastContentUpdate,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/reparacion-techos-impermeabilizacion-mendoza`,
            lastModified: lastContentUpdate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/obras-civiles-construccion-en-seco-mendoza`,
            lastModified: lastContentUpdate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/aislacion-termica-poliuretano-expandido`,
            lastModified: lastContentUpdate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/proyectos-obras-realizadas`,
            lastModified: lastContentUpdate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contacto-presupuesto-obras`,
            lastModified: lastContentUpdate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];
}
