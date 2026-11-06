import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { ttsVitePlugin } from './tts-plugin.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    ttsVitePlugin()
  ],
  server: {
    port: 5173,
    host: true
  }
});
