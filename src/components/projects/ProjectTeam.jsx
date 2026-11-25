import { useState } from 'react';
import { idOf } from '../../api/model';
import { Empty } from '../ui/Empty';
import { Notice } from '../ui/Notice';
import { RequestState } from '../ui/RequestState';
import { useRequest } from '../../hooks/useRequest';
import { Participant } from './Participant';

export function ProjectTeam({ projectPath, projectId, owner }) {
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState('');
  const result = useRequest(projectPath + '/colaboraciones', { page });

  function removed() {
    setFeedback('La colaboración se dio de baja y el cupo se liberó.');
    result.reload();
  }

  return <section id="equipo" className="stack">
    <h2>Equipo del proyecto</h2>
    <Notice>{feedback}</Notice>
    <RequestState request={result}>
      {result.data?.length
        ? <ul className="participants">{result.data.map(item => <Participant key={idOf(item)} collaboration={item} projectId={projectId}
          owner={owner} onRemoved={removed} />)}</ul>
        : <Empty>Todavía no hay colaboraciones registradas.</Empty>}
      {(page > 1 || result.paginacion?.haySiguiente) && <div className="actions">
        {page > 1 && <button className="button secondary" onClick={() => setPage(page - 1)}>Anterior</button>}
        {result.paginacion?.haySiguiente && <button className="button secondary" onClick={() => setPage(page + 1)}>Siguiente</button>}
      </div>}
    </RequestState>
  </section>;
}
