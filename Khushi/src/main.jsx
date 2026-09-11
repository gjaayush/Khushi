import * as React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// React 19 global / default export polyfill for Three.js / R3F packages
if (typeof window !== 'undefined') {
  window.React = React;
  if (!React.default) {
    try {
      Object.defineProperty(React, 'default', {
        value: React,
        enumerable: false,
        configurable: true,
      });
    } catch {
      React.default = React;
    }
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
