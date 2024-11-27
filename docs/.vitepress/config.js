import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'VIDA Documentation',
  description: 'VIDA Developer Documentation',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: 'Home', link: '/' }],

    sidebar: [
      { text: '專案說明', link: '/main' },
      { text: 'Git規範', link: '/git' },
      { text: 'i18n管理', link: '/i18n' },
      { text: 'icon管理', link: '/icon' },
      { text: 'docker啟用方式', link: '/docker' },
      { text: 'SSR渲染機制與組件', link: '/ssr' },
      {
        text: '組件',
        items: [
          { text: '頁面標頭', link: '/component/head' },
          { text: '彈窗', link: '/component/modal' },
        ],
        collapsed: true,
      },
      { text: '疑難雜症', link: '/trouble-shooting' },
    ],
  },
})
