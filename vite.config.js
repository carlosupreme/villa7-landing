import { defineConfig } from 'vite'
// BASE_PATH=/villa7-landing/ for GitHub Pages; defaults to / for the nginx deploy
export default defineConfig({ base: process.env.BASE_PATH || '/', server: { host: '127.0.0.1', port: 5173 } })
