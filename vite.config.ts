import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

function localFilesApi() {
  return {
    name: 'local-files-api',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url.startsWith('/api/files')) {
          const urlStr = `http://${req.headers.host}${req.url}`;
          const url = new URL(urlStr);
          const dir = url.searchParams.get('path');
          const file = url.searchParams.get('file');

          if (!dir || !file) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Missing path or file' }));
            return;
          }

          const filePath = path.join(dir, file);

          if (req.method === 'GET') {
            if (fs.existsSync(filePath)) {
              const content = fs.readFileSync(filePath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ content }));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'File not found' }));
            }
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                fs.writeFileSync(filePath, data.content, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), localFilesApi()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
