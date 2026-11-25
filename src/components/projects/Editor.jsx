import api from '../../api/client';
import { idOf } from '../../api/model';
import { Feedback } from '../ui/Feedback';
import { Submit } from '../ui/Submit';
import { useAction } from '../../hooks/useAction';

export function Editor({ children, path, item, read, saved, label, disabled }) {
  const action = useAction();

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    action.run(async () => {
      const payload = read(form);
      const response = item ? await api.put(path + '/' + idOf(item), payload) : await api.post(path, payload);
      saved(response.data);
    }, 'Guardamos los cambios.');
  }

  return <form onSubmit={submit}>
    <fieldset className="form-fields" disabled={action.busy}>
      <small className="muted">* Campos obligatorios</small>
      {children}
    </fieldset>
    <Feedback action={action} />
    <Submit action={action} disabled={disabled}>{label}</Submit>
  </form>;
}
