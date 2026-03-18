import { siteConfig } from '@/data/content';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function JsonLd({ data }: { data: Record<string, any> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

interface BreadcrumbItem {
    name: string;
    path: string;
}

/** Breadcrumb structured data for subpages */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
    const data = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: siteConfig.siteUrl,
            },
            ...items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: item.name,
                item: `${siteConfig.siteUrl}${item.path}`,
            })),
        ],
    };
    return <JsonLd data={data} />;
}

interface ServiceSchemaProps {
    name: string;
    description: string;
    url: string;
    image?: string;
    areaServed?: string;
    provider?: string;
}

/** Service structured data for service pages */
export function ServiceJsonLd({ name, description, url, image, areaServed = "Mendoza, Argentina", provider = "CuyoSmart SAS" }: ServiceSchemaProps) {
    const data = {
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        url: `${siteConfig.siteUrl}${url}`,
        ...(image && { image: `${siteConfig.siteUrl}${image}` }),
        areaServed: {
            "@type": "Place",
            name: areaServed,
        },
        provider: {
            "@type": "LocalBusiness",
            name: provider,
            "@id": `${siteConfig.siteUrl}/#localbusiness`,
        },
    };
    return <JsonLd data={data} />;
}

interface FAQItem {
    q: string;
    a: string;
}

/** FAQPage structured data for pages with FAQ sections */
export function FAQPageJsonLd({ items }: { items: FAQItem[] }) {
    const data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
            },
        })),
    };
    return <JsonLd data={data} />;
}
