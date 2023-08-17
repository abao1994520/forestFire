import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'
// import Pages from 'vite-plugin-pages'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/360',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 打包依赖
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          return 'index';
    　　}
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router']
    }),
    Components({
      dirs: ['src/components'], 
      resolvers: [NaiveUiResolver()]
    }),
    viteCompression({
      threshold: 10240
    })
  ]
})
