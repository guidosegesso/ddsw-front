import { useState } from 'react';
import { InboxItem } from '../components/inbox/InboxItem';
import api from '../api/client';
import { idOf, profilePath } from '../api/model';
import { useSession } from '../auth/Session';
import { Empty } from '../components/ui/Empty';
import { Feedback } from '../components/ui/Feedback';
import { Pager } from '../components/ui/Pager';
import { RequestState } from '../components/ui/RequestState';
import { useAction } from '../hooks/useAction';
import { useRequest } from '../hooks/useRequest';

export function InboxPage({ notifications = false }) {
  const { account } = useSession();
  const [page, setPage] = useState(1);
  const resource = profilePath(account) + (notifications ? '/notificaciones' : '/mensajes');
  const request = useRequest(resource, { page });
  const action = useAction();
  const received = account.rol === 'colaborador';
  const title = notifications ? 'Notificaciones' : received ? 'Mensajes recibidos' : 'Mensajes enviados';

  function mark(item) {
    const path = notifications ? resource + '/' + idOf(item) + '/leida'
      : '/mensajes/' + idOf(item) + profilePath(account) + '/leido';
    action.run(async () => {
      await api.patch(path);
      request.reload();
      window.dispatchEvent(new Event('inbox-read'));
    }, 'Marcado como leído.');
  }

  return <section className="stack">
    <h1>{title}</h1>
    <Feedback action={action} />
    <RequestState request={request}>
      {!request.data?.length && <Empty>{notifications ? 'Todavía no tenés notificaciones. Acá vas a ver avisos sobre proyectos compatibles, postulaciones y mensajes nuevos.' : 'Todavía no hay ' + title.toLowerCase() + '.'}</Empty>}
      {request.data?.map(item => <InboxItem key={idOf(item)} item={item} notifications={notifications}
        received={received} busy={action.busy} onMark={mark} />)}
      <Pager page={page} next={request.paginacion?.haySiguiente} onChange={setPage} />
    </RequestState>
  </section>;
}
