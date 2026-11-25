import { CodeXml, Users } from 'lucide-react';

const choices = [
  { value: 'colaborador', label: 'Colaborador', hint: 'Quiero aportar mis habilidades', Icon: CodeXml },
  { value: 'colectivo', label: 'Colectivo', hint: 'Necesito ayuda con un proyecto', Icon: Users },
];

export function RolePicker({ role, onChange }) {
  return <fieldset className="role-picker">
    <legend>Tipo de cuenta <span aria-hidden="true">*</span></legend>
    <div>{choices.map(({ value, label, hint, Icon }) => <label className="role-option" key={value}>
      <input type="radio" name="rol" value={value} checked={role === value} required
        onChange={() => onChange(value)} />
      <Icon size={20} aria-hidden="true" /><span><strong>{label}</strong><small>{hint}</small></span>
    </label>)}</div>
  </fieldset>;
}
