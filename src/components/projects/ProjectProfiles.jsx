import { Plus } from 'lucide-react';
import { idOf } from '../../api/model';
import { Empty } from '../ui/Empty';
import { RequestState } from '../ui/RequestState';
import { ProfileCard } from './ProfileCard';
import { RoleForm } from './RoleForm';

export function ProjectProfiles({ project, owner, path, catalog, updated, applications, projectApplications, refreshTeam }) {
  return <section className="stack">
    <div className="actions profile-actions">
      <h2>Perfiles del proyecto</h2>
      {owner && <details className="project-control">
        <summary className="button secondary"><Plus size={17} aria-hidden="true" /> Agregar perfil</summary>
        <div className="subsection panel"><RoleForm path={path + '/perfiles'} saved={updated} catalog={catalog} /></div>
      </details>}
    </div>
    {!project.perfiles?.length && <Empty>Este proyecto todavía no tiene perfiles.</Empty>}
    <RequestState request={applications} />
    {project.perfiles?.map(profile => <ProfileCard applications={projectApplications} key={idOf(profile)} project={project} profile={profile} owner={owner} updated={updated} catalog={catalog} refreshTeam={refreshTeam} />)}
  </section>;
}
