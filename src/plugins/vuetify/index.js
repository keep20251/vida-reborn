import '@mdi/font/css/materialdesignicons.min.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import colors from 'vuetify/lib/util/colors'
import { customSVG } from './custom-icon.js'

/**
 * @description[colors]可以自行增加，
 * 預設的不要刪除，包括:
 * [background]、[surface]、
 * [primary]、[secondary]、
 * [error]、[info]、
 * [success]、[warning]
 */

// Light Theme 亮色模式
const light = {
  dark: false,
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    primary: colors.indigo.lighten1,
    secondary: colors.teal.lighten1,
    error: colors.red.lighten1,
    info: colors.cyan.lighten1,
    success: colors.green.lighten1,
    warning: colors.amber.lighten1,
  },
}

// Dark Theme 暗色模式
const dark = {
  dark: true,
  colors: {
    background: '#181925',
    surface: '#333546',
    primary: '#F42C52',
    'primary-gray': '#3B3C46',
    'primary-gradient-from': '#F95E0E',
    'primary-gradient-to': '#E717B3',
    'promotion-gradient-from': '#0067ff',
    'promotion-gradient-to': '#ff00bf',
    subtitle: '#747474',
    'subtitle-x': '#8c8c8c',
    grayscale: '#E0E0E0',
    graydisabled: '#D7D7D7',
    input: '#B8B8B8',
    'primary-x': '#EB001B',
    'primary-green': '#70FF00',
    'primary-yellow': '#FFDE33',
    secondary: colors.teal.darken1,
    error: colors.red.darken1,
    info: colors.cyan.darken1,
    success: colors.green.darken1,
    warning: colors.amber.darken1,
    'primary-x-reviewed': '#FF6683',
    'info-x': '#FFA800',
    'gray-x': '#4B4D5F',
  },
}

/**
 * @description
 * [theme.themes] 可以自行增加，支援多種色版動態套用
 */
export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      custom: customSVG,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light,
      dark,
    },
  },
})
