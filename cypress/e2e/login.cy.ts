describe('Login page test', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => {
      return false
    })
  })
  it('Should navigate to the login page if no logged user', () => {
    cy.visit('http://localhost:5173/')
    cy.get("[data-testid='cy-login']").should('exist')
  })

  it('Should run associations fetch on render', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'https://dev-plander-org.koyeb.app/api/associations?offset=0&limit=4&projection=lite&q=',
      },
      [],
    ).as('getAssociations')

    cy.visit('http://localhost:5173/')

    cy.wait('@getAssociations').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200)
      expect(interception.response?.body).to.be.an('array')
    })
  })

  it('Should throw error if no credentials given', () => {
    cy.visit('http://localhost:5173/login')
    cy.get('[data-testid="cy-logBtn"]').click()
    cy.url().should('include', '/login')
  })
})
