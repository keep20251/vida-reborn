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
      sm: '672px', // header(60) + main(fit) + aside(0)
      md: '987px', // header(72) + main(600) + aside(300) = 972
      lg: '1108px', // header(72) + main(600) + aside(300) = 972
      xl: '1295px', // header(270) + main(600) + aside(350) = 1220
    },
    fontSize: {
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
        gray66: 'rgba(0, 0, 0, 0.66)',
        gray36: 'rgba(0, 0, 0, 0.36)',
        gray30: 'rgba(0, 0, 0, 0.30)',
        gray20: 'rgba(0, 0, 0, 0.20)',
        gray15: 'rgba(0, 0, 0, 0.15)',
        gray10: 'rgba(0, 0, 0, 0.10)',
        gray05: 'rgba(0, 0, 0, 0.05)',
        gray03: 'rgba(0, 0, 0, 0.03)',
        warning: '#FF1D00',
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
      },
    },
    spacing: generateSpacing(),
  },
  plugins: [],
}
