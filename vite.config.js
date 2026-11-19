import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/listen': { target: 'http://2.25.141.39', changeOrigin: true },
      '/hls': { target: 'http://2.25.141.39', changeOrigin: true },
      '/api': { target: 'http://2.25.141.39', changeOrigin: true },
      '/status-json.xsl': { target: 'http://2.25.141.39', changeOrigin: true }
    }
  }
});
