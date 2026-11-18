import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// Next.js 16 hat "next lint" entfernt. ESLint läuft jetzt direkt mit "npm run lint"
// und nutzt das Flat-Config-Format statt .eslintrc.json.
export default defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts"]),
]);
