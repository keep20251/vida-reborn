import vue from '@vitejs/plugin-vue'
import legacyPlugin from '@vitejs/plugin-legacy'
import eslintPlugin from 'vite-plugin-eslint'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import svgLoader from 'vite-svg-loader'
import unHeadVite from '@unhead/addons/vite'
import { defineConfig } from 'vite'
import { getOutputDir } from './node-utils/output'
import { terser } from 'rollup-plugin-terser'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: 'terser',
    rollupOptions: {
      plugins: [terser(), unHeadVite()],
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: process.env.APP_ENV === 'production',
      },
    },
    outDir: getOutputDir(),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    legacyPlugin(),
    eslintPlugin({ cache: false }),
    vueI18n({ include: resolve(__dirname, 'src/i18n/locale/**') }),
    svgLoader(),
  ],
  server: {
    host: '0.0.0.0',
    proxy: {},
  },
})
