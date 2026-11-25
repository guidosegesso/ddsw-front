import { Link } from 'react-router-dom';
import { estados } from '../../api/model';
import { Notice } from '../ui/Notice';

export function ApplicationStatus({ state = 'PENDIENTE', confirmation }) {
  return <div className="stack">
    <Notice>{confirmation || 'Postulación enviada · ' + (estados[state] ?? estados.PENDIENTE)}</Notice>
    <Link className="text-link" to="/postulaciones">Ver mis postulaciones →</Link>
  </div>;
}
