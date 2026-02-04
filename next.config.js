/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack alias: react-compiler-runtime polyfill per React 18
  // @sanity/visual-editing v5 e precompilato con React Compiler che richiede react/compiler-runtime (React 19)
  // Questo alias redirige l'import al polyfill compatibile con React 18
  webpack: (config) => {
    config.resolve.alias['react/compiler-runtime'] = require.resolve('react-compiler-runtime')
    return config
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },

  // Internationalization
  // Uncomment when ready for full i18n
  // i18n: {
  //   locales: ['it', 'en', 'es'],
  //   defaultLocale: 'it',
  // },

  // Performance optimizations
  poweredByHeader: false,

  // Strict mode for development
  reactStrictMode: true,

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Headers for security
  // NOTA: CSP e X-Frame-Options sono gestiti dal middleware.ts per compatibilita con Sanity Visual Editing
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Logging per debug in sviluppo
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig
