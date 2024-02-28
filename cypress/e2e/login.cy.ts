describe('Basic testes', () => {
  beforeEach(() => {
    cy.intercept(
      'https://dev-plander-org.koyeb.app/api/associations?limit=4&projection=lite&q=',
    ).as('getAssociations')
    cy.visit('http://localhost:5173/')
  })
  it('Should navigate to the login page', () => {
    cy.get("[data-testid='cy-login']").should('exist')
  })

  it('Should exist associations', () => {
    cy.on('uncaught:exception', (err, runnable) => {
      return false
    })

    cy.wait('@getAssociations')
  })
})
