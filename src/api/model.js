export const tipos = {
  FUNDACION: 'Fundación', ASOCIACION_BARRIAL: 'Asociación barrial', ONG: 'ONG', ASAMBLEA: 'Asamblea',
};
export const modalidades = {
  GRATUITA: 'Voluntaria', INCENTIVO_ECONOMICO: 'Con incentivo económico',
  CONTRATACION_EVENTUAL: 'Contratación eventual',
};
export const compromisos = {
  HORAS_TOTALES: 'Horas totales', HORAS_SEMANALES: 'Horas semanales', HORAS_MENSUALES: 'Horas mensuales',
};
export const estados = {
  ABIERTO: 'Abierto', FINALIZADO: 'Finalizado', PENDIENTE: 'Pendiente',
  ACEPTADA: 'Aceptada', RECHAZADA: 'Rechazada',
};
export const idOf = item => typeof item === 'object' ? item?._id ?? item?.id : item;
export const personName = person => person?.nombreFantasia || 'Persona colaboradora';
export const notificationLabels = {
  MENSAJE: 'Mensaje', POSTULACION: 'Postulación', OPORTUNIDAD: 'Oportunidad',
};
export const profileAnchor = id => 'perfil-' + id;
export const collaboratorPath = (projectId, personId) => '/proyectos/' + projectId + '/colaboradoras/' + personId;
export const profilePath = account => account.rol === 'colectivo'
  ? '/colectivos/' + account.colectivoId : '/colaboradoras/' + account.personaColaboradoraId;
export const isOpen = (project, profile) => project.estado === 'ABIERTO' &&
  profile.busquedaAbierta !== false && (!profile.fechaCierreBusqueda || new Date(profile.fechaCierreBusqueda) > new Date());
