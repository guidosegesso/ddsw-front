# Código a Voluntad

Frontend de la plataforma de UTN FRBA para conectar colectivos y personas colaboradoras. Usa React, Vite, React Router, Axios y CSS en `src/styles`.

## Desarrollo local

1. Levantá el [backend](https://github.com/ddsw-mn/2026-2c-mxn-tp-backend-group-10) con su configuración de MongoDB y JWT. El registro y la aceptación de postulaciones requieren MongoDB con soporte de transacciones.
2. En este repositorio, ejecutá `npm ci` y `npm run dev`. La URL del backend por defecto es `http://localhost:3000/api`. Si usás otro servicio, copiá `.env.example` a `.env.local` y configurá `VITE_API_URL`.
3. Abrí la URL que imprime Vite. Para generar los archivos de producción, ejecutá `npm run build`.

Para un despliegue, configurá `VITE_API_URL` durante la compilación, serví `dist/` y redirigí las rutas de la aplicación a `index.html`. Si compartís el origen con Express, podés usar `VITE_API_URL=/api` y enrutar ese prefijo a la API.

## Flujos

- El ingreso usa email y contraseña para todos los roles. El formulario de registro muestra email, contraseña y los datos obligatorios del tipo de cuenta elegido. Tras el ingreso, **Mi perfil** permite completar los datos y las habilidades.
- Los colectivos pueden administrar proyectos, perfiles con cupos y fechas, avances y postulaciones. Desde cada perfil pueden buscar personas compatibles y enviar un mensaje a quienes aceptan contacto.
- Las personas colaboradoras pueden buscar proyectos por habilidades, postularse con contribución pública anónima, ver sus postulaciones, mensajes y notificaciones.

## Integración pendiente del backend

- La baja se confirma desde **Equipo del proyecto**. El colectivo dueño puede gestionar las colaboraciones activas, y la persona colaboradora puede dar de baja las propias cuando el listado las identifica. En las anónimas, la API pública omite el titular y el perfil. Para permitir la baja propia de una colaboración anónima hace falta una consulta privada de colaboraciones propias.
- La ficha de una persona consulta los datos privados a través del endpoint de contacto. La API determina si la sesión tiene acceso. **Mi perfil** usa ese endpoint para cargar los datos privados antes de editar.
- Los colectivos pueden elegir alcance nacional o provincia y localidad desde el catálogo de la API. Las ubicaciones existentes se conservan si no se editan.
- Las notificaciones muestran mensajes, resoluciones de postulaciones y oportunidades. El backend genera avisos de oportunidades en el alta de proyectos con perfiles iniciales abiertos y en el registro de personas con habilidades y consentimiento.
- El colectivo puede finalizar el proyecto desde **Administrar proyecto**. También puede cerrar búsquedas de forma individual por perfil.

## Lineamientos de UX

Los colectivos necesitan publicar búsquedas y revisar candidaturas, mientras que las personas colaboradoras necesitan encontrar un perfil compatible y postularse, también desde el celular. La navegación por rol lleva a esas tareas y el detalle del proyecto reúne perfiles, equipo y avance.

Los filtros y formularios usan controles nativos, etiquetas visibles y validación junto al campo. Los formularios conservan los datos ante errores, y las acciones muestran carga y confirmación. Los estados se distinguen con texto, el foco de teclado es visible y las acciones destructivas piden confirmación. Los catálogos ofrecen opciones precargadas, y las grillas se adaptan al ancho de pantalla. [Guía práctica de UX](https://drive.google.com/file/d/1-CXVdHlY2rALxqEFd0yXzZm7YQ9wrnQV/view)

La prueba automatizada cubre el flujo de cuenta en una ventana de 390 px. La evaluación de usabilidad con participantes externos queda pendiente.

## Pruebas E2E con Cypress

Ejecutá `npm ci` para instalar las dependencias y el navegador de Cypress.

- `npm run test:e2e` ejecuta los dos casos sin interfaz.
- `npm run test:e2e:open` abre Cypress en modo interactivo.

Cypress levanta Vite en el puerto 4175 y usa la URL de `VITE_API_URL` de `.env.local`, con la misma precedencia que en desarrollo. Las respuestas vienen de la API real. Si la variable falta, Cypress detiene la ejecución.

1. Registro de una cuenta nueva, recepción de un token de ingreso, edición del perfil, recarga y cierre de sesión.
2. Creación de una cuenta nueva con una habilidad compatible, postulación anónima desde la interfaz a un perfil abierto y verificación del estado **Pendiente** en **Mis postulaciones** después de recargar.

Cada ejecución completa crea dos cuentas con nombres que empiezan con `Cypress` y una postulación pendiente en un proyecto existente. Esos datos quedan en el entorno configurado. Los tests no dan de baja colaboraciones ni modifican cuentas existentes. Usá una API habilitada para pruebas.
