import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Enterprise SaaS Platform Colors
        'solar-primary': {
          DEFAULT: '#1e3a8a',  // Deep Royal Blue - Enterprise Authority
          light: '#3b82f6',    // Electric Blue - Interactive Elements
          dark: '#1e40af',     // Navy - Depth & Contrast
        },
        'solar-secondary': {
          DEFAULT: '#3b82f6',  // Electric Blue - Primary Actions
          light: '#60a5fa',
          dark: '#2563eb',
        },
        'solar-success': {
          DEFAULT: '#059669',  // Emerald - Profit & Growth (keep)
          light: '#10B981',
          dark: '#047857',
        },
        'solar-danger': {
          DEFAULT: '#DC2626',  // Red - Alerts (keep)
          dark: '#B91C1C',
        },
        'solar-gray': {
          50: '#f8fafc',   // slate-50 - Ultra Light Backgrounds
          100: '#f1f5f9',  // slate-100
          200: '#e2e8f0',  // slate-200
          300: '#cbd5e1',  // slate-300
          400: '#94a3b8',  // slate-400
          500: '#64748b',  // slate-500
          600: '#475569',  // slate-600
          700: '#334155',  // slate-700 - Dark UI Elements
          800: '#1e293b',  // slate-800 - Near Black
          900: '#0f172a',  // slate-900 - Pure Black
        },
        'solar-bg': '#f8fafc',  // slate-50
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
export default config
