import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable JSX runtime
      jsxRuntime: 'automatic',
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('@radix-ui')) {
            return 'ui-vendor';
          }
          if (id.includes('recharts') || id.includes('react-big-calendar')) {
            return 'chart-vendor';
          }
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod') || id.includes('yup')) {
            return 'form-vendor';
          }
          if (id.includes('axios') || id.includes('date-fns') || id.includes('moment') || id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'utils-vendor';
          }
          if (id.includes('jspdf') || id.includes('html2canvas')) {
            return 'pdf-vendor';
          }
          if (id.includes('xlsx')) {
            return 'excel-vendor';
          }
          if (id.includes('qrcode')) {
            return 'qr-vendor';
          }
          if (id.includes('zustand')) {
            return 'store-vendor';
          }
          if (id.includes('@dnd-kit')) {
            return 'dnd-vendor';
          }
          if (id.includes('embla-carousel')) {
            return 'carousel-vendor';
          }
          if (id.includes('react-resizable-panels')) {
            return 'panels-vendor';
          }
          if (id.includes('react-day-picker')) {
            return 'day-picker-vendor';
          }
          if (id.includes('vaul')) {
            return 'drawer-vendor';
          }
          if (id.includes('cmdk')) {
            return 'command-vendor';
          }
          if (id.includes('sonner')) {
            return 'toast-vendor';
          }
          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }
          return null;
        },
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk'
          return `js/[name]-[hash].js`
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash].[ext]'
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash].${ext}`
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        }
      }
    },
    // Enable source maps for debugging
    sourcemap: true,
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers
    target: 'esnext',
    // Enable tree shaking
    treeshake: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'zustand',
      'date-fns',
      'clsx',
      'tailwind-merge'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  // Enable CSS optimization
  css: {
    devSourcemap: true,
  },
  // Enable esbuild for faster builds
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})