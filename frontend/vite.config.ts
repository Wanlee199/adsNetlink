import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      target: "cloudflare-pages",
      pages: [
        { path: "/", prerender: { enabled: true, crawlLinks: false } },
      ],
      sitemap: {
        host: "https://aicademy.org",
      },
    }),
  ],
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    exclude: ["@tanstack/start-client-core"],
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }

        warn(warning);
      },
      onLog(level, log, handler) {
        if (log.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }

        handler(level, log);
      },
    },
  },
  server:{
    allowedHosts: true
  }
});
