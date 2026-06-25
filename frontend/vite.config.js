import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      BACKEND_URL: JSON.stringify(env.VITE_BACKEND_URL || "http://localhost:3000"),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./vitest.setup.js",
      define: {
        BACKEND_URL: JSON.stringify("http://localhost:3000"),
      },
    },
  };
});