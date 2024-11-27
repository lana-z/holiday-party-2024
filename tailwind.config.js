/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  safelist: [
    'bg-burgundy',
    'bg-emerald',
    'text-[#fdf7d7]',
    'text-[#f1f1f1]',
    {
      pattern: /^(bg|text|border|ring)-(burgundy|emerald|champagne|platinum|wine|sapphire|dark)/,
      variants: ['hover', 'focus', 'active']
    }
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['var(--font-playfair)'],
        'great-vibes': ['var(--font-great-vibes)'],
      },
      colors: {
        // Rich Colors
        burgundy: 'hsl(var(--burgundy))',
        champagne: 'hsl(var(--champagne))',
        platinum: 'hsl(var(--platinum))',
        
        // Accent Colors
        emerald: 'hsl(var(--emerald))',
        sapphire: 'hsl(var(--sapphire))',
        wine: 'hsl(var(--wine))',
        
        // System Colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        
        // Dark Theme Colors
        dark: {
          bg: 'hsl(var(--dark-bg))',
          input: 'hsl(var(--dark-input))',
          border: 'hsl(var(--dark-border))',
          placeholder: 'hsl(var(--dark-placeholder))'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
