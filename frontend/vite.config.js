import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Force re-optimization on every restart
    force: true,
    // Optionally, explicitly include the dependency
    include: ['chakra-dayzed-datepicker']
  },
})
