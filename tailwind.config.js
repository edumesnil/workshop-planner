import { heroui } from "@heroui/react"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'fixed',
    'inset-0',
    'z-50',
    'flex',
    'items-center',
    'items-end',
    'justify-center',
    'w-screen',
    'overflow-x-auto',
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    require('@tailwindcss/typography'),
    heroui(),
  ],
}