import { Notice } from './Notice';

export function Feedback({ action }) {
  return <><Notice error>{action.error}</Notice><Notice>{action.success}</Notice></>;
}
