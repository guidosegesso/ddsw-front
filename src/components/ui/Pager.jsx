import { ArrowLeft, ArrowRight } from 'lucide-react';

export function Pager({ page, next, onChange }) {
  if (page === 1 && !next) return null;
  return <nav className="pager" aria-label="Paginación">
    <button className="button secondary" disabled={page === 1} onClick={() => onChange(page - 1)}><ArrowLeft size={16} /> Anterior</button>
    <span>Página {page}</span>
    <button className="button secondary" disabled={!next} onClick={() => onChange(page + 1)}>Siguiente <ArrowRight size={16} /></button>
  </nav>;
}
