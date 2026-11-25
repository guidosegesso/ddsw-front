import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './auth/PrivateRoute';
import { SessionProvider } from './auth/Session';
import { Layout } from './components/Layout';
import { AccountPage } from './pages/Account';
import { ProfilePage } from './pages/Profile';
import { ApplicationsPage } from './pages/Applications';
import { CollaboratorPage } from './pages/Collaborator';
import { InboxPage } from './pages/Inbox';
import { PeoplePage } from './pages/People';
import { ProjectDetailPage } from './pages/ProjectDetail';
import { NewProjectPage } from './pages/NewProject';
import { ProjectsPage } from './pages/Projects';

export function App() {
  return <BrowserRouter>
    <SessionProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<ProjectsPage />} />
          <Route path="ingresar" element={<AccountPage key="login" />} />
          <Route path="registro" element={<AccountPage key="register" register />} />
          <Route path="proyectos/:id" element={<ProjectDetailPage />} />
          <Route path="proyectos/:id/avance" element={<ProjectDetailPage progress />} />
          <Route path="proyectos/:projectId/colaboradoras/:personId" element={<CollaboratorPage />} />
          <Route element={<PrivateRoute roles={['colectivo', 'colaborador']} />}>
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="mensajes" element={<InboxPage key="messages" />} />
          </Route>
          <Route element={<PrivateRoute roles={['colaborador']} />}>
            <Route path="postulaciones" element={<ApplicationsPage />} />
            <Route path="notificaciones" element={<InboxPage key="notifications" notifications />} />
          </Route>
          <Route element={<PrivateRoute roles={['colectivo']} />}>
            <Route path="mis-proyectos" element={<ProjectsPage key="mine" mine />} />
            <Route path="proyectos/nuevo" element={<NewProjectPage />} />
            <Route path="colaboradoras" element={<PeoplePage />} />
          </Route>
          <Route path="*" element={<section className="panel"><h1>Página no encontrada</h1>
            <Link to="/" className="text-link">Volver a explorar proyectos →</Link></section>} />
        </Route>
      </Routes>
    </SessionProvider>
  </BrowserRouter>;
}
