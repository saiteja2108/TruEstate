module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        truestate: {
          50: '#f7fbff',
          100: '#eef7ff',
          200: '#d6eeff',
          500: '#2b6ef6'
        }
      },
      keyframes: {
        'scan': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    }
  },
  plugins: []
};
