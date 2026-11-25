import { defineConfig } from 'cypress';
import { createServer } from 'vite';

const host = '127.0.0.1';
const port = 4175;

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'http://' + host + ':' + port,
    supportFile: false,
    async setupNodeEvents(on, config) {
      const server = await createServer({ server: { host, port, strictPort: true } });
      const apiUrl = server.config.env.VITE_API_URL;
      if (!apiUrl || !/^https?:\/\//i.test(apiUrl)) {
        await server.close();
        throw new Error('Configurá VITE_API_URL con la URL absoluta de la API de pruebas en .env.local.');
      }

      await server.listen();
      on('after:run', () => server.close());
      config.expose = { ...config.expose, apiUrl: apiUrl.replace(/\/+$/, '') };
      return config;
    },
  },
});
