import { Link, useNavigate } from 'react-router-dom';
import { idOf } from '../api/model';
import { useSkills } from '../hooks/useSkills';
import { ProjectForm } from '../components/projects/ProjectForm';

export function NewProjectPage() {
  const navigate = useNavigate();
  const catalog = useSkills();
  return <section className="narrow">
    <Link className="back-link" to="/mis-proyectos">← Mis proyectos</Link>
    <h1>Nuevo proyecto</h1>
    <p className="muted">Agregá un perfil inicial con búsqueda abierta para que el sistema pueda avisar a personas compatibles al publicar.</p>
    <div className="panel"><ProjectForm catalog={catalog} saved={project => navigate('/proyectos/' + idOf(project), {
      replace: true, state: { message: 'Proyecto creado. Ya podés agregar perfiles.' },
    })} /></div>
  </section>;
}
