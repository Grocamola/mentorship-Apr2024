import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: { 
    port: 3000,
    strictPort: true,
  },
  server: { 
    port: 3000,
    strictPort:true,
    host: true,
    origin: "http://0.0.0.0:3000",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname,"./src")
    }
  }
})
