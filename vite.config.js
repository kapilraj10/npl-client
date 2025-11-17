import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind CSS v4: use the official Vite plugin + index.css @import "tailwindcss"
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // './' works for relative paths, use '/' for root deployment
})
