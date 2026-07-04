import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiPrefix = env.VITE_API_PREFIX || '/api'
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'https://qldn.zsellers.com'

  if (mode === 'development') {
    console.info(`[vite] API prefix = ${apiPrefix}, proxy → ${proxyTarget}`)
    console.info(
      `[vite] Socket proxy /socket.io → ${env.VITE_SOCKET_PROXY_TARGET || 'http://127.0.0.1:6001'}`,
    )
  }

  return {
    plugins: [vue(), vueJsx(), vueDevTools()],
    envPrefix: 'VITE_',
    server: {
      port: 3000,
      proxy: {
        [apiPrefix]: {
          target: proxyTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', (err, _req, res) => {
              console.error(`[vite] API proxy error (${proxyTarget}):`, err.message)
              if (res && !res.headersSent && 'writeHead' in res) {
                res.writeHead(502, { 'Content-Type': 'application/json' })
                res.end(
                  JSON.stringify({
                    message: `Không kết nối được backend tại ${proxyTarget}. Chạy php artisan serve và kiểm tra VITE_API_PROXY_TARGET.`,
                  }),
                )
              }
            })
          },
        },
        '/socket.io': {
          target: env.VITE_SOCKET_PROXY_TARGET || 'http://127.0.0.1:6001',
          changeOrigin: true,
          ws: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
