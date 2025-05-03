import { defineConfig } from "vite"
import { fileURLToPath, URL } from "url"
import vue from "@vitejs/plugin-vue"

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
