import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Prefix '' loads every variable, not just VITE_*. API_KEY deliberately has no
  // VITE_ prefix: it is read here, on the Node side, and injected by the proxy
  // below, so it never becomes part of the browser bundle.
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.API_TARGET || 'https://my-json-server-gbdv.onrender.com';

  // The API namespaces its own projects under /api (/api/books/books), so the
  // prefix is forwarded as-is instead of being rewritten away.
  const proxy = {
    '/api': {
      target,
      changeOrigin: true,
      secure: true,
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          if (env.API_KEY) proxyReq.setHeader('X-API-Key', env.API_KEY);
        });
      },
    },
  };

  return {
    plugins: [react()],
    // `preview` gets the same proxy as `dev`; without it a production build
    // served locally would 404 on every /api call.
    server: { port: 3000, proxy },
    preview: { port: 3000, proxy },
  };
});
