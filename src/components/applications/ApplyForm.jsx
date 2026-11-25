import { Send } from 'lucide-react';
import api from '../../api/client';
import { Check } from '../ui/Check';
import { Feedback } from '../ui/Feedback';
import { Submit } from '../ui/Submit';
import { useAction } from '../../hooks/useAction';
import { ApplicationStatus } from './ApplicationStatus';

export function ApplyForm({ path }) {
  const action = useAction();
  function submit(event) {
    event.preventDefault();
    const anonymous = new FormData(event.currentTarget).has('anonima');
    action.run(async () => {
      await api.post(path, { contribucionAnonima: anonymous });
    }, 'Enviamos tu postulación. El colectivo la va a revisar.');
  }
  if (action.success) return <ApplicationStatus confirmation={action.success} />;

  return <form onSubmit={submit}>
    <Check name="anonima" disabled={action.busy}>Si me aceptan, mostrar mi contribución como anónima.</Check>
    <Feedback action={action} />
    <Submit action={action}><Send size={17} aria-hidden="true" /> Enviar postulación</Submit>
  </form>;
}
