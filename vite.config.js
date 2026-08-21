import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({ hostname: 'https://minibakes.co' }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      includeAssets: ['mini_icon.webp'],
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        maximumFileSizeToCacheInBytes: 5000000,
      },
      manifest: {
        name: 'Mini Bakes',
        short_name: 'Mini Bakes',
        description: 'Crafting Sweetness for Every Celebration',
        theme_color: '#800000',
        background_color: '#faf8f7',
        display: 'standalone',
        icons: [
          {
            src: 'mini_icon.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 4000000
      }
    })
  ],
  base: '/',
  server: {
    port: 3000, // Changes the port from 5173 to 3000
    host: true, // Changes the host from localhost to 0.0.0.0 (allows network access)
  },
  build: {
    minify: false,
    chunkSizeWarningLimit: 1500
  }
})
