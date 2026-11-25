import { compromisos, modalidades } from '../../api/model';
import { SkillPicker } from '../SkillPicker';
import { Check } from '../ui/Check';
import { Field } from '../ui/Field';
import { Select } from '../ui/Select';

function localDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function RoleFields({ profile, catalog }) {
  return <>
    <Field label="Descripción del perfil" name="descripcion" defaultValue={profile?.descripcion} required />
    <SkillPicker name="habilidadesRequeridas" label="Habilidades requeridas" catalog={catalog} selected={profile?.habilidadesRequeridas} />
    <SkillPicker name="habilidadesOpcionales" label="Habilidades opcionales" catalog={catalog} selected={profile?.habilidadesOpcionales} />
    <div className="form-grid">
      <Select label="Tipo de compromiso" options={compromisos} name="tipoCompromiso" defaultValue={profile?.tipoCompromiso} />
      <Field label="Cantidad de horas" type="number" min="0.01" step="any" name="cantidadHoras" defaultValue={profile?.cantidadHoras} required />
      <Field label="Límite de colaboraciones (opcional)" name="limiteColaboraciones" type="number" min="1" step="1" defaultValue={profile?.limiteColaboraciones ?? ''} />
      <Field label="Cierre de búsqueda (opcional)" name="fechaCierreBusqueda" type="datetime-local" defaultValue={localDateTime(profile?.fechaCierreBusqueda)} />
    </div>
    <fieldset className="skill-picker">
      <legend>Modalidades de colaboración</legend>
      {Object.entries(modalidades).map(([value, text]) =>
        <Check key={value} name="modalidad" value={value} defaultChecked={profile?.modalidadColaboracion?.includes(value)}>{text}</Check>)}
    </fieldset>
    <Check name="busquedaAbierta" defaultChecked={profile?.busquedaAbierta ?? true}>Habilitar postulaciones</Check>
  </>;
}

export function readProfile(form) {
  const required = form.getAll('habilidadesRequeridas');
  const optional = form.getAll('habilidadesOpcionales');
  const modes = form.getAll('modalidad');
  if (!required.length) throw new Error('Elegí al menos una habilidad requerida.');
  if (optional.some(code => required.includes(code))) throw new Error('Elegí habilidades diferentes para los dos grupos.');
  if (!modes.length) throw new Error('Elegí al menos una modalidad de colaboración.');
  const deadline = form.get('fechaCierreBusqueda');
  return {
    descripcion: form.get('descripcion').trim(),
    habilidadesRequeridas: required, habilidadesOpcionales: optional,
    modalidadColaboracion: modes, tipoCompromiso: form.get('tipoCompromiso'),
    cantidadHoras: Number(form.get('cantidadHoras')),
    busquedaAbierta: form.has('busquedaAbierta'),
    limiteColaboraciones: Number(form.get('limiteColaboraciones')) || null,
    fechaCierreBusqueda: deadline ? new Date(deadline).toISOString() : null,
  };
}
