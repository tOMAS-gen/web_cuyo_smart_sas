import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/content';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = siteConfig.siteUrl;

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/reparacion-techos-impermeabilizacion-mendoza`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/obras-civiles-construccion-en-seco-mendoza`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/aislacion-termica-poliuretano-expandido`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/proyectos-obras-realizadas`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contacto-presupuesto-obras`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];
}
