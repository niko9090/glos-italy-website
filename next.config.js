/** @type {import('next').NextConfig} */
const nextConfig = {
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
          {
            // Permette iframe da Sanity Studio per visual editing (sovrascrive X-Frame-Options)
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.sanity.studio https://glositalystudio.vercel.app",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
