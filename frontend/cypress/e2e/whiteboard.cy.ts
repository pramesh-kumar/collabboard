describe('Whiteboard', () => {
  beforeEach(() => {
    // Mock authentication
    cy.visit('/room/test-room')
  })

  it('should display whiteboard interface', () => {
    cy.get('canvas').should('be.visible')
    cy.get('[data-testid="toolbar"]').should('be.visible')
    cy.get('[data-testid="chat-sidebar"]').should('be.visible')
  })

  it('should allow drawing on canvas', () => {
    cy.get('canvas')
      .trigger('mousedown', { clientX: 100, clientY: 100 })
      .trigger('mousemove', { clientX: 200, clientY: 200 })
      .trigger('mouseup')
    
    // Verify drawing occurred (would need canvas content verification)
  })

  it('should change brush color', () => {
    cy.get('[data-testid="color-red"]').click()
    // Verify color change in store
  })

  it('should change brush size', () => {
    cy.get('[data-testid="brush-size-slider"]').click()
    // Verify size change
  })

  it('should clear canvas', () => {
    cy.get('[data-testid="clear-button"]').click()
    // Verify canvas is cleared
  })
})