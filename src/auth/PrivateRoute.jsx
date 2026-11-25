import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RequestState } from '../components/ui/RequestState';
import { useSession } from './Session';

export function PrivateRoute({ roles }) {
  const session = useSession();
  const location = useLocation();
  if (session.loading || session.error) return <RequestState request={session} />;
  if (!session.account) return <Navigate to="/ingresar" state={{ from: location.pathname + location.search }} replace />;
  if (roles && !roles.includes(session.account.rol)) return <Navigate to="/" replace />;
  return <Outlet />;
}
