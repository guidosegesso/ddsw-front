import axios from 'axios';

export const sessionKey = 'codigo-a-voluntad.token';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
});

client.interceptors.request.use(config => {
  const token = sessionStorage.getItem(sessionKey);
  if (token && !['/auth/login', '/auth/registro'].includes(config.url)) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

client.interceptors.response.use(response => response.data, error => {
  const token = sessionStorage.getItem(sessionKey);
  if (error.response?.status === 401 && token &&
      error.config?.headers?.Authorization === 'Bearer ' + token) {
    sessionStorage.removeItem(sessionKey);
    window.dispatchEvent(new Event('session-expired'));
  }
  return Promise.reject(error);
});

export function errorText(error) {
  return error.response?.data?.message ||
    (error.response ? 'No se pudo completar la operación.' : 'No pudimos conectar con el servicio. Intentá de nuevo.');
}

export async function allPages(path, params, signal) {
  const items = [];
  for (let page = 1; ; page += 1) {
    const result = await client.get(path, { params: { ...params, page }, signal });
    items.push(...result.data);
    if (!result.paginacion?.haySiguiente) return { data: items };
  }
}

export default client;
