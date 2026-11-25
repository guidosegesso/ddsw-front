import { personName } from '../../api/model';
import { Tags } from '../ui/Tags';
import { ContactForm } from './ContactForm';

export function PersonCard({ person, labels, projectId, profileId, canContact }) {
  return <article className="panel stack person-card">
    <h2>{personName(person)}</h2>
    {person.pronombres && <p className="muted">{person.pronombres}</p>}
    {person.presentacion && <p className="preserve">{person.presentacion}</p>}
    <Tags items={[...new Set(person.habilidades?.map(code => labels[code] ?? code))]} />
    {person.aceptaContacto && canContact && <ContactForm person={person} projectId={projectId} profileId={profileId} />}
    {person.aceptaContacto && !canContact && <p className="muted">Para escribirle, buscá candidaturas desde un perfil de tu proyecto.</p>}
    {!person.aceptaContacto && <p className="muted">No recibe mensajes de colectivos.</p>}
  </article>;
}
