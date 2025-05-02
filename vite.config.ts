import { defineConfig } from "vite"
import { fileURLToPath, URL } from "url"
import vue from "@vitejs/plugin-vue"
import ElementPlus from "unplugin-element-plus/vite"

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue(), ElementPlus()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
