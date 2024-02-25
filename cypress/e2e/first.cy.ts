describe('template spec', () => {
  it('Should navigate to the login page', () => {
    cy.visit('http://localhost:5173/')

    cy.get("[data-testid='cy-login']").should('exist')
  })
})
