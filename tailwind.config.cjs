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
        // ✨ NEW Timeline Animations
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(0, 229, 255, 0.5)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(0, 229, 255, 0.8)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '0.3',
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: '0.6',
            transform: 'scale(1.1)',
          },
        },
        'timeline-line': {
          '0%': { scaleY: '0' },
          '100%': { scaleY: '1' },
        },
        'dot-pulse': {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': { 
            transform: 'scale(1.5)',
            opacity: '0.5',
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
        // ✨ NEW Timeline Animations
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'timeline-line': 'timeline-line 1.2s ease-in-out',
        'dot-pulse': 'dot-pulse 2s ease-in-out infinite',
      },

      // 🌟 Box Shadows
      boxShadow: {
        cyanglow: '0 8px 30px rgba(0,229,255,0.08), 0 2px 6px rgba(0,229,255,0.06)',
        // ✨ NEW Timeline Shadows
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.5)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
      },

      // 📐 Transitions
      transitionDuration: {
        '300': '300ms',
        '500': '500ms',
      },
    },
  },
  plugins: [],
}