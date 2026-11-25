import { EyeOff, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { collaboratorPath, idOf, personName } from '../../api/model';
import { useSession } from '../../auth/Session';
import { ConfirmRemoval } from '../ConfirmRemoval';
import { useRequest } from '../../hooks/useRequest';

export function Participant({ collaboration, projectId, owner, onRemoved }) {
  const { account } = useSession();
  const personId = collaboration.contribucionAnonima ? null : idOf(collaboration.personaColaboradoraId);
  const person = useRequest(personId ? '/colaboradoras/' + personId : null);
  const canRemove = collaboration.activa !== false && (owner || (personId && personId === account?.personaColaboradoraId));

  async function remove() {
    await api.delete('/proyectos/' + projectId + '/colaboraciones/' + idOf(collaboration));
    onRemoved();
  }

  const name = collaboration.contribucionAnonima
    ? 'Colaboración anónima' : personName(person.data ?? collaboration.personaColaboradoraId);
  const PersonIcon = collaboration.contribucionAnonima ? EyeOff : UserRound;

  return <li className="panel participant-card">
    <div className="participant-identity">
      <span className="project-icon"><PersonIcon size={18} aria-hidden="true" /></span>
      {personId
        ? <Link className="text-link" to={collaboratorPath(projectId, personId)}>{name}</Link>
        : <strong>{name}</strong>}
    </div>
    {collaboration.activa === false && <span className="badge">Baja permanente</span>}
    {canRemove && <ConfirmRemoval className="participant-remove" label="Dar de baja" title="¿Dar de baja esta colaboración?"
      description="La baja es permanente, libera el cupo y la persona no podrá volver a postularse a este perfil."
      onConfirm={remove} />}
  </li>;
}
