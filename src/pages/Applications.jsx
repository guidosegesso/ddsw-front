import { useState } from 'react';
import { Link } from 'react-router-dom';
import { estados, idOf, profilePath } from '../api/model';
import { useSession } from '../auth/Session';
import { Empty } from '../components/ui/Empty';
import { Pager } from '../components/ui/Pager';
import { RequestState } from '../components/ui/RequestState';
import { useRequest } from '../hooks/useRequest';

export function ApplicationsPage() {
  const { account } = useSession();
  const [page, setPage] = useState(1);
  const request = useRequest(profilePath(account) + '/postulaciones', { page });
  return <section>
    <h1>Mis postulaciones</h1>
    <RequestState request={request}>
      {!request.data?.length && <Empty>Todavía no te postulaste a ningún perfil.</Empty>}
      <div className="stack">
        {request.data?.map(item => <article className="panel" key={idOf(item)}>
          <span className="badge">{estados[item.estado]}</span>
          <h2>{item.proyectoId?.titulo ?? 'Proyecto'}</h2>
          {idOf(item.proyectoId) && <Link className="text-link" to={'/proyectos/' + idOf(item.proyectoId)}>Ver proyecto →</Link>}
          {item.contribucionAnonima && <p className="muted">Contribución anónima</p>}
          {item.estado === 'ACEPTADA' && idOf(item.proyectoId) &&
            <p><Link className="text-link" to={'/proyectos/' + idOf(item.proyectoId) + '#equipo'}>Ver equipo del proyecto</Link></p>}
        </article>)}
      </div>
      <Pager page={page} next={request.paginacion?.haySiguiente} onChange={setPage} />
    </RequestState>
  </section>;
}
