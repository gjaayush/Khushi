import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Fix for React 19 CJS/ESM interop in @react-three/fiber with bundlers
function fixReactThreeFiberReact19() {
  return {
    name: 'fix-r3f-react-19',
    transform(code, id) {
      if (id.includes('@react-three') || id.includes('its-fine') || id.includes('react-reconciler')) {
        let transformed = code;
        if (transformed.includes('import React__default from')) {
          transformed = transformed.replace(
            /import\s+React__default\s+from\s+['"]react['"];?/g,
            'import * as React__default_raw from "react";\nconst React__default = React__default_raw.default || React__default_raw;'
          );
        }
        return {
          code: transformed,
          map: null,
        };
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    fixReactThreeFiberReact19(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
  },
})


