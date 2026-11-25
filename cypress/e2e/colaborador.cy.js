const STEP_DELAY_MS = 2000;

function api(path) {
  return Cypress.expose('apiUrl') + path;
}

function newAccount() {
  const id = crypto.randomUUID();
  return {
    credentials: { email: 'cypress-' + id + '@example.test', password: 'E2e-' + id },
    nombreFantasia: 'Cypress ' + id.slice(0, 8),
  };
}

function showStep(message) {
  if (!Cypress.config('isInteractive')) return;

  cy.log(message);
  cy.wait(STEP_DELAY_MS, { log: false });
}

function fillCredentials(credentials) {
  cy.get('input[name="email"]').clear().type(credentials.email);
  cy.get('input[name="password"]').type(credentials.password, { log: false });
}

function checkLogin() {
  cy.wait('@ingreso').then(({ response }) => {
    expect(response.statusCode).to.equal(200);
    const token = response.body.data.accessToken;
    expect(typeof token === 'string' && token.trim().length > 0, 'la API devuelve un token').to.equal(true);
  });
}

function isAvailable(profile) {
  return profile.busquedaAbierta && profile.habilidadesRequeridas?.length
    && (!profile.fechaCierreBusqueda || Date.parse(profile.fechaCierreBusqueda) > Date.now());
}

function findOpenProfile(page = 1) {
  return cy.request(api('/proyectos?page=' + page)).then(({ body }) => {
    const candidates = body.data.filter(project => project.estado === 'ABIERTO'
      && project.perfiles?.some(isAvailable));

    function checkCandidate(index) {
      if (index < candidates.length) {
        return cy.request(api('/proyectos/' + candidates[index]._id)).then(({ body }) => {
          const project = body.data;
          const profile = project.estado === 'ABIERTO' && project.perfiles?.find(item => item._id && isAvailable(item));
          return profile ? { project, profile } : checkCandidate(index + 1);
        });
      }
      if (body.paginacion?.haySiguiente) return findOpenProfile(page + 1);
      throw new Error('La API de pruebas necesita al menos un proyecto abierto con un perfil vigente y habilidades requeridas.');
    }

    return checkCandidate(0);
  });
}

describe('Flujos de la persona colaboradora contra la API real', () => {
  before(() => {
    cy.request(api('/habilidades?page=1'));
  });

  beforeEach(() => {
    cy.intercept('POST', api('/auth/login')).as('ingreso');
  });

  it('registra una cuenta nueva, recibe un token y guarda el perfil', () => {
    const { credentials, nombreFantasia } = newAccount();
    const presentacion = 'Perfil registrado por la prueba E2E de Cypress.';
    cy.intercept('POST', api('/auth/registro')).as('registro');
    cy.intercept({ method: 'PUT', url: api('/colaboradoras/*') }).as('guardarPerfil');

    cy.viewport(390, 844);
    cy.visit('/perfil');
    cy.location('pathname').should('eq', '/ingresar');
    showStep('Una pantalla privada redirige al ingreso');

    cy.contains('a', 'Registrate').click();
    cy.get('input[name="rol"][value="colaborador"]').should('be.checked');
    cy.get('input[name="nombreFantasia"]').should('be.visible');
    cy.contains('button', 'Crear cuenta').click();
    cy.contains('.notice.error[role="alert"]', 'Completá los campos obligatorios').should('be.visible');
    cy.get('input[name="email"]').type('nico@localhost').blur();
    cy.contains('[role="alert"]', 'Ingresá un email válido').should('be.visible');
    cy.get('@registro.all').should('have.length', 0);
    showStep('El formulario señala los campos obligatorios y el email inválido');

    fillCredentials(credentials);
    cy.get('input[name="nombreFantasia"]').type(nombreFantasia);
    cy.contains('button', 'Crear cuenta').click();
    cy.wait('@registro').its('response.statusCode').should('eq', 201);
    checkLogin();
    cy.location('pathname').should('eq', '/perfil');
    cy.get('input[readonly][type="email"]').should('have.value', credentials.email);
    showStep('La API crea la cuenta y el ingreso devuelve un token');

    cy.get('textarea[name="presentacion"]').type(presentacion);
    cy.contains('button', 'Guardar cambios').click();
    cy.wait('@guardarPerfil').its('response.statusCode').should('eq', 200);
    cy.contains('Guardamos los cambios de tu perfil.').should('be.visible');
    cy.reload();
    cy.get('textarea[name="presentacion"]').should('have.value', presentacion);
    showStep('El perfil conserva los cambios tras volver a consultarlo');

    cy.get('button[aria-label="Cuenta"]').click();
    cy.contains('button', 'Salir').click();
    cy.location('pathname').should('eq', '/ingresar');
    showStep('Cerrar sesión vuelve a la pantalla de ingreso');
  });

  it('se postula a un perfil real y ve el estado Pendiente después de recargar', () => {
    const { credentials, nombreFantasia } = newAccount();

    findOpenProfile().then(({ project, profile }) => {
      const projectPath = '/proyectos/' + project._id;
      cy.request({
        method: 'POST',
        url: api('/auth/registro'),
        body: {
          ...credentials, rol: 'colaborador',
          perfil: { nombreFantasia, habilidades: [profile.habilidadesRequeridas[0]], aceptaContacto: false },
        },
        retryOnNetworkFailure: false,
        log: false,
      }).its('status').should('eq', 201);
      cy.intercept('POST', api(projectPath + '/perfiles/' + profile._id + '/postulaciones')).as('postular');

      cy.visit('/ingresar');
      fillCredentials(credentials);
      cy.contains('form button', 'Ingresar').click();
      checkLogin();
      cy.contains('nav a', 'Mis postulaciones').click();
      cy.contains('Todavía no te postulaste a ningún perfil.').should('be.visible');
      showStep('La cuenta de prueba todavía no tiene postulaciones');

      cy.visit(projectPath);
      cy.get('#perfil-' + profile._id).within(() => {
        cy.contains('Búsqueda abierta').should('be.visible');
        cy.get('input[name="anonima"]').check();
        showStep('Se elige el perfil abierto y la contribución anónima');
        cy.contains('button', 'Enviar postulación').click();
        cy.contains('Enviamos tu postulación.').should('be.visible');
      });
      cy.wait('@postular').then(({ request, response }) => {
        expect(request.body.contribucionAnonima).to.equal(true);
        expect(response.statusCode).to.equal(201);
        expect(response.body.data.estado).to.equal('PENDIENTE');
      });

      cy.contains('nav a', 'Mis postulaciones').click();
      cy.location('pathname').should('eq', '/postulaciones');
      cy.contains('h2', project.titulo).should('be.visible');
      cy.reload();
      cy.contains('h2', project.titulo).closest('article').within(() => {
        cy.contains('Pendiente').should('be.visible');
        cy.contains('Contribución anónima').should('be.visible');
        cy.contains('a', 'Ver proyecto').should('have.attr', 'href', projectPath);
      });
      showStep('La API conserva la postulación pendiente después de recargar');
    });
  });
});
