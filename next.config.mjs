// En-têtes de sécurité (CLAUDE.md §7). La politique de contenu interdit toute ressource
// extérieure : pas de script tiers, pas de police distante, pas d'appel réseau hors du site.
// Next a besoin de scripts en ligne ; « unsafe-eval » n'est permis qu'en développement.
const dev = process.env.NODE_ENV !== 'production'

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self'${dev ? ' ws: wss:' : ''}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const enTetesSecurite = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: enTetesSecurite }]
  },
  images: {
    unoptimized: true,
  },
  // Refonte de septembre 2026 : le parcours est l'unité d'entrée. Les anciennes listes
  // (`/parcours`, `/demarches`) vivent désormais dans l'accueil ; les détails restent en place.
  async redirects() {
    return [
      { source: '/parcours', destination: '/accueil', permanent: false },
      { source: '/demarches', destination: '/accueil', permanent: false },
    ]
  },
}

export default nextConfig
