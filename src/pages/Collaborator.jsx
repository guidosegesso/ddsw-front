import { ArrowLeft, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { personName } from '../api/model';
import { useSession } from '../auth/Session';
import { PrivateContact } from '../components/PrivateContact';
import { useSkills } from '../hooks/useSkills';
import { RequestState } from '../components/ui/RequestState';
import { Tags } from '../components/ui/Tags';
import { useRequest } from '../hooks/useRequest';

export function CollaboratorPage() {
  const { projectId, personId } = useParams();
  const { account } = useSession();
  const canRequestContact = account?.rol === 'colectivo' || account?.rol === 'admin'
    || account?.personaColaboradoraId === personId;
  const request = useRequest('/colaboradoras/' + personId);
  const catalog = useSkills();
  const person = request.data;
  const labels = new Map(catalog.data?.map(skill => [skill.codigo, skill.titulo]));

  return <section className="narrow stack">
    <Link className="back-link" to={'/proyectos/' + projectId}>
      <ArrowLeft size={17} aria-hidden="true" /> Volver al proyecto
    </Link>
    <RequestState request={request}>
      {person && <article className="panel stack">
        <header className="person-heading">
          <span className="project-icon"><UserRound size={22} aria-hidden="true" /></span>
          <div>
            <h1>{personName(person)}</h1>
            {person.pronombres && <p className="muted">{person.pronombres}</p>}
          </div>
        </header>
        {person.presentacion && <section>
          <h2>Presentación</h2>
          <p className="preserve">{person.presentacion}</p>
        </section>}
        <section>
          <h2>Habilidades</h2>
          {person.habilidades?.length
            ? <Tags items={[...new Set(person.habilidades.map(code => labels.get(code) ?? code))]} />
            : <p className="muted">Todavía no indicó habilidades.</p>}
        </section>
        {canRequestContact && <PrivateContact key={account.id + ':' + personId} personId={personId} />}
      </article>}
    </RequestState>
  </section>;
}
