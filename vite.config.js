import { defineConfig } from "vite"
import { resolve } from "path"
import progress from "vite-plugin-progress"
import react from "@vitejs/plugin-react"
import { visualizer } from "rollup-plugin-visualizer"

// import federation from "@originjs/vite-plugin-federation"
// const deps = require("./package.json").dependencies
// const pkg = require("./package.json")


export default defineConfig({
  plugins: [
    react(),
    progress(),
    visualizer(),
    // federation({
    //   name: "host-app",
    //   filename: "remoteEntry.js",
    //   remotes: {
    //     fileSystem: "http://localhost:3005/remoteEntry.js",
    //   },
    //   shared: {
    //     ...deps,
    //     react: {
    //       eager: true,
    //       singleton: true,
    //       requiredVersion: deps["react"],
    //     },
    //     "react-dom": {
    //       eager: true,
    //       singleton: true,
    //       requiredVersion: deps["react-dom"],
    //     },
    //   },
    // }),
  ],
  publicDir: "public",
  build: {
    outDir: "build",
    minify: "esbuild",
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 7777,
  },
  // esbuild: {
  //   drop: ['console'],
  // },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
    ],
  },
})
