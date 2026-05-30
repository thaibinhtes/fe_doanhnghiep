import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

const pwaPlugin = VitePWA({
  registerType: 'autoUpdate',
  injectRegister: 'auto',
  devOptions: {
    enabled: true,
  },
  includeAssets: ['favicon.ico', 'pwa/apple-touch-icon.png', 'leaflet/marker-icon.png', 'leaflet/marker-icon-2x.png', 'leaflet/marker-shadow.png'],
  manifest: {
    name: 'Hệ Thống Quản Lý Doanh Nghiệp (HTQLDN)',
    short_name: 'HTQLDN',
    description: 'Nền tảng quản lý thông tin doanh nghiệp.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    theme_color: '#0f172a',
    background_color: '#0f172a',
    orientation: 'portrait',
    icons: [
      {
        src: '/pwa/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/pwa/maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  workbox: {
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true,
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    navigateFallbackDenylist: [/^\/api\//],
    runtimeCaching: [
      {
        urlPattern: ({ request, url }) =>
          request.destination === 'document' && url.pathname.startsWith('/'),
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages',
          networkTimeoutSeconds: 5,
        },
      },
      {
        urlPattern: ({ request, url }) =>
          ['style', 'script', 'worker'].includes(request.destination),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-assets',
        },
      },
      {
        urlPattern: ({ request, url }) =>
          request.destination === 'image',
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
    ],
  },
}) as any

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    pwaPlugin,
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
