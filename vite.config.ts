import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // served from https://ioanbutiu.github.io/firefly-careers/
  base: '/firefly-careers/',
  plugins: [react()],
})
