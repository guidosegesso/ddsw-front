import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { idOf } from '../../api/model';
import { Empty } from '../ui/Empty';
import { Notice } from '../ui/Notice';
import { RequestState } from '../ui/RequestState';
import { SafeLink } from '../ui/SafeLink';
import { useRequest } from '../../hooks/useRequest';
import { MilestoneForm } from './MilestoneForm';
import { ItemEditor } from './ItemEditor';

export function ProjectProgress({ path, owner }) {
  const milestones = useRequest(path, {}, true);
  const [feedback, setFeedback] = useState('');

  function updated() {
    setFeedback('Actualizamos el avance del proyecto.');
    milestones.reload();
  }

  return <section className="stack">
    <h2>Avance del proyecto</h2>
    <Notice>{feedback}</Notice>
    {owner && <details className="panel project-control"><summary className="button secondary"><BarChart3 size={17} aria-hidden="true" /> Registrar avance</summary>
      <div className="subsection"><MilestoneForm path={path} saved={updated} /></div>
    </details>}
    <RequestState request={milestones}>
      {!milestones.data?.length && <Empty>Todavía no se registraron avances.</Empty>}
      {milestones.data?.map(item => <article className="panel stack" key={idOf(item)}>
        <h3>{item.porcentajeConcrecion}% completado</h3>
        <progress value={item.porcentajeConcrecion} max="100" aria-label="Porcentaje de avance" />
        {!!item.hitos?.length && <ul>{item.hitos.map((hito, index) => <li key={index}>{hito}</li>)}</ul>}
        <div className="actions">
          <SafeLink href={item.linkCodigo}>Repositorio público</SafeLink>
          <SafeLink href={item.linkSistema}>Ver sistema en producción</SafeLink>
        </div>
        {owner && <ItemEditor path={path} item={item} updated={updated} label="avance">
          <MilestoneForm path={path} milestone={item} saved={updated} />
        </ItemEditor>}
      </article>)}
    </RequestState>
  </section>;
}
