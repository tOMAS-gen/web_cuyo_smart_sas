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
        template: "%s",
    },
    description: "Soluciones integrales para empresas y hogares en Mendoza. Expertos en recuperación de techos, construcción en seco y aislación térmica. Presupuestos sin cargo.",
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
    icons: {
        icon: [
            { url: "/brand/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            { url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
    openGraph: {
        title: "Empresa de Mantenimiento e Infraestructura en Mendoza | CuyoSmart",
        description: "Soluciones integrales para empresas y hogares en Mendoza. Expertos en recuperación de techos, construcción en seco y aislación térmica.",
        siteName: "CuyoSmart",
        locale: "es_AR",
        type: "website",
        images: [
            {
                url: "/brand/logo_name_completo_fondo_800x800.jpg",
                alt: "CuyoSmart - Empresa de Mantenimiento e Infraestructura en Mendoza",
                width: 800,
                height: 800,
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Empresa de Mantenimiento e Infraestructura en Mendoza | CuyoSmart",
        description: "Soluciones integrales para empresas y hogares en Mendoza. Expertos en recuperación de techos, construcción en seco y aislación térmica.",
        images: ["/brand/logo_name_completo_fondo_800x800.jpg"],
    },
    alternates: {
        canonical: siteConfig.siteUrl,
    },
};

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
