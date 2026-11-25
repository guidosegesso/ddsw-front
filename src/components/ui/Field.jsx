import { useId, useState } from 'react';

const missingFieldMessage = 'Completá este campo.';

function validationMessage(input) {
  const { validity } = input;
  if (validity.valueMissing) return missingFieldMessage;
  if ((validity.typeMismatch || validity.patternMismatch) && input.type === 'email') return 'Ingresá un email válido, por ejemplo nombre@dominio.com.';
  if (validity.typeMismatch && input.type === 'url') return 'Ingresá un enlace completo que empiece con https:// o http://.';
  if (validity.tooShort) return 'Ingresá al menos ' + input.minLength + ' caracteres.';
  if (validity.rangeUnderflow) return 'Ingresá un valor desde ' + input.min + '.';
  if (validity.rangeOverflow) return 'Ingresá un valor hasta ' + input.max + '.';
  return validity.valid ? '' : 'Revisá el valor ingresado.';
}

export function Field({ label, hint, as: Tag = 'input', children, endAdornment, ...props }) {
  const id = useId();
  const [error, setError] = useState('');
  const describedBy = [hint && id + '-hint', error && id + '-error'].filter(Boolean).join(' ');
  const input = <Tag {...props} id={id} aria-describedby={describedBy || undefined} aria-invalid={error ? true : undefined}
      onBlur={event => { if (event.target.value) setError(validationMessage(event.target)); }}
      onInvalid={event => setError(validationMessage(event.target))}
      onChange={event => {
        if (error && event.target.validity.valid) setError('');
        props.onChange?.(event);
      }}>{children}</Tag>;
  return <div className="field">
    <label htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label>
    {endAdornment ? <div className="input-with-action">{input}{endAdornment}</div> : input}
    {hint && <small id={id + '-hint'}>{hint}</small>}
    {error && <small id={id + '-error'} className="field-error" role="alert">{error}</small>}
  </div>;
}
