// The app uses product CSS directly. Keeping PostCSS empty avoids a Windows
// Unicode-path bug in Tailwind's dev-time HTML proxy scanner.
const config = { plugins: {} };

export default config;
