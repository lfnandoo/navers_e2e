/// <reference types="cypress" />

describe("Operations", () => {
  it("should have logged in", () => {
    cy.visit("https://navers-test-lfnandoo.vercel.app/");

    cy.get("[data-cy=email").type("testing-user@nave.rs");
    cy.get("[data-cy=password").type("nave1234");

    cy.server();
    cy.route("POST", "**/v1/users/login").as("postLogin");

    cy.get("[data-cy=submit").click();

    cy.wait("@postLogin").then(({ status, response }) => {
      expect(status).be.equal(200);
      expect(response.body).has.property("id");
      expect(response.body).has.property("token");
      expect(response.body.id).is.not.null;
      expect(response.body.token).is.not.null;
    });
  });
});
