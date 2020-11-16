// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: "https://navedex-api.herokuapp.com/v1/users/login",
    body: {
      email: "testing-user@nave.rs",
      password: "nave1234"
    }
  }).then(({ body }) => {
    expect(body.token).is.not.null;
    expect(body.id).is.not.null;

    Cypress.env("userToken", body.token);
    Cypress.env("userId", body.id);
  });

  cy.visit("https://navers-test-lfnandoo.vercel.app/home", {
    onBeforeLoad: (browser) => {
      browser.localStorage.setItem("@Navers:token", Cypress.env("userToken"));
      browser.localStorage.setItem("@Navers:id", Cypress.env("userId"));
    }
  });
});

Cypress.Commands.add("createNaver", () => {
  cy.request({
    method: "POST",
    url: "https://navedex-api.herokuapp.com/v1/navers",
    headers: {
      authorization: `Bearer ${Cypress.env("userToken")}`
    },
    body: {
      job_role: "Frontend Developer",
      admission_date: "12/04/2018",
      birthdate: "12/04/1992",
      project: "Pojeto",
      name: "Testing",
      url: "https://google.com"
    }
  }).then(({ status, body }) => {
    expect(status).be.equal(200);
    expect(body.id).is.not.null;

    Cypress.env("cardId", body.id);
  });
});
