import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://attendancetracker-backend1.onrender.com', // Backend API server
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@components': '/src/components', // Alias for the components directory
      '@assets': '/src/assets', // Example: Add more aliases as needed
    },
  },
});
