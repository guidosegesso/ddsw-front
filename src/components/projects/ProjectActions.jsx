import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { ConfirmRemoval } from '../ConfirmRemoval';
import { ProjectForm } from './ProjectForm';

export function ProjectActions({ path, project, updated }) {
  const navigate = useNavigate();

  async function remove() {
    await api.delete(path);
    navigate('/mis-proyectos', { replace: true, state: { message: 'Proyecto eliminado.' } });
  }

  async function finish() {
    await api.put(path, { estado: 'FINALIZADO' });
    updated();
  }

  return <details className="panel project-control">
    <summary className="button secondary"><Settings size={17} aria-hidden="true" /> Administrar proyecto</summary>
    <div className="subsection">
      <ProjectForm key={project.titulo + project.descripcion} project={project} saved={updated} />
      <div className="actions divider">
        {project.estado === 'ABIERTO' && <ConfirmRemoval label="Finalizar proyecto" title="¿Finalizar este proyecto?"
          description="Ya no se aceptarán postulaciones. Esta acción es permanente." onConfirm={finish} />}
        <ConfirmRemoval label="Eliminar proyecto" title="¿Eliminar este proyecto?"
          description="Esta acción es permanente." onConfirm={remove} />
      </div>
    </div>
  </details>;
}
