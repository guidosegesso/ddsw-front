import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { estados, idOf, profilePath } from '../api/model';
import { useSession } from '../auth/Session';
import { useSkills } from '../hooks/useSkills';
import { Notice } from '../components/ui/Notice';
import { RequestState } from '../components/ui/RequestState';
import { useRequest } from '../hooks/useRequest';
import { ProjectActions } from '../components/projects/ProjectActions';
import { ProjectProfiles } from '../components/projects/ProjectProfiles';
import { ProjectTeam } from '../components/projects/ProjectTeam';
import { ProjectProgress } from '../components/projects/ProjectProgress';

export function ProjectDetailPage({ progress = false }) {
  const { id } = useParams();
  const { account } = useSession();
  const location = useLocation();
  const path = '/proyectos/' + id;
  const [feedback, setFeedback] = useState('');
  const [teamVersion, setTeamVersion] = useState(0);
  const project = useRequest(path);
  const collective = useRequest(account?.rol === 'colectivo' ? profilePath(account) : null);
  const catalog = useSkills();
  const owner = collective.data?.proyectos?.some(item => idOf(item) === id);
  const applications = useRequest(!progress && account?.rol === 'colaborador'
    && project.data?.estado !== 'ELIMINADO' && project.data?.perfiles?.length
    ? profilePath(account) + '/postulaciones' : null, {}, true);
  const projectApplications = applications.data?.filter(item => idOf(item.proyectoId) === id);

  useEffect(() => {
    if (project.data && location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [location.hash, project.data]);

  function updated() {
    setFeedback('Guardamos los cambios del proyecto.');
    project.reload();
  }

  return <div className="stack project-detail">
    <Link className="back-link" to={owner ? '/mis-proyectos' : '/'}><ArrowLeft size={17} aria-hidden="true" /> {owner ? 'Mis proyectos' : 'Explorar proyectos'}</Link>
    <Notice>{feedback || location.state?.message}</Notice>
    {collective.error && <RequestState request={collective} />}
    <RequestState request={project}>
      {project.data && <>
        <header className="detail-head panel">
          {project.data.nombreColectivo && <p className="organization">{project.data.nombreColectivo}</p>}
          <h1>{project.data.titulo}</h1>
          <p className="preserve">{project.data.descripcion}</p>
          {estados[project.data.estado] && <span className="badge">{estados[project.data.estado]}</span>}
        </header>
        {project.data.estado === 'ELIMINADO'
          ? <Notice>El colectivo eliminó este proyecto, por eso ya no se muestran sus perfiles ni su avance.</Notice>
          : <>
            <nav className="tabs" aria-label="Secciones del proyecto">
              <Link aria-current={!progress ? 'page' : undefined} to={path}>Perfiles y equipo</Link>
              <Link aria-current={progress ? 'page' : undefined} to={path + '/avance'}>Avance y logros</Link>
            </nav>
            {progress ? <ProjectProgress path={path + '/logros'} owner={owner} /> : <>
              {owner && <ProjectActions path={path} project={project.data} updated={updated} />}
              <ProjectProfiles project={project.data} owner={owner} path={path} catalog={catalog}
                updated={updated} applications={applications} projectApplications={projectApplications}
                refreshTeam={() => setTeamVersion(value => value + 1)} />
              <ProjectTeam key={id + '-' + teamVersion} projectPath={path} projectId={id} owner={owner} />
            </>}
          </>}
      </>}
    </RequestState>
  </div>;
}
