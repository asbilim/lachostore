/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      // Add new custom breakpoints while preserving existing ones
      screens: {
        "sm-md": "600px", // Slightly before md
        "md-lg": "900px", // Between md and lg
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        sepia: {
          50: "hsl(35, 30%, 95%)",
          100: "hsl(35, 25%, 90%)",
          200: "hsl(30, 20%, 80%)",
          300: "hsl(30, 15%, 85%)",
          400: "hsl(20, 30%, 70%)",
          500: "hsl(25, 60%, 40%)",
          600: "hsl(30, 20%, 40%)",
          700: "hsl(30, 25%, 15%)",
          800: "hsl(30, 20%, 15%)",
          900: "hsl(30, 15%, 10%)",
        },
        green: {
          50: "hsl(60, 30%, 98%)",
          100: "hsl(60, 25%, 95%)",
          200: "hsl(90, 25%, 90%)",
          300: "hsl(90, 20%, 85%)",
          400: "hsl(120, 30%, 85%)",
          500: "hsl(140, 40%, 45%)",
          600: "hsl(140, 40%, 35%)",
          700: "hsl(120, 15%, 15%)",
          800: "hsl(120, 20%, 15%)",
          900: "hsl(120, 15%, 10%)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
