/* eslint-disable no-use-before-define */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacyPlugin from '@vitejs/plugin-legacy'

import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import svgLoader from 'vite-svg-loader'
import { terser } from 'rollup-plugin-terser'
import unHeadVite from '@unhead/addons/vite'

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

const getOutputDir = () => {
  const args = process.argv.slice(2)
  if (args.includes('staging')) {
    return 'dist-staging'
  }
  return 'dist'
}
