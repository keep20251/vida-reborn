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
      md: '980px', // header(72) + main(600) + aside(300) = 972
      lg: '1108px', // header(72) + main(600) + aside(300) = 972
      xl: '1295px', // header(270) + main(600) + aside(350) = 1220
    },
    extend: {
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(250px, 1fr))',
      },
    },
    spacing: generateSpacing(),
  },
  plugins: [],
}
