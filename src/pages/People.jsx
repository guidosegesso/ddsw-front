import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { idOf, profilePath } from '../api/model';
import { useSession } from '../auth/Session';
import { useSkills } from '../hooks/useSkills';
import { Check } from '../components/ui/Check';
import { Empty } from '../components/ui/Empty';
import { Pager } from '../components/ui/Pager';
import { RequestState } from '../components/ui/RequestState';
import { Select } from '../components/ui/Select';
import { useRequest } from '../hooks/useRequest';
import { PersonCard } from '../components/people/PersonCard';

export function PeoplePage() {
  const [params] = useSearchParams();
  const { account } = useSession();
  const [page, setPage] = useState(1);
  const [skill, setSkill] = useState('');
  const [contact, setContact] = useState(false);
  const projectId = params.get('proyecto');
  const profileId = params.get('perfil');
  const owner = useRequest(projectId ? profilePath(account) : null);
  const ownsProject = owner.data?.proyectos?.some(project => idOf(project) === projectId);
  const profile = useRequest(ownsProject && profileId ? '/proyectos/' + projectId + '/perfiles/' + profileId : null);
  const catalog = useSkills();
  const labels = Object.fromEntries((catalog.data ?? []).map(item => [item.codigo, item.titulo]));
  const results = useRequest(projectId && !profile.data ? null : '/colaboradoras', {
    page, perfilId: profile.data ? profileId : undefined,
    habilidades: skill || undefined, aceptaContacto: contact ? 'true' : undefined,
  });

  return <section className="stack">
    {projectId && <Link className="back-link" to={'/proyectos/' + projectId}>← Volver al proyecto</Link>}
    <h1>Buscar colaboradoras</h1>
    <RequestState request={owner}>
      {projectId && owner.data && !ownsProject ? <Empty>El proyecto no pertenece a tu colectivo.</Empty> :
        <RequestState request={profile}>
          {profile.data && <p>Personas compatibles con <strong>{profile.data.descripcion}</strong></p>}
          <div className="filters panel people-filters">
            <Select label="Habilidad" options={labels} placeholder="Todas las habilidades" value={skill}
              onChange={event => { setSkill(event.target.value); setPage(1); }} />
            <Check checked={contact} onChange={event => { setContact(event.target.checked); setPage(1); }}>
              Solo personas que aceptan mensajes
            </Check>
          </div>
          {catalog.error && <RequestState request={catalog} />}
          <RequestState request={results}>
            {!results.data?.length && <Empty>No encontramos personas para estos filtros.</Empty>}
            <div className="project-grid people-grid">
              {results.data?.map(person => <PersonCard key={idOf(person)} person={person} labels={labels}
                projectId={projectId} profileId={profileId} canContact={!!profile.data} />)}
            </div>
            <Pager page={page} next={results.paginacion?.haySiguiente} onChange={setPage} />
          </RequestState>
        </RequestState>}
    </RequestState>
  </section>;
}
