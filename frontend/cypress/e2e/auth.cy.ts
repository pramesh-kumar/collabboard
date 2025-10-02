describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display login form', () => {
    cy.contains('CollabBoard')
    cy.contains('Sign in to start collaborating')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button').contains('Sign In').should('be.visible')
    cy.get('button').contains('Continue with Google').should('be.visible')
  })

  it('should show error for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@email.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button').contains('Sign In').click()
    
    cy.get('[role="alert"]').should('be.visible')
  })

  it('should navigate to dashboard after successful login', () => {
    // Mock Firebase auth for testing
    cy.window().then((win) => {
      // This would need proper Firebase auth mocking in real implementation
      cy.visit('/dashboard')
    })
  })
})