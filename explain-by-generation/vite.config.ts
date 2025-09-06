import react from "@vitejs/plugin-react-swc"
import path from "path"
import { defineConfig } from "vite"

// Chrome target version for better compatibility
const CHROME_TARGET = "chrome130"

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild', // Use esbuild for faster minification
    sourcemap: false, // Disable source maps for production
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "index.html"),
        popupHtml: path.resolve(__dirname, "popup.html"),
        background: path.resolve(__dirname, "src/background.ts"),
        'content-script': path.resolve(__dirname, "src/content-script.ts")
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Ensure content and background scripts are named correctly
          return chunkInfo.name === "background" ? "background.js" : 
                 chunkInfo.name === "content-script" ? "content-script.js" : "[name].js"
        },
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        manualChunks: {
          // Split vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-slot', 'lucide-react']
        }
      },
      external: ['chrome'] // Chrome APIs are external
    },
    outDir: "dist",
    emptyOutDir: true,
    target: CHROME_TARGET, // Use constant for Chrome target
    chunkSizeWarningLimit: 500 // Warn about large chunks
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  // Ensure content script is processed correctly
  optimizeDeps: {
    include: ["react", "react-dom"]
  },
  // Disable code splitting for background and content scripts
  experimental: {
    renderBuiltUrl(filename, { type }) {
      if (type === "asset") {
        return filename
      }
      return { relative: true }
    }
  }
})
