/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      // 🌈 Custom Colors
      colors: {
        cyanglow: '#00e5ff',
        cyansoft: '#0ff',
        'bg-dark': '#0f0f12',
        panel: '#151516',
      },

      // 🎬 Custom Keyframes for Animations
      keyframes: {
        blink: {
          '0%, 49%': { opacity: 0 },
          '50%, 100%': { opacity: 1 },
        },
        backgroundAnimation: {
          '0%': {
            background: 'linear-gradient(45deg, #121212, #1f1f1f)',
          },
          '100%': {
            background: 'linear-gradient(45deg, #1f1f1f, #121212)',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(16px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-12px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        zoomIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },

      // 🌀 Animation Shortcuts
      animation: {
        backgroundAnimation: 'backgroundAnimation 10s infinite alternate',
        fadeInUp: 'fadeInUp 420ms ease both',
        fadeInDown: 'fadeInDown 420ms ease both',
        slideUp: 'slideUp 420ms ease both',
        zoomIn: 'zoomIn 0.8s ease-out both',
      },

      // 🌟 Box Shadows
      boxShadow: {
        cyanglow: '0 8px 30px rgba(0,229,255,0.08), 0 2px 6px rgba(0,229,255,0.06)',
      },

      // ✨ Optional Fonts, Spacing etc. can go here...
    },
  },
  plugins: [],
}
