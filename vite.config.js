import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base is set via VITE_BASE_URL env var for GitHub Pages deployment
  // For local/Docker: leave unset (defaults to '/')
  // For GitHub Pages: set to '/your-repo-name/' in deploy.yml
  base: process.env.VITE_BASE_URL || '/',
})
