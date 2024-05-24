import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd())
  }

  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      minify: true,
      brotliSize: false,
      outDir: 'dist'
    },
    server: {
      // proxy: {
      //   '/api/auth': {
      //     target: process.env.VITE_AUTH_HOST,
      //     changeOrigin: true,
      //     followRedirects: true,
      //     rewrite: (path) => path.replace(/^\/api\/auth/, ''),
      //     cookieDomainRewrite: {
      //       '*': ''
      //     }
      //   },
      // },
      proxy: {
        '/api': {
          target: process.env.VITE_API_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          cookieDomainRewrite: {
            '*': ''
          }
        },
      },
      port: 80,
    }
  })
}
