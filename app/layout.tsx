import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { siteConfig } from "@/data/content";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: 'swap',
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
    display: 'swap',
});

const openSans = Open_Sans({
    variable: "--font-open-sans",
    subsets: ["latin"],
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
        default: "Empresa de Mantenimiento e Infraestructura en Mendoza | CuyoSmart",
        template: "%s | CuyoSmart",
    },
    description: "Empresa de mantenimiento en Mendoza. Expertos en reparación de techos, impermeabilización, construcción en seco y aislación térmica. Presupuesto sin cargo.",
    keywords: [
        "empresa mantenimiento Mendoza",
        "reparación de techos Mendoza",
        "construcción en seco Mendoza",
        "aislación térmica poliuretano Mendoza",
        "impermeabilización Mendoza",
        "obras civiles Mendoza",
        "mantenimiento industrial Mendoza",
        "presupuesto empresa constructora Mendoza",
    ],
    // favicon.ico y apple-icon.png en app/ son detectados automáticamente por Next.js
    // No se necesita configuración manual de icons aquí
    openGraph: {
        title: "Empresa de Mantenimiento e Infraestructura en Mendoza | CuyoSmart",
        description: "Empresa de mantenimiento en Mendoza. Expertos en reparación de techos, impermeabilización, construcción en seco y aislación térmica.",
        siteName: "CuyoSmart",
        locale: "es_AR",
        type: "website",
        images: [
            {
                url: "/images/techos/93.jpeg",
                alt: "CuyoSmart - Empresa de mantenimiento e infraestructura en Mendoza",
                width: 1200,
                height: 630,
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Empresa de Mantenimiento e Infraestructura en Mendoza | CuyoSmart",
        description: "Empresa de mantenimiento en Mendoza. Expertos en reparación de techos, impermeabilización, construcción en seco y aislación térmica.",
        images: ["/images/techos/93.jpeg"],
    },
    alternates: {
        canonical: siteConfig.siteUrl,
    },
};

/** Schema.org WebSite structured data — enables Google Sitelinks Searchbox eligibility. */
function WebSiteJsonLd() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteConfig.siteUrl}/#website`,
        url: siteConfig.siteUrl,
        name: "CuyoSmart",
        description: "Empresa de mantenimiento e infraestructura en Mendoza",
        inLanguage: "es-AR",
        publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
    };
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/** Schema.org Organization structured data so Google Search displays the site logo. */
function OrganizationJsonLd() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${siteConfig.siteUrl}/#organization`,
        name: "CuyoSmart SAS",
        url: siteConfig.siteUrl,
        logo: {
            "@type": "ImageObject",
            url: `${siteConfig.siteUrl}/brand/logo_name_completo_fondo_800x800.jpg`,
            width: 800,
            height: 800,
            caption: "CuyoSmart SAS",
        },
        image: `${siteConfig.siteUrl}/brand/logo_name_completo_fondo_800x800.jpg`,
        sameAs: [
            siteConfig.socialMedia.facebook,
            siteConfig.socialMedia.instagram,
            siteConfig.socialMedia.linkedin,
        ].filter(url => url && !url.startsWith('__')),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/** Schema.org LocalBusiness structured data for SEO. */
function LocalBusinessJsonLd() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${siteConfig.siteUrl}/#localbusiness`,
        name: "CuyoSmart SAS",
        description: "Empresa de mantenimiento industrial, reparación de techos, obras civiles y aislación térmica en Mendoza.",
        url: siteConfig.siteUrl,
        logo: {
            "@type": "ImageObject",
            url: `${siteConfig.siteUrl}/brand/logo_name_completo_fondo_800x800.jpg`,
            width: 800,
            height: 800,
        },
        image: `${siteConfig.siteUrl}/brand/logo_name_completo_fondo_800x800.jpg`,
        parentOrganization: { "@id": `${siteConfig.siteUrl}/#organization` },
        telephone: siteConfig.phone,
        email: siteConfig.contactEmail,
        address: {
            "@type": "PostalAddress",
            streetAddress: "Mendoza",
            addressLocality: "Mendoza",
            addressRegion: "Mendoza",
            postalCode: "5500",
            addressCountry: "AR",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: -32.8908,
            longitude: -68.8272,
        },
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "08:00",
                closes: "18:00",
            },
        ],
        areaServed: {
            "@type": "GeoCircle",
            geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: -32.8908,
                longitude: -68.8272,
            },
            geoRadius: "100000",
        },
        sameAs: [
            siteConfig.socialMedia.facebook,
            siteConfig.socialMedia.instagram,
            siteConfig.socialMedia.linkedin,
        ].filter(url => url && !url.startsWith('__')),
        priceRange: "$$",
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Servicios de Mantenimiento e Infraestructura",
            itemListElement: [
                {
                    "@type": "OfferCatalog",
                    name: "Reparación de Techos e Impermeabilización",
                    itemListElement: [
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name: "Reparación de Techos",
                                description: "Diagnóstico estructural, cambio de chapas, zinguería e impermeabilización.",
                            },
                        },
                    ],
                },
                {
                    "@type": "OfferCatalog",
                    name: "Obras Civiles y Construcción en Seco",
                    itemListElement: [
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name: "Construcción en Seco",
                                description: "Steel Framing, Durlock, tabiquería y cielorrasos.",
                            },
                        },
                    ],
                },
                {
                    "@type": "OfferCatalog",
                    name: "Aislación Térmica con Poliuretano",
                    itemListElement: [
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name: "Aislación Térmica",
                                description: "Proyección de espuma de poliuretano expandido in situ.",
                            },
                        },
                    ],
                },
            ],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <head>
                <WebSiteJsonLd />
                <OrganizationJsonLd />
                <LocalBusinessJsonLd />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${openSans.variable} antialiased min-h-screen flex flex-col`}>
                <Header />
                <main className="flex-grow">
                    {children}
                </main>
                <WhatsAppFAB />
                <Footer />
            </body>
        </html>
    );
}
