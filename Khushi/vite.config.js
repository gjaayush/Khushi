import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
  },
  build: {
    // Increase chunk size warning threshold (Three.js is inherently large)
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — tiny, loads first
          'vendor-react': ['react', 'react-dom'],
          // GSAP — needed for scroll animations, load early
          'vendor-gsap': ['gsap'],
          // Lenis smooth scroll
          'vendor-lenis': ['lenis'],
          // Three.js ecosystem — large, split out so it can be cached separately
          'vendor-three': ['three'],
          'vendor-r3f': ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})


