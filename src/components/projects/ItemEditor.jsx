import { Pencil } from 'lucide-react';
import api from '../../api/client';
import { idOf } from '../../api/model';
import { ConfirmRemoval } from '../ConfirmRemoval';

export function ItemEditor({ path, item, updated, label, children }) {
  async function remove() {
    await api.delete(path + '/' + idOf(item));
    updated();
  }

  return <details className="project-control">
    <summary className="button secondary"><Pencil size={17} aria-hidden="true" /> Editar {label}</summary>
    <div className="subsection">{children}
      <ConfirmRemoval label={'Eliminar ' + label} title={'¿Eliminar ' + label + '?'}
        description="Esta acción es permanente." onConfirm={remove} />
    </div>
  </details>;
}
