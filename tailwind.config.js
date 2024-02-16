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
    boxShadow: {
      input: 'inset 0 -0.0625rem 0.5rem 0 rgba(0,0,0,0.1)',
      bottom: '0 -0.125rem 0.5625rem 0 rgba(0,0,0,0.1)',
      sm: '0 0 0.1875rem 0 rgba(0,0,0,0.1)', // 0 0 3px
      md: '0.0625rem 0.0625rem 0.25rem rgba(0,0,0,0.1)', // 1px 1px 4px
      lg: '0.0625rem 0.0625rem 0.3125rem rgba(0,0,0,0.1)', // 1px 1px 5px
      none: '0 0 #000',
    },
    extend: {
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(250px, 1fr))',
      },
      colors: {
        primary: '#6567E8',
        contrast: '#7FE2D3',
        warning: '#FF1D00',
        'subscribe-pink': '#FB47FF',
        'subscribe-orange': '#FF8947',
        'subscribe-red': '#FF4747',
        'subscribe-yellow': '#FFCB47',
        'subscribe-green': '#47FF86',
        'subscribe-blue': '#4786FF',
        'gray-57': '#575757',
        'gray-a3': '#A3A3A3',
        'gray-cc': '#CCCCCC',
        'gray-e5': '#E5E5E5',
        'gray-f6': '#F6F6F6',
        'light-gray': '#D9D9D9',
        'gray-purple': '#F4C2EF',
        'gray-orange': '#FFC8C8',
        'gray-pink': '#FFC6D4',
        'gray-brown': '#FFF2DE',
        'gray-cyan': '#7FE2D3',
      },
      keyframes: {
        flash: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      borderRadius: {
        inherit: 'inherit',
        sm: '0.4375rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '0.9375rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      lineHeight: {
        md: '0.875rem',
        lg: '1.125rem',
        xl: '1.5625rem',
      },
      listStyleType: {
        'lower-alpha': 'lower-alpha',
      },
      content: {
        more: '"more"',
      },
    },
    spacing: generateSpacing(),
  },
  plugins: [],
}
