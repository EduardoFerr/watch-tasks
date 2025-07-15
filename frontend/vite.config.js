import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    watch: {
      usePolling: true
    },
    proxy: {
      // O proxy para as nossas chamadas de API normais (HTTP)
      '/api': {
        target: 'http://backend:3333',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // --- ADIÇÃO AQUI ---
      // Um novo proxy específico para as nossas ligações WebSocket (WS)
      '/ws': {
        target: 'ws://backend:3333', // Aponta para o serviço do backend com o protocolo ws
        ws: true, // Habilita o proxy para WebSockets
      }
    }
  }
});
