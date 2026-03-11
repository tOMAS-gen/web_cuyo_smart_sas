import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
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
