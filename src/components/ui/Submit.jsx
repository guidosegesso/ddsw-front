import { LoaderCircle } from 'lucide-react';

export function Submit({ action, children, disabled }) {
  return <button className="button primary" disabled={action.busy || disabled}>
    {action.busy ? <><LoaderCircle className="spin" size={17} aria-hidden="true" /> Procesando…</> : children}
  </button>;
}
