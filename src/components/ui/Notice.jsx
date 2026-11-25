import { AlertCircle } from 'lucide-react';

export function Notice({ error, children }) {
  if (!children) return null;
  return <div className={error ? 'notice error' : 'notice'} role={error ? 'alert' : 'status'}>
    {error && <AlertCircle size={19} aria-hidden="true" />}{children}
  </div>;
}
