/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
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
