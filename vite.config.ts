import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages project site: https://<user>.github.io/visual-calculus-web/
  base: command === 'build' ? '/visual-calculus-web/' : '/',
}))
