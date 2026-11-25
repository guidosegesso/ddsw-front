import { notificationLabels } from './model';

export function inboxItem(item, notifications) {
  return {
    title: notifications ? item.titulo : item.asunto,
    date: item.fechaEnvio ?? item.fechaCreacion,
    read: notifications ? item.leida : item.leido,
    category: notifications ? notificationLabels[item.tipo] : undefined,
  };
}
