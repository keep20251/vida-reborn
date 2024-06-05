import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config.js'

export function useStripeAppearance() {
  const { theme } = resolveConfig(tailwindConfig)
  console.log('useStripeAppearance.theme', theme)

  const fontFamily =
    '"Helvetica Neue",Helvetica, -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"'

  const themeDefault = {
    theme: 'stripe',
    variables: {
      colorPrimary: theme.colors.primary,
      colorBackground: theme.colors.white,
      colorText: theme.colors['gray-a3'],
      colorDanger: theme.colors.warning,
      fontFamily,
      gridRowSpacing: theme.space['10'],
      gridColumnSpacing: theme.space['10'],
      borderRadius: theme.borderRadius.full,
      fontSizeBase: theme.fontSize.sm,
      fontLineHeight: theme.lineHeight['3'],
      fontWeightBold: theme.fontWeight.medium,
    },
    rules: {
      '.Tab': { boxShadow: theme.boxShadow.input },
      '.Input': { boxShadow: theme.boxShadow.input },
      '.Dropdown': { boxShadow: theme.boxShadow.input },
    },
  }
  return { themeDefault }
}
