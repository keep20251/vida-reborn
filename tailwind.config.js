const generateSpacing = () => {
  const set = {}
  for (let index = 0; index <= 100; index++) {
    set[index] = `${index / 16}rem`
  }
  return set
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      // sm: '672px', // header(60) + main(fit) + aside(0)
      // md: '987px', // header(72) + main(600) + aside(300) = 972
      // lg: '1108px', // header(72) + main(600) + aside(300) = 972
      // xl: '1295px', // header(270) + main(600) + aside(350) = 1220
      sm: '672px', // header(60) + main(fit px(40)) + aside(0)
      md: '958px', // header(72) + main(540 px(40)) + gap(20) + aside(300) = 952
      lg: '1108px', // header(72) + main(540 px(40)) + gap(20) + aside(300) = 952
      xl: '1170px', // header(150) + main(540 px(40)) + gap(40) + aside(300) = 1050
    },
    fontSize: {
      xs: '0.625rem', // 10px
      sm: '0.75rem', // 12px
      base: '0.875rem', // 14px
      lg: '1.125rem', // 18px
      xl: '1.5625rem', // 25px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    extend: {
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(250px, 1fr))',
      },
      colors: {
        primary: '#6567E8',
        contrast: '#7FE2D3',
        gray66: '#565656',
        gray36: '#A3A3A3',
        gray30: '#B2B2B2',
        gray20: '#CCCCCC',
        gray15: '#D8D8D8',
        gray10: '#E6E6E6',
        gray05: '#F2F2F2',
        gray03: '#F7F7F7',
        warning: '#FF1D00',
        'light-gray': '#D9D9D9',
        'gray-brown': '#FFDEDE',
        'gray-purple': '#F4C2EF',
        'gray-orange': '#FFC8C8',
        'gray-cyan': '#7FE2D3',
      },
      keyframes: {
        flash: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      borderRadius: {
        sm: '4.375rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '0.9375rem',
        18: '1.125rem',
      },
      lineHeight: {
        md: '0.875rem',
      },
    },
    spacing: generateSpacing(),
  },
  plugins: [],
}
