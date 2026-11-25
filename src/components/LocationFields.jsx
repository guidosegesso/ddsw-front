import { useState } from 'react';
import { useRequest } from '../hooks/useRequest';
import { RequestState } from './ui/RequestState';
import { Select } from './ui/Select';
import { locationScope } from '../api/location';

function options(items, selected) {
  const entries = (items ?? []).map(({ id, nombre, departamento }) =>
    [id, departamento ? nombre + ' (' + departamento + ')' : nombre]);
  if (selected && !entries.some(([id]) => id === selected.id)) entries.unshift([selected.id, selected.nombre]);
  return Object.fromEntries(entries);
}

export function LocationFields({ location }) {
  const [scope, setScope] = useState(locationScope(location));
  const [province, setProvince] = useState(location?.provincia?.id ?? '');
  const [city, setCity] = useState(location?.localidad?.id ?? '');
  const provinces = useRequest(scope === 'provincia' ? '/provincias' : null);
  const cities = useRequest(scope === 'provincia' && province ? '/provincias/' + encodeURIComponent(province) + '/localidades' : null);

  return <>
    <Select name="alcanceUbicacion" label="Ubicación (opcional)" value={scope}
      options={{ ninguna: 'Sin ubicación', nacional: 'Argentina (alcance nacional)', provincia: 'Provincia o CABA',
        ...(locationScope(location) === 'conservar' && { conservar: 'Conservar ubicación actual: ' + location }) }}
      onChange={event => setScope(event.target.value)} />
    {scope === 'provincia' && <>
      {(provinces.loading || provinces.error) && <RequestState request={provinces} />}
      <Select name="provinciaId" label="Provincia o CABA" required value={province} placeholder="Seleccioná una provincia"
        options={options(provinces.data, location?.provincia)}
        onChange={event => { setProvince(event.target.value); setCity(''); }} />
      {province && <>
        {(cities.loading || cities.error) && <RequestState request={cities} />}
        <Select name="localidadId" label="Localidad o barrio (opcional)" value={city} placeholder="Sin localidad"
          options={options(cities.data, location?.provincia?.id === province ? location.localidad : null)}
          onChange={event => setCity(event.target.value)} />
      </>}
    </>}
  </>;
}
