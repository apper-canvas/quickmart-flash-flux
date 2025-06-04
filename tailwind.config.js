/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E74C3C',
          light: '#EC7063',
          dark: '#C0392B'
        },
        secondary: {
          DEFAULT: '#3498DB',
          light: '#5DADE2',
          dark: '#2E86C1'
        },
        accent: '#F39C12',
        success: '#27AE60',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        payment: {
          processing: '#f59e0b',
          success: '#10b981',
          error: '#ef4444',
          pending: '#6b7280'
        },
        card: {
          visa: '#1a1f71',
          mastercard: '#eb001b',
          amex: '#006fcf',
          discover: '#ff6000',
          generic: '#6b7280'
        }
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
        heading: ['Roboto', 'ui-sans-serif', 'system-ui'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'hover': '0 8px 16px rgba(0,0,0,0.15)',
        'payment': '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      fontSize: {
        'xs': '13px',
        'sm': '14px',
        'base': '16px',
        'lg': '19px',
        'xl': '23px',
        '2xl': '28px',
        '3xl': '33px',
'4xl': '40px'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'card-flip': 'cardFlip 0.6s ease-in-out',
'payment-pulse': 'paymentPulse 2s ease-in-out infinite',
        'secure-glow': 'secureGlow 1.5s ease-in-out infinite alternate',
        'cart-bounce': 'cartBounce 0.6s ease-out',
        'cart-item-add': 'cartItemAdd 0.4s ease-out',
        'cart-notification': 'cartNotification 0.5s ease-out',
        'cart-slide-in': 'cartSlideIn 0.3s ease-out',
        'cart-count-pulse': 'cartCountPulse 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' }
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(0deg)' }
        },
        paymentPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' }
        },
        secureGlow: {
          '0%': { boxShadow: '0 0 5px rgba(34, 197, 94, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)' }
        },
        cartBounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0) scale(1)' },
          '40%': { transform: 'translateY(-5px) scale(1.05)' },
          '60%': { transform: 'translateY(-3px) scale(1.02)' }
        },
        cartItemAdd: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '50%': { transform: 'translateX(5px)', opacity: '0.8' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        cartNotification: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        cartSlideIn: {
'0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        cartCountPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}