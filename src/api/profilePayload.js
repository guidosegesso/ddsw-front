import { readLocation } from './location';

export function profilePayload(form, role, previousLocation) {
  const fields = role === 'colectivo' ? ['nombre', 'descripcion', 'tipo']
    : ['nombreFantasia', 'nombre', 'apellido', 'usuarioGithub', 'usuarioGitlab', 'pronombres', 'presentacion'];
  const payload = Object.fromEntries(fields.filter(name => form.has(name)).map(name => [name, form.get(name).trim() || null]));
  if (role === 'colectivo') {
    const location = readLocation(form, previousLocation);
    if (location !== undefined) payload.ubicacion = location;
  } else {
    payload.habilidades = form.getAll('habilidades');
    payload.aceptaContacto = form.has('aceptaContacto');
  }
  return payload;
}
