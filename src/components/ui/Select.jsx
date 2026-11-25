import { Field } from './Field';

export function Select({ label, options, placeholder, ...props }) {
  return <Field as="select" label={label} {...props}>
    {placeholder !== undefined && <option value="">{placeholder}</option>}
    {Object.entries(options).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
  </Field>;
}
