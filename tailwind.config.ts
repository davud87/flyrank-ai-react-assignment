import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        taskflow: {
          background: 'var(--bg)',
          surface: 'var(--surface)',
          accent: 'var(--accent)',
          text: 'var(--text)',
          strong: 'var(--text-strong)',
          muted: 'var(--text-muted)',
        },
      },
      boxShadow: {
        taskflow: 'var(--shadow)',
      },
      borderRadius: {
        taskflow: '8px',
      },
    },
  },
  plugins: [],
}

export default config
