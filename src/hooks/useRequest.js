import { useCallback, useEffect, useState } from 'react';
import api, { allPages, errorText } from '../api/client';

export function useRequest(path, params = {}, aggregate = false) {
  const query = JSON.stringify(params);
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({ loading: Boolean(path) });
  const key = JSON.stringify([path, query, aggregate, version]);
  const reload = useCallback(() => setVersion(current => current + 1), []);

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    const options = JSON.parse(query);
    const request = aggregate
      ? allPages(path, options, controller.signal)
      : api.get(path, { params: options, signal: controller.signal });
    request.then(
      response => { if (!controller.signal.aborted) setResult({ ...response, key }); },
      error => { if (!controller.signal.aborted) setResult({ error: errorText(error), key }); },
    );
    return () => controller.abort();
  }, [path, query, aggregate, key]);

  return {
    ...(result.key === key ? result : { loading: Boolean(path) }),
    reload,
  };
}
