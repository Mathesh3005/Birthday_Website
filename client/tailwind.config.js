/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#232f3e', // Amazon dark blue
                secondary: '#febd69', // Amazon yellow/orange
            }
        },
    },
    plugins: [],
}
