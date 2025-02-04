import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#0066ff",
        secondary: "#f0f2f5",
        "text-primary": "#000000",
        "text-secondary": "#6c757d",
        "border-color": "#e9ecef",
      },
    },
  },
  plugins: [],
} satisfies Config;
