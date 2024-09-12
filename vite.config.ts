import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist', // Make sure this is set to your desired output directory
    rollupOptions: {
      input: {
        main: 'index.html', // Ensure your entry HTML file is correctly specified
      },
    },
  },
})
