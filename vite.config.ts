import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import vike from 'vike/plugin'
import vercel from 'vite-plugin-vercel'
import * as path from 'path'

const isProd = process.env.NODE_ENV === 'production'

// SSR externals configuration for production
const noExternal: string[] = []
if (isProd) {
  noExternal.push(
    // MUI requires pre-processing by Vite in production
    '@mui/base',
    '@mui/icons-material',
    '@mui/material',
    '@mui/utils',
    '@mui/x-data-grid',
    '@emotion/react',
    '@emotion/styled',
    // Third-party UI libraries
    'react-bootstrap',
    'date-fns',
    '@sendbird/uikit-react',
    'react-swipeable-views',
    'react-swipeable-views-utils',
    'react-google-autocomplete',
    'react-icomoon',
    // Firebase & utilities
    'firebase',
    'uuid',
    '@googlemaps/js-api-loader',
    // State management
    'zustand'
  )
}

export default defineConfig({
  plugins: [
    react(),
    vike({}),
    vercel(),
  ],

  ssr: {
    noExternal,
  },

  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress "use client" directive warnings from React libraries
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          warning.message.includes('"use client"')
        ) {
          return
        }
        warn(warning)
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
             if (id.includes('firebase')) return 'firebase';
             if (id.includes('@mui') || id.includes('react') || id.includes('emotion')) return 'ui-vendor';
          }
        }
      }
    },
  },

  resolve: {
    alias: [
      // Root source alias
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@index', replacement: path.resolve(__dirname, 'src/index') },

      // Feature modules
      { find: '@features', replacement: path.resolve(__dirname, 'src/features') },

      // Component layers (Atomic Design)
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },

      // Shared utilities
      { find: '@hooks', replacement: path.resolve(__dirname, 'src/hooks') },
      { find: '@stores', replacement: path.resolve(__dirname, 'src/stores') },
      { find: '@services', replacement: path.resolve(__dirname, 'src/services') },
      { find: '@types', replacement: path.resolve(__dirname, 'src/types') },
      { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },

      // Assets
      { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },
      { find: '@styles', replacement: path.resolve(__dirname, 'src/styles') },
      { find: '@providers', replacement: path.resolve(__dirname, 'src/providers') },

      // Firebase specific (renamed to avoid collision with @firebase/* packages in node_modules)
      { find: '@firebase-services', replacement: path.resolve(__dirname, 'src/services/firebase') },
      { find: '@firestore-services', replacement: path.resolve(__dirname, 'src/services/firestore') },

      // Legacy aliases (for gradual migration - keep until full migration complete)
      { find: '#@', replacement: path.resolve(__dirname, 'src') },
      { find: '#R', replacement: path.resolve(__dirname, 'pages') },
    ],
  },

  css: {
    preprocessorOptions: {
      scss: {
        // Make variables available globally
        additionalData: `@use "@styles/_variables" as *;`,
      },
    },
  },

  server: {
    port: 3000,
    strictPort: false,
  },
})
