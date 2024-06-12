import {defineConfig} from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  jsxFramework: "react",

  // Where to look for your css declarations
  include: ['./src/**/*.{ts,tsx,js,jsx,astro}', './pages/**/*.{ts,tsx,js,jsx,astro}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  layers: {
    utilities: 'panda_utilities',
    base: "panda_base",
    recipes: "panda_recipes",
    reset: "panda_reset",
    tokens: "panda_tokens",
  },

  // The output directory for your css system
  outdir: "styled-system",
});
