import { useId, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { Feedback } from './ui/Feedback';
import { useAction } from '../hooks/useAction';

export function ConfirmRemoval({ label, title, description, onConfirm, className = '' }) {
  const dialog = useRef(null);
  const id = useId();
  const action = useAction();

  function open() {
    action.reset();
    dialog.current.showModal();
  }

  function confirm() {
    action.run(async () => {
      await onConfirm();
      dialog.current?.close();
    });
  }

  return <>
    <button type="button" className={'button danger ' + className} onClick={open}>
      <Trash2 size={16} aria-hidden="true" /> {label}
    </button>
    <dialog ref={dialog} className="panel site-dialog confirm-dialog" aria-labelledby={id + '-title'}
      aria-describedby={id + '-description'} onCancel={event => { if (action.busy) event.preventDefault(); }}>
      <div className="stack">
        <h2 id={id + '-title'}>{title}</h2>
        <p id={id + '-description'}>{description}</p>
        <Feedback action={action} />
        <div className="actions confirm-actions">
          <button type="button" className="button secondary" disabled={action.busy}
            onClick={() => dialog.current.close()}>Cancelar</button>
          <button type="button" className="button danger" disabled={action.busy} onClick={confirm}>
            {action.busy ? 'Procesando…' : label}
          </button>
        </div>
      </div>
    </dialog>
  </>;
}
