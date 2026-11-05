/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#EAEEF3',
          dark: '#0B0D13',
        },
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#141721',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F6F8FA',
          hover: '#EDF1F5',
          dark: '#141721',
          'dark-elevated': '#1B1F2D',
          'dark-hover': '#232838',
        },
        ink: {
          DEFAULT: '#111827',
          secondary: '#4B5563',
          muted: '#8A92A6',
          light: '#9CA3AF',
        },
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.06)',
          light: 'rgba(0, 0, 0, 0.04)',
          strong: 'rgba(0, 0, 0, 0.12)',
          dark: '#262A40',
        },
        accent: {
          DEFAULT: '#1E2024',
          blue: '#2563EB',
          emerald: '#10B981',
          indigo: '#4F46E5',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card-clean': '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 4px 10px -2px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.07), 0 8px 16px -4px rgba(0, 0, 0, 0.03)',
        'pill': '0 2px 6px rgba(0, 0, 0, 0.04)',
        'elevated': '0 20px 50px rgba(18, 24, 38, 0.08)',
        'tooltip': '0 10px 25px -3px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
