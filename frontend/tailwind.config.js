/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#0a0a0a',
                    card: '#141414',
                    hover: '#1a1a1a',
                    border: '#262626',
                }
            }
        },
    },
    plugins: [],
}
