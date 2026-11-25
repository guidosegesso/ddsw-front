import api from '../api/client';
import { profilePath } from '../api/model';
import { useSession } from '../auth/Session';
import { ProfileFields } from '../components/ProfileFields';
import { profilePayload } from '../api/profilePayload';
import { useSkills } from '../hooks/useSkills';
import { Feedback } from '../components/ui/Feedback';
import { Field } from '../components/ui/Field';
import { RequestState } from '../components/ui/RequestState';
import { Submit } from '../components/ui/Submit';
import { useAction } from '../hooks/useAction';
import { useRequest } from '../hooks/useRequest';

export function ProfilePage() {
  const { account } = useSession();
  const path = profilePath(account);
  const request = useRequest(path);
  const isCollaborator = account.rol === 'colaborador';
  const contact = useRequest(isCollaborator ? path + '/contacto' : null);
  const catalog = useSkills(isCollaborator);
  const action = useAction();

  function submit(event) {
    event.preventDefault();
    const payload = profilePayload(new FormData(event.currentTarget), account.rol, request.data?.ubicacion);
    action.run(async () => {
      await api.put(path, payload);
      request.reload();
      if (isCollaborator) contact.reload();
    }, 'Guardamos los cambios de tu perfil.');
  }

  return <section className="narrow">
    <h1>Mi perfil</h1>
    <p className="muted">Completá tus datos y mantenelos actualizados.</p>
    <div className="panel">
      <RequestState request={request.loading || request.error ? request : contact}>
        {request.data && <form onSubmit={submit}>
          <fieldset disabled={action.busy} className="form-fields">
            {account.rol === 'colectivo' && <small className="muted">* Campos obligatorios</small>}
            <Field label="Email de la cuenta" type="email" value={account.email} readOnly />
            <ProfileFields role={account.rol} profile={{ ...request.data, ...contact.data }} catalog={catalog} />
          </fieldset>
          <Submit action={action} disabled={account.rol === 'colaborador' && (catalog.loading || !!catalog.error)}>Guardar cambios</Submit>
        </form>}
      </RequestState>
      <Feedback action={action} />
    </div>
  </section>;
}
