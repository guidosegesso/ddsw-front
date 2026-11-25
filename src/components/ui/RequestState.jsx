import { LoaderCircle } from 'lucide-react';
import { Notice } from './Notice';

export function RequestState({ request, children }) {
  if (request.loading) return <div className="empty" role="status"><LoaderCircle className="spin" aria-hidden="true" /> Cargando…</div>;
  if (request.error) return <div className="state"><Notice error>{request.error}</Notice>
    <button type="button" className="button secondary" onClick={request.reload}>Reintentar</button>
  </div>;
  return children;
}
