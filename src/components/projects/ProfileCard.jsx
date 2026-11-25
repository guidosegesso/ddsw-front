import { useState } from 'react';
import { ClipboardList, UserSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { compromisos, idOf, isOpen, modalidades, profileAnchor } from '../../api/model';
import { useSession } from '../../auth/Session';
import { Tags } from '../ui/Tags';
import { useRequest } from '../../hooks/useRequest';
import { ApplicationReview } from '../applications/ApplicationReview';
import { ApplicationStatus } from '../applications/ApplicationStatus';
import { ApplyForm } from '../applications/ApplyForm';
import { RoleForm } from './RoleForm';
import { ItemEditor } from './ItemEditor';

export function ProfileCard({ profile, project, owner, updated, catalog, refreshTeam, applications }) {
  const { account } = useSession();
  const [showReview, setShowReview] = useState(false);
  const path = '/proyectos/' + idOf(project) + '/perfiles';
  const applicationPath = path + '/' + idOf(profile) + '/postulaciones';
  const review = useRequest(owner ? applicationPath : null, {}, true);
  const pending = review.data?.filter(item => item.estado === 'PENDIENTE').length ?? 0;
  const open = isOpen(project, profile);
  const application = applications?.find(item => idOf(item.perfilId) === idOf(profile));
  const labels = Object.fromEntries((catalog.data ?? []).map(item => [item.codigo, item.titulo]));
  const toLabels = codes => [...new Set(codes?.map(code => labels[code] ?? code))];

  return <article className="panel stack profile-card" id={profileAnchor(idOf(profile))}>
    <div className="card-top"><h3>{profile.descripcion}</h3>
      <span className={open ? 'badge green' : 'badge'}>{open ? 'Búsqueda abierta' : 'Búsqueda cerrada'}</span>
    </div>
    <p>{profile.cantidadHoras} · {compromisos[profile.tipoCompromiso]} · {profile.modalidadColaboracion?.map(mode => modalidades[mode]).join(', ')}</p>
    <div><strong>Habilidades requeridas</strong><Tags items={toLabels(profile.habilidadesRequeridas)} /></div>
    {!!profile.habilidadesOpcionales?.length && <div><strong>Habilidades opcionales</strong><Tags items={toLabels(profile.habilidadesOpcionales)} /></div>}
    <div className="actions muted">
      {profile.limiteColaboraciones && <span>Cupo de {profile.limiteColaboraciones} {profile.limiteColaboraciones === 1 ? 'persona' : 'personas'}</span>}
      {profile.fechaCierreBusqueda && <span>Cierre {new Date(profile.fechaCierreBusqueda).toLocaleString('es-AR')}</span>}
    </div>
    {application && <ApplicationStatus state={application.estado} />}
    {open && applications && !application && <ApplyForm path={applicationPath} />}
    {open && !account && <Link className="text-link" to="/ingresar" state={{ from: '/proyectos/' + idOf(project) }}>Ingresá para postularte →</Link>}
    {owner && <div className="actions profile-actions">
      <Link className="button secondary" to={'/colaboradoras?' + new URLSearchParams({ proyecto: idOf(project), perfil: idOf(profile) })}>
        <UserSearch size={17} aria-hidden="true" /> Buscar personas compatibles
      </Link>
      <details className="project-control" onToggle={event => setShowReview(event.currentTarget.open)}>
        <summary className="button secondary">
          <ClipboardList size={17} aria-hidden="true" /> Revisar postulaciones
          {pending > 0 && <span className="badge pending">{pending} {pending === 1 ? 'pendiente' : 'pendientes'}</span>}
        </summary>
        {showReview && <ApplicationReview path={applicationPath} projectId={idOf(project)} request={review} refreshTeam={refreshTeam} />}
      </details>
      <ItemEditor item={profile} path={path} updated={updated} label="perfil">
        <RoleForm path={path} profile={profile} saved={updated} catalog={catalog} />
      </ItemEditor>
    </div>}
  </article>;
}
