import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // ✅ Enable dark mode via 'class'
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px', // subtle blur option
      },
      colors: {
        // Optional: You can define glassmorphism-friendly colors here
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-border': 'rgba(255, 255, 255, 0.2)',
      },
    },
  },
  plugins: [typography],
};
