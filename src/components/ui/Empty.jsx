import { Inbox } from 'lucide-react';

export function Empty({ children }) {
  return <div className="empty"><Inbox size={28} aria-hidden="true" /><p>{children}</p></div>;
}
