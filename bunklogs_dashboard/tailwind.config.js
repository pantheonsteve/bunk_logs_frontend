/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    'bg-[#e86946]',
    'bg-[#de8d6f]',
    'bg-[#e5e825]',
    'bg-[#90d258]',
    'bg-[#18d128]',
  ],
  // ...other configurations
};

