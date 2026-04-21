/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#FF0008',
          'red-light': '#FFC7CB',
          'red-supporting': '#FFC7CB',
        },
        page: {
          bg: '#F4F6F9',
        },
        text: {
          primary: '#434343',
          sub: '#8A8988',
          disabled: '#C9C9C9',
          error: '#FB3234',
          white: '#FFFFFF',
        },
        success: {
          bg: '#EEFDFC',
          text: '#0A544F',       // dark teal — profile badge text
          complete: '#00AC95',   // bright teal — declaration "Completed" status
          border: 'rgba(10, 84, 79, 0.1)',
        },
        error: {
          border: '#990005',     // dark red — declaration error border
          text: '#990005',       // dark red — declaration error message
        },
        line: {
          medium: '#EAEAEA',
          dark: '#D8D8D8',
          footer: '#DFE7F1',
        },
        table: {
          alt: '#FCFCFC',
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        display: ['"Sharp Sans Display No1"', '"Open Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 1px 20px 0px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        full: '100px',
      },
    },
  },
  plugins: [],
}
