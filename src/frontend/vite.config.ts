import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    hmr: true,
    proxy: {
      "/api": {
        target: "http://localhost:4000/",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
