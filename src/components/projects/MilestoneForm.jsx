import { Field } from '../ui/Field';
import { Editor } from './Editor';

export function MilestoneForm({ path, milestone, saved }) {
  return <Editor path={path} item={milestone} saved={saved} label="Guardar avance"
    read={form => ({
      porcentajeConcrecion: Number(form.get('porcentajeConcrecion')),
      hitos: form.get('hitos').split('\n').map(line => line.trim()).filter(Boolean),
      linkCodigo: form.get('linkCodigo').trim(),
      linkSistema: form.get('linkSistema').trim() || null,
    })}>
    <Field label="Porcentaje de avance" name="porcentajeConcrecion" type="number" min="0" max="100" step="any" defaultValue={milestone?.porcentajeConcrecion} required />
    <Field label="Logros o hitos" as="textarea" name="hitos" hint="Escribí un hito por línea." defaultValue={milestone?.hitos?.join('\n')} />
    <Field label="Enlace al repositorio público" type="url" name="linkCodigo" defaultValue={milestone?.linkCodigo} required />
    <Field label="Enlace al sistema en producción (opcional)" type="url" name="linkSistema" defaultValue={milestone?.linkSistema ?? ''} />
  </Editor>;
}
