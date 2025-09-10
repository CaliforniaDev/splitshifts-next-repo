import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SplitShifts App',
    short_name: 'SplitShifts',
    description:
      'A web application designed to streamline the scheduling process for organizations.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f8f6',
    theme_color: '#1a2532',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    icons: [
      {
        src: '/andriod-chrome-icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/andriod-chrome-icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/andriod-chrome-icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
