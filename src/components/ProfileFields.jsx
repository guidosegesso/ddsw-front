import { tipos } from '../api/model';
import { Field } from './ui/Field';
import { Select } from './ui/Select';
import { LocationFields } from './LocationFields';
import { OpportunityFields } from './OpportunityFields';

export function ProfileFields({ role, profile = {}, catalog, minimal = false }) {
  if (role === 'colectivo') return <>
    <Field label="Nombre del colectivo" name="nombre" defaultValue={profile.nombre} required />
    <Select label="Tipo de colectivo" name="tipo" options={tipos} placeholder="Seleccioná un tipo" defaultValue={profile.tipo ?? ''} required />
    <Field as="textarea" label="Descripción" name="descripcion" defaultValue={profile.descripcion} required />
    <LocationFields location={profile.ubicacion} />
  </>;
  if (minimal) return <>
    <Field label="Nombre de fantasía" name="nombreFantasia" required />
    <details className="project-control">
      <summary>Habilidades y oportunidades (opcional)</summary>
      <div className="subsection"><OpportunityFields catalog={catalog} profile={profile} /></div>
    </details>
  </>;
  return <>
    <p className="muted">Indicá un nombre de fantasía, nombre y apellido, o tu usuario de GitHub o GitLab.</p>
    <div className="form-grid">
      <Field label="Nombre de fantasía" name="nombreFantasia" defaultValue={profile.nombreFantasia} />
      <Field label="Pronombres" name="pronombres" defaultValue={profile.pronombres} />
      <Field label="Nombre" name="nombre" autoComplete="given-name" defaultValue={profile.nombre} />
      <Field label="Apellido" name="apellido" autoComplete="family-name" defaultValue={profile.apellido} />
      <Field label="Usuario de GitHub" name="usuarioGithub" defaultValue={profile.usuarioGithub} />
      <Field label="Usuario de GitLab" name="usuarioGitlab" defaultValue={profile.usuarioGitlab} />
    </div>
    <Field as="textarea" label="Presentación" name="presentacion" defaultValue={profile.presentacion} />
    <OpportunityFields catalog={catalog} profile={profile} />
  </>;
}
