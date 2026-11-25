import { useState } from 'react';
import { errorText } from '../api/client';

export function useAction() {
  const [status, setStatus] = useState({});
  async function run(work, success) {
    setStatus({ busy: true });
    try {
      await work();
      setStatus({ success });
    } catch (error) {
      setStatus({ error: error.isAxiosError ? errorText(error) : error.message });
    }
  }
  return { ...status, run, reset: () => setStatus({}) };
}
