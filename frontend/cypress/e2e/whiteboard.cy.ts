describe('Whiteboard', () => {
  beforeEach(() => {
    cy.visit('/room/test-room')
  })

  it('should display whiteboard interface', () => {
    cy.get('canvas').should('be.visible')
    cy.contains('Room: test-room')
    cy.get('button').contains('Video Call').should('be.visible')
  })

  it('should allow drawing on canvas', () => {
    cy.get('canvas')
      .trigger('mousedown', { clientX: 100, clientY: 100 })
      .trigger('mousemove', { clientX: 200, clientY: 200 })
      .trigger('mouseup')
  })

  it('should change brush tools and settings', () => {
    cy.get('[data-color="#FF0000"]').click()
  })

  it('should clear canvas', () => {
    cy.get('button').contains('Clear').click()
  })

  it('should show chat sidebar', () => {
    cy.contains('Chat').should('be.visible')
    cy.get('input[placeholder="Type a message..."]').should('be.visible')
  })

  it('should send chat message', () => {
    const message = 'Hello, world!'
    cy.get('input[placeholder="Type a message..."]').type(message)
    cy.get('button[type="submit"]').click()
    cy.contains(message).should('be.visible')
  })

  it('should handle video call', () => {
    cy.get('button').contains('Video Call').click()
    cy.contains('Video Call').should('be.visible')
  })

  it('should show active users with roles', () => {
    cy.contains('Active Users:').should('be.visible')
    cy.contains('users online').should('be.visible')
  })
})