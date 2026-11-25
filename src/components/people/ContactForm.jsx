import { useId, useRef } from 'react';
import { Mail, Send, X } from 'lucide-react';
import api from '../../api/client';
import { idOf, personName } from '../../api/model';
import { Feedback } from '../ui/Feedback';
import { Field } from '../ui/Field';
import { Submit } from '../ui/Submit';
import { useAction } from '../../hooks/useAction';

export function ContactForm({ person, projectId, profileId }) {
  const action = useAction();
  const dialog = useRef(null);
  const titleId = useId();
  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const element = event.currentTarget;
    action.run(async () => {
      await api.post('/mensajes', {
        destinatarioPersonaId: idOf(person), proyectoId: projectId, perfilId: profileId,
        asunto: form.get('asunto').trim(), contenido: form.get('contenido').trim(),
      });
      element.reset();
    }, 'Mensaje enviado.');
  }
  return <div className="actions">
    <button type="button" className="button secondary" onClick={() => dialog.current.showModal()}>
      <Mail size={17} aria-hidden="true" /> Enviar mensaje
    </button>
    <dialog ref={dialog} className="panel site-dialog contact-dialog" aria-labelledby={titleId}
      onCancel={event => { if (action.busy) event.preventDefault(); }}>
      <div className="card-top">
        <h2 id={titleId}>Mensaje para {personName(person)}</h2>
        <button type="button" className="button secondary icon-button" aria-label="Cerrar mensaje"
          disabled={action.busy} onClick={() => dialog.current.close()}>
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <form onSubmit={submit} className="subsection">
        <fieldset className="form-fields" disabled={action.busy}>
          <small className="muted">* Campos obligatorios</small>
          <Field label="Asunto" name="asunto" required />
          <Field as="textarea" label="Mensaje" name="contenido" required />
        </fieldset>
        <Feedback action={action} />
        <Submit action={action}><Send size={17} aria-hidden="true" /> Enviar mensaje</Submit>
      </form>
    </dialog>
  </div>;
}
