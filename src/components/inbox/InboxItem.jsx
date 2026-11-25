import { Link } from 'react-router-dom';
import { inboxItem } from '../../api/inbox';
import { idOf, profileAnchor } from '../../api/model';

export function InboxItem({ item, notifications, received, busy, onMark }) {
  const { title: itemTitle, date, read, category } = inboxItem(item, notifications);
  const projectId = idOf(item.proyectoId);
  const profileId = idOf(item.perfilId);
  const projectUrl = projectId && '/proyectos/' + projectId
    + (notifications && item.tipo === 'OPORTUNIDAD' && profileId ? '#' + profileAnchor(profileId) : '');
  return <article className={received && !read ? 'panel stack unread' : 'panel stack'}>
    {category && <span className="badge">{category}</span>}
    <div className="card-top"><h2>{itemTitle}</h2>
      {received && <span className={read ? 'badge' : 'badge green'}>{read ? 'Leído' : 'Nuevo'}</span>}
    </div>
    <time className="muted" dateTime={date}>
      {new Date(date).toLocaleString('es-AR')}
    </time>
    {item.contenido && <p className="preserve">{item.contenido}</p>}
    <div className="actions">
      {notifications && item.tipo === 'POSTULACION' && <Link className="text-link" to="/postulaciones">Ver mis postulaciones →</Link>}
      {notifications && item.tipo === 'MENSAJE' && <Link className="text-link" to="/mensajes">Ver mensajes →</Link>}
      {projectUrl && <Link className="text-link" to={projectUrl}>
        {notifications && item.tipo === 'OPORTUNIDAD' && profileId ? 'Ver perfil del proyecto' : 'Ver proyecto'} →
      </Link>}
      {received && !read && <button className="button secondary" onClick={() => onMark(item)} disabled={busy}>Marcar como leído</button>}
    </div>
  </article>;
}
