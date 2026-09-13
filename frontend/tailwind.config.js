/**
 * Tailwind CSS Configuration
 *
 * This configuration sets up Tailwind to scan the source files for class names
 * and defines custom font families that map to the CSS variables defined in
 * `src/index.css`. The fonts are loaded via Google Fonts in `src/index.css`.
 */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use CSS variables for dynamic font swapping without recompiling Tailwind
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        heading: ["var(--font-heading)"],
      },
    },
  },
  plugins: [],
};
