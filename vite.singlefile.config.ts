import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

// 单文件构建：所有 JS/CSS/图片内联进一个 index.html，双击即可离线打开（地图需联网）
export default defineConfig({
  base: "./",
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsInlineLimit: 100 * 1024 * 1024,
    cssCodeSplit: false,
    outDir: "dist-single",
  },
})
