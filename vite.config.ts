import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function bmsProxyPlugin(): Plugin {
  return {
    name: 'bms-dynamic-proxy',
    configureServer(server) {
      server.middlewares.use('/bms-api', async (req, res) => {
        const targetUrl = req.headers['x-bms-target'] as string | undefined;
        if (!targetUrl) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing x-bms-target header' }));
          return;
        }

        try {
          const url = new URL(req.url ?? '/', targetUrl);
          const headers: Record<string, string> = {};
          if (req.headers['authorization']) {
            headers['Authorization'] = req.headers['authorization'] as string;
          }
          if (req.headers['content-type']) {
            headers['Content-Type'] = req.headers['content-type'] as string;
          }

          const proxyRes = await fetch(url.toString(), { headers });
          res.writeHead(proxyRes.status, {
            'Content-Type': proxyRes.headers.get('content-type') ?? 'application/json',
          });
          const body = await proxyRes.text();
          res.end(body);
        } catch (err) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: String(err) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), bmsProxyPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-antd': ['antd', '@ant-design/icons'],
          'vendor-echarts': ['echarts', 'echarts-for-react'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-utils': ['xlsx', 'dayjs', 'js-cookie'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/hosxp-api': {
        target: 'https://hosxp.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hosxp-api/, ''),
      },
    },
  },
});
