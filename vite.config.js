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
  base: './',
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
  ],
  server: {
      host: '0.0.0.0',
      // port: 9999,
      proxy: {
      '/api': {
        // target: 'http://192.168.0.201:85',
        target: 'http://36.2.11.197:80',
        // target : 'http://114.255.88.34:85'
        //rewrite: (path)=>path.replace('/api', '')
      },
      '/raster': {
        target: 'http://192.168.0.201:85',
      }
    }
  }
})
