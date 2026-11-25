import { CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { collaboratorPath, estados, idOf, personName } from '../../api/model';
import { Empty } from '../ui/Empty';
import { Feedback } from '../ui/Feedback';
import { RequestState } from '../ui/RequestState';
import { useAction } from '../../hooks/useAction';

export function ApplicationReview({ path, projectId, request, refreshTeam }) {
  const action = useAction();

  function resolve(item, estado) {
    action.run(async () => {
      await api.patch(path + '/' + idOf(item), { estado });
      request.reload();
      if (estado === 'ACEPTADA') refreshTeam();
    }, estado === 'ACEPTADA' ? 'Postulación aceptada.' : 'Postulación rechazada.');
  }

  return <section className="subsection">
    <Feedback action={action} />
    <RequestState request={request}>
      {!request.data?.length && <Empty>Todavía no hay postulaciones para este perfil.</Empty>}
      <ul className="item-list">
        {request.data?.map(item => {
          const person = item.personaColaboradoraId;
          const personId = idOf(person);
          return <li key={idOf(item)}>
            <div>{personId
              ? <Link className="text-link" to={collaboratorPath(projectId, personId)}>{personName(person)}</Link>
              : <strong>{personName(person)}</strong>}{' '}
              <span className="badge">{estados[item.estado]}</span>
              {item.contribucionAnonima && <p className="muted">Colaboración pública anónima</p>}
              {item.estado === 'ACEPTADA' && <Link className="text-link" to={'/proyectos/' + projectId + '#equipo'}>Ver equipo del proyecto</Link>}
            </div>
            {item.estado === 'PENDIENTE' && <div className="actions">
              <button className="button secondary" disabled={action.busy} onClick={() => resolve(item, 'ACEPTADA')}><CheckCircle2 size={17} aria-hidden="true" /> Aceptar</button>
              <button className="button secondary" disabled={action.busy} onClick={() => resolve(item, 'RECHAZADA')}><XCircle size={17} aria-hidden="true" /> Rechazar</button>
            </div>}
          </li>;
        })}
      </ul>
    </RequestState>
  </section>;
}
