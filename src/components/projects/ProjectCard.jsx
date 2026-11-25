import { ArrowRight, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { estados, idOf, isOpen } from '../../api/model';
import { PendingApplications } from '../PendingApplications';
import { Tags } from '../ui/Tags';

export function ProjectCard({ project, labels, mine }) {
  const profiles = project.perfiles ?? [];
  const openings = profiles.filter(profile => isOpen(project, profile)).length;
  const skills = [...new Set(profiles.flatMap(profile => profile.habilidadesRequeridas ?? []))];
  return <article className="project-card panel">
    <div className="card-top"><span className="project-icon"><FolderOpen size={21} aria-hidden="true" /></span>
      <span className={openings ? 'badge green' : 'badge'}>{openings ? 'Búsqueda abierta' : project.estado === 'FINALIZADO' ? estados.FINALIZADO : 'Sin búsquedas abiertas'}</span></div>
    <h3><Link to={'/proyectos/' + idOf(project)}>{project.titulo}</Link></h3>
    {project.nombreColectivo && <div className="organization">{project.nombreColectivo}</div>}
    {mine && profiles.length > 0 && <PendingApplications projectId={idOf(project)} />}
    <p className="card-description">{project.descripcion}</p>
    <Tags items={[...new Set(skills.slice(0, 4).map(code => labels[code] ?? code))]} />
    <div className="card-footer"><span>{openings} {openings === 1 ? 'perfil abierto' : 'perfiles abiertos'}</span>
      <Link to={'/proyectos/' + idOf(project)} aria-label={'Ver proyecto: ' + project.titulo}>Ver proyecto <ArrowRight size={16} aria-hidden="true" /></Link>
    </div>
  </article>;
}
