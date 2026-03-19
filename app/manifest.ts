import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'CuyoSmart SAS',
        short_name: 'CuyoSmart',
        description: 'Empresa de mantenimiento e infraestructura en Mendoza. Techos, obras civiles y aislación.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0B132B',
        theme_color: '#F7941D',
        lang: 'es-AR',
        icons: [
            {
                src: '/brand/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/brand/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/brand/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    };
}
