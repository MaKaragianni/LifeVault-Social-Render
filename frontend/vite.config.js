import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  define: {
    BACKEND_URL: JSON.stringify("http://localhost:3000"),
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.js",
    // Highlight-start
    define: {
      BACKEND_URL: JSON.stringify("http://localhost:3000"),
    },
    // Highlight-end
  },
});