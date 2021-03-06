/// <reference types="cypress" />

describe("Operations", () => {
  it("should have logged in", () => {
    cy.visit("https://navers-test-lfnandoo.vercel.app/");

    cy.get("[data-cy=email]").type("testing-user@nave.rs");
    cy.get("[data-cy=password]").type("nave1234");

    cy.route("POST", "**/v1/users/login").as("postLogin");

    cy.get("[data-cy=submit]").click();

    cy.wait("@postLogin").then(({ status, response }) => {
      expect(status).be.equal(200);
      expect(response.body).has.property("id");
      expect(response.body).has.property("token");
      expect(response.body.id).is.not.null;
      expect(response.body.token).is.not.null;
      expect(localStorage.getItem("@Navers:token")).be.equal(
        response.body.token
      );
      expect(localStorage.getItem("@Navers:id")).be.equal(response.body.id);
    });
  });

  it("should create naver card", () => {
    cy.login();
    cy.get('[data-cy="create-naver"]').click();

    cy.get('[data-cy="name"]')
      .type("Fernando")
      .should("have.value", "Fernando");
    cy.get('[data-cy="job_role"]')
      .type("Frontend Developer")
      .should("have.value", "Frontend Developer");
    cy.get('[data-cy="birthdate"]')
      .type("2003-10-07")
      .should("have.value", "2003-10-07");
    cy.get('[data-cy="admission_date"]')
      .type("2015-07-05")
      .should("have.value", "2015-07-05");
    cy.get('[data-cy="project"]')
      .type("Naver Test")
      .should("have.value", "Naver Test");
    cy.get('[data-cy="url"]')
      .type("https://google.com")
      .should("have.value", "https://google.com");

    cy.route("POST", "**/navers").as("postNewNaverCard");

    cy.get("[data-cy=submit]").click();

    cy.wait("@postNewNaverCard").then(({ status }) => {
      expect(status).be.equal(200);

      cy.get("[data-cy=modal]").should("have.length", true);
    });
  });

  it("should edit naver card", () => {
    cy.login();
    cy.createNaver();
    cy.visit(
      `https://navers-test-lfnandoo.vercel.app/edit/${Cypress.env("cardId")}`
    );

    cy.get('[data-cy="birthdate"]')
      .type("2003-10-01")
      .should("have.value", "2003-10-01");
    cy.get('[data-cy="admission_date"]')
      .type("2015-07-05")
      .should("have.value", "2015-07-05");

    cy.route("PUT", `**/navers/${Cypress.env("cardId")}`).as(
      "putEditNaverCard"
    );

    cy.get("[data-cy=edit]").click();

    cy.wait("@putEditNaverCard").then(({ status }) => {
      expect(status).be.equal(200);

      cy.get("[data-cy=modal]").should("have.length", true);
    });
  });

  it("should delete card", () => {
    cy.login();
    cy.createNaver();

    cy.get(`[data-cy=${Cypress.env("cardId")}]`).click();

    cy.route("DELETE", `**/navers/${Cypress.env("cardId")}`).as(
      "deleteNaverCard"
    );

    cy.get("[data-cy=delete]").click();

    cy.wait("@deleteNaverCard").then(({ status }) => {
      expect(status).be.equal(200);

      cy.get("[data-cy=modal]").should("have.length", true);
    });
  });

  it("should logout", () => {
    cy.login();
    cy.get("[data-cy=leave]").click();
  });
});
