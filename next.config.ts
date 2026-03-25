import type { NextConfig } from "next";

const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
    output: 'standalone',
    async headers() {
        return [
            {
                source: '/((?!_next/).*)',
                headers: securityHeaders,
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/reparacion-techos-impermeabilizacion',
                destination: '/reparacion-techos-impermeabilizacion-mendoza',
                permanent: true,
            },
            {
                source: '/obras-civiles-remodelaciones',
                destination: '/obras-civiles-construccion-en-seco-mendoza',
                permanent: true,
            },
            {
                source: '/aislacion-termica-poliuretano',
                destination: '/aislacion-termica-poliuretano-expandido',
                permanent: true,
            },
            {
                source: '/contacto-presupuesto',
                destination: '/contacto-presupuesto-obras',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
