import { Check } from './ui/Check';
import { RequestState } from './ui/RequestState';

export function SkillPicker({ name, label, catalog, selected = [], excluded = [] }) {
  const options = new Map((catalog.data ?? []).map(item => [item.codigo, item.titulo]));
  for (const code of selected) if (!options.has(code)) options.set(code, code);
  return <fieldset className="skill-picker">
    <legend>{label}</legend>
    <RequestState request={catalog}>
      <div className="skill-options">
        {[...options].filter(([code]) => !excluded.includes(code)).map(([code, title]) =>
          <Check key={code} name={name} value={code} defaultChecked={selected.includes(code)}>{title}</Check>)}
        {!options.size && <small>El catálogo todavía no tiene habilidades.</small>}
      </div>
    </RequestState>
  </fieldset>;
}
