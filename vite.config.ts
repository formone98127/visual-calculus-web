import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const ghPages = process.env.GITHUB_PAGES === 'true'
  return {
    plugins: [react()],
    // GitHub Pages needs /visual-calculus-web/; Vercel/local use /
    base: command === 'build' && ghPages ? '/visual-calculus-web/' : '/',
  }
})
