import { useEffect, useId, useRef, useState } from 'react';
import { Bell, LogOut, Mail, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { inboxItem } from '../api/inbox';
import { profilePath } from '../api/model';
import { useRequest } from '../hooks/useRequest';
import { InboxPreview } from './inbox/InboxPreview';

export function HeaderActions({ account, logout }) {
  const [selection, setSelection] = useState(null);
  const { key: locationKey } = useLocation();
  const active = selection?.locationKey === locationKey ? selection.name : null;
  const root = useRef(null);
  const id = useId();
  const buttons = [
    ...(account.rol === 'colaborador' ? [{ key: 'notifications', label: 'Notificaciones', Icon: Bell }] : []),
    ...(account.rol !== 'admin' ? [{ key: 'messages', label: 'Mensajes', Icon: Mail }] : []),
    { key: 'profile', label: 'Cuenta', Icon: UserRound },
  ];

  const received = account.rol === 'colaborador';
  const path = account.rol === 'admin' ? null : profilePath(account);
  const notifications = useRequest(received ? path + '/notificaciones' : null, {}, true);
  const messages = useRequest(path ? path + '/mensajes' : null, {}, received);
  const { reload: reloadNotifications } = notifications;
  const { reload: reloadMessages } = messages;
  const unread = {
    notifications: notifications.data?.filter(item => !inboxItem(item, true).read).length ?? 0,
    messages: received ? messages.data?.filter(item => !inboxItem(item, false).read).length ?? 0 : 0,
  };

  useEffect(() => {
    function refresh() {
      reloadNotifications();
      reloadMessages();
    }
    window.addEventListener('focus', refresh);
    window.addEventListener('inbox-read', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('inbox-read', refresh);
    };
  }, [reloadNotifications, reloadMessages]);

  useEffect(() => {
    if (!active) return;
    function closeOutside(event) {
      if (!root.current?.contains(event.target)) setSelection(null);
    }
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('focusin', closeOutside);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('focusin', closeOutside);
    };
  }, [active]);

  function closeOnEscape(event) {
    if (event.key !== 'Escape' || !active) return;
    event.preventDefault();
    root.current.querySelector('[aria-expanded="true"]')?.focus();
    setSelection(null);
  }

  return <div className="header-actions" ref={root} onKeyDown={closeOnEscape}>
    {buttons.map(({ key, label, Icon }) => <div className="header-action" key={key}>
      <button type="button" className="button secondary" aria-label={label} aria-expanded={active === key}
        aria-controls={id + '-' + key} aria-describedby={unread[key] ? id + '-unread-' + key : undefined}
        onClick={() => setSelection(active === key ? null : { locationKey, name: key })}>
        <Icon size={20} aria-hidden="true" />
        {!!unread[key] && <span className="unread-count" aria-hidden="true">{unread[key]}</span>}
      </button>
      <span className="header-tooltip" aria-hidden="true">{label}</span>
      {!!unread[key] && <span id={id + '-unread-' + key} hidden>{unread[key]} sin leer</span>}
      <div className={'header-popover panel' + (key === 'profile' ? ' profile-popover' : '')}
        id={id + '-' + key} hidden={active !== key}>
        {active === key && (key === 'profile' ? <>
          {account.rol !== 'admin' && <Link to="/perfil" className="button secondary" onClick={() => setSelection(null)}>
            <UserRound size={17} aria-hidden="true" /> Mi Perfil
          </Link>}
          <button type="button" className="button secondary" onClick={logout}><LogOut size={17} aria-hidden="true" /> Salir</button>
        </> : <InboxPreview account={account} notifications={key === 'notifications'}
          request={key === 'notifications' ? notifications : messages} />)}
      </div>
    </div>)}
  </div>;
}
