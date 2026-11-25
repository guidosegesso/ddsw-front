import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import api from '../api/client';
import { idOf } from '../api/model';

async function hasPendingApplications(projectId, signal) {
  const path = '/proyectos/' + projectId;
  const { data: project } = await api.get(path, { signal });

  for (const profile of project.perfiles ?? []) {
    const url = path + '/perfiles/' + idOf(profile) + '/postulaciones';
    for (let page = 1; ; page += 1) {
      const result = await api.get(url, { params: { page }, signal });
      if (result.data.some(item => item.estado === 'PENDIENTE')) return true;
      if (!result.paginacion?.haySiguiente) break;
    }
  }
  return false;
}

export function PendingApplications({ projectId }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    hasPendingApplications(projectId, controller.signal).then(
      pending => { if (!controller.signal.aborted) setResult({ pending }); },
      () => { if (!controller.signal.aborted) setResult({ error: true }); },
    );
    return () => controller.abort();
  }, [projectId]);

  if (result?.error) return <small className="muted">No se pudieron consultar las postulaciones.</small>;
  if (!result?.pending) return null;
  return <span className="badge pending"><ClipboardList size={15} aria-hidden="true" /> Postulaciones pendientes</span>;
}
