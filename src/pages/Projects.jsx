import { useState } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { compromisos, idOf, modalidades, profilePath } from '../api/model';
import { useSession } from '../auth/Session';
import { useSkills } from '../hooks/useSkills';
import { Empty } from '../components/ui/Empty';
import { Notice } from '../components/ui/Notice';
import { Pager } from '../components/ui/Pager';
import { RequestState } from '../components/ui/RequestState';
import { Select } from '../components/ui/Select';
import { useRequest } from '../hooks/useRequest';
import { ProjectHero } from '../components/projects/ProjectHero';
import { ProjectCard } from '../components/projects/ProjectCard';

export function ProjectsPage({ mine = false }) {
  const { account } = useSession();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [skill, setSkill] = useState('');
  const [mode, setMode] = useState('');
  const [commitment, setCommitment] = useState('');
  const skills = useSkills();
  const profile = useRequest(!mine && account?.rol === 'colaborador' ? profilePath(account) : null);
  const personalSkills = profile.data?.habilidades ?? [];
  const codes = skill === 'mis-habilidades' ? personalSkills.join(',') : skill;
  const request = useRequest('/proyectos', {
    page, colectivoId: mine ? account.colectivoId : undefined,
    habilidades: codes || undefined, modalidad: mode || undefined, tipoCompromiso: commitment || undefined,
  });
  const labels = Object.fromEntries((skills.data ?? []).map(item => [item.codigo, item.titulo]));

  function filter(set) {
    return event => { set(event.target.value); setPage(1); };
  }

  return <>
    {!mine && <ProjectHero />}
    <section id="proyectos" aria-labelledby="projects-title">
      {mine && <Notice>{location.state?.message}</Notice>}
      <div className="section-heading">
        {mine ? <h1 id="projects-title">Mis proyectos</h1> : <div><h2 id="projects-title">Explorá proyectos</h2>
          <p className="muted">Filtrá oportunidades por habilidad, modalidad o dedicación.</p></div>}
        {mine && <Link className="button primary" to="/proyectos/nuevo"><Plus size={18} aria-hidden="true" /> Nuevo proyecto</Link>}
      </div>
      {!mine && <div className="filters panel">
        <span className="filter-icon"><SlidersHorizontal aria-hidden="true" /></span>
        <Select label="Habilidad" value={skill} onChange={filter(setSkill)} placeholder="Todas las habilidades"
          options={{ ...(personalSkills.length ? { 'mis-habilidades': 'Mis habilidades' } : {}), ...labels }} />
        <Select label="Modalidad" value={mode} onChange={filter(setMode)} placeholder="Todas las modalidades" options={modalidades} />
        <Select label="Dedicación" value={commitment} onChange={filter(setCommitment)} placeholder="Cualquier dedicación" options={compromisos} />
      </div>}
      {!mine && skills.error && <RequestState request={skills} />}
      {!mine && profile.error && <RequestState request={profile} />}
      <RequestState request={request}>
        {request.data?.length ? <div className="project-grid">
          {request.data.map(project => <ProjectCard key={idOf(project)} project={project} labels={labels} mine={mine} />)}
        </div> : <Empty>{mine ? 'Todavía no cargaste proyectos.' : 'No encontramos proyectos para estos filtros.'}</Empty>}
        <Pager page={page} next={request.paginacion?.haySiguiente} onChange={setPage} />
      </RequestState>
    </section>
  </>;
}
