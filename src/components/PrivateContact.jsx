import { useState } from 'react';
import { ContactRound } from 'lucide-react';
import { useRequest } from '../hooks/useRequest';
import { RequestState } from './ui/RequestState';
import { SafeLink } from './ui/SafeLink';

export function PrivateContact({ personId }) {
  const [open, setOpen] = useState(false);
  const request = useRequest(open ? '/colaboradoras/' + personId + '/contacto' : null);
  const contact = request.data;
  const fullName = [contact?.nombre, contact?.apellido].filter(Boolean).join(' ');

  return <details className="project-control" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary className="button secondary"><ContactRound size={17} aria-hidden="true" /> Consultar datos de contacto</summary>
    {open && <div className="subsection">
      <RequestState request={request}>
        {contact && <>
          {fullName && <p><strong>Nombre:</strong> {fullName}</p>}
          <p><strong>Email:</strong> {contact.email}</p>
          <div className="actions">
            {contact.usuarioGithub && <SafeLink href={'https://github.com/' + encodeURIComponent(contact.usuarioGithub)}>
              GitHub · {contact.usuarioGithub}
            </SafeLink>}
            {contact.usuarioGitlab && <SafeLink href={'https://gitlab.com/' + encodeURIComponent(contact.usuarioGitlab)}>
              GitLab · {contact.usuarioGitlab}
            </SafeLink>}
          </div>
        </>}
      </RequestState>
    </div>}
  </details>;
}
