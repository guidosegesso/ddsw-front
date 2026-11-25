import { inboxItem } from '../../api/inbox';
import { Link } from 'react-router-dom';
import { idOf } from '../../api/model';
import { RequestState } from '../ui/RequestState';

export function InboxPreview({ account, notifications, request }) {
  const route = notifications ? '/notificaciones' : '/mensajes';
  const title = notifications ? 'Notificaciones' : 'Mensajes';
  const received = account.rol === 'colaborador';
  const items = request.data?.slice(0, 5) ?? [];

  return <>
    <h2>{title}</h2>
    <RequestState request={request}>
      {items.length ? <ul className="header-preview-list">
        {items.map(item => {
          const { title: itemTitle, date, read, category } = inboxItem(item, notifications);
          const unread = received && !read;
          return <li key={idOf(item)}>
            <strong>{itemTitle}</strong>
            {category && <span className="badge">{category}</span>}
            {unread && <span className="badge green">Nuevo</span>}
            {!notifications && item.contenido && <p>{item.contenido}</p>}
            {date && <time dateTime={date}>{new Date(date).toLocaleString('es-AR')}</time>}
          </li>;
        })}
      </ul> : <p className="muted">Todavía no tenés {title.toLowerCase()}.</p>}
    </RequestState>
    <Link to={route} className="button secondary" aria-label={'Ver más ' + title.toLowerCase()}>Ver más</Link>
  </>;
}
