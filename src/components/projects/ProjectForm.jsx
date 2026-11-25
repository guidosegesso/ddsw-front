import { useState } from 'react';
import { Check } from '../ui/Check';
import { Field } from '../ui/Field';
import { Editor } from './Editor';
import { RoleFields, readProfile } from './RoleFields';

export function ProjectForm({ project, saved, catalog }) {
  const [includeProfile, setIncludeProfile] = useState(false);

  function read(form) {
    const payload = { titulo: form.get('titulo').trim(), descripcion: form.get('descripcion').trim() };
    if (includeProfile) payload.perfiles = [readProfile(form)];
    return payload;
  }

  return <Editor path="/proyectos" item={project} saved={saved} read={read}
    disabled={includeProfile && (catalog.loading || !!catalog.error)}
    label={project ? 'Guardar proyecto' : 'Crear proyecto'}>
    <Field label="Título" name="titulo" defaultValue={project?.titulo} required />
    <Field as="textarea" label="Descripción del proyecto" name="descripcion" defaultValue={project?.descripcion} required />
    {!project && <Check checked={includeProfile} onChange={event => setIncludeProfile(event.target.checked)}>Agregar un perfil inicial</Check>}
    {includeProfile && <RoleFields catalog={catalog} />}
  </Editor>;
}
