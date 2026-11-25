import { createContext, useContext, useEffect, useState } from 'react';
import api, { errorText, sessionKey } from '../api/client';

const Session = createContext(null);
export const useSession = () => useContext(Session);

export function SessionProvider({ children }) {
  const [state, setState] = useState(() => ({ loading: !!sessionStorage.getItem(sessionKey) }));

  async function restore(signal) {
    try {
      const { data } = await api.get('/auth/me', { signal });
      if (!signal?.aborted) setState({ account: data });
    } catch (error) {
      if (!signal?.aborted) setState(error.response?.status === 401 ? {} : { error: errorText(error) });
    }
  }

  function logout() {
    sessionStorage.removeItem(sessionKey);
    setState({});
  }

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener('session-expired', logout);
    if (sessionStorage.getItem(sessionKey)) restore(controller.signal);
    return () => {
      controller.abort();
      window.removeEventListener('session-expired', logout);
    };
  }, []);

  async function login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    sessionStorage.setItem(sessionKey, data.accessToken);
    try {
      const user = await api.get('/auth/me');
      setState({ account: user.data });
    } catch (error) {
      logout();
      throw error;
    }
  }

  function reload() {
    setState({ loading: true });
    restore();
  }

  return <Session.Provider value={{ ...state, login, logout, reload }}>{children}</Session.Provider>;
}
