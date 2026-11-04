import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Bilder kommen direkt vom TMDB-CDN (schon passende Größen) → next/image bringt hier wenig
      // und würde Vercels Image-Optimization-Kontingent verbrauchen
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
