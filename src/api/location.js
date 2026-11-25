export function locationScope(location) {
  if (location?.provincia?.id) return 'provincia';
  if (location === 'Argentina' || location?.pais === 'Argentina') return 'nacional';
  return typeof location === 'string' && location ? 'conservar' : 'ninguna';
}

export function readLocation(form, previousLocation) {
  const scope = form.get('alcanceUbicacion');
  const provinciaId = form.get('provinciaId') || '';
  const localidadId = form.get('localidadId') || '';

  if (scope === 'conservar' || (previousLocation !== undefined && scope === locationScope(previousLocation)
      && provinciaId === (previousLocation?.provincia?.id ?? '') && localidadId === (previousLocation?.localidad?.id ?? ''))) {
    return undefined;
  }
  if (scope === 'nacional') return { pais: 'Argentina' };
  if (scope === 'provincia') return { provinciaId, ...(localidadId && { localidadId }) };
  return null;
}
