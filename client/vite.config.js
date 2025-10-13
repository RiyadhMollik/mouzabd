import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    historyApiFallback: true, // 👈 for dev server
  },
  build: {
    // Minify and obfuscate in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    // Source maps disabled for security
    sourcemap: false,
    // Rollup options for additional obfuscation
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});