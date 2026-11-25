import { useEffect, useRef } from 'react';
import { CodeXml } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../auth/Session';
import { HeaderActions } from './HeaderActions';

export function Layout() {
  const { account, logout } = useSession();
  const { pathname, hash } = useLocation();
  const content = useRef(null);

  useEffect(() => {
    if (hash) return;
    content.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="site-header">
      <div className="shell header-content">
        <Link to="/" className="brand"><span><CodeXml size={23} aria-hidden="true" /></span> Código a Voluntad</Link>
        <nav aria-label="Navegación principal" className="nav-links">
          <NavLink to="/" end>Explorar</NavLink>
          {account?.rol === 'colectivo' && <><NavLink to="/mis-proyectos">Mis proyectos</NavLink><NavLink to="/colaboradoras">Colaboradoras</NavLink></>}
          {account?.rol === 'colaborador' && <NavLink to="/postulaciones">Mis postulaciones</NavLink>}
        </nav>
        <div className="account-links">
          {account ? <HeaderActions key={account.id} account={account} logout={logout} /> : <>
            <Link className="button secondary" to="/ingresar">Ingresar</Link>
            <Link className="button primary" to="/registro">Crear cuenta</Link>
          </>}
        </div>
      </div>
    </header>
    <main className="shell main" id="contenido" tabIndex={-1} ref={content}><Outlet /></main>
    <footer className="site-footer"><div className="shell footer-content"><strong>Código a Voluntad</strong><span>UTN FRBA · Desarrollo de Software</span></div></footer>
  </>;
}
