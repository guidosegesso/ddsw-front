import { useState } from 'react';
import { ArrowRight, CodeXml, Eye, EyeOff } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useSession } from '../auth/Session';
import { RolePicker } from '../components/account/RolePicker';
import { ProfileFields } from '../components/ProfileFields';
import { profilePayload } from '../api/profilePayload';
import { useSkills } from '../hooks/useSkills';
import { Feedback } from '../components/ui/Feedback';
import { Field } from '../components/ui/Field';
import { Notice } from '../components/ui/Notice';
import { RequestState } from '../components/ui/RequestState';
import { Submit } from '../components/ui/Submit';
import { useAction } from '../hooks/useAction';

export function AccountPage({ register = false }) {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const action = useAction();
  const [role, setRole] = useState('colaborador');
  const [missingFields, setMissingFields] = useState(false);
  const [created, setCreated] = useState(false);
  const catalog = useSkills(register && !created && role === 'colaborador');
  const [showPassword, setShowPassword] = useState(false);
  const PasswordIcon = showPassword ? EyeOff : Eye;
  const returnTo = location.state?.from || '/';

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const credentials = { email: form.get('email').trim(), password: form.get('password') };
    action.run(async () => {
      if (register && !created) {
        await api.post('/auth/registro', {
          ...credentials, rol: role, perfil: profilePayload(form, role),
        });
        setCreated(true);
      }
      await session.login(credentials);
      navigate(register ? '/perfil' : returnTo, { replace: true });
    });
  }

  if (session.account) return <Navigate to={register ? '/perfil' : returnTo} replace />;
  if (session.loading || session.error) return <RequestState request={session} />;
  return <section className="account panel">
    <div className="account-mark"><CodeXml aria-hidden="true" /></div>
    <h1>{register ? 'Creá tu cuenta' : 'Ingresá a tu cuenta'}</h1>
    <p className="muted">{register ? 'Elegí cómo querés participar en Código a Voluntad.' : 'Accedé con tu email y contraseña.'}</p>
    <form onSubmit={submit}
      onInvalid={event => { if (register && event.target.validity.valueMissing) setMissingFields(true); }}
      onChange={event => {
        if (missingFields && !Array.from(event.currentTarget.elements).some(field => field.validity?.valueMissing)) {
          setMissingFields(false);
        }
      }}>
      <fieldset disabled={action.busy} className="form-fields">
        <small className="muted">* Campos obligatorios</small>
        {register && !created && <RolePicker role={role} onChange={setRole} />}
        {register && !created && <ProfileFields key={role} role={role} catalog={catalog} minimal />}
        {created && <Notice>Tu cuenta ya está creada. Podés volver a intentar el ingreso.</Notice>}
        <Field label="Email" name="email" type="email" autoComplete="email" required maxLength={254}
          pattern={register ? String.raw`(?=[^@]{1,64}@)[^.@]+(?:\.[^.@]+)*@[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?)+` : undefined} />
        <Field label="Contraseña" name="password" type={showPassword ? 'text' : 'password'} required maxLength={128}
          minLength={register ? 12 : undefined} autoComplete={register ? 'new-password' : 'current-password'}
          hint={register && !created ? 'Usá entre 12 y 128 caracteres.' : undefined}
          endAdornment={<button type="button" className="input-action" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setShowPassword(visible => !visible)}>
            <PasswordIcon size={20} aria-hidden="true" />
          </button>} />
      </fieldset>
      <Feedback action={action} />
      {missingFields && <Notice error>Completá los campos obligatorios marcados en rojo.</Notice>}
      <Submit action={action}>{register && !created ? 'Crear cuenta' : 'Ingresar'} <ArrowRight size={17} aria-hidden="true" /></Submit>
    </form>
    <p className="account-footer">{register ? '¿Ya tenés cuenta?' : '¿Todavía no tenés cuenta?'}{' '}
      <Link state={location.state} to={register ? '/ingresar' : '/registro'}>{register ? 'Ingresá' : 'Registrate'}</Link>
    </p>
  </section>;
}
